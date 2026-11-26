# Planejamento do grupo

Tema: **Processos e Threads**.

Avise no grupo ao entregar cada etapa e, se houver dificuldade, avise antes para redistribuirmos as tarefas.

Conferência documental em 26/11/2026, com base nos arquivos disponíveis no repositório. A justificativa e o registro de testes foram atualizados. A reprodução por Gabriel foi confirmada com capturas e informação de execução em cópia limpa. O PDF recebido dos slides contém 14 páginas e foi revisado; a fonte editável e a revisão conjunta continuam a confirmar.

## Entregas

| # | Entrega | Responsável | Pasta | Situação |
|---|---|---|---|---|
| 1 | Justificativa técnica do simulador KernelPlay (PDF) | Pedro Brassi Luccas | `docs/justificativa/` | Entregue: Markdown, Word e PDF revisados em 26/11/2026, com prompts de IA, agente, heurísticas de Nielsen e justificativa da carga fixa; reprodução independente incluída; revisão conjunta a confirmar e publicação acompanhada abaixo |
| 2 | Implementação da demonstração no xv6 | Aurélio Junior e Pedro Brassi Luccas | `xv6-demo/codigo/` e `xv6-demo/README.md` | Entregue: processos (`proc_demo`) e threads de usuário (`uthread`), patch de integração, README e reprodução em cópia limpa; corrige apenas o que os testes apontarem |
| 3 | Execução dos testes e registro dos comandos e resultados | Gabriel Alves Domingos | `xv6-demo/evidencias/` | Concluída a reprodução por Gabriel em cópia limpa, conforme confirmação do grupo; capturas dos três comandos e verificações aprovadas registradas em `xv6-demo/evidencias/reproducao-gabriel.md` |
| 4 | Slides sobre processos e threads em um SO atual (Linux) | Pedro Lima | `apresentacao/` | PDF de 14 slides recebido, revisado e preservado junto do original; fonte editável ou link de edição do Canva pendente |
| 5 | Revisão final e publicação dos materiais no Padlet | Ana Flávia dos Santos Peixoto | Padlet | Revisão técnica documental concluída; atualização dos anexos em andamento; revisão conjunta a confirmar |
| 6 | Apresentação do trabalho no dia | Guilherme Gouvêa da Silva e Victor Orlando Avelar (disponibilidade a confirmar) | — | Pendente (ver abaixo) |

## O que falta, por responsável

As partes 1, 2 e a reprodução da parte 3 já foram entregues; a parte 6 depende da confirmação dos apresentadores. Cada item abaixo é de responsabilidade de quem está indicado. Ao concluir, avise no grupo e marque o item como feito (`[x]`) neste arquivo.

### Gabriel Alves Domingos — Testes

- [x] Reproduzir os experimentos em cópia limpa, conforme confirmação do grupo.
- [x] Executar `proc_demo`, `proc_demo pausa` com `Ctrl-P` antes da coleta e `uthread`, com resultados esperados confirmados nas capturas.
- [x] Incorporar as três capturas originais em `xv6-demo/evidencias/capturas/gabriel/` e descrever os resultados em [reprodução independente](../xv6-demo/evidencias/reproducao-gabriel.md).
- [x] Atualizar o item 11 de [comandos e resultados](../xv6-demo/evidencias/comandos-e-resultados.md).

Registro documental em 26/11/2026. A data exata da execução, o ambiente específico e o log integral dessa sessão não foram informados. Se disponíveis, podem ser acrescentados ao registro; os logs antigos não são atribuídos a Gabriel.

### Pedro Lima — Slides sobre Linux

- [x] Receber o PDF com 14 slides e preservar o original.
- [x] Conferir a descrição do KernelPlay e a comparação com a demonstração real `proc_demo`/`uthread`.
- [x] Identificar as capturas como evidências do xv6 e corrigir `CLONE_THREAD`.
- [x] Corrigir o esquema do escalonador para o xv6 RISC-V e a explicação dos estados do Linux.
- [x] Conferir a presença de referências e salvar o [PDF revisado](../apresentacao/processos-threads-linux.pdf).
- [ ] Acrescentar a fonte editável (`.pptx`) ou o link de edição do Canva.

Detalhes e fontes em [revisão dos slides](../apresentacao/revisao-slides.md). A revisão documental não substitui a conferência conjunta e o ensaio pelo grupo.

### Ana Flávia dos Santos Peixoto — Revisão final e Padlet

- [ ] Revisar a justificativa ([`docs/justificativa/justificativa-tecnica.pdf`](justificativa/justificativa-tecnica.pdf)) e os slides corrigidos, e devolver sugestões no grupo.
- [x] Conferir tecnicamente nomes, PDFs, links, referências e a documentação do código em `xv6-demo/`; esta etapa documental não representa nova execução do kernel.
- [ ] Conferir no enunciado original se a entrada de carga pelo usuário é obrigatória ou apenas parte do prompt sugerido. A versão atual do minigame usa carga fixa; a justificativa explica a escolha e seu limite.
- [x] Preparar a justificativa revisada em 26/11/2026 para publicação; os documentos registram o agente Codex e informam que a versão exata do modelo não foi registrada.
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
