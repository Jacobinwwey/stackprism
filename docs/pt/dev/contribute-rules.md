# Contribuindo com regras

## Caminhos

As contribuições se dividem em dois tipos:

1. **Feedback rápido**: clique no botão "Detecção imprecisa, clique para corrigir" no cartão da tecnologia correspondente no popup. Isso abre automaticamente um Issue no GitHub com o contexto preenchido (URL da página, resultado atual da correspondência de regras, versão da extensão). O mantenedor ajustará a regra ao receber o issue.
2. **PR direto**: faça fork do repositório, edite o JSON correspondente em `public/rules/`, valide localmente e envie um PR.

O fluxo abaixo é sobre o PR direto.

## Encontrar o arquivo correto

`public/rules/` é dividido por responsabilidade:

| Arquivo                            | O que contém                                                         |
| ---------------------------------- | -------------------------------------------------------------------- |
| `page/frontend-frameworks.json`    | React / Vue / Angular / vários frameworks frontend                   |
| `page/ui-frameworks.json`          | Tailwind / Bootstrap / Element / Antd, etc.                          |
| `page/build-runtime.json`          | Webpack / Vite / Rollup / Bun, etc.                                  |
| `page/frontend-cdn-libraries.json` | Bibliotecas frontend nomeadas via CDN (jQuery, lodash, moment, etc.) |
| `page/wordpress-plugins.json`      | 4500+ plugins WordPress                                              |
| `page/drupal-modules.json`         | 4000+ módulos Drupal                                                 |
| `page/cms-themes.json`             | Temas CMS                                                            |
| `page/website-programs.json`       | WordPress / Drupal / Discuz! e outros CMS                            |
| `page/payment-systems.json`        | Plataformas de pagamento                                             |
| `page/third-party-logins.json`     | Login de terceiros                                                   |
| `page/saas-services.json`          | SaaS (Sentry / Mixpanel / Intercom, etc.)                            |
| `page/analytics-providers.json`    | Analytics e análise                                                  |
| `page/cdn-providers.json`          | Provedores CDN (detectados no runtime frontend)                      |
| `headers/server-products.json`     | Produtos de servidor identificados pelo cabeçalho `Server:`          |
| `headers/cdn-providers.json`       | CDNs identificados por cabeçalhos de resposta                        |
| `headers/website-programs.json`    | CMSs identificados por cabeçalhos de resposta                        |
| ...                                |                                                                      |

Lista completa em `public/rules/index.json`.

## Exemplo mínimo de uma nova regra

Suponha que você queira adicionar detecção de ExampleCMS. Em `page/website-programs.json`, encontre o grupo adequado (por exemplo, "CMS auto-hospedado") e adicione uma entrada:

```json
{
  "name": "ExampleCMS",
  "url": "https://examplecms.example.com",
  "patterns": ["examplecms-[0-9.]+\\.min\\.js", "/_examplecms/"],
  "globals": ["ExampleCMS"],
  "selectors": ["[data-powered-by='examplecms']"]
}
```

Consulte [Formato dos arquivos de regras](./rule-format.md) para o significado de cada campo.

## Em qual grupo colocar?

Abra o arquivo JSON correspondente — você verá uma estrutura de grupos aninhados:

```json
{
  "page": {
    "websitePrograms": {
      "defaults": { "category": "网站程序" },
      "rules": [
        {
          "defaults": { "confidence": "高" },
          "rules": [
            // vários CMS nomeados de alta confiança
          ]
        },
        {
          "defaults": { "confidence": "中" },
          "rules": [
            // vários de confiança média
          ]
        }
      ]
    }
  }
}
```

Coloque a regra no subgrupo de confiança que melhor reflete sua certeza sobre a detecção. A ordem das regras dentro do array não afeta os resultados; afeta apenas a ordem de navegação durante a depuração.

## Validando a regra

Após modificar:

```bash
bun run build
```

O build executa `precompileRulesPlugin` para injetar `__hints` e outros campos. Em seguida, carregue `dist/` em `chrome://extensions/` e valide em um site ExampleCMS real.

Alternativamente, use o painel "Regras personalizadas" para escrever a regra na camada de configuração do usuário primeiro — confirme que funciona antes de movê-la para `public/rules/`.

## Reduzindo falsos positivos

- **Prefira globals**: `window.X` é o sinal mais confiável — quase zero falsos positivos
- **Prefira seletores exclusivos**: `[data-powered-by='examplecms']`, `[ng-version]` — atributos claramente gravados por aquela tecnologia
- **Patterns de recursos com domínio / caminho completo**: `cdn.examplecms.com/sdk.js` é mais confiável que `examplecms`
- **classNames / classPrefixes com prefixos específicos**: `example-cms-` em vez de `cms-` para evitar colisões com outras bibliotecas que usam `cms-`
- **Adicione âncoras nas regexes**: `^/_examplecms/` é mais preciso que `/_examplecms/`
- **Seja conservador com a confiança**: na dúvida, use "Média" — o usuário verá um indicador amarelo em vez de verde, evitando induzir em erro

## Fluxo para contribuir com o repositório principal

1. Faça fork de [setube/stackprism](https://github.com/setube/stackprism)
2. Clone localmente, execute `bun install`, `bun run build` para confirmar que o build funciona
3. Encontre o arquivo em `public/rules/` e adicione a regra
4. Colete 2-3 evidências do [Wappalyzer rules](https://github.com/enthec/webappanalyzer), site oficial ou documentação e inclua na descrição do PR
5. Envie o PR para o branch main

Na descrição do PR, descreva quais tecnologias foram adicionadas, em qual site você validou, e por que essas características não causariam falsos positivos em outros sites.
