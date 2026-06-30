import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { getMe } from '../services/api';
import { ROUTES } from '../constants/routes';

export default function LoginPage() {
  const { setUser } = useAuth();
  const navigate    = useNavigate();

  const [mode,    setMode]    = useState('login');
  const [form,    setForm]    = useState({ name: '', email: '', password: '' });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        const data = await login(form.email, form.password);
        localStorage.setItem('access_token', data.access_token);
        const me = await getMe();
        setUser(me);
      } else {
        await register(form.name, form.email, form.password);
        const data = await login(form.email, form.password);
        localStorage.setItem('access_token', data.access_token);
        const me = await getMe();
        setUser(me);
      }
      navigate(ROUTES.TASKS);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error_description || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-bg">
      <div className="login-card">
        <div className="login-header">
          <span className="login-icon">📋</span>
          <h1>TaskManager</h1>
          <p>Gestão de tarefas pessoais</p>
        </div>

        <div className="tab-row">
          <button
            className={`tab-btn ${mode === 'login' ? 'active' : ''}`}
            onClick={() => { setMode('login'); setError(''); }}
          >
            Entrar
          </button>
          <button
            className={`tab-btn ${mode === 'register' ? 'active' : ''}`}
            onClick={() => { setMode('register'); setError(''); }}
          >
            Registar
          </button>
        </div>

        <form onSubmit={submit} className="login-form">
          {mode === 'register' && (
            <div className="field">
              <label>Nome</label>
              <input
                name="name"
                placeholder="O teu nome"
                value={form.name}
                onChange={handle}
                required
              />
            </div>
          )}
          <div className="field">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="email@exemplo.com"
              value={form.email}
              onChange={handle}
              required
            />
          </div>
          <div className="field">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handle}
              required
            />
          </div>

          {error && <div className="error-msg">{error}</div>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'A processar…' : mode === 'login' ? 'Entrar' : 'Criar conta'}
          </button>
        </form>

        {mode === 'login' && (
          <p className="login-hint">
            Conta de teste: <strong>igor1@email.com</strong> / <strong>123</strong>
          </p>
        )}
      </div>
    </div>
  );
}