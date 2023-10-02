"use client";
import React, { useState, useEffect, useContext } from "react";
import dynamic from "next/dynamic";
const HeadersColumns = dynamic(
  () => import("../components/HeadersColumns.js"),
  { ssr: false }
);
import { toast } from "react-hot-toast";
import useScreenSize from "../hooks/useScreenSize";
import CustomInput from "../components/CustomInput";
import SectionSearch from "../containers/SectionSearch";
import useSearchSimple from "../hooks/useSearchSimple";
import Appcontext from "../context/AppContext";
import styles from "../styles/forms.module.css";

const moduleHeaders = {
  classEspec: ["item_compon_grid"],
  columnTitles: [
    { id: "col1", name: "Nombre", show: true },
    { id: "col2", name: "Clase", show: true },
  ],
};

// Modal para añadir set´s de fabricación, sus componentes y medidas

const AddSetFab = ({
  handleId,
  addSetButton,
  idSetEdit,
  toEdit,
  secuencial,
}) => {
  const { itemPtList, getProdTerminado, loadData, showModal } =
    useContext(Appcontext);
  const { query, setQuery, filteredItems } = useSearchSimple(itemPtList);
  const isMobile = useScreenSize();

  const [dataFabricacion, setDataFabricacion] = useState({
    idSet: "",
    nombreSet: "",
    componentes: [],
  });

  const [openCompon, setOpenCompon] = useState(false);

  console.log(idSetEdit);
  console.log(toEdit);
  console.log(secuencial);

  useEffect(() => {
    // En la función envio si quiero ver componentes(true) o no (false)
    getProdTerminado(true);
    handleId();
    // Si se envía un idSet ya existente se colocará como estado inicial el set a editar
    if (idSetEdit) {
      setDataFabricacion(toEdit);
    }
  }, []);

  const handleChange = (e) => {
    setDataFabricacion({
      ...dataFabricacion,
      // idSet: toEdit.idSet === undefined ? handleId : toEdit.idSet,
      idSet: toEdit.idSet === undefined ? secuencial : toEdit.idSet,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheck = (idSearch, dimension) => {
    const buscaCampoNivel2 = (item) => {
      if (item.idCompon !== idSearch) return item;
      return {
        ...item,
        dimensiones: {
          ...item.dimensiones,
          [dimension]: !item.dimensiones[dimension],
        },
      };
    };

    setDataFabricacion({
      ...dataFabricacion,
      componentes: [...dataFabricacion.componentes.map(buscaCampoNivel2)],
    });
  };

  const addComponente = (payload, idItemSearch) => {
    if (!dataFabricacion.nombreSet) {
      toast.error("Colocar nombre del set de fabricación");
    } else {
      if (dataFabricacion.componentes.length === 0) {
        setDataFabricacion({
          ...dataFabricacion,
          componentes: [
            ...dataFabricacion.componentes,
            {
              idCompon: payload.idReg,
              nombreCompon: payload.nombreItem,
              formula1: "",
              formula2: "",
              dimensiones: {
                anchoA: false,
                anchoB: false,
                alturaH: false,
                alturaI: false,
                alturaJ: false,
              },
            },
          ],
        });
      } else {
        let searchItemsId = [];
        searchItemsId = dataFabricacion.componentes
          .map(({ idCompon }) => idCompon)
          .filter((idCompon) => idCompon === idItemSearch);

        if (searchItemsId.length === 0) {
          setDataFabricacion({
            ...dataFabricacion,
            componentes: [
              ...dataFabricacion.componentes,
              {
                idCompon: payload.idReg,
                nombreCompon: payload.nombreItem,
                formula1: "",
                formula2: "",
                dimensiones: {
                  anchoA: false,
                  anchoB: false,
                  alturaH: false,
                  alturaI: false,
                  alturaJ: false,
                },
              },
            ],
          });
        }
        // else {
        //   setState({
        //     ...state,
        //     itemsFactura: [
        //       ...state.itemsFactura.map((item) => {
        //         if (item.idItem !== idItemSearch) return item;
        //         return {
        //           ...item,
        //           cantFact: item.cantFact + 1,
        //         };
        //       }),
        //     ],
        //   });
        // }
      }
    }
  };

  const removeComponente = (payload) => {
    setDataFabricacion({
      ...dataFabricacion,
      componentes: [
        ...dataFabricacion.componentes.filter(
          (item) => item.idCompon !== payload
        ),
      ],
    });
  };

  console.log(itemPtList);
  console.log(dataFabricacion);

  return (
    <div className="mainContainer modal modalSelectCompon">
      <section className="generalContainer">
        <button
          tittle="Cerrar"
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
        <div className={styles["form-default"]}>
          <CustomInput
            typeInput="text"
            nameInput="nombreSet"
            valueInput={dataFabricacion.nombreSet}
            onChange={handleChange}
            nameLabel="Nombre del Set"
            required={true}
            // readonly={true}
          />
          <div className={styles.buttonContainerBig}>
            <span
              onClick={() => {
                setOpenCompon(!openCompon);
              }}
              className={styles.formButton}
            >
              Agregar Componentes
            </span>

            {!idSetEdit ? (
              <span
                onClick={() => {
                  addSetButton(dataFabricacion);
                }}
                className={styles.formButton}
              >
                Crear Set
              </span>
            ) : (
              <span
                onClick={() => {
                  addSetButton(dataFabricacion, true, idSetEdit);
                }}
                className={styles.formButton}
              >
                Actualizar
              </span>
            )}
          </div>

          {openCompon && (
            <SectionSearch
              query={query}
              setQuery={setQuery}
              placeholder={
                "Buscar por código / nombre / categoría / SubCategoría"
              }
            />
          )}
          {openCompon && (
            <>
              <HeadersColumns
                classEsp={moduleHeaders.classEspec}
                columnTitles={
                  isMobile
                    ? moduleHeaders.columnTitles.map((column) => {
                        if (column.id !== "col2") return column;
                        return { ...column, show: false };
                      })
                    : moduleHeaders.columnTitles
                }
              />
              <div className="generalContainerDetails">
                {filteredItems.length <= 0 && <p>No Existen registros</p>}
                {filteredItems.map((item) => {
                  return (
                    <div
                      key={item.id}
                      className={`item_compon_grid ${styles.componSelect}`}
                      onClick={() => {
                        addComponente(item, item.idReg);
                      }}
                    >
                      <span>
                        <i>{item.idReg}</i> - {item.nombreItem}
                      </span>
                      <span className="hideElement">{item.subCategoria}</span>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>
      <section className={styles.sectionComponSelect}>
        <h2>Componentes seleccionados</h2>
        {dataFabricacion.componentes.map((componente) => {
          return (
            <div
              className={styles.componSelectContainer}
              key={componente.idCompon}
            >
              <h4 className={styles.componSelectName}>
                {componente.idCompon}- {componente.nombreCompon}
              </h4>

              <div className={styles.componDimensiones}>
                <h5>Ancho:</h5>
                <span>
                  <label>A</label>
                  <input
                    type="checkbox"
                    name="anchoA"
                    onChange={() => {
                      handleCheck(componente.idCompon, "anchoA");
                    }}
                    checked={componente.dimensiones.anchoA}
                  />
                  <label>B</label>
                  <input
                    type="checkbox"
                    name="anchoB"
                    onChange={() => {
                      handleCheck(componente.idCompon, "anchoB");
                    }}
                    checked={componente.dimensiones.anchoB}
                  />
                </span>
              </div>
              <div className={styles.componDimensiones}>
                <h5>Altura:</h5>
                <span>
                  <label>H</label>
                  <input
                    type="checkbox"
                    name="alturaH"
                    onChange={() => {
                      handleCheck(componente.idCompon, "alturaH");
                    }}
                    checked={componente.dimensiones.alturaH}
                  />
                  <label>I</label>
                  <input
                    type="checkbox"
                    name="alturaI"
                    onChange={() => {
                      handleCheck(componente.idCompon, "alturaI");
                    }}
                    checked={componente.dimensiones.alturaI}
                  />
                  <label>J</label>
                  <input
                    type="checkbox"
                    name="alturaJ"
                    onChange={() => {
                      handleCheck(componente.idCompon, "alturaJ");
                    }}
                    checked={componente.dimensiones.alturaJ}
                  />
                </span>
              </div>
              <span
                className={styles.removeButton}
                tittle="Quitar componente"
                onClick={() => {
                  removeComponente(componente.idCompon);
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
                    d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </span>
            </div>
          );
        })}
      </section>
    </div>
  );
};

export default AddSetFab;
