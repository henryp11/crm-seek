import React, { useState, useEffect, useContext } from "react";
import dynamic from "next/dynamic";
import Link from "next/link.js";
import ProductDetail from "../containers/ProductDetail";
//Importo este componente con la función dynamic de Next para deshabilitar el SSR (Server side rendering)
//En este caso es necesario solo esa sección ya que requiero del objeto window para obtener el ancho de la
//pantalla del cliente y en base a ello aplicar cambios en el renderizado para mobile, tablet, laptop y desktop
const HeadersColumns = dynamic(
  () => import("../components/HeadersColumns.js"),
  { ssr: false }
);
import useScreenSize from "../hooks/useScreenSize";
//import MenuLateral from "../components/MenuLateral";
import SectionSearch from "../containers/SectionSearch";
import Appcontext from "../context/AppContext";
import useSearchSimple from "../hooks/useSearchSimple";
//import styles from "../styles/products.module.css";

const moduleHeaders = {
  classEspec: ["item_grid"],
  columnTitles: [
    { id: "col1", name: "Id.Prod", show: true },
    { id: "col2", name: "Nombre", show: true },
    { id: "col3", name: "Clase", show: true },
    { id: "col4", name: "Precio", show: true },
  ],
};

const Products = () => {
  // Funciones y objetos desde contexto inicial
  const { getSimpleDataDb, dataList, loadData } = useContext(Appcontext);
  const isMobile = useScreenSize();

  const [openItem, setOpenItem] = useState(false);
  const [itemCapture, setItemCapture] = useState("");
  const [dataItemCap, setDataItemCap] = useState({});
  const { query, setQuery, filteredItems } = useSearchSimple(dataList);

  useEffect(() => {
    getSimpleDataDb("Productos");
  }, []);

  return (
    <div className="mainContainer">
      {/* <MenuLateral /> */}
      <section className="generalContainer">
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
            <Link href="/nuevo">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                id="iconAdd"
                tittle="Crear Nuevo"
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
                <div key={item.id} className="item_grid item_detail">
                  <span>{item.idReg}</span>
                  <span>{item.nombreItem}</span>
                  <span>{item.subCategoria}</span>
                  <span className="hideElement">{item.precio}</span>
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
                    <Link href={`/editar/${item.id}`}>
                      <button
                        title="Editar"
                        onClick={() => {
                          if (openItem) {
                            setOpenItem(false);
                            // setItemCapture(item.id);
                            // setDataItemCap({ ...item });
                            // setOpenItem(true);
                          } else {
                            setOpenItem(!openItem);
                            // setItemCapture(item.id);
                            // setDataItemCap({ ...item });
                          }
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
                            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                          />
                        </svg>
                      </button>
                    </Link>
                  </span>
                  {itemCapture === item.id && (
                    <ProductDetail
                      openItem={openItem}
                      itemDetail={dataItemCap}
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

export default Products;
