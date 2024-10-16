import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { redirectJwt } from "../helpers/FunctionsHelps";
import dynamic from "next/dynamic";
import Link from "next/link.js";
//Importo este componente con la función dynamic de Next para deshabilitar el SSR (Server side rendering)
//En este caso es necesario solo esa sección ya que requiero del objeto window para obtener el ancho de la
//pantalla del cliente y en base a ello aplicar cambios en el renderizado para mobile, tablet, laptop y desktop
const HeadersColumns = dynamic(
  () => import("../components/HeadersColumns.js"),
  { ssr: false }
);
import useScreenSize from "../hooks/useScreenSize";
import SectionSearch from "../containers/SectionSearch";
import Appcontext from "../context/AppContext";
import useSearchSimple from "../hooks/useSearchSimple";

const moduleHeaders = {
  classEspec: ["proy_grid"],
  columnTitles: [
    { id: "col1", name: "Nombre Proyecto", show: true },
    { id: "col2", name: "Fecha Inicio", show: true },
    { id: "col3", name: "Dirección / Ubicación", show: true },
    { id: "col4", name: "Observaciones", show: true },
  ],
};

const Proyectos = () => {
  const router = useRouter();
  // Funciones y objetos desde contexto inicial
  const { getSimpleDataDb, deleteDocument, dataList, loadData } =
    useContext(Appcontext);
  const isMobile = useScreenSize();

  // const [openItem, setOpenItem] = useState(false);
  // const [itemCapture, setItemCapture] = useState("");
  // const [dataItemCap, setDataItemCap] = useState({});
  const { query, setQuery, filteredItems } = useSearchSimple(dataList);

  useEffect(() => {
    getSimpleDataDb("Proyectos");
    redirectJwt(router);
  }, []);

  return (
    <div className="mainContainer">
      <section className="generalContainer">
        <SectionSearch
          query={query}
          setQuery={setQuery}
          placeholder={"Buscar Proyecto por su Nombre"}
        />
        <HeadersColumns
          classEsp={moduleHeaders.classEspec}
          columnTitles={
            isMobile
              ? moduleHeaders.columnTitles.map((column) => {
                  if (column.id !== "col5") return column;
                  return { ...column, show: false };
                })
              : moduleHeaders.columnTitles
          }
        />
        {loadData.loading ? (
          <h1>loading...</h1>
        ) : (
          <div className="generalContainerDetails">
            <Link href="/proyectos/gestion/new">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                id="iconAdd"
                title="Crear Nuevo"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </Link>
            {filteredItems.length <= 0 && <p>No Existe</p>}
            {filteredItems.map((item) => {
              return (
                <div
                  key={item.id}
                  className={
                    item.estatus
                      ? "proy_grid item_detail"
                      : "proy_grid item_detail registerNulled"
                  }
                >
                  <span>{item.nombreProy}</span>
                  <span>{item.fechaIni}</span>
                  <span>{item.direccion}</span>
                  <span>{item.observac}</span>
                  <span className="icons-container">
                    {/* <button
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
                    </button> */}
                    <Link href={`/proyectos/gestion/${item.id}`}>
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
                    <span className="icons-container delete">
                      <button
                        title="ELIMINAR PROYECTO"
                        onClick={() => {
                          deleteDocument(
                            item.id,
                            "Proyectos",
                            "¿Desea eliminar PERMANENTEMENTE este proyecto?"
                          );
                        }}
                      >
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
                            d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                          />
                        </svg>
                      </button>
                    </span>
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default Proyectos;
