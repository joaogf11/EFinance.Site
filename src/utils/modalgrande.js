import React from 'react';
import './css/modalgrande.css';

function ModalGrande({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal-grande" onClick={(e) => e.stopPropagation()}>
        <h2>{title}</h2>
        {children}
      </div>
    </div>
  );
}

export default ModalGrande;
