import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../constants/routes';

// Página inicial pública — muda consoante o utilizador tem ou não sessão.
export default function Home() {
  const { user } = useAuth();

  return (
    <div className="login-bg" style={{ flexDirection: 'column', gap: '2rem' }}>
      <div style={{ textAlign: 'center' }}>
        <span style={{ fontSize: '4rem' }}>📋</span>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1e293b', marginTop: '1rem' }}>
          TaskManager
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#64748b', marginTop: '0.5rem', maxWidth: 400 }}>
          Organiza as tuas tarefas de forma simples e eficiente.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        {user ? (
          <>
            <p style={{ color: '#64748b' }}>
              Bem-vindo de volta, <strong>{user.name}</strong>!
            </p>
            <Link to={ROUTES.TASKS} className="btn-primary" style={{ textDecoration: 'none', padding: '0.75rem 2rem' }}>
              Ver as minhas tarefas →
            </Link>
          </>
        ) : (
          <>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Link to={ROUTES.LOGIN} className="btn-primary" style={{ textDecoration: 'none', padding: '0.75rem 2rem' }}>
                Iniciar sessão
              </Link>
              <Link to="/login" state={{ mode: 'register' }} className="btn-secondary" style={{ textDecoration: 'none', padding: '0.75rem 2rem' }}>
                Criar conta
              </Link>
            </div>
          </>
        )}
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center', maxWidth: 600 }}>
        {[
          { icon: '✅', title: 'Gerir tarefas', desc: 'Cria, edita e apaga tarefas com facilidade' },
          { icon: '🏷️', title: 'Organizar por categorias', desc: 'Agrupa as tarefas por categorias' },
          { icon: '🔒', title: 'Acesso seguro', desc: 'Autenticação OAuth2 com tokens JWT' },
        ].map((f) => (
          <div
            key={f.title}
            style={{
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: 12,
              padding: '1.25rem',
              width: 170,
              textAlign: 'center',
              boxShadow: '0 1px 3px rgba(0,0,0,.08)',
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{f.icon}</div>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.3rem' }}>{f.title}</h3>
            <p style={{ fontSize: '0.78rem', color: '#64748b' }}>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}