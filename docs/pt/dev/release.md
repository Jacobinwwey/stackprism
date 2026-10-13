# Build e publicação

## Build local

```bash
pnpm install
pnpm run build
```

Pipeline:

1. `pnpm run build:injected` (`build-scripts/build-injected.mjs`): esbuild compila `src/injected/page-detector.ts` e `page-source-search.ts` cada um como um arquivo IIFE independente, com saída em `public/injected/`
2. `vite build` (`@crxjs/vite-plugin`): empacota os quatro pontos de entrada background / popup / settings / help, com saída em `dist/`
3. `precompileRulesPlugin` (hook closeBundle do plugin vite): varre `dist/rules/*.json` e injeta `__hints` / `__legacyHints` / `__keywordCombined` em cada leaf rule
4. `minifyJsonAssets` (hook closeBundle do plugin vite): reescreve todos os JSONs com `JSON.stringify(parsed)`, removendo indentação e quebras de linha

O `dist/` final pode ser carregado diretamente no modo desenvolvedor em `chrome://extensions/`.

## Hot reload em desenvolvimento

```bash
pnpm run dev
```

vite dev server + crxjs HMR: mudanças em `src/ui/**` no popup / página de configurações / página de ajuda são substituídas automaticamente. Mudanças em código de background `src/background/**` ou content scripts `src/content/**` exigem clicar no botão de atualização do cartão da extensão em `chrome://extensions/`.

## Tipos e lint

```bash
pnpm run typecheck    # vue-tsc --noEmit, verificação de tipos estrita em todo o projeto
pnpm run lint         # eslint src
```

Antes de fazer commit, execute a formatação unificada:

```bash
npx prettier --write .
```

## Gerenciamento de versão

O campo `version` em `package.json` é a fonte de verdade. O `@crxjs/vite-plugin` o sincroniza automaticamente com `dist/manifest.json`.

Funcionalidades comuns, regras e correções incrementam o patch. Quando o patch chega a `99`, passa para o próximo minor — não use versões como `1.1.100`:

```bash
# 1.1.98 -> 1.1.99
# 1.1.99 -> 1.2.0
```

Apenas versões que precisam de pacote de instalação recebem um GitHub Release: `x.y.0`, `x.y.10`, `x.y.20`, ..., `x.y.90`. Por exemplo, `1.2.0` e `1.2.10` recebem release; `1.2.5` e `1.2.15` não.

```bash
# Após modificar a versão em package.json
git add package.json
git commit -m "chore: bump 1.2.10"
git push origin main
```

## Fluxo de trabalho do GitHub Release

`.github/workflows/release-extension.yml` é disparado em dois casos:

1. Publicação de um release na interface do GitHub (evento `release: published`)
2. Execução manual do workflow_dispatch na página Actions (pode passar um input `release_tag`)

O que o workflow faz:

1. Checkout + instala pnpm + Node 20
2. `pnpm install --frozen-lockfile`
3. `pnpm run build`
4. Lê a versão de `dist/manifest.json` e valida que coincide com a tag do release
5. Empacota todo o `dist/` como `stackprism-v{ver}.zip` + sha256
6. **Se o secret `EXTENSION_PRIVATE_KEY` estiver configurado**, usa `npx crx3` para assinar e gerar `stackprism-v{ver}.crx` + sha256; caso contrário, pula a etapa crx e envia apenas o zip
7. `gh release upload --clobber` faz upload de todos os artefatos para a tag do release
8. `actions/upload-artifact` salva uma cópia como artifact

## Notas de publicação

As notas de publicação são compiladas do `git log --oneline vPREV..HEAD` entre a tag do release anterior e o commit atual — não são a lista de commits colada diretamente. Organizadas em categorias legíveis para o usuário, como:

- Melhorias de regras
- Popup e página de configurações
- Site de documentação
- Build e fluxo de publicação

As notas de publicação cobrem apenas mudanças relevantes para usuários ou mantenedores; não incluem formatação local, verificação de tipos, lint ou comandos de build executados.

## Chave de assinatura CRX

Antes da primeira publicação, gere uma chave RSA privada e configure-a nos secrets do repositório GitHub.

### Gerar a chave privada

```bash
openssl genrsa -out extension.pem 2048
```

::: warning
`extension.pem` **não pode ser perdido** — regenerar criará um ID de extensão diferente (o Chrome tratará como uma extensão nova). Faça backup local.
:::

### Configurar no GitHub

1. Configurações do repositório → Secrets and variables → Actions → New repository secret
2. Name: `EXTENSION_PRIVATE_KEY`
3. Secret: cole o **conteúdo completo** do arquivo `extension.pem` (incluindo `-----BEGIN PRIVATE KEY-----` e `-----END PRIVATE KEY-----`)
4. Salvar

O workflow usará automaticamente essa chave para assinar o crx.

### O que acontece sem a chave

O workflow ainda funciona, mas os artefatos não incluirão o arquivo `.crx`. Os usuários só poderão instalar via zip descompactado.

## Checklist de publicação

- [ ] `npx prettier --write .` executado
- [ ] `pnpm run typecheck` passou
- [ ] `pnpm run lint` passou
- [ ] `pnpm run build` passou
- [ ] Carregou `dist/` no Chrome e testou manualmente os fluxos principais (abrir popup, detectar um site, atualizar, copiar relatório completo da stack, adicionar regra na página de configurações)
- [ ] Versão em `package.json` foi incrementada
- [ ] git commit + push
- [ ] Se a versão for um ponto de release, publicar o release na interface do GitHub (tag como `v{version}`, alinhada com package.json)
- [ ] Aguardar o workflow de publicação concluir e confirmar que os artefatos zip / crx e sha256 estão nos assets do release

## Publicar na Chrome Web Store

O workflow não faz upload automático para a Chrome Web Store — a API de publicação do CWS exige um fluxo OAuth2; atualmente é feito manualmente:

1. Compacte a pasta `dist/` em zip (mesmo artefato zip do workflow)
2. [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole) → Fazer upload de nova versão
3. Preencha as notas de atualização e aguarde a revisão (geralmente 1-3 dias úteis)
