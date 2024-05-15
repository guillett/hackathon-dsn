import { fetchAssure, fetchAssureDetails } from "../../../lib/fetch-dsn";

export default async function handler(req, res) {
  const data = await fetchAssure(req.query.id, req.query.runId);
  const details = await fetchAssureDetails(req.query.id);
  res.json({ ...data, details });
}
