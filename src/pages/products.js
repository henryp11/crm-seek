import React, { useState, useEffect, useContext } from "react";
import Link from "next/link.js";
//import ProductDetails from "../containers/ProductDetail";
import HeadersColumns from "../components/HeadersColumns.js";
//import MenuLateral from "../components/MenuLateral";
import SectionSearch from "../containers/SectionSearch";
import Appcontext from "../context/AppContext";
import { db } from "../server/firebase"; //Traigo conexión a firebase desde configuración realizada en el archivo firebase.js
import { collection, getDocs } from "firebase/firestore"; //Conectarse a colecciones y traer los datos
import styles from "../styles/products.module.css";

function useSearchItem(itemData) {
  const [query, setQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState(itemData);
  // Filtro el listado con la función JS filter, la cual recibe una función
  // Para optimizar los resultados de los filtros, con la función useMemo de react cuando se busca algo quedará almacenado
  //y al volver a buscar no debe buscar desde cero si no mostrará lo almacenado
  // UseMemo recibe como primer argumento otra función y el segundo es una lista en array, donde se iran almacenando los valores ya buscados.
  React.useMemo(() => {
    const result = itemData.filter((item) => {
      return `${item.idItem} ${item.nombreItem}`
        .toLowerCase()
        .includes(query.toLowerCase()); //Si encuentra lo que busco mostrará ese resultado, transformo todo a minusculas
    });
    //Esta sección de transformar en estado la busqueda es por si cambia la lista de items a querys a mostar
    setFilteredItems(result);
  }, [itemData, query]);

  return { query, setQuery, filteredItems };
}

const moduleHeaders = {
  classEspec: ["item_grid"],
  columnTitles: [
    "Id.Producto",
    "Nombre",
    "Unid. Med",
    "Categoría",
    "SubCategoría",
    "Costo",
    "Precio",
  ],
};

const Products = () => {
  // Funciones y objetos desde contexto inicial
  const { getProducts, itemsList } = useContext(Appcontext);

  const [loadData, setLoadData] = useState({
    loading: false,
    error: null,
  });
  const [openItem, setOpenItem] = useState(false);
  const [itemCapture, setItemCapture] = useState("");
  const [dataItemCap, setDataItemCap] = useState({});
  // const [productos, setProductos] = useState([]);
  const { query, setQuery, filteredItems } = useSearchItem(itemsList); //USANDO CUSTOM HOOK

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div className="mainContainer">
      {/* <MenuLateral /> */}
      <section className="generalContainer">
        <SectionSearch
          query={query}
          setQuery={setQuery}
          placeholder={"Buscar Item por su código / nombre"}
        />
        <HeadersColumns
          classEsp={moduleHeaders.classEspec}
          columnTitles={moduleHeaders.columnTitles}
        />
        {loadData.loading ? (
          <h1>loading...</h1>
        ) : (
          <div className="generalContainerDetails">
            <Link href="/nuevo">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                id="iconAdd"
                tittle="Crear Nuevo"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </Link>
            {filteredItems.length <= 0 && <p>No Existe</p>}
            {filteredItems.map((item) => {
              return (
                <div key={item.id} className="item_grid item_detail">
                  <span>{item.idItem}</span>
                  <span>{item.nombreItem}</span>
                  <span>{item.unidMed}</span>
                  <span>{item.categoria}</span>
                  <span>{item.subCategoria}</span>
                  <span>{item.costo}</span>
                  <span>{item.precio}</span>
                  <span className="icons-container">
                    <button
                      title="Ver Detalles"
                      onClick={() => {
                        if (openItem) {
                          setOpenItem(false);
                          setItemCapture(item.idItem);
                          setDataItemCap({ ...item });
                          setOpenItem(true);
                        } else {
                          setOpenItem(!openItem);
                          setItemCapture(item.idItem);
                          setDataItemCap({ ...item });
                        }
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                        <path
                          fillRule="evenodd"
                          d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <Link href={`/editar/${item.id}`}>
                      <button
                        title="Editar"
                        onClick={() => {
                          if (openItem) {
                            setOpenItem(false);
                            setItemCapture(item.id);
                            setDataItemCap({ ...item });
                            setOpenItem(true);
                          } else {
                            setOpenItem(!openItem);
                            setItemCapture(item.id);
                            setDataItemCap({ ...item });
                          }
                        }}
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
                            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                          />
                        </svg>
                      </button>
                    </Link>
                  </span>
                  {/* {itemCapture === item.idItem && (
                    <ProductDetails
                      openItem={openItem}
                      itemDetail={dataItemCap}
                    />
                  )} */}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default Products;
