import React from "react";

class NavTabsExpedientes extends Component {
  state = {
    activeTab: "1"
  };

  toggle = tab => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  };

  render() {
    return (
      <React.Fragment>
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
                  <Button className="myBoton" color="primary" size="md">
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
      </React.Fragment>
    );
  }
}

export default NavTabsExpedientes;
