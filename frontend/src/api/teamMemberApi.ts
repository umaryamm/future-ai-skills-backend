import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const adminApi = axios.create({
  baseURL: `${API_BASE}/api/admin/team-members`,
  withCredentials: true,
});

const publicApi = axios.create({
  baseURL: `${API_BASE}/api/team-members`,
});

// ----- Admin CRUD -----

export async function getAllTeamMembersAdmin() {
  const { data } = await adminApi.get('/');
  return data;
}

export async function createTeamMember(payload) {
  const { data } = await adminApi.post('/', payload);
  return data;
}

export async function updateTeamMember(id, payload) {
  const { data } = await adminApi.put(`/${id}`, payload);
  return data;
}

export async function deleteTeamMember(id) {
  await adminApi.delete(`/${id}`);
  return true;
}

// ----- Public read -----

export async function getPublicTeamMembers() {
  const { data } = await publicApi.get('/');
  return data;
}