import { BrowserRouter as Router, Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/routing/ProtectedRoute';
import { ROUTES } from './constants/routes';

import Home         from './pages/Home';
import LoginPage    from './pages/LoginPage';
import TasksPage    from './pages/TasksPage';
import CategoriesPage from './pages/CategoriesPage';
import ProfilePage  from './pages/ProfilePage';
import NotFound     from './pages/NotFound';

import './App.css';

// Barra lateral — só aparece quando o utilizador está autenticado
function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.HOME);
  };

  const navItems = [
    { to: ROUTES.TASKS,      label: '✅ Tarefas' },
    { to: ROUTES.CATEGORIES, label: '🏷️ Categorias' },
    { to: ROUTES.PROFILE,    label: '👤 Perfil' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="brand-icon">📋</span>
        <span className="brand-name">TaskManager</span>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">{user?.name?.[0]?.toUpperCase()}</div>
          <div className="user-details">
            <span className="user-name">{user?.name}</span>
            <span className="user-email">{user?.email}</span>
          </div>
        </div>
        <button className="btn-logout" onClick={handleLogout}>Sair</button>
      </div>
    </aside>
  );
}

// Shell principal — layout com sidebar para páginas protegidas
function AppLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="splash">
        <div className="spinner" />
      </div>
    );
  }

  // Páginas públicas (sem sidebar)
  return (
    <Router>
      <Routes>
        {/* Rotas públicas */}
        <Route path={ROUTES.HOME}  element={<Home />} />
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />

        {/* Rotas protegidas — precisam de sessão */}
        <Route element={<ProtectedRoute />}>
          <Route
            path={ROUTES.TASKS}
            element={
              <div className="app-shell">
                <Sidebar />
                <main className="main-content"><TasksPage /></main>
              </div>
            }
          />
          <Route
            path={ROUTES.CATEGORIES}
            element={
              <div className="app-shell">
                <Sidebar />
                <main className="main-content"><CategoriesPage /></main>
              </div>
            }
          />
          <Route
            path={ROUTES.PROFILE}
            element={
              <div className="app-shell">
                <Sidebar />
                <main className="main-content"><ProfilePage /></main>
              </div>
            }
          />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppLayout />
    </AuthProvider>
  );
}