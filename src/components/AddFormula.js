/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from "react";
import styles from "../styles/forms.module.css";

const AddFormula = ({ componente, openModal, idSet, addFormula }) => {
  const [dataComponente, setDataComponente] = useState(componente);
  const [openHelp, setOpenHelp] = useState(false);

  const handleChange = (e) => {
    setDataComponente({
      ...dataComponente,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeSelect = (formula) => (e) => {
    setDataComponente({
      ...dataComponente,
      [e.target.name]:
        formula === 1
          ? dataComponente.formula1.concat("", e.target.value)
          : dataComponente.formula2.concat("", e.target.value),
    });
  };

  console.log({ formula: dataComponente });

  return (
    <div className="mainContainer modal modalSelectCompon modalFormulas">
      <section className="generalContainer">
        <button
          tittle="Cerrar"
          className="icons-container closeModal"
          type="button"
          onClick={() => {
            openModal();
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
            {`Agregar Fórmula para: ${dataComponente.nombreCompon} [${dataComponente.idCompon}]`}
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
                <b>ENTERO:</b> Para Redondear el resultado al entero mas cercano
                <i>
                  (Ejemplo si el resultado es 20.49 redondeará a 20, si es 20.5
                  redondeará a 21).
                </i>{" "}
                Se debe colocan entre paréntesis.
                <i>EJ: ENTERO(anchoA * AlturaH)</i>
              </p>
              <p>
                <b>ENSUPERIOR:</b> Para Redondear el resultado al entero mayor o
                igual más próximo a un número dado.
                <i>
                  (Ejemplo si el resultado es 0.95 redondeará a 1, si es 7.04
                  redondeará a 8).
                </i>{" "}
                Se debe colocan entre paréntesis{" "}
                <i>EJ: ENSUPERIOR(anchoA * AlturaH)</i>
              </p>
              <p>
                <b>F1:</b> Para realizar el cáculo en base al resultado de la
                primera fórmula (Aplica para obtener #de Perfiles y se usa
                especificamente en la fórmula 2).
              </p>
              <p>
                <b>AREA:</b> Para que calcule el Area de la ventana en base a su
                ancho y su alto.
              </p>
              <p>
                <b>TOTALMATERIAL:</b> Para usar el resultado TOTAL de la
                sumatoria de los sets de "Estructura de Alumino" y "Accesorios".
                (Aplica para fórmulas en set "VARIOS")
              </p>
              <p>
                <b>MANOOBRA:</b> Para usar el resultado TOTAL del set de "MANO
                DE OBRA ESTRUCTURA". (Aplica para fórmulas en set "VARIOS")
              </p>
            </span>
          )}
          <span
            className={`${styles["input-container"]} ${styles.containerSelect}`}
          >
            <input
              type="text"
              name="formula1"
              value={dataComponente.formula1}
              onChange={handleChange}
              autoFocus={true}
            />
            <label
              className={
                dataComponente.formula1.length > 0
                  ? styles["activate-label-position"]
                  : ""
              }
            >
              Fórmula 1
            </label>
            {/* Extraigo dimensiones elegidas para mostrar en pantalla */}
            {dataComponente.dimensiones && (
              <select
                name="formula1"
                className={styles.inputSelect}
                onChange={handleChangeSelect(1)}
              >
                <option value="" selected disabled label="Medida"></option>
                {/* Transformo objeto a array para extraer el nombre de la key de las medidas seleccionadas (True) para mostrarlas en pantalla */}
                {Object.entries(dataComponente.dimensiones)
                  .filter((activate) => {
                    return activate[1] === true;
                  })
                  .map((dimension, pos) => {
                    return (
                      <option key={pos} value={dimension[0]}>
                        {dimension[0]}
                      </option>
                    );
                  })}
              </select>
            )}
          </span>
          <span
            className={`${styles["input-container"]} ${styles.containerSelect}`}
          >
            <input
              type="text"
              name="formula2"
              value={dataComponente.formula2}
              onChange={handleChange}
            />
            <label
              className={
                dataComponente.formula2.length > 0
                  ? styles["activate-label-position"]
                  : ""
              }
            >
              Fórmula 2
            </label>
            {/* Extraigo dimensiones elegidas para mostrar en pantalla */}
            {dataComponente.dimensiones && (
              <select
                name="formula2"
                className={styles.inputSelect}
                onChange={handleChangeSelect(2)}
              >
                <option value="" selected disabled label="Medida"></option>

                {/* Transformo objeto a array para extraer el nombre de la key de las medidas seleccionadas (True) para mostrarlas en pantalla */}
                {Object.entries(dataComponente.dimensiones)
                  .filter((activate) => {
                    return activate[1] === true;
                  })
                  .map((dimension, pos) => {
                    return (
                      <option key={pos} value={dimension[0]}>
                        {dimension[0]}
                      </option>
                    );
                  })}
              </select>
            )}
          </span>
          <div className={styles.buttonContainerBig}>
            <span
              onClick={() => {
                addFormula(dataComponente, idSet, componente.idCompon);
              }}
              className={styles.formButton}
            >
              Guardar Fórmula
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AddFormula;
