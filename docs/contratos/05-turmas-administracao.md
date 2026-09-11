# 5. Criação e gestão de turmas

Todas as rotas exigem Access Token de administrador.

## Endpoints

| Método | Caminho | Finalidade |
|---|---|---|
| GET | `/api/admin/turmas` | Listar turmas ativas e inativas |
| POST | `/api/admin/turmas` | Criar turma |
| PUT | `/api/admin/turmas/:id` | Atualizar turma integralmente |
| PATCH | `/api/admin/turmas/:id/status` | Ativar ou desativar turma |
| DELETE | `/api/admin/turmas/:id` | Remover turma sem vínculos |

## Criar turma

```http
POST /api/admin/turmas
Authorization: Bearer <accessToken>
Content-Type: application/json
```

```json
{
  "name": "Balé infantil — Turma A",
  "modality": "BALLET",
  "description": "Introdução ao balé para crianças.",
  "ageRange": "6 a 9 anos",
  "weekDays": ["TUESDAY", "THURSDAY"],
  "startTime": "14:00",
  "endTime": "15:00",
  "capacity": 20,
  "imageUrl": "https://storage.example/bale.webp",
  "active": true
}
```

Resposta `201`: objeto criado com `id`, `createdAt` e `updatedAt`.

## Validação proposta

- `name`: obrigatório, 3 a 120 caracteres.
- `modality`: enum obrigatório.
- `description`: opcional, até 1000 caracteres.
- `ageRange`: opcional, até 80 caracteres.
- `weekDays`: pelo menos um dia, sem repetição.
- `startTime` e `endTime`: formato `HH:mm`; término posterior ao início.
- `capacity`: inteiro entre 1 e 500.
- `imageUrl`: URL HTTPS opcional.
- `active`: boolean; padrão `true`.

## Atualização

`PUT /api/admin/turmas/:id` recebe o mesmo payload completo da criação e retorna `200`.

## Alteração de status

```json
PATCH /api/admin/turmas/3/status

{
  "active": false
}
```

## Exclusão

`DELETE /api/admin/turmas/:id` retorna `204`. Se houver matrículas ou outros vínculos, retorna `409 CONFLICT`; nesse caso a turma deve ser desativada.
