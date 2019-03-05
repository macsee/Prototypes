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
    busqueda: "",
    text_oficina: "G.A.D.I",
    estado: "pendientes",
    result_exp: { pases: [] }
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

  updateBusqueda = evt => {
    this.setState({
      ...this.state,
      busqueda: evt.target.value
    });
  };

  updateEstado = evt => {
    this.setState({
      ...this.state,
      estado: evt.target.value
    });
  };

  getExpedientes = (oficina, tabla, condicion) => {
    let row;

    if (condicion === "pendientes") {
      row = tabla.filter(value => {
        return (
          value.pases[value.pases.length - 1].destino === oficina &&
          value.estado !== "Finalizado"
        );
      });
    } else {
      row = tabla.filter(value => {
        if (
          (value.pases[value.pases.length - 1].destino === oficina &&
            value.estado === "Finalizado") ||
          value.pases[value.pases.length - 1].destino !== oficina
        ) {
          return value.pases.some(function(o) {
            return o.destino === oficina;
          });
        } else return false;
      });
    }

    return row.map(value => {
      var o = Object.assign({}, value);
      let last_index = 0;
      for (let i = 0; i < value.pases.length; i++)
        if (value.pases[i].destino === oficina) last_index = i;
      let pases = value.pases.slice(0, last_index + 2);
      console.log(pases);
      o.pase =
        pases[pases.length - 2].destino +
        " \u2192 " +
        pases[pases.length - 1].destino;
      o.fecha_pase = pases[pases.length - 1].fecha_pase;

      return o;
    });
  };

  busquedaExpedientes = (exp, tabla) => {
    let row = tabla.filter(value => {
      return value.id === exp;
    });

    return row;
  };

  buscar_exp = tabla => {
    let result = this.busquedaExpedientes(this.state.busqueda, tabla);

    if (result.length !== 0)
      this.setState({
        ...this.state,
        result_exp: result[0]
      });
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
          Exptes. en Oficina
        </NavLink>
      </NavItem>
    );

    let tabPane2 = (
      <TabPane tabId="2">
        <Col md={{ size: 4 }} xs={12}>
          <FormGroup>
            <Label for="exampleSelect1">Estado</Label>
            <Input
              type="select"
              name="fecha"
              id="fecha"
              defaultValue={this.state.estado}
              onChange={this.updateEstado}
            >
              <option value="pendientes">Pendientes</option>
              <option value="procesados">Procesados</option>
            </Input>
          </FormGroup>
        </Col>
        <CustomTable
          header={expediente_h_oficina}
          body={this.getExpedientes(
            this.state.text_oficina,
            expediente_b,
            this.state.estado
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
        <Col md={{ size: 12, offset: 0 }} xs={12}>
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
          <Card>
            <CardHeader>
              <CardTitle tag="h4">Búsqueda de Expedientes (General)</CardTitle>
            </CardHeader>
            <CardBody>
              <Form>
                <Row form>
                  <Col md={4}>
                    <FormGroup>
                      <Input
                        type="text"
                        placeholder="Nro Expediente"
                        name="busqueda"
                        id="busqueda"
                        onChange={this.updateBusqueda}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={2}>
                    <Button
                      className="myBotonExp"
                      color="primary"
                      size="md"
                      onClick={() => this.buscar_exp(expediente_b)}
                    >
                      Buscar
                    </Button>
                  </Col>
                </Row>
              </Form>
              <Row>
                <Col md={3} className="saldos">
                  Fecha Inicio:{" "}
                </Col>
                <Col md={3}>
                  {this.state.result_exp.pases.length === 0
                    ? ""
                    : this.state.result_exp.fecha_inicio}
                </Col>
                <Col md={3} className="saldos">
                  Iniciador:
                </Col>
                <Col md={3}>
                  {this.state.result_exp.pases.length === 0
                    ? ""
                    : this.state.result_exp.iniciador}
                </Col>
                <Col md={3} className="saldos">
                  Concepto:
                </Col>
                <Col md={9}>
                  {this.state.result_exp.pases.length === 0
                    ? ""
                    : this.state.result_exp.concepto}
                </Col>
                <Col md={3} className="saldos">
                  Estado:
                </Col>
                <Col md={3}>
                  {this.state.result_exp.pases.length === 0
                    ? ""
                    : this.state.result_exp.estado}
                </Col>
              </Row>
              <CustomTable
                header={expediente_h_busqueda}
                body={this.state.result_exp.pases}
              />
            </CardBody>
          </Card>
        </Col>
      </div>
    );
  }
}

export default Expedientes;
