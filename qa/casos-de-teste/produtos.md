# Casos de Teste — Produtos

| ID | Cenário | Passos | Resultado esperado | Prioridade |
----------------------------------------------------------------------------------------------
| PRO-001 | Cadastrar produto válido | Informar título, preço, descrição e salvar | Produto cadastrado com sucesso | Alta |
| PRO-002 | Cadastrar sem título | Deixar o título vazio e salvar | Sistema sinaliza campo obrigatório | Alta |
| PRO-003 | Cadastrar sem preço | Deixar o preço vazio e salvar | Sistema sinaliza campo obrigatório | Alta |
| PRO-004 | Informar preço negativo | Inserir valor negativo | Sistema rejeita valor inválido | Alta |
| PRO-005 | Informar preço com letras | Inserir caracteres alfabéticos no preço | Sistema rejeita entrada inválida | Média |
| PRO-006 | Informar preço decimal | Inserir preço com casas decimais | Sistema registra o valor corretamente | Média |
| PRO-007 | Cadastrar produto com imagem | Preencher os campos e anexar imagem válida | Produto cadastrado com imagem | Média |
| PRO-008 | Anexar arquivo inválido | Selecionar arquivo em formato não permitido | Sistema rejeita o arquivo | Média |
| PRO-009 | Editar produto | Alterar os dados e salvar | Produto atualizado com sucesso | Alta |
| PRO-010 | Consultar produto | Pesquisar produto cadastrado | Sistema apresenta o registro correspondente | Média |
| PRO-011 | Excluir produto | Selecionar produto e confirmar exclusão | Registro excluído ou inativado | Alta |
| PRO-012 | Cancelar exclusão | Iniciar exclusão e cancelar | Produto permanece cadastrado | Média |
| PRO-013 | Verificar persistência | Cadastrar produto e atualizar a página | Registro permanece disponível | Alta |
| PRO-014 | Verificar preço após edição | Alterar preço e consultar novamente | Sistema apresenta o valor atualizado | Alta |