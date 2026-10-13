# Estilo personalizado do popup

A página de configurações tem um campo de entrada de CSS personalizado. O CSS salvo aqui é injetado no `<head>` do popup, da página de configurações e da página de ajuda, substituindo os estilos padrão.

## Exemplo: tornar os indicadores de confiança mais visíveis

```css
.confidence.high {
  background: #14532d;
  color: #fff;
  font-weight: 700;
}

.confidence.medium {
  background: #ca8a04;
  color: #fff;
}
```

## Exemplo: mudar a cor de destaque

```css
:root {
  --accent: #d946ef;
  --accent-dark: #a21caf;
  --accent-soft: rgba(217, 70, 239, 0.1);
}
```

O seletor de segmento no popup, o hover em links de tecnologia, o botão de atualização e outros elementos referenciam esses tokens — mudar esses valores atualiza todos eles ao mesmo tempo.

## Exemplo: aumentar o tamanho da fonte

```css
body {
  font-size: 15px;
}

.tech-name {
  font-size: 14px;
}
```

## Local de injeção

Todo o CSS personalizado é colocado em uma tag `<style id="stackPrismCustomCss">` com ID fixo e inserido no final do `<head>`. Salvar novamente substitui o conteúdo antigo; não há acumulação.

## Escopo

- Popup
- Página de configurações (options page)
- Página de ajuda (help page)

Não afeta páginas web comuns — este CSS só tem efeito na própria UI da extensão.

## Dica de depuração

Abra o popup ou a página de configurações e clique com o botão direito → Inspecionar. No painel Elements você pode ver a tag de estilo injetada e confirmar se os seletores estão correspondendo.

## Limitações

- Limite de tamanho: `CUSTOM_RULE_LIMITS.css` (padrão de 10.000 caracteres); exceder esse limite fará o salvamento falhar
- Não é possível importar arquivos CSS externos (`@import` não é permitido pela CSP da extensão)
- Não é possível usar `url(...)` para referenciar imagens remotas que não sejam base64
