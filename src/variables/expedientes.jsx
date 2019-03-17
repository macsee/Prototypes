// ##############################
// // // table head data and table body data for Tables view
// #############################

const oficinas = [
  { id: 0, nombre: "G.A.D.I" },
  { id: 1, nombre: "Oficina 1" },
  { id: 2, nombre: "Oficina 2" }
];
const expediente_h_oficina = [
  { title: "Nro", field: "id", headerSort: false, minWidth: 80 },
  {
    title: "Fecha Pase",
    field: "fecha_pase",
    headerSort: false,
    minWidth: 100
  },
  { title: "Pase", field: "pase", headerSort: false, minWidth: 200 },
  { title: "Motivo", field: "motivo", headerSort: false, minWidth: 300 },
  {
    title: "Recibido",
    field: "recibido",
    headerSort: false,
    minwidth: 50,
    formatter: "tickCross",
    align: "center"
  }
];

const expediente_h_busqueda = [
  { title: "Fecha Pase", field: "fecha_pase", headerSort: false },
  { title: "Destino", field: "destino", headerSort: false },
  { title: "Cant. Hojas", field: "cant_hojas", headerSort: false }
];

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
    estado: "En Curso",
    recibido: true
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
    estado: "En Curso",
    recibido: false
  },
  {
    id: "000003",
    fecha_inicio: "2/3/2019",
    iniciador: "Perez, Pedro",
    concepto: "Solicita homologación de título de Enfermería plan E2018",
    pases: [
      { destino: "G.A.D.I", cant_hojas: 2, fecha_pase: "2/3/2019" },
      { destino: "Oficina 2", cant_hojas: 3, fecha_pase: "2/3/2019" }
    ],
    estado: "En Curso",
    recibido: false
  },
  {
    id: "000004",
    fecha_inicio: "4/3/2019",
    iniciador: "Perez, Pedro",
    concepto: "Solicita homologación de título de Enfermería plan E2018",
    pases: [
      { destino: "G.A.D.I", cant_hojas: 2, fecha_pase: "4/3/2019" },
      { destino: "Oficina 2", cant_hojas: 3, fecha_pase: "4/3/2019" },
      { destino: "G.A.D.I", cant_hojas: 6, fecha_pase: "10/3/2019" }
    ],
    estado: "Finalizado",
    recibido: false
  },
  {
    id: "000005",
    fecha_inicio: "4/3/2019",
    iniciador: "Sol, Perez",
    concepto: "Solicita homologación de título de Enfermería plan E2018",
    pases: [
      { destino: "G.A.D.I", cant_hojas: 2, fecha_pase: "4/3/2019" },
      { destino: "Oficina 1", cant_hojas: 3, fecha_pase: "4/3/2019" },
      { destino: "Oficina 2", cant_hojas: 6, fecha_pase: "10/3/2019" },
      { destino: "Oficina 1", cant_hojas: 6, fecha_pase: "11/3/2019" },
      { destino: "Oficina 2", cant_hojas: 6, fecha_pase: "12/3/2019" }
    ],
    estado: "En Curso",
    recibido: false
  }
];

export { expediente_h_oficina, expediente_h_busqueda, expediente_b, oficinas };
