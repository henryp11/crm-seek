import React, { useContext } from "react";
import { redondear } from "../helpers/FunctionsHelps";
import Appcontext from "../context/AppContext";
import stylesCot from "../pages/cotiza/cotizaTemp.module.css";

const DetalleCotiza = ({ detalle }) => {
  const { state } = useContext(Appcontext);
  console.log(detalle);
  return (
    <>
      {detalle.map((item) => {
        return (
          <div key={item.idItem} className={stylesCot.containerCalculos}>
            <h2>{`${item.idItem} - ${item.itemReceta.nombreProducto}`}</h2>
            {item.sets.map((set) => {
              return (
                <div key={set.idSet} style={{ width: "100%" }}>
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
                        style={{ color: "black" }}
                      >
                        <span>{compon.nombreCompon}</span>
                        <span>{compon.idCompon}</span>
                        <span style={{ textAlign: "right" }}>
                          {compon.calculoF1}
                        </span>
                        <span style={{ textAlign: "right" }}>
                          {compon.calculoF2}
                        </span>
                        <span style={{ textAlign: "right" }}>
                          {compon.precio} $
                        </span>
                        {compon.calculoF1 && (
                          <span style={{ textAlign: "right" }}>
                            {compon.calculoF2
                              ? redondear(compon.calculoF2 * compon.precio, 2)
                              : redondear(
                                  compon.calculoF1 * compon.precio,
                                  2
                                )}{" "}
                            $
                          </span>
                        )}
                      </div>
                    );
                  })}
                  {state.showTotalesSet && (
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        background: "#dbc291",
                        color: "white",
                        margin: "4px 0",
                        fontSize: "20px",
                        padding: "4px 30px",
                      }}
                    >
                      <b>Total {set.nombreSet}: </b>
                      <b>{set.totalSet} $</b>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </>
  );
};

export default DetalleCotiza;
