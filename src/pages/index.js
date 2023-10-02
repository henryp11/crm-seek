// Este archivo index.js ubicado en pages es la raíz principal del
// sitio es decir la aplicaicón como tal ya que las rutas en next se manejan por archivos

import Head from "next/head";
import ModulesMain from "../containers/ModulesMain";

export default function Home() {
  return (
    <>
      <Head>
        <title>Gestor de Cotizaciones</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ModulesMain />
    </>
  );
}
