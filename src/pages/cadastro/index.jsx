import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { User, Lock, Mail, Phone, AlertCircle } from 'lucide-react';
import AuthLayout from '../../components/AuthLayout';

const Cadastro = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        phone: ''
    });
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData);
            navigate('/dashboard');
        } catch (err) {
            let message = 'Erro ao cadastrar. Tente novamente.';
            if (err.response && err.response.data && err.response.data.erros) {
                const errors = err.response.data.erros;
                if (Array.isArray(errors)) {
                    message = errors.join(' ');
                } else if (typeof errors === 'string') {
                    message = errors;
                }
            }
            setError(message);
        }
    };

    return (
        <AuthLayout subtitle="Crie sua conta e comece a organizar suas finanças">
            <div className="auth-card">
                <div className="auth-card-header">
                    <h2 className="auth-card-title">Faça Seu Cadastro</h2>
                    <p className="auth-card-description">Preencha os dados para criar sua conta</p>
                </div>
                <div className="auth-card-content">
                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="auth-input-wrapper">
                            <User className="auth-input-icon" />
                            <input 
                                type="text" 
                                name="username" 
                                placeholder="Usuário" 
                                value={formData.username}
                                onChange={handleChange}
                                className="auth-input"
                                required
                            />
                        </div>
                        <div className="auth-input-wrapper">
                            <Lock className="auth-input-icon" />
                            <input 
                                type="password" 
                                name="password" 
                                placeholder="Senha" 
                                value={formData.password}
                                onChange={handleChange}
                                className="auth-input"
                                required
                            />
                        </div>
                        <div className="auth-input-wrapper">
                            <Mail className="auth-input-icon" />
                            <input 
                                type="email" 
                                name="email" 
                                placeholder="E-mail" 
                                value={formData.email}
                                onChange={handleChange}
                                className="auth-input"
                                required
                            />
                        </div>
                        <div className="auth-input-wrapper">
                            <Phone className="auth-input-icon" />
                            <input 
                                type="tel" 
                                name="phone" 
                                placeholder="Telefone" 
                                value={formData.phone}
                                onChange={handleChange}
                                className="auth-input"
                            />
                        </div>
                        {error && (
                            <div className="auth-error">
                                <AlertCircle className="auth-error-icon" />
                                <span>{error}</span>
                            </div>
                        )}
                        <button type="submit" className="auth-button">
                            Cadastrar
                        </button>
                    </form>
                </div>
                <div className="auth-card-footer">
                    <p className="auth-card-footer-text">
                        Já tem conta? <Link to="/" className="auth-link">Login</Link>
                    </p>
                </div>
            </div>
        </AuthLayout>
    );
};

export default Cadastro;