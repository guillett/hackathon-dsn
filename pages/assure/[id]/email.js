import Head from "next/head";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
import { useState, useEffect } from "react";

import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const [assure, setAssure] = useState();

  useEffect(() => {
    async function fetchData() {
      if (!router.query.id) {
        return;
      }
      const response = await fetch(`/api/assure/${router.query.id}?runId=${router.query.runId}`);
      setAssure(await response.json());
    }
    fetchData();
  }, [router.query.id]);
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
            <p>
              Nous pensons que vous avez le droit à la prime d'activité. Notre
              première estimation est de {assure.ppa} € / mois.
            </p>
            <p>
              Nous vous proposons de faire une simulation afin d'affiner
              l'estimation que nous avons fait à partir de vos salaires sur les
              3 derniers mois.
            </p>
          </div>
          <div className="section">
            <div className="container">
              <p>
                <a
                  className="button is-primary"
                  href={`/api/assure/${assure.id_assure}/simulation`}
                >
                  Faire une simulation
                </a>{" "}
                <a
                  className="button"
                  href={`/api/assure/${assure.id_assure}/pas-interesse`}
                >
                  Cela ne m'intéresse pas
                </a>
              </p>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
