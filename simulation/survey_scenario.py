import logging
import os

from openfisca_survey_manager.scenarios.abstract_scenario import AbstractSurveyScenario
from openfisca_survey_manager.survey_collections import SurveyCollection
from simulation.tax_benefits_system import create_tbs

from simulation import root_path

log = logging.getLogger(__name__)

admissible_simulation_prefix = [
    "baseline",
]

tax_benefit_system = create_tbs()

config_files_directory = os.path.join(root_path, ".config", "openfisca-survey-manager")

# config_files_directory = '/home/cgl/leximpact/hackathon_dsn/hackathon_dsn/.config/openfisca-survey-manager/'

input_variables = [
    "idfam",
    "idfoy",
    "idmen",
    "quifam",
    "quifoy",
    "quimen",
    "salaire_net",
    "id_assure",
]


class DsnSurveyScenario(AbstractSurveyScenario):
    """Survey scenario spécialisé pour l'ERFS-FPR utilisée par Leximpact."""

    used_as_input_variables = input_variables
    id_variable_by_entity_key = dict(
        famille="idfam",
        foyer_fiscal="idfoy",
        menage="idmen",
    )

    role_variable_by_entity_key = dict(
        famille="quifam",
        foyer_fiscal="quifoy",
        menage="quimen",
    )

    def __init__(
        self,
        config_files_directory: str = config_files_directory,
        annee_donnees="2023-05",
        period="2023-05",
        tax_benefit_systems={"baseline": tax_benefit_system},
        collection: str = "dsn",
        survey_name: str = None,
    ):

        self.collection = collection
        self.annee_donnees = annee_donnees
        self.period = period

        self.set_tax_benefit_systems(
            tax_benefit_systems=tax_benefit_systems,
        )

        if survey_name is None:
            survey_name = f"{collection}_{annee_donnees}"

        # Création de la base de données sur les périodes voulues
        survey_collection = SurveyCollection.load(
            collection=collection, config_files_directory=config_files_directory
        )
        survey = survey_collection.get_survey(survey_name)

        data = {"input_data_table_by_entity_by_period": {}, "survey": survey_name}
        data["config_files_directory"] = config_files_directory

        for month in ["2023-05", "2023-04", "2023-03"]:
            if data["input_data_table_by_entity_by_period"].get(month) is None:
                data["input_data_table_by_entity_by_period"][month] = {}
            for table_name, _ in survey.tables.items():
                current_month = table_name[-7:]
                entity = table_name[:-8]
                if current_month == month:
                    data["input_data_table_by_entity_by_period"][month][
                        entity
                    ] = table_name

        self.data = data

        self.init_from_data(
            data=data,
            rebuild_input_data=False,
        )
