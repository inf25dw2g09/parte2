import { useState, useEffect } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from '../services/api';

const STATUS_OPTIONS = ['pendente', 'em progresso', 'feito'];

const STATUS_COLORS = {
  'pendente':     '#f59e0b',
  'em progresso': '#3b82f6',
  'feito':        '#10b981',
};

const EMPTY_FORM = { title: '', description: '', status: 'pendente' };

export default function TasksPage() {
  const [tasks,         setTasks]         = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState('');
  const [showModal,     setShowModal]     = useState(false);
  const [editing,       setEditing]       = useState(null);
  const [form,          setForm]          = useState(EMPTY_FORM);
  const [saving,        setSaving]        = useState(false);
  const [filter,        setFilter]        = useState('todas');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  }

  function openEdit(task) {
    setEditing(task);
    setForm({ title: task.title, description: task.description || '', status: task.status });
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditing(null);
    setForm(EMPTY_FORM);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await updateTask(editing.id, form.title, form.description, form.status);
        setTasks((prev) =>
          prev.map((t) => (t.id === editing.id ? { ...t, ...form } : t))
        );
      } else {
        const created = await createTask(form.title, form.description, form.status);
        setTasks((prev) => [
          ...prev,
          { id: created.id, title: form.title, description: form.description, status: form.status },
        ]);
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
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      setDeleteConfirm(null);
    } catch (e) {
      alert(e.message);
    }
  }

  const filtered = filter === 'todas' ? tasks : tasks.filter((t) => t.status === filter);

  const counts = {
    'pendente':     tasks.filter((t) => t.status === 'pendente').length,
    'em progresso': tasks.filter((t) => t.status === 'em progresso').length,
    'feito':        tasks.filter((t) => t.status === 'feito').length,
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>As minhas tarefas</h2>
          <p className="page-sub">{tasks.length} tarefa{tasks.length !== 1 ? 's' : ''} no total</p>
        </div>
        <button className="btn-primary" onClick={openCreate}>+ Nova tarefa</button>
      </div>

      {/* Estatísticas */}
      <div className="stats-row">
        {Object.entries(counts).map(([s, n]) => (
          <div key={s} className="stat-card" style={{ borderLeftColor: STATUS_COLORS[s] }}>
            <span className="stat-num">{n}</span>
            <span className="stat-label">{s}</span>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="filter-row">
        {['todas', ...STATUS_OPTIONS].map((f) => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {loading && <div className="loading-msg">A carregar tarefas…</div>}
      {error   && <div className="error-msg">{error}</div>}

      {!loading && filtered.length === 0 && (
        <div className="empty-state">
          <span>📭</span>
          <p>
            {filter === 'todas'
              ? 'Ainda não tens tarefas. Cria a primeira!'
              : `Nenhuma tarefa com estado "${filter}".`}
          </p>
        </div>
      )}

      {/* Grid de tarefas */}
      <div className="task-grid">
        {filtered.map((task) => (
          <div key={task.id} className="task-card">
            <div className="task-card-top">
              <span
                className="status-badge"
                style={{
                  background: STATUS_COLORS[task.status] + '22',
                  color: STATUS_COLORS[task.status],
                }}
              >
                {task.status}
              </span>
              <div className="task-actions">
                <button className="btn-icon" title="Editar" onClick={() => openEdit(task)}>✏️</button>
                <button className="btn-icon btn-danger" title="Apagar" onClick={() => setDeleteConfirm(task.id)}>🗑️</button>
              </div>
            </div>
            <h3 className="task-title">{task.title}</h3>
            {task.description && <p className="task-desc">{task.description}</p>}
            <div className="task-id">#{task.id}</div>
          </div>
        ))}
      </div>

      {/* Modal criar / editar */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editing ? 'Editar tarefa' : 'Nova tarefa'}</h3>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="field">
                <label>Título *</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Título da tarefa"
                  required
                />
              </div>
              <div className="field">
                <label>Descrição</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Descrição opcional"
                  rows={3}
                />
              </div>
              <div className="field">
                <label>Estado *</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
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
              <h3>Apagar tarefa</h3>
              <button className="modal-close" onClick={() => setDeleteConfirm(null)}>✕</button>
            </div>
            <p style={{ padding: '1rem 1.5rem', fontSize: '.9rem', color: '#64748b' }}>
              Tens a certeza que queres apagar esta tarefa? Esta ação não pode ser desfeita.
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
