import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Login from "../pages/login";
import Cadastro from "../pages/cadastro";
import NotFound from "../pages/NotFound";
import Expenses from "../pages/expenses";
import Categories from "../pages/categories";
import Revenue from "../pages/revenue";
import Dashboard from "../pages/dashboard";

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        
        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/expense" 
          element={
            <ProtectedRoute>
              <Expenses />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/category" 
          element={
            <ProtectedRoute>
              <Categories />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/revenue" 
          element={
            <ProtectedRoute>
              <Revenue />
            </ProtectedRoute>
          } 
        />
        
        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;