import React, { Component } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

const url = 'https://farmacia-6933.onrender.com/api/empleado/';

class ShowEmployees extends Component {
  state = {
    employees: [],
    modalInsertar: false,
    form: {
      id_empleado: '',
      nombre: '',
      apellido: '',
      direccion: '',
      puesto: '',
      fecha_inicio: '',
      salario: '',
      tipoModal: '',
    },
  };

  peticionGet = () => {
    axios
      .get(url)
      .then((response) => {
        this.setState({ employees: response.data });
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  peticionPost = async () => {
    delete this.state.form.id_empleado;
    await axios
      .post(url, this.state.form)
      .then((response) => {
        this.modalInsertar();
        this.peticionGet();
        Swal.fire('Éxito', 'Empleado registrado exitosamente', 'success');
      })
      .catch((error) => {
        console.log(error.message);
        Swal.fire('Error', 'Error al registrar el empleado', 'error');
      });
  };

  peticionPut = () => {
    axios
      .put(url + this.state.form.id_empleado, this.state.form)
      .then((response) => {
        this.modalInsertar();
        this.peticionGet();
        Swal.fire('Éxito', 'Empleado actualizado exitosamente', 'success');
      })
      .catch((error) => {
        Swal.fire('Error', 'Error al actualizar el empleado', 'error');
        console.log(error.message);
      });
  };

  peticionDelete = () => {
    axios
      .delete(url + this.state.form.id_empleado)
      .then((response) => {
        this.setState({ modalEliminar: false });
        this.peticionGet();
        Swal.fire('Éxito', 'Empleado eliminado exitosamente', 'success');
      })
      .catch((error) => {
        Swal.fire('Error', 'Error al eliminar el empleado', 'error');
        console.log(error.message);
      });
  };

  modalInsertar = () => {
    this.setState({ modalInsertar: !this.state.modalInsertar });
  };

  seleccionarEmpleado = (empleado) => {
    this.setState({
      tipoModal: 'actualizar',
      form: {
        id_empleado: empleado.id_empleado,
        nombre: empleado.nombre,
        apellido: empleado.apellido,
        direccion: empleado.direccion,
        puesto: empleado.puesto,
        fecha_inicio: empleado.fecha_inicio,
        salario: empleado.salario,
      },
    });
  };

  handleChange = async (e) => {
    e.persist();
    await this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value,
      },
    });
    console.log(this.state.form);
  };

  componentDidMount() {
    this.peticionGet();
  }

  render() {
    const { form } = this.state;
    return (
      <div className='App'>
        <br />
        <br />
        <br />
        <button
          className='btn btn-dark'
          onClick={() => {
            this.setState({ form: null, tipoModal: 'insertar' });
            this.modalInsertar();
          }}
        >
          Añadir Empleado
        </button>
        <br />
        <br />
        <table className='table '>
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Dirección</th>
              <th>Puesto</th>
              <th>Fecha de Inicio</th>
              <th>Salario</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {this.state.employees.map((empleado, id_empleado) => {
              return (
                <tr key={empleado.id_empleado}>
                  <td>{id_empleado + 1}</td>
                  <td>{empleado.nombre}</td>
                  <td>{empleado.apellido}</td>
                  <td>{empleado.direccion}</td>
                  <td>{empleado.puesto}</td>
                  <td>{empleado.fecha_inicio}</td>
                  <td>${new Intl.NumberFormat('es-mx').format(empleado.salario)}</td>
                  <td>
                    <button
                      className='btn btn-primary'
                      onClick={() => {
                        this.seleccionarEmpleado(empleado);
                        this.modalInsertar();
                      }}
                    >
                      Editar
                    </button>
                    {'   '}
                    <button className='btn btn-danger'>Eliminar</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className='modal-dialog'>
          <Modal isOpen={this.state.modalInsertar} toggle={() => this.modalInsertar()}>
            <ModalHeader toggle={() => this.modalInsertar()}>
              {this.state.tipoModal === 'insertar' ? 'Insertar Empleado' : 'Editar Empleado'}
            </ModalHeader>
            <ModalBody>
              <div className='form-group'>
                <label htmlFor='nombre'>Nombre</label>
                <input
                  className='form-control'
                  type='text'
                  name='nombre'
                  id='nombre'
                  onChange={this.handleChange}
                  value={form ? form.nombre : ''}
                />
                <br />
                <label htmlFor='apellido'>Apellido</label>
                <input
                  className='form-control'
                  type='text'
                  name='apellido'
                  id='apellido'
                  onChange={this.handleChange}
                  value={form ? form.apellido : ''}
                />
                <br />
                <label htmlFor='direccion'>Dirección</label>
                <input
                  className='form-control'
                  type='text'
                  name='direccion'
                  id='direccion'
                  onChange={this.handleChange}
                  value={form ? form.direccion : ''}
                />
                <br />
                <label htmlFor='puesto'>Puesto</label>
                <input
                  className='form-control'
                  type='text'
                  name='puesto'
                  id='puesto'
                  onChange={this.handleChange}
                  value={form ? form.puesto : ''}
                />
                <br />
                <label htmlFor='fecha_inicio'>Fecha de Inicio</label>
                <input
                  className='form-control'
                  type='text'
                  name='fecha_inicio'
                  id='fecha_inicio'
                  onChange={this.handleChange}
                  value={form ? form.fecha_inicio : ''}
                />
                <br />
                <label htmlFor='salario'>Salario</label>
                <input
                  className='form-control'
                  type='text'
                  name='salario'
                  id='salario'
                  onChange={this.handleChange}
                  value={form ? form.salario : ''}
                />
              </div>
            </ModalBody>
            <ModalFooter>
              {this.state.tipoModal === 'insertar' ? (
                <button className='btn btn-success' onClick={() => this.peticionPost()}>
                  Insertar
                </button>
              ) : (
                <button className='btn btn-primary' onClick={() => this.peticionPut()}>
                  Actualizar
                </button>
              )}
              <button className='btn btn-danger' onClick={() => this.modalInsertar()}>
                Cancelar
              </button>
            </ModalFooter>
          </Modal>
        </div>

        <div className='modal-dialog'>
          <Modal isOpen={this.state.modalEliminar} toggle={() => this.modalInsertar()}>
            <ModalHeader>Eliminar Empleado</ModalHeader>
            <ModalBody>Estás seguro que deseas eliminar el empleado {form && form.id_empleado}</ModalBody>
            <ModalFooter>
              <button className='btn btn-danger' onClick={() => this.peticionDelete()}>
                Sí
              </button>
              <button className='btn btn-secondary' onClick={() => this.setState({ modalEliminar: false })}>
                No
              </button>
            </ModalFooter>
          </Modal>
        </div>
      </div>
    );
  }
}

export default ShowEmployees;
