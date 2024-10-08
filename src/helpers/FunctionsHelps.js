export const redondear = (valor, nDecimales) => {
  let valRound = 0;

  if (nDecimales === 2) {
    valRound = Math.round(valor * 100) / 100;
  }
  if (nDecimales === 3) {
    valRound = Math.round(valor * 1000) / 1000;
  }
  if (nDecimales === 4) {
    valRound = Math.round(valor * 10000) / 10000;
  }

  let valRoundStr = valRound.toFixed(nDecimales);
  let valRoundFloat = parseFloat(valRoundStr);
  return valRoundFloat;
};

// Funciones calculo de valores para detalle de factura
// Funciones para cálculos espécificos de detalle en cada item
//pantalla de visualización factura existente
export const calcDcto = (totalItems, dcto) => {
  return redondear(totalItems * (dcto / 100), 2);
};
export const calcSubTotal = (totalItems, dcto) => {
  return totalItems - calcDcto(totalItems, dcto);
};

export const calcIVA = (totalItems, dcto, porIva) => {
  return redondear((calcSubTotal(totalItems, dcto) * porIva) / 100, 2);
};

export const calcTotFinal = (totalItems, dcto, porIva) => {
  return calcSubTotal(totalItems, dcto) + calcIVA(totalItems, dcto, porIva);
};

export const addZero = (dato) => {
  if (dato.toString().length === 1) {
    return `0${dato}`;
  } else {
    return dato;
  }
};

export const formatoFecha = () => {
  const fecha = new Date();
  const mes = fecha.getMonth() + 1;
  const fechaFormat = `${fecha.getFullYear()}-${addZero(mes)}-${addZero(
    fecha.getDate()
  )}`;
  return fechaFormat;
};

export const fechaVencimiento = (emision, diasCre) => {
  console.log(diasCre);
  const emisionSplit = emision.split("-");
  const emisionYear = emisionSplit[0];
  const emisionMonth = Number(emisionSplit[1]) - 1;
  const emisionDay = Number(emisionSplit[2]) + Number(diasCre);
  let vencimiento = new Date(emisionYear, emisionMonth, emisionDay);
  const fechaFormat = `${vencimiento.getFullYear()}-${addZero(
    vencimiento.getMonth() + 1
  )}-${addZero(vencimiento.getDate())}`;
  return fechaFormat;
};

export const formatoFechaDMA = () => {
  const fecha = new Date();
  const mes = fecha.getMonth() + 1;
  const fechaFormat = `${addZero(fecha.getDate())}${addZero(
    mes
  )}${fecha.getFullYear()}`;
  return fechaFormat;
};

export const addZeroIdCotiza = (numRep, tipo) => {
  if (tipo) {
    if (6 - numRep < 0) {
      return `${tipo}${"0".repeat(6)}`;
    } else {
      return `${tipo}${"0".repeat(6 - numRep)}`;
    }
  } else {
    if (7 - numRep < 0) {
      return `CT${"0".repeat(7)}`;
    } else {
      return `CT${"0".repeat(7 - numRep)}`;
    }
  }
};

//Se utiliza en todas las páginas para redireccionar al home si se encuentra un token jwt proveniente de Firebase
//Cuando se haya logueado un usuario. En las pantallas que se lo invoque usarán la librería de useRouter de next/navigation
//para que se pueda usar la función "push" y hacer el redireccionamiento
export const redirectJwt = (router) => {
  const tokenLS = localStorage.getItem("jwt");
  if (tokenLS === null) {
    router.push("/");
  }
};

// Esta función evita que al dar varios clics sobre el botón de "crear" cualquier registro
// añada otro registro. Problema encontrado al guardar un nuevo registro y pulsar doble clic sobre el botón
//Considerar que el botón de guardado debera tener el atributo id="create"
export const blockButton = () => {
  document.getElementById("create").disabled = true;
};
