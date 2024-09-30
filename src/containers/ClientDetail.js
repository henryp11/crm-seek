import React from "react";
import styles from "../styles/registerDetails.module.css";

const ClientDetail = (props) => {
  const { openItem, itemDetail } = props;

  return (
    <>
      {openItem && (
        <div className={styles.itemWrapContainer}>
          <span className={styles.itemWrapFields}>
            <h3 className={styles.itemWrapTittles}>Ruc / Cédula</h3>
            <p>{itemDetail.idReg}</p>
          </span>
          <span className={styles.itemWrapFields}>
            <h3 className={styles.itemWrapTittles}>Nombre / Razón Social</h3>
            <p>{itemDetail.nombreCliente}</p>
          </span>
          <span className={styles.itemWrapFields}>
            <h3 className={styles.itemWrapTittles}>Proyecto Asignado</h3>
            <p>{itemDetail.proyecto}</p>
          </span>
          <span className={styles.itemWrapFields}>
            <h3 className={styles.itemWrapTittles}>Dirección</h3>
            <p>{itemDetail.direccion}</p>
          </span>
          <span className={styles.itemWrapFields}>
            <h3 className={styles.itemWrapTittles}>Teléfono 1</h3>
            <p>{itemDetail.telf1}</p>
          </span>
          <span className={styles.itemWrapFields}>
            <h3 className={styles.itemWrapTittles}>Teléfono 2</h3>
            <p>{itemDetail.telf2}</p>
          </span>
          <span className={styles.itemWrapFields}>
            <h3 className={styles.itemWrapTittles}>Correo</h3>
            <p>{itemDetail.email}</p>
          </span>
          <span className={styles.itemWrapFields}>
            <h3 className={styles.itemWrapTittles}>Correo Alterno</h3>
            <p>{itemDetail.emailAlter}</p>
          </span>
          <span className={styles.itemWrapFields}>
            <h3 className={styles.itemWrapTittles}>Observaciones</h3>
            <p>{itemDetail.observac}</p>
          </span>
        </div>
      )}
    </>
  );
};

export default ClientDetail;
