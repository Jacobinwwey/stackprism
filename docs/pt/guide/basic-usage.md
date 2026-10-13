# Uso básico

O popup tem altura fixa de 600px; o corpo é a lista de tecnologias. A parte superior contém informações da página atual e controles de filtro; a parte inferior contém ferramentas auxiliares como pesquisa e dados brutos.

## Barra de ferramentas superior

```text
[StackPrism  URL da página atual]    [Tema] [Configurações] [Copiar] [Atualizar]
```

- **Esquerda**: nome da extensão + número de versão + URL da página atual (truncada; passe o mouse para ver completa)
- **Quatro botões de ícone à direita**:
  - **Tema** (ícone de sol / lua / tela): clique para alternar entre os estados "automático / claro / escuro"
  - **Configurações**: abre a página de configurações (aba independente)
  - **Copiar**: copia a URL da página atual para a área de transferência
  - **Atualizar**: notifica o background para re-detectar a página atual; os resultados em cache são mantidos no popup durante a atualização

## Dados de visão geral

```text
22 tecnologias    274 recursos    0 cabeçalhos de resposta
```

- **Tecnologias**: número total de tecnologias detectadas e deduplicadas
- **Recursos**: número de URLs de recursos (scripts, estilos, iframes, imagens, etc.) carregados pela página
- **Cabeçalhos de resposta**: número de cabeçalhos úteis extraídos dos cabeçalhos de resposta do documento principal

## Barra de filtro de categorias

```text
[ Destaques 5  Todos 22 ]    [ Selecionar categoria ▾ ]
```

- À esquerda há um seletor de segmento: "Destaques" lista apenas resultados de alta confiança; "Todos" lista todos
- À direita há um dropdown de categorias com 24 categorias (Frameworks frontend / Frameworks UI / CDN / WAF / CMS / ...); selecionar uma categoria específica exibe apenas resultados dessa categoria. Cada opção mostra a contagem (ex.: "CMS · 4")

## Lista de tecnologias

Cada tecnologia tem um cartão:

```text
React                                         [Alta confiança]
- Nó DOM com marcador React Fiber presente
- URL de recurso correspondendo cdn.example.com/react.production.min.js
Origem: cabeçalho de resposta  monitoramento dinâmico
Detecção imprecisa, clique para corrigir
```

- **Nome da tecnologia**: clicável, abre o site oficial ou repositório da tecnologia (ícone de link externo aparece ao passar o mouse)
- **Indicador de confiança**: alta (verde) / média (amarelo) / baixa (cinza)
- **Evidências**: até 4 linhas, listando os fragmentos de DOM / recurso / cabeçalho de resposta que levaram à detecção
- **Origem**: cada etiqueta é clicável — **clicar abre uma gaveta na parte inferior mostrando apenas o JSON bruto dessa tecnologia nessa origem**
- **Botão de correção**: clicar abre um formulário de issue no GitHub com este resultado de detecção preenchido, facilitando o envio de falsos positivos / negativos

::: tip
Se uma página detectar muitos itens, comece pela visualização "Destaques". Ela lista apenas resultados de alta confiança; mude para "Todos" quando precisar investigar falsos positivos ou ver a stack completa.
:::

## Barra de ferramentas inferior

```text
[Pesquisar]  [Dados brutos]  [Copiar tudo]                      GitHub
```

Botões de ferramenta à esquerda; veja [Ferramentas auxiliares](./tools.md) para detalhes. Pesquisar e Dados brutos abrem um painel pela parte inferior; clique no mesmo botão novamente ou no botão fechar do painel para recolher. Copiar tudo grava o relatório completo da stack na área de transferência diretamente.

## Comportamento de rolagem

A altura geral do popup está fixada em 600px; apenas a **área da lista de tecnologias** rola por conta própria. A barra de ferramentas superior, a visão geral e a barra de filtro de categorias ficam sempre visíveis.

Ao rolar para baixo mais de ~240px na lista, aparece um botão circular flutuante no canto inferior direito (seta para cima); clique nele para rolar suavemente de volta ao topo.
