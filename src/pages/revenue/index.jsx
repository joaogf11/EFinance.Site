import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import AppLayout from '../../components/AppLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../../components/ui/table';
import { Button } from '../../components/ui/button';
import { PlusCircle, DollarSign } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './revenue-styles.css';

const Revenue = () => {
  const [revenues, setRevenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    const fetchRevenues = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/revenue/get-revenue');
        setRevenues(response.data);

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchRevenues();
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date);
  };

  const totalRevenue = revenues.reduce((sum, revenue) => sum + revenue.value, 0);

  if (error) {
    return (
      <AppLayout>
        <div className="revenue-container">          
          <Card className="error-card">
            <CardContent>
              <span>Erro ao carregar receitas: {error}</span>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="revenue-container">        
        <div className="revenue-header">
          <h1 className="revenue-title">Receitas</h1>
          <div className="revenue-date">
            {new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
          <Button className="revenue-button">
            <PlusCircle className="revenue-icon" />
            Nova Receita
          </Button>
        </div>

        <div className="revenue-summary-grid">
          <Card className="revenue-card revenue-total-card">
            <CardHeader className="revenue-card-header">
              <CardTitle className="revenue-card-title">Total de Receitas</CardTitle>
            </CardHeader>
            <CardContent className="revenue-card-content">
              <DollarSign className="revenue-card-icon" />
              <span className="revenue-card-value">
                {formatCurrency(totalRevenue)}
              </span>
            </CardContent>
          </Card>
          
          {monthlyData.length > 0 && (
            <Card className="revenue-card revenue-chart-card">
              <CardHeader className="revenue-card-header">
                <CardTitle className="revenue-card-title">Receitas Mensais</CardTitle>
              </CardHeader>
              <CardContent className="revenue-card-content chart-content">
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={monthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#4caf50" name="Receitas" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>

        <Card className="revenue-table-card">
          <CardHeader>
            <CardTitle>Todas as Receitas</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="revenue-loading">
                Carregando receitas...
              </div>
            ) : (
              <div className="revenue-table-container">
                <Table className="revenue-table">
                  <TableHeader className="revenue-table-header">
                    <TableRow className="revenue-table-row">
                      <TableHead className="revenue-table-head">Data</TableHead>
                      <TableHead className="revenue-table-head">Categoria</TableHead>
                      <TableHead className="revenue-table-head">Valor</TableHead>
                      <TableHead className="revenue-table-head">Descrição</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {revenues.length === 0 ? (
                      <TableRow className="revenue-table-row">
                        <TableCell colSpan={4} className="revenue-no-data">
                          Nenhuma receita encontrada.
                        </TableCell>
                      </TableRow>
                    ) : (
                      revenues.map((revenue) => (
                        <TableRow key={revenue.id} className="revenue-table-row">
                          <TableCell className="revenue-table-cell">{formatDate(revenue.date)}</TableCell>
                          <TableCell className="revenue-table-cell">{revenue.category?.title || 'Sem categoria'}</TableCell>
                          <TableCell className="revenue-table-cell revenue-value">
                            {formatCurrency(revenue.value)}
                          </TableCell>
                          <TableCell className="revenue-table-cell">{revenue.description}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Revenue;