// ##############################
// // // table head data and table body data for Tables view
// #############################

const expediente_h_oficina = [
  { title: "Nro", field: "id", headerSort: false },
  { title: "Fecha Inicio", field: "comprobante", headerSort: false },
  { title: "Iniciador", field: "detalle", headerSort: false },
  { title: "Estado", field: "debe", headerSort: false }
];

const expediente_h_busqueda = [
  { title: "Fecha Pase", field: "id", headerSort: false },
  { title: "Destino", field: "comprobante", headerSort: false },
  { title: "Cant. Hojas", field: "detalle", headerSort: false }
];

export { expediente_h_oficina, expediente_h_busqueda };
