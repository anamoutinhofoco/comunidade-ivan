# Dr. Ivan Rollemberg — central do projeto

Site estático (HTML/CSS/JS, sem framework) no design system **Foco**, no mesmo formato do painel da HLS. É a central do projeto Dr. Ivan (Método Human e Health Business) para acompanhar outubro de 2026. Duas páginas:

| Rota | Conteúdo |
|---|---|
| `/` | **Painel**, com abas: **Visão geral** (jornada e situação por frente) · **Agenda** (calendário em dia, semana e mês com os 12 disparos, checkpoints e decisões com prazo; clique na atividade para ver a mensagem pronta, a peça ligada e a regra de acompanhamento) · **Disparos** (boas-vindas, HB01 a HB12 e respostas de apoio AP02 a AP06, com botão de copiar) · **Criativos** (as 10 peças: enquetes, cards e fichas, vídeos e áudios, com a alternativa se atrasarem) · **Decisões** · **Operação** (fluxo e regras da planilha). Cada aba tem endereço próprio (ex.: `/#decisoes`). |
| `/planejamento` | **Planejamento de outubro de 2026**: direção, ecossistema e público, jornada, regras de comunicação, oferta, operação, medição e dependências. Tem botão "Salvar em PDF". |

## Como os dados funcionam

A fonte de verdade é **`dados/ivan.json`**. No build, `scripts/gerar-dados.mjs` valida o arquivo (ids duplicados, datas fora do formato `AAAA-MM-DD`, peça ou apoio que não existe) e gera `public/dados/ivan.json`.

| Bloco | O que é |
|---|---|
| `frentes` | Situação, estado e próximo passo de cada frente (`tom`: `aprovado`, `revisao`, `ajuste`, `atrasado`, `neutro`). |
| `decisoes` | Decisões em aberto. `prazo` é opcional; `status` `Aprovado`, `Resolvido` ou `Confirmado` fecha a decisão. |
| `disparos` | HB01 a HB12: data, hora, etapa, mensagem pronta, objetivo, CTA, peça ligada (`criativo`), aprovação, métrica e regra. Alimenta a Agenda. |
| `producao` | As peças (ENQ, VID, CARD, AUD, CAR): texto ou roteiro, direção, responsável, status e alternativa. Cada uma aponta para um disparo. |
| `apoio` | AP01 (boas-vindas) a AP06 (respostas no privado e alternativa de HB12). |
| `checkpoints` | Verificações com data. Alimenta a Agenda. |
| `operacao` | Fluxo e regras da aba Operação. |

Os textos dos disparos, das peças e das mensagens de apoio vieram da planilha `Disparos_Ivan_Outubro_2026.xlsx`, sem alteração. Para atualizar o status de um disparo ou de uma peça, edite `status` (ex.: `Enviado`, `Aprovado`) e `aprovacao` no JSON; itens com data vencida e ainda abertos aparecem como atrasados.

A página `/planejamento` é HTML escrito à mão; as tabelas dela (disparos, peças, checkpoints e decisões) são uma cópia dos dados de 03/10/2026 e precisam ser atualizadas à parte.

## Rodar localmente

Requer Node 18+, sem dependências.

```bash
npm run dev      # gera o JSON e sobe em http://localhost:3100
npm run build    # só gera public/dados/ivan.json
```

Para simular outra data no painel, use `?hoje=AAAA-MM-DD` (ex.: `http://localhost:3100/?hoje=2026-10-05`).

## Publicar no Vercel

Importe a pasta como projeto (framework **Other**); o `vercel.json` define build, saída e URLs limpas. As páginas enviam `noindex`. Ative **Deployment Protection** se o painel não deve ficar aberto.
