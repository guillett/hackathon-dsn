# Dépôt du serveur Python qui lance OpenFisca pour la détection de l'éligibilité à la prime d'activité


```bash
pip install flask pandas black openfisca-france-data openfisca-survey-manager adbc_driver_postgresql PyArrow
FLASK_DEBUG=1 FLASK_RUN_PORT=8000 FLASK_APP=main.py flask run
```
