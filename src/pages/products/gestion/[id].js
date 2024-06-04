"use client";
import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
// import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useRouter as useNextRouter } from "next/router";
import ProductForm from "../../../containers/ProductForm";
import { toast } from "react-hot-toast";
import { db } from "../../../server/firebase"; //Traigo conexión a firebase desde configuración realizada en el archivo firebase.js
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore"; //Conectarse a colecciones y traer los datos
import stylesProd from "../products.module.css";

const Page = () => {
  const navigate = useRouter(); //Usado de next/navigation para realizar push a otras rutas
  const nextRouter = useNextRouter(); //usado de next/router para extraer el query params de la ruta (el id de cada registro de firebase)
  const idFirebase = nextRouter.query.id;
  // const params = useSearchParams(); //usado desde next/navigation para extraer los parametros como variables enviados (despues de ?)
  const ruta = usePathname();
  // Funciones y objetos desde contexto inicial
  // const { showModal, state } = useContext(Appcontext);
  const conectTbProductos = collection(db, "Productos");
  const initialState = {
    idReg: "",
    nombreItem: "",
    categoria: "",
    subCategoria: "",
    unidMed: "",
    precio: 0,
    precio2: 0,
    costo: 0,
    image: { name: "", url: "" },
    isCompon: false,
    haveRecipe: false,
    estatus: true,
  };
  const [dataProduct, setDataProduct] = useState(initialState);
  const [loadCreate, setLoadCreate] = useState({
    loading: false,
    error: null,
  });

  useEffect(() => {
    getProduct();
  }, [ruta]);

  // Obtengo datos del Producto a modificar (funciones Firebase)
  const getProduct = async () => {
    if (idFirebase !== "new") {
      console.log(idFirebase);
      setLoadCreate({ loading: true, error: null });
      try {
        const docRef = doc(db, "Productos", idFirebase); //Me conecto a la BD firebase y busco el registro por su Id
        const docSnap = await getDoc(docRef); //Obtengo el dato por su id único de Firebase
        if (docSnap.exists()) {
          const producto = docSnap.data();
          setDataProduct({ ...producto, id: idFirebase });
          setLoadCreate({ loading: false, error: null });
        } else {
          toast.error("Producto no encontrado!!");
          setTimeout(() => {
            toast.dismiss();
          }, 2000);
        }
      } catch (error) {
        setLoadCreate({ loading: false, error: error });
      }
    }
  };

  const createProduct = async (productObject) => {
    setLoadCreate({ loading: true, error: null });
    try {
      await setDoc(doc(conectTbProductos), productObject);
      setLoadCreate({ loading: false, error: null });
      toast.success("Registro creado con éxito");
      setTimeout(() => {
        toast.dismiss();
      }, 2000);
      navigate.push("/products");
    } catch (error) {
      setLoadCreate({ loading: false, error: error });
    }
  };

  /**Función para actualizar la porción de datos de los productos que están
  en la colección "Recetas" y hacer la actualziación en cascada de todos los documentos
  que requieran esa información desde el origen (productos)**/

  const UpdateDataReceta = async (productObject, idReg) => {
    const ref = [];
    //Busco la referencia del Producto como un query,
    //Dentro de la colección Recetas, ya que al crear una receta almaceno el id del documento de producto En el parámetro idDocItem
    const queryDb = query(
      collection(db, "Recetas"),
      where("idDocItem", "==", idReg)
    );
    const querySnapshot = await getDocs(queryDb);
    //Si lo encuentra guardo dentro del array solamente el id de la receta que contiene ese producto
    querySnapshot.forEach((doc) => {
      ref.push(doc.id);
    });
    const refUpdateReceta = ref[0]; //Solo debería existir un id único por eso tomo la primera posición
    console.log({ itemRefReceta: refUpdateReceta });

    //Con el id de la receta obtenido, se procede a actualizar
    // los campos que se requiere en la receta (nombre del item, URL de la imagen)
    try {
      const docUpdate = doc(db, "Recetas", refUpdateReceta);
      await updateDoc(docUpdate, {
        nombreProducto: productObject.nombreItem,
        url: productObject.image.url,
      });
    } catch (error) {
      console.log(error);
    }
  };

  //Update de datos de componentes en la receta como: Nombre componente, precios
  const UpdateDataRecetaComponent = async (idReg, productObject) => {
    const ref = [];
    //Busco la referencia del Producto como un query,
    //Dentro de la colección Recetas, ya que al crear una receta almaceno el id del documento de producto En el parámetro idDocItem
    // const queryDb = query(
    //   collection(db, "Recetas"),
    //   where("setFabricacion", "array-contains-any", [
    //     { componentes: { "array-contains": { idCompon: idReg } } },
    //   ])
    // );
    // const querySnapshot = await getDocs(queryDb);
    // //Si lo encuentra guardo dentro del array solamente el id de la receta que contiene ese producto
    // querySnapshot.forEach((doc) => {
    //   ref.push(doc.id);
    // });

    try {
      onSnapshot(collection(db, "Recetas"), (querySnapshot) => {
        const docs = [];
        querySnapshot.forEach((doc) => {
          const setFabricacion = doc.data().setFabricacion;
          setFabricacion.forEach((set) => {
            const componentes = set.componentes;
            componentes.forEach((componente) => {
              if (componente.idCompon === idReg) {
                // console.log(doc.id, " => ", doc.data());
                docs.push({ ...doc.data(), id: doc.id });
              }
            });
          });
        });
        console.log(docs);
      });
    } catch (error) {
      setLoadData({ loading: false, error: error });
    }

    // const refUpdateReceta = ref[0]; //Solo debería existir un id único por eso tomo la primera posición
    // console.log({ itemRefReceta: refUpdateReceta });

    // //Con el id de la receta obtenido, se procede a actualizar
    // // los campos que se requiere en la receta (nombre del item, URL de la imagen)
    // try {
    //   const docUpdate = doc(db, "Recetas", refUpdateReceta);
    //   await updateDoc(docUpdate, {
    //     nombreProducto: productObject.nombreItem,
    //     url: productObject.image.url,
    //     // precio: productObject.precio,
    //     // precio2: productObject.precio2,
    //   });
    // } catch (error) {
    //   console.log(error);
    // }
  };

  const updateProduct = async (productObject, idReg) => {
    setLoadCreate({ loading: true, error: null });
    try {
      const docRef = doc(db, "Productos", idFirebase); //Me conecto a la BD firebase y busco el registro por su Id
      await updateDoc(docRef, productObject);
      //SOLO se realiza la actualización en recetas para productos terminados, que son los
      //Que deberían existir en la colección Recetas, así evito realizar lecturas innecesarias
      if (!productObject.isCompon) {
        UpdateDataReceta(productObject, idReg);
      }
      toast.success("Registro actualizado con éxito");
      setTimeout(() => {
        toast.dismiss();
      }, 2000);
      getProduct();
    } catch (error) {
      setLoadCreate({ loading: false, error: error });
    }
  };

  console.log(dataProduct);

  return (
    <>
      <div className={stylesProd.crudProdContainer}>
        <h2>
          {idFirebase === "new" ? "Creando Registro" : "Editando Registro"}
        </h2>
        {loadCreate.loading === false ? (
          <ProductForm
            funCreate={createProduct}
            funUpdate={updateProduct}
            funUpdate2={UpdateDataRecetaComponent}
            idDoc={idFirebase}
            data={dataProduct}
          />
        ) : (
          <h1>Loading...</h1>
        )}
      </div>
    </>
  );
};

export default Page;
