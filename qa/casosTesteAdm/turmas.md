# Casos de Teste — Turmas

**Data da execução:** 24/11/2026  
**Ambiente:** Local (macOS) — front React + Vite em `localhost:5173`, API Express em `localhost:3001`, PostgreSQL via Docker  
**Versão testada:** branch `main` (commit `026f9b6`, PR #52)  
**Navegador:** Chromium (navegador integrado do app Claude)  
**Tipo de execução:** E2E pela interface, com conferência das respostas da API  
**Executor:** Claude (assistente de QA)  
**Massa de dados:** registros criados com o prefixo `[E2E]` e removidos ao final

**Resumo:** 12 casos executados — 11 aprovados, 1 reprovados, 0 não aplicáveis.

| ID | Cenário | Passos | Resultado esperado | Prioridade | Resultado obtido | Status |
|---|---|---|---|---|---|---|
| TUR-001 | Cadastrar turma válida | Informar nome, turno e dias e salvar | Turma cadastrada com sucesso | Alta | Turma criada (POST 201) e exibida na listagem. Não há mensagem de sucesso: o formulário apenas fecha. | ✅ Aprovado |
| TUR-002 | Cadastrar sem nome | Deixar o nome vazio e salvar | Sistema sinaliza campo obrigatório | Alta | "Preencha este campo." no nome; nenhuma requisição é feita. | ✅ Aprovado |
| TUR-003 | Cadastrar sem turno | Não selecionar turno e salvar | Sistema aplica a validação do campo | Média | "Selecione um item da lista." no turno; nenhuma requisição é feita. | ✅ Aprovado |
| TUR-004 | Cadastrar sem dias | Não selecionar dias e salvar | Sistema aplica a validação definida | Média | A dica fica vermelha: "Selecione pelo menos um dia da semana."; nenhuma requisição é feita. | ✅ Aprovado |
| TUR-005 | Selecionar vários dias | Marcar mais de um dia da semana | Sistema registra os dias selecionados | Média | Segunda, quarta e sexta registradas e exibidas na listagem. | ✅ Aprovado |
| TUR-006 | Editar turma | Alterar os dados e salvar | Turma atualizada com sucesso | Alta | Formulário vem preenchido com os dados atuais; alterações salvas (PUT 200) e refletidas na lista. | ✅ Aprovado |
| TUR-007 | Consultar turma | Pesquisar turma cadastrada | Sistema apresenta o registro correspondente | Média | A tela não tem campo de busca; o registro foi localizado na listagem. | ✅ Aprovado |
| TUR-008 | Cadastrar turma duplicada | Informar nome já existente | Sistema aplica a regra de duplicidade | Média | O sistema aceita duas turmas com o mesmo nome. Não há regra de duplicidade no front nem no backend (`class.service.js`). Ver BUG-ADM-003. | ❌ Reprovado |
| TUR-009 | Excluir turma | Selecionar turma e confirmar exclusão | Registro excluído ou inativado | Alta | Modal de confirmação; a turma é inativada (PATCH `/inactivate` 200) e sai da lista. | ✅ Aprovado |
| TUR-010 | Cancelar exclusão | Iniciar exclusão e cancelar | Turma permanece cadastrada | Média | "Cancelar" fecha o modal sem requisição; a turma permanece. | ✅ Aprovado |
| TUR-011 | Verificar persistência | Cadastrar turma e atualizar a página | Registro permanece disponível | Alta | Turmas permanecem após F5. | ✅ Aprovado |
| TUR-012 | Excluir turma vinculada | Tentar excluir turma associada a outros registros | Sistema respeita as regras de relacionamento | Alta | A turma com 4 alunos é inativada; os alunos permanecem cadastrados como "Sem turma". Ressalva: o modal não avisa que há alunos matriculados. | ✅ Aprovado |

## Defeitos encontrados

| ID do defeito | Caso relacionado | Motivo da falha | Severidade | Status |
|---|---|---|---|---|
| BUG-ADM-003 | TUR-008 | Turmas com nome duplicado são aceitas. Definir a regra (bloquear nome igual, ignorando maiúsculas e espaços?) e implementá-la no backend. | Média | Aberto |
| BUG-ADM-006 | Exploratório | No **cadastro** de turma, erros da API não aparecem na tela. Ex.: nome só com espaços → API 400 "O nome da turma é obrigatório.", e a tela não mostra nada. Na **edição** o erro é exibido corretamente junto ao campo. | Média | Aberto |

## Testes exploratórios

- Capacidade 0, -5 e 2,5 bloqueadas pelo navegador (mínimo 1, número inteiro) — ✅.
- Capacidade 99999999999 passa pelo front e é recusada pela API (400) sem mensagem na tela (mesma causa do BUG-ADM-006).
- Editar a capacidade para menos que o número de alunos matriculados → 409 com mensagem no campo: "A capacidade não pode ser menor que os alunos matriculados." — ✅.
- A capacidade não é exibida na listagem de turmas.
- O modal diz "Essa ação não poderá ser desfeita", mas a exclusão apenas inativa a turma.
