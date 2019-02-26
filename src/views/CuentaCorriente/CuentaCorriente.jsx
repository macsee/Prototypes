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

// import FormInputs from "components/FormInputs/FormInputs.jsx";
import { cuenta_corriente_head, comprobante_head, tbody } from "variables/cc";
import Button from "components/CustomButton/CustomButton.jsx";
// import { networkInterfaces } from "os";
import CustomTable from "components/CustomTable/CustomTable.jsx";

class CuentaCorriente extends React.Component {
  constructor(props) {
    console.log();
    super(props);
    this.state = {
      suma_haber: 0,
      suma_debe: 0,
      cobrar_value: 0,
      facturar_value: 3000,
      cc: [],
      comprobantes_detalle: [],
      factura_count: 2,
      ri_count: 1,
      reinc_count: 0,
      saldo_vencido: 0,
      saldo_vencer: 0,
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

  setData = id => {
    let index = tbody.findIndex(x => x.id == id);

    this.setState(
      {
        ...this.state,
        cc: tbody[index].data,
        comprobantes_detalle: this.getDetalles(tbody[index].data)
      },
      function() {
        this.calcularTotales(this.state.cc, this.state.anticipo);
      }
    );
  };

  isVencida = (fhoy, comprobante) => {
    let fven = comprobante.fecha_ven.split("/");
    fven = new Date(fven[2], fven[1] - 1, fven[0]);
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
    let fhoy = evt.target.value.split("-");

    this.setState(
      {
        ...this.state,
        fhoy: new Date(fhoy[0], fhoy[1] - 1, fhoy[2])
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

      if (!prop.pagado && this.isVencida(fhoy, prop)) {
        saldo_vencido += prop.debe;
        let fven = prop.fecha_ven.split("/");
        fven = new Date(fven[2], fven[1] - 1, fven[0]);
        let msPerDay = 24 * 60 * 60 * 1000; // Number of milliseconds per day
        let daysLeft = Math.round((fhoy.getTime() - fven.getTime()) / msPerDay);
        console.log("dias de vencimiento:", fhoy, fven, fhoy - fven, daysLeft);
        interes_individual += daysLeft * (prop.debe * 0.0013);
      } else if (!prop.pagado && !this.isVencida(fhoy, prop))
        saldo_vencer += prop.debe;
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

  emitirComprobante = (
    tipo,
    detalle,
    debe,
    haber,
    fecha_ven,
    pagado,
    detalles
  ) => {
    if (this.state.cc.length === 0) return;
    const tempcc = this.state.cc;

    let t = tempcc.concat([
      {
        fecha_emi: new Date().toLocaleDateString(),
        comprobante: tipo,
        detalle: detalle,
        debe: debe,
        haber: haber,
        fecha_ven: fecha_ven.toLocaleDateString(),
        pagado: pagado,
        detalles: detalles
      }
    ]);

    let p = this.pagarFacturasImpagas(t, haber + this.state.anticipo);

    this.calcularTotales(p.t, p.r);
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
          0,
          value,
          new Date(),
          true,
          [
            {
              detalle: "PAGO con CHEQUE",
              debe: 0,
              haber: value
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
    let fecha = new Date();
    let fecha_ven = new Date();
    fecha_ven.setTime(fecha.getTime() + 15 * 24 * 60 * 60 * 1000);

    if (value === 3000) {
      fcount = fcount + 1;
      comp = "FACCAI 000000" + fcount;
      detalle = "Cuota Medicina";
      detalles = [
        {
          detalle: "Cuota Medicina",
          debe: value,
          haber: 0
        },
        {
          detalle: "Regla de negocio",
          debe: 0,
          haber: 500
        }
      ];
    } else {
      rcount = rcount + 1;
      comp = "REINC 000000" + rcount;
      detalle = "Reincorporacion";
      detalles = [
        {
          detalle: "PAGO con CHQUE",
          debe: 0,
          haber: value
        }
      ];
    }

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
          value,
          0,
          fecha_ven,
          false,
          detalles
        );
      }
    );
  };

  render() {
    return (
      <div className="content">
        <Row>
          <Col md={{ size: 10, offset: 1 }} xs={12}>
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
                          <option value="3000">Cuota Medicina</option>
                          <option value="200">Reincorporacion</option>
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
          <Col md={{ size: 10, offset: 1 }} xs={12}>
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
                          callback={x => this.setData(x)}
                        />
                        {/* <Label for="dni">DNI</Label>
                        <Input
                          type="text"
                          name="dni"
                          id="dni"
                          defaultValue="30123456"
                        /> */}
                      </FormGroup>
                    </Col>
                    {/* <Col md={4}>
                      <h5 className="nombre-alumno">Perez, José</h5>
                    </Col> */}
                    <Col className="saldos" md={6}>
                      <Row>
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
                      </Row>
                    </Col>
                  </Row>
                </Form>
              </CardBody>
            </Card>
          </Col>
          <Col md={{ size: 10, offset: 1 }} xs={12}>
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
                    <CustomTable
                      header={cuenta_corriente_head}
                      body={this.state.comprobantes_detalle}
                      suma_debe={this.state.suma_debe}
                      suma_haber={this.state.suma_haber}
                      tipo={"cuenta_corriente"}
                    />
                  </TabPane>
                  <TabPane tabId="2">
                    <CustomTable
                      header={comprobante_head}
                      body={this.state.cc}
                      suma_debe={this.state.suma_debe}
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
