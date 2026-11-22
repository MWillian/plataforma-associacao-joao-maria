import { env } from '../config/env.js';

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export function isEmailConfigured() {
  return Boolean(env.resendApiKey);
}

export async function sendNoticeEmail({
  email,
  subject,
  message,
}) {
  if (!env.resendApiKey) {
    console.warn(
      '[email] RESEND_API_KEY não configurada. E-mail não enviado.',
    );
    return;
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.resendFrom,
      to: [email],
      subject,
      html: `<p>${escapeHtml(message).replace(/\n/g, '<br />')}</p>`,
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Falha ao enviar aviso por e-mail: ${details}`);
  }
}
