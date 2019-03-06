import React, { Component } from "react";

import MyAutossugestExp from "../../components/MyAutossugest/MyAutosuggestExp.jsx";
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

import CustomModal from "../../components/CustomModal/CustomModal.jsx";
import {
  expediente_h_oficina,
  expediente_h_busqueda,
  expediente_b,
  oficinas
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
    cant_hojas: 0,
    destino: "",
    iniciador: "",
    concepto: "",
    oficinas: oficinas,
    exp_count: 5,
    data_exp: expediente_b,
    result_exp: { pases: [] },
    showModal: false,
    select_expediente_id: null
  };

  changeRecibido = expediente_id => {
    let data = this.state.data_exp;
    for (let i = 0; i < data.length; i++) {
      if (data[i].id === expediente_id) {
        data[i].recibido = !data[i].recibido;
      }
    }
    this.setState({
      ...this.state,
      data_exp: data
    });
  };

  mostrarModal = expediente_id => {
    this.setState({
      ...this.state,
      showModal: !this.state.showModal,
      select_expediente_id: expediente_id
    });
  };

  changeStateFromTable = cell => {
    let expediente_id = cell.getRow().getData().id;
    if (this.state.estado === "pendientes") {
      if (cell.getField() === "recibido") {
        this.changeRecibido(expediente_id);
      } else {
        if (cell.getRow().getData().recibido) this.mostrarModal(expediente_id);
        else alert("No recibiste el expediente!");
      }
    }
  };

  hacerPase = (destino, new_cant_hojas) => {
    let data = this.state.data_exp;
    for (let i = 0; i < data.length; i++) {
      if (data[i].id === this.state.select_expediente_id) {
        data[i].pases.push({
          fecha_pase: new Date().toLocaleDateString(),
          destino: destino,
          cant_hojas:
            data[i].pases[data[i].pases.length - 1].cant_hojas +
            parseInt(new_cant_hojas)
        });
        data[i].recibido = false;
      }
    }
    console.log(data);
    this.setState({
      ...this.state,
      data_exp: data,
      select_expediente_id: null
    });
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

  updateIniciador = evt => {
    this.setState({
      ...this.state,
      iniciador: evt.target.value
    });
  };

  updateDestino = evt => {
    this.setState({
      ...this.state,
      destino: evt
    });
  };

  updateCantHojas = evt => {
    this.setState({
      ...this.state,
      cant_hojas: evt.target.value
    });
  };

  updateConcepto = evt => {
    this.setState({
      ...this.state,
      concepto: evt.target.value
    });
  };

  saveExpedientes = evt => {
    const exp = this.state.data_exp;
    const exp_count = this.state.exp_count;

    let expte = {
      id:
        exp_count > 10
          ? "0000" + parseInt(exp_count + 1)
          : "00000" + parseInt(exp_count + 1),
      iniciador: this.state.iniciador,
      concepto: this.state.concepto,
      fecha_inicio: new Date().toLocaleDateString(),
      pases: [
        {
          fecha_pase: new Date().toLocaleDateString(),
          destino: "G.A.D.I",
          cant_hojas: this.state.cant_hojas
        },
        {
          fecha_pase: new Date().toLocaleDateString(),
          destino: this.state.destino,
          cant_hojas: this.state.cant_hojas
        }
      ],
      estado: "En Curso",
      recibido: false
    };

    this.setState({
      ...this.state,
      exp_count: exp_count + 1,
      data_exp: exp.concat([expte]),
      cant_hojas: 0,
      destino: "",
      iniciador: "",
      concepto: ""
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
            this.state.data_exp,
            this.state.estado
          )}
          callback={this.accion}
          changeStateFromTable={this.changeStateFromTable}
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
                  <Input
                    type="text"
                    name="iniciador"
                    id="iniciador"
                    value={this.state.iniciador}
                    onChange={this.updateIniciador}
                  />
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label for="exampleSelect1">Destino</Label>
                  <MyAutossugestExp
                    data={this.state.oficinas}
                    placeholder={"Buscar Oficina"}
                    callback={x => this.updateDestino(x)}
                  />
                </FormGroup>
              </Col>
              <Col md={2}>
                <FormGroup>
                  <Label for="exampleSelect1">Hojas</Label>
                  <Input
                    type="text"
                    name="hojas"
                    id="hojas"
                    value={this.state.cant_hojas}
                    onChange={this.updateCantHojas}
                  />
                </FormGroup>
              </Col>
              <Col md={8}>
                <FormGroup>
                  <Label for="exampleSelect1">Concepto</Label>
                  <Input
                    type="textarea"
                    name="concepto"
                    id="concepto"
                    value={this.state.concepto}
                    onChange={this.updateConcepto}
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <Button
                  className="myBoton"
                  color="primary"
                  size="md"
                  onClick={this.saveExpedientes}
                >
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
        <CustomModal
          showModal={this.state.showModal}
          oficinas={this.state.oficinas.filter(
            o => o.nombre !== this.state.text_oficina
          )}
          expediente_id={this.state.select_expediente_id}
          hacerPase={this.hacerPase}
        />
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
                      onClick={() => this.buscar_exp(this.state.data_exp)}
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
                  <span
                    className={
                      this.state.result_exp.pases.length !== 0 &&
                      this.state.result_exp.estado === "Finalizado"
                        ? "badge badge-success"
                        : "badge badge-danger"
                    }
                  >
                    {this.state.result_exp.pases.length === 0
                      ? ""
                      : this.state.result_exp.estado}
                  </span>
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
