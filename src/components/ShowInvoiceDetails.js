import React, { Component } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

const facturaDetalleUrl = 'https://farmacia-6933.onrender.com/api/factura_detalle/';
const productoUrl = 'https://farmacia-6933.onrender.com/api/producto/';

class ShowInvoiceDetails extends Component {
  state = {
    invoiceDetails: [],
    products: [], // Agregar el estado para almacenar los productos
    modalInsertar: false,
    modalEliminar: false,
    form: {
      id_venta_detalle: '',
      id_factura: '',
      id_producto: '', // Cambiar a un campo select para mostrar los productos
      cantidad: '',
      precio: '',
      total: '',
      tipoModal: '',
    },
  };

  peticionGet = () => {
    const { match } = this.props; // Obtener el ID de la factura desde this.props.match.params
    const facturaId = match.params.id;
    axios
      .get(`${facturaDetalleUrl}?facturaId=${facturaId}`) // Ajustar la URL para obtener detalles de la factura por su ID
      .then((response) => {
        const newDetailId = response.data[0].id_venta_detalle;
        const newDetail = response.data.find((detail) => detail.id_venta_detalle === newDetailId);
        this.setState({ invoiceDetails: newDetail ? [newDetail] : [] });
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  
  peticionPost = async () => {
    delete this.state.form.id_venta_detalle;
    await axios
      .post(facturaDetalleUrl, this.state.form)
      .then((response) => {
        this.modalInsertar();
        const newDetail = response.data; // Nuevo registro agregado
        this.setState({ invoiceDetails: [newDetail] }); // Actualizar invoiceDetails con el nuevo registro
        Swal.fire('Éxito', 'Detalle de factura creado exitosamente', 'success');
      })
      .catch((error) => {
        console.log(error.message);
        Swal.fire('Error', 'Error al crear el detalle de la factura', 'error');
      });
  };
  
  peticionPut = () => {
    axios
      .put(facturaDetalleUrl + this.state.form.id_venta_detalle, this.state.form)
      .then((response) => {
        this.modalInsertar();
        this.peticionGet();
        Swal.fire('Éxito', 'Detalle de factura actualizado exitosamente', 'success');
      })
      .catch((error) => {
        Swal.fire('Error', 'Error al actualizar el detalle de la factura', 'error');
        console.log(error.message);
      });
  };

  peticionDelete = () => {
    axios
      .delete(facturaDetalleUrl + this.state.form.id_venta_detalle)
      .then((response) => {
        this.setState({ modalEliminar: false });
        this.peticionGet();
        Swal.fire('Éxito', 'Detalle de factura eliminado exitosamente', 'success');
      })
      .catch((error) => {
        Swal.fire('Error', 'Error al eliminar el detalle de la factura', 'error');
        console.log(error.message);
      });
  };

  modalInsertar = () => {
    this.setState({ modalInsertar: !this.state.modalInsertar });
  };

  modalEliminar = () => {
    this.setState({ modalEliminar: !this.state.modalEliminar });
  };

  seleccionarDetalle = (detalle) => {
    this.setState({
      tipoModal: 'actualizar',
      form: {
        id_venta_detalle: detalle.id_venta_detalle,
        id_factura: detalle.id_factura,
        id_producto: detalle.id_producto,
        cantidad: detalle.cantidad,
        precio: detalle.precio,
        total: detalle.total,
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
    this.loadProducts(); 
   // Cargar los productos cuando se monta el componente
  
  }

  // Agregar función para cargar los productos
  loadProducts = () => {
    axios
      .get(productoUrl)
      .then((response) => {
        this.setState({ products: response.data });
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  
  render() {
    const { form } = this.state;
    return (
      <div className='App'>
        <br />
        <br />
        <br />
        <button className='btn btn-dark' onClick={() => { this.setState({ form: null, tipoModal: 'insertar' }); this.modalInsertar(); }}>
          Añadir Detalle de Factura
        </button>
        <br />
        <br />
        <table className='table '>
          <thead>
            <tr>
              <th>#</th>
              <th>ID Venta Detalle</th>
              <th>ID Venta</th>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio</th>
              <th>Total</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
  {this.state.invoiceDetails.map((detalle, index) => {
    const productName = this.state.products.find((product) => product.id_producto === detalle.id_producto)?.producto;
    return (
      <tr key={detalle.id_venta_detalle}>
        <td>{index + 1}</td>
        <td>{detalle.id_venta_detalle}</td>
        <td>{detalle.id_factura}</td>
        <td>{productName}</td>
        <td>{detalle.cantidad}</td>
        <td>{detalle.precio}</td>
        <td>{detalle.total}</td>
        <td>
          <button className='btn btn-primary' onClick={() => { this.seleccionarDetalle(detalle); this.modalInsertar(); }}>
            Editar
          </button>
          {'   '}
          <button className='btn btn-danger' onClick={() => { this.seleccionarDetalle(detalle); this.modalEliminar(); }}>
            Eliminar
          </button>
        </td>
      </tr>
    );
  })}
</tbody>

        </table>

        <div className='modal-dialog'>
          <Modal isOpen={this.state.modalInsertar} toggle={() => this.modalInsertar()}>
            <ModalHeader toggle={() => this.modalInsertar()}>{this.state.tipoModal === 'insertar' ? 'Insertar Detalle de Factura' : 'Editar Detalle de Factura'}</ModalHeader>
            <ModalBody>
              <div className='form-group'>
                <label htmlFor='id_factura'>ID Venta</label>
                <input
                  className='form-control'
                  type='text'
                  name='id_factura'
                  id='id_factura'
                  onChange={this.handleChange}
                  value={form ? form.id_factura : ''}
                />
                <br />
                <label htmlFor='id_producto'>Producto</label>
                <select
                  className='form-control'
                  name='id_producto'
                  id='id_producto'
                  onChange={this.handleChange}
                  value={form ? form.id_producto : ''}
                >
                  <option value='' disabled>
                    Seleccione un producto
                  </option>
                  {this.state.products.map((product) => (
                    <option key={product.id_producto} value={product.id_producto}>
                      {product.producto}
                    </option>
                  ))}
                </select>
                <br />
                <label htmlFor='cantidad'>Cantidad</label>
                <input
                  className='form-control'
                  type='text'
                  name='cantidad'
                  id='cantidad'
                  onChange={this.handleChange}
                  value={form ? form.cantidad : ''}
                />
                <br />
                <label htmlFor='precio'>Precio</label>
                <input
                  className='form-control'
                  type='text'
                  name='precio'
                  id='precio'
                  onChange={this.handleChange}
                  value={form ? form.precio : ''}
                />
                <br />
                <label htmlFor='total'>Total</label>
                <input
                  className='form-control'
                  type='text'
                  name='total'
                  id='total'
                  onChange={this.handleChange}
                  value={form ? form.total : ''}
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
          <Modal isOpen={this.state.modalEliminar} toggle={() => this.modalEliminar()}>
            <ModalHeader>Eliminar Detalle de Factura</ModalHeader>
            <ModalBody>Estás seguro que deseas eliminar el detalle de la factura {form && form.id_venta_detalle}</ModalBody>
            <ModalFooter>
              <button className='btn btn-danger' onClick={() => this.peticionDelete()}>
                Sí
              </button>
              <button className='btn btn-secondary' onClick={() => this.modalEliminar()}>
                No
              </button>
            </ModalFooter>
          </Modal>
        </div>
      </div>
    );
  }
}

export default ShowInvoiceDetails;