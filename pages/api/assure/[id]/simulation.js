import { baseUrl } from "../../../../lib/mes-aides";
import { fetchAssureDetails } from "../../../../lib/fetch-dsn";

const mapping = {
  date_naissance: (value) =>
    `${value.slice(4)}-${value.slice(2, 2)}-${value.slice(0, 2)}`,
  nationalite: (value) => {
    if (value == "01") {
      return "FR";
    } else if (value == "02") {
      return "DE";
    } else if (value == "03") {
      return "NO";
    } else {
      return "AF";
    }
  },
};

export default async function handler(req, res) {
  // récupère des données DSN
  // crée une simulation MA avec les données et un téléservice ?
  // redirige vers MA
  try {
    const demandeurAnswer = (fieldName, value) => ({
      entityName: "individu",
      id: "demandeur",
      fieldName,
      value,
    });
    const details = await fetchAssureDetails(req.query.id);
    const response = await fetch(`${baseUrl}/api/simulation`, {
      method: "POST",
      body: JSON.stringify({
        dateDeValeur: new Date(),
        answers: {
          current: [],
          all: [
            demandeurAnswer("_dsn", req.query),
            ...(details.date_naissance
              ? [
                  demandeurAnswer(
                    "date_naissance",
                    mapping.date_naissance(details.date_naissance),
                  ),
                ]
              : []),
            ...(details.codification_ue
              ? [
                  demandeurAnswer(
                    "nationalite",
                    mapping.nationalite(details.codification_ue),
                  ),
                ]
              : []),
            demandeurAnswer("activite", "salarie"),
            demandeurAnswer("alternant", false),
            demandeurAnswer("_agence_travail_temporaire", true),
            demandeurAnswer("_nombreMoisDebutContratDeTravail", 2),
            demandeurAnswer("regime_securite_sociale", "regime_general"),
            demandeurAnswer("ressources", ["salaire_net"]),
            demandeurAnswer("revenusActivite", [
              {
                id: "salaire_net",
                amounts: details.salaires,
              },
            ]),
          ],
        },
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const simulation = await response.json();
    res.redirect(
      `${baseUrl}/api/simulation/${simulation._id}/redirect?token=${simulation.token}`,
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
}
