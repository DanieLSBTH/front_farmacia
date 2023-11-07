import React, { Component } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

const url = 'https://farmacia-6933.onrender.com/api/producto/';

class Home extends Component {
  state = {
    products: [],
    selectedProduct: null,
    isModalOpen: false,
    borderColor: 0, // Nuevo estado para rastrear el color del borde (usaremos un índice para representar el color)
    searchQuery: '', // Estado para rastrear la consulta de búsqueda
  };

  componentDidMount() {
    axios
      .get(url)
      .then((response) => {
        this.setState({ products: response.data });
      })
      .catch((error) => {
        console.log(error.message);
      });

    // Cambia el color cada 2 segundos, ajusta según sea necesario
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  openModal = (product) => {
    this.setState({ selectedProduct: product, isModalOpen: true });
  };

  closeModal = () => {
    this.setState({ isModalOpen: false });
  };

  handleSearch = (event) => {
    this.setState({ searchQuery: event.target.value });
  };

  render() {
    const { products, selectedProduct, isModalOpen, searchQuery } = this.state;
    const borderColors = ['red', 'red', 'red']; // Colores para el degradado

    // Aplica el filtro de búsqueda en la lista de productos
    const filteredProducts = products.filter((product) =>
      product.producto.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div className='App'>
        <h1 style={{ fontSize: '24px', textAlign: 'center', marginBottom: '20px' }}>Bienvenido a tu farmacia en linea</h1>
        <input
          type='text'
          placeholder='Buscar productos por nombre'
          value={searchQuery}
          onChange={this.handleSearch}
          style={{ margin: '20px auto', padding: '10px', display: 'block' }}
        />
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {filteredProducts.map((product, index) => (
            <div
              key={product.id_producto}
              style={{
                margin: '20px',
                width: '200px',
                border: `1px solid ${borderColors[this.state.borderColor]}`, // Usar el índice para el color del borde
                borderRadius: '5px',
                overflow: 'hidden',
                position: 'relative',
                boxShadow: '5px 5px 5px rgba(0, 0, 0, 0.5)', // Agregado para sombra
              }}
            >
              <div
                style={{
                  cursor: 'pointer',
                }}
                onClick={() => this.openModal(product)}
              >
                <img
                  src={`https://farmacia-6933.onrender.com/uploads/${product.imagen}`}
                  alt={product.producto}
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover',
                    transition: 'transform 0.2s', // Añadido para una transición suave
                  }}
                  onMouseEnter={(e) => (e.target.style.transform = 'scale(1.1)')} // Zoom in al pasar el cursor
                  onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')} // Zoom back al retirar el cursor
                />
                <h4 style={{ marginTop: '10px', marginBottom: '5px', textAlign: 'center' }}>
                  {product.producto}
                </h4>
                <p style={{ textAlign: 'center' }}>Precio de venta: {product.precio_venta}</p>
                <button
                  style={{
                    backgroundColor: '#4CAF50',
                    border: 'none',
                    color: 'white',
                    padding: '10px 20px',
                    textAlign: 'center',
                    textDecoration: 'none',
                    display: 'block',
                    margin: '0 auto',
                    fontSize: '16px',
                    borderRadius: '5px',
                    marginTop: '10px',
                  }}
                  onClick={() => this.openModal(product)}
                >
                  Ver detalles
                </button>
              </div>
            </div>
          ))}
        </div>
        <Modal
          isOpen={isModalOpen}
          onRequestClose={this.closeModal}
          style={{
            content: {
              top: '50%',
              left: '50%',
              right: 'auto',
              bottom: 'auto',
              marginRight: '-50%',
              transform: 'translate(-50%, -50%)',
              maxWidth: '400px',
              maxHeight: '400px',
              overflow: 'auto',
              padding: '20px',
            },
          }}
        >
          {selectedProduct && (
            <div>
              <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>{selectedProduct.producto}</h2>
              <p>Descripción: {selectedProduct.descripcion}</p>
              <p>Precio de venta: {selectedProduct.precio_venta}</p>
              <p>Stock: {selectedProduct.stock}</p>
              
              {/* Agrega más detalles del producto según sea necesario */}
            </div>
          )}
          <button
            style={{
              backgroundColor: '#f44336',
              border: 'none',
              color: 'white',
              padding: '10px 20px',
              textAlign: 'center',
              textDecoration: 'none',
              display: 'inline-block',
              fontSize: '16px',
              borderRadius: '5px',
              marginTop: '20px',
              cursor: 'pointer',
              width: '100%',
            }}
            onClick={this.closeModal}
          >
            Cerrar
          </button>
        </Modal>
      </div>
    );
  }
}

export default Home;