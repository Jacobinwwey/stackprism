---
layout: home

hero:
  name: StackPrism
  text: Visualizador de tecnologias web
  tagline: Abra o popup da extensão para ver os frameworks, CDNs, CMSs, analytics, logins, pagamentos e serviços SaaS detectados na página atual. Cada resultado inclui evidências e origem para facilitar a avaliação.
  image:
    src: /icon.svg
    alt: StackPrism
  actions:
    - theme: brand
      text: Instalação e ativação
      link: /pt/guide/install
    - theme: alt
      text: Ver no GitHub
      link: https://github.com/setube/stackprism/blob/main/i18n/README.pt.md

features:
  - icon: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z'/></svg>"
    title: Base de regras local
    details: As regras são empacotadas com a extensão. URLs, recursos, DOM, cabeçalhos de resposta e recursos dinâmicos são todos correspondidos localmente, sem necessidade de conta ou API externa.
  - icon: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z'/></svg>"
    title: Popup com cache prioritário
    details: O background organiza resultados leves antecipadamente. Ao abrir o popup, os resultados em destaque do cache são exibidos primeiro; o JSON bruto e os links de tecnologia são carregados sob demanda.
  - icon: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M15.39 4.39a1 1 0 0 0 1.68-.474 2.5 2.5 0 1 1 3.014 3.015 1 1 0 0 0-.474 1.68l1.683 1.682a2.414 2.414 0 0 1 0 3.414L19.61 15.39a1 1 0 0 1-1.68-.474 2.5 2.5 0 1 0-3.014 3.015 1 1 0 0 1 .474 1.68l-1.683 1.682a2.414 2.414 0 0 1-3.414 0L8.61 19.61a1 1 0 0 0-1.68.474 2.5 2.5 0 1 1-3.014-3.015 1 1 0 0 0 .474-1.68l-1.683-1.682a2.414 2.414 0 0 1 0-3.414L4.39 8.61a1 1 0 0 1 1.68.474 2.5 2.5 0 1 0 3.014-3.015 1 1 0 0 1-.474-1.68l1.683-1.682a2.414 2.414 0 0 1 3.414 0z'/></svg>"
    title: Regras personalizadas
    details: Na página de configurações, você pode adicionar suas próprias regras por palavras-chave, expressões regulares, seletores CSS e variáveis globais para cobrir sites não contemplados pelas regras integradas.
  - icon: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z'/></svg>"
    title: Resultados rastreáveis
    details: Nome da tecnologia, confiança, evidências e origem ficam todos no mesmo cartão. Ao investigar falsos positivos, você pode expandir a origem correspondente para ver os dados brutos.
  - icon: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M12.67 19a2 2 0 0 0 1.416-.586l6.13-6.13a4.992 4.992 0 0 0 .832-2.65V5l-3 1.5L17.97 5h-1.97a4.992 4.992 0 0 0-2.65.832l-6.13 6.13a2 2 0 0 0-.586 1.416v3.288c0 .53.211 1.04.586 1.415l1.456 1.456c.375.375.884.586 1.414.586h3.287Z'/><path d='M16 8 2 22'/><path d='M17.5 15H9'/></svg>"
    title: Saída filtrável
    details: Alternâncias de categoria, lista de bloqueio e a visualização de destaques reduzem o ruído. Os dados completos permanecem nos dados brutos para consulta posterior.
  - icon: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='m18 16 4-4-4-4'/><path d='m6 8-4 4 4 4'/><path d='m14.5 4-5 16'/></svg>"
    title: Regras revisáveis
    details: As regras integradas são mantidas em arquivos JSON por categoria. Adicionar novas detecções geralmente requer apenas uma regra nova e algumas evidências reproduzíveis.
---

## O que é isto

StackPrism é uma extensão Chromium MV3. Ela não "vê" o interior do servidor — apenas organiza as pistas que o navegador consegue ver: recursos de script e estilo, marcadores no DOM, variáveis globais, cabeçalhos de resposta, recursos carregados dinamicamente, folhas de estilo de temas WordPress, etc.

Cada resultado é anotado com **confiança**, **evidências** e **origem**. Se um resultado parecer incorreto, confira as evidências primeiro e depois clique na origem para expandir o JSON bruto correspondente.

## Por onde começar

- Primeira instalação: veja [Instalação e ativação](/pt/guide/install.md)
- Não entende os resultados: veja [Interpretando resultados](/pt/guide/results.md)
- Quer filtrar ruído ou adicionar regras: veja o [Guia de configuração](/pt/config/)
- Quer alterar regras integradas: veja [Formato de arquivo de regras](/pt/dev/rule-format.md) e [Contribuindo com regras](/pt/dev/contribute-rules.md)

## Limites de precisão

Os resultados de detecção não são um relatório de auditoria. Se um site ocultar cabeçalhos de resposta, fizer hash de todos os nomes de recursos ou remover rastros de framework após SSR, o plugin pode retornar muito poucos resultados ou nenhum.

A decisão de design deste projeto é expor o raciocínio da detecção para que o usuário possa entender "por que foi detectado assim". As regras são continuamente aprimoradas, mas suposições de baixa qualidade nunca são apresentadas como conclusões definitivas.
