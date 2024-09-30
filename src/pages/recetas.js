import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { redirectJwt } from "../helpers/FunctionsHelps";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link.js";
import RecetaDetail from "../containers/RecetaDetail";
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
import ProductsResume from "../containers/ProductsResume";

const moduleHeaders = {
  classEspec: ["item_grid"],
  columnTitles: [
    { id: "col1", name: "Id.Prod", show: true },
    { id: "col2", name: "Nombre", show: true },
    { id: "col3", name: "Imagen", show: true },
  ],
};

// Pantalla principal que muestra los items que ya tengan recetas

const Recetas = () => {
  const router = useRouter();
  const {
    getSimpleDataDb,
    deleteDocument,
    dataList,
    loadData,
    showModal,
    state,
  } = useContext(Appcontext);
  const isMobile = useScreenSize();

  const [openDet, setOpenDet] = useState(false);
  const [regCapture, setRegCapture] = useState("");
  const [imageCapture, setImageCapture] = useState("");
  const [details, setDetails] = useState({});
  const [zoom, setZoom] = useState(false);
  const { query, setQuery, filteredItems } = useSearchSimple(dataList);

  useEffect(() => {
    getSimpleDataDb("Recetas");
    redirectJwt(router);
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
            <button
              onClick={() => {
                showModal();
              }}
              id="iconAddContainer"
            >
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
            </button>
            {filteredItems.length <= 0 && <b>No Existe</b>}
            {filteredItems.map((item) => {
              return (
                <div
                  key={item.id}
                  className="item_grid item_detail item_grid_m5"
                >
                  <span>{item.idReg}</span>
                  <span>{item.nombreProducto}</span>
                  {item.url ? (
                    <figure
                      className="imageSmall"
                      onClick={() => {
                        if (zoom) {
                          if (imageCapture !== item.id) {
                            setZoom(false);
                            setImageCapture(item.id);
                            setZoom(true);
                          } else {
                            setZoom(false);
                          }
                        } else {
                          setZoom(!zoom);
                          setImageCapture(item.id);
                        }
                      }}
                      onKeyUp=""
                      tabIndex="0"
                      role="button"
                    >
                      <Image src={item.url} alt="imageSmall" layout="fill" />
                      {zoom && imageCapture === item.id && (
                        <img
                          src={item.url}
                          alt={item.id}
                          className="imageBig"
                          onClick={() => {
                            setZoom(!zoom);
                          }}
                          onKeyUp=""
                          tabIndex="0"
                          role="button"
                        />
                      )}
                    </figure>
                  ) : (
                    <figure></figure>
                  )}
                  <span className="icons-container">
                    <button
                      title="Ver Detalles"
                      onClick={() => {
                        if (openDet) {
                          if (regCapture !== item.id) {
                            setOpenDet(false);
                            setRegCapture(item.id);
                            setDetails({ ...item });
                            setOpenDet(true);
                          } else {
                            setOpenDet(false);
                          }
                        } else {
                          setOpenDet(!openDet);
                          setRegCapture(item.id);
                          setDetails({ ...item });
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
                    <Link
                      href={`/recetas/gestion/${item.id}?item=${item.idReg}&name=${item.nombreProducto}&img=${item.url}&edit=true&categ=${item.categoria}&subCateg=${item.subCategoria}`}
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
                    </Link>
                  </span>
                  <span className="icons-container delete">
                    <button
                      title="ELIMINAR RECETA"
                      onClick={() => {
                        deleteDocument(
                          item.id,
                          "Recetas",
                          "¿Desea eliminar toda la RECETA de fabricación para este item?",
                          item.idDocItem
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

                  {regCapture === item.id && (
                    <RecetaDetail open={openDet} details={details} />
                  )}
                </div>
              );
            })}
          </div>
        )}
        {/* Modal para añadir recetas a productos terminados */}
        {state.showModal && <ProductsResume />}
      </section>
    </div>
  );
};

export default Recetas;
