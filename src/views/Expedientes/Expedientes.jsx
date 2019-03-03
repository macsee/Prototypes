import React, { Component } from "react";

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

import {
  expediente_h_oficina,
  expediente_h_busqueda,
  expediente_b
} from "variables/expedientes.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import CustomTable from "components/CustomTable/CustomTable.jsx";
// import NavTabsExpedientes from "./NavTabsExpedientes.jsx";

class Expedientes extends Component {
  state = {
    activeTab: "1",
    oficina: "0",
    text_oficina: "G.A.D.I"
  };

  toggle = tab => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  };

  updateOficina = evt => {
    this.setState({
      ...this.state,
      oficina: evt.target.value,
      activeTab: evt.target.value === "0" ? "1" : "2",
      text_oficina: document.getElementById("select_oficina").options[
        evt.target.value
      ].text
    });
  };

  getExpedientesPendientes = (oficina, tabla) => {
    let row;

    row = tabla.map(value => {
      var o = Object.assign({}, value);
      if (value.pases[value.pases.length - 1].destino === oficina)
        o.pendiente = true;
      else o.pendiente = false;

      return o;
    });

    row = row.filter(value => {
      return value.pases.some(function(o) {
        return o.destino === oficina;
      });
    });

    return row;
    // for (var key in tabla) {
    //   row = tabla[key];
    //   for (var k in row.pases) {
    //     if (row.pases[k].destino === oficina) console.log(row.pases[k]);
    //   }
    // }
  };

  renderTabs = oficina => {
    let navItem1 = null;
    let tabPane1 = null;

    let navItem2 = (
      <NavItem>
        <NavLink
          className={classnames({
            active: this.state.activeTab === "2"
          })}
          onClick={() => {
            this.toggle("2");
          }}
        >
          Listado Expedientes
        </NavLink>
      </NavItem>
    );

    let tabPane2 = (
      <TabPane tabId="2">
        <Col md={{ size: 4 }} xs={12}>
          <FormGroup>
            <Label for="exampleSelect1">Estado</Label>
            <Input type="select" name="fecha" id="fecha">
              <option value="Pendientes">Pendientes</option>
              <option value="Pasados">Pasados</option>
            </Input>
          </FormGroup>
        </Col>
        <CustomTable
          header={expediente_h_oficina}
          body={this.getExpedientesPendientes(
            this.state.text_oficina,
            expediente_b
          )}
        />
      </TabPane>
    );

    if (oficina === "0") {
      navItem1 = (
        <NavItem>
          <NavLink
            className={classnames({
              active: this.state.activeTab === "1"
            })}
            onClick={() => {
              this.toggle("1");
            }}
          >
            Crear Expedientes
          </NavLink>
        </NavItem>
      );

      tabPane1 = (
        <TabPane tabId="1">
          <Form>
            <Row form>
              <Col md={4}>
                <FormGroup>
                  <Label for="exampleSelect1">Iniciador</Label>
                  <Input type="text" name="fecha" id="fecha" />
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label for="exampleSelect1">Destinatario</Label>
                  <Input type="text" name="fecha" id="fecha" />
                </FormGroup>
              </Col>
              <Col md={2}>
                <FormGroup>
                  <Label for="exampleSelect1">Hojas</Label>
                  <Input type="text" name="fecha" id="fecha" />
                </FormGroup>
              </Col>
              <Col md={8}>
                <FormGroup>
                  <Label for="exampleSelect1">Concepto</Label>
                  <Input type="textarea" name="fecha" id="fecha" />
                </FormGroup>
              </Col>
              <Col md={6}>
                <Button className="myBoton" color="primary" size="md">
                  Crear Expediente
                </Button>
              </Col>
            </Row>
          </Form>
        </TabPane>
      );
    }

    return (
      <div>
        <Nav tabs>
          {navItem1}
          {navItem2}
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          {tabPane1}
          {tabPane2}
        </TabContent>
      </div>
    );
  };
  render() {
    return (
      <div className="content">
        <Row>
          <Col md={{ size: 6, offset: 0 }} xs={12}>
            <Card>
              <Col md={{ size: 4 }} xs={12}>
                <CardBody>
                  <FormGroup>
                    <Label for="exampleSelect1">Oficina</Label>
                    <Input
                      type="select"
                      name="select_oficina"
                      id="select_oficina"
                      defaultValue={this.state.oficina}
                      onChange={this.updateOficina}
                    >
                      <option value="0">G.A.D.I</option>
                      <option value="1">Oficina 1</option>
                      <option value="2">Oficina 2</option>
                    </Input>
                  </FormGroup>
                </CardBody>
              </Col>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle tag="h4">{this.state.text_oficina}</CardTitle>
              </CardHeader>
              <CardBody>{this.renderTabs(this.state.oficina)}</CardBody>
            </Card>
          </Col>

          <Col md={{ size: 6, offset: 0 }} xs={12}>
            <Card>
              <CardHeader>
                <CardTitle tag="h4">
                  Busqueda de Expedientes (General)
                </CardTitle>
              </CardHeader>
              <CardBody>
                <Form>
                  <Row form>
                    <Col md={4}>
                      <FormGroup>
                        <Input
                          type="text"
                          placeholder="Nro Expediente"
                          name="cobrar"
                          id="cobrarLabel"
                        />
                      </FormGroup>
                    </Col>
                    <Col md={2}>
                      <Button
                        className="myBotonExp"
                        color="primary"
                        size="md"
                        onClick={() => this.cobrar()}
                      >
                        Buscar
                      </Button>
                    </Col>
                  </Row>
                </Form>
                <CustomTable
                  header={expediente_h_busqueda}
                  body={expediente_b}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Expedientes;
