const assert = require('node:assert/strict');
require('../kernelPlay/js/escalonador.js');
const Sim = global.JogoEscalonador.Simulacao;
const checks = [];
function test(name, fn) { fn(); checks.push(name); }
test('N:1 impede paralelismo de threads do mesmo processo', () => {
 const s=new Sim('USER'); assert(s.despachar('100-0')); assert.equal(s.despachar('100-1'),false); assert(s.despachar('101-0'));
});
test('1:1 permite paralelismo e bloqueia somente a thread em E/S', () => {
 const s=new Sim(); s.despachar('100-0'); s.despachar('100-1'); s.tick(); s.tick();
 assert.equal(s.tarefas[0].estado,'bloqueado'); assert.equal(s.tarefas[1].estado,'executando');
 assert.equal(s.tarefas[0].acorda-s.tempo,3);
 s.tick(); s.tick(); assert.equal(s.tarefas[0].estado,'bloqueado'); s.tick(); assert.equal(s.tarefas[0].estado,'pronto');
});
test('N:1 bloqueia e libera o grupo durante E/S bloqueante', () => {
 const s=new Sim('USER'); s.despachar('100-0'); s.tick(); s.tick();
 assert(s.tarefas.filter(t=>t.pid===100).every(t=>t.estado==='bloqueado'));
 for(let i=0;i<3;i++)s.tick(); assert(s.tarefas.filter(t=>t.pid===100).every(t=>t.estado==='pronto'));
});
test('60 passos completos e encerramento idempotente', () => {
 const s=new Sim(); const t=s.tarefas.find(t=>t.pid===101); t.total=t.restante=100; t.io=[]; s.despachar(t.uid);
 for(let i=0;i<60;i++)s.tick(); assert.equal(t.restante,40); assert(s.finalizado); assert.equal(s.tempo,60);
 const r=JSON.stringify(s.resultado()); s.tick(); assert.equal(JSON.stringify(s.resultado()),r);
});
test('Espera longa preserva tarefa e reinicia episódio ao receber CPU',()=>{
 const s=new Sim(); for(let i=0;i<12;i++)s.tick(); assert.equal(s.tarefas[0].estado,'pronto'); assert.equal(s.tarefas[0].alertou,true);
 s.despachar('100-0'); assert.equal(s.tarefas[0].seguida,0); s.preemptar(0); assert.equal(s.preempcoes,1);
});
test('Mesmas chegadas e carga nos dois modelos',()=>{
 const a=new Sim(), b=new Sim('USER'); for(let i=0;i<60;i++){a.tick(); b.tick();}
 assert.deepEqual(a.tarefas,b.tarefas);
});
test('Contagem de processo aguarda as duas threads',()=>{
 const s=new Sim(); s.tarefas.slice(0,2).forEach(t=>{t.restante=1;t.io=[]});
 s.despachar('100-0'); s.tick(); assert.equal(s.threads,1); assert.equal(s.processos,0);
 s.despachar('100-1'); s.tick(); assert.equal(s.threads,2); assert.equal(s.processos,1);
});
test('Métricas de resposta, espera e utilização',()=>{
 const s=new Sim(); s.tick(); s.despachar('101-0'); s.tick();
 assert.equal(s.resultado().respostaMedia,1); assert.equal(s.resultado().utilizacao,25); assert.equal(s.tarefas.find(t=>t.pid===101).espera,1);
});
test('Pausa, saída e fim impedem callbacks adicionais',()=>{
 let next=0; const timers=new Map(); const oldSet=global.setInterval, oldClear=global.clearInterval;
 global.setInterval=fn=>{timers.set(++next,fn);return next};global.clearInterval=id=>timers.delete(id);
 const root={addEventListener(){},removeEventListener(){}};
 global.document={getElementById:()=>root,addEventListener(){},removeEventListener(){},hidden:false};
 const J=global.JogoEscalonador, render=J.prototype.render;J.prototype.render=function(){};
 let finishes=0;const j=new J('game',()=>finishes++);j.iniciar();j.pausar();assert.equal(timers.size,0);assert.equal(j.sim.tempo,0);
 j.pausado=false;j.agendar();const callback=[...timers.values()][0];for(let i=0;i<60;i++)callback();assert.equal(finishes,1);assert.equal(timers.size,0);callback();assert.equal(finishes,1);
 j.destruir();callback();assert.equal(finishes,1);assert.equal(timers.size,0);
 J.prototype.render=render;global.setInterval=oldSet;global.clearInterval=oldClear;
});
console.log(checks.map(x=>'OK '+x).join('\n'));
