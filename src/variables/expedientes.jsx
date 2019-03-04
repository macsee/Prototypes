// ##############################
// // // table head data and table body data for Tables view
// #############################

const expediente_h_oficina = [
  { title: "Nro", field: "id", headerSort: false },
  { title: "Fecha Inicio", field: "fecha_inicio", headerSort: false },
  { title: "Iniciador", field: "iniciador", headerSort: false },
  {
    title: "Estado",
    field: "estado",
    headerSort: false
    // formatter: function(cell, formatterParams, onRendered) {
    //   var pendiente = cell.getRow().getData().pendiente;
    //   var estado = cell.getRow().getData().estado;

    //   if (pendiente && estado !== "Finalizado") {
    //     cell.getRow().getElement().style.color = "red";
    //     return cell.getValue();
    //   } else {
    //     cell.getRow().getElement().style.color = "green";
    //     return cell.getValue();
    //   }
    // }
  }
];

const expediente_h_busqueda = [
  { title: "Fecha Pase", field: "fecha_pase", headerSort: false },
  { title: "Destino", field: "destino", headerSort: false },
  { title: "Cant. Hojas", field: "cant_hojas", headerSort: false }
];

export { expediente_h_oficina, expediente_h_busqueda, expediente_b };

const expediente_b = [
  {
    id: "000001",
    fecha_inicio: "10/2/2019",
    iniciador: "Perez, Juan",
    concepto: "Solicita equivalencia de materias para Medicina Plan m2001",
    pases: [
      { destino: "G.A.D.I", cant_hojas: 2, fecha_pase: "10/2/2019" },
      { destino: "Oficina 1", cant_hojas: 3, fecha_pase: "10/2/2019" },
      { destino: "Oficina 2", cant_hojas: 4, fecha_pase: "12/2/2019" }
    ],
    estado: "En Curso"
  },
  {
    id: "000002",
    fecha_inicio: "11/2/2019",
    iniciador: "Cueto, Santiago",
    concepto: "Solicita reconocimiento de horas compensatorias",
    pases: [
      { destino: "G.A.D.I", cant_hojas: 2, fecha_pase: "11/2/2019" },
      { destino: "Oficina 1", cant_hojas: 3, fecha_pase: "11/2/2019" },
      { destino: "G.A.D.I", cant_hojas: 3, fecha_pase: "15/2/2019" }
    ],
    estado: "Finalizado"
  }
];
