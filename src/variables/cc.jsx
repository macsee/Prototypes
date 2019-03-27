// ##############################
// // // table head data and table body data for Tables view
// #############################

// Hacer ejemplo con reincorporacion luego de la emision de una factura y cuyo vencimiento sea posterior a la emision de la proxima factura de cuota (saldo adeudado vencido)

const comprobante_head = [
  {
    title: "Emision",
    field: "fecha_emi",
    headerSort: false,
    width: 100,
    align: "right"
  },
  {
    title: "Comprobante",
    field: "comprobante",
    headerSort: false,
    align: "right"
  },
  { title: "Detalle", field: "detalle", headerSort: false, align: "right" },
  {
    title: "Importe",
    field: "importe_total",
    headerSort: false,
    align: "right"
  },
  {
    title: "Adeudado",
    field: "importe_adeudado",
    headerSort: false,
    align: "right",
    formatter: function(cell, formatterParams, onRendered) {
      var importe_adeudado = cell.getValue();
      let comprobante = cell.getRow().getData().comprobante;
      if (!comprobante.includes("RI")) {
        if (importe_adeudado === 0) {
          cell.getRow().getElement().style.color = "green";
          return importe_adeudado;
        } else if (!importe_adeudado) {
          cell.getRow().getElement().style.color = "red";
          return importe_adeudado;
        } else {
          return importe_adeudado;
        }
      } else return importe_adeudado;
    }
  }
  // {
  //   title: "Vencimiento",
  //   field: "fecha_ven",
  //   headerSort: false,
  //   align: "right"
  // }
];

const cuenta_corriente_head = [
  {
    title: "Emision",
    field: "fecha_emi",
    headerSort: false,
    align: "right",
    width: 100
  },
  {
    title: "Detalle",
    field: "detalle",
    headerSort: false,
    align: "right"
  },
  {
    title: "Importe",
    field: "importe",
    headerSort: false,
    align: "right"
  },
  {
    title: "Saldo",
    field: "saldo",
    headerSort: false,
    align: "right"
  }
];

const tbody = [
  {
    id: 1,
    dni: "123456789",
    apellido: "Perez",
    nombre: "Juan",
    fecha_nacimiento: "10/12/1985",
    direccion: "Falsa 123",
    ciudad: "Rosario",
    celular: "152828080",
    email: "mi_nombre@iunir.com.ar",
    carrera: "Medicina",
    anio_curso: "2",
    fecha_inscripcion: "02/02/2017",
    estado: "Activo",
    regla: 500,
    avatar: require("../assets/img/faces/mike.jpg"),
    data: [
      {
        fecha_emi: "1/1/2019",
        comprobante: "FACCAI 0000001",
        detalle: "Cuota Medicina",
        importe_total: 2500,
        fecha_ven: "15/1/2019",
        pagado: true,
        importe_adeudado: 0,
        detalles: [
          {
            detalle: "Cuota Medicina",
            importe: 3000
          },
          {
            detalle: "Regla de negocio",
            importe: -500
          }
        ]
      },
      {
        fecha_emi: "5/1/2019",
        comprobante: "RI 0000001",
        detalle: "PAGO",
        importe_total: -3000,
        fecha_ven: "5/1/2019",
        pagado: true,
        importe_adeudado: "-",
        detalles: [
          {
            detalle: "PAGO con CHEQUE",
            importe: -3000
          }
        ]
      },
      {
        fecha_emi: "1/2/2019",
        comprobante: "FACCAI 0000002",
        detalle: "Cuota Medicina",
        importe_total: 2500,
        fecha_ven: "15/2/2019",
        pagado: false,
        importe_adeudado: 2000,
        detalles: [
          {
            detalle: "Cuota Medicina",
            importe: 3000
          },
          {
            detalle: "Regla de negocio",
            importe: -500
          }
        ]
      }
    ]
  },
  {
    id: 2,
    dni: "321456789",
    apellido: "Perez",
    nombre: "Pedro",
    fecha_nacimiento: "10/12/1985",
    direccion: "Falsa 123",
    ciudad: "Rosario",
    celular: "152828080",
    email: "mi_nombre@iunir.com.ar",
    carrera: "Medicina",
    anio_curso: "2",
    fecha_inscripcion: "02/02/2017",
    estado: "Activo",
    regla: 300,
    avatar: require("../assets/img/faces/erik-lucatero-2.jpg"),
    data: [
      {
        fecha_emi: "1/1/2019",
        comprobante: "FACCAI 0000011",
        detalle: "Cuota Medicina",
        importe_total: 2700,
        fecha_ven: "15/1/2019",
        pagado: true,
        importe_adeudado: 0,
        detalles: [
          {
            detalle: "Cuota Medicina",
            importe: 3000
          },
          {
            detalle: "Regla de negocio",
            importe: -300
          }
        ]
      },
      {
        fecha_emi: "1/2/2019",
        comprobante: "FACCAI 00000012",
        detalle: "Cuota Medicina",
        importe_total: 2700,
        fecha_ven: "15/2/2019",
        pagado: false,
        importe_adeudado: 400,
        detalles: [
          {
            detalle: "Cuota Medicina",
            importe: 3000
          },
          {
            detalle: "Regla de negocio",
            importe: -300
          }
        ]
      },
      {
        fecha_emi: "5/1/2019",
        comprobante: "RI 0000011",
        detalle: "PAGO",
        importe_total: -5000,
        fecha_ven: "5/1/2019",
        pagado: true,
        importe_adeudado: "-",
        detalles: [
          {
            detalle: "PAGO con DEBITO",
            importe: -5000
          }
        ]
      }
    ]
  },
  {
    id: 3,
    dni: "987654321",
    apellido: "Pereyra",
    nombre: "Elena",
    fecha_nacimiento: "10/12/1985",
    direccion: "Falsa 123",
    ciudad: "Rosario",
    celular: "152828080",
    email: "mi_nombre@iunir.com.ar",
    carrera: "Medicina",
    anio_curso: "2",
    fecha_inscripcion: "02/02/2017",
    estado: "Activo",
    regla: 0,
    avatar: require("../assets/img/faces/kaci-baum-2.jpg"),
    data: [
      {
        fecha_emi: "1/1/2019",
        comprobante: "FACCAI 0000021",
        detalle: "Cuota Medicina",
        importe_total: 2700,
        fecha_ven: "15/1/2019",
        pagado: false,
        importe_adeudado: 2700,
        detalles: [
          {
            detalle: "Cuota Medicina",
            importe: 2700
          }
        ]
      }
    ]
  },
  {
    id: 4,
    dni: "33354321",
    apellido: "Pavón",
    nombre: "Diego",
    fecha_nacimiento: "10/12/1985",
    direccion: "Falsa 123",
    ciudad: "Rosario",
    celular: "152828080",
    email: "mi_nombre@iunir.com.ar",
    carrera: "Medicina",
    anio_curso: "2",
    fecha_inscripcion: "02/02/2017",
    estado: "Activo",
    regla: 0,
    avatar: require("../assets/img/faces/ayo-ogunseinde-2.jpg"),
    data: []
  },
  {
    id: 5,
    dni: "32951327",
    apellido: "Palacios",
    nombre: "Carlos",
    fecha_nacimiento: "10/12/1985",
    direccion: "Falsa 123",
    ciudad: "Rosario",
    celular: "152828080",
    email: "mi_nombre@iunir.com.ar",
    carrera: "Medicina",
    anio_curso: "2",
    fecha_inscripcion: "02/02/2017",
    estado: "Activo",
    regla: 500,
    avatar: require("../assets/img/faces/clem-onojeghuo-3.jpg"),
    data: [
      {
        fecha_emi: "2/10/2018",
        comprobante: "FACCAI 0000031",
        detalle: "Cuota Medicina",
        importe_total: 3400,
        fecha_ven: "17/10/2018",
        pagado: true,
        importe_adeudado: 0,
        detalles: [
          {
            detalle: "Cuota Medicina",
            importe: 3900
          },
          {
            detalle: "Regla de negocio",
            importe: -500
          }
        ]
      },
      {
        fecha_emi: "6/10/2018",
        comprobante: "FACCAI 0000032",
        detalle: "Curso RCP",
        importe_total: 1000,
        fecha_ven: "21/10/2018",
        pagado: true,
        importe_adeudado: 0,
        detalles: [
          {
            detalle: "Curso RCP",
            importe: 1000
          }
        ]
      },
      {
        fecha_emi: "10/10/2018",
        comprobante: "RI 0000031",
        detalle: "Paga con Cheque",
        importe_total: 3400,
        fecha_ven: "25/10/2018",
        pagado: true,
        importe_adeudado: "-",
        detalles: [
          {
            detalle: "Paga con Cheque",
            importe: -3400
          }
        ]
      },
      {
        fecha_emi: "3/11/2018",
        comprobante: "FACCAI 0000033",
        detalle: "Cuota Medicina",
        importe_total: 3940,
        fecha_ven: "18/11/2018",
        pagado: true,
        importe_adeudado: 0,
        detalles: [
          {
            detalle: "Cuota Medicina",
            importe: 3900
          },
          {
            detalle: "Intereses",
            importe: 40
          }
        ]
      },
      {
        fecha_emi: "15/11/2018",
        comprobante: "FACCAI 0000034",
        detalle: "Reincorporación",
        importe_total: 750,
        fecha_ven: "30/11/2018",
        pagado: true,
        importe_adeudado: 0,
        detalles: [
          {
            detalle: "Reincorporación",
            importe: 750
          }
        ]
      },
      {
        fecha_emi: "20/11/2018",
        comprobante: "RI 0000032",
        detalle: "PAGO",
        importe_total: -5690,
        fecha_ven: "5/12/2018",
        pagado: true,
        importe_adeudado: "-",
        detalles: [
          {
            detalle: "PAGO con TRANSF.",
            importe: -5690
          }
        ]
      },
      {
        fecha_emi: "2/12/2018",
        comprobante: "FACCAI 0000035",
        detalle: "Cuota Medicina",
        importe_total: 3900,
        fecha_ven: "17/12/2018",
        pagado: true,
        importe_adeudado: 0,
        detalles: [
          {
            detalle: "Cuota Medicina",
            importe: 3900
          }
        ]
      },
      {
        fecha_emi: "14/12/2018",
        comprobante: "FACCAI 0000036",
        detalle: "Curso",
        importe_total: 500,
        fecha_ven: "29/12/2018",
        pagado: true,
        importe_adeudado: 0,
        detalles: [
          {
            detalle: "Curso",
            importe: 500
          }
        ]
      },
      {
        fecha_emi: "3/1/2019",
        comprobante: "FACCAI 0000037",
        detalle: "Cuota Medicina",
        importe_total: 4076,
        fecha_ven: "18/1/2019",
        pagado: true,
        importe_adeudado: 0,
        detalles: [
          {
            detalle: "Cuota Medicina",
            importe: 3900
          },
          {
            detalle: "Intereses",
            importe: 176
          }
        ]
      },
      {
        fecha_emi: "5/1/2019",
        comprobante: "RI 0000033",
        detalle: "PAGO",
        importe_total: -3900,
        fecha_ven: "20/1/2019",
        pagado: true,
        importe_adeudado: "-",
        detalles: [
          {
            detalle: "PAGO con TRANSF.",
            importe: -3900
          }
        ]
      },
      {
        fecha_emi: "6/2/2019",
        comprobante: "FACCAI 0000038",
        detalle: "Cuota Medicina",
        importe_total: 4083,
        fecha_ven: "21/2/2019",
        pagado: true,
        importe_adeudado: 0,
        detalles: [
          {
            detalle: "Cuota Medicina",
            importe: 3900
          },
          {
            detalle: "Intereses",
            importe: 183
          }
        ]
      },
      {
        fecha_emi: "9/2/2019",
        comprobante: "RI 0000034",
        detalle: "PAGO",
        importe_total: -10000,
        fecha_ven: "24/2/2019",
        pagado: true,
        importe_adeudado: "-",
        detalles: [
          {
            detalle: "PAGO con TRANSF.",
            importe: -10000
          }
        ]
      }
    ]
  },
  {
    id: 6,
    dni: "41941923",
    apellido: "Palma",
    nombre: "Vilma",
    fecha_nacimiento: "10/12/1985",
    direccion: "Falsa 123",
    ciudad: "Rosario",
    celular: "152828080",
    email: "mi_nombre@iunir.com.ar",
    carrera: "Medicina",
    anio_curso: "2",
    fecha_inscripcion: "02/02/2017",
    estado: "Activo",
    regla: 500,
    avatar: require("../assets/img/faces/joe-gardner-2.jpg"),
    data: [
      {
        fecha_emi: "2/10/2018",
        comprobante: "FACCAI 0000031",
        detalle: "Cuota Medicina",
        importe_total: 3400,
        fecha_ven: "17/10/2018",
        pagado: true,
        importe_adeudado: 0,
        detalles: [
          {
            detalle: "Cuota Medicina",
            importe: 3900
          },
          {
            detalle: "Regla de negocio",
            importe: -500
          }
        ]
      },
      {
        fecha_emi: "6/10/2018",
        comprobante: "FACCAI 0000032",
        detalle: "Curso RCP",
        importe_total: 1000,
        fecha_ven: "21/10/2018",
        pagado: true,
        importe_adeudado: 0,
        detalles: [
          {
            detalle: "Curso RCP",
            importe: 1000
          }
        ]
      },
      {
        fecha_emi: "10/10/2018",
        comprobante: "RI 0000031",
        detalle: "Paga con Cheque",
        importe_total: 3400,
        fecha_ven: "25/10/2018",
        pagado: true,
        importe_adeudado: "-",
        detalles: [
          {
            detalle: "Paga con Cheque",
            importe: -3400
          }
        ]
      },
      {
        fecha_emi: "3/11/2018",
        comprobante: "FACCAI 0000033",
        detalle: "Cuota Medicina",
        importe_total: 3940,
        fecha_ven: "18/11/2018",
        pagado: true,
        importe_adeudado: 0,
        detalles: [
          {
            detalle: "Cuota Medicina",
            importe: 3900
          },
          {
            detalle: "Intereses",
            importe: 40
          }
        ]
      },
      {
        fecha_emi: "15/11/2018",
        comprobante: "FACCAI 0000034",
        detalle: "Reincorporación",
        importe_total: 750,
        fecha_ven: "30/11/2018",
        pagado: true,
        importe_adeudado: 0,
        detalles: [
          {
            detalle: "Reincorporación",
            importe: 750
          }
        ]
      },
      {
        fecha_emi: "20/11/2018",
        comprobante: "RI 0000032",
        detalle: "PAGO",
        importe_total: -5690,
        fecha_ven: "5/12/2018",
        pagado: true,
        importe_adeudado: "-",
        detalles: [
          {
            detalle: "PAGO con TRANSF.",
            importe: -5690
          }
        ]
      },
      {
        fecha_emi: "2/12/2018",
        comprobante: "FACCAI 0000035",
        detalle: "Cuota Medicina",
        importe_total: 3900,
        fecha_ven: "17/12/2018",
        pagado: true,
        importe_adeudado: 0,
        detalles: [
          {
            detalle: "Cuota Medicina",
            importe: 3900
          },
          {
            detalle: "Regla de negocio",
            importe: -500
          }
        ]
      },
      {
        fecha_emi: "14/12/2018",
        comprobante: "FACCAI 0000036",
        detalle: "Curso",
        importe_total: 500,
        fecha_ven: "29/12/2018",
        pagado: true,
        importe_adeudado: 0,
        detalles: [
          {
            detalle: "Curso",
            importe: 500
          }
        ]
      },
      {
        fecha_emi: "3/1/2019",
        comprobante: "FACCAI 0000037",
        detalle: "Cuota Medicina",
        importe_total: 4076,
        fecha_ven: "18/1/2019",
        pagado: true,
        importe_adeudado: 0,
        detalles: [
          {
            detalle: "Cuota Medicina",
            importe: 3900
          },
          {
            detalle: "Intereses",
            importe: 156
          }
        ]
      },
      {
        fecha_emi: "5/1/2019",
        comprobante: "RI 0000033",
        detalle: "PAGO",
        importe_total: -3900,
        fecha_ven: "20/1/2019",
        pagado: true,
        importe_adeudado: "-",
        detalles: [
          {
            detalle: "PAGO con TRANSF.",
            importe: -3900
          }
        ]
      },
      {
        fecha_emi: "6/2/2019",
        comprobante: "FACCAI 0000038",
        detalle: "Cuota Medicina",
        importe_total: 4083,
        fecha_ven: "21/2/2019",
        pagado: true,
        importe_adeudado: 0,
        detalles: [
          {
            detalle: "Cuota Medicina",
            importe: 3900
          },
          {
            detalle: "Intereses",
            importe: 162
          }
        ]
      },
      {
        fecha_emi: "9/2/2019",
        comprobante: "RI 0000034",
        detalle: "PAGO",
        importe_total: -10000,
        fecha_ven: "24/2/2019",
        pagado: true,
        importe_adeudado: "-",
        detalles: [
          {
            detalle: "PAGO con TRANSF.",
            importe: -10000
          }
        ]
      }
    ]
  }
];

export { tbody, cuenta_corriente_head, comprobante_head };
