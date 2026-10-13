# Guia de configuração

A página de configurações pode ser aberta pelo botão "Configurações" no topo do popup ou encontrando o cartão do StackPrism em `chrome://extensions/` e clicando em "Detalhes → Opções da extensão".

A página de configurações é dividida em cinco seções:

- [Alternâncias de categoria](./categories.md) — ativar/desativar as 24 categorias (desativar uma oculta suas tecnologias no popup)
- [Bloquear tecnologias específicas](./disabled-technologies.md) — bloquear tecnologias pelo nome (ignora categoria)
- [Estilo personalizado do popup](./custom-css.md) — escrever CSS para sobrescrever os estilos do popup / página de configurações
- [Regras personalizadas](./custom-rules.md) — adicionar suas próprias regras de detecção via formulário ou JSON
- [Importar/exportar regras em JSON](./json-export.md) — sincronizar conjuntos de regras entre múltiplos navegadores / dispositivos

## Local de armazenamento das configurações

Todas as configurações ficam em `chrome.storage.sync` e sincronizam entre dispositivos com sua conta Google / Edge. A chave é `stackPrismSettings`. Se não quiser sincronizar, desative a sincronização do próprio navegador.

O limite de capacidade do `chrome.storage.sync` é 100 KB, com no máximo 8 KB por chave. Isso significa:

- O número de regras personalizadas tem um limite (cerca de 100 é seguro)
- O tamanho do CSS personalizado tem um limite (não mais que 10.000 caracteres)
- A lista de bloqueio não pode ser muito longa

Os limites reais são definidos por `CUSTOM_RULE_LIMITS` em `src/types/settings.ts`; excedê-los fará a operação de salvamento falhar com um erro.

## Quando as alterações entram em vigor

| Alteração                                      | Quando entra em vigor                              |
| ---------------------------------------------- | -------------------------------------------------- |
| Alternâncias de categoria / bloquear tecnologias / CSS personalizado | Imediatamente ao reabrir o popup |
| Regras personalizadas                          | Após salvar, na próxima atualização da página + reabertura do popup |
| Importação de JSON                             | Mesmo que acima                                    |

Clicar em "Salvar configurações" grava no storage imediatamente; não é necessário recarregar a página de configurações.
