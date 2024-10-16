import React from "react";
import { redondear } from "../helpers/FunctionsHelps";
import styles from "../styles/registerDetails.module.css";

//Componente que muestra el detalle de los items de cada cotización al momento de visualizarlo en la pantalla de unificación.

const CotizaDetailUnif = (props) => {
  const { openRegister, registerDetail } = props;

  return (
    <>
      {openRegister && (
        <div className={styles.itemWrapContainer}>
          <span className={styles.itemWrapFields}>
            <h3 className={styles.itemWrapTittles}>Descripción</h3>
            <p>{registerDetail.descripGeneral}</p>
          </span>
          <span className={styles.itemWrapFields}>
            <h3 className={styles.itemWrapTittles}>Tipo Aluminio</h3>
            <p>{registerDetail.tipoAluminio}</p>
          </span>
          <span className={styles.itemWrapFields}>
            <h3 className={styles.itemWrapTittles}>Tipo Vidrio</h3>
            <p>{registerDetail.tipoVidrio}</p>
          </span>
          <span className={styles.itemWrapFields} style={{ alignItems: "end" }}>
            <h3
              className={styles.itemWrapTittles}
              style={{ textAlign: "right" }}
            >
              Total Cotización
            </h3>
            <p style={{ textAlign: "right", color: "#c92a2a" }}>
              <b>$ {registerDetail.totalesCotiza?.subTotIva}</b>
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
            <h3 className={styles.itemWrapTittles}>Detalle Productos:</h3>
            <div className={styles.productDetails}>
              <h4>Producto</h4>
              <h4>Área</h4>
              <h4>Cantidad</h4>
              <h4>Total Materiales</h4>
              <h4>Total MO</h4>
              <h4>Total Otros</h4>
              <h4>Total Final</h4>
            </div>
            {registerDetail.productos.map((product) => {
              return (
                <div className={styles.productDetails} key={product.idItem}>
                  <span>
                    {product.idItem} - {product.nombreProducto}
                  </span>
                  <span>{redondear(product.area, 2)} m²</span>
                  <span>{product.cantidad}</span>
                  <span>$ {redondear(product.totMaterial, 2)}</span>
                  <span>$ {redondear(product.totManoObra, 2)}</span>
                  <span>
                    ${" "}
                    {redondear(
                      product.totalItem -
                        product.totMaterial -
                        product.totManoObra,
                      2
                    )}
                  </span>
                  <span>
                    {" "}
                    <b style={{ color: "#c92a2a" }}>
                      $ {redondear(product.totalItem, 2)}
                    </b>
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
