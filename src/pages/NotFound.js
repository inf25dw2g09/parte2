import { Link } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

export default function NotFound() {
  return (
    <div className="empty-state" style={{ minHeight: '60vh', justifyContent: 'center' }}>
      <span style={{ fontSize: '4rem' }}>🔍</span>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>Página não encontrada</h2>
      <p>O endereço que procuras não existe.</p>
      <Link to={ROUTES.HOME} className="btn-primary" style={{ textDecoration: 'none', marginTop: '0.5rem' }}>
        Voltar ao início
      </Link>
    </div>
  );
}