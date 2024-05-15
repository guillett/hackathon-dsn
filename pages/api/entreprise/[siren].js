import { fetchEntreprise } from "../../../lib/fetch-dsn";

export default async function handler(req, res) {
  res.status(200).json(await fetchEntreprise(req.query.siren));
}
