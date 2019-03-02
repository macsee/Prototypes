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
  expediente_h_busqueda
} from "variables/expedientes.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import CustomTable from "components/CustomTable/CustomTable.jsx";

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
      text_oficina: document.getElementById("select_oficina").options[
        evt.target.value
      ].text
    });
  };

  renderNavTabs = oficina => {
    let navItem = "";
    let tabPane = "";

    if (oficina === "0") {
      navItem = (
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

      tabPane = (
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
                <Button
                  className="myBoton"
                  color="primary"
                  size="md"
                  onClick={() => this.facturar()}
                >
                  Crear Expediente
                </Button>
              </Col>
            </Row>
          </Form>
        </TabPane>
      );
    }

    navItem =
      navItem +
      (
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

    tabPane =
      tabPane +
      (
        <TabPane tabId="2">
          <CustomTable
            header={expediente_h_oficina}
            body={[]}
            tipo={"cuenta_corriente"}
          />
        </TabPane>
      );

    return (
      <div>
        <Nav tabs>{navItem}</Nav>
        <TabContent activeTab={this.state.activeTab}>{tabPane}</TabContent>
      </div>
    );
  };

  render() {
    return (
      <div className="content">
        <Row>
          <Col md={{ size: 10, offset: 1 }} xs={12}>
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
              <CardBody>
                {this.renderNavTabs(this.state.text_oficina)}
                {/* <Form>
                  <Row form>
                    <Col md={6}>
                      <FormGroup>
                        <MyAutossugest
                          data={tbody}
                          callback={x => this.setData(x)}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </Form> */}
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
                      Crear Expedientes
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
                      Listado Expedientes
                    </NavLink>
                  </NavItem>
                </Nav>
                <TabContent activeTab={this.state.activeTab}>
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
                          <Button
                            className="myBoton"
                            color="primary"
                            size="md"
                            onClick={() => this.facturar()}
                          >
                            Crear Expediente
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                  </TabPane>
                  <TabPane tabId="2">
                    <CustomTable
                      header={expediente_h_oficina}
                      body={[]}
                      tipo={"cuenta_corriente"}
                    />
                  </TabPane>
                </TabContent>
              </CardBody>
            </Card>
          </Col>

          <Col md={{ size: 10, offset: 1 }} xs={12}>
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
                  body={[]}
                  tipo={"cuenta_corriente"}
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
