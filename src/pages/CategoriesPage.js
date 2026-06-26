import { useState, useEffect } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../services/api';

const COLORS = [
  '#6366f1','#f59e0b','#10b981','#3b82f6','#ec4899',
  '#8b5cf6','#14b8a6','#f97316','#06b6d4','#84cc16',
];

export default function CategoriesPage() {
  const [categories,    setCategories]    = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState('');
  const [showModal,     setShowModal]     = useState(false);
  const [editing,       setEditing]       = useState(null);
  const [name,          setName]          = useState('');
  const [saving,        setSaving]        = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function openCreate() { setEditing(null); setName(''); setShowModal(true); }
  function openEdit(cat) { setEditing(cat); setName(cat.name); setShowModal(true); }
  function closeModal() { setShowModal(false); setEditing(null); setName(''); }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await updateCategory(editing.id, name);
        setCategories((prev) => prev.map((c) => (c.id === editing.id ? { ...c, name } : c)));
      } else {
        const created = await createCategory(name);
        setCategories((prev) => [...prev, created]);
      }
      closeModal();
    } catch (e) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    try {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      setDeleteConfirm(null);
    } catch (e) {
      alert(e.message);
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Categorias</h2>
          <p className="page-sub">{categories.length} categoria{categories.length !== 1 ? 's' : ''} disponíve{categories.length !== 1 ? 'is' : 'l'}</p>
        </div>
        <button className="btn-primary" onClick={openCreate}>+ Nova categoria</button>
      </div>

      {loading && <div className="loading-msg">A carregar categorias…</div>}
      {error   && <div className="error-msg">{error}</div>}

      {!loading && categories.length === 0 && (
        <div className="empty-state">
          <span>🏷️</span>
          <p>Ainda não existem categorias. Cria a primeira!</p>
        </div>
      )}

      <div className="cat-grid">
        {categories.map((cat, i) => (
          <div
            key={cat.id}
            className="cat-card"
            style={{ borderTopColor: COLORS[i % COLORS.length] }}
          >
            <div
              className="cat-icon"
              style={{
                background: COLORS[i % COLORS.length] + '22',
                color: COLORS[i % COLORS.length],
              }}
            >
              🏷️
            </div>
            <div className="cat-info">
              <span className="cat-name">{cat.name}</span>
              <span className="cat-id">ID #{cat.id}</span>
            </div>
            <div className="cat-actions">
              <button className="btn-icon" title="Editar" onClick={() => openEdit(cat)}>✏️</button>
              <button className="btn-icon btn-danger" title="Apagar" onClick={() => setDeleteConfirm(cat.id)}>🗑️</button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal criar / editar */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editing ? 'Editar categoria' : 'Nova categoria'}</h3>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="field">
                <label>Nome *</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nome da categoria"
                  required
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={closeModal}>Cancelar</button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? 'A guardar…' : editing ? 'Guardar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmação de apagar */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Apagar categoria</h3>
              <button className="modal-close" onClick={() => setDeleteConfirm(null)}>✕</button>
            </div>
            <p style={{ padding: '1rem 1.5rem', fontSize: '.9rem', color: '#64748b' }}>
              Tens a certeza? Esta ação não pode ser desfeita.
            </p>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setDeleteConfirm(null)}>Cancelar</button>
              <button className="btn-danger-solid" onClick={() => handleDelete(deleteConfirm)}>Apagar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
