import React from 'react';
import { Link } from 'react-router-dom'; // Asumiendo que estás utilizando React Router para la navegación

function WelcomeMenu() {
  return (
    <div className="welcome-menu">
      <h1>Bienvenido</h1>
      <ul>
        <li>
          <Link to="/productos">Productos</Link>
        </li>
        <li>
          <Link to="/empleados">Empleados</Link>
        </li>
        <li>
          <Link to="/clientes">Clientes</Link>
        </li>
        <li>
          <Link to="/factura">Factura</Link>
        </li>
        <li>
          <Link to="/proveedores">Proveedores</Link>
        </li>
      </ul>
    </div>
  );
}

export default WelcomeMenu;
