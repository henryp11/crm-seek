"use client";
import React, { useState, useEffect, useContext } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useRouter as useNextRouter } from "next/router";
import { redirectJwt, redondear } from "../../../helpers/FunctionsHelps";
import dynamic from "next/dynamic";
import Link from "next/link.js";
import CotizaDetailUnif from "../../../containers/CotizaDetailUnif";
import CotizaByProy from "../../../components/CotizaByProy";
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
import { addZeroIdCotiza, blockButton } from "../../../helpers/FunctionsHelps";

import { toast } from "react-hot-toast";
import { db } from "../../../server/firebase"; //Traigo conexión a firebase desde configuración realizada en el archivo firebase.js
import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore"; //Conectarse a colecciones y traer los datos

const moduleHeaders = {
  classEspec: ["cotiza_grid"],
  columnTitles: [
    { id: "col0", name: "Cot. #", show: true },
    { id: "col1", name: "Tipo CT", show: true },
    { id: "col2", name: "Cliente", show: true },
    { id: "col3", name: "Fecha", show: true },
    { id: "col4", name: "Resp.", show: true },
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
  const {
    getAllCotizaProy,
    cotizaProyList,
    getSimpleDataDb,
    dataList,
    loadData,
    lastCode,
  } = useContext(Appcontext);
  const isMobile = useScreenSize();

  const conectTbCotizaUnif = collection(db, "CotizacionesUnificadas");

  const [openItem, setOpenItem] = useState(false);
  const [itemCapture, setItemCapture] = useState("");
  const [dataItemCap, setDataItemCap] = useState({});
  const [loadCreate, setLoadCreate] = useState({
    loading: false,
    error: null,
    confirmSave: false, //Para mostrar el botón de confirmación para guardar la cotización
    showExport: false,
  });

  const { query, setQuery, filteredItems } = useSearchSimple(cotizaProyList);

  //Estado para cotización unificada
  const [dataCotizaUnif, setDataCotizaUnif] = useState({
    idReg: "",
    cliente: {},
    proyectName: "",
    fecha: "",
    observac: "",
    cotizaciones: [],
    totalFinalCotizaUnif: {
      totalFinalMat: 0,
      totalFinalMO: 0,
      totalFinal: 0,
    },
  });

  const [showFormResumen, setShowFormResumen] = useState(false); //Para mostrar el formulario final que creará la CTUnif

  useEffect(() => {
    getSimpleDataDb("CotizacionesUnificadas");
    getAllCotizaProy(idProy);
    if (lastCode) {
      getCotizaUnif();
    }
    redirectJwt(navigate);
  }, [ruta, lastCode]);

  //Para actualizar el código de la cotización Unificada en la tabla de reserva, solo aplica para nuevas cotizaciones
  const updateLastCode = async (codeReserva) => {
    try {
      const docRef = doc(db, "Codificacion", "reserva");
      await updateDoc(docRef, {
        "codigos.cotizaUnif": codeReserva,
      });
    } catch (error) {
      console.log(error);
    }
  };

  //Función para obtener el último id de la cotización Unificada, obteniendo el listado de las existentes y contando el # de registros
  const getCotizaUnif = async () => {
    //Cuando es una cotización nueva averiguo el código de cotización que le toca
    setLoadCreate({ loading: true, error: null });
    try {
      const docRef = doc(db, "Codificacion", "reserva"); //Me conecto a la BD firebase y traigo la codificacion del doc reserva
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const ultimoIdCotiza = docSnap.data();
        // const cantCotizaUnif = (await dataList) && dataList.length;
        console.log(
          `Último Cód. CotizaUnif en BD: ${ultimoIdCotiza.codigos.cotizaUnif}`
        );

        //Si en la tabla de reserva está en cero, no se está creando una nueva cotización simultaneamente
        if (ultimoIdCotiza.codigos.cotizaUnif === 0) {
          //En este caso actualizo el estado de la cotizaUnif para colocar como idRegel resultante del array
          // del "dataList" el cual son las cotizaciones unificadas ya existentes
          setDataCotizaUnif({
            ...dataCotizaUnif,
            idReg: lastCode + 1,
          });
          // Y actualizo en la tabla de cotizaciones el nuevo código reservado
          updateLastCode(lastCode + 1);
        } else {
          //Si existe una reserva significa que simultaneamente se está creando otra cotización, por lo que
          //El código a la nueva cotización Unificada es el código de la reserva + 1
          setDataCotizaUnif({
            ...dataCotizaUnif,
            idReg: ultimoIdCotiza.codigos.cotizaUnif + 1,
          });
          // Y actualizo en la tabla de cotizaciones el nuevo código reservado
          updateLastCode(ultimoIdCotiza.codigos.cotizaUnif + 1);
        }
        setLoadCreate({ loading: false, error: null });
      } else {
        toast.error("Último Código no encontrado!!");
        setTimeout(() => {
          toast.dismiss();
        }, 2000);
      }
    } catch (error) {
      console.log(error);
      setLoadCreate({ loading: false, error: error });
    }
  };
  //Función que añade cotizaciones del listado para unificar
  const addCotiza = (payload, idCotizaSearch) => {
    if (dataCotizaUnif.cotizaciones.length === 0) {
      setDataCotizaUnif({
        ...dataCotizaUnif,
        cotizaciones: [...dataCotizaUnif.cotizaciones, payload],
      });
    } else {
      let searchCotizaId = [];
      searchCotizaId = dataCotizaUnif.cotizaciones
        .map(({ id }) => id)
        .filter((id) => id === idCotizaSearch);

      if (searchCotizaId.length === 0) {
        setDataCotizaUnif({
          ...dataCotizaUnif,
          cotizaciones: [...dataCotizaUnif.cotizaciones, payload],
        });
      }
    }
    setShowFormResumen(false);
  };

  //Quita cotizaciones añadidas en la CTUnif
  const removeCotiza = (payload) => {
    setDataCotizaUnif({
      ...dataCotizaUnif,
      cotizaciones: [
        ...dataCotizaUnif.cotizaciones.filter(
          (cotiza) => cotiza.id !== payload
        ),
      ],
    });
    setShowFormResumen(false);
  };

  //Calcula los totales finales de de todas las cotizaciones añadidas para: Materiales, Mano de obra y total final
  const calcTotalFinal = () => {
    //Extraigo los productos de cada cotización añadida
    const productosByCotiza = dataCotizaUnif.cotizaciones.map((cotiza) => {
      return cotiza.productos;
    });
    //Concanteno los diferentes arrays de productos de cada cotización en un solo array de productos
    const productosUnif = [].concat(...productosByCotiza);
    const acumulaTot = (acumulador, total) => {
      return acumulador + total;
    };

    //Con los productos únicos ya puedo realizar las operaciones totalización
    setDataCotizaUnif({
      ...dataCotizaUnif,
      proyectName: idProy,
      cliente: dataCotizaUnif.cotizaciones[0].cliente,
      totalFinalCotizaUnif: {
        totalFinalMat: redondear(
          productosUnif
            .map(({ totMaterial }) => {
              return totMaterial;
            })
            .reduce(acumulaTot, 0),
          2
        ),
        totalFinalMO: redondear(
          productosUnif
            .map(({ totManoObra }) => {
              return totManoObra;
            })
            .reduce(acumulaTot, 0),
          2
        ),
        totalFinal: redondear(
          dataCotizaUnif.cotizaciones
            .map((cotiza) => {
              return cotiza.totalesCotiza.subTotIva;
            })
            .reduce(acumulaTot, 0),
          2
        ),
      },
    });
    setShowFormResumen(true); //Al calcular totales se muestra el formulario de guardado a la BD
  };

  const handleChange = (e) => {
    setDataCotizaUnif({
      ...dataCotizaUnif,
      [e.target.name]: e.target.value,
    });
  };

  //Este Update actualiza las cotizaciones elegidas el campo "unificado"
  //Se le pasa como parámetro el id de documento de cada cotización de la colección "Cotizaciones"
  const updateCotiza = async (idDocCotiza) => {
    setLoadCreate({ loading: true, error: null });
    try {
      const docRef = doc(db, "Cotizaciones", idDocCotiza); //Me conecto a la BD firebase y busco el registro por su Id
      await updateDoc(docRef, {
        cotizaUnif: dataCotizaUnif.idReg,
        unificado: true,
      });
      toast.success("Cotización actualizada cambio de estado a Unificada");
      setTimeout(() => {
        toast.dismiss();
      }, 2000);
      setLoadCreate({ loading: false, error: null });
    } catch (error) {
      setLoadCreate({ loading: false, error: error });
    }
  };

  //Función de creación final en la colección "CotizacionesUnificadas", se envía el objeto final y las cotizaciones usadas
  const createCotizaUnif = async (cotizaObject, cotizaUsed) => {
    console.log("creando cotización unificada...");
    setLoadCreate({ loading: true, error: null });
    try {
      await setDoc(doc(conectTbCotizaUnif), cotizaObject);
      setLoadCreate({ loading: false, error: null });
      toast.success("Registro creado con éxito");
      setTimeout(() => {
        toast.dismiss();
      }, 2000);

      //Una vez creada la cotización Unificada, procedo a extraer el id de cada cotización usada
      const cotizaToUpdate = cotizaUsed.map((cotiza) => {
        return cotiza.id;
      });

      //Con el id obtenido de cada una en el array anterior, itero sobre cada resultado para actualizar
      //en la colección de "Cotizaciones" el campo "unificado".
      //Esto debido a que si una cotización ya fue unificada y usada está ya no debe poder elegirse para otra.
      cotizaToUpdate.forEach((idCotiza) => {
        updateCotiza(idCotiza);
      });

      updateLastCode(0); //Cuando guardo la cotización el código reservado queda en cero nuevamente
      navigate.push("/unificacion/resumenCotizaUnif");
    } catch (error) {
      console.log(error);
      setLoadCreate({ loading: false, error: error });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    blockButton();
    createCotizaUnif(dataCotizaUnif, dataCotizaUnif.cotizaciones);
    // if (idDoc === "new") {
    //   blockButton();
    //   createCotiza(valueState);
    //   encerarState();
    // } else {
    //   updateCotiza(valueState);
    //   encerarState();
    // }
  };

  console.log(cotizaProyList);
  console.log(dataCotizaUnif);
  console.log(dataList);
  console.log(`último código proviende del hook de context: ${lastCode}`);

  return (
    <div className="mainContainer" style={{ gap: "0 12px" }}>
      {!loadData.loading && (
        <section
          className="generalContainer"
          style={{ width: "60%", margin: "0 4px" }}
        >
          <h2 style={{ marginBottom: "8px", fontSize: "larger" }}>
            Creando Nueva Cotización Unificada
          </h2>
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
              <button
                className="containerNewCotiza"
                title="Cancelar / Regresar"
                style={{
                  left: "48%",
                  background: "#555fc2",
                  padding: "1px",
                  borderRadius: "12px",
                }}
                onClick={() => {
                  updateLastCode(0);
                }}
              >
                <Link
                  href={`/unificacion`}
                  style={{
                    color: "#9d2020",
                    fontWeight: "bolder",
                    fontSize: "small",
                    borderRadius: "12px",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    style={{ color: "#9d2020" }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
                    />
                  </svg>{" "}
                  <br />
                  Regresar
                </Link>
              </button>
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
                        Proyecto: <b>{item.proyectoCotiza}</b>
                      </i>
                    </span>
                    <span>{item.fechaElab}</span>
                    <span className="hideElement">{item.responsable}</span>
                    <span style={{ textAlign: "center" }}>
                      <b>$ {item.totalesCotiza?.subTotIva}</b>
                    </span>
                    <span className="icons-container">
                      <Link
                        href={`/cotiza/gestion/${item.id}?tipo=${item.tipo}`}
                        title="Editar Cotización"
                        onClick={() => {
                          updateLastCode(0);
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
                      </Link>
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
                      <button
                        title="Agregar Cotización"
                        onClick={() => {
                          addCotiza({ ...item }, item.id);
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                          />
                        </svg>
                      </button>
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
      )}
      {!loadData.loading && (
        <CotizaByProy
          cotizaciones={dataCotizaUnif.cotizaciones}
          removeCotiza={removeCotiza}
          calcTotalFinal={calcTotalFinal}
          showForm={showFormResumen}
          finalState={dataCotizaUnif}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          updateLastCode={updateLastCode}
        />
      )}
    </div>
  );
};

export default Page;
