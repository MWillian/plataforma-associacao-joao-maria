# Casos de Teste — Avisos

**Data da execução:** 24/11/2026  
**Ambiente:** Local (macOS) — front React + Vite em `localhost:5173`, API Express em `localhost:3001`, PostgreSQL via Docker  
**Versão testada:** branch `main` (commit `026f9b6`, PR #52)  
**Navegador:** Chromium (navegador integrado do app Claude)  
**Tipo de execução:** E2E pela interface, com conferência das respostas da API  
**Executor:** Claude (assistente de QA)  
**Massa de dados:** registros criados com o prefixo `[E2E]` e removidos ao final

**Resumo:** 12 casos executados — 10 aprovados, 0 reprovados, 2 não aplicáveis.

| ID | Cenário | Passos | Resultado esperado | Prioridade | Resultado obtido | Status |
|---|---|---|---|---|---|---|
| AVI-001 | Cadastrar aviso informativo | Selecionar turma, informar assunto, tipo Informativo e mensagem | Aviso cadastrado com sucesso | Alta | Aviso "Informativo" registrado (POST 201) após a confirmação "Deseja enviar este aviso para 1 turma(s)?". | ✅ Aprovado |
| AVI-002 | Cadastrar aviso de cancelamento | Selecionar turma, informar assunto, tipo Cancelamento e mensagem | Aviso cadastrado com sucesso | Alta | Aviso "Cancelamento" registrado (POST 201) para 1 destinatário. Sem `RESEND_API_KEY` no ambiente, o sistema informa: "Aviso registrado, mas nenhum e-mail foi enviado. Verifique a configuração de e-mail do servidor." (esperado neste ambiente). | ✅ Aprovado |
| AVI-003 | Cadastrar sem turma | Não selecionar turma e salvar | Sistema sinaliza campo obrigatório | Alta | "Selecione pelo menos uma turma válida."; nenhuma requisição é feita. | ✅ Aprovado |
| AVI-004 | Cadastrar sem assunto | Deixar assunto vazio e salvar | Sistema aplica a validação do campo | Média | "Preencha este campo." no assunto; nenhuma requisição é feita. | ✅ Aprovado |
| AVI-005 | Cadastrar sem tipo | Não selecionar tipo e salvar | Sistema aplica a validação do campo | Média | O campo "Tipo de aviso" não possui opção vazia: sempre vem "Informativo" selecionado, então não é possível enviar sem tipo. | ➖ Não aplicável |
| AVI-006 | Cadastrar sem mensagem | Deixar mensagem vazia e salvar | Sistema aplica a validação do campo | Média | "Preencha este campo." na mensagem; nenhuma requisição é feita. | ✅ Aprovado |
| AVI-007 | Editar aviso | Alterar assunto ou mensagem e salvar | Aviso atualizado com sucesso | Alta | A tela não oferece edição de aviso; a listagem tem apenas o botão "Excluir". | ➖ Não aplicável |
| AVI-008 | Consultar aviso | Pesquisar aviso cadastrado | Sistema apresenta o registro correspondente | Média | A tela não tem campo de busca; o aviso foi localizado na listagem, com tipo, data, turma, assunto e mensagem. | ✅ Aprovado |
| AVI-009 | Excluir aviso | Selecionar aviso e confirmar exclusão | Registro excluído ou inativado | Alta | Modal de confirmação; o aviso é excluído (DELETE 200) com "Aviso excluído com sucesso.". | ✅ Aprovado |
| AVI-010 | Cancelar exclusão | Iniciar exclusão e cancelar | Aviso permanece cadastrado | Média | "Cancelar" fecha o modal sem requisição; o aviso permanece. | ✅ Aprovado |
| AVI-011 | Verificar associação com turma | Cadastrar aviso para uma turma e consultar | Aviso permanece associado à turma selecionada | Alta | O aviso é exibido associado à turma selecionada ("[E2E] Turma Avisos – Terça-feira"). | ✅ Aprovado |
| AVI-012 | Verificar persistência | Cadastrar aviso e atualizar a página | Registro permanece disponível | Alta | Avisos permanecem após F5. | ✅ Aprovado |

## Defeitos encontrados

Nenhum defeito nos casos de teste deste módulo.

## Testes exploratórios

- "Cancelar" na confirmação de envio não envia nada e mantém o formulário preenchido — ✅.
- O erro "Selecione pelo menos uma turma válida." continua em vermelho depois que a turma é marcada, até o próximo envio.
- Destinatários: aluno sem e-mail não recebe; aluno menor usa o e-mail do responsável. Nenhum e-mail real foi enviado nos testes.
