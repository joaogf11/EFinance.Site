import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from 'react-router-dom';
import './css/header.css';
import ModalGrande from './modalgrande';

function Header() {
  const [activeMenu, setActiveMenu] = useState(null);
  const [showCategoriaModal, setShowCategoriaModal] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const toggleMenu = (menu) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

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

  const [showDespesaModal, setShowDespesaModal] = useState(false);

  const handleNavigation = (path) => {
    navigate(path);
    setActiveMenu(null);
  };

  return (
    <>
      <header>
        <img src="images/logo.png" className="header_logo" alt="Logo" />
        <ul ref={dropdownRef}>
          <div className="menu-item">
            <li>
              <Link to="/dashboard">Home</Link>
            </li>
          </div>

          <div className="menu-item">
            <li onClick={() => toggleMenu('categoria')}>
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
            <li onClick={() => toggleMenu('despesas')}>
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
            <li onClick={() => toggleMenu('receitas')}>
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
            <li onClick={() => toggleMenu('perfil')}>
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

    
      <ModalGrande
        isOpen={showCategoriaModal}
        onClose={() => setShowCategoriaModal(false)}
        title="Adicionar Categoria"
      >
        <input
          type="text"
          placeholder="Nome da categoria"
          className="input-modal"
        />
        <button onClick={() => setShowCategoriaModal(false)} className="btn-modal">Salvar</button>
      </ModalGrande>

      <ModalGrande
        isOpen={showDespesaModal}
        onClose={() => setShowDespesaModal(false)}
        title="Adicionar Nova Despesa"
      >
        <form className="form-despesa">
          <input type="text" placeholder="Descrição" />
          <input type="number" placeholder="Valor (R$)" />
          <input type="date" />
          <select>
            <option>Categoria</option>
            <option>Alimentação</option>
            <option>Transporte</option>
            <option>Lazer</option>
          </select>
          <button type="submit">Salvar Despesa</button>
        </form>
    </ModalGrande>
    </>
  );
}

export default Header;
