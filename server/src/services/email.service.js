import { env } from '../config/env.js';

export async function sendPasswordResetEmail({ email, token }) {
  const resetUrl =
    `${env.frontendUrl}/redefinir-senha?token=${encodeURIComponent(token)}`;

  // Em desenvolvimento, permite testar o fluxo sem depender de um domínio
  // configurado no Resend. O link aparece apenas no terminal do Back-end.
  if (!env.resendApiKey) {
    console.warn(
      '[email] RESEND_API_KEY não configurada. E-mail não enviado.',
    );
    console.info(`[email] Link de recuperação para ${email}: ${resetUrl}`);
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
      subject: 'Recuperação de senha - Studio Adágio',
      html: `
        <p>Recebemos uma solicitação para redefinir sua senha.</p>
        <p><a href="${resetUrl}">Clique aqui para redefinir a senha</a>.</p>
        <p>O link expira em ${env.resetTokenExpiresMinutes} minutos.</p>
        <p>Se você não solicitou a alteração, ignore esta mensagem.</p>
      `,
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Falha ao enviar e-mail de recuperação: ${details}`);
  }
}
