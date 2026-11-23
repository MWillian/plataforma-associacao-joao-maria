import { readFile } from 'node:fs/promises';
import { Resend } from 'resend';
import { env } from '../config/env.js';

const LOGO_CONTENT_ID = 'associacao-joao-maria-logo';
const LOGO_FILE_URL = new URL(
  '../../../client/public/logo-joao-maria.png',
  import.meta.url,
);

let logoContentPromise;

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function renderNoticeEmail({ subject, message }) {
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message).replace(/\r\n|\r|\n/g, '<br />');

  return `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${safeSubject}</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f1f5f9;color:#142d59;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f1f5f9;padding:32px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="width:100%;max-width:600px;border-collapse:separate;border-spacing:0;background-color:#ffffff;border-radius:12px;overflow:hidden;">
            <tr>
              <td align="center" style="padding:24px;background-color:#0b1b3d;">
                <img
                  src="cid:${LOGO_CONTENT_ID}"
                  width="160"
                  alt="Associação Comunitária João Maria"
                  style="display:block;width:160px;max-width:100%;height:auto;border:0;"
                >
              </td>
            </tr>
            <tr>
              <td style="padding:32px 28px;">
                <p style="margin:0 0 10px;color:#3570fc;font-size:12px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;">
                  Aviso da associação
                </p>
                <h1 style="margin:0 0 20px;color:#142d59;font-size:24px;line-height:1.3;">
                  ${safeSubject}
                </h1>
                <p style="margin:0;color:#526581;font-size:16px;line-height:1.7;">
                  ${safeMessage}
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 28px;background-color:#f7f9fc;color:#7183a3;font-size:12px;line-height:1.5;text-align:center;">
                Associação Comunitária João Maria · Coruripe, AL
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

async function getLogoContent() {
  if (!logoContentPromise) {
    logoContentPromise = readFile(LOGO_FILE_URL);
  }

  return logoContentPromise;
}

export function createEmailService({ apiKey, from, client } = {}) {
  const resend = client ?? (apiKey ? new Resend(apiKey) : null);

  function isEmailConfigured() {
    return Boolean(apiKey && from && resend);
  }

  async function sendNoticeEmail({ email, subject, message }) {
    if (!isEmailConfigured()) {
      throw new Error(
        'RESEND_API_KEY e RESEND_FROM devem ser configuradas.',
      );
    }

    const logoContent = await getLogoContent();
    const { data, error } = await resend.emails.send({
      from,
      to: email,
      subject,
      html: renderNoticeEmail({ subject, message }),
      text: `${subject}\n\n${message}\n\nAssociação Comunitária João Maria · Coruripe, AL`,
      attachments: [
        {
          filename: 'logo-joao-maria.png',
          content: logoContent,
          contentId: LOGO_CONTENT_ID,
        },
      ],
    });

    if (error) {
      throw new Error(
        `Falha ao enviar aviso por e-mail: ${error.message || 'erro informado pelo Resend.'}`,
      );
    }

    if (!data?.id) {
      throw new Error('O Resend não confirmou o envio do e-mail.');
    }

    return data;
  }

  return {
    isEmailConfigured,
    sendNoticeEmail,
  };
}

const emailService = createEmailService({
  apiKey: env.resendApiKey,
  from: env.resendFrom,
});

export const isEmailConfigured = emailService.isEmailConfigured;
export const sendNoticeEmail = emailService.sendNoticeEmail;
