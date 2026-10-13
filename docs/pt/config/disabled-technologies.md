# Bloquear tecnologias específicas

As alternâncias de categoria filtram por categoria; se você quiser bloquear apenas algumas tecnologias específicas sem desativar uma categoria inteira, use este campo de texto.

## Como usar

Uma tecnologia por linha; o nome não diferencia maiúsculas de minúsculas e espaços no início/fim são removidos automaticamente:

```text
Google Analytics
Baidu Analytics
WordPress Plugin: akismet
Cloudflare
```

Após salvar, essas tecnologias não aparecerão mais na lista principal do popup, independentemente de qual categoria pertencem, qual é o nível de confiança ou qual é a origem.

::: tip
A correspondência de nomes usa `normalizeTechName(name)`: remove espaços, converte para minúsculas, remove pontuação. Portanto, `WordPress` e `wordpress` são equivalentes, assim como `Google Analytics` e `google-analytics`.
:::

## Cenários indicados para bloqueio

- **Você já sabe que um site usa algo e não quer vê-lo**: seu próprio site não precisa mostrar Cloudflare / Vercel toda vez
- **Evitar falsos positivos**: uma regra de detecção tem taxa de falso positivo alta e você não quer esperar por uma correção — bloqueie temporariamente
- **Simplificar a saída**: bloqueie RSS / Atom / Service Worker / HTTPS para reduzir resultados genéricos e tornar a lista mais focada

## Prioridade entre bloqueio e alternâncias de categoria

Os dois **se somam**: primeiro filtrado pelas alternâncias de categoria, depois pela lista de bloqueio.

## Relação com dados brutos

Tecnologias bloqueadas **apenas não são exibidas** — não são removidas do JSON bruto. O painel "Dados brutos" ainda recebe os dados completos para consulta posterior.

## Exemplo

Suponha que você queira ver apenas CDNs que não sejam Cloudflare, mantendo toda a categoria CDN ativa. Configure:

```text
Cloudflare
```

O Cloudflare não aparece mais no popup, mas Akamai / Fastly e outros CDNs continuam visíveis.
