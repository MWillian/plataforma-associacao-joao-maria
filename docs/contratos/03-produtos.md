# 3. Produtos de agricultura e artesanato

## Endpoints públicos

| Método | Caminho | Finalidade |
|---|---|---|
| GET | `/api/produtos` | Listar publicações ativas |
| GET | `/api/produtos/:id` | Obter uma publicação ativa |

## Listagem

```http
GET /api/produtos?category=AGRICULTURE&page=1&limit=12&search=mel
```

| Parâmetro | Valores |
|---|---|
| `category` | `AGRICULTURE` ou `HANDICRAFT`; opcional |
| `page` | inteiro positivo; padrão 1 |
| `limit` | 1 a 100; padrão 12 |
| `search` | busca opcional por título e descrição |

Resposta `200`:

```json
{
  "items": [
    {
      "id": 20,
      "title": "Mel artesanal",
      "category": "AGRICULTURE",
      "description": "Produção local.",
      "imageUrl": "https://storage.example/mel.webp",
      "priceInCents": null,
      "producerName": "Produtores da comunidade",
      "whatsappUrl": "https://wa.me/5582999999999",
      "featured": false,
      "createdAt": "2026-09-11T18:30:00.000Z"
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
GET /api/produtos/20
```

Retorna `200` com o objeto da publicação ou `404 NOT_FOUND`. Publicações inativas não ficam acessíveis publicamente.

## Regras

- `priceInCents` é opcional; não representa venda pela plataforma.
- Não há estoque, carrinho ou pagamento.
- `whatsappUrl` direciona a negociação para fora da plataforma.
- `imageUrl` deve usar HTTPS em produção.
