# Importar/exportar regras em JSON

A última seção da página de configurações exibe o JSON das suas regras personalizadas atuais. Útil para backup, migração e edição em lote.

## Casos de uso

- Migrar regras entre dispositivos / contas
- Fazer backup das regras com controle de versão
- Edição em lote (busca e substituição no campo de texto é mais rápida do que editar item por item no formulário)
- Construir arrays de regras programaticamente (gerar centenas de regras via script)

## Estrutura dos campos

Cada regra é um objeto:

```json
{
  "name": "MyCMS",
  "category": "CMS / Programas web",
  "kind": "CMS personalizado",
  "confidence": "中",
  "matchType": "regex",
  "patterns": ["mycms-[0-9.]+\\.js", "X-Generator: MyCMS"],
  "selectors": ["[data-powered-by='mycms']"],
  "globals": ["MyCMS"],
  "matchIn": ["url", "resources", "html", "headers", "dynamic"],
  "url": "https://mycms.example.com"
}
```

| Campo        | Tipo                     | Obrigatório | Descrição                                                                                  |
| ------------ | ------------------------ | ----------- | ------------------------------------------------------------------------------------------ |
| `name`       | string                   | Sim         | Nome exibido no popup                                                                      |
| `category`   | string                   |             | Categoria; padrão: `其他库` (Outras bibliotecas)                                           |
| `kind`       | string                   |             | Descrição do tipo; padrão: `自定义规则` (Regra personalizada)                              |
| `confidence` | `"高"` / `"中"` / `"低"` |             | Padrão: `"中"` (Média)                                                                     |
| `matchType`  | `"keyword"` / `"regex"`  |             | Padrão: `"regex"`                                                                          |
| `patterns`   | string[]                 | Um dos três | Os três campos (patterns / selectors / globals) exigem pelo menos um não vazio             |
| `selectors`  | string[]                 | Um dos três | Lista de seletores CSS                                                                     |
| `globals`    | string[]                 | Um dos três | Lista de nomes de variáveis globais (`window.x.y` é escrito como `x.y`)                    |
| `matchIn`    | string[]                 |             | Qualquer combinação de `url` / `resources` / `html` / `headers` / `dynamic`; padrão: todos |
| `url`        | string                   |             | Deve ser `http(s)://`; pode ficar vazio                                                    |

## Botões de ação

Há dois botões no canto superior direito do título:

- **Importar do JSON**: analisa o conteúdo do campo de texto e, se válido, **substitui completamente** a lista de regras personalizadas atual (não é uma mesclagem)
- **Formatar**: analisa e reescreve o conteúdo usando `JSON.stringify(rules, null, 2)` com indentação

## Barras invertidas em strings

Expressões regulares em JSON precisam de escape duplo. Por exemplo, para corresponder a `\.js`:

```json
{
  "matchType": "regex",
  "patterns": ["\\.js$"]
}
```

O parser JSON converte `\\` em um único `\`, e a extensão passa `\.js$` para `new RegExp()`, que então trata o ponto como literal.

## Validação atômica

Na importação, o array inteiro é analisado primeiro; se qualquer regra tiver um campo inválido, a importação inteira é rejeitada (operação atômica). Não é possível que metade seja importada e metade rejeitada. A mensagem de erro indica qual regra e qual campo causou o problema.

## Relação com o formulário

- Alterações no formulário → sincronizadas automaticamente no campo JSON
- Alterações no campo JSON → é necessário clicar em "Importar do JSON" para sincronizar de volta para a lista interna de regras
- Salvar as configurações sem clicar em importar usa o estado da última operação de formulário / importação

## Limite de quantidade

`CUSTOM_RULE_LIMITS.rules` padrão é 100. Exceder esse limite resulta em rejeição. Veja todos os limites em [`src/types/settings.ts`](https://github.com/setube/stackprism/blob/main/src/types/settings.ts):

| Campo                                             | Limite      |
| ------------------------------------------------- | ----------- |
| Total de regras                                   | 100         |
| name                                              | 80 chars    |
| category                                          | 40 chars    |
| kind                                              | 40 chars    |
| pattern / selector / global individual            | 240 chars   |
| Tamanho dos arrays patterns / selectors / globals | 80 cada     |
| Tamanho do array matchIn                          | 8           |
| url                                               | 240 chars   |
| customCss                                         | 10000 chars |
