import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, BarChart, PieChart, DollarSign, Tag, Home, User, LogOut } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';
import './app-styles.css';

const AppLayout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const sidebarItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <Home className="w-5 h-5 mr-2" /> },
    { name: 'Receitas', path: '/revenue', icon: <DollarSign className="w-5 h-5 mr-2" /> },
    { name: 'Despesas', path: '/expense', icon: <BarChart className="w-5 h-5 mr-2" /> },
    { name: 'Categorias', path: '/category', icon: <Tag className="w-5 h-5 mr-2" /> },
    { name: 'Perfil', path: '/profile', icon: <User className="w-5 h-5 mr-2" /> },
  ];

  const Sidebar = ({ className = "" }) => (
    <aside className={`sidebar ${className}`}>
      <div className="sidebar-header">
        <h1 className="sidebar-title">E-Finance</h1>
      </div>
      <div className="sidebar-nav">
        <nav>
          {sidebarItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-item ${isActive(item.path) ? 'active' : ''}`}
            >
              <span className="sidebar-icon">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="sidebar-footer">
          <Button
            variant="outline"
            className="w-full flex items-center justify-center"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="app-layout">
      {/* Static sidebar for desktop */}
      <Sidebar />

      {/* Mobile sidebar */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)} className="mobile-menu-button">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Open sidebar</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 mobile-sidebar">
          <div className="flex flex-col h-full">
            <div className="sidebar-header">
              <h1 className="sidebar-title">E-Finance</h1>
            </div>
            <div className="sidebar-nav">
              <nav>
                {sidebarItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`sidebar-item ${isActive(item.path) ? 'active' : ''}`}
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="sidebar-icon">{item.icon}</span>
                    {item.name}
                  </Link>
                ))}
              </nav>
              <div className="sidebar-footer">
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main content wrapper */}
      <div className="content-wrapper">
        {/* Top navigation */}
        <header className="header">
          <div className="flex items-center md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)} className="mobile-menu-button">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open sidebar</span>
            </Button>
          </div>
          <div className="flex-1 flex justify-center md:justify-start">
          </div>
          <div className="flex items-center">
          </div>
        </header>

        {/* Page content */}
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
