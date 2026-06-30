import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

// Instância axios com a URL base da API
const api = axios.create({ baseURL: BASE_URL });

// Interceptor — injeta o token Bearer em todos os pedidos automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  return config;
});

// Interceptor — se a API devolver 401/403, limpa a sessão e redireciona
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 || err.response?.status === 403) {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ── Auth ──────────────────────────────────────────────
export const login = (username, password) =>
  api.post('/oauth/token', {
    grant_type:    'password',
    username,
    password,
    client_id:     'task-manager-app',
    client_secret: 'umaia_super_secret_password',
    scope:         'read write',
  }).then((r) => r.data);

export const register = (name, email, password) =>
  api.post('/register', { name, email, password }).then((r) => r.data);

// ── Users / Me ────────────────────────────────────────
export const getMe = () =>
  api.get('/users/me').then((r) => r.data);

export const updateMe = (id, name, email) =>
  api.put(`/users/${id}`, { name, email }).then((r) => r.data);

export const deleteMe = (id) =>
  api.delete(`/users/${id}`).then((r) => r.data);

// ── Tasks ─────────────────────────────────────────────
export const getTasks = () =>
  api.get('/tasks').then((r) => r.data);

export const createTask = (title, description, status) =>
  api.post('/tasks', { title, description, status }).then((r) => r.data);

export const updateTask = (id, title, description, status) =>
  api.put(`/tasks/${id}`, { title, description, status }).then((r) => r.data);

export const deleteTask = (id) =>
  api.delete(`/tasks/${id}`).then((r) => r.data);

// ── Categories ────────────────────────────────────────
export const getCategories = () =>
  api.get('/categories').then((r) => r.data);

export const createCategory = (name) =>
  api.post('/categories', { name }).then((r) => r.data);

export const updateCategory = (id, name) =>
  api.put(`/categories/${id}`, { name }).then((r) => r.data);

export const deleteCategory = (id) =>
  api.delete(`/categories/${id}`).then((r) => r.data);