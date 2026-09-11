# Decisões pendentes de validação

Estes pontos não impedem Front-end e Back-end de trabalharem com mocks

1. **Modalidade e turma:** este contrato trata modalidade como uma classificação (`BALLET`, `JAZZ`, `SAPATEADO`, `OUTRA`) dentro de uma turma. Se modalidades precisarem de cadastro próprio, será criado o recurso `/modalidades`.
2. **Campos da turma:** confirmar faixa etária, limite de vagas, dias da semana e necessidade de instrutor no cadastro.
3. **WhatsApp:** confirmar se todos os produtos usam o número institucional ou se cada publicação pode informar um contato próprio.
4. **Produtos:** confirmar quais campos devem aparecer para agricultura e artesanato e se preço será exibido. A proposta permite preço opcional e não controla estoque.
5. **Imagens:** confirmar o provedor definitivo e limite. O contrato propõe upload `multipart/form-data`, JPEG/PNG/WebP e até 5 MB.
6. **Formulário público:** confirmar o endereço que receberá as mensagens enviadas em `/contato`.
7. **Comunicados internos:** confirmar quem pode enviar, se o envio será por turma e quais tipos de aviso serão permitidos.
8. **Turma com matrículas:** confirmar se uma turma poderá ser removida ou apenas desativada quando possuir estudantes vinculados. A proposta retorna `409 CONFLICT` e orienta desativar.
9. **Dados sensíveis:** este pacote não define cadastro de estudantes, responsáveis ou dados médicos. Esses recursos exigirão contrato e controle de acesso próprios.
