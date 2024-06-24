import { useState } from "react";
import { toast } from "react-hot-toast";
import { db } from "../server/firebase"; //Traigo conexión a firebase desde configuración realizada en el archivo firebase.js
import {
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { redondear } from "../helpers/FunctionsHelps";
// Empiezo creando un estado inicial general de los atributos requeridos en otras pantallas
const initialState = {
  showItemsList: false,
  showAlert: false,
  showFormClient: false,
  showModal: false,
  showModalDimen: false,
  showTotalesSet: false,
  cliente: null,
  idVendedor: "",
  itemsCotiza: [],
  totalesCotiza: {
    ivaTotal: 0.0,
    subTotIva: 0.0,
    subTotIva0: 0.0,
    totalDcto: 0.0,
  },
};

const useInitialState = () => {
  // Con el hook de useState se cambiará el estado inicial
  const [state, setState] = useState(initialState); //Modifica el estado principal
  const [dataList, setDataList] = useState([]); //Trae todos los registros de cualquier tabla
  const [itemPtList, setItemPtList] = useState([]); //Trae Productos terminados
  const [itemComponList, setItemComponList] = useState([]); //Trae componentes
  const [loadData, setLoadData] = useState({
    loading: false,
    error: null,
  });
  const [lastCode, setLastCode] = useState(0); //Para obtener el último código y colocar el siguiente a la nueva cotización

  //Función para obtener datos de cualquier colección de datos
  const getSimpleDataDb = async (table) => {
    setLoadData({ loading: true, error: null });
    try {
      onSnapshot(collection(db, table), (querySnapshot) => {
        const docs = [];
        querySnapshot.forEach((doc) => {
          docs.push({ ...doc.data(), id: doc.id });
        });
        // Ordeno los datos por id_reg
        docs.sort((a, b) => {
          if (a.idReg < b.idReg) {
            return -1;
          }
          if (a.idReg > b.idReg) {
            return 1;
          }
          return 0;
        });
        setDataList(docs);
        //Extraigo el último código para control de secuencias de idReg
        const lastCodeInTable = docs.map(({ idReg }) => idReg).reverse()[0];
        setLastCode(lastCodeInTable);
        setLoadData({ loading: false, error: null });
      });
    } catch (error) {
      console.log(error);
      setLoadData({ loading: false, error: error });
    }
  };

  //Eliminar documento de cualquier tabla

  const deleteToast = async (table, payload, idDocItem) => {
    //Si se envía el idDocumento de firebase como parámetro al eliminar
    //Se actualiza el campo del producto que se elimino de Recetas para indicar que ya no posee receta
    //Solo se utilizará en esos casos
    if (idDocItem) {
      const docRef = doc(db, "Productos", idDocItem);
      await updateDoc(docRef, { haveRecipe: false });
    }

    await deleteDoc(doc(db, table, payload));
  };

  const deleteDocument = async (payload, table, message, idDocItem) => {
    try {
      toast(
        (t) => (
          <span className="toasterDelete">
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
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
            <b>{message}</b>
            <span className="toasterButtons">
              <button
                onClick={() => {
                  deleteToast(table, payload, idDocItem);
                  toast.dismiss(t.id);
                  toast.success("Registro Eliminado!", {
                    style: {
                      border: "1px solid rgb(155, 32, 32)",
                      padding: "16px",
                    },
                    iconTheme: {
                      primary: "rgb(155, 32, 32)",
                      secondary: "#FFFAEE",
                    },
                    duration: 1000,
                  });
                  setTimeout(() => {
                    toast.dismiss();
                  }, 2000);
                }}
              >
                SI
              </button>
              <button onClick={() => toast.dismiss(t.id)}>NO</button>
            </span>
          </span>
        ),
        { duration: 60000 }
      );
    } catch (error) {
      setLoadData({ loading: false, error: error });
    }
  };

  // Llamar solo los productos que sean producto terminado para añadir receta
  const getProdTerminado = async (isCompon, isRecipe) => {
    setLoadData({ loading: true, error: null });
    try {
      const docs = [];
      const queryDb = query(
        collection(db, "Productos"),
        where("isCompon", "==", isCompon),
        where("haveRecipe", "==", isRecipe),
        where("estatus", "==", true)
      );
      const querySnapshot = await getDocs(queryDb);
      querySnapshot.forEach((doc) => {
        docs.push({ ...doc.data(), id: doc.id });
      });
      // Ordeno los datos por id_producto
      docs.sort((a, b) => {
        if (a.idReg < b.idReg) {
          return -1;
        }
        if (a.idReg > b.idReg) {
          return 1;
        }
        return 0;
      });
      setItemPtList(docs);
      setLoadData({ loading: false, error: null });
    } catch (error) {
      setLoadData({ loading: false, error: error });
    }
  };
  // Llamar componentes y filtrar por su precio
  const getComponPrecio = async (listaPrecio) => {
    setLoadData({ loading: true, error: null });
    try {
      const docs = [];
      const queryDb = query(
        collection(db, "Productos"),
        where("isCompon", "==", true),
        where("estatus", "==", true)
      );
      const querySnapshot = await getDocs(queryDb);
      querySnapshot.forEach((doc) => {
        docs.push({ ...doc.data(), id: doc.id });
      });

      if (listaPrecio === "claro") {
        console.log("DOCS para aluminio Claro");
        //Creo un nuevo array donde filtro los componentes con el primer precio
        //Para luego extraer solo los datos que me interesan de cada item encontrado
        const docsPrecio = docs
          .filter((compon) => {
            return compon.precio > 0;
          })
          .map((componente) => {
            return {
              id: componente.id,
              idReg: componente.idReg,
              nombreItem: componente.nombreItem,
              categoria: componente.categoria,
              precio: componente.precio,
              unidMed: componente.unidMed,
              costo: componente.costo,
            };
          });
        console.log(docsPrecio);
        setItemComponList(docsPrecio);
      } else {
        //Creo un nuevo array donde filtro los componentes con el segundo precio
        //Para luego extraer solo los datos que me interesan de cada item encontrado
        const docsPrecio = docs
          .filter((compon) => {
            return compon.precio2 > 0;
          })
          .map((componente) => {
            return {
              id: componente.id,
              idReg: componente.idReg,
              nombreItem: componente.nombreItem,
              categoria: componente.categoria,
              precio: componente.precio2,
              unidMed: componente.unidMed,
              costo: componente.costo,
            };
          });
        console.log(docsPrecio);
        setItemComponList(docsPrecio);
      }
      setLoadData({ loading: false, error: null });
    } catch (error) {
      setLoadData({ loading: false, error: error });
    }
  };

  //Función para mostrar el componente que contendrá el listado de items al facturar
  const showListItems = () => {
    setState({ ...state, showItemsList: !state.showItemsList });
  };
  //Función para mostrar el componente que contendrá el listado de items al facturar
  const showAlert = () => {
    setState({ ...state, showAlert: !state.showAlert });
  };

  //Función para mostrar el componente que contendrá el listado de items al facturar
  const showFormClient = () => {
    setState({ ...state, showFormClient: !state.showFormClient });
  };

  //Función para mostrar el modal en general
  const showModal = () => {
    if (state.showModalDimen) {
      setState({ ...state, showModalDimen: false });
    }
    setState({ ...state, showModal: !state.showModal });
  };

  const showModalDimen = () => {
    setState({ ...state, showModalDimen: !state.showModalDimen });
  };

  const closeAllModal = () => {
    setState({ ...state, showFormClient: false, showAlert: false });
  };

  //Para añadir o quitar items de la factura
  //Payload se usa para el objeto que quiero pasar al estado en este caso un item
  const addItemFact = (payload, idItemSearch) => {
    if (state.itemsCotiza.length === 0) {
      console.log("ingreso a añadir");
      setState({
        ...state,
        itemsCotiza: [...state.itemsCotiza, payload],
        showModalDimen: false,
      });
      // showModalDimen();
    } else {
      let searchItemsId = [];
      searchItemsId = state.itemsCotiza
        .map(({ idItem }) => idItem)
        .filter((idItem) => idItem === idItemSearch);

      if (searchItemsId.length === 0) {
        setState({
          ...state,
          itemsCotiza: [...state.itemsCotiza, payload],
        });
      } else {
        setState({
          ...state,
          itemsCotiza: [
            ...state.itemsCotiza.map((item) => {
              if (item.idItem !== idItemSearch) return item;
              return {
                ...item,
                cantidad: item.cantidad + 1,
              };
            }),
          ],
        });
      }
      // showModalDimen();
    }
  };

  const reduceCantItemFact = (idItemSearch) => {
    setState({
      ...state,
      itemsCotiza: [
        ...state.itemsCotiza.map((item) => {
          if (item.idItem !== idItemSearch) return item;
          return {
            ...item,
            cantFact: item.cantFact - 1,
          };
        }),
      ],
    });
  };

  const removeItemCotiza = (payload) => {
    setState({
      ...state,
      itemsCotiza: [
        ...state.itemsCotiza.filter((item) => item.idItem !== payload),
      ],
    });
  };

  const calculaTotales = async () => {
    const listaDetItems = await state.itemsCotiza;
    //Primero tomo cada componente dentro de cada set para añadir el precio total en base a las fórmulas
    //Obteniendo un nuevo Array conc ada item en la cotización y con el precio total de los componentes en cada set
    if (listaDetItems.length > 0) {
      const addTotalesItems = state.itemsCotiza.map((item) => {
        return {
          ...item,
          sets: [
            ...item.sets.map((set) => {
              return {
                ...set,
                componentes: [
                  ...set.componentes.map((compon) => {
                    return {
                      ...compon,
                      precioTot: compon.calculoF2
                        ? redondear(compon.calculoF2 * compon.precio, 2)
                        : redondear(compon.calculoF1 * compon.precio, 2),
                    };
                  }),
                ],
              };
            }),
          ],
        };
      });

      console.log({ addTotalesItems });

      //predicado de acumulación a usar en cada caso de sumatoria
      const acumulador = (acumulador, valores) => acumulador + valores;

      //Se recorre el array anterior con el detalle del precio y ahora se realiza la sumatoria
      //para el precio Total en cada set
      const itemSetTotales = addTotalesItems.map((item) => {
        return {
          ...item,
          sets: [
            ...item.sets.map((set) => {
              return {
                ...set,
                totalSet: [
                  ...set.componentes.map((compon) => {
                    return compon.precioTot;
                  }),
                ].reduce(acumulador, 0),
              };
            }),
          ],
        };
      });

      console.log({ itemSetTotales });

      //Con el nuevo Array "itemSetTotales " obtengo el precio total de cada set en cada item de la cotiza
      //Ahora se procede a calcular la Sumatoria total de la cotización, almacenando en el objeto de "totalesCotiza" del estado del contexto
      // const tieneDescuento = (item) => item.valDcto > 0; //Predicado para verificar que items tienen descuento
      // const obtenerSoloDcto = (item) => item.valDcto; //Obtengo solo el valor de Descuento de cada objeto
      // const itemsConDcto = addTotalesItems
      //   .filter(tieneDescuento)
      //   .map(obtenerSoloDcto)
      //   .reduce(acumulador, 0)
      //   .toFixed(2);

      // // Declaro predicados para combinación de map, filter y reduce para IVA
      // const tieneIva = (item) => item.valIva > 0; //Predicado para verificar que items tienen IVA
      // const sinIva = (item) => !tieneIva(item); //Niego la función anterior para obtener items sin IVA
      // const obtenerSoloIva = (item) => item.valIva; //Obtengo solo el valor de IVA de cada objeto
      // const itemsConIva = addTotalesItems
      //   .filter(tieneIva)
      //   .map(obtenerSoloIva)
      //   .reduce(acumulador, 0)
      //   .toFixed(2);

      // Con lo obtenido anteriormente puedo extraer el subtotal de los items con IVA
      const itemsCotizaTotales = itemSetTotales.map((item) => {
        return {
          ...item,
          totalItem: [
            ...item.sets.map((set) => {
              return set.totalSet;
            }),
          ]
            .reduce(acumulador, 0)
            .toFixed(2),
        };
      });

      const obtenerPrecioTotal = (item) => item.totalItem;
      const precioTotalIva = itemsCotizaTotales
        .map(obtenerPrecioTotal)
        .reduce(acumulador, 0);

      // setState({
      //   ...state,
      //   itemsCotiza: addTotalesItems,
      //   totalesCotiza: {
      //     ...state.totalesCotiza,
      //     // totalDcto: +itemsConDcto,
      //     // ivaTotal: +itemsConIva,
      //     subTotIva: +subtotConIva,
      //     // subTotIva0: +subtotSinIva,
      //   },
      // });
      setState({
        ...state,
        itemsCotiza: itemSetTotales,
        showTotalesSet: true,
        totalesCotiza: {
          ivaTotal: 0,
          subTotIva: +precioTotalIva,
          subTotIva0: 0,
          totalDcto: 0,
        },
      });
    }
  };

  //Detecta cambios realizados en el formulario del detalle principal al cambiar
  //El los inputs datos camo cantidad, precioUnitario, descuentos, etc
  //Gestionado por nivel de anidamiento de objetos
  const handleChangeItems = (idItemSearch, tipe, nivel) => (e) => {
    const buscaCampoNivel1 = (item) => {
      if (item.idItem !== idItemSearch) return item;
      return {
        ...item,
        [e.target.name]: tipe === "number" ? +e.target.value : e.target.value,
      };
    };
    //Al obtener el item, bajo un nivel más (precios) el cual es un array
    //Por lo tanto mediante un nuevo objeto, traigo toda la información
    //de los objetos de ese array de precios, haciendo el spread mediante
    //la posición obtenida anteriormente, accediendo a la primero posición
    //y en ese punto modifico el precio del objeto de precios en el array.
    const buscaCampoNivel2 = (item, pos) => {
      if (item.idItem !== idItemSearch) return item;
      return {
        ...item,
        precios: [
          {
            ...state.itemsCotiza[pos].precios[0],
            [e.target.name]: +e.target.value,
          },
        ],
      };
    };

    //Busco el item a cambiar cantidad mediante valor enviado en función
    if (nivel === 1) {
      setState({
        ...state,
        itemsCotiza: [...state.itemsCotiza.map(buscaCampoNivel1)],
      });
    }

    //Busco el item a cambiar precio mediante valor enviado en función
    if (nivel === 2) {
      setState({
        ...state,
        itemsCotiza: [...state.itemsCotiza.map(buscaCampoNivel2)],
      });
    }
  };

  //Función para capturar cambios en datos iniciales del estado de contexto
  // En este caso datos de lista de precios y vendedor elegido
  const handleChangeHeader = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  //Encerar estado global
  const encerarState = () => {
    setState(initialState);
  };

  return {
    state,
    setState,
    dataList,
    itemPtList,
    itemComponList,
    lastCode,
    getProdTerminado,
    getComponPrecio,
    loadData,
    getSimpleDataDb,
    deleteDocument,
    addItemFact,
    reduceCantItemFact,
    removeItemCotiza,
    handleChangeItems,
    handleChangeHeader,
    showListItems,
    showAlert,
    showFormClient,
    showModal,
    showModalDimen,
    closeAllModal,
    calculaTotales,
    encerarState,
  }; //retorno el estado y funciones a usar
};

export default useInitialState;
