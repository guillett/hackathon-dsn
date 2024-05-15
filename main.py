from flask import jsonify, Flask, request, redirect, send_file, session
import uuid

import pandas as pd

import os

application = Flask(__name__)
data = pd.read_hdf("/media/veracrypt3/test")

@application.route("/")
def index():
    return jsonify({"message": "ok"})


def get_file_path(id):
    return f"/media/veracrypt3/files-python/{id}"


@application.route("/entreprise/<siren>/fetch")
def fetch(siren):
    id = uuid.uuid4()
    data[data.id_employeur == int(siren)].to_hdf(get_file_path(id), key="data")
    return jsonify({"siren": siren, "action": "fetch", "id": id})


@application.route("/entreprise/<siren>/compute/<id>")
def compute(siren, id):
    df = pd.read_hdf(get_file_path(id))
    #     return [
    #   {
    #     nom: "Joe",
    #     prenom: "Doe",
    #     id: "ok",
    #     email: "j@d.ok",
    #     ppa: 120,
    #   },
    # ];
    return jsonify([{"nom": "Doe", "prenom": "John", "id": "jd", "email": "j@d.oe", "ppa": 123}])
