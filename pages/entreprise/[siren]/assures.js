import Head from "next/head";
import { Inter } from "next/font/google";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import Assures from "../../../components/assures.js";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const router = useRouter();
  const [entreprise, setEntreprise] = useState();
  const [fetchAssures, setFetchAssures] = useState(false);

  useEffect(() => {
    if (!router.query.siren) {
      return;
    }
    async function fetchData() {
      const response = await fetch(`/api/entreprise/${router.query.siren}`);
      const data = await response.json();
      setEntreprise(data);
    }
    fetchData();
  }, [router.query.siren]);
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
      {entreprise && (
        <section className="section">
          <div className="container">
            <h1 className="title">SIREN : {router.query.siren}</h1>
          </div>
          <div className="container">
            {entreprise.count_assures} personnes déclarées
          </div>
          <div className="container">
            <Assures siren={router.query.siren} />
          </div>
        </section>
      )}
    </>
  );
}
