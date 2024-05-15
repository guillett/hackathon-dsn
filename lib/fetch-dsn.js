import entreprises from "/media/veracrypt3/entreprises.json";

import pg from "pg";
const { Client } = pg;
import fs from "fs";
//98fd82c410
const connectionString = fs.readFileSync("/media/veracrypt3/db-access", "utf8");

const queryEntreprises = `
select assoc.id_employeur siret, count(*) count_assures
from dadeh.ddadtversement vv
  inner join dadeh.ddadtemployeur_assure assoc on vv.id_employeur_assure = assoc.id
  inner join dadeh.ddadtemployeur emp on emp.id = assoc.id_employeur
  where vv.mois_declaration = '2023-05-01'
group by assoc.id_employeur
order by count(*), assoc.id_employeur
`;

async function getData(query) {
  const client = new Client({
    connectionString,
  });
  await client.connect();
  const result = await client.query(query);
  client.end();
  return result.rows;
}

function limitData(items) {
  const n = 3;
  const subset = [
    ...items.slice(0, n),
    {},
    ...items.slice(items.length / 2, items.length / 2 + n),
    {},
    ...items.slice((items.length * 3) / 4, (items.length * 3) / 4 + n),
    {},
    ...items.slice(items.length - n, items.length),
  ];

  return {
    total: items.length,
    subset,
  };
}

export async function fetchEntreprise(id) {
  return (
    await getData(`
select assoc.id_employeur siret, count(*) count_assures
from dadeh.ddadtversement vv
  inner join dadeh.ddadtemployeur_assure assoc on vv.id_employeur_assure = assoc.id
  inner join dadeh.ddadtemployeur emp on emp.id = assoc.id_employeur
  where vv.mois_declaration = '2023-05-01' and assoc.id_employeur = '${id}'
group by assoc.id_employeur
order by count(*), assoc.id_employeur
`)
  )[0];
}

export async function fetchEntreprises() {
  const entreprises = await getData(queryEntreprises);
  return limitData(entreprises);
}

const pythonBaseUrl = "http://localhost:8000";
export async function fetchAssures(siren) {
  const fetchResponse = await fetch(
    `${pythonBaseUrl}/entreprise/${siren}/fetch`,
  );
  const fetchData = await fetchResponse.json();
  const computeResponse = await fetch(
    `${pythonBaseUrl}/entreprise/${siren}/compute/${fetchData.id}`,
  );
  const computeResults = await computeResponse.json();
  return computeResults;
}

export async function fetchAssure(id, runId) {
  const response = await fetch(
    `${pythonBaseUrl}/entreprise/cache/${runId}/${id}`,
  );
  const data = await response.json();
  return {
    nom: "Doe",
    prenom: "John",
    ...data[0],
  };
}

export async function fetchAssureDetails(id) {
  const query = `
select to_char(vv.mois_declaration + interval '1 year', 'YYYY-MM') mois_declaration, sum(remuneration_nette_fiscale) remuneration_nette_fiscale
from dadeh.ddadtversement vv
  inner join dadeh.ddadtemployeur_assure assoc on vv.id_employeur_assure = assoc.id
  inner join dadeh.ddadtemployeur emp on emp.id = assoc.id_employeur
  inner join dadeh.ddadtassure assur on assur.id = assoc.id_assure
  where vv.mois_declaration >= '2022-05-01' and assoc.id_assure = ${id}
group by to_char(vv.mois_declaration + interval '1 year', 'YYYY-MM')
`;
  const rawSalaires = await getData(query);

  const salaires = rawSalaires.reduce((a, v) => {
    a[v.mois_declaration] = v.remuneration_nette_fiscale;
    return a;
  }, {});

  return {
    id: id,
    date_naissance: "10122000",
    codification_ue: "01",
    salaires,
  };
}
