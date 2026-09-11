# 6. Criação e gestão de publicações de produtos

Todas as rotas exigem Access Token de administrador.

## Endpoints

| Método | Caminho | Finalidade |
|---|---|---|
| GET | `/api/admin/produtos` | Listar publicações ativas e inativas |
| POST | `/api/admin/produtos` | Criar publicação e enviar imagem |
| PUT | `/api/admin/produtos/:id` | Atualizar publicação |
| PATCH | `/api/admin/produtos/:id/status` | Publicar ou ocultar |
| DELETE | `/api/admin/produtos/:id` | Remover publicação |

## Criar publicação

```http
POST /api/admin/produtos
Authorization: Bearer <accessToken>
Content-Type: multipart/form-data
```

| Campo | Tipo | Obrigatório | Regra |
|---|---|---:|---|
| `title` | texto | Sim | 3 a 120 caracteres |
| `category` | enum | Sim | `AGRICULTURE` ou `HANDICRAFT` |
| `description` | texto | Sim | 10 a 2000 caracteres |
| `producerName` | texto | Não | Até 120 caracteres |
| `priceInCents` | inteiro | Não | Maior ou igual a zero |
| `whatsappNumber` | texto | Não | Formato internacional, somente dígitos |
| `featured` | boolean | Não | Padrão `false` |
| `active` | boolean | Não | Padrão `true` |
| `image` | arquivo | Sim | JPEG, PNG ou WebP; máximo 5 MB |

Resposta `201`:

```json
{
  "id": 20,
  "title": "Cesto artesanal",
  "category": "HANDICRAFT",
  "description": "Produzido por artesãs da comunidade.",
  "producerName": "Artesãs do Studio Adágio",
  "priceInCents": 4500,
  "imageUrl": "https://storage.example/cesto.webp",
  "whatsappUrl": "https://wa.me/5582999999999",
  "featured": true,
  "active": true,
  "createdAt": "2026-09-11T18:30:00.000Z",
  "updatedAt": "2026-09-11T18:30:00.000Z"
}
```

## Atualização

`PUT /api/admin/produtos/:id` usa `multipart/form-data`. A imagem é opcional na atualização; se enviada, substitui a anterior.

## Status

```json
PATCH /api/admin/produtos/20/status

{
  "active": false
}
```

## Exclusão

`DELETE /api/admin/produtos/:id` retorna `204` e deve remover também a imagem associada no armazenamento. Falha ao remover a imagem deve ser registrada sem expor detalhes internos ao cliente.
