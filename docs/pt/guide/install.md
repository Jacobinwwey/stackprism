# Instalação e ativação

StackPrism é compatível com navegadores baseados em Chromium (Chrome, Edge, Brave, Opera, Vivaldi, Arc, etc.) e requer suporte a Manifest V3.

## Instalar por uma loja de extensões

- [Chrome Web Store](https://chromewebstore.google.com/detail/stackprism/cagpdifljieeiajlhlcboelglkalofak)
- [Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/stackprism/ojgmhlogaoiegdonnlnibeoikbleccno)
- [Firefox Add-ons](https://addons.mozilla.org/firefox/addon/stackprism/)

Se o navegador não for identificado automaticamente, escolha a loja correspondente.

## Método 1: Baixar o crx do Release

1. Acesse [GitHub Releases](https://github.com/setube/stackprism/releases)
2. Escolha a versão mais recente e baixe `stackprism-v{version}.crx`
3. Na barra de endereços do navegador, acesse `chrome://extensions/` (no Edge: `edge://extensions/`) e ative o "Modo do desenvolvedor" no canto superior direito
4. Arraste o arquivo `.crx` baixado para a página de extensões
5. Quando o popup aparecer, confirme "Adicionar extensão"

::: tip
O Chrome às vezes bloqueia a instalação de arquivos .crx arrastados (exibe "Não foi possível adicionar aplicativos, extensões e scripts do usuário deste site"). Nesse caso, use o Método 2.
:::

## Método 2: Baixar o zip do Release e carregar descompactado

1. Acesse [GitHub Releases](https://github.com/setube/stackprism/releases) e baixe `stackprism-v{version}.zip`
2. Descompacte em um diretório estável (**não exclua o diretório — a extensão depende dele para funcionar**)
3. Acesse `chrome://extensions/` e ative o "Modo do desenvolvedor"
4. Clique em "Carregar sem compactação"
5. Selecione o diretório que você acabou de descompactar

## Método 3: Compilar a partir do código-fonte localmente

Indicado para desenvolvedores ou quem queira acompanhar o branch principal mais recente.

```bash
git clone https://github.com/setube/stackprism.git
cd stackprism
bun install
bun run build
```

O artefato de build fica em `dist/`. Carregue o diretório `dist/` no modo desenvolvedor em `chrome://extensions/`.

Após modificar o código-fonte, basta executar `bun run build` novamente e clicar no botão de atualização no cartão da extensão para carregar a nova versão.

## Ativação e permissões

Na primeira instalação, as seguintes permissões são solicitadas:

| Permissão    | Finalidade                                                                     |
| ------------ | ------------------------------------------------------------------------------ |
| `tabs`       | Ler a URL e o título da aba atual                                              |
| `activeTab`  | Injetar script de detecção na página ativa                                     |
| `scripting`  | Injetar page-detector / page-source-search no mundo principal da página        |
| `storage`    | Armazenar configurações, resultados de detecção em cache e preferência de tema |
| `webRequest` | Monitorar cabeçalhos de resposta para coletar server / x-powered-by, etc.      |
| `<all_urls>` | Executar em todas as páginas http(s)                                           |

O processo de detecção não depende de APIs externas: os arquivos de regras são empacotados localmente com a extensão, e os resultados transitam apenas entre a memória do navegador e o storage da extensão.

## Desinstalação

`chrome://extensions/` → localize o StackPrism → Remover. As configurações e o cache são apagados juntos.
