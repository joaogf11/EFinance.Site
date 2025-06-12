import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Input } from '../../components/ui/input';
import api from '../../services/api';
import AppLayout from '../../components/AppLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../../components/ui/table';
import { Button } from '../../components/ui/button';
import { PlusCircle, TrendingDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './expenses-styles.css';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [newExpenseValue, setNewExpenseValue] = useState('');
  const [newExpenseDueDate, setNewExpenseDueDate] = useState('');
  const [newExpenseCategoryId, setNewExpenseCategoryId] = useState('');
  const [newExpenseDescription, setNewExpenseDescription] = useState('');

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/expense/get-expense');
        setExpenses(response.data);
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchExpenses();
    // fetch categories for expense
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

  const handleCreateExpense = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem('userId');
      const payload = {
        value: parseFloat(newExpenseValue),
        dueDate: newExpenseDueDate,
        category: newExpenseCategoryId,
        description: newExpenseDescription,
        userId,
      };
      const response = await api.post('/api/expense/new-expense', payload);
      setExpenses(prev => [response.data, ...prev]);
      setIsExpenseModalOpen(false);
      setNewExpenseValue('');
      setNewExpenseDueDate('');
      setNewExpenseCategoryId('');
      setNewExpenseDescription('');
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

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.value, 0);

  if (error) {
    return (
      <AppLayout>
        <div className="expenses-container">          
          <Card className="error-card">
            <CardContent>
              <span>Erro ao carregar despesas: {error}</span>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="expenses-container">        
        <div className="expenses-header">
          <h1 className="expenses-title">Despesas</h1>
          <div className="expenses-date">
            {new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
          <Button className="expenses-button" onClick={() => setIsExpenseModalOpen(true)}>
            <PlusCircle className="expenses-icon" />
            Nova Despesa
          </Button>
          {/* Create Expense Modal */}
          <Dialog.Root open={isExpenseModalOpen} onOpenChange={setIsExpenseModalOpen}>
            <Dialog.Overlay className="fixed inset-0 bg-black/50" />
            <Dialog.Content className="fixed bg-white p-6 rounded-lg shadow-md top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md">
              <Dialog.Title className="text-lg font-semibold">Nova Despesa</Dialog.Title>
              <Dialog.Description className="text-sm text-muted-foreground mb-4">Preencha os dados da nova despesa.</Dialog.Description>
              <form onSubmit={handleCreateExpense}>
                <div className="mb-4">
                  <label htmlFor="expense-value" className="block text-sm font-medium mb-1">Valor</label>
                  <Input
                    id="expense-value"
                    type="number"
                    step="0.01"
                    value={newExpenseValue}
                    onChange={e => setNewExpenseValue(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="expense-date" className="block text-sm font-medium mb-1">Data de Vencimento</label>
                  <Input
                    id="expense-date"
                    type="date"
                    value={newExpenseDueDate}
                    onChange={e => setNewExpenseDueDate(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="expense-category" className="block text-sm font-medium mb-1">Categoria</label>
                  <select
                    id="expense-category"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                    value={newExpenseCategoryId}
                    onChange={e => setNewExpenseCategoryId(e.target.value)}
                    required
                  >
                    <option value="">Selecione uma categoria</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.title}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label htmlFor="expense-description" className="block text-sm font-medium mb-1">Descrição</label>
                  <Input
                    id="expense-description"
                    value={newExpenseDescription}
                    onChange={e => setNewExpenseDescription(e.target.value)}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" type="button" onClick={() => setIsExpenseModalOpen(false)}>Cancelar</Button>
                  <Button type="submit">Criar</Button>
                </div>
              </form>
            </Dialog.Content>
          </Dialog.Root>
        </div>

        <div className="expenses-summary-grid">
          <Card className="expenses-card expense-total-card">
            <CardHeader className="expenses-card-header">
              <CardTitle className="expenses-card-title">Total de Despesas</CardTitle>
            </CardHeader>
            <CardContent className="expenses-card-content">
              <TrendingDown className="expenses-card-icon" />
              <span className="expenses-card-value">
                {formatCurrency(totalExpenses)}
              </span>
            </CardContent>
          </Card>
          
          {monthlyData.length > 0 && (
            <Card className="expenses-card expense-chart-card">
              <CardHeader className="expenses-card-header">
                <CardTitle className="expenses-card-title">Despesas Mensais</CardTitle>
              </CardHeader>
              <CardContent className="expenses-card-content chart-content">
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={monthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend />
                    <Line type="monotone" dataKey="expenses" stroke="#f44336" name="Despesas" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>

        <Card className="expenses-table-card">
          <CardHeader>
            <CardTitle>Todas as Despesas</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="expenses-loading">
                Carregando despesas...
              </div>
            ) : (
              <div className="expenses-table-container">
                <Table className="expenses-table">
                  <TableHeader className="expenses-table-header">
                    <TableRow className="expenses-table-row">
                      <TableHead className="expenses-table-head">Data de Vencimento</TableHead>
                      <TableHead className="expenses-table-head">Categoria</TableHead>
                      <TableHead className="expenses-table-head">Valor</TableHead>
                      <TableHead className="expenses-table-head">Descrição</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expenses.length === 0 ? (
                      <TableRow className="expenses-table-row">
                        <TableCell colSpan={4} className="expenses-no-data">
                          Nenhuma despesa encontrada.
                        </TableCell>
                      </TableRow>
                    ) : (
                      expenses.map((expense) => (
                        <TableRow key={expense.id} className="expenses-table-row">
                          <TableCell className="expenses-table-cell">{formatDate(expense.dueDate)}</TableCell>
                          <TableCell className="expenses-table-cell">{expense.category?.title || 'Sem categoria'}</TableCell>
                          <TableCell className="expenses-table-cell expense-value">
                            {formatCurrency(expense.value)}
                          </TableCell>
                          <TableCell className="expenses-table-cell">{expense.description}</TableCell>
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

export default Expenses;