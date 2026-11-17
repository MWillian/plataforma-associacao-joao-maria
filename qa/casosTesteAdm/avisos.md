# Casos de Teste — Avisos

| ID | Cenário | Passos | Resultado esperado | Prioridade |
----------------------------------------------------------------------------------------------
| AVI-001 | Cadastrar aviso informativo | Selecionar turma, informar assunto, tipo Informativo e mensagem | Aviso cadastrado com sucesso | Alta |
| AVI-002 | Cadastrar aviso de cancelamento | Selecionar turma, informar assunto, tipo Cancelamento e mensagem | Aviso cadastrado com sucesso | Alta |
| AVI-003 | Cadastrar sem turma | Não selecionar turma e salvar | Sistema sinaliza campo obrigatório | Alta |
| AVI-004 | Cadastrar sem assunto | Deixar assunto vazio e salvar | Sistema aplica a validação do campo | Média |
| AVI-005 | Cadastrar sem tipo | Não selecionar tipo e salvar | Sistema aplica a validação do campo | Média |
| AVI-006 | Cadastrar sem mensagem | Deixar mensagem vazia e salvar | Sistema aplica a validação do campo | Média |
| AVI-007 | Editar aviso | Alterar assunto ou mensagem e salvar | Aviso atualizado com sucesso | Alta |
| AVI-008 | Consultar aviso | Pesquisar aviso cadastrado | Sistema apresenta o registro correspondente | Média |
| AVI-009 | Excluir aviso | Selecionar aviso e confirmar exclusão | Registro excluído ou inativado | Alta |
| AVI-010 | Cancelar exclusão | Iniciar exclusão e cancelar | Aviso permanece cadastrado | Média |
| AVI-011 | Verificar associação com turma | Cadastrar aviso para uma turma e consultar | Aviso permanece associado à turma selecionada | Alta |
| AVI-012 | Verificar persistência | Cadastrar aviso e atualizar a página | Registro permanece disponível | Alta |