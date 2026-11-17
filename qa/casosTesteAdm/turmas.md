# Casos de Teste — Turmas

| ID | Cenário | Passos | Resultado esperado | Prioridade |
----------------------------------------------------------------------------------------------
| TUR-001 | Cadastrar turma válida | Informar nome, turno e dias e salvar | Turma cadastrada com sucesso | Alta |
| TUR-002 | Cadastrar sem nome | Deixar o nome vazio e salvar | Sistema sinaliza campo obrigatório | Alta |
| TUR-003 | Cadastrar sem turno | Não selecionar turno e salvar | Sistema aplica a validação do campo | Média |
| TUR-004 | Cadastrar sem dias | Não selecionar dias e salvar | Sistema aplica a validação definida | Média |
| TUR-005 | Selecionar vários dias | Marcar mais de um dia da semana | Sistema registra os dias selecionados | Média |
| TUR-006 | Editar turma | Alterar os dados e salvar | Turma atualizada com sucesso | Alta |
| TUR-007 | Consultar turma | Pesquisar turma cadastrada | Sistema apresenta o registro correspondente | Média |
| TUR-008 | Cadastrar turma duplicada | Informar nome já existente | Sistema aplica a regra de duplicidade | Média |
| TUR-009 | Excluir turma | Selecionar turma e confirmar exclusão | Registro excluído ou inativado | Alta |
| TUR-010 | Cancelar exclusão | Iniciar exclusão e cancelar | Turma permanece cadastrada | Média |
| TUR-011 | Verificar persistência | Cadastrar turma e atualizar a página | Registro permanece disponível | Alta |
| TUR-012 | Excluir turma vinculada | Tentar excluir turma associada a outros registros | Sistema respeita as regras de relacionamento | Alta |