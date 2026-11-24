# Casos de Teste — Produtos

**Data da execução:** 24/11/2026  
**Ambiente:** Local (macOS) — front React + Vite em `localhost:5173`, API Express em `localhost:3001`, PostgreSQL via Docker  
**Versão testada:** branch `main` (commit `026f9b6`, PR #52)  
**Navegador:** Chromium (navegador integrado do app Claude)  
**Tipo de execução:** E2E pela interface, com conferência das respostas da API  
**Executor:** Claude (assistente de QA)  
**Massa de dados:** registros criados com o prefixo `[E2E]` e removidos ao final

**Resumo:** 14 casos executados — 14 aprovados, 0 reprovados, 0 não aplicáveis.

| ID | Cenário | Passos | Resultado esperado | Prioridade | Resultado obtido | Status | Resultado obtido | Status |
|---|---|---|---|---|---|---|---|---|
| PRO-001 | Cadastrar produto válido | Informar título, preço, descrição e salvar | Produto cadastrado com sucesso | Alta | Produto salvo (POST 201) com a mensagem "Produto cadastrado com sucesso.". | ✅ Aprovado | Produto salvo (POST 201) com a mensagem "Produto cadastrado com sucesso.". | ✅ Aprovado |
| PRO-002 | Cadastrar sem título | Deixar o título vazio e salvar | Sistema sinaliza campo obrigatório | Alta | "Preencha este campo." no nome; nenhuma requisição é feita. | ✅ Aprovado | "Preencha este campo." no nome; nenhuma requisição é feita. | ✅ Aprovado |
| PRO-003 | Cadastrar sem preço | Deixar o preço vazio e salvar | Sistema sinaliza campo obrigatório | Alta | "Preencha este campo." no preço; nenhuma requisição é feita. | ✅ Aprovado | "Preencha este campo." no preço; nenhuma requisição é feita. | ✅ Aprovado |
| PRO-004 | Informar preço negativo | Inserir valor negativo | Sistema rejeita valor inválido | Alta | "O valor deve ser maior ou igual a 0." para -5. | ✅ Aprovado | "O valor deve ser maior ou igual a 0." para -5. | ✅ Aprovado |
| PRO-005 | Informar preço com letras | Inserir caracteres alfabéticos no preço | Sistema rejeita entrada inválida | Média | O campo numérico não aceita letras (valor fica vazio) e o envio é bloqueado. | ✅ Aprovado | O campo numérico não aceita letras (valor fica vazio) e o envio é bloqueado. | ✅ Aprovado |
| PRO-006 | Informar preço decimal | Inserir preço com casas decimais | Sistema registra o valor corretamente | Média | 35,90 salvo e exibido como "R$ 35,90". Três casas (10,555) são bloqueadas pelo navegador. | ✅ Aprovado | 35,90 salvo e exibido como "R$ 35,90". Três casas (10,555) são bloqueadas pelo navegador. | ✅ Aprovado |
| PRO-007 | Cadastrar produto com imagem | Preencher os campos e anexar imagem válida | Produto cadastrado com imagem | Média | Duas imagens PNG anexadas, salvas e exibidas no admin, na home e no detalhe público. | ✅ Aprovado | Duas imagens PNG anexadas, salvas e exibidas no admin, na home e no detalhe público. | ✅ Aprovado |
| PRO-008 | Anexar arquivo inválido | Selecionar arquivo em formato não permitido | Sistema rejeita o arquivo | Média | PDF e .exe recusados com "Selecione pelo menos uma imagem válida.". Ressalva: um texto renomeado para .png é aceito como imagem (aparece quebrada na prévia). | ✅ Aprovado | PDF e .exe recusados com "Selecione pelo menos uma imagem válida.". Ressalva: um texto renomeado para .png é aceito como imagem (aparece quebrada na prévia). | ✅ Aprovado |
| PRO-009 | Editar produto | Alterar os dados e salvar | Produto atualizado com sucesso | Alta | Alterações salvas (PUT 200) com "Produto atualizado com sucesso.". | ✅ Aprovado | Alterações salvas (PUT 200) com "Produto atualizado com sucesso.". | ✅ Aprovado |
| PRO-010 | Consultar produto | Pesquisar produto cadastrado | Sistema apresenta o registro correspondente | Média | Filtros por categoria e faixa de preço e o "Limpar filtros" funcionam. | ✅ Aprovado | Filtros por categoria e faixa de preço e o "Limpar filtros" funcionam. | ✅ Aprovado |
| PRO-011 | Excluir produto | Selecionar produto e confirmar exclusão | Registro excluído ou inativado | Alta | Modal de confirmação; o produto é excluído (DELETE 204) com "Produto excluído com sucesso.". | ✅ Aprovado | Modal de confirmação; o produto é excluído (DELETE 204) com "Produto excluído com sucesso.". | ✅ Aprovado |
| PRO-012 | Cancelar exclusão | Iniciar exclusão e cancelar | Produto permanece cadastrado | Média | "Cancelar" fecha o modal sem requisição; o produto permanece. | ✅ Aprovado | "Cancelar" fecha o modal sem requisição; o produto permanece. | ✅ Aprovado |
| PRO-013 | Verificar persistência | Cadastrar produto e atualizar a página | Registro permanece disponível | Alta | O produto e as imagens permanecem após F5. | ✅ Aprovado | O produto e as imagens permanecem após F5. | ✅ Aprovado |
| PRO-014 | Verificar preço após edição | Alterar preço e consultar novamente | Sistema apresenta o valor atualizado | Alta | O preço alterado para 42,50 aparece como "R$ 42,50" no admin e na API pública. | ✅ Aprovado | O preço alterado para 42,50 aparece como "R$ 42,50" no admin e na API pública. | ✅ Aprovado |

## Defeitos encontrados

| ID do defeito | Caso relacionado | Motivo da falha | Severidade | Status |
|---|---|---|---|---|
| BUG-ADM-008 | Exploratório | Produto excluído continua acessível pelo link de detalhe, com preço e botão "Encomendar pelo WhatsApp", para quem já tinha aberto o produto: a página lê a cópia salva em `sessionStorage` (`joao-maria.selected-product`) sem confirmar na API. Para um visitante novo, o mesmo link mostra o produto fictício de fallback ("Sousplat de crochê"). | Alta | Corrigido (aguarda reteste) |

## Testes exploratórios

- Título duplicado (mesmo com maiúsculas diferentes) → 409 "Já existe um produto com este título." — ✅.
- Imagem de 22 MB → recusada com "Cada imagem deve ser um arquivo de imagem (até ~6 MB)…" — ✅, mas a checagem só ocorre depois do envio, não ao escolher o arquivo.
- Com 2 imagens já escolhidas, selecionar mais 3 mantém apenas 3 no total e descarta as demais sem aviso.
- O filtro de categoria só lista categorias que já têm produtos ("Agricultura Familiar" não aparece sem produtos).
- Preço mínimo maior que o máximo não gera aviso; apenas "0 produto(s) encontrado(s)".
- Integração com o site público: o produto aparece no destaque da home, e o card abre o detalhe com preço e imagens — ✅.
