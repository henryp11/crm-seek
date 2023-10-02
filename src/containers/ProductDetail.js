import React from "react";
import Image from "next/image";
import styles from "../styles/registerDetails.module.css";

const ProductDetail = (props) => {
  const { openItem, itemDetail } = props;

  // const calcularIva = (precio, iva) => {
  //   return (precio * iva) / 100;
  // };

  return (
    <>
      {openItem && (
        <div
          className={
            itemDetail.url
              ? styles.itemWrapContainerImage
              : styles.itemWrapContainer
          }
        >
          {itemDetail.url && (
            <span className={`${styles.itemWrapFields} ${styles.fieldSpanAll}`}>
              <figure className={styles.itemImage}>
                <Image
                  src={itemDetail.url}
                  alt={itemDetail.idItem}
                  layout="fill"
                />
              </figure>
            </span>
          )}

          {/* <span className={styles.itemWrapFields}>
            <h3 className={styles.itemWrapTittles}>Id Producto</h3>
            <p>{itemDetail.idItem}</p>
          </span> */}
          <span className={styles.itemWrapFields}>
            <h3 className={styles.itemWrapTittles}>Nombre</h3>
            <p>{itemDetail.nombreItem}</p>
          </span>
          <span className={styles.itemWrapFields}>
            <h3 className={styles.itemWrapTittles}>Categoría</h3>
            <p>{itemDetail.categoria}</p>
          </span>
          <span className={styles.itemWrapFields}>
            <h3 className={styles.itemWrapTittles}>Sub Categoría</h3>
            <p>{itemDetail.subCategoria}</p>
          </span>
          <span className={styles.itemWrapFields}>
            <h3 className={styles.itemWrapTittles}>Unidad Medida</h3>
            <p>{itemDetail.unidMed}</p>
          </span>
          <span className={styles.itemWrapFields}>
            <h3 className={styles.itemWrapTittles}>Precios</h3>
            <p>{itemDetail.precio}</p>
          </span>
          <span className={styles.itemWrapFields}>
            <h3 className={styles.itemWrapTittles}>Costo</h3>
            <p>{itemDetail.costo}</p>
          </span>
        </div>
      )}
    </>
  );
};

export default ProductDetail;
