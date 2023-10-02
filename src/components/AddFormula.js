import React, { useState, useEffect, useContext } from "react";
import useScreenSize from "../hooks/useScreenSize";
import styles from "../styles/forms.module.css";

const AddFormula = ({ componente, openModal, idSet, addFormula }) => {
  const isMobile = useScreenSize();
  const [dataComponente, setDataComponente] = useState(componente);

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
          ? dataComponente.formula1.concat(" ", e.target.value)
          : dataComponente.formula2.concat(" ", e.target.value),
    });
  };

  console.log({ formula: dataComponente });

  return (
    <div className="mainContainer modal modalSelectCompon modalFormulas">
      <section className="generalContainer">
        <button
          tittle="Cerrar"
          className="icons-container closeModal"
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
          <h3>
            {`Agregar Fórmula para: ${dataComponente.nombreCompon} [${dataComponente.idCompon}]`}
          </h3>
          <span
            className={`${styles["input-container"]} ${styles.containerSelect}`}
          >
            <input
              type="text"
              name="formula1"
              value={dataComponente.formula1}
              onChange={handleChange}
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
            {/* {!idSetEdit ? (
              <span
                onClick={() => {
                  addSetButton(dataFabricacion);
                }}
                className={styles.formButton}
              >
                Crear Set
              </span>
            ) : (
              <span
                onClick={() => {
                  addSetButton(dataFabricacion, true, idSetEdit);
                }}
                className={styles.formButton}
              >
                Actualizar
              </span>
            )} */}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AddFormula;
