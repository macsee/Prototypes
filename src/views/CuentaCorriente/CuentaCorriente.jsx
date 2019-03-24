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

// TODO: sacar valor pagado true/false y verificar importe adeudado para pintar de verde
// TODO: no se ponene en verde los pagados
// TODO: al usuario Pavon no se le pueden emitir comprobantes

class CuentaCorriente extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      monto_regla: 0,
      suma_haber: 0,
      suma_debe: 0,
      cobrar_value: 0,
      facturar_value: 3900,
      cc: [],
      comprobantes_detalle: [],
      factura_count: 2,
      ri_count: 1,
      reinc_count: 0,
      saldo_vencido: 0,
      saldo_vencer: 0,
      saldo_adeudado: 0,
      anticipo: 0,
      interes_total: 0,
      interes_individual: 0,
      activeTab: "1",
      fhoy: new Date()
    };
  }

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
          // new_d = Object.assign(
          //   {},
          //   fecha_emi: prop.fecha_emi,
          //   new_d
          // );
          // return new_d;
          return detalle;
        });
      })
    );
  };

  calcularSaldosParciales = tabla => {
    let acum = 0;
    // if (tabla.length === 0) return;

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
    let saldo_adeudado = this.calcularSaldosParciales(tbody[index].data);

    this.setState(
      {
        ...this.state,
        saldo_adeudado: saldo_adeudado,
        monto_regla: tbody[index].regla, //Aparece aunuqe sea igual a 0
        cc: tbody[index].data,
        comprobantes_detalle: this.getDetalles(tbody[index].data)
      },
      function() {
        this.calcularTotales(this.state.cc, this.state.anticipo);
      }
    );
  };

  isVencida = (fhoy, fven) => {
    return fhoy > fven;
  };

  componentDidMount = () => {
    // this.actualizar();
    this.calcularTotales(this.state.cc, this.state.anticipo);
  };

  updateCobrarValue = evt => {
    this.setState({ ...this.state, cobrar_value: evt.target.value });
  };

  updateFacturarValue = evt => {
    this.setState({ ...this.state, facturar_value: evt.target.value });
  };

  updateFecha = evt => {
    this.setState(
      {
        ...this.state,
        fhoy: new Date(evt.target.value + " 00:00:00")
      },
      function() {
        this.calcularTotales(this.state.cc, this.state.anticipo);
      }
    );
  };

  calcularTotales = (tempcc, resto) => {
    let suma_d = 0;
    let suma_h = 0;
    let fhoy = this.state.fhoy;
    let anticipo = 0;
    let saldo_vencer = 0;
    let saldo_vencido = 0;
    let interes_individual = 0;

    if (tempcc.length === 0) return;

    tempcc.map(prop => {
      suma_d = suma_d + prop.debe;
      suma_h = suma_h + prop.haber;

      let fven = prop.fecha_ven.split("/");

      fven = new Date(
        parseInt(fven[2]),
        parseInt(fven[1]) - 1,
        parseInt(fven[0])
      );

      prop.vencido = false;
      if (!prop.pagado && this.isVencida(fhoy, fven)) {
        saldo_vencido += prop.debe;
        prop.vencido = true;
        let msPerDay = 24 * 60 * 60 * 1000; // Number of milliseconds per day
        let daysLeft = Math.round((fhoy.getTime() - fven.getTime()) / msPerDay);
        interes_individual += Math.round(daysLeft * (prop.debe * 0.0013));
      } else if (!prop.pagado && !this.isVencida(fhoy, fven)) {
        saldo_vencer += prop.debe;
      }
    });
    anticipo += resto;
    this.setState({
      ...this.state,
      cc: tempcc,
      suma_debe: suma_d,
      suma_haber: suma_h,
      saldo_vencer: saldo_vencer,
      saldo_vencido: saldo_vencido,
      anticipo: anticipo,
      comprobantes_detalle: this.getDetalles(tempcc),
      interes_total: saldo_vencido * 0.04,
      interes_individual: interes_individual
    });
  };

  actualizarEstado = tempcc => {
    this.setState({
      ...this.state,
      cc: tempcc,
      comprobantes_detalle: this.getDetalles(tempcc),
      saldo_adeudado: tempcc.slice(-1)[0].detalles.slice(-1)[0].saldo
    });
  };

  emitirComprobante = (
    tipo,
    detalle,
    importe,
    // debe,
    // haber,
    fecha_ven,
    pagado,
    detalles,
    importe_adeudado = undefined
  ) => {
    if (this.state.cc.length === 0) return;
    const tempcc = this.state.cc;

    let t = tempcc.concat([
      {
        fecha_emi: this.state.fhoy.toLocaleDateString(),
        comprobante: tipo,
        detalle: detalle,
        importe: importe,
        // debe: debe,
        // haber: haber,
        fecha_ven: fecha_ven.toLocaleDateString(),
        pagado: pagado,
        detalles: detalles,
        importe_adeudado: importe_adeudado
      }
    ]);

    let p = this.pagarFacturasImpagas(t, importe);

    this.actualizarEstado(p.t);
    // this.calcularSaldosParciales(p.t);

    // this.calcularTotales(p.t, p.r);
  };

  pagarFacturasImpagas = (t, saldo) => {
    let resto = saldo;

    for (var l in t) {
      if (!t[l].pagado) {
        if (resto >= t[l].debe) {
          t[l].pagado = true;
          resto = resto - t[l].debe;
        } else {
          break;
        }
      }
    }
    return { t: t, r: resto };
  };

  cobrar = () => {
    let value = parseInt(this.state.cobrar_value);
    let count = this.state.ri_count + 1;
    if (value === 0 || isNaN(value)) return;

    this.setState(
      {
        ...this.state,
        ri_count: count
      },
      function() {
        this.emitirComprobante(
          "RI 000000" + count,
          "PAGO",
          -value,
          this.state.fhoy,
          true,
          [
            {
              detalle: "PAGO con CHEQUE",
              importe: -value,
              saldo: this.state.saldo_adeudado - value
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
    let value = parseInt(this.state.facturar_value);
    let fcount = this.state.factura_count;
    let rcount = this.state.reinc_count;

    let fecha_ven = new Date();

    fecha_ven.setTime(this.state.fhoy.getTime() + 15 * 24 * 60 * 60 * 1000);
    let saldo_adeudado = this.state.saldo_adeudado;
    if (value === 3900) {
      fcount = fcount + 1;
      comp = "FACCAI 000000" + fcount;
      detalle = "Cuota Medicina";
      detalles = [];
      if (saldo_adeudado > 0) {
        let interes_facaii = saldo_adeudado * 0.04;
        detalles.push({
          detalle: "Interes",
          importe: interes_facaii,
          saldo: saldo_adeudado + interes_facaii //para que se usa este valor?
        });
      }
      detalles.push({
        detalle: "Cuota Medicina",
        importe: value,
        saldo: saldo_adeudado + value
      });
      if (saldo_adeudado <= 0) {
        detalles.push({
          detalle: "Regla de negocio",
          importe: -this.state.monto_regla,
          saldo: saldo_adeudado + value - this.state.monto_regla
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
          saldo: saldo_adeudado + value
        }
      ];
    }

    let value_total = detalles.reduce(
      (total, detalle) => total + detalle.importe,
      0
    );
    this.setState(
      {
        ...this.state,
        factura_count: fcount,
        reinc_count: rcount
      },
      function() {
        this.emitirComprobante(
          comp,
          detalle,
          value_total,
          fecha_ven,
          false,
          detalles,
          value_total
        );
      }
    );
  };

  render() {
    let saldo_clase = "";

    if (this.state.saldo_adeudado > 0)
      saldo_clase = "saldo-adeudado saldo-adeudado-contra";
    else saldo_clase = "saldo-adeudado saldo-adeudado-favor";

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
                          defaultValue={this.state.facturar_value}
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
                        <Col md={2} className="saldo-label">
                          Saldo:
                        </Col>

                        <Col md={10} className={saldo_clase}>
                          $ {this.state.saldo_adeudado}
                        </Col>
                      </Row>
                      {/* <Row>
                        <Col m3={10}>Anticipo:</Col>
                        <Col m3={1}>{this.state.anticipo}</Col>
                      </Row>
                      <Row>
                        <Col m3={10}>Saldo:</Col>
                        <Col m3={1}>{this.state.saldo_vencer}</Col>
                      </Row>
                      <Row>
                        <Col m3={10}>Saldo Vencido:</Col>
                        <Col m3={1}>{this.state.saldo_vencido}</Col>
                      </Row>
                      <Row>
                        <Col m3={10}>Interés Individual:</Col>
                        <Col m3={1}>{this.state.interes_individual}</Col>
                      </Row>
                      <Row>
                        <Col m3={10}>Interés Total:</Col>
                        <Col m3={1}>{this.state.interes_total}</Col>
                      </Row> */}
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
                        {/* <Label for="cobrarLabel">Cuenta Corriente</Label> */}
                        <CustomTable
                          header={cuenta_corriente_head}
                          body={this.state.comprobantes_detalle}
                          suma_debe={this.state.suma_debe}
                          suma_haber={this.state.suma_haber}
                          tipo={"cuenta_corriente"}
                        />
                      </Col>
                      {/* <Col md={{ size: 7 }} xs={12}>
                        <Label for="cobrarLabel">Comprobantes</Label>
                        <CustomTable
                          header={comprobante_head}
                          body={this.state.cc}
                          suma_debe={this.state.suma_debe}
                          suma_haber={this.state.suma_haber}
                          tipo={"comprobante"}
                        />
                      </Col> */}
                    </Row>
                  </TabPane>
                  <TabPane tabId="2">
                    <CustomTable
                      header={comprobante_head}
                      body={this.state.cc}
                      importe={this.state.suma_debe}
                      suma_haber={this.state.suma_haber}
                      tipo={"comprobante"}
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
