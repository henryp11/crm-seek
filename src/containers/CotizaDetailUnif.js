import React from "react";
import styles from "../styles/registerDetails.module.css";

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
          <span className={styles.itemWrapFields}>
            <h3 className={styles.itemWrapTittles}>Total Cotización</h3>
            <p>
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
              <h4>Total Mano de Obra</h4>
              <h4>Total Final</h4>
            </div>
            {registerDetail.productos.map((product) => {
              return (
                <div className={styles.productDetails}>
                  <span>
                    {product.idItem} - {product.nombreProducto}
                  </span>
                  <span>{product.area} m²</span>
                  <span>{product.cantidad}</span>
                  <span>$ {product.totMaterial}</span>
                  <span>$ {product.totManoObra}</span>
                  <span>
                    {" "}
                    <b>$ {product.totalItem}</b>
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
