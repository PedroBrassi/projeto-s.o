# Revisão técnica dos slides — 26/11/2026

Foram recebidos 14 slides em PDF. O arquivo original está preservado em `originais/processos-threads-linux-recebido.pdf`; a versão de apresentação está em `processos-threads-linux.pdf`.

| Slide | Correção |
|---|---|
| 6 | Corrigida a grafia de `CLONE_THREAD`, ao lado de `CLONE_VM`. |
| 8 | Identificadas as capturas de terminal como evidências do xv6 reproduzidas por Gabriel; elas não representam execução no Linux. |
| 10 | Substituído o trecho incompatível com a demonstração RISC-V por pseudocódigo identificado como didático, com busca em `proc[]`, estado `RUNNABLE`, bloqueio e `swtch`. O esquema omite o laço externo e os detalhes de interrupções. |
| 13 | Substituída a lista genérica pelos estados observáveis no Linux: R, S/D, T/t e Z. Retirada a associação entre estado Novo e ausência da memória. |

As demais páginas preservam a composição recebida, incluindo a comparação com o KernelPlay e as referências. A reexportação não constitui criação de uma fonte editável. Os registros da reprodução de Gabriel são documentados separadamente; a revisão dos slides não representa nova execução de testes.

## Fontes primárias da conferência

- Linux man-pages: [clone(2)](https://man7.org/linux/man-pages/man2/clone.2.html) e [proc_pid_stat(5)](https://man7.org/linux/man-pages/man5/proc_pid_stat.5.html).
- MIT PDOS: [escalonador do xv6 RISC-V em kernel/proc.c](https://github.com/mit-pdos/xv6-riscv/blob/riscv/kernel/proc.c).
- Documentação do kernel Linux: [EEVDF Scheduler](https://docs.kernel.org/scheduler/sched-eevdf.html).

Consulta em 26/11/2026. O pseudocódigo representa o fluxo conceitual e não é uma transcrição integral do kernel.
