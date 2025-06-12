import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Input } from '../../components/ui/input';
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
  const [categories, setCategories] = useState([]);
  const [isRevenueModalOpen, setIsRevenueModalOpen] = useState(false);
  const [newRevenueSalary, setNewRevenueSalary] = useState('');
  const [newRevenueOther, setNewRevenueOther] = useState('');
  const [newRevenueDate, setNewRevenueDate] = useState('');
  const [newRevenueCategoryId, setNewRevenueCategoryId] = useState('');
  const [newRevenueDescription, setNewRevenueDescription] = useState('');

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
    // fetch categories for revenue
    const fetchCategories = async () => {
      try {
        const res = await api.get('/api/category/get-category');
        setCategories(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  const handleCreateRevenue = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem('userId');
      const payload = {
        salary: parseFloat(newRevenueSalary),
        otherIncomes: parseFloat(newRevenueOther),
        incomeDate: newRevenueDate,
        categoryId: newRevenueCategoryId,
        description: newRevenueDescription,
        userId,
      };
      const response = await api.post('/api/revenue/new-revenue', payload);
      setRevenues(prev => [response.data, ...prev]);
      setIsRevenueModalOpen(false);
      setNewRevenueSalary('');
      setNewRevenueOther('');
      setNewRevenueDate('');
      setNewRevenueCategoryId('');
      setNewRevenueDescription('');
    } catch (err) {
      console.error(err);
    }
  };

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
          <Button className="revenue-button" onClick={() => setIsRevenueModalOpen(true)}>
            <PlusCircle className="revenue-icon" />
            Nova Receita
          </Button>
          {/* Create Revenue Modal */}
          <Dialog.Root open={isRevenueModalOpen} onOpenChange={setIsRevenueModalOpen}>
            <Dialog.Overlay className="fixed inset-0 bg-black/50" />
            <Dialog.Content className="fixed bg-white p-6 rounded-lg shadow-md top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md">
              <Dialog.Title className="text-lg font-semibold">Nova Receita</Dialog.Title>
              <Dialog.Description className="text-sm text-muted-foreground mb-4">Preencha os dados da nova receita.</Dialog.Description>
              <form onSubmit={handleCreateRevenue}>
                <div className="mb-4">
                  <label htmlFor="revenue-salary" className="block text-sm font-medium mb-1">Salário</label>
                  <Input
                    id="revenue-salary"
                    type="number"
                    step="0.01"
                    value={newRevenueSalary}
                    onChange={e => setNewRevenueSalary(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="revenue-other" className="block text-sm font-medium mb-1">Outros</label>
                  <Input
                    id="revenue-other"
                    type="number"
                    step="0.01"
                    value={newRevenueOther}
                    onChange={e => setNewRevenueOther(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="revenue-date" className="block text-sm font-medium mb-1">Data</label>
                  <Input
                    id="revenue-date"
                    type="date"
                    value={newRevenueDate}
                    onChange={e => setNewRevenueDate(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="revenue-category" className="block text-sm font-medium mb-1">Categoria</label>
                  <select
                    id="revenue-category"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                    value={newRevenueCategoryId}
                    onChange={e => setNewRevenueCategoryId(e.target.value)}
                    required
                  >
                    <option value="">Selecione uma categoria</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.title}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label htmlFor="revenue-description" className="block text-sm font-medium mb-1">Descrição</label>
                  <Input
                    id="revenue-description"
                    value={newRevenueDescription}
                    onChange={e => setNewRevenueDescription(e.target.value)}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" type="button" onClick={() => setIsRevenueModalOpen(false)}>Cancelar</Button>
                  <Button type="submit">Criar</Button>
                </div>
              </form>
            </Dialog.Content>
          </Dialog.Root>
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