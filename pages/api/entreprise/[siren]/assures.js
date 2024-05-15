import { fetchAssures } from "../../../../lib/fetch-dsn";

export default async function handler(req, res) {
  res.status(200).json(await fetchAssures(req.query.siren));
}
