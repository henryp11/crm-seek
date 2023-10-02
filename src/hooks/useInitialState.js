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
  deleteDoc,
} from "firebase/firestore";
// Empiezo creando un estado inicial general de los atributos requeridos en otras pantallas
const initialState = {
  showItemsList: false,
  showAlert: false,
  showFormClient: false,
  showModal: false,
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
  const [isDelete, setIsDelete] = useState(false);
  const [loadData, setLoadData] = useState({
    loading: false,
    error: null,
  });

  //Función para obtener datos de cualquier colección de datos
  const getSimpleDataDb = async (table) => {
    setLoadData({ loading: true, error: null });
    try {
      onSnapshot(collection(db, table), (querySnapshot) => {
        const docs = [];
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
        setDataList(docs);
        setLoadData({ loading: false, error: null });
      });
    } catch (error) {
      setLoadData({ loading: false, error: error });
    }
  };

  //Eliminar documento de cualquier tabla

  const deleteToast = async (table, payload) => {
    await deleteDoc(doc(db, table, payload));
  };

  const deleteDocument = async (payload, table, message) => {
    try {
      // let isDelete = confirm(
      //   "¿Desea eliminar toda la RECETA de fabricación para este item?"
      // );
      // if (isDelete) {
      //   await deleteDoc(doc(db, table, payload));
      // }
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
                  deleteToast(table, payload);
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
  const getProdTerminado = async (isCompon) => {
    setLoadData({ loading: true, error: null });
    try {
      const docs = [];
      const queryDb = query(
        collection(db, "Productos"),
        where("isCompon", "==", isCompon)
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
    setState({ ...state, showModal: !state.showModal });
  };

  const closeAllModal = () => {
    setState({ ...state, showFormClient: false, showAlert: false });
  };

  //Para añadir o quitar items de la factura
  //Payload se usa para el objeto que quiero pasar al estado en este caso un item
  const addItemFact = (payload, idItemSearch) => {
    if (state.itemsCotiza.length === 0) {
      setState({
        ...state,
        itemsCotiza: [...state.itemsCotiza, payload],
      });
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
                cantFact: item.cantFact + 1,
              };
            }),
          ],
        });
      }
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

  const removeItemFact = (payload) => {
    setState({
      ...state,
      itemsCotiza: state.itemsCotiza.filter((items) => items.id !== payload.id),
    });
  };

  // const calculaTotales = async () => {
  //   const listaDetItems = await state.itemsCotiza;
  //   if (listaDetItems.length > 0) {
  //     //Las siguientes líneas son para obtener los valores totales de cada columna
  //     const addTotalesItems = state.itemsCotiza.map((item) => {
  //       return {
  //         ...item,
  //         precioTot: item.cantFact * item.precios[0].precio,
  //         valDcto: +calcDcto(
  //           item.cantFact * item.precios[0].precio,
  //           item.precios[0].dcto
  //         ).toFixed(2),
  //         subTotal: +calcSubTotal(
  //           item.cantFact * item.precios[0].precio,
  //           item.precios[0].dcto
  //         ).toFixed(2),
  //         valIva: +calcIVA(
  //           item.cantFact * item.precios[0].precio,
  //           item.precios[0].dcto,
  //           item.precios[0].iva
  //         ).toFixed(2),
  //         totalFinal: +calcTotFinal(
  //           item.cantFact * item.precios[0].precio,
  //           item.precios[0].dcto,
  //           item.precios[0].iva
  //         ).toFixed(2),
  //       };
  //     });

  //     console.log(addTotalesItems);
  //     //Con el nuevo Array con los totales de cada item se procede a calcular la
  //     //Sumatoria total de la factura, almacenando en el objeto de totales del estado del contexto

  //     const tieneDescuento = (item) => item.valDcto > 0; //Predicado para verificar que items tienen descuento
  //     const obtenerSoloDcto = (item) => item.valDcto; //Obtengo solo el valor de Descuento de cada objeto
  //     const acumulador = (acumulador, valores) => acumulador + valores; //predicado de acumulación a usar en cada caso
  //     const itemsConDcto = addTotalesItems
  //       .filter(tieneDescuento)
  //       .map(obtenerSoloDcto)
  //       .reduce(acumulador, 0)
  //       .toFixed(2);

  //     // Declaro predicados para combinación de map, filter y reduce para IVA
  //     const tieneIva = (item) => item.valIva > 0; //Predicado para verificar que items tienen IVA
  //     const sinIva = (item) => !tieneIva(item); //Niego la función anterior para obtener items sin IVA
  //     const obtenerSoloIva = (item) => item.valIva; //Obtengo solo el valor de IVA de cada objeto
  //     const itemsConIva = addTotalesItems
  //       .filter(tieneIva)
  //       .map(obtenerSoloIva)
  //       .reduce(acumulador, 0)
  //       .toFixed(2);

  //     // Con lo obtenido anteriormente puedo extraer el subtotal de los items con IVA
  //     const obtenerSubTotal = (item) => item.precioTot;
  //     const subtotConIva = addTotalesItems
  //       .filter(tieneIva)
  //       .map(obtenerSubTotal)
  //       .reduce(acumulador, 0)
  //       .toFixed(2);

  //     const subtotSinIva = addTotalesItems
  //       .filter(sinIva)
  //       .map(obtenerSubTotal)
  //       .reduce(acumulador, 0)
  //       .toFixed(2);

  //     setState({
  //       ...state,
  //       itemsCotiza: addTotalesItems,
  //       totalesFactura: {
  //         ...state.totalesFactura,
  //         totalDcto: +itemsConDcto,
  //         ivaTotal: +itemsConIva,
  //         subTotIva: +subtotConIva,
  //         subTotIva0: +subtotSinIva,
  //       },
  //     });
  //   }
  // };

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

  return {
    state,
    setState,
    dataList,
    itemPtList,
    getProdTerminado,
    loadData,
    getSimpleDataDb,
    deleteDocument,
    addItemFact,
    reduceCantItemFact,
    removeItemFact,
    handleChangeItems,
    handleChangeHeader,
    showListItems,
    showAlert,
    showFormClient,
    showModal,
    closeAllModal,
    // calculaTotales,
  }; //retorno el estado y funciones a usar
};

export default useInitialState;
