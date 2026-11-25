# Planejamento do grupo

Tema: **Processos e Threads**.

Avise no grupo ao entregar cada etapa e, se houver dificuldade, avise antes para redistribuirmos as tarefas.

Conferência documental em 25/11/2026, com base nos arquivos disponíveis no repositório. A revisão da justificativa foi atualizada; os demais itens mantêm o status registrado, sem nova confirmação de conclusão.

## Entregas

| # | Entrega | Responsável | Pasta | Situação |
|---|---|---|---|---|
| 1 | Justificativa técnica do simulador KernelPlay (PDF) | Pedro Brassi Luccas | `docs/justificativa/` | Entregue: Markdown, Word e PDF revisados em 25/11/2026, com prompts de IA, agente, heurísticas de Nielsen e justificativa da carga fixa; revisão conjunta (parte 5) e publicação no Padlet pendentes |
| 2 | Implementação da demonstração no xv6 | Aurélio Junior e Pedro Brassi Luccas | `xv6-demo/codigo/` e `xv6-demo/README.md` | Entregue: processos (`proc_demo`) e threads de usuário (`uthread`), patch de integração, README e reprodução em cópia limpa; corrige apenas o que os testes apontarem |
| 3 | Execução dos testes e registro dos comandos e resultados | Gabriel Alves Domingos | `xv6-demo/evidencias/` | Há o registro da execução feita na implementação; reprodução independente pendente (ver abaixo) |
| 4 | Slides sobre processos e threads em um SO atual (Linux) | Pedro Lima | `apresentacao/` | Primeira versão no Canva (15 slides); correções e envio ao repositório pendentes (ver abaixo) |
| 5 | Revisão final e publicação dos materiais no Padlet | Ana Flávia dos Santos Peixoto | Padlet | Pendente (ver abaixo) |
| 6 | Apresentação do trabalho no dia | Guilherme Gouvêa da Silva e Victor Orlando Avelar (disponibilidade a confirmar) | — | Pendente (ver abaixo) |

## O que falta, por responsável

As partes 1 e 2 já foram entregues; a parte 6 depende da confirmação dos apresentadores. Cada item abaixo é de responsabilidade de quem está indicado. Ao concluir, avise no grupo e marque o item como feito (`[x]`) neste arquivo.

### Gabriel Alves Domingos — Testes

- [ ] Reproduzir a demonstração do xv6 seguindo [`xv6-demo/README.md`](../xv6-demo/README.md), seção "Como reproduzir". É preciso o kit do professor (`xv6.sh` + `so-xv6-2024.tar`) e Docker.
- [ ] Executar `proc_demo`, `proc_demo pausa` (com `Ctrl-P` durante a pausa) e `uthread`, digitando um comando por vez.
- [ ] Gravar a sessão (por exemplo, `script -q sessao.txt -c "bash xv6.sh"`) e salvar o log e os prints em `xv6-demo/evidencias/`, com nomes que indiquem a reprodução (por exemplo, `reproducao-gabriel.txt`).
- [ ] Preencher o item 11 de [`xv6-demo/evidencias/comandos-e-resultados.md`](../xv6-demo/evidencias/comandos-e-resultados.md) com o resultado esperado, o observado e a data. Registrar somente o que foi realmente executado.
- [ ] Se algo falhar, avisar no grupo com a saída do terminal, para que a parte 2 corrija.

### Pedro Lima — Slides sobre Linux

Correções na primeira versão:

- [ ] **Slides 9 e 11 (KernelPlay):** remover "não foi identificada documentação ou implementação verificável". O KernelPlay é o simulador do grupo e está documentado em [`docs/justificativa/`](justificativa/). Descrever:
  - máquina de estados pronto/executando/bloqueado/zumbi, em que `fork` cria um filho pronto, `exit` gera um zumbi e `wait` faz a coleta;
  - o minigame Seja o Escalonador, com dois núcleos e threads de mesmo PID nos modelos 1:1 e N:1 (em N:1, threads do mesmo processo não ocupam os dois núcleos e uma E/S bloqueante suspende todas);
  - o laboratório com FCFS, SJF, SRTF e Round-Robin;
  - o limite: é uma representação, sem cópia real de memória nem de registradores (versão `9989806`).
- [ ] **Slide 15 (Demonstração no xv6):** trocar `echo "olá" | cat` pela demonstração real do grupo:
  - `proc_demo`: PIDs distintos; o filho muda a variável de 100 para 999 e o pai continua com 100; `exit(42)` e `wait` devolvendo o PID e `status = 42`; o filho em estado zombie no `Ctrl-P` antes da coleta;
  - `uthread`: duas threads de usuário no mesmo PID, com pilhas próprias, troca de contexto em RISC-V e contador de 0 a 10 alternando A e B (modelo N:1);
  - o ambiente `xv6-labs-2024` (`util@79e8024`) com a imagem `so-xv6:2024`;
  - uma das capturas de `xv6-demo/evidencias/capturas/`.

  Retirar também a frase sobre "o pipe sendo criado" no KernelPlay.
- [ ] **Slide 10:** o xv6 não tem "fila de processos prontos"; o escalonador percorre a tabela `proc[]` procurando processos `RUNNABLE`.
- [ ] **Slide 13:** usar os estados do Linux vistos no `ps`: R (executando ou pronto), S e D (bloqueado), T (parado) e Z (zumbi). Retirar "Novo = ainda não carregado na memória".
- [ ] **Acrescentar um slide de referências:**
  - Maziero, *Sistemas Operacionais: Conceitos e Mecanismos*;
  - man-pages `clone(2)`, `pthreads(7)`, `futex(2)`, `sched(7)`, `namespaces(7)` e `proc(5)`;
  - documentação do kernel, *EEVDF Scheduler*;
  - livro do xv6 (rev4);
  - MIT 6.1810, *Lab Multithreading*;
  - repositório e KernelPlay.
- [ ] **Salvar em [`apresentacao/`](../apresentacao/README.md):** `processos-threads-linux.pdf` e a fonte editável (`.pptx` exportado do Canva) ou o link de edição do Canva.

### Ana Flávia dos Santos Peixoto — Revisão final e Padlet

- [ ] Revisar a justificativa ([`docs/justificativa/justificativa-tecnica.pdf`](justificativa/justificativa-tecnica.pdf)) e os slides corrigidos, e devolver sugestões no grupo.
- [ ] Conferir as entregas: nomes de arquivos, PDFs que abrem, links, referências e o código em `xv6-demo/`.
- [ ] Conferir no enunciado original se a entrada de carga pelo usuário é obrigatória ou apenas parte do prompt sugerido. A versão atual do minigame usa carga fixa; a justificativa explica a escolha e seu limite.
- [ ] Usar a justificativa revisada em 25/11/2026 na publicação; os documentos registram o agente Codex e informam que a versão exata do modelo não foi registrada.
- [ ] Atualizar os posts existentes do Padlet, sem duplicar:
  - **Simulador:** link do KernelPlay e PDF da justificativa;
  - **Demonstração no xv6:** link para `xv6-demo/` (README, código e evidências);
  - **SO atual:** PDF dos slides.
- [ ] Organizar a conferência conjunta e o encerramento.

### Guilherme Gouvêa da Silva e Victor Orlando Avelar — Apresentação no dia

- [ ] Confirmar no grupo se podem apresentar.
- [ ] **Principal:** jogar e saber explicar o minigame **Seja o Escalonador** do [KernelPlay](https://pedrobrassi.github.io/projeto-s.o/kernelPlay/). É a parte que mostra o nosso tema: processos e threads, despacho nos núcleos e a diferença entre os modelos 1:1 e N:1.
- [ ] Entender como o KernelPlay funciona. O Pedro Brassi pode ajudar.
- [ ] Estudar o conteúdo dos slides sobre Linux.

## Critérios para marcar como concluído

- Justificativa: fonte editável e PDF revisado na pasta correspondente.
- xv6: código, versão e ambiente, passos reproduzíveis e evidências reais revisadas.
- SO atual: fonte editável, referências e PDF revisado.
- Entrega: links e anexos abrem corretamente no Padlet.
