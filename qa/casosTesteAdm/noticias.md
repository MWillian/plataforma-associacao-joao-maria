# Casos de Teste — Notícias

| ID | Cenário | Passos | Resultado esperado | Prioridade |
----------------------------------------------------------------------------------------------
| NOT-001 | Cadastrar notícia válida | Informar título, descrição e salvar | Notícia cadastrada com sucesso | Alta |
| NOT-002 | Cadastrar sem título | Deixar o título vazio e salvar | Sistema sinaliza campo obrigatório | Alta |
| NOT-003 | Cadastrar sem descrição | Deixar a descrição vazia e salvar | Sistema aplica a validação do campo | Média |
| NOT-004 | Cadastrar notícia com imagem | Preencher os campos e anexar imagem válida | Notícia cadastrada com imagem | Média |
| NOT-005 | Anexar arquivo inválido | Selecionar arquivo em formato não permitido | Sistema rejeita o arquivo | Média |
| NOT-006 | Editar notícia | Alterar título ou descrição e salvar | Notícia atualizada com sucesso | Alta |
| NOT-007 | Consultar notícia | Pesquisar notícia cadastrada | Sistema apresenta o registro correspondente | Média |
| NOT-008 | Excluir notícia | Selecionar notícia e confirmar exclusão | Registro excluído ou inativado | Alta |
| NOT-009 | Cancelar exclusão | Iniciar exclusão e cancelar | Notícia permanece cadastrada | Média |
| NOT-010 | Verificar persistência | Cadastrar notícia e atualizar a página | Registro permanece disponível | Alta |
| NOT-011 | Verificar imagem cadastrada | Consultar notícia com imagem | Imagem é apresentada corretamente | Média |