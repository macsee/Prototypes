/* eslint-disable no-console */
/* eslint-disable react/prop-types */
import React from "react";
import MyAutossugest from "../../components/MyAutossugest/MyAutosuggest.jsx";
import classnames from "classnames";
import {
  Form,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Row,
  Col,
  Label,
  FormGroup,
  Input,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink
} from "reactstrap";

import { cuenta_corriente_head, comprobante_head, tbody } from "variables/cc";
import Button from "components/CustomButton/CustomButton.jsx";
import CustomTable from "components/CustomTable/CustomTable.jsx";
import { maxHeaderSize } from "http";

// TODO: no se ponen en verde los pagados
// TODO: si hay saldo a favor no se cancela la factura emitida
// TODO: el interes se calcula siempre que se factura y no si los saldos estan vencidos

class CuentaCorriente extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      globalFacturaCount: 2,
      globalRiCount: 1,
      globalReincCount: 0,
      fhoy: new Date(),
      activeTab: "1",
      inputCobrarValor: 0,
      inputFacturarValor: 3900,
      userMontoRegla: 0,
      userSaldoAdeudado: 0,
      userCC: [],
      userComprobantesDetalle: [],
      userSaldoVencer: 0 // FIX: se puede borrar
    };
  }

  componentDidMount = () => {
    this.calcularTotales(this.state.userCC);
  };

  updateCobrarValue = evt => {
    this.setState({ ...this.state, inputCobrarValor: evt.target.value });
  };

  updateFacturarValue = evt => {
    this.setState({ ...this.state, inputFacturarValor: evt.target.value });
  };

  updateFecha = evt => {
    this.setState(
      {
        ...this.state,
        fhoy: new Date(evt.target.value + " 00:00:00")
      },
      function() {
        this.calcularTotales(this.state.userCC);
      }
    );
  };

  toggle = tab => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  };

  getDetalles = tbody => {
    if (tbody.length === 0) return [];
    return [].concat.apply(
      [],
      tbody.map(prop => {
        return prop.detalles.map(detalle => {
          detalle.fecha_emi = prop.fecha_emi;
          return detalle;
        });
      })
    );
  };

  // TODO: Utilizar reduce en vez de map
  calcularSaldosParciales = tabla => {
    let acum = 0;
    tabla.map(prop => {
      return prop.detalles.map(detalle => {
        acum = acum + detalle.importe;
        detalle.saldo = acum;
        return detalle;
      });
    });
    return acum;
  };

  setData = id => {
    let index = tbody.findIndex(x => x.id === id);
    this.setState(
      {
        ...this.state,
        userSaldoAdeudado: this.calcularSaldosParciales(tbody[index].data),
        userMontoRegla: tbody[index].regla,
        userCC: tbody[index].data,
        userComprobantesDetalle: this.getDetalles(tbody[index].data)
      },
      function() {
        this.calcularTotales(this.state.userCC);
      }
    );
  };

  isVencida = (fhoy, fven) => {
    return fhoy > fven;
  };

  calcularTotales = tempcc => {
    let fhoy = this.state.fhoy;
    let userSaldoVencer = 0;

    if (tempcc.length === 0) return;

    tempcc.map(prop => {
      let fven = prop.fecha_ven.split("/");
      fven = new Date(
        parseInt(fven[2]),
        parseInt(fven[1]) - 1,
        parseInt(fven[0])
      );

      prop.vencido = false;
      if (!prop.pagado && this.isVencida(fhoy, fven)) {
        prop.vencido = true;
      } else if (!prop.pagado && !this.isVencida(fhoy, fven)) {
        userSaldoVencer += prop.debe;
      }
    });
    this.setState({
      ...this.state,
      userCC: tempcc,
      userSaldoVencer: userSaldoVencer,
      userComprobantesDetalle: this.getDetalles(tempcc)
    });
  };

  actualizarEstado = tempcc => {
    this.setState({
      ...this.state,
      userCC: tempcc,
      userComprobantesDetalle: this.getDetalles(tempcc),
      userSaldoAdeudado: tempcc.slice(-1)[0].detalles.slice(-1)[0].saldo
    });
  };

  emitirComprobante = (
    tipo,
    detalle,
    importe,
    fechaVencimiento,
    pagado,
    detalles,
    importeAdeudado = undefined
  ) => {
    const tempcc = this.state.userCC;
    let t = tempcc.concat([
      {
        fecha_emi: this.state.fhoy.toLocaleDateString(),
        comprobante: tipo,
        detalle: detalle,
        importe_total: importe,
        fecha_ven: fechaVencimiento.toLocaleDateString(),
        pagado: pagado,
        detalles: detalles,
        importe_adeudado: importeAdeudado
      }
    ]);

    this.pagarFacturas(t, importe);
    this.actualizarEstado(t);
    // let p = this.pagarFacturas(t, importe);
    // this.actualizarEstado(p.t);
  };

  pagarFacturas = (t, importe_pagado) => {
    console.log("Hola");
    let resto =
      this.state.userSaldoAdeudado < 0
        ? -importe_pagado + this.state.userSaldoAdeudado
        : -importe_pagado;

    for (var i in t) {
      if (t[i].importe_adeudado > 0) {
        if (resto < 0) {
          let parteDePago =
            -resto > t[i].importe_adeudado ? -t[i].importe_adeudado : resto;
          t[i].importe_adeudado += parteDePago;
          resto += parteDePago;
        } else {
          break;
        }
      }
    }

    return { t: t, r: resto };
  };

  cobrar = () => {
    let value = parseInt(this.state.inputCobrarValor);
    let count = this.state.globalRiCount + 1;
    if (value === 0 || isNaN(value)) return;

    this.setState(
      {
        ...this.state,
        globalRiCount: count
      },
      function() {
        this.emitirComprobante(
          "RI 000000" + count,
          "PAGO",
          value,
          this.state.fhoy,
          true,
          [
            {
              detalle: "PAGO con CHEQUE",
              importe: -value,
              saldo: this.state.userSaldoAdeudado - value
            }
          ]
        );
      }
    );
  };

  facturar = () => {
    let comp;
    let detalle;
    let detalles;
    let value = parseInt(this.state.inputFacturarValor);
    let fcount = this.state.globalFacturaCount;
    let rcount = this.state.globalReincCount;

    let fechaVencimiento = new Date();

    fechaVencimiento.setTime(
      this.state.fhoy.getTime() + 15 * 24 * 60 * 60 * 1000
    );
    let userSaldoAdeudado = this.state.userSaldoAdeudado;
    if (value === 3900) {
      fcount = fcount + 1;
      comp = "FACCAI 000000" + fcount;
      detalle = "Cuota Medicina";
      detalles = [];
      if (this.state.userSaldoAdeudado > 0) {
        let interesFacaii = Math.round(userSaldoAdeudado * 0.04);
        userSaldoAdeudado += interesFacaii;
        detalles.push({
          detalle: "Interes",
          importe: interesFacaii,
          saldo: userSaldoAdeudado
        });
      }
      userSaldoAdeudado += value;
      detalles.push({
        detalle: "Cuota Medicina",
        importe: value,
        saldo: userSaldoAdeudado
      });
      if (this.state.userSaldoAdeudado <= 0 && this.state.userMontoRegla > 0) {
        userSaldoAdeudado -= this.state.userMontoRegla;
        detalles.push({
          detalle: "Regla de negocio",
          importe: -this.state.userMontoRegla,
          saldo: userSaldoAdeudado
        });
      }
    } else {
      fcount = fcount + 1;
      comp = "FACCAI 000000" + fcount;
      detalle = "Reincorporación";
      detalles = [
        {
          detalle: "Reincorporación",
          importe: value,
          saldo: userSaldoAdeudado + value
        }
      ];
    }
    let valueTotal = detalles.reduce(
      (total, detalle) => total + detalle.importe,
      0
    );
    this.setState(
      {
        ...this.state,
        globalFacturaCount: fcount,
        globalReincCount: rcount
      },
      function() {
        this.emitirComprobante(
          comp,
          detalle,
          valueTotal,
          fechaVencimiento,
          false,
          detalles,
          valueTotal
        );
      }
    );
  };

  render() {
    let saldoClase = "";

    if (this.state.userSaldoAdeudado > 0)
      saldoClase = "saldo-adeudado saldo-adeudado-contra";
    else saldoClase = "saldo-adeudado saldo-adeudado-favor";

    return (
      <div className="content">
        <Row>
          <Col md={{ size: 12 }} xs={12}>
            <Card>
              <CardBody>
                <Form>
                  <Row form>
                    <Col md={2}>
                      <FormGroup>
                        <Label for="exampleSelect1">Fecha Actual</Label>
                        <Input
                          type="date"
                          name="fecha"
                          id="fecha"
                          defaultValue={this.state.fhoy
                            .toISOString()
                            .substr(0, 10)}
                          onChange={this.updateFecha}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={{ size: 2, offset: 1 }}>
                      <FormGroup>
                        <Label for="exampleSelect1">Facturar</Label>
                        <Input
                          type="select"
                          name="select"
                          id="exampleSelect1"
                          defaultValue={this.state.inputFacturarValor}
                          onChange={this.updateFacturarValue}
                        >
                          <option value="3900">Cuota Medicina</option>
                          <option value="750">Reincorporacion</option>
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col md={2}>
                      <Button
                        className="myBoton"
                        color="primary"
                        size="md"
                        onClick={() => this.facturar()}
                      >
                        Facturar
                      </Button>
                    </Col>
                    <Col md={2}>
                      <FormGroup>
                        <Label for="cobrarLabel">Cobrar</Label>
                        <Input
                          type="text"
                          name="cobrar"
                          id="cobrarLabel"
                          onChange={this.updateCobrarValue}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={2}>
                      <Button
                        className="myBoton"
                        color="primary"
                        size="md"
                        onClick={() => this.cobrar()}
                      >
                        Cobrar
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md={{ size: 12 }} xs={12}>
            <Card>
              <CardHeader>
                <CardTitle tag="h4">Alumno</CardTitle>
              </CardHeader>
              <CardBody>
                <Form>
                  <Row form>
                    <Col md={6}>
                      <FormGroup>
                        <MyAutossugest
                          data={tbody}
                          placeholder={"Buscar Apellido"}
                          callback={x => this.setData(x)}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <Row>
                        <Col md={3} className="saldo-label">
                          Saldo:
                        </Col>
                        <Col md={9} className={saldoClase}>
                          $ {this.state.userSaldoAdeudado}
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md={{ size: 12 }} xs={12}>
            <Card>
              <CardBody>
                <Nav tabs>
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: this.state.activeTab === "1"
                      })}
                      onClick={() => {
                        this.toggle("1");
                      }}
                    >
                      Cuenta Corriente
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: this.state.activeTab === "2"
                      })}
                      onClick={() => {
                        this.toggle("2");
                      }}
                    >
                      Comprobantes
                    </NavLink>
                  </NavItem>
                </Nav>

                <TabContent activeTab={this.state.activeTab}>
                  <TabPane tabId="1">
                    <Row>
                      <Col md={{ size: 12 }} xs={12}>
                        <CustomTable
                          header={cuenta_corriente_head}
                          body={this.state.userComprobantesDetalle}
                          tipo={"cuenta_corriente"}
                          changeStateFromTable={() => {
                            return null;
                          }}
                        />
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane tabId="2">
                    <CustomTable
                      header={comprobante_head}
                      body={this.state.userCC}
                      tipo={"comprobante"}
                      changeStateFromTable={() => {
                        return null;
                      }}
                    />
                  </TabPane>
                </TabContent>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default CuentaCorriente;
