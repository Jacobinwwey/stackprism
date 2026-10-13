# Interpretando resultados

## Confiança

Cada tecnologia tem um indicador de confiança com três níveis:

| Nível   | Cor    | Significado                                                                                                      |
| ------- | ------ | ---------------------------------------------------------------------------------------------------------------- |
| **Alta** | Verde  | Sinal forte encontrado: variável global (ex.: `window.React`), seletor DOM exclusivo, URL de recurso específica (ex.: `/_next/`) |
| **Média** | Amarelo | Sinal médio encontrado: correspondência difusa em cabeçalho de resposta, prefixo de classe CSS, conjunto de variáveis CSS |
| **Baixa** | Cinza  | Sinal fraco encontrado: nome de arquivo de script genérico de fallback (ex.: `*.min.js`), regex difusa |

Na aba "Destaques", apenas resultados de alta confiança são exibidos por padrão.

## Evidências

Cada cartão exibe até 4 linhas de evidências. Exemplos comuns incluem marcadores DOM, URLs de recursos, cabeçalhos de resposta e registros de carregamento dinâmico, como:

```text
- Nó DOM com marcador React Fiber presente
- URL de recurso correspondendo unpkg.com/react@18.2.0/umd/react.production.min.js
- Cabeçalho de resposta X-Powered-By: Next.js
```

Ao investigar falsos positivos, comece pelas evidências. Elas geralmente revelam se o problema está em uma regra de recurso, em uma regra de cabeçalho de resposta ou em uma correspondência de DOM/classe muito ampla.

## Origem

As etiquetas de origem indicam de onde o resultado foi detectado:

| Etiqueta de origem              | Fonte                                                                   |
| ------------------------------- | ----------------------------------------------------------------------- |
| `cabeçalho de resposta`         | Cabeçalhos de resposta HTTP do documento principal (server / x-powered-by / set-cookie, etc.) |
| `cabeçalho de resposta · API`   | Cabeçalhos de resposta de alguma requisição XHR / fetch da página atual |
| `cabeçalho de resposta · iframe`| Cabeçalhos de resposta do documento principal de um iframe aninhado     |
| `monitoramento dinâmico`        | Recursos / scripts carregados dinamicamente coletados continuamente por content script + MutationObserver |
| `monitoramento dinâmico · após interação` | Recursos carregados após ação do usuário (popup, login, pagamento)  |
| `tema WordPress`                | Inferido do cabeçalho do style.css do tema                             |

**Clique em qualquer etiqueta de origem** para abrir um painel pela parte inferior, exibindo o subconjunto de dados JSON brutos correspondente a **essa tecnologia nessa origem**. Isso mostra diretamente os cabeçalhos de resposta brutos, a lista de URLs de recursos ou o snapshot dinâmico, sem precisar procurar no JSON completo.

## Ordenação

Ordem de classificação padrão:

1. Índice de categoria (frameworks frontend → frameworks UI → builds/runtimes → CDN → ...)
2. Por confiança decrescente dentro da mesma categoria (alta → média → baixa)
3. Por localeCompare do nome da tecnologia dentro do mesmo nível de confiança

Ao mudar para uma categoria específica, a ordenação ocorre apenas dentro dessa categoria. A aba "Destaques" mostra todas as tecnologias de alta confiança; se não houver nenhuma, recua para as 30 primeiras por confiança decrescente em todas as tecnologias.

## Mesclagem de duplicatas

Se a mesma tecnologia for detectada de múltiplas origens (por exemplo, React aparece tanto nos cabeçalhos de resposta quanto no DOM), ela não é exibida duas vezes — é mesclada em um único resultado, com o nível de confiança mais alto, os arrays de evidências mesclados e deduplicados, e o array de origens listando todas as correspondências.

## Sem detecção não significa sem uso

A ferramenta detecta "quais pistas a página expõe ao navegador". Se um site:

- Remove todos os rastros de runtime após SSR (como sites Astro pré-renderizados estaticamente)
- Limpa todos os cabeçalhos de servidor personalizados
- Faz hash de todos os nomes de arquivo do bundle sem incluir o nome original do framework

O plugin pode detectar muito pouco ou nada. Geralmente isso não significa que as regras estão faltando — significa que a página não expôs pistas suficientes ao navegador.

Pistas de build frontend também não equivalem a runtime backend. Por exemplo, a presença de `/_next/`, `/_nuxt/` ou artefatos Vite indica apenas a cadeia de build frontend — não se deve inferir diretamente que o servidor é Node.js. A linguagem backend geralmente é identificada pelo cabeçalho `Server`, `X-Powered-By`, nomes de cookies ou cabeçalhos de resposta específicos do framework.

## Botão de correção

O botão "Detecção imprecisa, clique para corrigir" em cada cartão abre um Issue no GitHub com as seguintes informações preenchidas automaticamente:

- URL da página atual
- JSON deste resultado de detecção
- Evidências que você vê
- Número de versão da extensão

Descreva "o que está errado" ou "o que deveria ser detectado" na descrição. O mantenedor ajustará a regra correspondente em [`rules/`](https://github.com/setube/stackprism/tree/main/public/rules).
