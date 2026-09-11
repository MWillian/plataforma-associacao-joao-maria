# 4. Listagem pública de turmas

## Endpoints

| Método | Caminho | Finalidade |
|---|---|---|
| GET | `/api/turmas` | Listar turmas ativas |
| GET | `/api/turmas/:id` | Consultar uma turma ativa |

## Listagem

```http
GET /api/turmas?modality=BALLET&page=1&limit=12
```

| Parâmetro | Valores |
|---|---|
| `modality` | `BALLET`, `JAZZ`, `TAP_DANCE` ou `OTHER`; opcional |
| `page` | inteiro positivo; padrão 1 |
| `limit` | 1 a 100; padrão 12 |

Resposta `200`:

```json
{
  "items": [
    {
      "id": 3,
      "name": "Balé infantil — Turma A",
      "modality": "BALLET",
      "description": "Introdução ao balé para crianças.",
      "ageRange": "6 a 9 anos",
      "weekDays": ["TUESDAY", "THURSDAY"],
      "startTime": "14:00",
      "endTime": "15:00",
      "capacity": 20,
      "imageUrl": "https://storage.example/bale.webp"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "totalItems": 1,
    "totalPages": 1
  }
}
```

## Detalhe

```http
GET /api/turmas/3
```

Retorna a mesma estrutura da turma com `200`, ou `404 NOT_FOUND`.

## Regras

- Apenas turmas com `active: true` aparecem publicamente.
- A resposta pública não expõe estudantes, responsáveis ou contatos pessoais.
- A quantidade de vagas ocupadas não será publicada até a regra ser validada.
- Quando não houver resultados, `items` será `[]`.
