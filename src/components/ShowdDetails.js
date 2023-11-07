import React, { Component } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
const url = 'https://farmacia-6933.onrender.com/api/facturas/';
const clientesUrl = 'https://farmacia-6933.onrender.com/api/cliente/';
const empleadosUrl = 'https://farmacia-6933.onrender.com/api/empleado/';
const facturaDetalleUrl = 'https://farmacia-6933.onrender.com/api/factura_detalle/';
const productoUrl = 'https://farmacia-6933.onrender.com/api/producto/';
class ShowInvoices extends Component {
  state = {
    providers: [],
    clientes: [],
    empleados: [],
    currentInvoice: {},
    modalInsertar: false,
    modalEliminar: false,
    isFacturaAdded: false,
    form: {
      id_factura: '',
      fecha: '',
      no_factura: '',
      id_cliente: '',
      id_empleado: '',
      tipoModal: '',
    },
    detailForm: {
      id_venta_detalle: '',
      id_factura: '',
      id_producto: '',
      cantidad: '',
      precio: '',
      total: '',
      tipoModal: '',
    },
   
  };

  peticionGet = () => {
    axios.get(url).then((response) => {
      // Verifica si se ha agregado un nuevo registro
      if (this.state.providers.length > 0) {
        const newInvoiceId = this.state.providers[0].id_factura;
        const newInvoice = response.data.find((invoice) => invoice.id_factura === newInvoiceId);
        this.setState({ providers: [newInvoice] });
      } else {
        this.setState({ providers: [] });
      }
    }).catch((error) => {
      console.log(error.message);
    });

    axios.get(clientesUrl).then((response) => {
      this.setState({ clientes: response.data });
    }).catch((error) => {
      console.log(error.message);
    });

    axios.get(empleadosUrl).then((response) => {
      this.setState({ empleados: response.data });
    }).catch((error) => {
      console.log(error.message);
    });

    axios.get(facturaDetalleUrl).then((response) => {
      if (this.state.invoiceDetails.length > 0) {
        const newDetailId = this.state.invoiceDetails[0].id_venta_detalle;
        const newDetail = response.data.find((detail) => detail.id_venta_detalle === newDetailId);
        this.setState({ invoiceDetails: newDetail ? [newDetail] : [] });
      } else {
        this.setState({ invoiceDetails: [] });
      }
    }).catch((error) => {
      console.log(error.message);
    });

    axios.get(productoUrl).then((response) => {
      this.setState({ products: response.data });
    }).catch((error) => {
      console.log(error.message);
    });
  };

  
  peticionPost = async () => {
    delete this.state.form.id_factura;
    await axios.post(url, this.state.form).then(response => {
      this.modalInsertar();
      const newInvoice = response.data; // Nuevo registro agregado
      this.setState({ providers: [newInvoice], isFacturaAdded: true }); // Actualiza providers con el nuevo registro y establece la bandera en true
      Swal.fire('Éxito', 'Factura creada exitosamente', 'success');
    }).catch(error => {
      console.log(error.message);
      Swal.fire('Error', 'Error al crear la factura', 'error');
    });
  };
  
  
  

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
    });
    this.setState({ id_factura: factura.id_factura });
  }
  loadInvoiceDetails = () => {
    axios.get(facturaDetalleUrl).then((response) => {
      this.setState({ invoiceDetails: response.data });
    }).catch((error) => {
      console.log(error.message);
    });
  };

 
  
  

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
    this.loadInvoiceDetails();
  }

  // Función para cargar los detalles de la factura en el estado
  loadInvoiceDetails = () => {
    axios.get(facturaDetalleUrl).then((response) => {
      this.setState({ invoiceDetails: response.data });
    }).catch((error) => {
      console.log(error.message);
    });
  };

  generatePDF = () => {
    const { providers, invoiceDetails } = this.state;
    const doc = new jsPDF();

    // Agregar encabezado al PDF
    doc.text('Facturas', 10, 10);

    // Recorrer y agregar datos de facturas
    providers.forEach((factura, index) => {
      doc.text(`Factura #${factura.no_factura}`, 10, 20 + index * 10);
      doc.text(`Fecha: ${factura.fecha}`, 10, 30 + index * 10);
      // ... (otros datos de la factura)
    });

    // Recorrer y agregar detalles de factura
    invoiceDetails.forEach((detalle, index) => {
      doc.text(`Detalle #${index + 1}`, 10, 80 + index * 10);
      doc.text(`Producto: ${detalle.producto}`, 10, 90 + index * 10);
      doc.text(`Cantidad: ${detalle.cantidad}`, 10, 100 + index * 10);
      doc.text(`Precio: ${detalle.precio}`, 10, 110 + index * 10);
      doc.text(`Total: ${detalle.total}`, 10, 120 + index * 10);
    });

    // Guardar el PDF
    doc.save('facturas.pdf');
  };


  
  render() {
    const { form, clientes, empleados , isFacturaAdded} = this.state;
    return (
      <div className="App">
        <br /><br /><br />
        <button
          className="btn btn-success"
          onClick={() => {
            this.setState({ form: null, tipoModal: 'insertar' });
            this.modalInsertar();
          }}
          disabled={isFacturaAdded} // Deshabilita el botón si se ha agregado una factura
        >
          Agregar Factura
        </button>
        <br /><br />
        <table className="table ">
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>No. Factura</th>
              <th> Cliente</th>
              <th> Empleado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
          {this.state.providers.map(factura => {
    const cliente = this.state.clientes.find(c => c.id_cliente === factura.id_cliente);
    const empleado = this.state.empleados.find(e => e.id_empleado === factura.id_empleado);

    return (
      <tr key={factura.id_factura}>
        <td>{factura.id_factura}</td>
        <td>{factura.fecha}</td>
        <td>{factura.no_factura}</td>
        <td>{cliente ? cliente.nombre : ''}</td>
        <td>{empleado ? empleado.nombre : ''}</td>
        <td>
          <button className="btn btn-primary" onClick={() => { this.seleccionarFactura(factura); this.modalInsertar() }}>Editar</button>
          {"   "}
          <button className="btn btn-danger" onClick={() => { this.seleccionarFactura(factura); this.setState({ modalEliminar: true }) }}>Eliminar</button>
          {"   "}
          <button onClick={this.generatePDF}>Generar PDF de Facturas</button>

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
       
        <ShowInvoiceDetailss id_factura={this.state.form ? this.state.form.id_factura : null} />



       
         </div>

);
  }
}
class ShowInvoiceDetailss extends Component {
    state = {
      invoiceDetails: [],
      products: [],
      modalInsertar: false,
      modalEliminar: false,
      form: {
        id_venta_detalle: '',
        id_factura: '',
        id_producto: '',
        cantidad: '',
        precio: '',
        total: '',
        tipoModal: '',
      },
      total:0,
      totalAcumulativo:0,
    };
    peticionGet = () => {
      const { id_factura } = this.props;
      axios
        .get(`${facturaDetalleUrl}?id_factura=${id_factura}`)
        .then((response) => {
          if (this.state.invoiceDetails.length > 0) {
            const newDetailId = this.state.invoiceDetails[0].id_venta_detalle;
            const newDetail = response.data.find(
              (detail) => detail.id_venta_detalle === newDetailId
            );
            this.setState({
              invoiceDetails: newDetail ? [newDetail] : [],
              total: response.data.reduce((acc, detail) => acc + parseFloat(detail.total), 0), // Convertir a número y calcular la suma total
            });
          } else {
            this.setState({
              invoiceDetails: [],
              total: response.data.reduce((acc, detail) => acc + parseFloat(detail.total), 0), // Convertir a número y calcular la suma total
            });
          }
        })
        .catch((error) => {
          console.log(error.message);
        });
    };
    
    peticionPost = async () => {
      // Elimina la propiedad id_venta_detalle
      delete this.state.form.id_venta_detalle;
    
      // Establece id_factura en el valor pasado como propiedad
      this.state.form.id_factura = this.props.id_factura;
    
      // Realiza la operación POST con this.state.form
      await axios
        .post(facturaDetalleUrl, this.state.form)
        .then((response) => {
          this.modalInsertar();
          const newDetail = response.data; // Nuevo registro agregado
    
          // Actualiza el estado, incluido el valor de id_factura
          const newTotal = parseFloat(newDetail.total);
          this.setState((prevState) => ({
            invoiceDetails: [...prevState.invoiceDetails, newDetail],
            totalAcumulativo: prevState.totalAcumulativo + newTotal,
          }));
    
          Swal.fire('Éxito', 'Detalle de factura creado exitosamente', 'success');
        })
        .catch((error) => {
          console.log(error.message);
          Swal.fire('Error', 'Error al crear el detalle de la factura', 'error');
        });
    };
    
    
    peticionDelete = () => {
      axios
        .delete(facturaDetalleUrl + this.state.form.id_venta_detalle)
        .then((response) => {
          this.setState({ modalEliminar: false });
  
          this.setState((prevState) => {
            const deletedTotal = parseFloat(prevState.form.total);
            return {
              invoiceDetails: prevState.invoiceDetails.filter(
                (detalle) => detalle.id_venta_detalle !== prevState.form.id_venta_detalle
              ),
              total: prevState.total - deletedTotal, // Actualiza el total restando el detalle eliminado
            };
          });
  
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
   // En ShowInvoiceDetails.js


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
     
      if (this.props.id_factura === null) {
        // Puedes obtener id_factura de otra manera o configurarlo según tus necesidades
      } else {
        this.setState({
          form: {
            ...this.state.form,
            id_factura: this.props.id_factura,
          },
        });
      }
      this.peticionGet();
      this.loadProducts(); // Cargar los productos cuando se monta el componente
    }
  
    // En ShowInvoiceDetails.js



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
                <th>ID factura</th>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Sub total</th>
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
          <div className='total-container'>
  <p>Total: ${this.state.totalAcumulativo.toFixed(2)}</p>
</div>

          <div className='modal-dialog'>
            <Modal isOpen={this.state.modalInsertar} toggle={() => this.modalInsertar()}>
              <ModalHeader toggle={() => this.modalInsertar()}>{this.state.tipoModal === 'insertar' ? 'Insertar Detalle de Factura' : 'Editar Detalle de Factura'}</ModalHeader>
              <ModalBody>
                <div className='form-group'>
                  <label htmlFor='id_factura'>ID Factura</label>
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
  }// Resto del código de las funciones y lógica del componente ShowInvoiceDetails
  
    // Resto del código del componente ShowInvoiceDetails
  

    class ShowdDetails extends Component {
      // Puedes incluir ambas clases aquí
      render() {
        return (
          <div>
            <ShowInvoices />
            <ShowInvoiceDetailss />
          </div>
        );
      }
    }
    
    export default ShowdDetails;