# Plano de Casos de Teste — Landing Page
## Plataforma Associação João e Maria

**Projeto:** Plataforma Associação João e Maria  
**Módulo:** Landing Page Institucional  
**Responsável pelos testes:** QA  
**Tipo de teste:** Funcional e não funcional  
**Status geral:** Não iniciado

---

## 1. Objetivo

Verificar a qualidade da landing page institucional da Associação João e Maria, garantindo que seus elementos visuais, funcionalidades, navegação e conteúdo apresentem o comportamento esperado.

Também serão avaliados aspectos não funcionais, como acessibilidade, responsividade, desempenho e compatibilidade.

## 2. Escopo dos testes

### 2.1. Dentro do escopo

- Carregamento da página inicial.
- Navegação entre as seções.
- Funcionamento dos menus e botões.
- Exibição de textos e imagens.
- Funcionamento dos links externos.
- Responsividade em diferentes dispositivos.
- Acessibilidade da interface.
- Desempenho e estabilidade visual.
- Compatibilidade entre navegadores.

### 2.2. Fora do escopo

- Funcionalidades da área administrativa (ADM).
- Operações administrativas de cadastro, edição e exclusão.
- Testes de autenticação da ADM.
- Funcionalidades que não estejam implementadas na landing page.

## 3. Ambiente de testes

| Item | Configuração |
|---|---|
| Ambiente | Local |
| Sistema operacional | macOS |
| Navegador principal | Google Chrome |
| Frontend | React + Vite |
| Resolução desktop | 1920 × 1080 |
| Resolução tablet | 768 × 1024 |
| Resolução mobile | 390 × 844 |

As configurações poderão ser ajustadas conforme o ambiente real de execução.

## 4. Critérios de execução

Cada caso de teste deverá possuir:

- Identificador único.
- Objetivo.
- Prioridade.
- Pré-condições.
- Procedimento de execução.
- Resultado esperado.
- Resultado obtido.
- Status.
- Evidência associada.

### 4.1. Status possíveis

- **Não executado:** teste ainda não realizado.
- **Aprovado:** resultado obtido corresponde ao esperado.
- **Reprovado:** comportamento diferente do esperado.
- **Bloqueado:** impossibilidade de executar o teste devido a uma dependência ou problema externo.
- **Não aplicável:** cenário não corresponde às funcionalidades implementadas.

---

# 5. Casos de teste funcionais

## 5.1. Navegação

| ID | Cenário | Resultado esperado | Prioridade |
|---|---|---|---|
| LP-NAV-001 | Acessar a página inicial | Página carregada corretamente | Alta |
| LP-NAV-002 | Clicar no logotipo | Retornar ao início da página | Média |
| LP-NAV-003 | Clicar nos itens do menu | Direcionar para a seção correspondente | Alta |
| LP-NAV-004 | Navegar entre as seções | Exibir corretamente os conteúdos | Alta |
| LP-NAV-005 | Atualizar a página | Manter o funcionamento da página | Média |
| LP-NAV-006 | Acessar diretamente pela URL | Exibir a landing page corretamente | Alta |

## 5.2. Conteúdo institucional

| ID | Cenário | Resultado esperado | Prioridade |
|---|---|---|---|
| LP-CON-001 | Verificar seção Quem Somos | Apresentar o conteúdo institucional | Alta |
| LP-CON-002 | Verificar textos institucionais | Exibir textos completos e legíveis | Alta |
| LP-CON-003 | Verificar imagens institucionais | Carregar imagens corretamente | Alta |
| LP-CON-004 | Verificar seção de cultura e arte | Apresentar o conteúdo correspondente | Média |
| LP-CON-005 | Verificar seção de desenvolvimento social | Apresentar o conteúdo correspondente | Média |
| LP-CON-006 | Verificar seção de participação comunitária | Apresentar o conteúdo correspondente | Média |
| LP-CON-007 | Verificar informações do rodapé | Apresentar informações corretamente | Média |

*Os cenários referentes a seções específicas devem ser confirmados na implementação.*

## 5.3. Links e interações

| ID | Cenário | Resultado esperado | Prioridade |
|---|---|---|---|
| LP-LNK-001 | Clicar no botão de contato | Direcionar ao destino correto | Alta |
| LP-LNK-002 | Clicar nos links de redes sociais | Abrir os perfis correspondentes | Média |
| LP-LNK-003 | Verificar links externos | Apresentar destinos válidos | Média |
| LP-LNK-004 | Clicar no botão de WhatsApp, se existente | Abrir conversa com o contato correto | Alta |

---

# 6. Casos de teste não funcionais

## 6.1. Responsividade

| ID | Cenário | Resultado esperado | Prioridade |
|---|---|---|---|
| LP-RES-001 | Acessar em resolução desktop | Layout organizado e funcional | Alta |
| LP-RES-002 | Acessar em resolução tablet | Layout adaptado à resolução | Alta |
| LP-RES-003 | Acessar em resolução mobile | Layout adaptado à tela | Alta |
| LP-RES-004 | Verificar menu em dispositivos móveis | Menu acessível e funcional | Alta |
| LP-RES-005 | Verificar rolagem horizontal | Não apresentar rolagem horizontal indevida | Média |
| LP-RES-006 | Verificar imagens em diferentes resoluções | Imagens proporcionais e sem distorções | Média |

## 6.2. Acessibilidade

| ID | Cenário | Resultado esperado | Prioridade |
|---|---|---|---|
| LP-ACC-001 | Navegar utilizando somente o teclado | Elementos interativos acessíveis | Alta |
| LP-ACC-002 | Verificar contraste dos textos | Atender aos critérios de contraste WCAG aplicáveis | Alta |
| LP-ACC-003 | Verificar textos alternativos das imagens | Imagens informativas possuem descrição adequada | Média |
| LP-ACC-004 | Verificar hierarquia dos títulos | Estrutura semântica adequada | Média |
| LP-ACC-005 | Verificar identificação dos links e botões | Elementos possuem nomes acessíveis | Média |
| LP-ACC-006 | Executar auditoria automatizada de acessibilidade | Identificar possíveis violações WCAG | Alta |

## 6.3. Desempenho

| ID | Cenário | Resultado esperado | Prioridade |
|---|---|---|---|
| LP-PER-001 | Avaliar desempenho geral da página | Indicadores dentro das metas definidas | Alta |
| LP-PER-002 | Verificar carregamento das imagens | Imagens carregadas sem falhas desnecessárias | Média |
| LP-PER-003 | Avaliar estabilidade visual | Não apresentar deslocamentos excessivos de layout | Média |
| LP-PER-004 | Avaliar carregamento em conexão limitada | Página permanece utilizável | Média |

## 6.4. Compatibilidade

| ID | Cenário | Resultado esperado | Prioridade |
|---|---|---|---|
| LP-COM-001 | Acessar pelo Google Chrome | Página funcional | Alta |
| LP-COM-002 | Acessar pelo Mozilla Firefox | Página funcional | Média |
| LP-COM-003 | Acessar pelo Microsoft Edge | Página funcional | Média |
| LP-COM-004 | Acessar pelo Safari | Página funcional | Média |

---

# 7. Registro de execução

Esta seção deverá ser preenchida somente após a execução real dos testes.

| ID | Data | Resultado | Evidência |
|---|---|---|---|
| LP-NAV-001 | — | Não executado | — |
| LP-NAV-002 | — | Não executado | — |
| LP-CON-001 | — | Não executado | — |
| LP-RES-001 | — | Não executado | — |
| LP-ACC-001 | — | Não executado | — |
| LP-PER-001 | — | Não executado | — |

A tabela deverá ser ampliada para contemplar todos os casos de teste.

# 8. Registro de defeitos

Os defeitos identificados durante as execuções deverão ser documentados.

| ID do defeito | Caso relacionado | Descrição | Severidade | Status |
|---|---|---|---|---|
| BUG-LP-001 | — | A preencher durante a execução | — | Não iniciado |

# 9. Evidências

As evidências deverão ser armazenadas no diretório:

`QA/landing-page/evidencias/`

Tipos de evidências:

- Capturas de tela.
- Relatórios de execução automatizada.
- Vídeos de execução, quando necessários.
- Relatórios de acessibilidade.
- Relatórios de desempenho.

Cada evidência deverá estar identificada pelo ID do caso de teste correspondente.

# 10. Critérios de encerramento

A execução dos testes será considerada concluída quando:

- Todos os casos aplicáveis tiverem sido executados.
- Os resultados estiverem registrados.
- As evidências estiverem associadas aos respectivos casos.
- Os defeitos encontrados estiverem documentados.
- Os resultados das avaliações não funcionais estiverem registrados.
- Existir um relatório consolidado da qualidade da landing page.