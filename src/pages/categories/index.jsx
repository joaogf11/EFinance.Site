import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import AppLayout from '../../components/AppLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../../components/ui/table';
import { Button } from '../../components/ui/button';
import { PlusCircle } from 'lucide-react';
import './categories-styles.css';
import * as Dialog from '@radix-ui/react-dialog';
import { Input } from '../../components/ui/input';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryTitle, setNewCategoryTitle] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');

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

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem('userId');
      const payload = { title: newCategoryTitle, description: newCategoryDescription, userId };
      const response = await api.post('/api/category/new-category', payload);
      setCategories(prev => [response.data, ...prev]);
      setIsCategoryModalOpen(false);
      setNewCategoryTitle('');
      setNewCategoryDescription('');
    } catch (err) {
      console.error(err);
    }
  };

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
          <Button className="categories-button" onClick={() => setIsCategoryModalOpen(true)}>
            <PlusCircle className="categories-icon" />
            Nova Categoria
          </Button>
        </div>

        {/* Create Category Modal */}
        <Dialog.Root open={isCategoryModalOpen} onOpenChange={setIsCategoryModalOpen}>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed bg-white p-6 rounded-lg shadow-md top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md">
            <Dialog.Title className="text-lg font-semibold">Nova Categoria</Dialog.Title>
            <Dialog.Description className="text-sm text-muted-foreground mb-4">Preencha os dados da nova categoria.</Dialog.Description>
            <form onSubmit={handleCreateCategory}>
              <div className="mb-4">
                <label htmlFor="category-title" className="block text-sm font-medium mb-1">Nome</label>
                <Input
                  id="category-title"
                  value={newCategoryTitle}
                  onChange={e => setNewCategoryTitle(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="category-description" className="block text-sm font-medium mb-1">Descrição</label>
                <Input
                  id="category-description"
                  value={newCategoryDescription}
                  onChange={e => setNewCategoryDescription(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" type="button" onClick={() => setIsCategoryModalOpen(false)}>Cancelar</Button>
                <Button type="submit">Criar</Button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Root>

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