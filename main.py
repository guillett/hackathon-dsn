from flask import jsonify, Flask, request, redirect, send_file, session
import uuid

import pandas as pd

from openfisca_survey_manager.input_dataframe_generator import set_table_in_survey

# from hackathon_dsn.survey_scenario import config_files_directory
from adbc_driver_postgresql import dbapi
import os

from simulation.survey_scenario import DsnSurveyScenario

application = Flask(__name__)


@application.route("/")
def index():
    return jsonify({"message": "ok"})


def get_file_path(id):
    return f"/media/veracrypt3/files-python/{id}"


@application.route("/entreprise/<siren>/fetch")
def fetch(siren):
    id = uuid.uuid4()
    prepare_data(siren, id)

    return jsonify({"siren": siren, "action": "fetch", "id": id})


def prepare_data(siren, id):
    # postgres://[user]:[pwd]@10.0.0.1:5432/dsn
    current_dir = os.getcwd()
    with open("/media/veracrypt3/db-access", "r") as o:
        constr = o.read()
    conn = dbapi.connect(constr)
    data = pd.read_sql(
        f"""select ids.*,
	    vers_mai.remuneration_nette_fiscale mai,
	    vers_avril.remuneration_nette_fiscale avril,
	    vers_mars.remuneration_nette_fiscale mars
	    from
        (
        select id_assure
        from (
        	select * from dadeh.ddadtversement where mois_declaration = '2023-05-01'
        ) vers
        inner join (
        	select assoc.* from
        		dadeh.ddadtemployeur emp
        		inner join dadeh.ddadtemployeur_assure assoc on assoc.id_employeur = emp.id
        		inner join dadeh.ddadtassure assur on assoc.id_assure = assur.id
        --		where emp.en_code_apen = '7820Z'
        	) assoc on assoc.id = vers.id_employeur_assure and assoc.id_employeur = {siren}
        group by id_assure
        ) ids
        left join (
        	select id_assure, sum(remuneration_nette_fiscale) remuneration_nette_fiscale
        	from dadeh.ddadtversement vv
        	inner join dadeh.ddadtemployeur_assure assoc on assoc.id = vv.id_employeur_assure
        	where mois_declaration = '2023-05-01'
        	group by id_assure
        	) vers_mai on ids.id_assure = vers_mai.id_assure
        left join (
        	select id_assure, sum(remuneration_nette_fiscale) remuneration_nette_fiscale
        	from dadeh.ddadtversement vv
        	inner join dadeh.ddadtemployeur_assure assoc on assoc.id = vv.id_employeur_assure
        	where mois_declaration = '2023-04-01'
        	group by id_assure
        	) vers_avril on ids.id_assure = vers_avril.id_assure
        left join (
        	select id_assure, sum(remuneration_nette_fiscale) remuneration_nette_fiscale
        	from dadeh.ddadtversement vv
        	inner join dadeh.ddadtemployeur_assure assoc on assoc.id = vv.id_employeur_assure
        	where mois_declaration = '2023-03-01'
        	group by id_assure
        	) vers_mars on ids.id_assure = vers_mars.id_assure""",
        conn,
    )
    data = data.reset_index().fillna(0)[["id_assure", "mai", "avril", "mars"]]
    data["idfam"] = range(len(data))
    data["idfoy"] = range(len(data))
    data["idmen"] = range(len(data))
    data["quifam"] = data.idfam * 0
    data["quifoy"] = data.idfoy * 0
    data["quimen"] = data.idmen * 0

    wd = os.getcwd()
    config_files_directory = os.path.join(wd, ".config", "openfisca-survey-manager")

    collection = "dsn"
    survey_name = f"dsn_{id}_2023-05"
    for period in ["2023-05", "2023-04", "2023-03"]:
        if period == "2023-05":
            individus = data.drop(["mars", "avril"], axis=1).rename(
                columns={"mai": "salaire_net"}
            )
        elif period == "2023-04":
            individus = data.drop(["mars", "mai"], axis=1).rename(
                columns={"avril": "salaire_net"}
            )
        elif period == "2023-03":
            individus = data.drop(["avril", "mai"], axis=1).rename(
                columns={"mars": "salaire_net"}
            )
        individus = individus.fillna(0)
        foyer_fiscaux = pd.DataFrame(individus)[["idfoy"]]
        familles = pd.DataFrame(individus)[["idfam"]]
        menages = pd.DataFrame(individus)[["idmen"]]
        set_table_in_survey(
            individus,
            entity="individu",
            period=period,
            collection=collection,
            survey_name=survey_name,
            config_files_directory=config_files_directory,
        )

        set_table_in_survey(
            menages,
            entity="menage",
            period=period,
            collection=collection,
            survey_name=survey_name,
            config_files_directory=config_files_directory,
        )

        set_table_in_survey(
            familles,
            entity="famille",
            period=period,
            collection=collection,
            survey_name=survey_name,
            config_files_directory=config_files_directory,
        )

        set_table_in_survey(
            foyer_fiscaux,
            entity="foyer_fiscal",
            period=period,
            collection=collection,
            survey_name=survey_name,
            config_files_directory=config_files_directory,
        )


@application.route("/entreprise/<siren>/compute/<id>")
def compute(siren, id):
    simulation = DsnSurveyScenario(collection="dsn", survey_name=f"dsn_{id}_2023-05")
    simul = simulation.simulations["baseline"].create_data_frame_by_entity(
        ["ppa", "id_assure"], period="2023-06", merge=True
    )
    simul = simul.loc[simul.ppa > 0][["id_assure", "ppa"]]
    simul.to_hdf(f"//media/veracrypt3/files-openfisca/simulation_{id}.h5", key="data")
    return simul.to_json(orient="records")


@application.route("/entreprise/cache/<id>/<id_assure>")
def compute_assure(id, id_assure):
    simul = pd.read_hdf(
        f"//media/veracrypt3/files-openfisca/simulation_{id}.h5", "data"
    )
    simul = simul.loc[simul.id_assure == int(id_assure)]
    return simul.to_json(orient="records")
