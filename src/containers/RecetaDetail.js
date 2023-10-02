import React from "react";
import styles from "../styles/registerDetails.module.css";

const RecetaDetail = (props) => {
  const { open, details } = props;

  return (
    <>
      {open && (
        <div
          className={`${styles.itemWrapContainer} ${styles.recetaWrapContainer}`}
        >
          <h2>Receta de Fabricación</h2>
          {details.setFabricacion.map((set) => {
            return (
              <span key={set.idSet} className={styles.recetaWrapFields}>
                <h3 className={styles.itemWrapTittles}>{set.nombreSet}</h3>
                <div>
                  <h4 className={styles.itemWrapTittles}>Componentes</h4>
                  {set.componentes.map((componente) => {
                    return (
                      <span
                        key={componente.idCompon}
                        className={styles.recetaWrapTable}
                      >
                        <p>
                          <i>{componente.idCompon}</i> -{" "}
                          {componente.nombreCompon}
                        </p>
                      </span>
                    );
                  })}
                </div>
                <div>
                  <h4 className={styles.itemWrapTittles}>Fórmulas</h4>
                  {set.componentes.map((componente) => {
                    return (
                      <span
                        key={componente.idCompon}
                        className={styles.recetaWrapTable}
                      >
                        <p>
                          <b>F1: </b>
                          {componente.formula1}
                        </p>
                        {componente.formula2 && (
                          <p>
                            <b>F2: </b>
                            {componente.formula2}
                          </p>
                        )}
                      </span>
                    );
                  })}
                </div>
              </span>
            );
          })}
        </div>
      )}
    </>
  );
};

export default RecetaDetail;
