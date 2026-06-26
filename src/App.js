import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import TasksPage from './pages/TasksPage';
import CategoriesPage from './pages/CategoriesPage';
import ProfilePage from './pages/ProfilePage';
import './App.css';

function Shell() {
  const { user, logout, loading } = useAuth();
  const [page, setPage] = useState('tasks');

  if (loading) {
    return (
      <div className="splash">
        <div className="spinner" />
      </div>
    );
  }

  if (!user) return <LoginPage />;

  const navItems = [
    { id: 'tasks',      label: '✅ Tarefas' },
    { id: 'categories', label: '🏷️ Categorias' },
    { id: 'profile',    label: '👤 Perfil' },
  ];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="brand-icon">📋</span>
          <span className="brand-name">TaskManager</span>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${page === item.id ? 'active' : ''}`}
              onClick={() => setPage(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">{user.name?.[0]?.toUpperCase()}</div>
            <div className="user-details">
              <span className="user-name">{user.name}</span>
              <span className="user-email">{user.email}</span>
            </div>
          </div>
          <button className="btn-logout" onClick={logout}>Sair</button>
        </div>
      </aside>

      <main className="main-content">
        {page === 'tasks'      && <TasksPage />}
        {page === 'categories' && <CategoriesPage />}
        {page === 'profile'    && <ProfilePage />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Shell />
    </AuthProvider>
  );
}
