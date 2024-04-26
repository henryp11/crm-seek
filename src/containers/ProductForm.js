"use client";
import React, { useState } from "react";
import Link from "next/link.js";
import { toast } from "react-hot-toast";
import CustomInput from "../components/CustomInput";
import { storage } from "../server/firebase";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage"; //Storage de firebase para almacenar archivos
import styles from "../styles/forms.module.css";

const ProductForm = ({ funCreate, funUpdate, idDoc, data }) => {
  const [valueState, setValueState] = useState(data);
  const [archivo, setArchivo] = useState(null); //captura archivo a subir a storage
  const [previewImg, setPreviewImg] = useState(""); //Para mostrar un preview de la imagen a subir
  const [isUpload, setIsUpload] = useState(true); //Detecta si se selecciona una imagen para obligar a subirle primero
  const [nameImgInicial, setNameImgInicial] = useState(data.image.name); //Se utiliza al editar un producto para capturar el nombre de la imagen si existe y poderla eliminar si se requiere
  console.log(data);

  const handleChange = (e) => {
    setValueState({ ...valueState, [e.target.name]: e.target.value });
  };

  const handleCheck = (field) => {
    setValueState({
      ...valueState,
      [field]: !valueState[field],
    });
  };

  console.log(archivo);
  // Para detectar la selección de un archivo
  const handleFile = (e) => {
    //Detectar archivo
    const fileDetect = e.target.files[0];
    if (fileDetect) {
      setArchivo(fileDetect);
      const reader = new FileReader(); //Objeto de JS para poder previsualizar la imagen seleccionada
      //Carga el resultado de la imagen capturada
      reader.onload = () => {
        setPreviewImg(reader.result);
      };
      reader.readAsDataURL(fileDetect); //Transforma imagen capturada en string de tipo byte 64 para poderlo visualizar

      //Cada vez que se elija una imagen primero guardo el nombre de esta
      setValueState({
        ...valueState,
        image: { ...valueState.image, name: fileDetect.name },
      });

      setIsUpload(false);
      toast(
        "No olvide dar clic en [SUBIR IMAGEN] antes de guardar el producto!",
        {
          icon: "🔔",
          duration: 4000,
        }
      );
    } else {
      //Si se cancela la selección de una imagen se quita el preview y se encera los campos de la imagen
      setPreviewImg("");
      setValueState({ ...valueState, image: { name: "", url: "" } });
      setIsUpload(true);
    }
  };

  //Función para eliminar una imagen del storage,
  //ya sea al momento de cambiarla o directamente si se requiere quitarla por eso se captura el nombre inicial del objeto
  const deleteImageOld = () => {
    const desertRef = ref(storage, `documentos/${nameImgInicial}`);
    deleteObject(desertRef)
      .then(() => {
        console.log("File deleted successfully");
        setNameImgInicial(valueState.image.name);
      })
      .catch((error) => {
        console.log("Uh-oh, an error occurred!" + error);
        if (!nameImgInicial) {
          setNameImgInicial(valueState.image.name);
        }
      });
  };

  const removeImage = () => {
    const desertRef = ref(storage, `documentos/${nameImgInicial}`);
    deleteObject(desertRef)
      .then(() => {
        console.log("File deleted successfully");
        setValueState({ ...valueState, image: { name: "", url: "" } });
        setNameImgInicial("");
        setPreviewImg("");
      })
      .catch((error) => {
        console.log(`Error al eliminar: ${error}`);
      });
  };

  //Función que se encargará de cargar la imagen al storage de Firebase
  const handleStorage = async () => {
    if (archivo) {
      //Cargar al Storage
      const refArchivo = ref(storage, `documentos/${valueState.image.name}`);
      await uploadBytes(refArchivo, archivo); //Carga el URL y el archivo al storage
      //Obtengo URL de la imagen en Storage para colocarla en el producto a crear
      let urlArchivo = await getDownloadURL(refArchivo);
      setValueState({
        ...valueState,
        image: { ...valueState.image, url: urlArchivo },
      });
      //Solo se ejecuta si el nombre de la imagen inicial es distinto de la nueva imagen
      //Ya que si sube una imagen con un nombre  igual al nombre inicial que tenía al momento
      //De comenzar la edición, se subirá la imagen y al mismo tiempo se eliminaría.
      if (nameImgInicial !== valueState.image.name) {
        deleteImageOld(); //Se elimina la imagen anterior del Storage si existiera
      }

      toast.success("Imagen subida con éxito!");
      setIsUpload(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    blockButton();
    idDoc !== "new"
      ? funUpdate(valueState, valueState.id)
      : funCreate(valueState);
  };

  // Esta función evita que al dar varios clics sobre el botón de crear añada otro registro
  // Problema encontrado al guardar un nuevo registro y pulsar doble clic sobre el botón
  const blockButton = () => {
    document.getElementById("create").disabled = true;
  };

  console.log(valueState);
  console.log({ preview: previewImg });
  console.log(nameImgInicial);

  return (
    <form
      id="form"
      onSubmit={handleSubmit}
      className={`${styles["form-default"]} ${styles.formItems}`}
    >
      <div>
        <span className={styles.idField}>
          <CustomInput
            typeInput="text"
            nameInput="idReg"
            valueInput={valueState.idReg}
            onChange={handleChange}
            nameLabel="Id.Producto"
            required={true}
            disabled={idDoc !== "new" ? true : false}
          />

          <CustomInput
            typeInput="text"
            nameInput="nombreItem"
            valueInput={valueState.nombreItem}
            onChange={handleChange}
            nameLabel="Descripción"
            required={true}
          />
        </span>
        <span className={styles.containerAgrupFields}>
          <CustomInput
            typeInput="text"
            nameInput="categoria"
            valueInput={valueState.categoria}
            onChange={handleChange}
            nameLabel="Categoria"
            required={true}
          />
          <CustomInput
            typeInput="text"
            nameInput="subCategoria"
            valueInput={valueState.subCategoria}
            onChange={handleChange}
            nameLabel="Sub-Categoria / Clase"
            required={true}
          />
          <CustomInput
            typeInput="text"
            nameInput="unidMed"
            valueInput={valueState.unidMed}
            onChange={handleChange}
            nameLabel="Unidad de Medida"
            required={true}
          />
        </span>
        <span className={styles.containerAgrupFields}>
          <CustomInput
            typeInput="number"
            nameInput="precio"
            valueInput={valueState.precio}
            onChange={handleChange}
            nameLabel="Precio Aluminio Claro"
            required={true}
          />
          <CustomInput
            typeInput="number"
            nameInput="precio2"
            valueInput={valueState.precio2}
            onChange={handleChange}
            nameLabel="Precio Aluminio Oscuro"
            required={true}
          />
          <CustomInput
            typeInput="number"
            nameInput="costo"
            valueInput={valueState.costo}
            onChange={handleChange}
            nameLabel="Costo"
          />
          <span className={styles.containerAgrupFields}>
            <CustomInput
              typeInput="checkbox"
              nameInput="isCompon"
              isChecked={valueState.isCompon}
              onChange={() => {
                handleCheck("isCompon");
              }}
              nameLabel="Componente?"
            />
            <CustomInput
              typeInput="checkbox"
              nameInput="estatus"
              isChecked={valueState.estatus}
              onChange={() => {
                handleCheck("estatus");
              }}
              nameLabel="Activo?"
            />
          </span>
        </span>
        <span className={styles.buttonContainer}>
          {isUpload && (
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
          )}
          <button
            tittle="Cancelar"
            className={`${styles.formButton}`}
            id="cancelButton"
          >
            <Link href="/products" className={`${styles.cancelButton}`}>
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
      </div>
      <div className={styles.inputImage}>
        <span>
          <input type="file" id="file" onChange={handleFile} />
        </span>
        {/* Se mostrará la imagen desde Storage solo si ya existe en el producto desde Firestore */}
        {idDoc !== "new" &&
          valueState.image.url.startsWith("http") &&
          !archivo && (
            <img
              src={valueState.image.url}
              alt={valueState.image.url}
              className={styles.previewImage}
            />
          )}
        {/* Se mostrará solo para Preview al momento de seleccionar imagenes */}
        <div className={styles.containerPreview}>
          {archivo && (
            <>
              <img
                src={previewImg}
                alt={valueState.image.name}
                className={styles.previewImage}
              />
              {previewImg && (
                <>
                  <button
                    onClick={() => {
                      handleStorage();
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
                        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                      />
                    </svg>
                    Subir Imágen
                  </button>
                </>
              )}
            </>
          )}
          {/* Elimina directamente una imagen ya existente */}
          {idDoc !== "new" && valueState.image.url.startsWith("http") && (
            <button
              onClick={() => {
                removeImage();
              }}
              className={styles.removeImage}
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
                  d="M15 13.5H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
                />
              </svg>
              Quitar Imágen
            </button>
          )}
        </div>
      </div>
    </form>
  );
};

export default ProductForm;
