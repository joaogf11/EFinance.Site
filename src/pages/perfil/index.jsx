import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import AppLayout from '../../components/AppLayout';
import { User, Mail, Phone, Edit2, Save, X } from 'lucide-react';
import './profile-styles.css';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const userId = localStorage.getItem('userId');
        
        if (!userId) {
          throw new Error('Usuário não encontrado. Por favor, faça login novamente.');
        }
        
        const response = await api.get(`/api/User/${userId}`);
        setUserData(response.data);
        setFormData({
          username: response.data.userName || '',
          email: response.data.email || '',
          phone: response.data.phone || ''
        });
        
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Erro ao carregar dados do usuário');
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleEditToggle = () => {
    if (isEditing) {
      setFormData({
        username: userData.username || '',
        email: userData.email || '',
        phone: userData.phone || ''
      });
    }
    setIsEditing(!isEditing);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const userId = localStorage.getItem('userId');
      
      await api.put(`/api/User/${userId.toString()}`, {
        ...userData,
        ...formData,
        id: userId
      });
      
      const updatedUser = await api.get(`/api/User/${userId}`);
      setUserData(updatedUser.data);
      
      setIsEditing(false);
      setLoading(false);
      
      alert('Perfil atualizado com sucesso!');
    } catch (err) {
      setError('Erro ao atualizar perfil: ' + (err.message || 'Erro desconhecido'));
      setLoading(false);
    }
  };

  if (error) {
    return (
      <AppLayout>
        <div className="profile-container">
          <div className="error-card">
            <span>Erro: {error}</span>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="profile-container">
        <div className="profile-header">
          <h1 className="profile-title">Perfil do Usuário</h1>
          <button 
            className={`edit-button ${isEditing ? 'cancel-button' : ''}`}
            onClick={handleEditToggle}
          >
            {isEditing ? (
              <>
                <X className="button-icon" />
                <span>Cancelar</span>
              </>
            ) : (
              <>
                <Edit2 className="button-icon" />
                <span>Editar Perfil</span>
              </>
            )}
          </button>
        </div>

        <div className="profile-content">
          <div className="profile-card">
            {loading ? (
              <div className="profile-loading">
                <div className="profile-skeleton"></div>
                <div className="profile-skeleton"></div>
                <div className="profile-skeleton"></div>
              </div>
            ) : (
              <>
                <div className="profile-avatar">
                  <div className="avatar-placeholder">
                    <User size={64} strokeWidth={1.5} />
                  </div>
                  <h2 className="profile-name">{userData?.userName || 'Usuário'}</h2>
                </div>

                {isEditing ? (
                  <form className="profile-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label className="form-label">
                        <User className="field-icon" />
                        <span>Nome de Usuário</span>
                      </label>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="form-input"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        <Mail className="field-icon" />
                        <span>Email</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="form-input"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        <Phone className="field-icon" />
                        <span>Telefone</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="form-input"
                      />
                    </div>

                    <div className="form-actions">
                      <button type="submit" className="save-button">
                        <Save className="button-icon" />
                        <span>Salvar Alterações</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="profile-details">
                    <div className="profile-field">
                      <div className="field-label">
                        <Mail className="field-icon" />
                        <span>Email</span>
                      </div>
                      <div className="field-value">{userData?.email || 'Não informado'}</div>
                    </div>

                    <div className="profile-field">
                      <div className="field-label">
                        <Phone className="field-icon" />
                        <span>Telefone</span>
                      </div>
                      <div className="field-value">{userData?.phoneNumber || 'Não informado'}</div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;