"use client";
import React, { useState } from "react";
import Link from "next/link";
import { redondear, addZeroIdCotiza } from "../helpers/FunctionsHelps";
import CustomInput from "./CustomInput";
import TableReportFinal from "./TableReportFinal";
import styles from "../styles/forms.module.css";
// Muestra dentro de la pantalla de unificación, en el lado derecho el resumen de las cotizaciones seleccionadas
//Para unificación, donde procede a realizar los cálculos para la cotización final, así como mostrar el formulario
//que guardara la CTU a la base de datos, así como el preview de la tabla de resultados para exportar.

const CotizaByProy = ({
  cotizaciones,
  removeCotiza,
  calcTotalFinal,
  showForm,
  finalState,
  handleChange,
  handleSubmit,
  updateLastCode,
}) => {
  const [showPreview, setShowPreview] = useState(false);
  return (
    <div
      className="mainContainer"
      style={{
        width: "40%",
        margin: "0 12px",
        height: "91vh",
        overflowX: "hidden",
        overflowY: "auto",
        position: "static",
      }}
    >
      <section className={styles.sectionComponSelect} style={{ width: "100%" }}>
        <h2 style={{ background: "#0077ff" }}>
          {`Cotizaciones seleccionadas para: ${addZeroIdCotiza(
            finalState.idReg.toString().length,
            "CTU"
          )}${finalState.idReg}`}
        </h2>
        {cotizaciones.map((cotiza) => {
          return (
            <div
              className={styles.cotizaSelectContainer}
              key={cotiza.id}
              style={{
                width: "100%",
                gridTemplateColumns: "7% 15% 16% 16% 16% 16% 10%",
                gridGap: "0 5px",
              }}
            >
              <h4
                className={styles.componSelectName}
                style={{
                  gridRow: "auto",
                  fontSize: "0.6em",
                  gridColumn: "unset",
                }}
              >
                CT{cotiza.idReg}
              </h4>
              <div>
                <h5>Tipo:</h5>
                <span>{cotiza.tipo}</span>
              </div>
              {/* <div style={{ textAlign: "right" }}>
                <h5>Fecha CT:</h5>
                <span>{cotiza.fechaElab}</span>
              </div> */}
              <div style={{ textAlign: "right" }}>
                <h5>Tot. Mat.:</h5>
                <span>
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
              </div>
              <div style={{ textAlign: "right" }}>
                <h5>Tot. M.O.:</h5>
                <span>
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
              </div>
              <div style={{ textAlign: "right" }}>
                <h5>Tot. Otros:</h5>
                <span>
                  ${" "}
                  {redondear(
                    redondear(cotiza.totalesCotiza.subTotIva, 2) -
                      redondear(
                        cotiza.productos
                          .map(({ totMaterial }) => {
                            return totMaterial;
                          })
                          .reduce((acumulador, totalMat) => {
                            return acumulador + totalMat;
                          }, 0),
                        2
                      ) -
                      redondear(
                        cotiza.productos
                          .map(({ totManoObra }) => {
                            return totManoObra;
                          })
                          .reduce((acumulador, totalMO) => {
                            return acumulador + totalMO;
                          }, 0),
                        2
                      ),
                    2
                  )}
                </span>
              </div>
              <div style={{ textAlign: "right" }}>
                <h5>Total Cot.:</h5>
                <span>$ {cotiza.totalesCotiza.subTotIva}</span>
              </div>

              <button
                className={styles.removeButton}
                title="Quitar cotización"
                onClick={() => {
                  removeCotiza(cotiza.id);
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
                    d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
            </div>
          );
        })}
        {cotizaciones.length > 0 && (
          <div className={styles.containerTotalesCotizaUnif}>
            <button
              type="button"
              className={styles["formButton"]}
              onClick={() => {
                calcTotalFinal();
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                />
              </svg>
              CALCULAR COTIZACION FINAL
            </button>
            <h3>Totales Finales del proyecto | {finalState.proyectName}:</h3>
            <span>
              <h4>Total Material:</h4> ${" "}
              {finalState.totalFinalCotizaUnif.totalFinalMat}
            </span>
            <span>
              <h4>Total Mano de Obra:</h4> ${" "}
              {finalState.totalFinalCotizaUnif.totalFinalMO}
            </span>
            <span>
              <h4>Total Otros/Varios:</h4> ${" "}
              {redondear(
                finalState.totalFinalCotizaUnif.totalFinal -
                  finalState.totalFinalCotizaUnif.totalFinalMat -
                  finalState.totalFinalCotizaUnif.totalFinalMO,
                2
              )}
            </span>
            <span>
              <h4>Total Cotización Unificada:</h4> ${" "}
              {finalState.totalFinalCotizaUnif.totalFinal}
            </span>
          </div>
        )}
        {showForm && (
          <form
            id="form"
            onSubmit={handleSubmit}
            className={`${styles["form-default"]}`}
          >
            <span className={styles.containerAgrupFields}>
              <CustomInput
                typeInput="date"
                nameInput="fecha"
                valueInput={finalState.fecha}
                onChange={handleChange}
                nameLabel="Fecha Elab:"
                required={true}
              />
              <CustomInput
                typeInput="text"
                nameInput="observac"
                valueInput={finalState.observac}
                onChange={handleChange}
                nameLabel="Observaciones"
              />
            </span>
            <button
              title="Previsualizar Cotización a exportar"
              className={styles.formButton}
              style={{ width: "100%", background: "#396947" }}
              type="button"
              onClick={() => {
                setShowPreview(!showPreview);
              }}
            >
              Previsualizar Cuadro Totales
            </button>
            <span className={styles.buttonContainer}>
              {/* {state.itemsCotiza.length > 0 && ( */}
              {showPreview && (
                <TableReportFinal
                  dataCotizaUnif={finalState}
                  closeModal={setShowPreview}
                />
              )}
              <button
                title="Unificar"
                id="create"
                className={styles["formButton"]}
                onFocus={() => {
                  calcTotalFinal();
                }}
                // onClick={() => {
                //   updateStatefinal();
                // }}
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
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
              {/* )} */}
              <button
                title="Cancelar"
                className={`${styles.formButton}`}
                id="cancelButton"
                onClick={() => {
                  updateLastCode(0);
                }}
                // onClick={() => {
                //   if (idDoc === "new") {
                //     updateLastCode(0);
                //     encerarState();
                //   } else {
                //     encerarState();
                //   }
                // }}
              >
                <Link href="/unificacion" className={`${styles.cancelButton}`}>
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
        )}
      </section>
    </div>
  );
};

export default CotizaByProy;
