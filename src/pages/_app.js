//Este es el archivo que ejecuta la aplicación como tal por lo tanto aquí colocare
//todas las configuraciones globales como estilos css y principalmente el contexto
//También colocaré los componentes a repetir como si fuese el layout en React
import Head from "next/head";
import Header from "../containers/Header";
import Appcontext from "../context/AppContext";
//import Header from "components/Header";
import useInitialState from "../hooks/useInitialState";
import "../styles/globals.css";

export default function App({ Component, pageProps }) {
  //Inicializo el estado
  const initialState = useInitialState();
  //Dentro del return aplico el Provider de AppContext
  return (
    <Appcontext.Provider value={initialState}>
      <Head>
        {/* Titulo por default en páginas si importa la equiqueta Head */}
        <title>Defualt Tittle</title>
      </Head>
      <Header />
      <Component {...pageProps} />
    </Appcontext.Provider>
  );
}

//COMO SE CONFIGURO INICIALMENTE AL INSTALAR CREATE-NEXT-APP

// import './globals.css'
// import { Inter } from 'next/font/google'

// const inter = Inter({ subsets: ['latin'] })

// export const metadata = {
//   title: 'Create Next App',
//   description: 'Generated by create next app',
// }

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body className={inter.className}>{children}</body>
//     </html>
//   )
// }
