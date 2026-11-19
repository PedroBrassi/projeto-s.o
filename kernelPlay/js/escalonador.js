/* Seja o Escalonador: modelo didático, com um segundo por passo. */
(function (global) {
  "use strict";
  class SimulacaoEscalonador {
    constructor(modo = "KERNEL") {
      this.modo = modo; this.tempo = 0; this.duracao = 60;
      this.tarefas = []; this.cpus = [null, null]; this.eventos = [];
      this.pontos = 0; this.processos = 0; this.threads = 0;
      this.preempcoes = 0; this.esperasLongas = 0; this.ocupacao = 0;
      this.proximoPid = 100; this.finalizado = false;
      this.gerar(0); this.gerar(1); this.gerar(2);
    }
    gerar(indice) {
      // Cargas e E/S predeterminadas: os dois modos recebem o mesmo cenário.
      const modelos = [
        { nome: "web-srv", total: 8, threads: 2, io: [2, 5] },
        { nome: "gcc", total: 12, threads: 1, io: [] },
        { nome: "bash", total: 5, threads: 1, io: [2] },
        { nome: "postgres", total: 8, threads: 1, io: [2, 5] }
      ];
      const m = modelos[indice % modelos.length], pid = this.proximoPid++;
      for (let i = 0; i < m.threads; i++) this.tarefas.push({
        uid: `${pid}-${i}`, pid, nome: m.nome, thread: m.threads > 1,
        rotulo: `${pid}${m.threads > 1 ? ` / T${i + 1}` : ""}`,
        total: m.total, restante: m.total, io: i === 0 ? m.io.slice() : [4],
        estado: "pronto", chegada: this.tempo, primeiro: null,
        espera: 0, seguida: 0, alertou: false, acorda: 0, motivo: ""
      });
      this.log(`Chegada: PID ${pid}, ${m.nome}${m.threads > 1 ? " (2 threads)" : ""}.`);
    }
    log(texto) { this.eventos.unshift(texto); this.eventos.length = Math.min(8, this.eventos.length); }
    despachar(uid) {
      if (this.finalizado) return false;
      const t = this.tarefas.find(x => x.uid === uid && x.estado === "pronto");
      const core = this.cpus.indexOf(null);
      if (!t || core < 0) return false;
      if (this.modo === "USER" && this.cpus.some(x => x && x.pid === t.pid)) {
        this.log("N:1: as threads deste processo compartilham uma única entidade escalonável do kernel.");
        return false;
      }
      t.estado = "executando"; t.seguida = 0; t.alertou = false;
      if (t.primeiro === null) t.primeiro = this.tempo;
      this.cpus[core] = t; return true;
    }
    preemptar(core) {
      const t = this.cpus[core];
      if (!t || this.finalizado) return false;
      t.estado = "pronto"; this.cpus[core] = null;
      this.preempcoes++; this.pontos -= 15;
      this.log(`Preempção manual do PID ${t.pid}: −15 pontos (penalidade do jogo).`);
      return true;
    }
    tick() {
      if (this.finalizado) return;
      // Mede a espera no intervalo que vai ser executado.
      this.tarefas.filter(t => t.estado === "pronto").forEach(t => {
        t.espera++; t.seguida++;
        if (t.seguida >= 12 && !t.alertou) {
          t.alertou = true; this.esperasLongas++; this.pontos -= 40;
          this.log(`PID ${t.pid}: espera prolongada; risco de starvation (−40).`);
        }
      });
      const fim = this.tempo + 1;
      // Desbloqueia apenas ao fim do intervalo, sem consumir E/S recém-iniciada.
      const bloqueadosAnteriores = this.tarefas.filter(t => t.estado === "bloqueado");
      this.cpus.slice().forEach((t, core) => {
        if (!t) return;
        this.ocupacao++; t.restante--;
        if (t.restante === 0) {
          t.estado = "concluido"; this.cpus[core] = null;
          if (t.thread) this.threads++;
          if (this.tarefas.filter(x => x.pid === t.pid).every(x => x.estado === "concluido")) this.processos++;
          this.pontos += t.io.length ? 120 : 100;
          this.log(`Concluído: ${t.rotulo}.`);
        } else if (t.io.includes(t.total - t.restante)) {
          this.cpus[core] = null;
          const grupo = this.modo === "USER" && t.thread
            ? this.tarefas.filter(x => x.pid === t.pid && x.estado !== "concluido") : [t];
          grupo.forEach(x => {
            x.estado = "bloqueado"; x.acorda = fim + 3;
            x.motivo = x === t ? "E/S bloqueante" : "processo bloqueado (N:1)";
          });
          this.log(`PID ${t.pid}: E/S bloqueante por 3 s${grupo.length > 1 ? "; todas as threads aguardam em N:1" : ""}.`);
        }
      });
      bloqueadosAnteriores.filter(t => t.acorda <= fim).forEach(t => { t.estado = "pronto"; t.motivo = ""; });
      this.tempo = fim;
      if (this.tempo < this.duracao && this.tempo % 5 === 0) this.gerar(this.tempo / 5 + 2);
      if (this.tempo >= this.duracao) this.finalizado = true;
    }
    resultado() {
      const atendidas = this.tarefas.filter(t => t.primeiro !== null);
      return {
        pontos: this.pontos, ciclos: Math.max(0, Math.round(this.pontos / 10)),
        processos: this.processos, threads: this.threads,
        esperaMedia: this.tarefas.reduce((s, t) => s + t.espera, 0) / this.tarefas.length,
        respostaMedia: atendidas.length ? atendidas.reduce((s, t) => s + t.primeiro - t.chegada, 0) / atendidas.length : null,
        utilizacao: this.tempo ? 100 * this.ocupacao / (2 * this.tempo) : 0
      };
    }
  }
  class JogoEscalonador {
    constructor(containerId, aoFinalizarTurno) {
      this.container = document.getElementById(containerId);
      this.aoFinalizarTurno = aoFinalizarTurno || (() => {});
      this.modo = "KERNEL"; this.sim = new SimulacaoEscalonador(this.modo);
      this.iniciado = false; this.pausado = false; this.destruido = false;
      this.resultados = {}; this.timer = null;
      this.onClick = e => this.acionar(e);
      this.onVisibility = () => { if (document.hidden && this.iniciado && !this.sim.finalizado) this.pausar(); };
      this.container.addEventListener("click", this.onClick);
      document.addEventListener("visibilitychange", this.onVisibility);
      this.render();
    }
    destruir() {
      this.destruido = true; clearInterval(this.timer); this.timer = null;
      this.container.removeEventListener("click", this.onClick);
      document.removeEventListener("visibilitychange", this.onVisibility);
    }
    iniciar() {
      clearInterval(this.timer);
      this.sim = new SimulacaoEscalonador(this.modo); this.iniciado = true; this.pausado = false;
      this.agendar(); this.render();
    }
    agendar() {
      // Um passo corresponde a 1 s simulado; abas ocultas pausam a partida.
      this.timer = setInterval(() => {
        if (this.destruido || this.pausado || this.sim.finalizado) return;
        this.sim.tick();
        if (this.sim.finalizado) {
          clearInterval(this.timer); this.timer = null;
          const r = this.sim.resultado(); this.resultados[this.modo] = r;
          this.aoFinalizarTurno(r);
        }
        this.render();
      }, 1000);
    }
    pausar() { clearInterval(this.timer); this.timer = null; this.pausado = true; this.render(); }
    acionar(e) {
      const b = e.target.closest("button[data-esc]");
      if (!b || !this.container.contains(b) || this.destruido) return;
      const acao = b.dataset.esc;
      if (acao === "iniciar") this.iniciar();
      if (acao === "modo" && (!this.iniciado || this.sim.finalizado)) {
        this.modo = this.modo === "KERNEL" ? "USER" : "KERNEL";
        this.sim = new SimulacaoEscalonador(this.modo); this.iniciado = false;
      }
      if (acao === "pausa" && this.iniciado && !this.sim.finalizado) {
        if (this.pausado) { this.pausado = false; this.agendar(); } else this.pausar();
      }
      if (this.iniciado && !this.pausado && !this.sim.finalizado) {
        if (acao === "despachar") this.sim.despachar(b.dataset.uid);
        if (acao === "preemptar") this.sim.preemptar(Number(b.dataset.core));
      }
      this.render();
    }
    render() {
      const s = this.sim, ativo = this.iniciado && !s.finalizado;
      const jogavel = ativo && !this.pausado;
      const foco = this.container.contains(document.activeElement) ? document.activeElement : null;
      const chave = foco && [foco.dataset.esc, foco.dataset.uid || foco.dataset.core || ""];
      const r = s.resultado();
      const cartao = t => `<button class="esc-card" data-esc="despachar" data-uid="${t.uid}" ${jogavel ? "" : "disabled"}>
        <span class="esc-card-top"><b>${t.nome}</b><span class="esc-tag">${t.rotulo}</span></span>
        <small>${t.thread ? "Thread" : "Processo"} · CPU restante: ${t.restante} s · espera: ${t.espera} s</small>
        <span class="esc-prog"><span style="width:${100 * (t.total - t.restante) / t.total}%"></span></span>
        <small>Clique para despachar em um núcleo livre.</small></button>`;
      const vazio = '<p class="esc-vazio">Nenhuma tarefa</p>';
      this.container.innerHTML = `<div class="esc-wrap">
        <p class="esc-explica">Clique em uma tarefa pronta para ocupar um núcleo; clique no núcleo ocupado para preemptar.
        Em <b>1:1</b>, threads podem executar em paralelo e bloquear individualmente. Em <b>N:1</b>, as threads de um processo compartilham uma entidade do kernel; nesta simulação, uma E/S bloqueante suspende o processo inteiro.</p>
        <div class="esc-barra-topo">
          <button class="trocar" data-esc="modo" ${ativo ? "disabled" : ""}>Modelo: ${this.modo === "KERNEL" ? "1:1 (kernel)" : "N:1 (usuário)"}</button>
          <button class="trocar" data-esc="iniciar" ${ativo ? "disabled" : ""}>${s.finalizado ? "Repetir cenário" : "Iniciar turno"}</button>
          <button class="trocar" data-esc="pausa" ${ativo ? "" : "disabled"}>${this.pausado ? "Continuar" : "Pausar"}</button>
        </div>
        <div class="esc-hud">${[
          ["Tempo simulado restante", `${60 - s.tempo} s`], ["Pontos", s.pontos], ["Processos concluídos", s.processos],
          ["Threads concluídas", s.threads], ["Preempções manuais", s.preempcoes], ["Esperas longas", s.esperasLongas]
        ].map(([a, b]) => `<div class="esc-stat"><span>${a}</span><strong>${b}</strong></div>`).join("")}</div>
        <p role="status" class="esc-status">${s.finalizado ? "Turno concluído. Compare o mesmo cenário no outro modelo." : this.pausado ? "Partida pausada. Clique em Continuar." : ativo ? "Partida em andamento." : "Escolha o modelo e inicie o turno de 60 segundos simulados."}</p>
        <div class="esc-board">
          <section class="esc-col"><h2>Prontos <small>Aguardando CPU</small></h2><div class="esc-lista">${s.tarefas.filter(t => t.estado === "pronto").map(cartao).join("") || vazio}</div></section>
          <section class="esc-col"><h2>CPU <small>2 núcleos</small></h2><div class="esc-cpus">${s.cpus.map((t, i) => `<button class="esc-core ${t ? "ocupado" : "livre"}" data-esc="preemptar" data-core="${i}" ${t && jogavel ? "" : "disabled"}><b>Núcleo ${i + 1}</b><small>${t ? `${t.nome} · ${t.rotulo} · ${t.restante} s de CPU restantes · clique para preemptar` : "Livre"}</small></button>`).join("")}</div></section>
          <section class="esc-col"><h2>Bloqueados <small>Aguardando E/S</small></h2>${s.tarefas.filter(t => t.estado === "bloqueado").map(t => `<div class="esc-card bloqueado"><b>${t.nome} · ${t.rotulo}</b><small>${t.motivo} · ${Math.max(0, t.acorda - s.tempo)} s</small></div>`).join("") || vazio}</section>
        </div>
        <div class="esc-metricas">Utilização da CPU: ${r.utilizacao.toFixed(1)}% · Espera média: ${r.esperaMedia.toFixed(1)} s · Resposta média: ${r.respostaMedia === null ? "—" : `${r.respostaMedia.toFixed(1)} s`}</div>
        <p class="esc-explica">Espera média considera todas as tarefas criadas; resposta média considera somente as que receberam CPU. Threads concluídas conta apenas as threads explícitas do web-srv; o processo só conclui quando ambas terminam. Concluir uma tarefa vale 100 pontos (120 com E/S); cada preempção manual custa 15 pontos e cada episódio de 12 s seguidos na fila custa 40. A tarefa permanece disponível. Esses custos são regras do jogo; não simulam tempo de troca de contexto.</p>
        <details><summary>Registro de eventos</summary><ul class="esc-log">${s.eventos.map(x => `<li>${x}</li>`).join("")}</ul></details>
        ${Object.keys(this.resultados).length ? `<div class="esc-resultados"><h2>Resultados deste cenário</h2>${Object.entries(this.resultados).map(([modo, v]) => `<p><b>${modo === "KERNEL" ? "1:1" : "N:1"}</b>: ${v.pontos} pontos · ${v.processos} processos · ${v.threads} threads · CPU ${v.utilizacao.toFixed(1)}% · espera ${v.esperaMedia.toFixed(1)} s · resposta ${v.respostaMedia === null ? "—" : v.respostaMedia.toFixed(1) + " s"}</p>`).join("")}</div>` : ""}
        <p class="esc-explica">Modelo didático: carga fixa, dois núcleos, preempção manual, E/S de 3 s, sem custo de troca na linha do tempo. Uma espera longa indica risco; não comprova starvation. Referência: <a href="https://wiki.inf.ufpr.br/maziero/lib/exe/fetch.php?media=socm:socm-texto-05.pdf" target="_blank" rel="noopener noreferrer">Maziero, Threads, seção 5.4 (modelos de implementação)</a>.</p>
      </div>`;
      if (chave) {
        const destino = Array.from(this.container.querySelectorAll("button[data-esc]")).find(b => b.dataset.esc === chave[0] && (b.dataset.uid || b.dataset.core || "") === chave[1] && !b.disabled);
        const alternativa = this.container.querySelector('button[data-esc="pausa"]:not(:disabled), button[data-esc="iniciar"]:not(:disabled)');
        (destino || alternativa)?.focus({ preventScroll: true });
      }
    }
  }
  JogoEscalonador.Simulacao = SimulacaoEscalonador;
  global.JogoEscalonador = JogoEscalonador;
})(typeof window !== "undefined" ? window : globalThis);
