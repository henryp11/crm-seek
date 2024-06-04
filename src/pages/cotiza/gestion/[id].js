"use client";
import React, { useState, useContext, useEffect } from "react";
// import { useRouter, usePathname, useSearchParams } from "next/navigation";
// import { usePathname, useSearchParams } from "next/navigation";
import { usePathname } from "next/navigation";
import { useRouter as useNextRouter } from "next/router";
import Link from "next/link";
//import { toast } from "react-hot-toast";
import Appcontext from "../../../context/AppContext";
import { db } from "../../../server/firebase"; //Traigo conexión a firebase desde configuración realizada en el archivo firebase.js
import {
  collection,
  getDocs,
  //doc,
  //setDoc,
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
  //const navigate = useRouter(); //Usado de next/navigation para realizar push a otras rutas
  const nextRouter = useNextRouter(); //usado de next/router para extraer el query params de la ruta (el id de cada registro de firebase)
  const idDoc = nextRouter.query.id;
  const ruta = usePathname();
  //const queryParams = useSearchParams(); //usado desde next/navigation para extraer los parametros como variables enviados (despues de ?)
  //const isEdit = queryParams.get("edit");

  const conectTbRecetas = collection(db, "Recetas");
  //const conectTbCotiza = collection(db, "Cotizaciones");

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
    areaVidrio: "",
    responsable: "",
    productos: [],
  };

  const [valueState, setValueState] = useState(initialState);
  const [recetas, setRecetas] = useState([]);
  const [itemVidrioList, setVidrioList] = useState([]); //Trae items que comiencen con Vidrio
  const [loadCreate, setLoadCreate] = useState({
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (state.showModal) {
      showModal();
    }
    getSimpleDataDb("Clientes");
    getVidrio();
    getRecetas();
  }, [ruta]);

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

  // const createCotiza = async (cotizaObject) => {
  //   setLoadCreate({ loading: true, error: null });
  //   try {
  //     await setDoc(doc(conectTbCotiza), cotizaObject);
  //     setLoadCreate({ loading: false, error: null });
  //     toast.success("Registro creado con éxito");
  //     setTimeout(() => {
  //       toast.dismiss();
  //     }, 2000);
  //     navigate.push("/cotiza");
  //   } catch (error) {
  //     setLoadCreate({ loading: false, error: error });
  //   }
  // };

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
    // if (!isEdit) {
    //   blockButton();
    //   createCotiza(valueState);
    // } else {
    //   updateCotiza(valueState);
    // }
  };

  // Esta función evita que al dar varios clics sobre el botón de crear añada otro registro
  // Problema encontrado al guardar un nuevo registro y pulsar doble clic sobre el botón
  // const blockButton = () => {
  //   document.getElementById("create").disabled = true;
  // };

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
            </span>
            <span className={styles.containerAgrupFields}>
              <span className={styles.selectContainer}>
                <b>* Tipo de Aluminio:</b>
                <select name="tipoAluminio" onChange={handleChange} required>
                  <option value="" label="Elegir tipo de Aluminio"></option>
                  <option value="claro" label="Aluminio Claro">
                    Aluminio Claro
                  </option>
                  <option value="oscuro" label="Aluminio Oscuro">
                    Aluminio Oscuro
                  </option>
                </select>
              </span>
              <span className={styles.selectContainer}>
                <b>* Tipo de Vidrio:</b>
                <select name="tipoVidrio" onChange={handleChange} required>
                  <option value="" label="Elegir tipo de Vidrio"></option>
                  <option value="templado" label="Procesado Templado">
                    Procesado Templado
                  </option>
                  <option value="camara" label="Procesado Cámara">
                    Procesado Cámara
                  </option>
                  <option value="laminado" label="Crudo Laminado">
                    Crudo Laminado
                  </option>
                  <option value="flotado" label="Crudo Flotado">
                    Crudo Flotado
                  </option>
                </select>
              </span>
              <span className={styles.selectContainer}>
                <b>* Tipo de Vidrio:</b>
                <select name="tipoVidrio" onChange={handleChange} required>
                  {valueState.tipoVidrio ? (
                    <option
                      key={valueState.tipoVidrio}
                      value={valueState.tipoVidrio}
                    >
                      {valueState.tipoVidrio}
                    </option>
                  ) : (
                    <option value="" label="Tipo de Vidrio">
                      Tipo de Vidrio
                    </option>
                  )}
                  {itemVidrioList.map((tipoVidrio) => {
                    return (
                      <option
                        key={tipoVidrio.idReg}
                        value={tipoVidrio.nombreItem}
                      >{`${tipoVidrio.nombreItem}`}</option>
                    );
                  })}
                </select>
              </span>
              <CustomInput
                typeInput="text"
                nameInput="areaVidrio"
                valueInput={valueState.areaVidrio}
                onChange={handleChange}
                nameLabel="Área Vidrio"
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
                nameInput="fechaElab"
                valueInput={valueState.fechaElab}
                onChange={handleChange}
                nameLabel="Fecha Elaboración"
                required={true}
              />
              <CustomInput
                typeInput="text"
                nameInput="fechaValid"
                valueInput={valueState.fechaValid}
                onChange={handleChange}
                nameLabel="Fecha Validación"
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
            <span
              style={{ display: "flex", alignItems: "center", gap: "16px" }}
            >
              <h3>Detalle Cotización:</h3>
              <button
                onClick={() => {
                  showModal();
                }}
                type="button"
                className={stylesCot.buttonAddItems}
              >
                Agregar Producto
              </button>
              <span>
                <button
                  onClick={() => {
                    calculaTotales();
                  }}
                  type="button"
                  className={stylesCot.buttonAddItems}
                >
                  Totalizar
                </button>
              </span>
            </span>
            <div>
              {/* <table className="table_factDetails table_factDetails--create">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Producto</th>
                    <th>Cant.</th>
                    <th>Unid. Med.</th>
                    <th>Precio Unitario</th>
                    <th>SubTotal</th>
                    <th>% Dcto</th>
                    <th>Valor Dcto</th>
                    <th>Total</th>
                    <th>IVA</th>
                    <th>Total Final</th>
                  </tr>
                </thead>
                <tbody>
                  {state.itemsFactura.map((item, pos) => {
                    return (
                      <tr key={item.idItem}>
                        <td>{pos + 1}</td>
                        <td>
                          <input
                            type="number"
                            name="cantFact"
                            value={item.cantFact}
                            onChange={handleChangeItems(
                              item.idItem,
                              "number",
                              1
                            )}
                            onBlur={calculaTotales}
                          />
                        </td>
                        <td>{item.unidMed}</td>
                        <td>
                          <input
                            type="number"
                            placeholder="precioUni"
                            name="precio"
                            value={item.precios[0].precio}
                            onChange={handleChangeItems(
                              item.idItem,
                              "number",
                              2
                            )}
                            onBlur={calculaTotales}
                          />
                        </td>
                        <td>
                          <p>
                            {(item.cantFact * item.precios[0].precio).toFixed(
                              2
                            )}
                            $
                          </p>
                        </td>
                        <td>
                          <input
                            type="number"
                            placeholder="DCTO"
                            name="dcto"
                            value={item.precios[0].dcto}
                            onChange={handleChangeItems(
                              item.idItem,
                              "number",
                              2
                            )}
                            onBlur={calculaTotales}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            placeholder="ValDcto"
                            value={calcDcto(
                              item.cantFact * item.precios[0].precio,
                              item.precios[0].dcto
                            ).toFixed(2)}
                            onBlur={calculaTotales}
                            min="0"
                            disabled
                          />
                        </td>
                        <td>
                          <p>
                            {calcSubTotal(
                              item.cantFact * item.precios[0].precio,
                              item.precios[0].dcto
                            ).toFixed(2)}
                            $
                          </p>
                        </td>
                        <td>
                          <p>
                            {calcIVA(
                              item.cantFact * item.precios[0].precio,
                              item.precios[0].dcto,
                              item.precios[0].iva
                            ).toFixed(2)}
                            $
                          </p>
                        </td>
                        <td>
                          <p>
                            {calcTotFinal(
                              item.cantFact * item.precios[0].precio,
                              item.precios[0].dcto,
                              item.precios[0].iva
                            ).toFixed(2)}
                            $
                          </p>
                        </td>
                        <td
                          className="icons-item--add-remove"
                          style={{ "justify-content": "flex-end" }}
                        >
                          <span
                            className="icons"
                            onClick={() => {
                              removeItemFact(item);
                            }}
                          >
                            <ion-icon name="trash-outline"></ion-icon>
                            <ToolTip
                              msg="Quitar Item"
                              position="tooltip-left"
                            />
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="iconsContainerFact">
                    <span
                      className="icons"
                      onClick={() => {
                        calculaTotales();
                        creaObjetoFinal();
                      }}
                    ></span>
                    <span
                      className="icons"
                      onClick={() => {
                        calculaTotales();
                        creaObjetoFinal();
                        setShowSaveFact(!showSaveFact);
                        setShowHeader({
                          ...showHeader,
                          activate: false,
                        });
                      }}
                    ></span>
                  </tr>
                  {showSaveFact && (
                    <tr id="alertSaveFact">
                      <div>
                        <p>
                          <b>
                            <ion-icon name="alert-circle-outline"></ion-icon>
                          </b>
                          ¿Desea guardar la factura actual?
                        </p>
                        <span>
                          <button className="icons" title="SI">
                            <ion-icon src="/icons/checkmark-circle.svg"></ion-icon>
                          </button>
                          <i
                            onClick={() => {
                              setShowSaveFact(!showSaveFact);
                            }}
                            className="icons"
                            title="NO"
                          >
                            <ion-icon src="/icons/close-circle.svg"></ion-icon>
                          </i>
                        </span>
                      </div>
                    </tr>
                  )}
                  <tr>
                    <td>Subtotal 0%:</td>
                    <td>$ {state.totalesFactura.subTotIva0.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>Subtotal con IVA:</td>
                    <td>$ {state.totalesFactura.subTotIva.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>Subtotal sin Impuestos:</td>
                    <td>
                      ${" "}
                      {(
                        state.totalesFactura.subTotIva0 +
                        state.totalesFactura.subTotIva
                      ).toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td>Descuento Total:</td>
                    <td>$ {state.totalesFactura.totalDcto.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>Total IVA:</td>
                    <td>$ {state.totalesFactura.ivaTotal.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>Valor Total:</td>
                    <td>
                      ${" "}
                      {(
                        state.totalesFactura.subTotIva0 +
                        state.totalesFactura.subTotIva -
                        state.totalesFactura.totalDcto +
                        state.totalesFactura.ivaTotal
                      ).toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table> */}
            </div>
            {state.showModal && (
              <SelectItems
                recetas={recetas}
                tipoAluminio={valueState.tipoAluminio}
                tipoVidrio={valueState.tipoVidrio}
              />
            )}
            {state.itemsCotiza.length > 0 && (
              <DetalleCotiza detalle={state.itemsCotiza} />
            )}

            <span className={styles.buttonContainer}>
              <button
                id="create"
                title="Guardar"
                className={styles["formButton"]}
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
          </form>
        ) : (
          <h1>Loading...</h1>
        )}
      </div>
    </>
  );
};

export default Page;
