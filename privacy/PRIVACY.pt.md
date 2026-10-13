<div align="center">

[🇨🇳 简体中文](PRIVACY.zh-CN.md) · [🇬🇧 English](PRIVACY.en.md) · [🇹🇼 繁體中文](PRIVACY.zh-TW.md) · [🇯🇵 日本語](PRIVACY.ja.md) · [🇫🇷 Français](PRIVACY.fr.md) · [🇩🇪 Deutsch](PRIVACY.de.md) · **🇧🇷 Português** · [🇮🇹 Italiano](PRIVACY.it.md) · [🇨🇿 Čeština](PRIVACY.cs.md) · [🇵🇱 Polski](PRIVACY.pl.md)

</div>

# Política de Privacidade do StackPrism

Última atualização: 2026-05-12

## Visão Geral

StackPrism / Stack Prism (doravante denominado "esta extensão") é uma extensão de navegador de identificação de pilha de tecnologias web baseada em Chrome / Edge Manifest V3. Esta extensão leva sua privacidade muito a sério — todo o processamento de dados é feito localmente em seu próprio navegador, **sem upload, compartilhamento ou venda de qualquer dado seu para qualquer servidor remoto**.

## Dados Acessados

Para realizar a única função de "identificar a pilha de tecnologias usada na página que você está visitando", esta extensão **lê localmente** as seguintes informações quando você visita uma página ativamente. Todo o conteúdo lido **é processado apenas na memória do seu navegador ou no chrome.storage**, nunca saindo do seu navegador.

### 1. Conteúdo do Site

- Estrutura de nós DOM da página que você está visitando, nomes de classes CSS, variáveis CSS, tags `<meta>`
- Nomes de variáveis globais injetadas por `<script>` no objeto `window` da página (apenas os nomes são lidos, não os valores)
- URLs de recursos como JavaScript / CSS / iframes / imagens carregados pela página
- Os primeiros bytes dos arquivos JavaScript **já carregados** pela página (usando o cache do navegador, sem tráfego de rede adicional), usados para identificar comentários de copyright `/*! @license ... */` e URLs de entrada OAuth incorporadas em SPAs

### 2. Registros de Rede

- URL e título da página que você está visitando
- Cabeçalhos de resposta (campos Server, X-Powered-By, Set-Cookie, etc.) de requisições XHR / Fetch / iframe / WebSocket iniciadas pela página
- Versão do protocolo HTTP negociada pela página (HTTP/1.1 / HTTP/2 / HTTP/3)

## Uso dos Dados

Os dados acima são usados **exclusivamente** para:

- Correspondência local com o banco de regras integrado da extensão para identificar frameworks frontend, serviços backend, CDN, CMS, login, pagamento, análise e outras pilhas de tecnologia usadas na página
- Exibição dos resultados de identificação para você no popup da extensão

## Armazenamento de Dados

- **Resultados de identificação**: armazenados apenas no `chrome.storage.session`, destruídos quando o navegador é fechado, e salvos independentemente por aba
- **Suas configurações** (categorias desativadas, nomes de tecnologia na lista negra, regras personalizadas, preferências de tema, etc.): armazenadas no `chrome.storage.sync`, sincronizadas de forma criptografada pelo navegador com sua conta Google / Microsoft; esta extensão **não pode acessar** nenhum outro dado em sua conta
- Esta extensão **não** armazena HTML completo da página, valores completos de cookies, credenciais de login, conteúdo de formulários preenchidos, senhas ou qualquer outra informação sensível

## Transmissão de Dados

- Esta extensão **não** faz upload de seus dados de navegação, resultados de identificação, informações pessoais ou quaisquer outros dados para nenhum servidor remoto
- Sem telemetria, sem SDK de anúncios, sem análises de terceiros, sem relatórios de erros para a nuvem
- A extensão apenas inicia dois tipos de requisições de rede, **nenhuma** carregando qualquer informação de identidade ou dados de navegação seus:
  1. Busca assíncrona dos primeiros trechos de alguns arquivos JS **já carregados pela página que você está visitando** (usando o cache do navegador, sem tráfego de rede adicional), usada para varrer localmente comentários de copyright e URLs de entrada OAuth nesses JS
  2. Ícones de marca de tecnologia são **lidos preferencialmente da biblioteca de ícones integrada da extensão** (mais de 1.300 SVGs/PNGs de tecnologias populares já empacotados offline, sem nenhuma requisição de rede); apenas quando uma tecnologia não está na biblioteca de ícones integrada, um fallback é buscado de `cdn.simpleicons.org` (o corpo da requisição contém apenas um slug de nome de tecnologia pública, como react / vuedotjs / docker, sem a URL da página que você está visitando, resultados de identificação ou qualquer informação pessoal); se o CDN não carregar em 2 segundos, a extensão automaticamente recorre a blocos de letras iniciais gerados localmente, sem nunca bloquear o processo de identificação

## Compartilhamento com Terceiros

- Esta extensão **não** vende, compartilha ou transfere dados de usuários para terceiros
- Esta extensão **não** usa dados de usuários para qualquer finalidade não relacionada à "identificação de pilha de tecnologias"
- Esta extensão **não** é usada para empréstimos, avaliação de crédito ou finalidades similares

## Seus Direitos

Você pode a qualquer momento:

- Clicar no botão "Atualizar" no popup da extensão para redigitalizar a página atual
- Redefinir o cache de regras, desativar qualquer categoria, bloquear nomes de tecnologia específicos e adicionar regras personalizadas na página de configurações da extensão
- Desinstalar esta extensão em `chrome://extensions`; todos os dados de armazenamento local serão automaticamente excluídos pelo navegador

## Código Aberto

Esta extensão é totalmente open source; qualquer pessoa pode auditar o código-fonte para confirmar as práticas de privacidade:

https://github.com/setube/stackprism

A licença open source é [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/).

## Contato

Para qualquer dúvida relacionada à privacidade, entre em contato com o autor via GitHub Issues:

https://github.com/setube/stackprism/issues

## Alterações na Política

A versão mais recente desta política de privacidade é sempre publicada no [PRIVACY.md](https://github.com/setube/stackprism/blob/main/PRIVACY.md) deste repositório. Em caso de alterações significativas, a data da última atualização será atualizada simultaneamente.
