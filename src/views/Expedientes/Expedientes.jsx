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
  NavLink,
  ListGroupItem,
  ListGroup
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
    motivo: "Equivalencias",
    oficinas: oficinas,
    exp_count: 5,
    data_exp: [],
    result_exp: { pases: [] },
    results_exp: [],
    result_exp_selector: [],
    showModal: false,
    select_expediente_id: null,
    tipoBusqueda: "Nro. Expediente",
    fechaDesde: null,
    fechaHasta: null
  };

  componentDidMount() {
    const getData = () => {
      fetch("/expedientes", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        method: "GET"
      })
        .then(res => res.json())
        .then(
          result => {
            this.setState({ ...this.state, data_exp: result.expedientes });
          },
          error => {
            console.log(error);
          }
        );
    };
    getData();
    // this._interval = window.setInterval(getData, 1000);
  }

  makeRequest = (method, elemente, fc) => {
    fetch("/expedientes", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: method,
      body: JSON.stringify(elemente)
    })
      .then(res => res.json())
      .then(fc, error => {
        console.log(error);
      });
  };

  changeRecibido = expediente_id => {
    let data = this.state.data_exp;
    let expediente;
    let index;
    for (let i = 0; i < data.length; i++) {
      if (data[i].id === expediente_id) {
        data[i].recibido = !data[i].recibido;
        expediente = data[i];
        index = i;
      }
    }
    if (expediente) {
      this.makeRequest("PUT", expediente, result => {
        if (result.status === "OK") {
          data[index] = result.new_version;
          this.setState({ ...this.state, data_exp: data });
        }
      });
    }
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
    let expediente;
    let index;
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
        expediente = data[i];
        index = i;
      }
    }
    if (expediente) {
      this.makeRequest("PUT", expediente, result => {
        if (result.status === "OK") {
          data[index] = result.new_version;
          this.setState({
            ...this.state,
            data_exp: data,
            select_expediente_id: null
          });
        }
      });
    }
  };

  finalizarExp = (destino, new_cant_hojas) => {
    let data = this.state.data_exp;
    let expediente;
    let index;
    for (let i = 0; i < data.length; i++) {
      if (data[i].id === this.state.select_expediente_id) {
        data[i].pases.push({
          fecha_pase: new Date().toLocaleDateString(),
          destino: destino,
          cant_hojas:
            data[i].pases[data[i].pases.length - 1].cant_hojas +
            parseInt(new_cant_hojas)
        });
        data[i].recibido = true;
        data[i].estado = "Finalizado";
        expediente = data[i];
        index = i;
      }
    }
    if (expediente) {
      this.makeRequest("PUT", expediente, result => {
        if (result.status === "OK") {
          data[index] = result.new_version;
          this.setState({
            ...this.state,
            data_exp: data,
            select_expediente_id: null
          });
        }
      });
    }
  };

  toggle = tab => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  };

  updateOficina = evt => {
    let oficina = evt.target.value;
    fetch("/expedientes", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "GET"
    })
      .then(res => res.json())
      .then(
        result => {
          this.setState({
            ...this.state,
            data_exp: result.expedientes,
            oficina: oficina,
            activeTab: oficina === "0" ? "1" : "2",
            text_oficina: document.getElementById("select_oficina").options[
              oficina
            ].text
          });
        },
        error => {
          console.log(error);
        }
      );
  };

  updateMotivo = evt => {
    this.setState({
      ...this.state,
      motivo: evt.target.value
    });
  };

  updateTipoBusqueda = evt => {
    this.setState({
      ...this.state,
      tipoBusqueda: evt.target.value
    });
  };

  updateResultExp = index => {
    this.setState({
      ...this.state,
      result_exp: this.state.results_exp[index]
    });
  };

  updateBusqueda = evt => {
    this.setState({
      ...this.state,
      busqueda: evt.target.value
    });
  };

  updateFechaDesde = evt => {
    this.setState({
      ...this.state,
      fechaDesde: new Date(evt.target.value + " 00:00:00")
    });
  };

  updateFechaHasta = evt => {
    this.setState({
      ...this.state,
      fechaHasta: new Date(evt.target.value + " 00:00:00")
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
      motivo: this.state.motivo,
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
    this.makeRequest("POST", expte, result => {
      if (result.status === "OK") {
        this.setState({
          ...this.state,
          exp_count: exp_count + 1,
          data_exp: exp.concat([result.new_element]),
          cant_hojas: 0,
          destino: "",
          iniciador: "",
          concepto: "",
          motivo: "Equivalencias"
        });
      }
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

  busquedaExpedientes = (exp, tipoBusqueda, fechaDesde, fechaHasta, tabla) => {
    let results;

    if (tipoBusqueda === "Nro. Expediente") {
      results = tabla.filter(value => {
        return value.id === exp;
      });
    } else if (tipoBusqueda === "Motivo") {
      results = tabla.filter(value => {
        return value.motivo.includes(exp);
      });
    } else if (tipoBusqueda === "Iniciador") {
      results = tabla.filter(value => {
        return value.iniciador.includes(exp);
      });
    } else {
      results = tabla.filter(value => {
        return value.concepto.includes(exp);
      });
    }
    if (fechaDesde !== null && fechaHasta !== null) {
      results = results.filter(value => {
        let finicio = value.fecha_inicio.split("/");

        finicio = new Date(
          parseInt(finicio[2]),
          parseInt(finicio[1]) - 1,
          parseInt(finicio[0])
        );
        return finicio >= fechaDesde && finicio <= fechaHasta;
      });
    }
    return results;
  };

  buscar_exp = tabla => {
    let results = this.busquedaExpedientes(
      this.state.busqueda,
      this.state.tipoBusqueda,
      this.state.fechaDesde,
      this.state.fechaHasta,
      tabla
    );
    let result_exp_selector = [];
    let result_exp = { pases: [] };
    let results_exp = [];

    if (results.length !== 0) {
      for (let i = 0; i < results.length; i++) {
        const element = results[i];
        result_exp_selector.push(
          element.id + " | " + element.iniciador + " | " + element.motivo
        );
      }
      result_exp = results[0];
      results_exp = results;
    } else {
      result_exp_selector.push("No hay resultado");
    }
    this.setState({
      ...this.state,
      result_exp: result_exp,
      results_exp: results_exp,
      result_exp_selector: result_exp_selector
    });
  };

  showResultados = () => {
    let listResult;
    if (this.state.result_exp_selector.length === 0) return;
    if (this.state.result_exp_selector[0] !== "No hay resultado") {
      listResult = (
        <ListGroup>
          {this.state.result_exp_selector.map((text, i) => (
            <ListGroupItem key={i}>
              <Row>
                <Col md={10}>{text}</Col>
                <Col md={2}>
                  <Button
                    className="myBotonExp"
                    color="primary"
                    size="sm"
                    onClick={() => this.updateResultExp(i)}
                  >
                    Ver
                  </Button>
                </Col>
              </Row>
            </ListGroupItem>
          ))}
        </ListGroup>
      );
    } else {
      listResult = <h2>No hay Resultados!</h2>;
    }
    return listResult;
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
              <Col md={7}>
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
              <Col md={2}>
                <FormGroup>
                  <Label for="exampleSelect1">Motivo</Label>
                  <Input
                    type="select"
                    name="select_oficina"
                    id="select_oficina"
                    defaultValue={this.state.motivo}
                    onChange={this.updateMotivo}
                  >
                    <option value="Equivalencias">Equivalencias</option>
                    <option value="Horas compensatorias">
                      Horas compensatorias
                    </option>
                    <option value="Homologación Título">
                      Homologación Título
                    </option>
                  </Input>
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
          finalizarExp={this.finalizarExp}
          oficina={this.state.oficina}
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
                <Row className="row-busqueda">
                  <Col md={2}>
                    <FormGroup>
                      {/* <Label for="exampleSelect1">Buscar por</Label> */}
                      <Input
                        type="select"
                        name="select_busqueda"
                        id="select_busqueda"
                        defaultValue={this.state.tipoBusqueda}
                        onChange={this.updateTipoBusqueda}
                      >
                        <option value="Nro. Expediente">Nro. Expediente</option>
                        <option value="Motivo">Motivo</option>
                        <option value="Concepto">Concepto</option>
                        <option value="Iniciador">Iniciador</option>
                      </Input>
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Input
                        type="text"
                        placeholder="Buscar por"
                        name="busqueda"
                        id="busqueda"
                        onChange={this.updateBusqueda}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={2}>
                    <FormGroup>
                      <Input
                        type="date"
                        name="fecha_desde"
                        id="fecha_desde"
                        onChange={this.updateFechaDesde}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={2}>
                    <FormGroup>
                      <Input
                        type="date"
                        name="fecha_hasta"
                        id="fecha_hasta"
                        onChange={this.updateFechaHasta}
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
              <Row className="row-busqueda">
                <Col md={6}>
                  <FormGroup>
                    <Label for="exampleSelect1">Resultado de expedientes</Label>
                  </FormGroup>
                  {this.showResultados()}
                </Col>

                <Col md={6}>
                  <FormGroup>
                    <Label for="exampleSelect1">Detalle de expediente</Label>
                  </FormGroup>
                  <Row>
                    <Col md={4} className="saldos">
                      Nro. Expediente:{" "}
                    </Col>
                    <Col md={8}>
                      {this.state.result_exp.pases.length === 0
                        ? ""
                        : this.state.result_exp.id}
                    </Col>
                  </Row>
                  <Row>
                    <Col md={4} className="saldos">
                      Fecha Inicio:{" "}
                    </Col>
                    <Col md={8}>
                      {this.state.result_exp.pases.length === 0
                        ? ""
                        : this.state.result_exp.fecha_inicio}
                    </Col>
                  </Row>
                  <Row>
                    <Col md={4} className="saldos">
                      Iniciador:
                    </Col>
                    <Col md={8}>
                      {this.state.result_exp.pases.length === 0
                        ? ""
                        : this.state.result_exp.iniciador}
                    </Col>
                  </Row>
                  <Row>
                    <Col md={4} className="saldos">
                      Cant. Hojas:
                    </Col>
                    <Col md={8}>
                      {this.state.result_exp.pases.length === 0
                        ? ""
                        : this.state.result_exp.pases[
                            this.state.result_exp.pases.length - 1
                          ].cant_hojas}
                    </Col>
                  </Row>
                  <Row>
                    <Col md={4} className="saldos">
                      Estado:
                    </Col>
                    <Col md={8}>
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
                  <Row>
                    <Col md={4} className="saldos">
                      Motivo:
                    </Col>
                    <Col md={8}>
                      {this.state.result_exp.pases.length === 0
                        ? ""
                        : this.state.result_exp.motivo}
                    </Col>
                  </Row>
                  <Row className="row-busqueda">
                    <Col md={4} className="saldos">
                      Descripción:
                    </Col>
                    <Col md={8}>
                      {this.state.result_exp.pases.length === 0
                        ? ""
                        : this.state.result_exp.concepto}
                    </Col>
                  </Row>
                  <CustomTable
                    header={expediente_h_busqueda}
                    body={this.state.result_exp.pases}
                  />
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </div>
    );
  }
}

export default Expedientes;
