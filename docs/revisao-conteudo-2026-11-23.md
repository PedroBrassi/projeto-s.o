# Revisão do conteúdo do KernelPlay

Revisão de 23/11/2026. Esta edição corrige conceitos, gabaritos e limites de exemplos nas trilhas, sem alterar o histórico da demonstração xv6 ou atribuir novas execuções de laboratório ao grupo.

## Correções principais

- Fechamento de descritor não garante persistência no disco; os textos distinguem close, fclose e sincronização como fsync.
- Round-Robin agora explicita chegadas 0,1,2,3, durações 8,2,1,3 e quantum 2. A fila insere chegadas antes da tarefa preemptada; a média é 3,75, com esperas 6,1,2,6. FCFS da mesma carga mantém 5,75.
- O exemplo de DATA usa global inicializada com 7; o texto explica que globais zeradas normalmente vão para BSS no GCC/ELF.
- O esquema de 12 diretos e três indiretos é identificado como mapa tradicional Ext2/3. Ext4 normalmente usa árvores de extensões, conforme o inode.
- FIFO e RR são comparados pela prioridade estática; não existe precedência universal FIFO sobre RR.
- Modularidade não exige núcleo mínimo e não garante maior desempenho; o Windows NT não é apresentado como uma simples migração de micronúcleo puro.

## Demais ajustes

| Achado da auditoria | Tratamento nesta revisão |
|---|---|
| F07 | pthread_yield identificado como extensão obsoleta; sched_yield não substitui sincronização |
| F08 | Pipes podem ter vários participantes, modo não bloqueante e capacidade variável; PIPE_BUF distinguido da capacidade |
| F09 | Mutex com propriedade distinguido de semáforo binário; contador negativo identificado como modelo abstrato |
| F10 | Peterson e exemplos de disputa em C explicam hipóteses de memória, atomics e comportamento indefinido |
| F11 | Deadlock com espera ocupada distinguido de livelock |
| F12 | Threads da aplicação e entidades escalonáveis do kernel diferenciadas; N:M antigo identificado como histórico |
| F13 | Sockets locais AF_UNIX incluídos na definição, sem restringir todo socket a IP e porta |
| F14 | Semântica de fork separada de Linux/COW e da cópia imediata da base xv6-labs-2024 |
| F15 | Falta de página chamada de exceção; sequência com disco identificada como caso específico de page-in |
| F16 | Paginação x86-64 apresentada com quatro ou cinco níveis, conforme suporte e habilitação |
| F17 | MGLRU depende de configuração; nomes genéricos R/M distinguidos de A/D e R no RISC-V |
| F18 | Nome em entrada de diretório distinguido dos metadados do inode |
| F19 | Políticas de cache e commits de journal descritas sem write-through universal de metadados |
| F20 | Referências abertas e mapeamentos considerados na duração do arquivo sem nomes |
| F21 | Montagem usa estruturas próprias do sistema de arquivos; VBR não é universal |
| F22 | Cópias do superbloco e disposição de grupos Ext4 dependem de recursos como sparse_super e flex_bg |
| F23 | MAP_SHARED e MAP_PRIVATE diferenciados |
| F24 | /dev/sda1 não é usado para garantir transporte SATA ou identidade física persistente |
| F25 | Caminho canônico e normalização sem links explicitados; cache LRU rotulado como modelo didático |
| F26 | Referências e pergunta-guia existentes da trilha 5 exibidas em detalhes acessíveis durante a lição |
| F27 | Rechecagem confirmou que README e planejamento atuais já registram o xv6 e os responsáveis; essas informações recentes foram preservadas |
| F28 | Cartões Linux e terminais identificam saídas como exemplos; cartões xv6 distinguem trechos adaptados de evidências reais |

Os seis itens iniciais correspondem a F01–F06. Os quatro textos de apoio em docs/trilhas foram alinhados aos arquivos JavaScript. A descrição arquitetural dos documentos de desenvolvimento e justificativa identifica a versão de referência de 19/11. A revisão documental de 25/11 acrescenta registro de IA e análise de usabilidade à justificativa e atualiza o status das entregas; não certifica a execução de todos os exemplos das trilhas.

## Fontes técnicas

- [close e persistência](https://man7.org/linux/man-pages/man2/close.2.html)
- [GCC e variáveis zeradas em BSS](https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html)
- [Ext4 e os formatos de i_block](https://docs.kernel.org/filesystems/ext4/ifork.html)
- [Journal Ext4](https://docs.kernel.org/filesystems/ext4/journal.html) e [grupos de blocos](https://docs.kernel.org/filesystems/ext4/blockgroup.html)
- [Políticas de escalonamento](https://man7.org/linux/man-pages/man7/sched.7.html) e [EEVDF](https://docs.kernel.org/scheduler/sched-eevdf.html)
- [pthread_yield obsoleto](https://man7.org/linux/man-pages/man3/pthread_yield.3.html), [mutex POSIX](https://man7.org/linux/man-pages/man3/pthread_mutex_lock.3p.html) e [pipes](https://man7.org/linux/man-pages/man7/pipe.7.html)
- [Modelo de memória C, WG14 N1570, seção 5.1.2.4](https://www.open-std.org/jtc1/sc22/wg14/www/docs/n1570.pdf)
- [mmap](https://man7.org/linux/man-pages/man2/mmap.2.html), [unlink](https://man7.org/linux/man-pages/man2/unlink.2.html) e [realpath](https://man7.org/linux/man-pages/man3/realpath.3.html)
- [x86 com cinco níveis](https://docs.kernel.org/arch/x86/x86_64/5level-paging.html) e [MGLRU](https://docs.kernel.org/admin-guide/mm/multigen_lru.html)
- [Livro xv6 2024](https://pdos.csail.mit.edu/6.1810/2024/xv6/book-riscv-rev4.pdf) e [Maziero](https://wiki.inf.ufpr.br/maziero/doku.php?id=socm:start)

## Verificação e limites

A revisão conserva as 32 etapas, 329 blocos de desafio e 184 entradas de manual. A verificação automática cobre estrutura, sintaxe, a consistência da atividade Round-Robin com o algoritmo do laboratório e a suíte existente do minigame. As referências e atividades selecionadas são conferidas na interface em modo apresentação. Isso não representa execução de todos os programas externos citados nas aulas ou nova reprodução dos experimentos xv6.
