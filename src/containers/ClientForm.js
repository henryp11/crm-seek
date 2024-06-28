"use client";
import React, { useState } from "react";
import Link from "next/link.js";
import CustomInput from "../components/CustomInput";
import styles from "../styles/forms.module.css";

const ClientForm = ({ funCreate, funUpdate, idDoc, data }) => {
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
        <span className={styles.idField}>
          <CustomInput
            typeInput="text"
            nameInput="idReg"
            valueInput={valueState.idReg}
            onChange={handleChange}
            nameLabel="RUC / Cédula"
            required={true}
          />
          <CustomInput
            typeInput="text"
            nameInput="nombreCliente"
            valueInput={valueState.nombreCliente}
            onChange={handleChange}
            nameLabel="Nombre / Razón Social"
            required={true}
          />
          <CustomInput
            typeInput="text"
            nameInput="proyecto"
            valueInput={valueState.proyecto}
            onChange={handleChange}
            nameLabel="Proyecto"
          />
        </span>
        <span className={styles.containerAgrupFields}>
          <CustomInput
            typeInput="text"
            nameInput="direccion"
            valueInput={valueState.direccion}
            onChange={handleChange}
            nameLabel="Dirección"
            required={true}
          />
          <CustomInput
            typeInput="telf"
            nameInput="telf1"
            valueInput={valueState.telf1}
            onChange={handleChange}
            nameLabel="Telf. Principal"
            required={true}
          />
          <CustomInput
            typeInput="telf"
            nameInput="telf2"
            valueInput={valueState.telf2}
            onChange={handleChange}
            nameLabel="Telf. Secundario"
            required={false}
          />
        </span>
        <span className={styles.containerAgrupFields}>
          <CustomInput
            typeInput="mail"
            nameInput="email"
            valueInput={valueState.email}
            onChange={handleChange}
            nameLabel="Correo electrónico"
            required={true}
          />
          <CustomInput
            typeInput="mail"
            nameInput="emailAlter"
            valueInput={valueState.emailAlter}
            onChange={handleChange}
            nameLabel="Correo Alterno"
            required={false}
          />
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
            <Link href="/clients" className={`${styles.cancelButton}`}>
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

export default ClientForm;
