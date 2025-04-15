import React from 'react';
import './auth-styles.css';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="auth-layout">
      <div className="auth-container">
        <div className="auth-logo-container">
          <div className="auth-logo">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="#00b4d8" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              style={{ width: '2.5rem', height: '2.5rem' }}
            >
              <path d="M12 1v22"></path>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          </div>
          <h1 className="auth-title">E-Finnance</h1>
          <p className="auth-subtitle">{subtitle || "Gerencie suas finanças com facilidade"}</p>
        </div>
        
        {children}
        
        <div className="auth-footer">
          <p> {new Date().getFullYear()} E-Finnance. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
