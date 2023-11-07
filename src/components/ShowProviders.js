import React, { Component } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

const url = "https://farmacia-6933.onrender.com/api/proveedor/";

class App extends Component {
  state = {
    providers: [],
    modalInsertar: false,
    modalEliminar: false,
    form: {
      id_proveedor: '',
      proveedor: '',
      nit: '',
      telefono: '',
      direccion: '',
      tipoModal: ''
    }
  }

  peticionGet = () => {
    axios.get(url).then(response => {
      this.setState({ providers: response.data });
    }).catch(error => {
      console.log(error.message);
    })
  }

  peticionPost = async () => {
    delete this.state.form.id_proveedor;
    await axios.post(url, this.state.form).then(response => {
      this.modalInsertar();
      this.peticionGet();
      Swal.fire('Éxito', 'Proveedor creado exitosamente', 'success');
    }).catch(error => {
      console.log(error.message);
      Swal.fire('Error', 'Error al crear el proveedor', 'error');
    })
  }

  peticionPut = () => {
    axios.put(url + this.state.form.id_proveedor, this.state.form).then(response => {
      this.modalInsertar();
      this.peticionGet();
      Swal.fire('Éxito', 'Proveedor actualizado exitosamente', 'success');
    }).catch(error => {
      Swal.fire('Error', 'Error al actualizar el proveedor', 'error');
      console.log(error.message);
    })
  }

  peticionDelete = () => {
    axios.delete(url + this.state.form.id_proveedor).then(response => {
      this.setState({ modalEliminar: false });
      this.peticionGet();
      Swal.fire('Éxito', 'Proveedor eliminado exitosamente', 'success');
    }).catch(error => {
      Swal.fire('Error', 'Error al eliminar el proveedor', 'error');
      console.log(error.message);
    })
  }

  modalInsertar = () => {
    this.setState({ modalInsertar: !this.state.modalInsertar });
  }

  seleccionarProveedor = (proveedor) => {
    this.setState({
      tipoModal: 'actualizar',
      form: {
        id_proveedor: proveedor.id_proveedor,
        proveedor: proveedor.proveedor,
        nit: proveedor.nit,
        telefono: proveedor.telefono,
        direccion: proveedor.direccion
      }
    })
  }

  handleChange = async (e) => {
    e.persist();
    await this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value
      }
    });
    console.log(this.state.form);
  }

  componentDidMount() {
    this.peticionGet();
  }

  render() {
    const { form } = this.state;
    return (
      <div className="App">
        <br /><br /><br />
        <button className="btn btn-success" onClick={() => { this.setState({ form: null, tipoModal: 'insertar' }); this.modalInsertar() }}>Agregar Proveedor</button>
        <br /><br />
        <table className="table ">
          <thead>
            <tr>
              <th>ID</th>
              <th>Proveedor</th>
              <th>NIT</th>
              <th>Teléfono</th>
              <th>Dirección</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {this.state.providers.map(proveedor => {
              return (
                <tr key={proveedor.id_proveedor}>
                  <td>{proveedor.id_proveedor}</td>
                  <td>{proveedor.proveedor}</td>
                  <td>{proveedor.nit}</td>
                  <td>{proveedor.telefono}</td>
                  <td>{proveedor.direccion}</td>
                  <td>
                    <button className="btn btn-primary" onClick={() => { this.seleccionarProveedor(proveedor); this.modalInsertar() }}>Editar</button>
                    {"   "}
                    <button className="btn btn-danger" onClick={() => { this.seleccionarProveedor(proveedor); this.setState({ modalEliminar: true }) }}>Eliminar</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        <div className="modal-dialog">
          <Modal isOpen={this.state.modalInsertar} toggle={() => this.modalInsertar()}>
            <ModalHeader toggle={() => this.modalInsertar()}>{this.state.tipoModal === 'insertar' ? 'Insertar Proveedor' : 'Editar Proveedor'}</ModalHeader>
            <ModalBody>
              <div className="form-group">
                <label htmlFor="id_proveedor">ID</label>
                <input className="form-control" type="text" name="id_proveedor" id="id_proveedor" readOnly onChange={this.handleChange} value={form ? form.id_proveedor : this.state.providers.length + 1} />
                <br />
                <label htmlFor="proveedor">Proveedor</label>
                <input className="form-control" type="text" name="proveedor" id="proveedor" onChange={this.handleChange} value={form ? form.proveedor : ''} />
                <br />
                <label htmlFor="nit">NIT</label>
                <input className="form-control" type="text" name="nit" id="nit" onChange={this.handleChange} value={form ? form.nit : ''} />
                <br />
                <label htmlFor="telefono">Teléfono</label>
                <input className="form-control" type="text" name="telefono" id="telefono" onChange={this.handleChange} value={form ? form.telefono : ''} />
                <br />
                <label htmlFor="direccion">Dirección</label>
                <input className="form-control" type="text" name="direccion" id="direccion" onChange={this.handleChange} value={form ? form.direccion : ''} />
              </div>
            </ModalBody>
            <ModalFooter>
              {this.state.tipoModal === 'insertar' ?
                <button className="btn btn-success" onClick={() => this.peticionPost()}>Insertar</button> :
                <button className="btn btn-primary" onClick={() => this.peticionPut()}>Actualizar</button>
              }
              <button className="btn btn-danger" onClick={() => this.modalInsertar()}>Cancelar</button>
            </ModalFooter>
          </Modal>
        </div>

        <div className="modal-dialog">
          <Modal isOpen={this.state.modalEliminar} toggle={() => this.modalInsertar()}>
            <ModalHeader>Eliminar Proveedor</ModalHeader>
            <ModalBody>
              Estás seguro que deseas eliminar al proveedor {form && form.proveedor}
            </ModalBody>
            <ModalFooter>
              <button className="btn btn-danger" onClick={() => this.peticionDelete()}>Sí</button>
              <button className="btn btn-secondary" onClick={() => this.setState({ modalEliminar: false })}>No</button>
            </ModalFooter>
          </Modal>
        </div>
      </div>
    );
  }
}

export default App;