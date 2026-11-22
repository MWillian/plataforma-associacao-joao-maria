import { api } from './api.js';

// Campos que o backend aceita (o formulário já usa esses mesmos nomes).
function toStudentPayload(form) {
  return {
    name: form.name,
    email: form.email,
    phone: form.phone,
    danceClassIds: form.danceClassIds,
    danceClassId: form.danceClassIds?.[0] ?? form.danceClassId,
    isMinor: form.isMinor,
    guardian: form.guardian,
    guardianEmail: form.guardianEmail,
    allergies: form.allergies,
    medicalConditions: form.medicalConditions,
    medications: form.medications,
    physicalRestrictions: form.physicalRestrictions,
  };
}

export async function listStudents() {
  const { data } = await api.get('/students');
  return data;
}

export async function createStudent(form) {
  const { data } = await api.post('/students', toStudentPayload(form));
  return data;
}

export async function updateStudent(id, form) {
  const { data } = await api.put(`/students/${id}`, toStudentPayload(form));
  return data;
}

// "Excluir" aluno = inativar no backend.
export async function removeStudent(id) {
  const { data } = await api.patch(`/students/${id}/inactivate`);
  return data;
}
