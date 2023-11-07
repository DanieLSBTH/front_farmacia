import React, { Component } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

const url = 'https://farmacia-6933.onrender.com/api/producto/';

class ShowProducts extends Component {
  state = {
    products: [],
    proveedores:[],
    modalInsertar: false,
    modalEliminar: false,
    form: {
      id_producto: '',
      producto: '',
      descripcion: '',
      precio_compra: '',
      precio_venta: '',
      stock: '0',
      imagen: null,
      imagenPreview: null,
      categoria: '',
      id_proveedor: '',
      tipoModal: '',
    },
  };

  peticionGet = () => {
    axios
      .get(url)
      .then((response) => {
        this.setState({ products: response.data });
      })
      .catch((error) => {
        console.log(error.message);
      });
      axios
      .get('https://farmacia-6933.onrender.com/api/proveedor/')
      .then((response) => {
        this.setState({ proveedores: response.data });
      })
      .catch((error) => {
        console.log(error.message);
      });

      
  };

  peticionPost = async () => {
    const { form } = this.state;
    const parametros = new FormData();
    parametros.append('producto', form.producto);
    parametros.append('descripcion', form.descripcion);
    parametros.append('precio_compra', form.precio_compra);
    parametros.append('precio_venta', form.precio_venta);
    parametros.append('stock', form.stock);
    parametros.append('categoria', form.categoria);
    parametros.append('id_proveedor', form.id_proveedor);
    if (form.imagen) {
      parametros.append('imagen', form.imagen, form.imagen.name);
    }
    await axios
      .post(url, parametros)
      .then((response) => {
        this.modalInsertar();
        this.peticionGet();
        Swal.fire('Éxito', 'Producto agregado correctamente', 'success');
      })
      .catch((error) => {
        console.log(error.message);
        Swal.fire('Error', 'Error al agregar el producto', 'error');
      });
  };

  peticionPut = () => {
    const { form } = this.state;
    const parametros = new FormData();
    parametros.append('producto', form.producto);
    parametros.append('descripcion', form.descripcion);
    parametros.append('precio_compra', form.precio_compra);
    parametros.append('precio_venta', form.precio_venta);
    parametros.append('stock', form.stock);
    parametros.append('categoria', form.categoria);
    parametros.append('id_proveedor', form.id_proveedor);
    if (form.imagen) {
      parametros.append('imagen', form.imagen, form.imagen.name);
    }
    axios
      .put(url + form.id_producto, parametros)
      .then((response) => {
        this.modalInsertar();
        this.peticionGet();
        Swal.fire('Éxito', 'Producto actualizado correctamente', 'success');
      })
      .catch((error) => {
        Swal.fire('Error', 'Error al actualizar el producto', 'error');
        console.log(error.message);
      });
  };

  peticionDelete = () => {
    const { form } = this.state;
    axios
      .delete(url + form.id_producto)
      .then((response) => {
        this.setState({ modalEliminar: false });
        this.peticionGet();
        Swal.fire('Éxito', 'Producto eliminado correctamente', 'success');
      })
      .catch((error) => {
        Swal.fire('Error', 'Error al eliminar el producto', 'error');
        console.log(error.message);
      });
  };

  modalInsertar = () => {
    this.setState({ modalInsertar: !this.state.modalInsertar });
  };

  seleccionarProducto = (product) => {
    this.setState({
      tipoModal: 'actualizar',
      form: {
        id_producto: product.id_producto,
        producto: product.producto,
        descripcion: product.descripcion,
        precio_compra: product.precio_compra,
        precio_venta: product.precio_venta,
        stock: product.stock,
        imagen: product.imagen,
        categoria: product.categoria,
        id_proveedor: product.id_proveedor,
      },
    });
  };

  handleChange = async (e) => {
    e.persist();
    const { form } = this.state;
    if (e.target.name === 'imagen') {
      await this.setState({
        form: {
          ...form,
          imagen: e.target.files[0],
          imagenPreview: URL.createObjectURL(e.target.files[0]),
        },
      });
    } else {
      await this.setState({
        form: {
          ...form,
          [e.target.name]: e.target.value,
        },
      });
    }
  };

  componentDidMount() {
    this.peticionGet();
  }

  render() {
    const { form,proveedores } = this.state;
    return (
      <div className='App'>
        <br />
        <br />
        <br />
        <button className='btn btn-success' onClick={() => { this.setState({ form: null, tipoModal: 'insertar' }); this.modalInsertar(); }}>
          Agregar Producto
        </button>
        <br />
        <br />
        <table className='table '>
          <thead>
            <tr>
              <th>ID</th>
              <th>Producto</th>
              <th>Descripción</th>
              <th>Precio Compra</th>
              <th>Precio Venta</th>
              <th>Stock</th>
              <th>Imagen</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {this.state.products
  .slice() 
  .sort((a, b) => a.id_producto - b.id_producto) 
  .map((product) =>  {
              return (
                <tr key={product.id_producto}>
                  <td>{product.id_producto}</td>
                  <td>{product.producto}</td>
                  <td>{product.descripcion}</td>
                  <td>{product.precio_compra}</td>
                  <td>{product.precio_venta}</td>
                  <td>{product.stock}</td>
                  <td>
                    {product.imagen && <img src={`https://farmacia-6933.onrender.com/uploads/${product.imagen}`} style={{ maxWidth: '100px' }} alt='Product' />}
                  </td>
                  <td>
                    <button className='btn btn-primary' onClick={() => { this.seleccionarProducto(product); this.modalInsertar(); }}>
                      Editar
                    </button>{' '}
                    <button className='btn btn-danger' onClick={() => { this.seleccionarProducto(product); this.setState({ modalEliminar: true }); }}>
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
            <ModalHeader toggle={() => this.modalInsertar()}>{this.state.tipoModal === 'insertar' ? 'Insertar Producto' : 'Editar Producto'}</ModalHeader>
            <ModalBody>
              <div className='form-group'>
                <label htmlFor='id_producto'>ID</label>
                <input
                  className='form-control'
                  type='text'
                  name='id_producto'
                  id='id_producto'
                  readOnly
                  onChange={this.handleChange}
                  value={form ? form.id_producto : this.state.products.length + 1}
                />
                <br />
                <label htmlFor='producto'>Producto</label>
                <input
                  className='form-control'
                  type='text'
                  name='producto'
                  id='producto'
                  onChange={this.handleChange}
                  value={form ? form.producto : ''}
                />
                <br />
                <label htmlFor='descripcion'>Descripción</label>
                <input
                  className='form-control'
                  type='text'
                  name='descripcion'
                  id='descripcion'
                  onChange={this.handleChange}
                  value={form ? form.descripcion : ''}
                />
                <br />
                <label htmlFor='precio_compra'>Precio Compra</label>
                <input
                  className='form-control'
                  type='text'
                  name='precio_compra'
                  id='precio_compra'
                  onChange={this.handleChange}
                  value={form ? form.precio_compra : ''}
                />
                <br />
                <label htmlFor='precio_venta'>Precio Venta</label>
                <input
                  className='form-control'
                  type='text'
                  name='precio_venta'
                  id='precio_venta'
                  onChange={this.handleChange}
                  value={form ? form.precio_venta : ''}
                />
                <br />
                <label htmlFor='stock'>Stock</label>
                <input
                  className='form-control'
                  type='text'
                  name='stock'
                  id='stock'
                  onChange={this.handleChange}
                  value={form ? form.stock : '0'}
                />
                <br />
                <label htmlFor='imagen'>Imagen</label>
                <input className='form-control' type='file' name='imagen' accept='image/*' onChange={this.handleChange} />
                {form && form.imagenPreview && <img src={form.imagenPreview} style={{ maxWidth: '100px' }} alt='Product' />}
                <br />
                <label htmlFor='categoria'>Categoría</label>
                <input
                  className='form-control'
                  type='text'
                  name='categoria'
                  id='categoria'
                  onChange={this.handleChange}
                  value={form ? form.categoria : ''}
                />
                <br />
                <label htmlFor='id_proveedor'>ID Proveedor</label>
                <select
  className='form-control'
  name='id_proveedor'
  id='id_proveedor'
  onChange={this.handleChange}
  value={form ? form.id_proveedor : ''}
>
  <option value="">
    Seleccione un proveedor
  </option>
  {/* Mapea la lista de proveedores para generar las opciones */}
  {proveedores.map((proveedor) => (
    <option key={proveedor.id_proveedor} value={proveedor.id_proveedor}>
      {proveedor.proveedor} {/* Asume que el nombre del proveedor está en el campo "nombre" */}
    </option>
  ))}
</select>
               
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
            <ModalHeader>Eliminar Producto</ModalHeader>
            <ModalBody>¿Estás seguro que deseas eliminar el producto {form && form.producto}?</ModalBody>
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

export default ShowProducts;
