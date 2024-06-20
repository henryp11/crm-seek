import React from "react";
import styles from "../styles/registerDetails.module.css";

const CotizaDetail = (props) => {
  const { openRegister, registerDetail } = props;

  return (
    <>
      {openRegister && (
        <div className={styles.itemWrapContainer}>
          <span className={styles.itemWrapFields}>
            <h3 className={styles.itemWrapTittles}>Cliente</h3>
            <p>{registerDetail.cliente.nombreCliente}</p>
          </span>
          <span className={styles.itemWrapFields}>
            <h3 className={styles.itemWrapTittles}>Telfs. Contacto</h3>
            <p>{`${registerDetail.cliente.telf1} | ${registerDetail.cliente.telf2}`}</p>
          </span>
          <span className={styles.itemWrapFields}>
            <h3 className={styles.itemWrapTittles}>Correo</h3>
            <p>{registerDetail.cliente.email}</p>
          </span>
          <span className={styles.itemWrapFields}>
            <h3 className={styles.itemWrapTittles}>Correo Alterno</h3>
            <p>{registerDetail.cliente.emailAlter}</p>
          </span>
          <span className={styles.itemWrapFields}>
            <h3 className={styles.itemWrapTittles}>Responsable</h3>
            <p>{registerDetail.responsable}</p>
          </span>
          <span className={styles.itemWrapFields}>
            <h3 className={styles.itemWrapTittles}>Tipo Aluminio</h3>
            <p>{registerDetail.tipoAluminio}</p>
          </span>
          <span className={styles.itemWrapFields}>
            <h3 className={styles.itemWrapTittles}>Tipo Vidrio</h3>
            <p>{registerDetail.tipoVidrio}</p>
          </span>
        </div>
      )}
    </>
  );
};

export default CotizaDetail;
