# Dépôt du serveur Python qui lance OpenFisca pour la détection de l'éligibilité à la prime d'activité


```bash
pip install flask pandas black openfisca-france-data openfisca-survey-manager adbc_driver_postgresql PyArrow
FLASK_DEBUG=1 FLASK_RUN_PORT=8000 FLASK_APP=main.py flask run
```

## config

- Depuis la racine du projet créer un fichier `.config/openfisca-survey-manager/config.ini` et y renseigner les chemins de config d'après le fichier `example_config.ini`
- Initialiser un fichier `dsn.json` à l'endroit spécifié dans le config.ini de la manière suivante :

```
{
  "name": "dsn",
  "surveys": {}
}
```
