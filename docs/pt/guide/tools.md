# Ferramentas auxiliares

Na parte inferior do popup há três ferramentas: "Pesquisar", "Dados brutos" e "Copiar tudo". Pesquisar e Dados brutos abrem um painel pela parte inferior, ocupando no máximo 60% da altura do popup; clique novamente no botão ou no botão fechar do painel para recolher. Copiar tudo não abre um painel — copia diretamente o relatório completo da stack para a área de transferência.

## Pesquisa no código-fonte da página

Útil quando você suspeita que uma detecção está errada ou quer confirmar se uma determinada string / regex realmente aparece na página.

### Campo de entrada

Suporta texto simples e expressões regulares. Pressione Enter ou clique em "Pesquisar" para executar.

### Opções

| Opção               | Descrição                                                                                               |
| ------------------- | ------------------------------------------------------------------------------------------------------- |
| Diferenciar maiúsc. | Desativado por padrão; quando ativado, `React` e `react` não são equivalentes                           |
| Palavra inteira     | Funciona no modo de texto simples; requer caracteres não-palavra ao redor da correspondência (usa `\b`) |
| Expressão regular   | Trata a entrada como fonte de regex JavaScript, combinada com as flags acima                            |

### Saída

Lista:

- A consulta em si, o modo, o tipo de origem (resultado serializado do DOM ou outerHTML), o comprimento total do código-fonte
- Número de correspondências (números grandes são exibidos como "100+" com as primeiras N cortadas)
- Número de linha, número de coluna, offset de caractere e snippet de contexto (~60 caracteres antes e depois) para cada correspondência

::: tip
A pesquisa serializa o DOM da página ativa atual em uma string e a corresponde, então cobre elementos ocultos, scripts inline e comentários. Não é uma pesquisa de código-fonte de rede — o DOM modificado por scripts após o carregamento da página também é incluído.
:::

## Dados brutos

Útil quando você quer:

- Ver dados brutos completos (todos os cabeçalhos de resposta / snapshots dinâmicos / resultados brutos de detecção de página antes de serem agregados pelo plugin)
- Anexar evidências completas a um issue
- Depurar correspondências de regras personalizadas

A saída é JSON completo com a seguinte estrutura:

```json
{
  "url": "https://example.com",
  "title": "Example",
  "generatedAt": "2026-05-10T10:00:00.000Z",
  "technologies": [/* lista deduplicada e mesclada */],
  "resources": {/* resumo de recursos */},
  "headers": {/* cabeçalhos de resposta do documento principal */},
  "apiObservations": [/* url/headers/technologies de cada resposta de API */],
  "frameObservations": [/* o mesmo para cada iframe */],
  "dynamicObservations": {/* scripts/estilos/iframes/feedLinks/domMarkers coletados dinamicamente */},
  "notes": [/* algumas notas metodológicas */]
}
```

### Origem → JSON com escopo

Se você quiser ver apenas o subconjunto JSON de **uma tecnologia específica em uma origem específica**, não precisa abrir os dados brutos completos — basta clicar na etiqueta de origem abaixo do cartão da tecnologia (ex.: "cabeçalho de resposta", "monitoramento dinâmico · após interação"). A mesma gaveta abre, mas mostra apenas os campos relacionados a essa origem, e o array de tecnologias é filtrado para mostrar apenas essa tecnologia.

O título da gaveta muda para algo como "Dados brutos · React · cabeçalho de resposta" para indicar que você está em uma visualização com escopo. Clicar em "Dados brutos" na barra de ferramentas inferior volta para o JSON completo.

## Copiar relatório completo da stack

O botão "Copiar tudo" na parte inferior do popup copia o relatório completo da stack da página atual para a área de transferência. O relatório inclui:

- Resumo Markdown legível por humanos
- JSON estruturado `stackprism.tech_stack_report.v1`
- URL da página atual, título, hora de geração, total de tecnologias, número de recursos e número de cabeçalhos de resposta do documento principal

Ele copia os **resultados do popup atual**, sem ser afetado pela visualização "Destaques" ou pelo filtro de dropdown de categorias; os interruptores de categoria e a lista de bloqueio da página de configurações continuam aplicados. Você pode colar diretamente em issues, notas, caixas de entrada de AI Agents ou ferramentas de texto externas.

Casos de uso comuns:

- Anexar contexto completo de stack ao enviar issues / PRs
- Registrar a stack de tecnologias de um site em documentação ou base de conhecimento
- Passar para um AI Agent para análise adicional
