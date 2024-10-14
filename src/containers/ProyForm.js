"use client";
import React, { useState } from "react";
import Link from "next/link.js";
import CustomInput from "../components/CustomInput";
import styles from "../styles/forms.module.css";

const ProyForm = ({ funCreate, funUpdate, idDoc, data }) => {
  const [valueState, setValueState] = useState(data);

  const handleChange = (e) => {
    setValueState({ ...valueState, [e.target.name]: e.target.value });
  };

  const handleCheck = (field) => {
    setValueState({
      ...valueState,
      [field]: !valueState[field],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    blockButton();
    idDoc !== "new" ? funUpdate(valueState) : funCreate(valueState);
  };

  // Esta función evita que al dar varios clics sobre el botón de crear añada otro registro
  // Problema encontrado al guardar un nuevo registro y pulsar doble clic sobre el botón
  const blockButton = () => {
    document.getElementById("create").disabled = true;
  };

  console.log(valueState);

  return (
    <form
      id="form"
      onSubmit={handleSubmit}
      className={`${styles["form-default"]}`}
    >
      <div>
        <span className={styles.containerAgrupFields}>
          <CustomInput
            typeInput="text"
            nameInput="nombreProy"
            valueInput={valueState.nombreProy}
            onChange={handleChange}
            nameLabel="Nombre del Proyecto"
            required={true}
          />
          <CustomInput
            typeInput="text"
            nameInput="direccion"
            valueInput={valueState.direccion}
            onChange={handleChange}
            nameLabel="Dirección / Ubicación de Proyecto"
            required={true}
          />
          <CustomInput
            typeInput="date"
            nameInput="fechaIni"
            valueInput={valueState.fechaIni}
            onChange={handleChange}
            nameLabel="Fecha Inicio Proyecto"
          />
        </span>
        <span className={styles.containerAgrupFields}>
          <CustomInput
            typeInput="text"
            nameInput="observac"
            valueInput={valueState.observac}
            onChange={handleChange}
            nameLabel="Observaciones"
            required={false}
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
        <span className={styles.buttonContainer}>
          <button id="create" title="Guardar" className={styles["formButton"]}>
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
            <Link href="/proyectos" className={`${styles.cancelButton}`}>
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
    </form>
  );
};

export default ProyForm;
