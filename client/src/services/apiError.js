// Transforma um erro do axios em uma mensagem legível para o usuário.
// O backend responde { error, message, fields? } — `fields` traz o motivo
// de cada campo inválido (ex.: { name: 'O nome do aluno é obrigatório.' }).
export function getApiErrorMessage(
  error,
  fallback = 'Não foi possível concluir a operação. Tente novamente.'
) {
  if (!error?.response) {
    return 'Sem conexão com o servidor. Verifique sua internet e tente novamente.';
  }

  const { fields, message } = error.response.data ?? {};
  const fieldMessages = fields ? Object.values(fields) : [];

  if (fieldMessages.length > 0) {
    return fieldMessages.join(' ');
  }

  if (typeof message === 'string' && message) {
    return message;
  }

  return fallback;
}
