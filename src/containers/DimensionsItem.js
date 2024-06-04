import React, { useState, useEffect, useContext } from "react";
import Image from "next/image";
import { redondear } from "../helpers/FunctionsHelps";
import Appcontext from "../context/AppContext";
import stylesCot from "../pages/cotiza/cotizaTemp.module.css";
import styles from "../styles/forms.module.css";
const DimensionsItem = ({ itemReceta, tipoAluminio, tipoVidrio }) => {
  const {
    getComponPrecio,
    itemComponList,
    addItemFact,
    showModalDimen,
    state,
  } = useContext(Appcontext);
  const [stateItemCotiza, setStateItemCotiza] = useState({
    itemReceta,
    cantidad: 0,
    idItem: itemReceta.idReg,
    dimensiones: { anchoA: 0, anchoB: 0, alturaH: 0, alturaI: 0, alturaJ: 0 },
    sets: itemReceta.setFabricacion,
  });

  useEffect(() => {
    // if (state.showModal) {
    //   showModal();
    // }
    getComponPrecio(tipoAluminio);
  }, []);

  console.log(itemComponList);

  //Extraigo los Sets de fabricación del item elegido y obtengo los componentes
  const setsItem =
    itemReceta.setFabricacion.length > 0 &&
    itemReceta.setFabricacion.map((set) => {
      return set.componentes;
    });

  //Unifico todos los componentes de todos los sets en un solo array
  const componentes = [].concat(...setsItem);
  //Extraigo solo las dimensiones de cada componente
  const dimensiones = componentes.map(({ dimensiones }) => {
    return dimensiones;
  });

  // Filtrar solo las dimensiones en TRUE
  // Object.entries(objeto) convierte cada objeto en un array de sus pares clave-valor,
  //y luego filter() se utiliza para obtener solo los pares cuyo valor es true.
  // Object.fromEntries() se utiliza para convertir los pares clave-valor filtrados de nuevo en un objeto.
  const dimensionsActive = dimensiones.map((dimension) =>
    Object.fromEntries(
      Object.entries(dimension).filter(([key, value]) => {
        // console.log(key); solo se lo coloca para la validación de Prettier en Next, "key" es necesario para la extracción final
        return value;
      })
    )
  );

  // Obtener las claves en un array de Strings y quitar duplicados
  //Object.keys(objeto) se utiliza para obtener las claves de cada objeto
  //flatMap() y Set se emplean para obtener un array plano de claves únicas.
  const finalDimensions = [
    ...new Set(dimensionsActive.flatMap((objeto) => Object.keys(objeto))),
  ].sort();

  const handleChange = (e) => {
    setStateItemCotiza({
      ...stateItemCotiza,
      [e.target.name]: +e.target.value,
    });
  };

  const handleDimen = (e) => {
    setStateItemCotiza({
      ...stateItemCotiza,
      dimensiones: {
        ...stateItemCotiza.dimensiones,
        [e.target.name]: +e.target.value,
      },
    });
  };

  const aplicaFormulas = () => {
    //colocar valores de dimensiones en las formulas de cada set
    //Se Itera dentro de cada set, luego al llegar a los Arrays de componentes se evalua s existen las formulas
    //Y si se encuentra fórmula se evalua la misma mediante expresiones regulares para reemplazar la palabra de la
    //Fórmula por el valor de la variable que le corresponde y por último realizar el cálculo por la cantidad.
    //Por último una vez obtenido estos cálculos se añade el resultado a cada objeto, y se vuelve a mapear el array
    //resultante para cotejar los componentes con el listado de items obtenidos de "itemComponList" y si encuentra el precio
    //A su vez añade el precio encontrado al objeto final.
    const setsFormula = stateItemCotiza.sets.map((set) => {
      return {
        ...set,
        componentes: set.componentes
          .map((compon) => {
            return {
              ...compon,
              calculoF1:
                compon.formula1 &&
                redondear(
                  eval(
                    `${stateItemCotiza.cantidad} * (${compon.formula1
                      .replace(/anchoA/g, stateItemCotiza.dimensiones.anchoA)
                      .replace(/anchoB/g, stateItemCotiza.dimensiones.anchoB)
                      .replace(/alturaI/g, stateItemCotiza.dimensiones.alturaI)
                      .replace(/alturaJ/g, stateItemCotiza.dimensiones.alturaJ)
                      .replace(/alturaH/g, stateItemCotiza.dimensiones.alturaH)
                      .replace("ENTERO", "Math.round")
                      .replace("ENSUPERIOR", "Math.ceil")
                      .replace(
                        "AREA",
                        (stateItemCotiza.dimensiones.anchoA +
                          stateItemCotiza.dimensiones.anchoB) *
                          (stateItemCotiza.dimensiones.alturaI +
                            stateItemCotiza.dimensiones.alturaJ +
                            stateItemCotiza.dimensiones.alturaH)
                      )
                      // .replace(/  /g, "")
                      .trim()})`
                  ),
                  2
                ),
              calculoF2:
                compon.formula2 && compon.formula2.includes("F1")
                  ? redondear(
                      eval(
                        `${compon.formula2
                          .replace(
                            "F1",
                            `(${stateItemCotiza.cantidad} * (${compon.formula1}))`
                          )
                          .replace(
                            /anchoA/g,
                            stateItemCotiza.dimensiones.anchoA
                          )
                          .replace(
                            /anchoB/g,
                            stateItemCotiza.dimensiones.anchoB
                          )
                          .replace(
                            /alturaI/g,
                            stateItemCotiza.dimensiones.alturaI
                          )
                          .replace(
                            /alturaJ/g,
                            stateItemCotiza.dimensiones.alturaJ
                          )
                          .replace(
                            /alturaH/g,
                            stateItemCotiza.dimensiones.alturaH
                          )
                          .replace("ENTERO", "Math.round")
                          .replace("ENSUPERIOR", "Math.ceil")
                          // .replace(/  /g, "")
                          .trim()}`
                      ),
                      2
                    )
                  : compon.formula2 &&
                    redondear(
                      eval(
                        `${stateItemCotiza.cantidad} * (${compon.formula2
                          .replace(
                            /anchoA/g,
                            stateItemCotiza.dimensiones.anchoA
                          )
                          .replace(
                            /anchoB/g,
                            stateItemCotiza.dimensiones.anchoB
                          )
                          .replace(
                            /alturaI/g,
                            stateItemCotiza.dimensiones.alturaI
                          )
                          .replace(
                            /alturaJ/g,
                            stateItemCotiza.dimensiones.alturaJ
                          )
                          .replace(
                            /alturaH/g,
                            stateItemCotiza.dimensiones.alturaH
                          )
                          .replace("ENTERO", "Math.round")
                          .replace("ENSUPERIOR", "Math.ceil")
                          // .replace(/  /g, "")
                          .trim()})`
                      ),
                      2
                    ),
            };
          })
          .map((componSinPrecio) => {
            const componConPrecio = itemComponList.find(
              (item) => item.idReg === componSinPrecio.idCompon
            );

            if (componConPrecio) {
              return { ...componSinPrecio, precio: +componConPrecio.precio };
            } else {
              return { ...componSinPrecio, precio: 0 };
            }
          }),
      };
    });

    setStateItemCotiza({
      ...stateItemCotiza,
      sets: setsFormula,
    });
  };

  console.log(setsItem); //Solo SETS extraidos de la receta
  console.log(componentes); //Solo COMPONENTES extraidos de la receta sin importar su Set
  console.log(dimensiones); //Dimensiones extraidas de todos los componentes
  console.log(dimensionsActive); //Dimensiones colocadas con TRUE en la receta de cada componente
  console.log(finalDimensions); //Solo las dimensiones únicas que han sido seleccionadas para las recetas
  console.log({ state }); //State global
  console.log({ tipoAluminio });

  console.log(
    "Estado temporal en Componente Dimensiones, para finalmente enviar al state global 🔽"
  );
  console.log(stateItemCotiza);

  return (
    <div className={stylesCot.modalDimensiones}>
      <span className={stylesCot.modalDimenImage}>
        <button
          onClick={() => {
            showModalDimen();
          }}
          type="button"
          className={stylesCot.returnButton}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </button>
        <h4>
          {itemReceta.idReg}-{itemReceta.nombreProducto}
        </h4>
        {itemReceta.url ? (
          <figure>
            <Image
              src={itemReceta.url}
              alt={itemReceta.idReg}
              layout="fill"
              objectFit="contain"
            />
          </figure>
        ) : (
          <figure>
            <Image
              src="https://i.imgur.com/yZu4sx6.jpeg"
              alt="Sin imagen"
              layout="fill"
              objectFit="contain"
            />
          </figure>
        )}
      </span>
      <div className={stylesCot.modalDimenForm}>
        <h3>Ingrese cantidad y dimensiones</h3>
        <span>
          <label>Cantidad: </label>
          <input
            type="number"
            name="cantidad"
            value={stateItemCotiza.cantidad}
            onChange={handleChange}
          />
        </span>
        {finalDimensions.map((dimen, index) => {
          return (
            <span key={index}>
              <label>{dimen}: </label>
              <input
                type="number"
                name={dimen}
                onChange={handleDimen}
                value={stateItemCotiza.dimensiones.dimen}
              />
            </span>
          );
        })}
        <button
          onClick={aplicaFormulas}
          type="button"
          className={styles.formButton}
        >
          Calcular
        </button>
        <button
          onClick={() => {
            addItemFact(stateItemCotiza, stateItemCotiza.idItem);
          }}
          type="button"
          className={styles.formButton}
        >
          Añadir
        </button>
      </div>
      {stateItemCotiza.sets.map((set) => {
        return (
          <div key={set.idSet} className={stylesCot.containerCalculos}>
            <h3>{set.nombreSet}</h3>
            <div className={stylesCot.tableValuesTitle}>
              <span>Elemento</span>
              <span>Referencia</span>
              <span style={{ textAlign: "right" }}>{`Longitud (m)`}</span>
              <span style={{ textAlign: "right" }}># Perfiles</span>
              <span style={{ textAlign: "right" }}>Precio Unitario</span>
              <span style={{ textAlign: "right" }}>Precio Total</span>
            </div>
            {set.componentes.map((compon) => {
              return (
                <div
                  key={compon.idCompon}
                  className={stylesCot.tableValuesCalc}
                >
                  <span>{compon.nombreCompon}</span>
                  <span>{compon.idCompon}</span>
                  <span style={{ textAlign: "right" }}>{compon.calculoF1}</span>
                  <span style={{ textAlign: "right" }}>{compon.calculoF2}</span>
                  <span style={{ textAlign: "right" }}>{compon.precio} $</span>
                  {compon.calculoF1 && (
                    <span style={{ textAlign: "right" }}>
                      {compon.calculoF2
                        ? redondear(compon.calculoF2 * compon.precio, 2)
                        : redondear(compon.calculoF1 * compon.precio, 2)}{" "}
                      $
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default DimensionsItem;
