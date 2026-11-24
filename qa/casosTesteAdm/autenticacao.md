# Casos de Teste — Autenticação

**Data da execução:** 24/11/2026  
**Ambiente:** Local (macOS) — front React + Vite em `localhost:5173`, API Express em `localhost:3001`, PostgreSQL via Docker  
**Versão testada:** branch `main` (commit `026f9b6`, PR #52)  
**Navegador:** Chromium (navegador integrado do app Claude)  
**Tipo de execução:** E2E pela interface, com conferência das respostas da API  
**Executor:** Claude (assistente de QA)  
**Massa de dados:** registros criados com o prefixo `[E2E]` e removidos ao final

**Resumo:** 5 casos executados — 3 aprovados, 2 reprovados, 0 não aplicáveis.

| ID | Cenário | Passos | Resultado esperado | Prioridade | Resultado obtido | Status |
|---|---|---|---|---|---|---|
| AUT-001 | Login válido | Informar credenciais válidas e acessar | Usuário acessa o sistema | Alta | Credenciais válidas retornam 200 e o token é salvo, mas a tela permanece no formulário de login. O acesso só acontece no 2º clique em "Entrar no painel" (reproduzido 3 vezes). Ver BUG-ADM-001. | ❌ Reprovado |
| AUT-002 | E-mail inválido | Informar e-mail em formato inválido | Sistema apresenta validação | Média | O navegador bloqueia o envio ("Inclua um @ no endereço de e-mail") e nenhuma requisição é feita. | ✅ Aprovado |
| AUT-003 | Senha incorreta | Informar senha incorreta | Sistema impede o acesso | Alta | O acesso é impedido (API retorna 401 "E-mail ou senha inválidos."), mas a tela mostra "Sessão expirada. Faça login novamente.". Ver BUG-ADM-002. | ❌ Reprovado |
| AUT-004 | Campos vazios | Tentar acessar sem preencher os campos | Sistema sinaliza os campos obrigatórios | Alta | Campos obrigatórios sinalizados ("Preencha este campo."); nenhuma requisição é feita. | ✅ Aprovado |
| AUT-005 | Logout | Acessar o sistema e encerrar a sessão | Usuário é desconectado | Alta | "Sair" remove o token e volta para `/admin/login`. Rota protegida acessada depois do logout redireciona para o login. | ✅ Aprovado |

## Defeitos encontrados

| ID do defeito | Caso relacionado | Motivo da falha | Severidade | Status |
|---|---|---|---|---|
| BUG-ADM-001 | AUT-001 | Login exige dois cliques. Em `client/src/App.jsx`, `handleLogin` chama `setIsAuthenticated(true)` e logo em seguida `navigate('adm-dashboard')`; o `navigate` ainda lê o valor antigo de `isAuthenticated` (`false`) e redireciona de volta para `adm-login`. | Alta | Aberto |
| BUG-ADM-002 | AUT-003 | Mensagem errada para senha incorreta. O interceptador de `client/src/services/api.js` tenta `/auth/refresh` em qualquer resposta 401, inclusive na do próprio `/auth/login`; o erro do refresh ("Sessão expirada") substitui a mensagem correta da API. | Média | Aberto |

## Testes exploratórios

- Sessão persiste após atualizar a página (F5) em `/admin/painel` — ✅.
- Botão "voltar" do navegador depois do logout mostra o formulário de login (seguro), mas a URL fica `/admin/painel` e o título da aba "Painel administrativo" — inconsistência visual.
- Totais do painel principal conferem com os registros ativos (turmas, alunos, avisos, notícias e produtos) — ✅.
