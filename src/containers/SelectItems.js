import React, { useState, useContext } from "react";
import Image from "next/image";
import Appcontext from "../context/AppContext";
import DimensionsItem from "./DimensionsItem";
import stylesCot from "../pages/cotiza/cotizaTemp.module.css";

const SelectItems = ({ recetas }) => {
  const { showModal, showModalDimen, state } = useContext(Appcontext);
  const [itemCapture, setItemCapture] = useState({});
  console.log({ itemSelect: itemCapture });

  return (
    <div className="containerItemsCotiza">
      <button
        onClick={() => {
          showModal();
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
      <div className="itemsCotizaModal">
        {recetas.map((receta) => {
          return (
            <div key={receta.id} className="recetaCard">
              {receta.url ? (
                <figure>
                  <Image
                    src={receta.url}
                    alt={receta.idReg}
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
              <button
                type="button"
                className="recetaCardDescripButton"
                onClick={() => {
                  setItemCapture(receta);
                  showModalDimen();
                }}
              >
                {receta.idReg} | {receta.nombreProducto}
              </button>
            </div>
          );
        })}
      </div>
      {state.showModalDimen && <DimensionsItem itemReceta={itemCapture} />}
    </div>
  );
};

export default SelectItems;
