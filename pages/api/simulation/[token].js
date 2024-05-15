import { baseUrl } from "../../../lib/mes-aides";

export default async function handler(req, res) {
    const response = await fetch(
        `${baseUrl}/api/simulation/via/${req.query.token}`,
    );
    const data = await response.json();
    res.status(200).json(data);
}
