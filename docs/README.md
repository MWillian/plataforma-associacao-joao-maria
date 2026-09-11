# Contratos da API — Studio Adágio

Base URL local: `http://localhost:3001/api`

Este diretório define o acordo entre Front-end e Back-end para os sete itens do backlog. Os arquivos em `contratos/` explicam cada fluxo de forma mais direta.

## Contratos

1. [Autenticação](contratos/01-autenticacao.md)
2. [Listagem da Home](contratos/02-home.md)
3. [Produtos de agricultura e artesanato](contratos/03-produtos.md)
4. [Listagem de turmas](contratos/04-turmas-listagem.md)
5. [Criação e gestão de turmas](contratos/05-turmas-administracao.md)
6. [Criação e gestão de publicações](contratos/06-produtos-administracao.md)
7. [Formulários e envio de e-mail](contratos/07-email.md)

## Convenções

- JSON em `camelCase`.
- Datas e horários completos em ISO 8601 UTC, por exemplo `2026-09-11T18:30:00.000Z`.
- IDs inteiros positivos.
- Endpoints públicos de leitura não exigem token.
- Endpoints em `/admin` exigem `Authorization: Bearer <accessToken>` e autorização administrativa.
- O Refresh Token não vai no JSON: ele fica em cookie `HttpOnly`.
- Paginação usa `page` (iniciando em 1) e `limit` (máximo 100).
- Exclusão retorna `204 No Content`.
- Erros seguem o mesmo formato:

```json
{
  "error": "VALIDATION_ERROR",
  "message": "Dados inválidos.",
  "fields": {
    "nome": "Nome é obrigatório."
  }
}
```

## Códigos de erro comuns

| HTTP | Código | Uso |
|---|---|---|
| 400 | `VALIDATION_ERROR` | Payload ou parâmetro inválido |
| 401 | `UNAUTHORIZED` | Access Token ausente, inválido ou expirado |
| 401 | `SESSION_EXPIRED` | Refresh Token ausente, inválido ou expirado |
| 403 | `FORBIDDEN` | Usuário autenticado sem permissão administrativa |
| 404 | `NOT_FOUND` | Recurso inexistente |
| 409 | `CONFLICT` | Conflito com um recurso existente |
| 413 | `FILE_TOO_LARGE` | Imagem acima do limite |
| 415 | `UNSUPPORTED_MEDIA_TYPE` | Formato de arquivo não aceito |
| 429 | `RATE_LIMITED` | Muitas solicitações |
| 500 | `INTERNAL_SERVER_ERROR` | Erro interno não previsto |

## Fonte dos contratos

Os contratos consideram o levantamento de requisitos, o planejamento do projeto, o backlog e a feature de autenticação já implementada. As regras ainda dependentes da Associação estão registradas em [decisoes-pendentes.md](decisoes-pendentes.md).
