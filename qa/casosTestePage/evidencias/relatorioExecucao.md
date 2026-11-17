# Relatório de Execução de Testes E2E
## Landing Page — Associação João e Maria

### 1. Identificação da execução

| Informação | Descrição |
|---|---|
| Projeto | Plataforma Associação João e Maria |
| Módulo | Landing Page |
| Tipo de teste | Testes End-to-End (E2E) |
| Aplicação testada | http://localhost:5173 |
| Ambiente | Local |
| Plataforma | Desktop e Mobile |
| Resolução mobile | 375px |
| Quantidade de verificações | Aproximadamente 60 |
| Data da execução | 17 de novembro de 2026 |
| Responsável pela validação | QA - Vitória Melo |
| Status geral | Aprovado parcialmente |

### 2. Objetivo

Avaliar o funcionamento da landing page e das páginas públicas da Plataforma Associação João e Maria por meio de testes automatizados End-to-End.

A execução teve como objetivo verificar os principais fluxos de navegação, interações, funcionalidades de busca, exibição de conteúdo e comportamento responsivo da aplicação.

Também foram observados erros no console do navegador, problemas de navegação, acessibilidade e SEO.

### 3. Resumo da execução

Foram realizadas aproximadamente 60 verificações, contemplando os ambientes desktop e mobile (375px).

A maior parte dos cenários apresentou comportamento esperado. Entretanto, foram identificados problemas funcionais, erros no console do navegador, elementos interativos sem ação implementada e oportunidades de melhoria relacionadas à acessibilidade e SEO.

**Resultado geral:** execução parcialmente aprovada, com defeitos e melhorias identificados.

### 4. Resultados positivos

#### 4.1. Carregamento da aplicação

- A página inicial foi carregada corretamente.
- Não foram identificadas falhas de rede durante o carregamento.

#### 4.2. Navegação

- Os itens "Quem Somos" e "Como Doar?" direcionaram corretamente às respectivas seções.
- Os itens "Estúdio Adágio", "Artesanato" e "Agricultura Familiar" direcionaram às páginas internas.
- O item ativo do menu foi destacado corretamente.

#### 4.3. Páginas internas

- A busca do catálogo e a busca do mural filtraram os resultados.
- A busca não diferenciou letras maiúsculas e minúsculas.
- Mensagens de ausência de resultados foram exibidas corretamente.
- Os filtros de categoria funcionaram.
- A paginação apresentou funcionamento adequado.
- O botão "Próxima" foi desativado corretamente na última página.

#### 4.4. Páginas de detalhes

- Os cards de produtos abriram suas respectivas páginas de detalhes.
- Os cards de notícias abriram suas respectivas páginas de detalhes.
- Os botões "Início", "Artesanato" e "Voltar para mural" funcionaram corretamente.
- A exibição de produtos semelhantes apresentou funcionamento adequado.

#### 4.5. Responsividade

- O menu hambúrguer abriu e fechou corretamente.
- A seleção de um item do menu mobile fechou o menu.

### 5. Problemas funcionais identificados

#### BUG-LP-001 — Navegação para o início da página apresenta erro JavaScript

**Descrição:** Os controles "INÍCIO" e o logotipo não retornam ao topo da página.

**Comportamento observado:** Após rolar a página e clicar em um desses elementos, a página permanece na mesma posição.

**Erro identificado no console:**

`Uncaught SyntaxError: '#' is not a valid selector`

**Localização informada:** `Navbar.jsx`, linha 29.

**Causa identificada:** A função `handleNavClick` utiliza `document.querySelector("#")`, provocando uma exceção quando o hash é igual a "#".

**Correção sugerida:** Tratar o hash "#" como uma ação de retorno ao topo, evitando a execução de `querySelector` nesse caso.

**Status:** Pendente de correção.

---

#### BUG-LP-002 — Botões da página inicial sem funcionalidade

**Descrição:** Foram identificados quatro botões sem comportamento implementado.

**Elementos afetados:**

- "SAIBA MAIS" — seção Estúdio Adágio.
- "MAIS PRODUTOS" — primeiro botão.
- "MAIS PRODUTOS" — segundo botão.
- "Transformar vidas" — seção de doação.

**Comportamento observado:** Os elementos não executam nenhuma ação ao serem acionados.

**Comportamento esperado:** Cada botão deve executar a ação correspondente à sua finalidade.

**Status:** Pendente de implementação.

---

#### BUG-LP-003 — Links sem destino funcional

**Descrição:** Foram identificados links configurados com destino "#", sem direcionamento funcional.

**Elementos afetados:**

- Facebook.
- Instagram.
- E-mail no cabeçalho.
- E-mail no rodapé.
- "Saiba Mais →" na seção da feira de artesanato.

**Comportamento esperado:** Os links devem direcionar para os respectivos destinos válidos.

**Status:** Pendente de correção.

---

#### BUG-LP-004 — Links do rodapé não direcionam corretamente nas páginas internas

**Descrição:** Os links do rodapé que apontam para seções da página inicial não funcionam adequadamente quando acionados em páginas internas.

**Exemplo identificado:** Na página Artesanato, ao clicar em "ESTÚDIO ADÁGIO", a URL é alterada para "#estudio", mas a página permanece em Artesanato.

**Comportamento esperado:** O visitante deve ser direcionado à seção correspondente na página inicial.

**Status:** Pendente de correção.

---

#### BUG-LP-005 — Ausência de URLs próprias para as páginas públicas

**Descrição:** As páginas públicas utilizam a mesma URL raiz (/), sem identificação individual dos conteúdos.

**Problemas identificados:**

- O botão voltar do navegador não retorna corretamente à página anterior.
- Ao atualizar a página, o usuário retorna à home.
- Não é possível compartilhar diretamente o endereço de um produto.

**Comportamento esperado:** As páginas públicas devem possuir endereços próprios e permitir navegação pelo histórico do navegador e acesso direto por URL.

**Status:** Pendente de análise e implementação.

---

#### BUG-LP-006 — Busca não normaliza acentos e espaços

**Descrição:** A busca não trata adequadamente diferenças de acentuação e espaços antes e depois dos termos pesquisados.

**Exemplos identificados:**

| Termo pesquisado | Resultado observado |
|---|---|
| crochê | Encontrou 3 produtos |
| croche | Não encontrou resultados |
| "  crochê  " | Não encontrou resultados |

**Comportamento esperado:** A busca deve considerar a normalização de acentos e espaços desnecessários.

**Correção sugerida:** Aplicar `trim()` e normalização Unicode utilizando `normalize('NFD')`, removendo os sinais diacríticos para a comparação.

**Status:** Pendente de correção.

---

#### BUG-LP-007 — Cards da página inicial sem navegação para detalhes

**Descrição:** Os cards de produtos apresentados na página inicial não são clicáveis.

**Elementos afetados:** Cards de macramê e tomates.

**Comportamento observado:** Os cards não direcionam para as respectivas páginas de detalhes.

**Comportamento esperado:** Os cards devem permitir acesso às informações detalhadas dos produtos, seguindo o comportamento existente nas páginas internas.

**Status:** Pendente de implementação.

### 6. Problemas de acessibilidade e SEO

#### 6.1. SEO e metadados

| ID | Problema identificado | Resultado esperado |
|---|---|---|
| SEO-001 | Título da aba apresenta "client" | Utilizar título institucional adequado |
| SEO-002 | Atributo `lang` do HTML está como "en" | Configurar idioma português brasileiro (`pt-BR`) |
| SEO-003 | Ausência de meta description | Adicionar descrição institucional |
| SEO-004 | Ausência de tags Open Graph | Configurar metadados para compartilhamento |

#### 6.2. Acessibilidade e semântica

| ID | Problema identificado | Resultado esperado |
|---|---|---|
| ACC-001 | Botão do menu mantém o rótulo "Abrir Menu de Navegação" mesmo aberto | Atualizar o nome acessível conforme o estado |
| ACC-002 | Botão do menu não possui `aria-expanded` | Informar corretamente o estado expandido ou recolhido |
| ACC-003 | Existência de um elemento `<main>` dentro de outro `<main>` | Manter estrutura semântica adequada |
| ACC-004 | Botões sem atributo `type="button"` | Definir explicitamente o tipo adequado para cada botão |

#### 6.3. Conteúdo provisório

Foram identificados elementos que ainda necessitam de substituição por conteúdo definitivo:

- Texto "INSERIR O PREÇO".
- Texto "Nome do Fundador".
- Imagens identificadas como placeholders.
- Ausência de imagens reais nos elementos `<img>` da página.

Esses pontos precisam ser revisados pela equipe de desenvolvimento e conteúdo.

### 7. Consolidação dos resultados

| Categoria | Resultado |
|---|---|
| Carregamento | Aprovado |
| Navegação principal | Parcialmente aprovado |
| Páginas internas | Aprovado nos cenários informados |
| Busca | Parcialmente aprovado |
| Paginação e filtros | Aprovado |
| Páginas de detalhes | Aprovado nos cenários informados |
| Responsividade mobile | Aprovado nos cenários informados |
| Botões da home | Reprovado em 4 elementos |
| Links externos | Reprovado em links identificados |
| Histórico e URLs | Reprovado |
| Acessibilidade | Necessita correções |
| SEO | Necessita melhorias |

### 8. Recomendações

Com base nos resultados obtidos, recomenda-se:

1. Corrigir os erros de navegação identificados no componente Navbar.
2. Implementar as ações dos botões sem funcionalidade.
3. Configurar corretamente os destinos dos links externos.
4. Corrigir os direcionamentos do rodapé nas páginas internas.
5. Implementar URLs individuais e gerenciamento adequado do histórico de navegação.
6. Melhorar a normalização dos termos utilizados na busca.
7. Tornar os cards da página inicial interativos.
8. Corrigir os problemas de acessibilidade e semântica.
9. Substituir os conteúdos provisórios por informações definitivas.
10. Executar novamente os testes após as correções.

### 9. Conclusão

A execução dos testes E2E permitiu identificar comportamentos funcionais adequados, além de defeitos que comprometem a navegação, a interação e a experiência dos visitantes da Plataforma Associação João e Maria.

Embora a maior parte das verificações tenha apresentado resultados positivos, os problemas identificados demonstram a necessidade de ajustes antes da conclusão da validação da landing page.

Após a implementação das correções, deverá ser realizada uma nova execução dos testes de regressão, com atualização das evidências e dos resultados registrados neste relatório.

---

**Observação:** Este documento registra os resultados textuais informados pelo executor da suíte E2E. As evidências técnicas originais, como screenshots, vídeos, traces e relatórios automatizados, deverão ser anexadas quando disponibilizadas.