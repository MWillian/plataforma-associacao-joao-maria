# Casos de Teste — Alunos

| ID | Cenário | Passos | Resultado esperado | Prioridade |
----------------------------------------------------------------------------------------------
| ALU-001 | Cadastrar aluno válido | Preencher os campos e salvar | Aluno cadastrado com sucesso | Alta |
| ALU-002 | Cadastrar sem nome | Deixar o nome vazio e salvar | Sistema sinaliza campo obrigatório | Alta |
| ALU-003 | Cadastrar sem e-mail | Deixar o e-mail vazio e salvar | Sistema aplica a validação do campo | Média |
| ALU-004 | Informar e-mail inválido | Preencher e-mail em formato incorreto | Sistema sinaliza formato inválido | Média |
| ALU-005 | Informar telefone inválido | Preencher telefone com formato incorreto | Sistema valida o telefone | Média |
| ALU-006 | Cadastrar aluno menor de idade | Marcar a opção de menor de idade e salvar | Cadastro realizado conforme as regras do sistema | Alta |
| ALU-007 | Editar aluno | Alterar os dados de um aluno e salvar | Dados atualizados com sucesso | Alta |
| ALU-008 | Consultar aluno | Pesquisar aluno cadastrado | Sistema apresenta o registro correspondente | Média |
| ALU-009 | Excluir aluno | Selecionar aluno e confirmar exclusão | Registro excluído ou inativado | Alta |
| ALU-010 | Cancelar exclusão | Iniciar exclusão e cancelar | Registro permanece cadastrado | Média |
| ALU-011 | Cadastrar e-mail duplicado | Informar e-mail já utilizado | Sistema aplica a regra de duplicidade | Média |
| ALU-012 | Verificar persistência | Cadastrar aluno e atualizar a página | Registro permanece disponível | Alta |