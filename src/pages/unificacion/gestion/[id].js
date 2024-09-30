"use client";
import React, { useState, useEffect, useContext } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useRouter as useNextRouter } from "next/router";
import { redirectJwt } from "../../../helpers/FunctionsHelps";
import dynamic from "next/dynamic";
import Link from "next/link.js";
import CotizaDetailUnif from "../../../containers/CotizaDetailUnif";
//Importo este componente con la función dynamic de Next para deshabilitar el SSR (Server side rendering)
//En este caso es necesario solo esa sección ya que requiero del objeto window para obtener el ancho de la
//pantalla del cliente y en base a ello aplicar cambios en el renderizado para mobile, tablet, laptop y desktop
const HeadersColumns = dynamic(
  () => import("../../../components/HeadersColumns.js"),
  { ssr: false }
);
import useScreenSize from "../../../hooks/useScreenSize";
import SectionSearch from "../../../containers/SectionSearch";
import Appcontext from "../../../context/AppContext";
import useSearchSimple from "../../../hooks/useSearchSimple";
import { addZeroIdCotiza } from "../../../helpers/FunctionsHelps";

import { toast } from "react-hot-toast";
import { db } from "../../../server/firebase"; //Traigo conexión a firebase desde configuración realizada en el archivo firebase.js
import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore"; //Conectarse a colecciones y traer los datos
import stylesCli from "../clients.module.css";

const moduleHeaders = {
  classEspec: ["cotiza_grid"],
  columnTitles: [
    { id: "col0", name: "Cotización #", show: true },
    { id: "col1", name: "Tipo CT", show: true },
    { id: "col2", name: "Cliente", show: true },
    { id: "col3", name: "Fecha Elab.", show: true },
    { id: "col4", name: "Responsable", show: true },
    { id: "col5", name: "Total", show: true },
  ],
};

const Page = () => {
  const navigate = useRouter(); //Usado de next/navigation para realizar push a otras rutas
  const nextRouter = useNextRouter(); //usado de next/router para extraer el query params de la ruta (el id de cada registro de firebase)
  // const idFirebase = nextRouter.query.id;
  const idProy = nextRouter.query.id;
  const ruta = usePathname();
  // Funciones y objetos desde contexto inicial
  const { getAllCotizaProy, cotizaProyList, loadData, lastCode } =
    useContext(Appcontext);
  const isMobile = useScreenSize();

  const [openItem, setOpenItem] = useState(false);
  const [itemCapture, setItemCapture] = useState("");
  const [dataItemCap, setDataItemCap] = useState({});
  const { query, setQuery, filteredItems } = useSearchSimple(cotizaProyList);

  useEffect(() => {
    getAllCotizaProy(idProy);
    redirectJwt(navigate);
  }, [ruta]);

  console.log(cotizaProyList);

  return (
    <div className="mainContainer">
      <section className="generalContainer">
        <SectionSearch
          query={query}
          setQuery={setQuery}
          placeholder={"Buscar Cotización"}
        />
        <HeadersColumns
          classEsp={moduleHeaders.classEspec}
          columnTitles={
            isMobile
              ? moduleHeaders.columnTitles.map((column) => {
                  if (column.id !== "col4") return column;
                  return { ...column, show: false };
                })
              : moduleHeaders.columnTitles
          }
        />
        {loadData.loading ? (
          <h1>loading...</h1>
        ) : (
          <div className="generalContainerDetails">
            <span className="containerNewCotiza">
              <Link
                href={`/cotiza/gestion/new?idRes=${lastCode}&tipo=Ventanas`}
              >
                Crear Cotización Unificada
              </Link>
            </span>
            {filteredItems.length <= 0 && <p>No Existen registros</p>}
            {filteredItems.map((item) => {
              return (
                <div
                  key={item.id}
                  className={
                    item.estatus
                      ? "cotiza_grid item_detail"
                      : "cotiza_grid item_detail registerNulled"
                  }
                >
                  <span>
                    {addZeroIdCotiza(item.idReg.toString().length)}
                    {item.idReg}
                  </span>
                  <span>
                    <strong>{item.tipo}</strong>
                  </span>
                  <span>
                    {item.cliente?.nombreCliente}
                    <br />
                    <i>
                      {/* Proyecto: <b>{item.cliente?.proyecto}</b> */}
                      Proyecto: <b>{item.proyectoCotiza}</b>
                    </i>
                  </span>
                  <span>{item.fechaElab}</span>
                  <span className="hideElement">{item.responsable}</span>
                  <span style={{ textAlign: "center" }}>
                    <b>$ {item.totalesCotiza?.subTotIva}</b>
                  </span>
                  <span className="icons-container">
                    <button
                      title="Ver Detalles"
                      onClick={() => {
                        if (openItem) {
                          if (itemCapture !== item.id) {
                            setOpenItem(false);
                            setItemCapture(item.id);
                            setDataItemCap({ ...item });
                            setOpenItem(true);
                          } else {
                            setOpenItem(false);
                          }
                        } else {
                          setOpenItem(!openItem);
                          setItemCapture(item.id);
                          setDataItemCap({ ...item });
                        }
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                        <path
                          fillRule="evenodd"
                          d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <Link href={`/cotiza/gestion/${item.id}?tipo=${item.tipo}`}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                        />
                      </svg>
                    </Link>
                  </span>
                  {itemCapture === item.id && (
                    <CotizaDetailUnif
                      openRegister={openItem}
                      registerDetail={dataItemCap}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default Page;
