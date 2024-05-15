import { useState, useEffect } from "react";

const HeadRow = () => (
  <tr>
    <th>Nom</th>
    <th>Prénom</th>
    <th>Email</th>
    <th>Estimation PPA</th>
    <th>Proactivité</th>
  </tr>
);

export default function Assures(props) {
  const [assures, setAssures] = useState([]);

  let fetching = false;
  useEffect(() => {
    async function fetchData() {
      if (fetching) {
        return;
      }
      fetching = true;
      const response = await fetch(`/api/entreprise/${props.siren}/assures`);
      const data = await response.json();
      setAssures(data);
      fetching = false;
    }
    fetchData();
  }, []);

  return (
    <table className="table">
      <thead>
        <HeadRow />
      </thead>
      <tfoot>
        <HeadRow />
      </tfoot>
      <tbody>
        {assures.map((a, i) => (
          <tr key={a.id_assure}>
            <td>{a.nom || `Doe_${i}`}</td>
            <td>{a.prenom || `John_${i}`}</td>
            <td>{a.email || `j${i}@d.oe`}</td>
            <td>{a.ppa}</td>
            <td>
              <a
                target="_blank"
                href={`/assure/${a.id_assure}/email?runId=${a.id_run}`}
              >
                Voir l’email
              </a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
