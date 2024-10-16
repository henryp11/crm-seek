"use client";
import React, { useRef } from "react";
import * as XLSX from "xlsx";
import moment from "moment";
import { redondear } from "../helpers/FunctionsHelps";
import styles from "../styles/forms.module.css";

const TableReportNew = ({ dataCotiza }) => {
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
      `Cot. #${dataCotiza.idReg}`
    );

    // Exportar el archivo
    XLSX.writeFile(workbook, `Cotización - ${dataCotiza.idReg}.xlsx`);
  };

  console.log({ dataToReportNew: dataCotiza });
  return (
    <div className={styles.previewReports}>
      <div
        style={{
          display: "flex",
          width: "300px",
          justifyContent: "space-evenly",
          alignItems: "center",
          position: "absolute",
          right: "200px",
          bottom: "15px",
        }}
      >
        <button
          onClick={exportToExcel}
          className={styles.formButton}
          id={styles.excelExport}
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
      </div>
      <table
        ref={tableRef}
        cellSpacing="3"
        cellPadding="3"
        border="1"
        width="100%"
        style={{ display: "none" }}
      >
        <caption>
          <strong>ITVAL CIA. LTDA.</strong>
        </caption>
        <thead align="left">
          <tr>
            <th>CLIENTE:</th>
            <td colSpan="2">{dataCotiza.cliente.nombreCliente}</td>
            <th>FECHA DE ELABORACION:</th>
            <td>{moment(dataCotiza.fechaElab).format("DD/MM/YYYY")}</td>
            <th>{`Cotización # CT000000${dataCotiza.idReg}`}</th>
          </tr>
          <tr>
            <th>PROYECTO:</th>
            <td colSpan="2">{dataCotiza.cliente.proyecto}</td>
          </tr>
          <tr>
            <th>CONTIENE:</th>
            <td colSpan="2">{dataCotiza.descripGeneral}</td>
            <th>REALIZADO POR:</th>
            <td colSpan="2">{dataCotiza.responsable}</td>
          </tr>
          <tr>
            <th rowSpan="2">ESPECIFICACIONES:</th>
            <th>TIPO ALUMINIO VIDRIO</th>
            <th>TIPO VIDRIO</th>
            <th>AREA TOTAL VIDRIO</th>
          </tr>
          <tr>
            <td align="center">{dataCotiza.tipoAluminio}</td>
            <td>{dataCotiza.tipoVidrio}</td>
            <td align="center">
              {dataCotiza.productos
                ?.map((item) => {
                  return item.area;
                })
                .reduce((acumula, area) => {
                  return acumula + area;
                }, 0)}{" "}
              m2
            </td>
            {/* <td>{dataCotiza.productos[0].area}</td> */}
          </tr>
        </thead>
        <tbody>
          {dataCotiza.productos.map((item) => {
            return (
              <>
                <tr key={item.idItem} bgcolor="#57b1fc">
                  <td colSpan="3">
                    <strong>{item.nombreProducto}</strong>
                  </td>
                  <td>
                    <strong>Cantidad:</strong>
                    {item.cantidad}
                  </td>
                  <td>
                    <strong>Area:</strong>
                    {item.area} m2
                  </td>
                </tr>
                {item.sets.map((set) => {
                  return (
                    <>
                      <tr key={set.idSet} bgcolor="#FFE699">
                        <td colSpan="6">
                          <strong>{set.nombreSet}</strong>
                        </td>
                      </tr>
                      <tr align="center">
                        <th>Elemento</th>
                        <th>Referencia</th>
                        <th>Longitud (m)</th>
                        <th># Perfiles</th>
                        <th>Precio Unitario</th>
                        <th>Precio Total</th>
                      </tr>
                      {set.componentes.map((compon) => {
                        return (
                          <tr key={compon.idCompon}>
                            <td>{compon.nombreCompon}</td>
                            <td align="center">{compon.idCompon}</td>
                            <td align="right">{compon.calculoF1}</td>
                            <td align="right">{compon.calculoF2}</td>
                            <td align="right">{redondear(compon.precio, 2)}</td>
                            <td align="right">
                              {redondear(compon.precioTot, 2)}
                            </td>
                          </tr>
                        );
                      })}
                      <tr bgcolor="#fed421" align="right">
                        <td colspan="5">
                          <strong>Total {set.nombreSet}: </strong>
                        </td>
                        <td>
                          <strong>{redondear(set.totalSet, 2)}</strong>
                        </td>
                      </tr>
                    </>
                  );
                })}
                <tr bgcolor="#57b1fc">
                  <td colSpan="5" align="right">
                    <strong>Total {item.nombreProducto}: </strong>
                  </td>
                  <td align="right">
                    <strong>{redondear(item.totalItem, 2)}</strong>
                  </td>
                </tr>
              </>
            );
          })}
        </tbody>
        <tfoot>
          <tr align="right" bgcolor="#21c063">
            <td colSpan="5">
              <strong>Total Cotización: </strong>
            </td>
            <td>
              <strong>
                {redondear(dataCotiza.totalesCotiza?.subTotIva, 2)}
              </strong>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default TableReportNew;
