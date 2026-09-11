# 2. Listagem de produtos e turmas na Home

## Endpoint

```http
GET /api/home?productLimit=6&classLimit=6
```

Endpoint público e agregado para evitar várias requisições na abertura da Home.

## Parâmetros

| Parâmetro | Padrão | Limite | Descrição |
|---|---:|---:|---|
| `productLimit` | 6 | 12 | Quantidade máxima de produtos em destaque |
| `classLimit` | 6 | 12 | Quantidade máxima de turmas em destaque |

## Resposta `200`

```json
{
  "products": [
    {
      "id": 15,
      "title": "Cesto artesanal",
      "category": "HANDICRAFT",
      "description": "Produzido por artesãs da comunidade.",
      "imageUrl": "https://storage.example/cesto.webp",
      "priceInCents": 4500,
      "whatsappUrl": "https://wa.me/5582999999999",
      "featured": true
    }
  ],
  "classes": [
    {
      "id": 3,
      "name": "Balé infantil — Turma A",
      "modality": "BALLET",
      "ageRange": "6 a 9 anos",
      "weekDays": ["TUESDAY", "THURSDAY"],
      "startTime": "14:00",
      "endTime": "15:00",
      "imageUrl": "https://storage.example/bale.webp"
    }
  ]
}
```

## Regras

- Retornar apenas publicações ativas e turmas ativas.
- Ordenar destaques por `updatedAt` decrescente.
- Produtos devem ter `featured: true` para entrar na Home.
- Não retornar campos administrativos ou informações pessoais.
- Quando não houver resultados, retornar arrays vazios, nunca `null`.
