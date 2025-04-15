import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import AppLayout from '../../components/AppLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../../components/ui/table';
import { Button } from '../../components/ui/button';
import { PlusCircle } from 'lucide-react';
import './categories-styles.css';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/category/get-category');
        setCategories(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (error) {
    return (
      <AppLayout>
        <div className="categories-container">          
          <Card className="error-card">
            <CardContent>
              <span>Erro ao carregar categorias: {error}</span>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="categories-container">        
        <div className="categories-header">
          <h1 className="categories-title">Categorias</h1>
          <div className="categories-date">
            {new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
          <Button className="categories-button">
            <PlusCircle className="categories-icon" />
            Nova Categoria
          </Button>
        </div>

        <Card className="categories-table-card">
          <CardHeader>
            <CardTitle>Todas as Categorias</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="categories-loading">
                Carregando categorias...
              </div>
            ) : (
              <div className="categories-table-container">
                <Table className="categories-table">
                  <TableHeader className="categories-table-header">
                    <TableRow className="categories-table-row">
                      <TableHead className="categories-table-head">Nome</TableHead>
                      <TableHead className="categories-table-head">Tipo</TableHead>
                      <TableHead className="categories-table-head">Descrição</TableHead>
                      <TableHead className="categories-table-head">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.length === 0 ? (
                      <TableRow className="categories-table-row">
                        <TableCell colSpan={4} className="categories-no-data">
                          Nenhuma categoria encontrada.
                        </TableCell>
                      </TableRow>
                    ) : (
                      categories.map((category) => (
                        <TableRow key={category.id} className="categories-table-row">
                          <TableCell className="categories-table-cell">{category.title}</TableCell>
                          <TableCell className="categories-table-cell">
                            <span className={`category-type ${category.type}`}>
                              {category.type === 'REVENUE' ? 'Receita' : 'Despesa'}
                            </span>
                          </TableCell>
                          <TableCell className="categories-table-cell">{category.description || 'Sem descrição'}</TableCell>
                          <TableCell className="categories-table-cell">
                            <div className="categories-actions">
                              <Button variant="outline" size="sm" className="categories-action-button edit">
                                Editar
                              </Button>
                              <Button variant="outline" size="sm" className="categories-action-button delete">
                                Excluir
                              </Button>
                            </div>
                          </TableCell>
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

export default Categories;