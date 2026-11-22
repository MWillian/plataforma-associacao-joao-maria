import { api } from './api.js';

export async function listClasses() {
  const { data } = await api.get('/classes');
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

// "Excluir" turma = inativar no backend (os alunos dela também saem da lista).
export async function removeClass(id) {
  const { data } = await api.patch(`/classes/${id}/inactivate`);
  return data;
}
