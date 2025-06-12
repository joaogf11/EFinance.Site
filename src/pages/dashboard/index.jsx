import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import AppLayout from '../../components/AppLayout';
import { ArrowUpRight, ArrowDownRight, Wallet, BarChart4, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import './dashboard-styles.css';

const Dashboard = () => {
  const [summary, setSummary] = useState({ totalRevenue: 0, totalExpense: 0, balance: 0 });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        const summaryResponse = await api.get('/api/dashboard/summary');
        setSummary(summaryResponse.data);

        const transactionsResponse = await api.get('/api/dashboard/recent-transactions');
        setRecentTransactions(transactionsResponse.data);

        const monthlyResponse = await api.get('/api/dashboard/monthly-data');
        if (monthlyResponse.data && Array.isArray(monthlyResponse.data)) {
          setMonthlyData(monthlyResponse.data);
        }
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDashboardData();
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

  const pieData = [
    { name: 'Receitas', value: summary.totalRevenue },
    { name: 'Despesas', value: summary.totalExpense },
  ];

  const COLORS = ['#4ade80', '#f87171'];

  if (error) {
    return (
      <AppLayout>
        <div className="dashboard-container">
          <div className="error-card">
            <span>Erro ao carregar dashboard: {error}</span>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Dashboard</h1>
          <div className="dashboard-date">
            <Calendar className="date-icon" />
            <span>{new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
        </div>

        <div className="dashboard-summary-cards">
          {/* Receitas Card */}
          <div className="summary-card">
            <div className="summary-card-header">
              <h3 className="summary-card-title">
                <ArrowUpRight className="summary-icon revenue-icon" />
                <span>Receitas</span>
              </h3>
            </div>
            <div className="summary-card-content">
              {loading ? (
                <div className="summary-skeleton"></div>
              ) : (
                <div className="summary-value">{formatCurrency(summary.totalRevenue)}</div>
              )}
              <div className="summary-trend revenue-trend">
                <span>+12.5%</span> vs mês anterior
              </div>
            </div>
          </div>
          
          {/* Despesas Card */}
          <div className="summary-card">
            <div className="summary-card-header">
              <h3 className="summary-card-title">
                <ArrowDownRight className="summary-icon expense-icon" />
                <span>Despesas</span>
              </h3>
            </div>
            <div className="summary-card-content">
              {loading ? (
                <div className="summary-skeleton"></div>
              ) : (
                <div className="summary-value">{formatCurrency(summary.totalExpense)}</div>
              )}
              <div className="summary-trend expense-trend">
                <span>+8.2%</span> vs mês anterior
              </div>
            </div>
          </div>
          
          {/* Saldo Card */}
          <div className="summary-card">
            <div className="summary-card-header">
              <h3 className="summary-card-title">
                <Wallet className="summary-icon balance-icon" />
                <span>Saldo</span>
              </h3>
            </div>
            <div className="summary-card-content">
              {loading ? (
                <div className="summary-skeleton"></div>
              ) : (
                <div className="summary-value">{formatCurrency(summary.balance)}</div>
              )}
              <div className="summary-trend balance-trend">
                <span>+5.7%</span> vs mês anterior
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-row">
          {/* Left Column */}
          <div className="dashboard-column dashboard-left-column">
            <div className="dashboard-card transactions-card">
              <div className="card-header">
                <h3 className="card-title">Transações Recentes</h3>
              </div>
              <div className="transactions-content">
                {loading ? (
                  <div className="loading-container">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="transaction-skeleton"></div>
                    ))}
                  </div>
                ) : recentTransactions.length === 0 ? (
                  <div className="no-data">Nenhuma transação recente</div>
                ) : (
                  <div className="transactions-table-container">
                    <table className="transactions-table">
                      <thead>
                        <tr>
                          <th>Data</th>
                          <th>Descrição</th>
                          <th>Categoria</th>
                          <th className="amount-column">Valor</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentTransactions.map((transaction) => (
                          <tr key={transaction.id}>
                            <td className="date-cell">{formatDate(transaction.date)}</td>
                            <td className="description-cell">{transaction.description}</td>
                            <td className="category-cell">{transaction.category}</td>
                            <td className={`amount-cell ${transaction.type === 'revenue' ? 'text-revenue' : 'text-expense'}`}>
                              {transaction.type === 'revenue' ? '+' : '-'}{formatCurrency(transaction.amount)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="dashboard-column dashboard-right-column">
            <div className="dashboard-chart-card">
              <div className="card-header">
                <h3 className="chart-title">
                  <BarChart4 className="chart-icon" />
                  <span>Receitas e Despesas Mensais</span>
                </h3>
              </div>
              <div className="chart-content">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#888888" fontSize={12} />
                    <YAxis stroke="#888888" fontSize={12} />
                    <Tooltip 
                      formatter={(value) => formatCurrency(value)}
                      contentStyle={{ borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', border: 'none' }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      name="Receitas" 
                      stroke="#4ade80" 
                      strokeWidth={2}
                      dot={{ r: 4, strokeWidth: 2 }} 
                      activeDot={{ r: 6 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="expenses" 
                      name="Despesas" 
                      stroke="#f87171" 
                      strokeWidth={2}
                      dot={{ r: 4, strokeWidth: 2 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="dashboard-chart-card">
              <div className="card-header">
                <h3 className="chart-title">Distribuição de Receitas e Despesas</h3>
              </div>
              <div className="chart-content">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      paddingAngle={5}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;