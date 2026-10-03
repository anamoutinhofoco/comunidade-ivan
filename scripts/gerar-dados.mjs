// Valida dados/ivan.json e gera public/dados/ivan.json, que o painel consome.
// Roda no build do Vercel (npm run build).
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const dados = JSON.parse(readFileSync(join(raiz, 'dados', 'ivan.json'), 'utf8'));

const ISO = /^\d{4}-\d{2}-\d{2}$/;
const erros = [];
const exigir = (cond, msg) => { if (!cond) erros.push(msg); };

for (const [lista, campo] of [['decisoes', 'id'], ['frentes', 'id'], ['apoio', 'codigo'], ['producao', 'codigo']]) {
  const ids = new Set();
  for (const item of dados[lista] ?? []) {
    exigir(!ids.has(item[campo]), `${lista}: ${campo} duplicado ${item[campo]}`);
    ids.add(item[campo]);
  }
}
for (const [lista, campo] of [['disparos', 'codigo'], ['checkpoints', 'id']]) {
  const ids = new Set();
  for (const item of dados[lista] ?? []) {
    exigir(!ids.has(item[campo]), `${lista}: ${campo} duplicado ${item[campo]}`);
    ids.add(item[campo]);
    exigir(ISO.test(item.data), `${lista} ${item[campo]}: data inválida (${item.data}); use AAAA-MM-DD`);
    exigir(!item.hora || /^\d{2}:\d{2}$/.test(item.hora), `${lista} ${item[campo]}: hora inválida (${item.hora})`);
  }
}
const pecas = new Map((dados.producao ?? []).map((p) => [p.codigo, p]));
const apoios = new Set((dados.apoio ?? []).map((a) => a.codigo));
for (const x of dados.disparos ?? []) {
  exigir(x.mensagem, `${x.codigo}: falta a mensagem`);
  if (x.criativo) {
    exigir(pecas.has(x.criativo), `${x.codigo}: peça ${x.criativo} não existe em producao`);
    exigir(pecas.get(x.criativo)?.disparo === x.codigo, `${x.codigo}: a peça ${x.criativo} aponta para outro disparo`);
  }
  for (const a of x.apoios ?? []) exigir(apoios.has(a), `${x.codigo}: apoio ${a} não existe`);
}
for (const p of dados.producao ?? []) exigir(ISO.test(p.enviarEm), `producao ${p.codigo}: data inválida (${p.enviarEm})`);
for (const d of dados.decisoes) exigir(!d.prazo || ISO.test(d.prazo), `${d.id}: prazo inválido (${d.prazo})`);

if (erros.length) throw new Error('Dados inválidos:\n - ' + erros.join('\n - '));

dados.geradoEm = new Date().toISOString();

mkdirSync(join(raiz, 'public', 'dados'), { recursive: true });
writeFileSync(join(raiz, 'public', 'dados', 'ivan.json'), JSON.stringify(dados, null, 2) + '\n');
console.log('✓ dados/ivan.json → public/dados/ivan.json');
console.log(`  ${dados.frentes.length} frentes · ${dados.decisoes.length} decisões · ${dados.disparos.length} disparos · ${dados.producao.length} peças · ${dados.apoio.length} mensagens de apoio · ${dados.checkpoints.length} checkpoints`);
