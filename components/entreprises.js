const HeadRow = () => (
  <tr>
    <th>SIRET</th>
    <th>#Salariés</th>
  </tr>
);

import { useState, useEffect } from "react";

export default function Entreprises() {
  const [entreprises, setEntreprises] = useState();

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api/entreprises");
      const data = await response.json();
      setEntreprises(data);
    }
    fetchData();
  }, []);

  return (
    <>
      <div className="container">
        <p>{entreprises?.total} entreprises</p>
        <table className="table">
          <thead>
            <HeadRow />
          </thead>
          <tfoot>
            <HeadRow />
          </tfoot>
          <tbody>
            {entreprises?.subset.map((e) => (
              <tr key={e.siret}>
                <th>
                  <a href={`entreprise/${e.siret}`}>{e.siret}</a>
                </th>
                <td className="is-pulled-right">{e.count_assures}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
