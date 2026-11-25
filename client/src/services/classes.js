import { api } from './api.js';

export async function listClasses() {
  const { data } = await api.get('/classes');
  return data;
}

export async function listPublicClasses() {
  const { data } = await api.get('/classes/public');
  return data;
}

export async function createClass({ name, turn, days, capacity }) {
  const { data } = await api.post('/classes', { name, turn, days, capacity });
  return data;
}

export async function updateClass(id, { name, turn, days, capacity }) {
  const { data } = await api.put(`/classes/${id}`, {
    name,
    turn,
    days,
    capacity,
  });
  return data;
}

export async function removeClass(id) {
  await api.delete(`/classes/${id}`);
}
