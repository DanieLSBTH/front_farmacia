import React, { Component } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { show_alerta } from '../functions';

const url = 'https://farmacia-6933.onrender.com/api/facturas/';
const clientesUrl = 'https://farmacia-6933.onrender.com/api/cliente/';
const empleadosUrl = 'https://farmacia-6933.onrender.com/api/empleado/';

class ShowInvoices extends Component {
  state = {
    providers: [],
    clientes: [],
    empleados: [],
    modalInsertar: false,
    modalEliminar: false,
    form: {
      id_factura: '',
      fecha: '',
      no_factura: '',
      id_cliente: '',
      id_empleado: '',
      tipoModal: ''
    }
  }

  peticionGet = () => {
    axios.get(url).then(response => {
      this.setState({ providers: response.data });
    }).catch(error => {
      console.log(error.message);
    });

    axios.get(clientesUrl).then(response => {
      this.setState({ clientes: response.data });
    }).catch(error => {
      console.log(error.message);
    });

    axios.get(empleadosUrl).then(response => {
      this.setState({ empleados: response.data });
    }).catch(error => {
      console.log(error.message);
    });
  }

  peticionPost = async () => {
    delete this.state.form.id_factura;
    await axios.post(url, this.state.form).then(response => {
      this.modalInsertar();
      this.peticionGet();
      Swal.fire('Éxito', 'Factura creada exitosamente', 'success');
    }).catch(error => {
      console.log(error.message);
      Swal.fire('Error', 'Error al crear la factura', 'error');
    })
  }

  peticionPut = () => {
    axios.put(url + this.state.form.id_factura, this.state.form).then(response => {
      this.modalInsertar();
      this.peticionGet();
      Swal.fire('Éxito', 'Factura actualizada exitosamente', 'success');
    }).catch(error => {
      Swal.fire('Error', 'Error al actualizar la factura', 'error');
      console.log(error.message);
    })
  }

  peticionDelete = () => {
    axios.delete(url + this.state.form.id_factura).then(response => {
      this.setState({ modalEliminar: false });
      this.peticionGet();
      Swal.fire('Éxito', 'Factura eliminada exitosamente', 'success');
    }).catch(error => {
      Swal.fire('Error', 'Error al eliminar la factura', 'error');
      console.log(error.message);
    })
  }

  modalInsertar = () => {
    this.setState({ modalInsertar: !this.state.modalInsertar });
  }

  seleccionarFactura = (factura) => {
    this.setState({
      tipoModal: 'actualizar',
      form: {
        id_factura: factura.id_factura,
        fecha: factura.fecha,
        no_factura: factura.no_factura,
        id_cliente: factura.id_cliente,
        id_empleado: factura.id_empleado
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
    const { form, clientes, empleados } = this.state;
    return (
      <div className="App">
        <br /><br /><br />
        <button className="btn btn-success" onClick={() => { this.setState({ form: null, tipoModal: 'insertar' }); this.modalInsertar() }}>Agregar Factura</button>
        <br /><br />
        <table className="table ">
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>No. Factura</th>
              <th>ID Cliente</th>
              <th>ID Empleado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {this.state.providers.map(factura => {
              return (
                <tr key={factura.id_factura}>
                  <td>{factura.id_factura}</td>
                  <td>{factura.fecha}</td>
                  <td>{factura.no_factura}</td>
                  <td>{factura.id_cliente}</td>
                  <td>{factura.id_empleado}</td>
                  <td>
                    <button className="btn btn-primary" onClick={() => { this.seleccionarFactura(factura); this.modalInsertar() }}>Editar</button>
                    {"   "}
                    <button className="btn btn-danger" onClick={() => { this.seleccionarFactura(factura); this.setState({ modalEliminar: true }) }}>Eliminar</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        <div className="modal-dialog">
          <Modal isOpen={this.state.modalInsertar} toggle={() => this.modalInsertar()}>
            <ModalHeader toggle={() => this.modalInsertar()}>{this.state.tipoModal === 'insertar' ? 'Insertar Factura' : 'Editar Factura'}</ModalHeader>
            <ModalBody>
              <div className="form-group">
                <label htmlFor="id_factura">ID</label>
                <input className="form-control" type="text" name="id_factura" id="id_factura" readOnly onChange={this.handleChange} value={form ? form.id_factura : this.state.providers.length + 1} />
                <br />
                <label htmlFor="fecha">Fecha</label>
                <input className="form-control" type="text" name="fecha" id="fecha" onChange={this.handleChange} value={form ? form.fecha : ''} />
                <br />
                <label htmlFor="no_factura">No. Factura</label>
                <input className="form-control" type="text" name="no_factura" id="no_factura" onChange={this.handleChange} value={form ? form.no_factura : ''} />
                <br />
                <div className="form-group">
                  <label htmlFor="id_cliente">ID Cliente</label>
                  <select
                    className="form-control"
                    name="id_cliente"
                    id="id_cliente"
                    onChange={this.handleChange}
                    value={form ? form.id_cliente : ''}
                  >
                    <option value="">Seleccione un cliente</option>
                    {clientes.map((cliente) => (
                      <option key={cliente.id_cliente} value={cliente.id_cliente}>
                        {cliente.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <br />
                <div className="form-group">
                  <label htmlFor="id_empleado">ID Empleado</label>
                  <select
                    className="form-control"
                    name="id_empleado"
                    id="id_empleado"
                    onChange={this.handleChange}
                    value={form ? form.id_empleado : ''}
                  >
                    <option value="">Seleccione un empleado</option>
                    {empleados.map((empleado) => (
                      <option key={empleado.id_empleado} value={empleado.id_empleado}>
                        {empleado.nombre}
                      </option>
                    ))}
                  </select>
                </div>
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
            <ModalHeader>Eliminar Factura</ModalHeader>
            <ModalBody>
              ¿Estás seguro de que deseas eliminar la factura {form && form.no_factura}?
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

export default ShowInvoices;
