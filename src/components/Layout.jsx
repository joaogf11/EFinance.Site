import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Layout.css';

const Layout = ({ children, selectedPage }) => {
  const [activeMenu, setActiveMenu] = useState(selectedPage);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setActiveMenu(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
    setActiveMenu(null);
  };

  return (
    <div className="layout">
      <header>
        <img src="images/logo.png" className="header_logo" alt="Logo" />
        <ul ref={dropdownRef}>
          <div className="menu-item">
            <li className={selectedPage === 'home' ? 'active' : ''}>
              <Link to="/dashboard">Home</Link>
            </li>
          </div>

          <div className="menu-item">
            <li 
              className={selectedPage === 'categoria' ? 'active' : ''}
              onClick={() => setActiveMenu('categoria')}
            >
              Categoria
              {activeMenu === 'categoria' && (
                <ul className="dropdown">
                  <li className="dropdown_li" onClick={() => handleNavigation('/category')}>
                    Ver Categorias
                  </li>
                </ul>
              )}
            </li>
          </div>

          <div className="menu-item">
            <li 
              className={selectedPage === 'despesas' ? 'active' : ''}
              onClick={() => setActiveMenu('despesas')}
            >
              Despesas
              {activeMenu === 'despesas' && (
                <ul className="dropdown">
                  <li className="dropdown_li" onClick={() => handleNavigation('/expense')}>
                    Ver Despesas
                  </li>
                </ul>
              )}
            </li>
          </div>

          <div className="menu-item">
            <li 
              className={selectedPage === 'receitas' ? 'active' : ''}
              onClick={() => setActiveMenu('receitas')}
            >
              Receitas
              {activeMenu === 'receitas' && (
                <ul className="dropdown">
                  <li className="dropdown_li" onClick={() => handleNavigation('/revenue')}>
                    Ver Receitas
                  </li>
                </ul>
              )}
            </li>
          </div>

          <div className="menu-item">
            <li 
              className={selectedPage === 'perfil' ? 'active' : ''}
              onClick={() => setActiveMenu('perfil')}
            >
              Perfil
              {activeMenu === 'perfil' && (
                <ul className="dropdown">
                  <li className="dropdown_li">Ver Perfil</li>
                  <li className="dropdown_li">Editar Perfil</li>
                </ul>
              )}
            </li>
          </div>
        </ul>
      </header>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout; 