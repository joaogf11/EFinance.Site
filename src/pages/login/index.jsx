import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { User, Lock, AlertCircle } from 'lucide-react';
import AuthLayout from '../../components/AuthLayout';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login({ username, password });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Usuário ou senha inválidos');
    }
  };

  return (
    <AuthLayout subtitle="Acesse sua conta e gerencie suas finanças">
      <div className="auth-card">
        <div className="auth-card-header">
          <h2 className="auth-card-title">Bem-Vindo</h2>
          <p className="auth-card-description">Faça login para acessar sua conta</p>
        </div>
        <div className="auth-card-content">
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-input-wrapper">
              <User className="auth-input-icon" />
              <input 
                type="text" 
                placeholder="Usuário" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="auth-input"
                required
              />
            </div>
            <div>
              <div className="auth-input-wrapper">
                <Lock className="auth-input-icon" />
                <input 
                  type="password" 
                  placeholder="Senha" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="auth-input"
                  required
                />
              </div>
              <Link to="/forgot-password" className="auth-forgot-password">
                Esqueceu a senha?
              </Link>
            </div>
            {error && (
              <div className="auth-error">
                <AlertCircle className="auth-error-icon" />
                <span>{error}</span>
              </div>
            )}
            <button type="submit" className="auth-button">
              Entrar
            </button>
          </form>
        </div>
        <div className="auth-card-footer">
          <p className="auth-card-footer-text">
            Não tem conta? <Link to="/cadastro" className="auth-link">Cadastrar</Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;