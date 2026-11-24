# Casos de Teste — Notícias

**Data da execução:** 24/11/2026  
**Ambiente:** Local (macOS) — front React + Vite em `localhost:5173`, API Express em `localhost:3001`, PostgreSQL via Docker  
**Versão testada:** branch `main` (commit `026f9b6`, PR #52)  
**Navegador:** Chromium (navegador integrado do app Claude)  
**Tipo de execução:** E2E pela interface, com conferência das respostas da API  
**Executor:** Claude (assistente de QA)  
**Massa de dados:** registros criados com o prefixo `[E2E]` e removidos ao final

**Resumo:** 11 casos executados — 10 aprovados, 1 reprovados, 0 não aplicáveis.

| ID | Cenário | Passos | Resultado esperado | Prioridade | Resultado obtido | Status | Resultado obtido | Status |
|---|---|---|---|---|---|---|---|---|
| NOT-001 | Cadastrar notícia válida | Informar título, descrição e salvar | Notícia cadastrada com sucesso | Alta | Notícia salva (POST 201) com "Notícia publicada com sucesso.". | ✅ Aprovado | Notícia salva (POST 201) com "Notícia publicada com sucesso.". | ✅ Aprovado |
| NOT-002 | Cadastrar sem título | Deixar o título vazio e salvar | Sistema sinaliza campo obrigatório | Alta | "Preencha este campo." no título; nenhuma requisição é feita. | ✅ Aprovado | "Preencha este campo." no título; nenhuma requisição é feita. | ✅ Aprovado |
| NOT-003 | Cadastrar sem descrição | Deixar a descrição vazia e salvar | Sistema aplica a validação do campo | Média | A descrição é opcional: a notícia é salva sem descrição (POST 201). | ✅ Aprovado | A descrição é opcional: a notícia é salva sem descrição (POST 201). | ✅ Aprovado |
| NOT-004 | Cadastrar notícia com imagem | Preencher os campos e anexar imagem válida | Notícia cadastrada com imagem | Média | Imagem PNG anexada e salva junto com a notícia. | ✅ Aprovado | Imagem PNG anexada e salva junto com a notícia. | ✅ Aprovado |
| NOT-005 | Anexar arquivo inválido | Selecionar arquivo em formato não permitido | Sistema rejeita o arquivo | Média | Um arquivo .txt é ignorado (não entra na lista de fotos). Ressalva: nenhuma mensagem é exibida (em produtos aparece "Selecione pelo menos uma imagem válida."). | ✅ Aprovado | Um arquivo .txt é ignorado (não entra na lista de fotos). Ressalva: nenhuma mensagem é exibida (em produtos aparece "Selecione pelo menos uma imagem válida."). | ✅ Aprovado |
| NOT-006 | Editar notícia | Alterar título ou descrição e salvar | Notícia atualizada com sucesso | Alta | Título e área de exibição alterados (PUT 200) com "Notícia atualizada com sucesso.". | ✅ Aprovado | Título e área de exibição alterados (PUT 200) com "Notícia atualizada com sucesso.". | ✅ Aprovado |
| NOT-007 | Consultar notícia | Pesquisar notícia cadastrada | Sistema apresenta o registro correspondente | Média | A tela não tem campo de busca; o registro foi localizado na listagem (com a área de exibição). | ✅ Aprovado | A tela não tem campo de busca; o registro foi localizado na listagem (com a área de exibição). | ✅ Aprovado |
| NOT-008 | Excluir notícia | Selecionar notícia e confirmar exclusão | Registro excluído ou inativado | Alta | Modal de confirmação; a notícia é despublicada (PATCH `/unpublish` 200) e sai da lista. | ✅ Aprovado | Modal de confirmação; a notícia é despublicada (PATCH `/unpublish` 200) e sai da lista. | ✅ Aprovado |
| NOT-009 | Cancelar exclusão | Iniciar exclusão e cancelar | Notícia permanece cadastrada | Média | "Cancelar" fecha o modal sem requisição; a notícia permanece. | ✅ Aprovado | "Cancelar" fecha o modal sem requisição; a notícia permanece. | ✅ Aprovado |
| NOT-010 | Verificar persistência | Cadastrar notícia e atualizar a página | Registro permanece disponível | Alta | Notícias permanecem após F5. | ✅ Aprovado | Notícias permanecem após F5. | ✅ Aprovado |
| NOT-011 | Verificar imagem cadastrada | Consultar notícia com imagem | Imagem é apresentada corretamente | Média | A imagem aparece no card do mural público, mas a página de detalhe da notícia mostra apenas o espaço "Imagem Ilustrativa: <título>" e nunca a foto enviada. A listagem do admin também não mostra miniaturas. Ver BUG-ADM-005. | ❌ Reprovado | A imagem aparece no card do mural público, mas a página de detalhe da notícia mostra apenas o espaço "Imagem Ilustrativa: <título>" e nunca a foto enviada. A listagem do admin também não mostra miniaturas. Ver BUG-ADM-005. | ❌ Reprovado |

## Defeitos encontrados

| ID do defeito | Caso relacionado | Motivo da falha | Severidade | Status |
|---|---|---|---|---|
| BUG-ADM-005 | NOT-011 | `client/src/pages/details/NewsDetailPage.jsx` não usa o campo `images` da notícia; renderiza sempre o texto de placeholder (`imagePlaceholder` ou "Imagem Ilustrativa: …"). | Média | Corrigido (aguarda reteste) |
| BUG-ADM-009 | Exploratório (NOT-005) | Arquivo de formato inválido é descartado sem nenhuma mensagem ao usuário. | Baixa | Corrigido (aguarda reteste) |

## Testes exploratórios

- Cadastro sem área de exibição é bloqueado ("Selecione um item da lista.") — ✅.
- O modal diz "Essa ação não poderá ser desfeita", mas a exclusão apenas despublica a notícia.
