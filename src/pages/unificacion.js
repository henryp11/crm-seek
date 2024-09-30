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
  columnTitles: [{ id: "col1", name: "Nombre Proyecto", show: true }],
};

const Unificacion = () => {
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
                  <span className="icons-container">
                    <Link href={`/unificacion/gestion/${item.nombreProy}`}>
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
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default Unificacion;
