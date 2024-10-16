"use client";
import React, { useRef } from "react";
import * as XLSX from "xlsx";
import moment from "moment";
import { redondear } from "../helpers/FunctionsHelps";
import styles from "../styles/forms.module.css";

const TableReportFinal = ({ dataCotizaUnif, closeModal }) => {
  const tableRef = useRef();
  const exportToExcel = () => {
    const table = tableRef.current;

    // Convertir la tabla HTML a una hoja de cálculo
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.table_to_sheet(table);

    // Añadir la hoja al libro de trabajo
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      `CotUnif. #${dataCotizaUnif.idReg}`
    );

    // Exportar el archivo
    XLSX.writeFile(
      workbook,
      `Cotización_Final${dataCotizaUnif.idReg}_Proyecto-${dataCotizaUnif.proyectName}.xlsx`
    );
  };

  const allItemsCotiza = dataCotizaUnif.cotizaciones.map((cotiza) => {
    return cotiza.productos;
  });

  const finalProducts = [].concat(...allItemsCotiza);

  console.log({ dataToReportFinal: dataCotizaUnif });
  return (
    <div
      className={styles.previewReports}
      style={{
        position: "absolute",
        top: "0",
        left: "0",
        right: "0",
        bottom: "0",
        background: "#19212be6",
        zIndex: "3",
        padding: "20px",
        height: "100vh",
      }}
    >
      <div
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "space-evenly",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <button
          onClick={exportToExcel}
          className={styles.formButton}
          id={styles.excelExport}
          style={{ borderRadius: "8px", background: "#bcffcf", padding: "4px" }}
          type="button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="100"
            height="100"
            viewBox="0 0 48 48"
          >
            <path
              fill="#169154"
              d="M29,6H15.744C14.781,6,14,6.781,14,7.744v7.259h15V6z"
            ></path>
            <path
              fill="#18482a"
              d="M14,33.054v7.202C14,41.219,14.781,42,15.743,42H29v-8.946H14z"
            ></path>
            <path
              fill="#0c8045"
              d="M14 15.003H29V24.005000000000003H14z"
            ></path>
            <path fill="#17472a" d="M14 24.005H29V33.055H14z"></path>
            <g>
              <path
                fill="#29c27f"
                d="M42.256,6H29v9.003h15V7.744C44,6.781,43.219,6,42.256,6z"
              ></path>
              <path
                fill="#27663f"
                d="M29,33.054V42h13.257C43.219,42,44,41.219,44,40.257v-7.202H29z"
              ></path>
              <path
                fill="#19ac65"
                d="M29 15.003H44V24.005000000000003H29z"
              ></path>
              <path fill="#129652" d="M29 24.005H44V33.055H29z"></path>
            </g>
            <path
              fill="#0c7238"
              d="M22.319,34H5.681C4.753,34,4,33.247,4,32.319V15.681C4,14.753,4.753,14,5.681,14h16.638 C23.247,14,24,14.753,24,15.681v16.638C24,33.247,23.247,34,22.319,34z"
            ></path>
            <path
              fill="#fff"
              d="M9.807 19L12.193 19 14.129 22.754 16.175 19 18.404 19 15.333 24 18.474 29 16.123 29 14.013 25.07 11.912 29 9.526 29 12.719 23.982z"
            ></path>
          </svg>
          Exportar
        </button>
        <button
          type="button"
          className={styles.formButton}
          style={{ width: "100px", borderRadius: "8px", margin: "0px" }}
          onClick={() => {
            closeModal(false);
          }}
        >
          Cerrar
        </button>
      </div>
      <table
        ref={tableRef}
        cellSpacing="3"
        cellPadding="3"
        border="1"
        width="100%"
        style={{ padding: "4px" }}
      >
        <thead align="center" bgcolor="#57b1fc">
          <tr>
            <th colSpan="6">
              <strong>ITVAL CIA. LTDA.</strong>
            </th>
          </tr>
          <tr>
            <th colSpan="6">
              <strong>{`Proyecto: ${dataCotizaUnif.proyectName}`}</strong>
            </th>
          </tr>
          <tr>
            <th colSpan="6">
              <strong>{`Fecha: ${
                dataCotizaUnif.fecha &&
                moment(dataCotizaUnif.fecha).format("DD/MM/YYYY")
              }`}</strong>
            </th>
          </tr>
          <tr bgcolor="#444a8d">
            <th>ITEM</th>
            <th>RUBRO</th>
            <th>UNID.</th>
            <th>CANT.</th>
            <th>PRECIO UNIT.</th>
            <th>PRECIO TOTAL</th>
          </tr>
        </thead>
        <tbody>
          {finalProducts.map((item, index) => {
            return (
              <tr key={item.idItem}>
                <td align="center">
                  <strong>{index + 1}</strong>
                </td>
                <td>
                  <strong>{item.nombreProducto}</strong>
                </td>
                <td align="center">m2</td>
                <td align="center">{item.cantidad}</td>
                <td align="right">{item.totalItem}</td>
                <td align="right">{item.totalItem}</td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr align="right" bgcolor="#21c063">
            <td colSpan="5">
              <strong>SUMA: </strong>
            </td>
            <td>
              <strong>
                {redondear(dataCotizaUnif.totalFinalCotizaUnif?.totalFinal, 2)}
              </strong>
            </td>
          </tr>
          <tr align="right" bgcolor="#5e916e">
            <td colSpan="5">
              <strong>IVA 15%: </strong>
            </td>
            <td>
              <strong>
                {redondear(
                  dataCotizaUnif.totalFinalCotizaUnif?.totalFinal * 0.15,
                  2
                )}
              </strong>
            </td>
          </tr>
          <tr align="right" bgcolor="#396947;">
            <td colSpan="5">
              <strong>TOTAL: </strong>
            </td>
            <td>
              <strong>
                {redondear(
                  dataCotizaUnif.totalFinalCotizaUnif?.totalFinal * 1.15,
                  2
                )}
              </strong>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default TableReportFinal;
