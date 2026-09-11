# 7. Formulários e envio de e-mail

Este contrato cobre os dois fluxos coerentes com o projeto: contato público e comunicados administrativos para turmas.

## Formulário público de contato

```http
POST /api/contato
Content-Type: application/json
```

```json
{
  "name": "Maria Silva",
  "email": "maria@example.com",
  "subject": "Informações sobre as turmas",
  "message": "Gostaria de saber como funciona a inscrição."
}
```

Validação:

- `name`: 2 a 120 caracteres;
- `email`: endereço válido, até 254 caracteres;
- `subject`: 3 a 150 caracteres;
- `message`: 10 a 3000 caracteres.

Resposta `202`:

```json
{
  "message": "Mensagem recebida e encaminhada."
}
```

Não retornar chave do provedor nem detalhes do envio. Esse endpoint deve receber rate limiting e proteção antispam.

## Comunicado administrativo

```http
POST /api/admin/comunicados
Authorization: Bearer <accessToken>
Content-Type: application/json
```

```json
{
  "classIds": [3, 4],
  "subject": "Aviso sobre a aula",
  "message": "A aula de sexta-feira começará às 15h.",
  "replyTo": "contato@studioadagio.com.br"
}
```

Validação:

- `classIds`: pelo menos uma turma existente;
- `subject`: 3 a 150 caracteres;
- `message`: 10 a 5000 caracteres;
- `replyTo`: e-mail opcional válido.

Resposta `202`:

```json
{
  "message": "Comunicado colocado na fila de envio.",
  "communicationId": 8,
  "recipientCount": 34
}
```

O servidor resolve os destinatários a partir dos responsáveis vinculados às turmas. O Front-end não envia uma lista arbitrária de e-mails.

## Consulta do resultado

```http
GET /api/admin/comunicados/8
Authorization: Bearer <accessToken>
```

Resposta `200`:

```json
{
  "id": 8,
  "status": "SENT",
  "recipientCount": 34,
  "sentCount": 33,
  "failedCount": 1,
  "createdAt": "2026-09-11T18:30:00.000Z",
  "finishedAt": "2026-09-11T18:31:12.000Z"
}
```

Status possíveis: `PENDING`, `PROCESSING`, `SENT`, `PARTIAL_FAILURE`, `FAILED`.
