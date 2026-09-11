# 1. Contrato de autenticação

Este contrato corresponde à feature já implementada no Back-end.

## Endpoints

| Método | Caminho | Acesso | Finalidade |
|---|---|---|---|
| POST | `/api/auth/login` | Público | Autenticar e iniciar sessão |
| POST | `/api/auth/refresh` | Cookie de sessão | Renovar Access Token e rotacionar Refresh Token |
| POST | `/api/auth/logout` | Cookie de sessão | Encerrar sessão |
| POST | `/api/auth/forgot-password` | Público | Solicitar recuperação de senha |
| POST | `/api/auth/reset-password` | Token de redefinição | Definir nova senha |
| GET | `/api/admin/ping` | Administrador | Testar autenticação/autorização; rota temporária |

## Login

```http
POST /api/auth/login
Content-Type: application/json
```

```json
{
  "email": "admin@studioadagio.com.br",
  "password": "senha-segura"
}
```

Resposta `200`:

```json
{
  "user": {
    "id": 1,
    "name": "Administradora",
    "email": "admin@studioadagio.com.br"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiJ9..."
}
```

Além do JSON, a resposta envia `refresh_token` em cookie `HttpOnly`. E-mail ou senha incorretos retornam `401 INVALID_CREDENTIALS`, sem revelar qual campo falhou.

## Refresh

```http
POST /api/auth/refresh
Cookie: refresh_token=...
```

Sem payload. Resposta `200`:

```json
{
  "accessToken": "novo-jwt..."
}
```

O Back-end rotaciona o cookie. O Front-end deve usar `credentials: "include"` ou `withCredentials: true`.

## Logout

```http
POST /api/auth/logout
Cookie: refresh_token=...
```

Resposta `204`, sem corpo. O Back-end invalida a sessão persistida e limpa o cookie.

## Recuperação

```json
POST /api/auth/forgot-password

{
  "email": "admin@studioadagio.com.br"
}
```

Resposta pública sempre genérica:

```json
{
  "message": "Se o e-mail estiver cadastrado, enviaremos as instruções para recuperação da senha."
}
```

## Redefinição

```json
POST /api/auth/reset-password

{
  "token": "token-recebido-no-link",
  "password": "nova-senha-segura"
}
```

Resposta `200`:

```json
{
  "message": "Senha redefinida com sucesso."
}
```

A nova senha deve ter pelo menos 8 caracteres. A redefinição encerra a sessão anterior.
