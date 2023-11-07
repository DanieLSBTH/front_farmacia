import React, { Component } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

const url = "https://farmacia-6933.onrender.com/api/cliente/";

class ShowClients extends Component {
  state = {
    clients: [],
    modalInsertar: false,
    form: {
      id_cliente: '',
      nombre: '',
      apellido: '',
      telefono: '',
      nit: '',
      fecha_registro: '',
      fecha_salida: '',
      tipoModal: 'insertar',
    }
  }

  peticionGet = () => {
    axios.get(url).then(response => {
      this.setState({ clients: response.data });
    }).catch(error => {
      console.log(error.message);
    })
  }

  peticionPost = async () => {
    delete this.state.form.id_cliente;
    await axios.post(url, this.state.form).then(response => {
      this.modalInsertar();
      this.peticionGet();
      Swal.fire('Éxito', 'Cliente creado exitosamente', 'success');
    }).catch(error => {
      console.log(error.message);
      Swal.fire('Error', 'Error al crear el cliente', 'error');
    })
  }

  peticionPut = () => {
    axios.put(url + this.state.form.id_cliente, this.state.form).then(response => {
      this.modalInsertar();
      this.peticionGet();
      Swal.fire('Éxito', 'Cliente actualizado exitosamente', 'success');
    }).catch(error => {
      Swal.fire('Error', 'Error al actualizar el cliente', 'error');
      console.log(error.message);
    })
  }

  peticionDelete = () => {
    axios.delete(url + this.state.form.id_cliente).then(response => {
      this.setState({ modalInsertar: false });
      this.peticionGet();
      Swal.fire('Éxito', 'Cliente eliminado exitosamente', 'success');
    }).catch(error => {
      Swal.fire('Error', 'Error al eliminar el cliente', 'error');
      console.log(error.message);
    })
  }

  modalInsertar = () => {
    this.setState({ modalInsertar: !this.state.modalInsertar });
  }

  seleccionarCliente = (cliente) => {
    this.setState({
      tipoModal: 'actualizar',
      form: {
        id_cliente: cliente.id_cliente,
        nombre: cliente.nombre,
        apellido: cliente.apellido,
        telefono: cliente.telefono,
        nit: cliente.nit,
        fecha_registro: cliente.fecha_registro,
        fecha_salida: cliente.fecha_salida
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
        <button className="btn btn-success" onClick={() => { this.setState({ form: null, tipoModal: 'insertar' }); this.modalInsertar() }}>Agregar Cliente</button>
        <br /><br />
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Teléfono</th>
              <th>NIT</th>
              <th>Fecha de Registro</th>
              <th>Fecha de Salida</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {this.state.clients.map(cliente => {
              return (
                <tr key={cliente.id_cliente}>
                  <td>{cliente.id_cliente}</td>
                  <td>{cliente.nombre}</td>
                  <td>{cliente.apellido}</td>
                  <td>{cliente.telefono}</td>
                  <td>{cliente.nit}</td>
                  <td>{cliente.fecha_registro}</td>
                  <td>{cliente.fecha_salida}</td>
                  <td>
                    <button className="btn btn-primary" onClick={() => { this.seleccionarCliente(cliente); this.modalInsertar() }}>Editar</button>
                    {"   "}
                    <button className="btn btn-danger" onClick={() => { this.seleccionarCliente(cliente); this.setState({ modalEliminar: true }) }}>Eliminar</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        <div className="modal-dialog">
          <Modal isOpen={this.state.modalInsertar} toggle={() => this.modalInsertar()}>
            <ModalHeader toggle={() => this.modalInsertar()}>{this.state.tipoModal === 'insertar' ? 'Insertar Cliente' : 'Editar Cliente'}</ModalHeader>
            <ModalBody>
              <div className="form-group">
                <label htmlFor="id_cliente">ID</label>
                <input className="form-control" type="text" name="id_cliente" id="id_cliente" readOnly onChange={this.handleChange} value={form ? form.id_cliente : this.state.clients.length + 1} />
                <br />
                <label htmlFor="nombre">Nombre</label>
                <input className="form-control" type="text" name="nombre" id="nombre" onChange={this.handleChange} value={form ? form.nombre : ''} />
                <br />
                <label htmlFor="apellido">Apellido</label>
                <input className="form-control" type="text" name="apellido" id="apellido" onChange={this.handleChange} value={form ? form.apellido : ''} />
                <br />
                <label htmlFor="telefono">Teléfono</label>
                <input className="form-control" type="text" name="telefono" id="telefono" onChange={this.handleChange} value={form ? form.telefono : ''} />
                <br />
                <label htmlFor="nit">NIT</label>
                <input className="form-control" type="text" name="nit" id="nit" onChange={this.handleChange} value={form ? form.nit : ''} />
                <br />
                <label htmlFor="fecha_registro">Fecha de Registro</label>
                <input className="form-control" type="text" name="fecha_registro" id="fecha_registro" onChange={this.handleChange} value={form ? form.fecha_registro : ''} />
                <br />
                <label htmlFor="fecha_salida">Fecha de Salida</label>
                <input className="form-control" type="text" name="fecha_salida" id="fecha_salida" onChange={this.handleChange} value={form ? form.fecha_salida : ''} />
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
            <ModalHeader>Eliminar Cliente</ModalHeader>
            <ModalBody>
              Estás seguro que deseas eliminar al cliente {form && form.nombre}
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

export default ShowClients;
