import { fetchEntreprises } from "../../lib/fetch-dsn";

export default async function handler(req, res) {
  const data = await fetchEntreprises();
  res.status(200).json(data);
}
