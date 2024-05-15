import Head from "next/head";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
import { useState, useEffect } from "react";

import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const [simulation, setSimulation] = useState();
  const [assure, setAssure] = useState();

  useEffect(() => {
    async function fetchData() {
      if (!router.query.token) {
        return;
      }
      const simulationResponse = await fetch(
        `/api/simulation/${router.query.token}`,
      );
      const simulationData = await simulationResponse.json();
      setSimulation(simulationData);
      const { id, runId } = simulationData.answers.all[0].value;
      const response = await fetch(`/api/assure/${id}?runId=${runId}`);
      setAssure(await response.json());
    }
    fetchData();
  }, [router.query.token]);
  return (
    <>
      <Head>
        <title>France Récompense</title>
        <meta
          name="description"
          content="Outil d'information des personnes sur leur droits à la prime d'activité"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {assure && (
        <section className="section">
          <div className="container">
            <h1 className="title">Bonjour {assure.prenom} !</h1>
            <div class="message is-success">
              <div class="message-header">
                <p>Simulation bien enregistrée</p>
              </div>
              <div class="message-body">
                Nous avons bien enregistré vos informations. Nous les utilisons
                pour estimer plus finement vos droits à la prime d'activité
                ainsi qu'aux centaines d'autres dispositifs modélisés dans notre
                simulateur.
              </div>
            </div>
            <p>
              Nous vous proposons de nous communiquer votre numéro de téléphone
              pour vous informer plus facilement.
            </p>
          </div>
        </section>
      )}
    </>
  );
}
