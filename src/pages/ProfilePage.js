import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateMe, deleteMe } from '../services/api';

export default function ProfilePage() {
  const { user, setUser, logout } = useAuth();
  const [form,       setForm]       = useState({ name: user.name, email: user.email });
  const [saving,     setSaving]     = useState(false);
  const [success,    setSuccess]    = useState('');
  const [error,      setError]      = useState('');
  const [showDelete, setShowDelete] = useState(false);

  async function handleUpdate(e) {
    e.preventDefault();
    setSaving(true);
    setSuccess('');
    setError('');
    try {
      const updated = await updateMe(user.id, form.name, form.email);
      setUser({ ...user, ...updated, name: form.name, email: form.email });
      setSuccess('Perfil atualizado com sucesso!');
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    try {
      await deleteMe(user.id);
      logout();
    } catch (e) {
      alert(e.message);
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>O meu perfil</h2>
          <p className="page-sub">Gere os teus dados pessoais</p>
        </div>
      </div>

      <div className="profile-layout">
        {/* Cartão avatar */}
        <div className="profile-avatar-card">
          <div className="big-avatar">{user.name?.[0]?.toUpperCase()}</div>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
          <div className="profile-badge">ID #{user.id}</div>
        </div>

        {/* Formulário de edição */}
        <div className="profile-form-card">
          <h4>Editar informações</h4>
          <form onSubmit={handleUpdate} className="modal-form" style={{ padding: 0 }}>
            <div className="field">
              <label>Nome</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="field">
              <label>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            {success && <div className="success-msg">{success}</div>}
            {error   && <div className="error-msg">{error}</div>}

            <div className="modal-footer" style={{ padding: 0, marginTop: '1rem', borderTop: 'none' }}>
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? 'A guardar…' : 'Guardar alterações'}
              </button>
            </div>
          </form>

          <hr className="divider" />

          <div className="danger-zone">
            <h4>Zona de perigo</h4>
            <p>Ao apagar a conta, todos os teus dados e tarefas serão eliminados permanentemente.</p>
            <button className="btn-danger-solid" onClick={() => setShowDelete(true)}>
              Apagar conta
            </button>
          </div>
        </div>
      </div>

      {/* Confirmação de apagar conta */}
      {showDelete && (
        <div className="modal-overlay" onClick={() => setShowDelete(false)}>
          <div className="modal modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Apagar conta</h3>
              <button className="modal-close" onClick={() => setShowDelete(false)}>✕</button>
            </div>
            <p style={{ padding: '1rem 1.5rem', fontSize: '.9rem', color: '#64748b' }}>
              Esta ação é <strong>irreversível</strong>. Todas as tuas tarefas serão apagadas. Confirmas?
            </p>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowDelete(false)}>Cancelar</button>
              <button className="btn-danger-solid" onClick={handleDelete}>Apagar conta</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
