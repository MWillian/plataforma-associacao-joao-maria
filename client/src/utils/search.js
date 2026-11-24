// Normaliza texto para busca: ignora acentos, maiúsculas e espaços nas pontas.
export function normalizeText(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

// true se a busca estiver vazia ou aparecer em algum dos campos.
// Campos nulos (ex.: produto sem descrição) são ignorados sem erro.
export function matchesSearch(query, ...fields) {
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) return true;
  return fields.some((field) => normalizeText(field).includes(normalizedQuery));
}
