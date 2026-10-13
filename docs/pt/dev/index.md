# Manual do desenvolvedor

Esta seção é para quem deseja ler o código-fonte, modificar regras ou enviar um PR. Se você só precisa instalar a extensão, o [Guia de uso](/pt/guide/) é suficiente.

## Seções

- [Visão geral da arquitetura](./architecture.md) — estrutura de diretórios do projeto, responsabilidades dos módulos, fluxo de dados
- [Formato dos arquivos de regras](./rule-format.md) — como os JSONs em `public/rules/` são organizados, grupos aninhados e herança de defaults
- [Fluxo de detecção](./detection-flow.md) — os estágios desde o webRequest / injeção na página até a renderização no popup
- [Contribuindo com regras](./contribute-rules.md) — como adicionar novas tecnologias às regras integradas
- [Build e publicação](./release.md) — build local, empacotamento, assinatura de crx, fluxo de publicação

## Visão geral da stack

O projeto usa Vite 5 + Vue 3 + TypeScript + `@crxjs/vite-plugin` 2.x. O script de background é um service worker ESM do Manifest V3; o gerenciador de pacotes é o pnpm.

As regras ficam em `public/rules/`, divididas em múltiplos arquivos JSON por página, cabeçalhos de resposta, ecossistema WordPress/Drupal, etc. Durante o build, as regras são pré-processadas e recebem os campos `__hints` / `__legacyHints` / `__keywordCombined` para acelerar a correspondência.

## Comandos comuns de desenvolvimento

```bash
pnpm install            # instalar dependências
pnpm run dev            # iniciar vite dev server com hot reload da extensão
pnpm run build          # compilar para dist/, pronto para carregar no Chrome
pnpm run typecheck      # verificação de tipos estrita com vue-tsc
pnpm run lint           # verificação com eslint
pnpm run docs:dev       # iniciar preview local desta documentação
pnpm run docs:build     # compilar o site de documentação estático
```

No modo dev, as páginas da extensão suportam hot reload. Mudanças em popup / settings / help geralmente atualizam automaticamente; mudanças em `src/background/` ou content scripts exigem atualização manual do cartão da extensão em `chrome://extensions/`.

## Pontos de entrada Vue

Três SPAs independentes, cada um compilado separadamente, sem interferência:

| Entrada  | Arquivo                      | Descrição                                                      |
| -------- | ---------------------------- | -------------------------------------------------------------- |
| popup    | `src/ui/popup/index.html`    | Janela de 440px × 600px que aparece ao clicar no ícone da extensão |
| settings | `src/ui/settings/index.html` | Options page aberta nos detalhes de `chrome://extensions/`    |
| help     | `src/ui/help/index.html`     | Aba independente aberta ao clicar em "Ajuda" nas configurações |

## Links relacionados

- [Repositório GitHub](https://github.com/setube/stackprism)
- [Lista de issues](https://github.com/setube/stackprism/issues)
- [Lista de releases](https://github.com/setube/stackprism/releases)
