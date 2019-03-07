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
    console.log(evt);
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
    return (
      <Modal isOpen={this.state.modal} toggle={this.toggle}>
        <ModalHeader toggle={this.toggle}>Realizar Pase</ModalHeader>
        <ModalBody>
          <Form>
            <Row form>
              <Col md={5}>
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
              <Col md={4}>
                <FormGroup>
                  <Label className="label-modal" for="exampleSelect2">
                    Cant. Hojas Agregadas
                  </Label>
                  <Input
                    type="text"
                    name="cant_hojas"
                    id="cant_hojas"
                    onChange={this.updateCantHojas}
                  />
                </FormGroup>
              </Col>
              <Col md={2}>
                <FormGroup>
                  <Button
                    className="modal-button"
                    color="primary"
                    onClick={() => {
                      this.props.hacerPase(
                        this.state.destino,
                        this.state.cant_hojas
                      );
                      this.toggle();
                    }}
                  >
                    Pase
                  </Button>
                </FormGroup>
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
