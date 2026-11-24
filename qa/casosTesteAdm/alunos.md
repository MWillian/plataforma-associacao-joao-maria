# Casos de Teste — Alunos

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
| ALU-001 | Cadastrar aluno válido | Preencher os campos e salvar | Aluno cadastrado com sucesso | Alta | Aluno com e-mail, telefone, turma e alergia salvo (POST 201) e listado. | ✅ Aprovado |
| ALU-002 | Cadastrar sem nome | Deixar o nome vazio e salvar | Sistema sinaliza campo obrigatório | Alta | "Preencha este campo." no nome; nenhuma requisição é feita. | ✅ Aprovado |
| ALU-003 | Cadastrar sem e-mail | Deixar o e-mail vazio e salvar | Sistema aplica a validação do campo | Média | O e-mail é opcional: aluno salvo sem e-mail (POST 201), com o aviso de que não receberá avisos diretamente. | ✅ Aprovado |
| ALU-004 | Informar e-mail inválido | Preencher e-mail em formato incorreto | Sistema sinaliza formato inválido | Média | "aluno-sem-arroba" bloqueado pelo navegador; "aluno@dominio" recusado pela API ("E-mail inválido.") com aviso na tela. | ✅ Aprovado |
| ALU-005 | Informar telefone inválido | Preencher telefone com formato incorreto | Sistema valida o telefone | Média | "abc" e "123" recusados pela API com o aviso "Telefone inválido. Informe DDD e número.". O campo aceita letras ao digitar. | ✅ Aprovado |
| ALU-006 | Cadastrar aluno menor de idade | Marcar a opção de menor de idade e salvar | Cadastro realizado conforme as regras do sistema | Alta | Marcar "menor de idade" exibe o responsável (nome obrigatório). Sem o nome do responsável o envio é bloqueado; com ele, o aluno é salvo e exibe "Responsável" e "Menor". | ✅ Aprovado |
| ALU-007 | Editar aluno | Alterar os dados de um aluno e salvar | Dados atualizados com sucesso | Alta | Nome, telefone e alergia alterados (PUT 200) e refletidos na lista. O telefone vem sem máscara na edição (`82999991234`). | ✅ Aprovado |
| ALU-008 | Consultar aluno | Pesquisar aluno cadastrado | Sistema apresenta o registro correspondente | Média | A tela não tem campo de busca; o registro foi localizado na listagem. | ✅ Aprovado |
| ALU-009 | Excluir aluno | Selecionar aluno e confirmar exclusão | Registro excluído ou inativado | Alta | Modal de confirmação; o aluno é inativado (PATCH `/inactivate` 200) e sai da lista. | ✅ Aprovado |
| ALU-010 | Cancelar exclusão | Iniciar exclusão e cancelar | Registro permanece cadastrado | Média | "Cancelar" fecha o modal sem requisição; o aluno permanece. | ✅ Aprovado |
| ALU-011 | Cadastrar e-mail duplicado | Informar e-mail já utilizado | Sistema aplica a regra de duplicidade | Média | O sistema aceita 3 alunos com o mesmo e-mail, inclusive digitado em maiúsculas (a API normaliza para minúsculas, mas não bloqueia). Ver BUG-ADM-004. | ❌ Reprovado |
| ALU-012 | Verificar persistência | Cadastrar aluno e atualizar a página | Registro permanece disponível | Alta | Alunos permanecem após F5. | ✅ Aprovado |

## Defeitos encontrados

| ID do defeito | Caso relacionado | Motivo da falha | Severidade | Status |
|---|---|---|---|---|
| BUG-ADM-004 | ALU-011 | E-mail de aluno duplicado é aceito. O banco também não define unicidade; confirmar se é intencional (ex.: irmãos com o e-mail da família) e ajustar o caso de teste ou a regra. | Baixa | Aberto |
| BUG-ADM-007 | Exploratório | Regras invertidas entre cadastro e edição: no **cadastro**, telefone é "(opcional)" e turma é obrigatória; na **edição**, telefone é obrigatório ("Telefone *") e turma é "(opcional)". Um aluno cadastrado sem telefone não pode ser editado sem ganhar um. | Média | Aberto |

## Testes exploratórios

- Cadastro sem turma é bloqueado com "Selecione pelo menos uma turma." — ✅.
- Erros da API aparecem em aviso flutuante no canto superior direito — ✅ (diferente da tela de turmas).
- Não há campo de data de nascimento, embora o banco tenha `birth_date`.
- Na listagem, o telefone aparece sem máscara, e sobra um "·" quando o aluno não tem telefone.
