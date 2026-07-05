import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const adminApi = axios.create({
  baseURL: `${API_BASE}/api/admin/success-stories`,
  withCredentials: true,
});

const publicApi = axios.create({
  baseURL: `${API_BASE}/api/success-stories`,
});

// ----- Admin CRUD -----

export async function getAllSuccessStoriesAdmin() {
  const { data } = await adminApi.get('/');
  return data;
}

export async function createSuccessStory(payload) {
  const { data } = await adminApi.post('/', payload);
  return data;
}

export async function updateSuccessStory(id, payload) {
  const { data } = await adminApi.put(`/${id}`, payload);
  return data;
}

export async function deleteSuccessStory(id) {
  await adminApi.delete(`/${id}`);
  return true;
}

// ----- Public read -----

export async function getPublicSuccessStories() {
  const { data } = await publicApi.get('/');
  return data;
}