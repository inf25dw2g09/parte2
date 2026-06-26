const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

function getToken() {
  return localStorage.getItem('access_token');
}

async function request(method, path, body = null) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(`${BASE_URL}${path}`, options);

  if (res.status === 401 || res.status === 403) {
    localStorage.removeItem('access_token');
    window.location.href = '/';
    return;
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || data.error_description || data.error || 'Erro na API');
  return data;
}

// ── Auth ──────────────────────────────────────────────
export const login = (username, password) =>
  request('POST', '/oauth/token', {
    grant_type: 'password',
    username,
    password,
    client_id: 'task-manager-app',
    client_secret: 'umaia_super_secret_password',
    scope: 'read write',
  });

export const register = (name, email, password) =>
  request('POST', '/register', { name, email, password });

// ── Users / Me ────────────────────────────────────────
export const getMe = () => request('GET', '/users/me');
export const updateMe = (id, name, email) =>
  request('PUT', `/users/${id}`, { name, email });
export const deleteMe = (id) => request('DELETE', `/users/${id}`);

// ── Tasks ─────────────────────────────────────────────
export const getTasks = () => request('GET', '/tasks');
export const createTask = (title, description, status) =>
  request('POST', '/tasks', { title, description, status });
export const updateTask = (id, title, description, status) =>
  request('PUT', `/tasks/${id}`, { title, description, status });
export const deleteTask = (id) => request('DELETE', `/tasks/${id}`);

// ── Categories ────────────────────────────────────────
export const getCategories = () => request('GET', '/categories');
export const createCategory = (name) => request('POST', '/categories', { name });
export const updateCategory = (id, name) => request('PUT', `/categories/${id}`, { name });
export const deleteCategory = (id) => request('DELETE', `/categories/${id}`);
