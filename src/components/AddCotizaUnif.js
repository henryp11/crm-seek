"use client";
import React, { useState, useEffect, useContext } from "react";
import dynamic from "next/dynamic";
import { toast } from "react-hot-toast";
import useScreenSize from "../hooks/useScreenSize";
// import CustomInput from "../components/CustomInput";
import styles from "../styles/forms.module.css";

// Modal para crear cotizaciones x proyecto unificando sus cotizaciones de varios tipos en una sola

const AddCotizaUnif = ({ handleId, idSetEdit, toEdit, secuencial }) => {
  const isMobile = useScreenSize();

  const [dataCotizaUnif, setDataCotizaUnif] = useState({
    idCotizaUnif: "",
    proyecto: "",
    cotizaciones: [],
    totalFinalCotizaUnif: "",
  });

  useEffect(() => {
    handleId();
    // Si se envía un idSet ya existente se colocará como estado inicial el set a editar
    if (idSetEdit) {
      setDataCotizaUnif(toEdit);
    }
  }, []);

  const handleChange = (e) => {
    setDataCotizaUnif({
      ...dataCotizaUnif,
      idSet: toEdit.idSet === undefined ? secuencial : toEdit.idSet,
      [e.target.name]: e.target.value,
    });
  };

  // const handleCheck = (idSearch, dimension) => {
  //   const buscaCampoNivel2 = (item) => {
  //     if (item.idCompon !== idSearch) return item;
  //     return {
  //       ...item,
  //       dimensiones: {
  //         ...item.dimensiones,
  //         [dimension]: !item.dimensiones[dimension],
  //       },
  //     };
  //   };

  //   setDataCotizaUnif({
  //     ...dataCotizaUnif,
  //     componentes: [...dataCotizaUnif.componentes.map(buscaCampoNivel2)],
  //   });
  // };

  const addComponente = (payload, idItemSearch) => {
    if (dataCotizaUnif.cotizaciones.length === 0) {
      setDataCotizaUnif({
        ...dataCotizaUnif,
        cotizaciones: [...dataCotizaUnif.cotizaciones, payload],
      });
    } else {
      let searchItemsId = [];
      searchItemsId = dataCotizaUnif.componentes
        .map(({ idCompon }) => idCompon)
        .filter((idCompon) => idCompon === idItemSearch);

      if (searchItemsId.length === 0) {
        setDataCotizaUnif({
          ...dataCotizaUnif,
          cotizaciones: [...dataCotizaUnif.cotizaciones, payload],
        });
      }
    }
  };

  const removeComponente = (payload) => {
    setDataCotizaUnif({
      ...dataCotizaUnif,
      cotizaciones: [
        ...dataCotizaUnif.cotizaciones.filter(
          (cotiza) => cotiza.id !== payload
        ),
      ],
    });
  };

  console.log(dataCotizaUnif);

  return (
    <div className="mainContainer">
      <section className={styles.sectionComponSelect}>
        <h2>Cotizaciones seleccionadas</h2>
        {dataCotizaUnif.cotizaciones.map((cotiza) => {
          return (
            <div className={styles.componSelectContainer} key={cotiza.id}>
              <h4 className={styles.componSelectName}>{cotiza.idCotiza}</h4>

              <div>
                <h5>valores:</h5>
                <span>{cotiza.idCotiza}</span>
                <span>{cotiza.Totales}</span>
              </div>
              <button
                className={styles.removeButton}
                tittle="Quitar cotización"
                onClick={() => {
                  removeComponente(cotiza.id);
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
      </section>
    </div>
  );
};

export default AddCotizaUnif;
