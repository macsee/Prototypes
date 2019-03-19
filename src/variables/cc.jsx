// ##############################
// // // table head data and table body data for Tables view
// #############################

const comprobante_head = [
  { title: "Emision", field: "fecha_emi", headerSort: false },
  { title: "Comprobante", field: "comprobante", headerSort: false },
  { title: "Detalle", field: "detalle", headerSort: false },
  { title: "Debe", field: "debe", headerSort: false },
  { title: "Haber", field: "haber", headerSort: false },
  {
    title: "Pagado",
    field: "pagado",
    headerSort: false,
    formatter: function(cell, formatterParams, onRendered) {
      var pagado = cell.getValue();
      var fven = cell.getRow().getData().fecha_ven;
      let comprobante = cell.getRow().getData().comprobante;

      let vencido = cell.getRow().getData().vencido;

      onRendered(function() {
        cell.getColumn().hide();
      });

      if (!comprobante.includes("RI")) {
        if (pagado) {
          cell.getRow().getElement().style.color = "green";
          return pagado;
        } else if (!pagado && vencido) {
          cell.getRow().getElement().style.color = "red";
          return pagado;
        } else {
          return pagado;
        }
      } else return pagado;
    }
  },
  {
    title: "Vencimiento",
    field: "fecha_ven",
    headerSort: false
  }
];

const cuenta_corriente_head = [
  { title: "Emision", field: "fecha_emi", headerSort: false },
  { title: "Detalle", field: "detalle", headerSort: false },
  { title: "Debe", field: "debe", headerSort: false, bottomCalc: "sum" },
  { title: "Haber", field: "haber", headerSort: false, bottomCalc: "sum" }
];

const tbody = [
  {
    id: 1,
    dni: "123456789",
    apellido: "Perez",
    nombre: "Juan",
    data: [
      {
        fecha_emi: "1/1/2019",
        comprobante: "FACCAI 0000001",
        detalle: "Cuota Medicina",
        debe: 3000,
        haber: 500,
        fecha_ven: "15/1/2019",
        pagado: true,
        detalles: [
          {
            detalle: "Cuota Medicina",
            debe: 3000,
            haber: 0
          },
          {
            detalle: "Regla de negocio",
            debe: 0,
            haber: 500
          }
        ]
      },
      {
        fecha_emi: "5/1/2019",
        comprobante: "RI 0000001",
        detalle: "PAGO",
        debe: 0,
        haber: 3000,
        fecha_ven: "5/1/2019",
        pagado: true,
        detalles: [
          {
            detalle: "PAGO con CHEQUE",
            debe: 0,
            haber: 3000
          }
        ]
      },
      {
        fecha_emi: "1/2/2019",
        comprobante: "FACCAI 0000002",
        detalle: "Cuota Medicina",
        debe: 3000,
        haber: 500,
        fecha_ven: "15/2/2019",
        pagado: false,
        detalles: [
          {
            detalle: "Cuota Medicina",
            debe: 3000,
            haber: 0
          },
          {
            detalle: "Regla de negocio",
            debe: 0,
            haber: 500
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
    data: [
      {
        fecha_emi: "1/1/2019",
        comprobante: "FACCAI 0000001",
        detalle: "Cuota Medicina",
        debe: 3000,
        haber: 300,
        fecha_ven: "15/1/2019",
        pagado: false,
        detalles: [
          {
            detalle: "Cuota Medicina",
            debe: 3000,
            haber: 0
          },
          {
            detalle: "Regla de negocio",
            debe: 0,
            haber: 300
          }
        ]
      },
      {
        fecha_emi: "1/2/2019",
        comprobante: "FACCAI 0000002",
        detalle: "Cuota Medicina",
        debe: 3000,
        haber: 300,
        fecha_ven: "15/2/2019",
        pagado: false,
        detalles: [
          {
            detalle: "Cuota Medicina",
            debe: 3000,
            haber: 0
          },
          {
            detalle: "Regla de negocio",
            debe: 0,
            haber: 300
          }
        ]
      },
      {
        fecha_emi: "5/1/2019",
        comprobante: "RI 0000001",
        detalle: "PAGO",
        debe: 0,
        haber: 5000,
        fecha_ven: "5/1/2019",
        pagado: true,
        detalles: [
          {
            detalle: "PAGO con DEBITO",
            debe: 0,
            haber: 5000
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
    data: [
      {
        fecha_emi: "1/1/2019",
        comprobante: "FACCAI 0000001",
        detalle: "Cuota Medicina",
        debe: 3000,
        haber: 300,
        fecha_ven: "15/1/2019",
        pagado: false,
        detalles: [
          {
            detalle: "Cuota Medicina",
            debe: 3000,
            haber: 0
          },
          {
            detalle: "Regla de negocio",
            debe: 0,
            haber: 500
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
    data: []
  }
];

// data for <thead> of table in TableList view
// data for <tbody> of table in TableList view
export { tbody, cuenta_corriente_head, comprobante_head };
