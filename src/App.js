import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { FaHome, FaBox, FaUser, FaUserTie, FaTruck, FaFileInvoice, FaFileAlt, FaImage, FaShoppingCart } from 'react-icons/fa'; // Importa los iconos de React

import ShowProducts from './components/ShowProducts';
import ShowClients from './components/ShowClients';
import ShowEmployees from './components/ShowEmployees';
import './App.css';
import logo from './logo.png';
import ShowProviders from './components/ShowProviders';
import ShowInvoices from './components/ShowInvoice';
import ShowInvoiceDetails from './components/ShowInvoiceDetails';
import Show from './components/Show';
import ShowdDetails from './components/ShowdDetails';

function App() {
  return (
    <BrowserRouter>
      <div>
  
        <header className="navbar">
          <div className="company-description">
            <h1>Mi Farmacia</h1>
            <p>Tu salud, nuestra prioridad.</p>
          </div>
        </header>

        <nav className="navbar">
          <div className="navbar-container">
          <div className="navbar-links">
  <Link to="/" className="nav-link"><FaHome /> Inicio</Link>
  <Link to="/productos" className="nav-link"><FaBox /> Productos</Link>
  <Link to="/clientes" className="nav-link"><FaUser /> Clientes</Link>
  <Link to="/employees" className="nav-link"><FaUserTie /> Empleados</Link>
  <Link to="/providers" className="nav-link"><FaTruck /> Proveedores</Link>
  <Link to="/invoice" className="nav-link"><FaFileInvoice /> Facturas</Link>
  <Link to="/invoicedetails" className="nav-link"><FaFileAlt /> Facturas detalle</Link>
  <Link to="/show" className="nav-link"><FaImage /> imagen</Link>
  <Link to="/showddetails" className="nav-link"><FaShoppingCart /> compra</Link>
</div>
            <div className="logo-container">
              <img src={logo} alt="Logo de la farmacia" className="logo" />
            </div>
          </div>
        </nav>
        <Routes>
        <Route path="/" element={<Home />} />
          <Route path="/productos/*" element={<ShowProducts />} />
          <Route path="/clientes/*" element={<ShowClients />} /> {/* Agrega la ruta de Clientes */}
          <Route path="/employees/*" element={<ShowEmployees />} /> {/* Agrega la ruta de Clientes */}
          <Route path="/providers/*" element={<ShowProviders />} /> {/* Agrega la ruta de Clientes */}
          <Route path="/invoice/*" element={<ShowInvoices />} /> {/* Agrega la ruta de Clientes */}
         <Route path="/invoicedetails/*" element={<ShowInvoiceDetails />} /> {/* Agrega la ruta de Clientes */}
         <Route path="/showddetails/*" element={<ShowdDetails />} /> {/* Agrega la ruta de Clientes */}
         
        </Routes>
      </div>
    </BrowserRouter>
  );
}

function Home() {
  return (
    <div className="Home">
      <Show />
    </div>
  );
}

export default App;
