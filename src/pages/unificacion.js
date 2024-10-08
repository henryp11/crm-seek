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

// const moduleHeaders = {
//   classEspec: ["proy_grid"],
//   columnTitles: [{ id: "col1", name: "Nombre Proyecto", show: true }],
// };

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
        <h1 style={{ margin: "8px", textAlign: "center" }}>
          Seleccione el proyecto para crear la cotización unificada
        </h1>
        <SectionSearch
          query={query}
          setQuery={setQuery}
          placeholder={"Buscar Proyecto por su Nombre"}
        />
        {/* <HeadersColumns
          classEsp={moduleHeaders.classEspec}
          columnTitles={
            isMobile
              ? moduleHeaders.columnTitles.map((column) => {
                  if (column.id !== "col5") return column;
                  return { ...column, show: false };
                })
              : moduleHeaders.columnTitles
          }
        /> */}
        {loadData.loading ? (
          <h1>loading...</h1>
        ) : (
          <div className="generalContainerDetails selectProyUnifContainer">
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
                  <Link href={`/unificacion/gestion/${item.nombreProy}`}>
                    <strong>{item.nombreProy}</strong>
                  </Link>
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
