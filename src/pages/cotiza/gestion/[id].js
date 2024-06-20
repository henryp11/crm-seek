"use client";
import React, { useState, useContext, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useRouter as useNextRouter } from "next/router"; //para extraer el query params de la ruta (el id de cada registro de firebase)
import Link from "next/link";
import { toast } from "react-hot-toast";
import Appcontext from "../../../context/AppContext";
import { db } from "../../../server/firebase"; //Traigo conexión a firebase desde configuración realizada en el archivo firebase.js
import {
  collection,
  getDoc,
  getDocs,
  doc,
  setDoc,
  onSnapshot,
  //updateDoc,
  query,
  orderBy,
  startAt,
  endAt,
} from "firebase/firestore"; //Conectarse a colecciones y traer los datos
import CustomInput from "../../../components/CustomInput";
import SelectItems from "../../../containers/SelectItems";
import DetalleCotiza from "../../../containers/DetalleCotiza";
import styles from "../../../styles/forms.module.css";
import stylesCot from "../cotizaTemp.module.css";

// Componente para crear Cotización o editar una ya existente

const Page = () => {
  // Funciones y objetos desde contexto inicial
  const { getSimpleDataDb, dataList, showModal, calculaTotales, state } =
    useContext(Appcontext);
  const navigate = useRouter(); //Usado de next/navigation para realizar push a otras rutas
  const nextRouter = useNextRouter(); //usado de next/router para extraer el query params de la ruta (el id de cada registro de firebase)
  const idDoc = nextRouter.query.id;
  const ruta = usePathname();
  //const queryParams = useSearchParams(); //usado desde next/navigation para extraer los parametros como variables enviados (despues de ?)
  //const isEdit = queryParams.get("edit");

  const conectTbRecetas = collection(db, "Recetas");
  const conectTbCotiza = collection(db, "Cotizaciones");

  const initialState = {
    idReg: "", //IdCotiza
    cliente: {
      id: "",
      idReg: "",
      nombreCliente: "",
      idVendedor: "",
      email: "",
      emailAlter: "",
      observac: "",
      telf1: "",
      telf2: "",
    },
    fechaElab: "",
    fechaValid: "",
    descripGeneral: "",
    tipoAluminio: "",
    tipoVidrio: "",
    responsable: "",
    estatus: true,
    productos: [],
    totalesCotiza: { ivaTotal: 0, subTotIva: 0, subTotIva0: 0, totalDcto: 0 },
  };

  const [valueState, setValueState] = useState(initialState);
  const [recetas, setRecetas] = useState([]);
  const [itemVidrioList, setVidrioList] = useState([]); //Trae items que comiencen con Vidrio
  const [loadCreate, setLoadCreate] = useState({
    loading: false,
    error: null,
    confirmSave: false, //Para mostrar el botón de confirmación para guardar la cotización
  });

  useEffect(() => {
    if (state.showModal) {
      showModal();
    }
    getCotiza();
    getSimpleDataDb("Clientes");
    getVidrio();
    getRecetas();
  }, [ruta]);

  // Obtengo datos de la Cotización a modificar (funciones Firebase)
  const getCotiza = async () => {
    if (idDoc !== "new") {
      setLoadCreate({ loading: true, error: null });
      try {
        const docRef = doc(db, "Cotizaciones", idDoc); //Me conecto a la BD firebase y busco el registro por su Id
        const docSnap = await getDoc(docRef); //Obtengo el dato por su id único de Firebase
        if (docSnap.exists()) {
          const cotiza = docSnap.data();
          setValueState({ ...cotiza, id: idDoc });
          setLoadCreate({ loading: false, error: null });
        } else {
          toast.error("Cotización no encontrado!!");
          setTimeout(() => {
            toast.dismiss();
          }, 2000);
        }
      } catch (error) {
        setLoadCreate({ loading: false, error: error });
      }
    }
  };

  const getRecetas = async () => {
    setLoadCreate({ loading: true, error: null });
    try {
      onSnapshot(conectTbRecetas, (querySnapshot) => {
        const docs = [];
        querySnapshot.forEach((doc) => {
          docs.push({ ...doc.data(), id: doc.id });
        });
        // Ordeno los datos por id_producto
        docs.sort((a, b) => {
          if (a.idReg < b.idReg) {
            return -1;
          }
          if (a.idReg > b.idReg) {
            return 1;
          }
          return 0;
        });
        setRecetas(docs);
        setLoadCreate({ loading: false, error: null });
      });
    } catch (error) {
      setLoadCreate({ loading: false, error: error });
      console.log(error);
    }
  };

  // Llamar los vidrios para elegir en cotización
  const getVidrio = async () => {
    try {
      const docs = [];
      const queryDb = query(
        collection(db, "Productos"),
        orderBy("nombreItem"),
        startAt("Vidrio"),
        endAt("Vidrio\uf8ff")
      );
      console.log(queryDb);
      const querySnapshot = await getDocs(queryDb);
      querySnapshot.forEach((doc) => {
        docs.push({ ...doc.data(), id: doc.id });
      });

      setVidrioList(docs);
    } catch (error) {
      console.log(error);
    }
  };

  //Crear Función getCotiza cuando se deba editar

  const createCotiza = async (cotizaObject) => {
    console.log("creando cotización...");
    setLoadCreate({ loading: true, error: null });
    try {
      await setDoc(doc(conectTbCotiza), cotizaObject);
      setLoadCreate({ loading: false, error: null });
      toast.success("Registro creado con éxito");
      setTimeout(() => {
        toast.dismiss();
      }, 2000);
      navigate.push("/cotizaciones");
    } catch (error) {
      console.log(error);
      setLoadCreate({ loading: false, error: error });
    }
  };

  // const updateCotiza = async (cotizaObject) => {
  //   setLoadCreate({ loading: true, error: null });
  //   try {
  //     const docRef = doc(db, "Cotizaciones", idDoc); //Me conecto a la BD firebase y busco el registro por su Id
  //     await updateDoc(docRef, cotizaObject);
  //     toast.success("Registro actualizado con éxito");
  //     setTimeout(() => {
  //       toast.dismiss();
  //     }, 2000);
  //     getRecetaItem();
  //   } catch (error) {
  //     setLoadCreate({ loading: false, error: error });
  //   }
  // };

  const handleChange = (e) => {
    setValueState({ ...valueState, [e.target.name]: e.target.value });
  };

  const handleClient = (e) => {
    const clientSelected = dataList.filter((cliente) => {
      return cliente.idReg === e.target.value;
    });
    setValueState({ ...valueState, cliente: clientSelected[0] });
  };

  // const handleCheck = (field) => {
  //   setValueState({
  //     ...valueState,
  //     [field]: !valueState[field],
  //   });
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    blockButton();
    createCotiza(valueState);
    // if (!isEdit) {
    //   createCotiza(valueState);
    // } else {
    //   updateCotiza(valueState);
    // }
  };

  // Esta función evita que al dar varios clics sobre el botón de crear añada otro registro
  // Problema encontrado al guardar un nuevo registro y pulsar doble clic sobre el botón
  const blockButton = () => {
    document.getElementById("create").disabled = true;
  };

  const updateStatefinal = () => {
    setValueState({
      ...valueState,
      productos: state.itemsCotiza,
      totalesCotiza: state.totalesCotiza,
    });
    setLoadCreate({ ...loadCreate, confirmSave: true });
  };

  console.log(valueState);
  console.log(state);
  console.log(itemVidrioList);

  return (
    <>
      <div
        className={stylesCot.crudRecContainer}
        style={{ position: "relative" }}
      >
        <h2>
          {idDoc === "new" ? "Creando Cotización" : "Editando Cotización"}
        </h2>
        {loadCreate.loading === false ? (
          <form
            id="form"
            onSubmit={handleSubmit}
            className={`${styles["form-default"]} ${styles.formCotiza}`}
          >
            <span className={styles.idField}>
              <CustomInput
                typeInput="text"
                nameInput="idReg"
                valueInput={valueState.idReg}
                onChange={handleChange}
                nameLabel="Cotización #"
                required={true}
                disabled={idDoc !== "new" ? true : false}
              />
              <span className={styles.selectContainer}>
                <b>* Cliente:</b>
                <select name="nombreCli" onChange={handleClient} required>
                  {valueState.cliente.idReg ? (
                    <option
                      key={valueState.cliente.id}
                      value={valueState.cliente.idReg}
                    >
                      {valueState.cliente.nombreCliente}
                    </option>
                  ) : (
                    <option value="" label="Elegir Cliente">
                      Elegir Cliente
                    </option>
                  )}
                  {dataList.map((cliente) => {
                    if (cliente.estatus) {
                      return (
                        <option
                          key={cliente.idReg}
                          value={cliente.idReg}
                        >{`${cliente.nombreCliente} | ${cliente.idReg}`}</option>
                      );
                    }
                  })}
                </select>
              </span>
              <CustomInput
                typeInput="date"
                nameInput="fechaElab"
                valueInput={valueState.fechaElab}
                onChange={handleChange}
                nameLabel="Fecha Elaboración"
                required={true}
              />
              <CustomInput
                typeInput="date"
                nameInput="fechaValid"
                valueInput={valueState.fechaValid}
                onChange={handleChange}
                nameLabel="Fecha Validación"
                required={true}
              />
            </span>
            <span className={styles.containerAgrupFields}>
              <CustomInput
                typeInput="text"
                nameInput="responsable"
                valueInput={valueState.responsable}
                onChange={handleChange}
                nameLabel="Elaborado por:"
                required={true}
              />
              <CustomInput
                typeInput="text"
                nameInput="descripGeneral"
                valueInput={valueState.descripGeneral}
                onChange={handleChange}
                nameLabel="Descripción General"
                required={true}
              />
            </span>
            <span className={styles.containerAgrupFields}>
              <span className={styles.selectContainer}>
                <b>* Tipo de Aluminio:</b>
                <select name="tipoAluminio" onChange={handleChange} required>
                  {valueState.tipoAluminio ? (
                    <option
                      key={valueState.tipoAluminio}
                      value={valueState.tipoAluminio}
                    >
                      {valueState.tipoAluminio}
                    </option>
                  ) : (
                    <option value="" label="Elegir tipo de Aluminio"></option>
                  )}
                  <option value="claro" label="Aluminio Natural"></option>
                  <option value="oscuro" label="Aluminio Negro"></option>
                </select>
              </span>
              <span className={styles.selectContainer}>
                <b>* Tipo de Vidrio:</b>
                <select name="tipoVidrio" onChange={handleChange} required>
                  {valueState.tipoVidrio && (
                    <option
                      key={valueState.tipoVidrio}
                      value={valueState.tipoVidrio}
                    >
                      {valueState.tipoVidrio}
                    </option>
                  )}
                  {itemVidrioList.map((tipoVidrio) => {
                    return (
                      <option
                        key={tipoVidrio.idReg}
                        value={`${tipoVidrio.idReg}|${tipoVidrio.nombreItem}`}
                      >{`${tipoVidrio.nombreItem}`}</option>
                    );
                  })}
                </select>
              </span>
            </span>

            <span
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-evenly",
                gap: "16px",
              }}
            >
              <h3 style={{ color: "#1a73e8" }}>Detalle Cotización:</h3>
              {valueState.tipoAluminio && valueState.tipoVidrio && (
                <button
                  onClick={() => {
                    showModal();
                  }}
                  type="button"
                  className={stylesCot.buttonAddItems}
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
                      d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                  Agregar Producto
                </button>
              )}
              <span>
                <button
                  onClick={() => {
                    calculaTotales();
                  }}
                  type="button"
                  className={`${stylesCot.buttonAddItems} ${stylesCot.buttonTotaliza}`}
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
                      d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V13.5Zm0 2.25h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V18Zm2.498-6.75h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V13.5Zm0 2.25h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V18Zm2.504-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5Zm0 2.25h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V18Zm2.498-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5ZM8.25 6h7.5v2.25h-7.5V6ZM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 0 0 2.25 2.25h10.5a2.25 2.25 0 0 0 2.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0 0 12 2.25Z"
                    />
                  </svg>
                  Totalizar
                </button>
              </span>
            </span>
            {state.showModal && (
              <SelectItems
                recetas={recetas}
                tipoAluminio={valueState.tipoAluminio}
                tipoVidrio={valueState.tipoVidrio}
              />
            )}
            {idDoc === "new" && state.itemsCotiza.length > 0 ? (
              <DetalleCotiza detalle={state.itemsCotiza} />
            ) : (
              idDoc !== "new" && (
                <DetalleCotiza detalle={valueState.productos} />
              )
            )}
            {state.itemsCotiza.length > 0 && (
              <span className={stylesCot.modalSaveCotiza}>
                {loadCreate.confirmSave && (
                  <span className={stylesCot.confirmSaveCotiza}>
                    <b>¿Desea guardar la cotización?</b>
                    <span className={styles.buttonContainer}>
                      <button
                        id="create"
                        className={stylesCot.saveButton}
                        title="Guardar Cotización"
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
                            d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 0 1 9 9v.375M10.125 2.25A3.375 3.375 0 0 1 13.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 0 1 3.375 3.375M9 15l2.25 2.25L15 12"
                          />
                        </svg>
                      </button>
                      <button
                        title="Regresar"
                        type="button"
                        id={stylesCot.returnButton}
                        onClick={() => {
                          setLoadCreate({ ...loadCreate, confirmSave: false });
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
                            d="m15 15 6-6m0 0-6-6m6 6H9a6 6 0 0 0 0 12h3"
                          />
                        </svg>
                      </button>
                    </span>
                  </span>
                )}
                <span
                  style={{
                    display: "flex",
                    width: "50%",
                    background: "#1a73e8",
                    alignItems: "center",
                    padding: "4px 20px",
                    justifySelf: "flex-end",
                    margin: "0 10px",
                    borderRadius: "12px",
                  }}
                >
                  <h2
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      textAlign: "end",
                      width: "100%",
                    }}
                  >
                    Total Global cotización:
                    <b
                      style={{ color: "white", fontWeight: "500" }}
                    >{`${state.totalesCotiza.subTotIva} $`}</b>
                  </h2>
                </span>
              </span>
            )}
            {!loadCreate.confirmSave && (
              <span className={styles.buttonContainer}>
                {state.itemsCotiza.length > 0 && (
                  <button
                    title="Confirmar"
                    type="button"
                    className={styles["formButton"]}
                    onFocus={() => {
                      calculaTotales();
                    }}
                    onClick={() => {
                      updateStatefinal();
                    }}
                  >
                    {idDoc === "new" ? (
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
                          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className={styles.updateButton}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                        />
                      </svg>
                    )}
                  </button>
                )}

                <button
                  tittle="Cancelar"
                  className={`${styles.formButton}`}
                  id="cancelButton"
                >
                  <Link href="/cotiza" className={`${styles.cancelButton}`}>
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
                  </Link>
                </button>
              </span>
            )}
          </form>
        ) : (
          <h1>Loading...</h1>
        )}
      </div>
    </>
  );
};

export default Page;
