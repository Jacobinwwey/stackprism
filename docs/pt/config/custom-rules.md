# Regras personalizadas

As regras personalizadas servem para cobrir sites não contemplados pelas regras integradas ou para validar localmente se uma nova regra é confiável antes de contribuí-la.

## Preenchimento do formulário

| Campo                         | Obrigatório | Descrição                                                                                                                                       |
| ----------------------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| **Nome da tecnologia**        | Sim         | Nome exibido no popup, ex.: `MyCMS`                                                                                                             |
| **Categoria**                 |             | Selecione uma categoria integrada (23 disponíveis) ou digite uma nova. Padrão: "Outras bibliotecas". O componente Select suporta entrada livre. |
| **Descrição do tipo**         |             | Nota para uso próprio, ex.: `CMS corporativo`, `pagamento de terceiros`. Aparece como prefixo nas evidências; pode ficar vazio.                 |
| **Confiança**                 |             | Alta / Média / Baixa; padrão: "Média"                                                                                                           |
| **Método de correspondência** |             | Palavra-chave / Expressão regular; padrão: "Expressão regular"                                                                                  |
| **URL do site / repositório** |             | Deve começar com `http://` ou `https://`. Se preenchido, o nome da tecnologia no popup se torna clicável                                        |

Abaixo há quatro áreas adicionais:

- **Escopo de correspondência**: determina em quais fontes de dados os patterns / selectors / globals são aplicados
  - URL da página: endereço da página atual
  - URL de recursos: recursos carregados por scripts / estilos / iframes
  - DOM / código-fonte: outerHTML da página
  - Cabeçalhos de resposta: cabeçalhos do documento principal + API + iframes
  - Recursos dinâmicos: recursos acumulados continuamente pelo MutationObserver

- **Regras de correspondência (patterns)**: uma por linha. No modo palavra-chave, é uma correspondência literal de string; no modo regex, é a fonte de uma regex JS (sem as barras `/.../i`; o flag `i` é adicionado automaticamente pela extensão)

- **Seletores CSS (selectors)**: um por linha, ex.: `[data-v-app]`, `#__next`. O escopo de correspondência deve incluir "DOM / código-fonte"

- **Variáveis globais (globals)**: uma por linha, ex.: `React`, `Vue.config`, `__NEXT_DATA__`. Uma correspondência resulta em alta confiança

## Adicionar / Atualizar

- **Adicionar regra** (botão principal verde): salva o formulário atual como uma nova regra
- **Atualizar regra atual**: clique em editar uma regra existente na lista no canto inferior direito para entrar no "modo de edição"; após alterar, clique neste botão para salvar

Por fim, você precisa clicar em "Salvar configurações" no canto superior direito da página para que a regra seja gravada no storage.

## Lista de regras adicionadas

Exibida na parte inferior da página; cada regra inclui:

- Título: nome da tecnologia da regra
- Metadados: categoria · tipo · confiança · método de correspondência · N patterns
- Ações: botões "Editar" e "Excluir" (botão excluir fica vermelho ao passar o mouse)

## Validação de regras

A cada adição / atualização / salvamento de configurações, as seguintes validações são executadas:

- O nome é obrigatório
- Pelo menos um de patterns / selectors / globals deve ser preenchido
- Pelo menos um escopo de correspondência deve ser selecionado
- O campo url, se preenchido, deve começar com http(s)://
- No modo regex, cada pattern deve ser compilável com `new RegExp`
- Cada selector deve passar na validação do `document.createDocumentFragment().querySelector`
- Cada global deve seguir o formato de nome de variável separado por ponto, como `MyCMS` ou `google.maps`

Falhas de validação exibem uma dica de erro vermelha listando até 6 problemas.

## Exemplo: palavra-chave simples

Detectar ExampleCMS:

```text
Nome da tecnologia: ExampleCMS
Categoria:         CMS / Programas web
Método:            Palavra-chave
Patterns:
  examplecms
  X-Generator: ExampleCMS
Escopo: [x] URL da página [x] URL de recursos [x] DOM / código-fonte [x] Cabeçalhos de resposta
```

## Exemplo: detectar tema WordPress

```text
Nome da tecnologia: WordPress Theme: oceanwp
Categoria:         Temas / Templates
Método:            Palavra-chave
Patterns:
  /wp-content/themes/oceanwp/
Escopo: [x] URL de recursos [x] DOM / código-fonte
```

## Exemplo: detectar SDK de pagamento carregado dinamicamente

O script só é requisitado após clicar no botão de pagamento, portanto marque "Recursos dinâmicos":

```text
Nome da tecnologia: ExamplePay
Categoria:         Sistemas de pagamento
Tipo:              pagamento de terceiros
Método:            Palavra-chave
Patterns:
  pay.example.com
  examplepay-sdk
Escopo: [x] Recursos dinâmicos
```

## Exemplo: regex para arquivo de biblioteca com versão

```text
Nome da tecnologia: ExampleLib
Categoria:         Frameworks frontend
Método:            Expressão regular
Patterns:
  examplelib-[0-9.]+\.min\.js
Escopo: [x] URL de recursos [x] Recursos dinâmicos
```

## Reduzindo falsos positivos

- Evite palavras-chave muito genéricas como `app`, `main`, `login` — quase todos os sites as contêm
- Prefira **domínios completos** `pay.example.com` em vez de `pay`
- Prefira **caminhos específicos** `/wp-content/themes/oceanwp/` em vez de `oceanwp`
- Use **prefixos específicos** para classNames como `example-cms-` em vez de `cms-`
- Adicione âncoras nas regexes: `^/_examplecms/` é mais preciso que `/_examplecms/`
- Em caso de dúvida, defina a confiança como "Baixa"; o popup exibirá um indicador cinza indicando que é apenas uma suposição
- Após salvar a regra, **sempre atualize a página alvo** antes de abrir o popup; caso contrário, o cache ainda mostrará os resultados antigos
