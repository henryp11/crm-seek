import React, { useEffect, useContext } from "react";
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
//import MenuLateral from "../components/MenuLateral";
import SectionSearch from "./SectionSearch";
import Appcontext from "../context/AppContext";
import useSearchSimple from "../hooks/useSearchSimple";
//import styles from "../styles/products.module.css";

const moduleHeaders = {
  classEspec: ["item_receta_grid"],
  columnTitles: [
    { id: "col1", name: "Id.Prod", show: true },
    { id: "col2", name: "Nombre", show: true },
    { id: "col3", name: "Clase", show: true },
  ],
};

const ProductsResume = () => {
  // Funciones y objetos desde contexto inicial
  const { itemPtList, getProdTerminado, loadData, showModal } =
    useContext(Appcontext);
  const isMobile = useScreenSize();

  // const [openItem, setOpenItem] = useState(false);
  // const [itemCapture, setItemCapture] = useState("");
  // const [dataItemCap, setDataItemCap] = useState({});
  const { query, setQuery, filteredItems } = useSearchSimple(itemPtList);

  useEffect(() => {
    // En la función envio si quiero ver componentes(true) o no (false)
    getProdTerminado(false);
  }, []);

  console.log(itemPtList);

  return (
    <div className="mainContainer modal">
      <section className="generalContainer">
        <button
          className="icons-container closeModal"
          onClick={() => {
            showModal();
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
              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
        <SectionSearch
          query={query}
          setQuery={setQuery}
          placeholder={"Buscar Item por su código / nombre"}
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
            {filteredItems.length <= 0 && (
              <p>No Existen registros para añadir nuevas recetas</p>
            )}
            {filteredItems.map((item) => {
              return (
                <div key={item.id} className="item_receta_grid item_detail">
                  <span>{item.idReg}</span>
                  <span>{item.nombreItem}</span>
                  <span>{item.subCategoria}</span>
                  {/* <span className="hideElement">{item.precio}</span> */}
                  <span className="icons-container" tittle="Añadir Receta">
                    <Link
                      href={`/recetas/gestion/${item.id}?item=${item.idReg}&name=${item.nombreItem}&img=${item.image.name}`}
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
                          d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </Link>
                  </span>
                  {/* {itemCapture === item.id && (
                    <ProductDetail
                      openItem={openItem}
                      itemDetail={dataItemCap}
                    />
                  )} */}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default ProductsResume;
