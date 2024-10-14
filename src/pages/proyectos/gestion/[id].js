"use client";
import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useRouter as useNextRouter } from "next/router";
import { redirectJwt } from "../../../helpers/FunctionsHelps";
import ProyForm from "../../../containers/ProyForm";
import { toast } from "react-hot-toast";
import { db } from "../../../server/firebase"; //Traigo conexión a firebase desde configuración realizada en el archivo firebase.js
import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore"; //Conectarse a colecciones y traer los datos
import stylesCli from "../clients.module.css";

const Page = () => {
  const navigate = useRouter(); //Usado de next/navigation para realizar push a otras rutas
  const nextRouter = useNextRouter(); //usado de next/router para extraer el query params de la ruta (el id de cada registro de firebase)
  const idFirebase = nextRouter.query.id;
  // const params = useSearchParams(); //usado desde next/navigation para extraer los parametros como variables enviados (despues de ?)
  const ruta = usePathname();
  // Funciones y objetos desde contexto inicial
  // const { showModal, state } = useContext(Appcontext);
  const conectTbProyectos = collection(db, "Proyectos");
  const initialState = {
    nombreProy: "",
    observac: "",
    fechaIni: "",
    direccion: "",
    estatus: true,
  };
  const [dataClient, setDataClient] = useState(initialState);
  const [loadCreate, setLoadCreate] = useState({
    loading: false,
    error: null,
  });

  useEffect(() => {
    getClient();
    redirectJwt(navigate);
  }, [ruta]);

  // Obtengo datos del Proyecto a modificar (funciones Firebase)
  const getClient = async () => {
    if (idFirebase !== "new") {
      console.log(idFirebase);
      setLoadCreate({ loading: true, error: null });
      try {
        const docRef = doc(db, "Proyectos", idFirebase);
        const docSnap = await getDoc(docRef); //Obtengo el dato por su id único de Firebase

        if (docSnap.exists()) {
          const cliente = docSnap.data();
          setDataClient({ ...cliente, id: idFirebase });
          setLoadCreate({ loading: false, error: null });
        } else {
          toast.error("Proyecto no encontrado!!");
        }
      } catch (error) {
        setLoadCreate({ loading: false, error: error });
      }
    }
  };

  const createClient = async (clientObject) => {
    setLoadCreate({ loading: true, error: null });
    try {
      await setDoc(doc(conectTbProyectos), clientObject);
      setLoadCreate({ loading: false, error: null });
      toast.success("Registro creado con éxito");
      setTimeout(() => {
        toast.dismiss();
      }, 2000);
      navigate.push("/proyectos");
    } catch (error) {
      setLoadCreate({ loading: false, error: error });
    }
  };

  const updateClient = async (clientObject) => {
    setLoadCreate({ loading: true, error: null });
    try {
      const docRef = doc(db, "Proyectos", idFirebase); //Me conecto a la BD firebase y busco el cliente por su Id
      await updateDoc(docRef, clientObject);
      toast.success("Registro actualizado con éxito");
      setTimeout(() => {
        toast.dismiss();
      }, 2000);
      getClient();
    } catch (error) {
      setLoadCreate({ loading: false, error: error });
    }
  };

  console.log(dataClient);

  return (
    <>
      <div className={stylesCli.crudProdContainer}>
        <h2>
          {idFirebase === "new" ? "Creando Registro" : "Editando Registro"}
        </h2>
        {loadCreate.loading === false ? (
          <ProyForm
            funCreate={createClient}
            funUpdate={updateClient}
            idDoc={idFirebase}
            data={dataClient}
          />
        ) : (
          <h1>Loading...</h1>
        )}
      </div>
    </>
  );
};

export default Page;
