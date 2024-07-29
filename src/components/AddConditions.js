/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from "react";
import styles from "../styles/forms.module.css";

const AddConditions = ({
  dataItem,
  handleConditions,
  setOpenModalCondition,
}) => {
  const [openHelp, setOpenHelp] = useState(false);

  return (
    <div className="mainContainer modal modalSelectCompon modalFormulas">
      <section className="generalContainer">
        <button
          tittle="Cerrar"
          className="icons-container closeModal"
          type="button"
          onClick={() => {
            setOpenModalCondition();
          }}
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
              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
        <div className={styles["form-default"]}>
          <h3 style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {`Agregar condiciones para: ${dataItem.idReg} [${dataItem.nombreProducto}]`}
            <button
              type="button"
              className="icons-container"
              onClick={() => {
                setOpenHelp(!openHelp);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                />
              </svg>
            </button>
          </h3>
          {openHelp && (
            <span
              style={{
                background: "#495057",
                color: "white",
                padding: "8px 4px",
                paddingTop: "2px",
                margin: "2px",
                marginBottom: "6px",
                fontSize: "13px",
                borderRadius: "8px",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
              }}
            >
              <h4>Palabras Clave</h4>
              <p>
                <b>anchoA | anchoB:</b> Representa a los valores de los posibles
                anchos de la ventana solo se permiten estos 2.
              </p>

              <p>
                <b>alturaH | alturaI | alturaJ: </b> Representa a los valores de
                las posibles alturas de la ventana solo se permiten estos 3.
              </p>
              <p>
                <b>CONDICIONALES:</b> Cuando se quiera obtener un resultado en
                base a una condición (Como una condición SI-ENTONCES -
                VERDAERO|FALSO), se debe colocar la condición a evaluar, luego
                la respuesta VERDADERA seguida de un signo de pregunta "?", y
                por último la respuesta FALSA seguida de dos puntos ":"
                <br />
                <i>EJ: {"anchoB <= 0.5 ? 40 : 48"}</i> <br />
                <i>
                  Se lee: "Cuando Ancho B sea menor o igual a 0.5,coloque 40,
                  caso contrario coloque 48"
                </i>
              </p>
              <p>
                <b>&&:</b> Se utiliza cuando se quiere evaluar dos o más
                condiciones
                <br />
                <i>EJ: {"alturaH >= alturaI && alturaH <= 2.4"}</i> <br />
                <i>
                  Se lee: "Cuando altura H sea mayor o igual que altura I, y
                  además, altura H sea menor o igual a 2.4"
                </i>
              </p>
            </span>
          )}
          <span
            className={`${styles["input-container"]} ${styles.containerSelect}`}
            style={{ gridTemplateColumns: "auto" }}
          >
            <input
              type="text"
              name="anchoA"
              value={dataItem.condiciones?.anchoA}
              onChange={handleConditions}
            />
            <label
              className={
                dataItem.condiciones?.anchoA.length > 0
                  ? styles["activate-label-position"]
                  : ""
              }
            >
              anchoA
            </label>
          </span>
          <span
            className={`${styles["input-container"]} ${styles.containerSelect}`}
            style={{ gridTemplateColumns: "auto" }}
          >
            <input
              type="text"
              name="anchoB"
              value={dataItem.condiciones?.anchoB}
              onChange={handleConditions}
            />
            <label
              className={
                dataItem.condiciones?.anchoB.length > 0
                  ? styles["activate-label-position"]
                  : ""
              }
            >
              anchoB
            </label>
          </span>
          <span
            className={`${styles["input-container"]} ${styles.containerSelect}`}
            style={{ gridTemplateColumns: "auto" }}
          >
            <input
              type="text"
              name="alturaH"
              value={dataItem.condiciones?.alturaH}
              onChange={handleConditions}
            />
            <label
              className={
                dataItem.condiciones?.alturaH.length > 0
                  ? styles["activate-label-position"]
                  : ""
              }
            >
              alturaH
            </label>
          </span>
          <span
            className={`${styles["input-container"]} ${styles.containerSelect}`}
            style={{ gridTemplateColumns: "auto" }}
          >
            <input
              type="text"
              name="alturaI"
              value={dataItem.condiciones?.alturaI}
              onChange={handleConditions}
            />
            <label
              className={
                dataItem.condiciones?.alturaI.length > 0
                  ? styles["activate-label-position"]
                  : ""
              }
            >
              alturaI
            </label>
          </span>
          <span
            className={`${styles["input-container"]} ${styles.containerSelect}`}
            style={{ gridTemplateColumns: "auto" }}
          >
            <input
              type="text"
              name="alturaJ"
              value={dataItem.condiciones?.alturaJ}
              onChange={handleConditions}
            />
            <label
              className={
                dataItem.condiciones?.alturaJ.length > 0
                  ? styles["activate-label-position"]
                  : ""
              }
            >
              alturaJ
            </label>
          </span>
          <div className={styles.buttonContainerBig}>
            <span
              onClick={() => {
                setOpenModalCondition();
              }}
              className={styles.formButton}
            >
              Aceptar Condiciones
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AddConditions;
