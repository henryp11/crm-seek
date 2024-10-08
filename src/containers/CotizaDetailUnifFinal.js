import React from "react";
import { addZeroIdCotiza, redondear } from "../helpers/FunctionsHelps";
import styles from "../styles/registerDetails.module.css";

const CotizaDetailUnif = (props) => {
  const { openRegister, registerDetail } = props;

  return (
    <>
      {openRegister && (
        <div className={styles.itemWrapContainer}>
          <span className={styles.itemWrapFields}>
            <h3 className={styles.itemWrapTittles}>Observaciones</h3>
            <p>{registerDetail.observac}</p>
          </span>
          <span className={styles.itemWrapFields} style={{ alignItems: "end" }}>
            <h3
              className={styles.itemWrapTittles}
              style={{ textAlign: "right" }}
            >
              Total Material
            </h3>
            <p style={{ color: "blue" }}>
              $ {registerDetail.totalFinalCotizaUnif?.totalFinalMat}
            </p>
          </span>
          <span className={styles.itemWrapFields} style={{ alignItems: "end" }}>
            <h3
              className={styles.itemWrapTittles}
              style={{ textAlign: "right" }}
            >
              Total Mano de Obra
            </h3>
            <p style={{ color: "#7a62be" }}>
              $ {registerDetail.totalFinalCotizaUnif?.totalFinalMO}
            </p>
          </span>
          <span className={styles.itemWrapFields} style={{ alignItems: "end" }}>
            <h3
              className={styles.itemWrapTittles}
              style={{ textAlign: "right" }}
            >
              Total Final Cotización
            </h3>
            <p style={{ color: "#c92a2a" }}>
              <b>$ {registerDetail.totalFinalCotizaUnif?.totalFinal}</b>
            </p>
          </span>
          <span
            className={styles.itemWrapFields}
            style={{
              gridColumn: "1/-1",
              border: "2px solid #396947",
              borderRadius: "4px",
              padding: "4px",
              background: "#f8f8f8",
            }}
          >
            <h3 className={styles.itemWrapTittles}>
              Detalle Cotizaciones Anexadas:
            </h3>
            <div
              className={styles.productDetails}
              style={{
                gridTemplateColumns: "7% 10% 10% 17% 15% 15% 15%",
              }}
            >
              <h4>#Cotiza.</h4>
              <h4>Tipo Cot.</h4>
              <h4>Fecha Elaboración</h4>
              <h4>Responsable</h4>
              <h4>Total Material</h4>
              <h4>Total MO</h4>
              <h4>Total Final</h4>
            </div>
            {registerDetail.cotizaciones.map((cotiza) => {
              return (
                <div
                  key={cotiza.id}
                  className={styles.productDetails}
                  style={{
                    gridTemplateColumns: "7% 10% 10% 17% 15% 15% 15%",
                  }}
                >
                  <span>
                    {addZeroIdCotiza(
                      cotiza.idReg && cotiza.idReg.toString().length
                    )}
                    {cotiza.idReg}
                  </span>
                  <span>{cotiza.tipo}</span>
                  <span>{cotiza.fechaElab}</span>
                  <span>{cotiza.responsable}</span>
                  <span style={{ textAlign: "right", color: "blue" }}>
                    ${" "}
                    {redondear(
                      cotiza.productos
                        .map(({ totMaterial }) => {
                          return totMaterial;
                        })
                        .reduce((acumulador, totalMat) => {
                          return acumulador + totalMat;
                        }, 0),
                      2
                    )}
                  </span>
                  <span style={{ textAlign: "right", color: "#7a62be" }}>
                    ${" "}
                    {redondear(
                      cotiza.productos
                        .map(({ totManoObra }) => {
                          return totManoObra;
                        })
                        .reduce((acumulador, totalMO) => {
                          return acumulador + totalMO;
                        }, 0),
                      2
                    )}
                  </span>
                  <span style={{ textAlign: "right", color: "#c92a2a" }}>
                    <b>$ {cotiza.totalesCotiza?.subTotIva}</b>
                  </span>
                </div>
              );
            })}
          </span>
        </div>
      )}
    </>
  );
};

export default CotizaDetailUnif;
