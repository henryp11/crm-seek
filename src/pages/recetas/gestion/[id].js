/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState, useContext, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useRouter as useNextRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-hot-toast";
import AddSetFab from "../../../components/AddSetFab";
import AddFormula from "../../../components/AddFormula";
import Appcontext from "../../../context/AppContext";
import { db } from "../../../server/firebase"; //Traigo conexión a firebase desde configuración realizada en el archivo firebase.js
import { storage } from "../../../server/firebase";
import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore"; //Conectarse a colecciones y traer los datos
import { ref, getDownloadURL } from "firebase/storage";
import styles from "../../../styles/forms.module.css";
import stylesRec from "../recetasTemp.module.css";

// Componente para añadir receta a un producto terminado seleccionado previamente
// en la pantalla de recetas

const Page = () => {
  const { showModal, state } = useContext(Appcontext);
  const navigate = useRouter(); //Usado de next/navigation para realizar push a otras rutas
  const nextRouter = useNextRouter(); //usado de next/router para extraer el query params de la ruta (el id de cada registro de firebase)
  const idFirebase = nextRouter.query.id;
  const ruta = usePathname();
  const queryParams = useSearchParams(); //usado desde next/navigation para extraer los parametros como variables enviados (despues de ?)
  const idItem = queryParams.get("item");
  const nameItem = queryParams.get("name");
  const imgUrl = queryParams.get("img");
  const isEdit = queryParams.get("edit");

  const conectTbRecetas = collection(db, "Recetas");

  const initialState = {
    idReg: "",
    idDocItem: "",
    nombreProducto: "",
    url: "",
    setFabricacion: [],
  };
  const [valueState, setValueState] = useState(initialState);
  const [loadCreate, setLoadCreate] = useState({
    loading: false,
    error: null,
  });
  console.log(loadCreate);

  const [secuencial, setSecuencial] = useState(0);
  //Se usara para editar set's ya añadidos en la creación
  const [setToEdit, setSetToEdit] = useState({});

  //Para añadir fórmula de cálculo por componente
  const [openModalFormula, setOpenModalFormula] = useState(false);
  const [idComponSelect, setIdComponSelect] = useState("");
  const [idSetSelect, setIdSetSelect] = useState("");
  const [componFormula, setComponFormula] = useState({});

  useEffect(() => {
    if (state.showModal) {
      showModal();
    }
    if (isEdit) {
      getRecetaItem();
    }

    if (!isEdit) {
      getImgRef();
    }
  }, [ruta]);

  //Obtengo referencia para llamar imagen desde firestore/sotrage ya que al pasar la url como param envía encriptado
  const getImgRef = async () => {
    if (imgUrl) {
      try {
        const refArchivo = ref(storage, `documentos/${imgUrl}`);
        //Obtengo URL de la imagen en Storage para colocarla en el producto a crear
        let urlArchivo = await getDownloadURL(refArchivo);
        setValueState({
          ...valueState,
          idReg: idItem,
          idDocItem: idFirebase, //Al añadir receta, el idFirebase es el idDoc del item al cual se añade la receta
          nombreProducto: nameItem,
          url: urlArchivo,
        });
      } catch (error) {
        console.log(`Referencia no encontrada error: ${error}`);
        setValueState({
          ...valueState,
          idReg: idItem,
          idDocItem: idFirebase, //Al añadir receta, el idFirebase es el idDoc del item al cual se añade la receta
          nombreProducto: nameItem,
          url: "",
        });
      }
    } else {
      setValueState({
        ...valueState,
        idReg: idItem,
        idDocItem: idFirebase, //Al añadir receta, el idFirebase es el idDoc del item al cual se añade la receta
        nombreProducto: nameItem,
        url: "",
      });
    }
  };

  // Obtengo datos de la receta a modificar Funciones Firebase
  const getRecetaItem = async () => {
    setLoadCreate({ loading: true, error: null });
    try {
      const docRef = doc(db, "Recetas", idFirebase);
      const docSnap = await getDoc(docRef); //Obtengo el dato por el id de Firebase

      if (docSnap.exists()) {
        const receta = docSnap.data();
        setValueState({ ...receta, id: idFirebase });
        setLoadCreate({ loading: false, error: null });
      } else {
        window.alert("Item no encontrado!!");
      }
    } catch (error) {
      setLoadCreate({ loading: false, error: error });
    }
  };

  const createReceta = async (recetaObject) => {
    setLoadCreate({ loading: true, error: null });
    try {
      await setDoc(doc(conectTbRecetas), recetaObject);
      //Se actualiza el campo de productos haveRecipe para indicar que ya posee receta el item
      const docRef = doc(db, "Productos", idFirebase);
      await updateDoc(docRef, { haveRecipe: true });

      setLoadCreate({ loading: false, error: null });
      toast.success("Registro creado con éxito");
      setTimeout(() => {
        toast.dismiss();
      }, 2000);
      navigate.push("/recetas");
    } catch (error) {
      setLoadCreate({ loading: false, error: error });
    }
  };

  const updateReceta = async (recetaObject) => {
    setLoadCreate({ loading: true, error: null });
    try {
      const docRef = doc(db, "Recetas", idFirebase); //Me conecto a la BD firebase y busco el registro por su Id
      await updateDoc(docRef, recetaObject);
      toast.success("Registro actualizado con éxito");
      setTimeout(() => {
        toast.dismiss();
      }, 2000);
      getRecetaItem();
    } catch (error) {
      setLoadCreate({ loading: false, error: error });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isEdit) {
      blockButton();
      createReceta(valueState);
    } else {
      updateReceta(valueState);
    }
  };

  // Esta función evita que al dar varios clics sobre el botón de crear añada otro registro
  // Problema encontrado al guardar un nuevo registro y pulsar doble clic sobre el botón
  const blockButton = () => {
    document.getElementById("create").disabled = true;
  };

  // Controla el secuencial a asignar al set de fabricación verificando el último set registrado
  const handleIdSec = () => {
    if (valueState.setFabricacion.length === 0) {
      setSecuencial(1);
    } else {
      let lastId = valueState.setFabricacion.map(({ idSet }) => idSet);
      console.log(lastId);
      setSecuencial(lastId[lastId.length - 1] + 1);
    }
  };

  // Mostrar modal solo para agregar set nuevo, vaciando estado del set a editar
  //Ocurre si se edita un set y luego se añade uno vacio, si no se vacia el estado
  // del set editado se coloca los datos del set anterior, por eso se procede a vaciar
  // el estado de set en edición y así mostrar un modal vacio al añadir un nuevo set
  const showModalNewSet = () => {
    setSetToEdit({});
    showModal();
  };

  // Función para añadir set al estado principal,
  // se envía la función como props al componente AddSetFab el cual la ejecutará
  const addSetFabricacion = (setFab, isEdit, idSetEdit) => {
    if (isEdit) {
      // Cuando se está editando traigo el "query param" "isEdit" de la ruta
      // y aplico un estado solo para la edición y guardar el set ya existente
      // En ese caso se usa la funicón con los 3 parámentros (setFab, isEdit, idSetEdit)
      setValueState({
        ...valueState,
        setFabricacion: [
          ...valueState.setFabricacion.map((setEdited) => {
            if (setEdited.idSet !== idSetEdit) return setEdited;
            return setFab;
          }),
        ],
      });
      showModal();
    } else {
      //Cuando aun no existe en BD solo se envía el parámetro setFab para crear
      setValueState({
        ...valueState,
        setFabricacion: [...valueState.setFabricacion, setFab],
      });
      showModal();
    }
  };

  //Para editar set's ya creados antes de guardar toda la receta
  const editSetFabricacion = (objectSetFab) => {
    setSetToEdit(objectSetFab);
    showModal();
  };

  //Quitar set de fabricación Integro
  const removeSetFab = (payload) => {
    toast(
      (t) => (
        <span className="toasterDelete">
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
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
          <b>¿Desea eliminar totalmente el Set de Fabricación seleccionado?</b>
          <span className="toasterButtons">
            <button
              onClick={() => {
                setValueState({
                  ...valueState,
                  setFabricacion: [
                    ...valueState.setFabricacion.filter(
                      (setFab) => setFab.idSet !== payload
                    ),
                  ],
                });
                toast.dismiss(t.id);
                toast.success("Set Eliminado!", {
                  style: {
                    border: "1px solid rgb(155, 32, 32)",
                    padding: "16px",
                  },
                  iconTheme: {
                    primary: "rgb(155, 32, 32)",
                    secondary: "#FFFAEE",
                  },
                  duration: 1000,
                });
                setTimeout(() => {
                  toast.dismiss();
                }, 2000);
              }}
            >
              SI
            </button>
            <button onClick={() => toast.dismiss(t.id)}>NO</button>
          </span>
        </span>
      ),
      { duration: 60000 }
    );
    // let isDelete = confirm(
    //   "¿Desea eliminar totalmente el Set de Fabricación seleccionado?"
    // );

    // if (isDelete) {
    //   setValueState({
    //     ...valueState,
    //     setFabricacion: [
    //       ...valueState.setFabricacion.filter(
    //         (setFab) => setFab.idSet !== payload
    //       ),
    //     ],
    //   });
    // }
  };

  // Mostrar modal para añadir fórmula

  const showFormula = (idCompon, objectCompon, idSet) => {
    setIdSetSelect(idSet);
    setIdComponSelect(idCompon);
    setComponFormula(objectCompon);
    setOpenModalFormula(!openModalFormula);
  };

  const addFormulas = (componFormula, idSet, idCompon) => {
    setValueState({
      ...valueState,
      setFabricacion: [
        ...valueState.setFabricacion.map((setEdited) => {
          if (setEdited.idSet !== idSet) return setEdited;
          return {
            ...setEdited,
            componentes: [
              ...setEdited.componentes.map((componente) => {
                if (componente.idCompon !== idCompon) return componente;
                return componFormula;
              }),
            ],
          };
        }),
      ],
    });
    setOpenModalFormula(!openModalFormula);
  };

  console.log({ statePageReceta: valueState });
  console.log({ setEdit: setToEdit });
  console.log({ idComponFormula: idComponSelect });
  console.log({ objectoComponente: componFormula });
  console.log(imgUrl);

  return (
    <>
      <div className={stylesRec.crudRecContainer}>
        {!isEdit ? (
          <h2>{`Creando Receta: ${valueState.idReg} - ${valueState.nombreProducto}`}</h2>
        ) : (
          <h2>{`Editando Receta: ${valueState.idReg} - ${valueState.nombreProducto}`}</h2>
        )}

        <form
          id="form"
          onSubmit={handleSubmit}
          className={styles["form-default"]}
        >
          {imgUrl && (
            <figure className={styles.itemImage}>
              <Image
                src={valueState.url}
                // alt={valueState.nombreProducto}
                alt={nameItem}
                layout="fill"
                objectFit="contain"
              />
              {/* <img src={imgUrl} alt="imagen normal" /> */}
            </figure>
          )}

          <button
            className={`${styles.formButton} ${stylesRec.addButton}`}
            title="Crear Set"
            onClick={() => {
              showModalNewSet();
            }}
            type="button"
          >
            Agregar Set de Fabricación
          </button>
          <div className={stylesRec.detalleRecContainer}>
            {valueState.setFabricacion.map((setFab, pos) => {
              return (
                <div key={setFab.idSet} className={stylesRec.setFabricacion}>
                  <h4>{`${pos + 1}) ${setFab.nombreSet}`}</h4>
                  {openModalFormula && (
                    <AddFormula
                      componente={componFormula}
                      openModal={setOpenModalFormula}
                      idSet={idSetSelect}
                      addFormula={addFormulas}
                    />
                  )}
                  <div className={stylesRec.componentesHeader}>
                    <h5>Componentes:</h5>
                    <span className={stylesRec.componenteIcons}>
                      <button
                        title="Editar Set"
                        className={stylesRec.componenteEdit}
                        onClick={() => {
                          editSetFabricacion(setFab);
                        }}
                        type="button"
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
                      <button
                        title="Eliminar Set"
                        className={stylesRec.componenteDelete}
                        onClick={() => {
                          removeSetFab(setFab.idSet);
                        }}
                        type="button"
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
                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                          />
                        </svg>
                      </button>
                    </span>
                  </div>
                  {setFab.componentes.map((componente) => {
                    return (
                      <span
                        key={componente.idCompon}
                        className={stylesRec.componentes}
                      >
                        <b>{componente.nombreCompon}</b>
                        <h6>Dimensiones:</h6>
                        {/* Extraigo dimensiones elegidas para mostrar en pantalla */}
                        {componente.dimensiones && (
                          <span className={stylesRec.componDimensiones}>
                            {/* Transformo objeto a array para extraer el nombre de la key de las medidas seleccionadas (True) para mostrarlas en pantalla */}
                            {Object.entries(componente.dimensiones)
                              .filter((activate) => {
                                return activate[1] === true;
                              })
                              .map((dimension, pos) => {
                                return <i key={pos}>{dimension[0]}</i>;
                              })}
                          </span>
                        )}
                        <button
                          tittle="Agregar fórmula"
                          className={stylesRec.formulaButton}
                          onClick={() => {
                            showFormula(
                              componente.idCompon,
                              componente,
                              setFab.idSet
                            );
                          }}
                          type="button"
                        >
                          Fórmula:
                        </button>
                        <span className={stylesRec.formulaContainer}>
                          <p>
                            <b>F1: </b>
                            {componente.formula1}
                          </p>
                          {componente.formula2 && (
                            <p>
                              <b>F2: </b>
                              {componente.formula2}
                            </p>
                          )}
                        </span>
                      </span>
                    );
                  })}
                </div>
              );
            })}
          </div>
          {state.showModal && (
            <AddSetFab
              // handleId={valueState.setFabricacion.length + 1}
              handleId={handleIdSec}
              addSetButton={addSetFabricacion}
              idSetEdit={setToEdit.idSet !== undefined && setToEdit.idSet}
              toEdit={setToEdit}
              secuencial={secuencial}
            />
          )}
          <span className={styles.buttonContainer}>
            <button
              title="Guardar"
              id="create"
              className={styles["formButton"]}
            >
              {!isEdit ? (
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
                  className={stylesRec.updateButton}
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
              <Link href="/recetas" className={`${styles.cancelButton}`}>
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
      </div>
    </>
  );
};

export default Page;
