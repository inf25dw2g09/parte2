import { useAuth } from '../../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';
import Loading from '../ui/Loading';

// Protege um grupo de rotas enquanto valida a sessão.
// Enquanto carrega mostra Loading; se não houver sessão redireciona para /login.
export default function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) return <Loading message="A validar sessão…" />;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}