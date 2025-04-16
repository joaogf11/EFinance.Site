import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import AppLayout from '../../components/AppLayout';
import { User, Mail, Phone } from 'lucide-react';
import './profile-styles.css';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Erro ao carregar dados do usuário');
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

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
              </>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;