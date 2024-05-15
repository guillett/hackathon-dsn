import Head from "next/head";
import { Inter } from "next/font/google";

import Entreprises from "../components/entreprises.js";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
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
      <section className="section">
        <div className="container">
          <h1 className="title">Faciliter l'accès à la prime d'activité</h1>
          <p className="subtitle">
            à partir des données des{" "}
            <strong>Déclarations Sociales Nominatives</strong>.
          </p>
        </div>
        <Entreprises />
      </section>
    </>
  );
}
