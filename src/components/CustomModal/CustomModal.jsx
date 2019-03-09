import React from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Col,
  Input,
  Row,
  Form
} from "reactstrap";
import MyAutossugestExp from "../../components/MyAutossugest/MyAutosuggestExp.jsx";

class CustomModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      destino: "",
      cant_hojas: 0
    };
  }

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

  toggle = () => {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  };

  componentDidUpdate(prevProps) {
    if (this.props.showModal !== prevProps.showModal) {
      this.toggle();
    }
  }

  render() {
    let finalizar_button = "";

    if (this.props.oficina === "0") {
      finalizar_button = (
        <FormGroup>
          <Button
            className="modal-button"
            size="sm"
            color="danger"
            onClick={() => {
              this.props.finalizarExp("G.A.D.I", this.state.cant_hojas);
              this.toggle();
            }}
          >
            Finalizar
          </Button>
        </FormGroup>
      );
    }

    return (
      <Modal isOpen={this.state.modal} toggle={this.toggle} size="md">
        <ModalHeader toggle={this.toggle}>Realizar Pase</ModalHeader>
        <ModalBody>
          <Form>
            <Row form>
              <Col md={5} xs={12}>
                <FormGroup>
                  <Label className="label-modal" for="exampleSelect1">
                    Destinatario
                  </Label>
                  <MyAutossugestExp
                    data={this.props.oficinas}
                    placeholder={"Buscar Oficina"}
                    callback={x => this.updateDestino(x)}
                  />
                </FormGroup>
              </Col>
              <Col md={2} xs={12}>
                <FormGroup>
                  <Label className="label-modal" for="exampleSelect2">
                    Cant. Hojas
                  </Label>
                  <Col md={12} style={{ paddingLeft: 0 }}>
                    <Input
                      type="text"
                      name="cant_hojas"
                      id="cant_hojas"
                      onChange={this.updateCantHojas}
                    />
                  </Col>
                </FormGroup>
              </Col>
              <Col md={2} xs={6} style={{ paddingTop: "5px" }}>
                <FormGroup>
                  <Button
                    className="modal-button"
                    size="sm"
                    color="info"
                    onClick={() => {
                      this.props.hacerPase(
                        this.state.destino,
                        this.state.cant_hojas
                      );
                      this.toggle();
                    }}
                  >
                    Pasar
                  </Button>
                </FormGroup>
              </Col>
              <Col md={3} xs={6} style={{ paddingTop: "5px" }}>
                {finalizar_button}
              </Col>
            </Row>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={this.toggle}>
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default CustomModal;
