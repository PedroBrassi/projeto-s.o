# Trilha 5 — Dispositivos e Entrada/Saída

> **Origem:** conteúdo do KernelPlay organizado em seis fases; associação bibliográfica conferida nos textos oficiais do autor. Os números e títulos das aulas da disciplina não foram informados para esta trilha.
> **Livro de referência:** MAZIERO, Carlos A. *Sistemas Operacionais: Conceitos e Mecanismos*. Curitiba: DINF/UFPR, 2019 — Parte V, “Gestão de entrada/saída”, com foco nos caps. 19–20 (p. 235–260) e apoio do cap. 22, §22.4.
> **Versão consultada:** PDF oficial compilado em 26/06/2026. As páginas indicadas são as impressas no livro, não o contador do leitor de PDF; outras compilações podem ter paginação diferente.

| Fase | Aula | Tema | Livro (Maziero) |
|---|---|---|---|
| 5.1 | Estudo dirigido | DMA: preparação, transferência e conclusão | cap. 20, §20.5.3, p. 256–258 |
| 5.2 | Estudo dirigido | Interrupções: sinalização, tratadores e retorno à execução | cap. 19, §19.6, p. 243–247; cap. 20, §§20.5.2 e 20.6, p. 254–256 e 258–260 |
| 5.3 | Estudo dirigido | Drivers e organização em camadas do software de E/S | cap. 20, §§20.2–20.4, p. 248–252 |
| 5.4 | Estudo dirigido | Classes de dispositivos e arquivos especiais em /dev | cap. 20, §20.3, p. 249–251; cap. 22, §22.4, p. 294–295 |
| 5.5 | Estudo dirigido | Controle de dispositivos por ioctl | cap. 20, §20.4, p. 251–252 |
| 5.6 | Estudo dirigido | Buffers, cache de blocos e double buffering | apoio: cap. 20, §20.5.2, p. 254–256; cache e double buffering: complemento técnico |

“Estudo dirigido” identifica o roteiro desta documentação, sem atribuir números de aula ao professor. A numeração 5.1–5.6 corresponde às etapas existentes no jogo.

## Organização da leitura

O recorte principal usa os capítulos de hardware e software de E/S. As aplicações em Linux e xv6 são acompanhadas por referências técnicas próprias. O tratamento de cache e double buffering na fase 5.6 é complementar; não é apresentado como uma seção específica de Maziero.

O jogo contém seis etapas, com um conceito, duas questões e uma atividade de ordenação ou associação em cada uma. O manual libera as páginas após a conclusão; no modo apresentação elas já ficam acessíveis.

---

## Fase 5.1 — DMA — Direct Memory Access

### Conceito e funcionamento

Transferência de dados entre um dispositivo e a memória sem a CPU copiar cada unidade de dados.

O driver prepara buffers e descritores com endereços acessíveis ao dispositivo, tamanhos e direção da transferência. O dispositivo ou controlador realiza o movimento dos dados. A CPU continua responsável pela configuração e pelo tratamento da conclusão ou de erros. DMA pode disputar largura de banda da memória; não significa custo zero. A conclusão pode ser percebida por interrupção ou consulta, e uma interrupção pode reunir várias conclusões.

Exemplo: O driver VirtIO do xv6 prepara descritores que apontam para os dados de um buffer; o dispositivo emulado usa esses endereços para realizar a operação.

> **Referência de estudo:** Maziero, cap. 20, §20.5.3, p. 256–258.

**Complemento técnico:** os descritores VirtIO e as regras de endereçamento DMA são detalhados no driver oficial do xv6 e na documentação do Linux, listados ao final.

### Desafios da fase 5.1

1. **Qual trabalho a CPU deixa de fazer diretamente quando se usa DMA?** → Copiar cada unidade de dados durante a transferência.
2. **Uma requisição usa DMA. O que podemos afirmar sobre sua conclusão?** → Pode ser detectada por interrupção ou consulta, conforme o dispositivo e o driver.
3. **Ordenar o fluxo:** Driver prepara o buffer e os descritores → Driver disponibiliza a requisição ao dispositivo → Dispositivo transfere os dados → Driver verifica a conclusão e libera o uso do resultado.

### Conexão com xv6 e Linux

**DMA com descritores VirtIO** — `kernel/virtio_disk.c`. Esquema didático, não código C executável. Consulte virtio_disk_rw() e virtio_disk_intr(). O exemplo é VirtIO em QEMU, não um disco NVMe.


---

## Fase 5.2 — IRQ — Interrupção de hardware

### Conceito e funcionamento

Notificação de hardware que solicita atenção da CPU para um evento assíncrono.

A notificação pode usar uma linha física ou uma mensagem, dependendo da arquitetura. Controladores como APIC em x86 e PLIC para interrupções externas no xv6 RISC-V ajudam no encaminhamento. O hardware registra o estado mínimo de retorno, e o código de entrada do kernel salva os registradores necessários e chama o tratador apropriado. A interrupção pode ocorrer durante execução de usuário ou do próprio kernel; só há mudança de privilégio quando necessária. Nem toda interrupção vem de um periférico: há também temporizadores.

Exemplo: Uma entrada na UART ou a conclusão de uma operação VirtIO pode provocar uma interrupção externa no xv6.

> **Referência de estudo:** Maziero, cap. 19, §19.6, p. 243–247; cap. 20, §§20.5.2 e 20.6, p. 254–256 e 258–260.

**Complemento técnico:** APIC, PLIC e os caminhos de entrada do xv6 são exemplos de arquiteturas específicas. Consulte `trap.c` e `plic.c` para o caso RISC-V.

### Desafios da fase 5.2

1. **Uma interrupção chega enquanto a CPU já executa código do kernel. Ela precisa vir do modo usuário?** → Não; interrupções também podem ocorrer no kernel quando habilitadas.
2. **Qual é a diferença entre DMA e interrupção?** → DMA transfere dados; uma interrupção notifica um evento.
3. **Ordenar o fluxo:** Dispositivo sinaliza um evento → Controlador encaminha a interrupção habilitada → Código de entrada salva o contexto necessário → Tratador identifica e atende o evento → Kernel conclui o atendimento e pode retomar a execução.

### Conexão com xv6 e Linux

**Interrupções externas no xv6** — `kernel/trap.c e kernel/plic.c`. Esquema do caminho de interrupções externas. O PLIC não é o encaminhador de todas as classes de interrupção, como temporizadores. Um processo acordado pode voltar a ficar pronto e aguardar escalonamento.


---

## Fase 5.3 — Device driver

### Conceito e funcionamento

Componente de software que controla um dispositivo e adapta suas operações às interfaces do sistema.

Um driver conhece registradores, filas, formatos de comandos e regras do dispositivo. Pode preparar DMA, tratar interrupções e oferecer operações de leitura, escrita ou controle. No Linux, drivers podem ser compilados no kernel ou fornecidos como módulos carregáveis; nem todo driver é um arquivo .ko. As interfaces suportadas variam por dispositivo. No xv6, o código dos drivers faz parte do kernel didático.

Exemplo: kernel/virtio_disk.c controla o disco VirtIO; kernel/uart.c controla a UART no xv6.

> **Referência de estudo:** Maziero, cap. 20, §§20.2–20.4, p. 248–252.

### Desafios da fase 5.3

1. **Qual tarefa pertence ao driver de um dispositivo?** → Traduzir uma operação do SO para comandos específicos do dispositivo.
2. **Qual afirmação sobre drivers Linux é correta?** → Podem estar integrados ao kernel ou ser módulos carregáveis.
3. **Associar:** Driver → Conhece comandos e registradores do dispositivo; Controlador → Implementa a interface do dispositivo em hardware ou emulação; Aplicação → Solicita operações usando interfaces do SO.

### Conexão com xv6 e Linux

**Disco e console têm caminhos diferentes** — `kernel/virtio_disk.c, kernel/uart.c e kernel/console.c`. Esquema didático. O disco do xv6 é acessado internamente pelo sistema de arquivos; não suponha que todo driver apareça como um arquivo em /dev.


---

## Fase 5.4 — /dev — Arquivos especiais de dispositivo

### Conceito e funcionamento

Diretório que reúne muitos nós de dispositivo em sistemas Unix/Linux, incluindo dispositivos virtuais.

Nós especiais de bloco (b) e de caractere (c) têm números major e minor que identificam o tipo de dispositivo e a instância, interpretados pelo subsistema e pelo driver. /dev/null é virtual: não corresponde a um periférico físico. Nem toda entrada em /dev é um nó de bloco ou caractere, e nem todo dispositivo é acessado por um arquivo ali. Esses caminhos são exemplos de Linux; o xv6 padrão usa um nó console em sua raiz e não reproduz toda a organização de /dev.

Exemplo: /dev/sda: exemplo de disco; /dev/ttyS0: exemplo de porta serial; /dev/null: descarte de dados. A existência e os números variam conforme o sistema.

> **Referência de estudo:** Maziero, cap. 20, §20.3, p. 249–251; cap. 22, §22.4, p. 294–295.

**Complemento técnico:** nomes de dispositivos, major/minor e a organização concreta de `/dev` devem ser conferidos no manual do sistema utilizado.

### Desafios da fase 5.4

1. **O que /dev/null demonstra?** → Um dispositivo também pode ser virtual.
2. **Em uma saída de ls -l, como reconhecer um nó especial de caractere?** → Pela letra c no início do modo.
3. **Associar:** b → Nó de dispositivo de bloco; c → Nó de dispositivo de caractere; major/minor → Identificação de dispositivo interpretada pelo sistema; /dev/null → Dispositivo virtual que descarta dados escritos.

### Conexão com xv6 e Linux

**O nó console do xv6** — `kernel/sysfile.c e kernel/file.c`. Esquema didático. O xv6 possui sua própria interface mknod e nós de dispositivo, mas não implementa a árvore /dev completa do Linux. Não execute exemplos de criação de nós no computador real para esta atividade.

No Linux, a atividade usa `ls -l /dev/null`. Saída ilustrativa, não capturada nesta atividade. O c identifica um nó de caractere; 1 e 3 são major e minor neste exemplo. Permissões e outros campos podem variar.


---

## Fase 5.5 — ioctl — Input/Output Control

### Conceito e funcionamento

Chamada de sistema usada para operações de controle específicas sobre um descritor aberto.

Recebe um descritor, um código de operação e, quando necessário, argumentos ou um buffer. É usada quando uma operação não se expressa como simples leitura ou escrita de bytes. O código e o formato dos argumentos dependem da interface. Nem todo descritor suporta toda operação; uma requisição inadequada pode falhar. No Linux, bibliotecas também podem oferecer funções próprias sobre esses mecanismos. O xv6 padrão não oferece a chamada ioctl.

Exemplo: TIOCGWINSZ permite consultar as dimensões de um terminal em sistemas que oferecem essa operação.

> **Referência de estudo:** Maziero, cap. 20, §20.4, p. 251–252.

**Complemento técnico:** a assinatura de `ioctl`, `TIOCGWINSZ` e seus erros são consultados no manual Linux. O xv6 padrão não oferece essa chamada.

### Desafios da fase 5.5

1. **Qual situação combina com ioctl?** → Consultar dimensões de um terminal por uma operação suportada.
2. **Podemos chamar ioctl no xv6 padrão como se fosse Linux?** → Não; o xv6 padrão não implementa essa chamada.
3. **Associar:** read → Obtém bytes por uma interface de leitura; write → Envia bytes por uma interface de escrita; ioctl → Solicita uma operação de controle suportada.

### Conexão com xv6 e Linux

**Limite da comparação com Linux** — `kernel/syscall.h`. Comparação de interfaces, não código executado. O xv6 padrão não tem ioctl; a ausência é parte do conteúdo desta etapa.


---

## Fase 5.6 — Buffers, cache e double buffering

### Conceito e funcionamento

Buffers intermedeiam transferências; caches reaproveitam dados; double buffering alterna dois buffers.

Um buffer armazena dados temporariamente para acomodar transferências e diferenças de ritmo. Um cache mantém cópias para reutilização e pode evitar novas leituras do dispositivo. Double buffering alterna dois buffers para permitir sobreposição entre produção e consumo quando o projeto oferece concorrência. Essas técnicas podem coexistir, mas não são sinônimos e não garantem assincronia sozinhas. O bcache do xv6 guarda blocos do sistema de arquivos; não é, por isso, uma implementação de double buffering.

Exemplo: Em bio.c, bread() obtém um buffer e só solicita leitura ao disco se o bloco ainda não estiver válido no cache.

> **Referência de estudo:** Maziero, apoio: cap. 20, §20.5.2, p. 254–256; cache e double buffering: complemento técnico.

**Complemento técnico:** a implementação de `bcache` é documentada por `kernel/bio.c` do xv6. A distinção entre cache e alternância de dois buffers integra a explicação didática do jogo; não se atribui a Maziero uma seção de double buffering não identificada na consulta.

### Desafios da fase 5.6

1. **Qual situação mostra benefício de um cache de blocos?** → Reutilizar um bloco válido em RAM sem fazer nova leitura ao disco.
2. **Qual afirmação diferencia double buffering de buffer cache?** → Double buffering alterna dois buffers; cache busca reutilizar dados.
3. **Associar:** Buffer → Armazenamento intermediário temporário; Cache → Reutilização de dados já disponíveis; Double buffering → Alternância entre dois buffers; bcache do xv6 → Cache de blocos do sistema de arquivos.

### Conexão com xv6 e Linux

**Cache de blocos e espera por E/S** — `kernel/bio.c e kernel/virtio_disk.c`. Esquema didático. Na espera pelo disco, o processo pode dormir; a conclusão acorda quem espera. Acordar o processo o torna elegível para execução, sem garantir execução imediata. Este cache é distinto do page cache de sistemas como Linux.


---

## Relação com processos e threads

Uma tarefa que solicita E/S pode ficar bloqueada enquanto outra usa a CPU. A conclusão pode acordar a tarefa, que ainda depende do escalonador para executar. Buffers compartilhados exigem coordenação; interrupções e DMA não substituem essa sincronização.

## Referências

### Livro-base

MAZIERO, Carlos A. *Sistemas Operacionais: Conceitos e Mecanismos*. Curitiba: DINF/UFPR, 2019. ISBN 978-85-7335-340-2. Versão digital compilada em 26 jun. 2026. Acesso em: 18 nov. 2026.

- [Página oficial do livro e dos capítulos](https://wiki.inf.ufpr.br/maziero/doku.php?id=socm:start).
- [Livro completo — versão consultada](https://wiki.inf.ufpr.br/maziero/lib/exe/fetch.php?media=socm:socm-livro.pdf).
- [Capítulo 19 — Hardware de entrada/saída](https://wiki.inf.ufpr.br/maziero/lib/exe/fetch.php?media=socm:socm-texto-19.pdf).
- [Capítulo 20 — Software de entrada/saída](https://wiki.inf.ufpr.br/maziero/lib/exe/fetch.php?media=socm:socm-texto-20.pdf).
- [Capítulo 22 — O conceito de arquivo](https://wiki.inf.ufpr.br/maziero/lib/exe/fetch.php?media=socm:socm-texto-22.pdf), §22.4 como leitura de apoio.

Os resumos e desafios são formulações didáticas do KernelPlay. A obra de Maziero é disponibilizada pelo autor sob [CC BY-NC-SA 3.0](https://creativecommons.org/licenses/by-nc-sa/3.0/).

### Complementos de implementação

- LINUX KERNEL. [Dynamic DMA mapping Guide](https://www.kernel.org/doc/html/latest/core-api/dma-api-howto.html): endereços e preparação de memória para DMA.
- MIT PDOS. xv6 RISC-V: [driver VirtIO](https://github.com/mit-pdos/xv6-riscv/blob/riscv/kernel/virtio_disk.c), [tratamento de traps](https://github.com/mit-pdos/xv6-riscv/blob/riscv/kernel/trap.c), [PLIC](https://github.com/mit-pdos/xv6-riscv/blob/riscv/kernel/plic.c) e [cache de blocos](https://github.com/mit-pdos/xv6-riscv/blob/riscv/kernel/bio.c).
- LINUX MAN-PAGES. [Arquivos especiais](https://man7.org/linux/man-pages/man4/intro.4.html), [mknod e identificação de dispositivos](https://man7.org/linux/man-pages/man2/mknod.2.html) e [ioctl](https://man7.org/linux/man-pages/man2/ioctl.2.html).

Os caminhos xv6 referem-se à árvore oficial RISC-V. Confira a versão usada na disciplina antes de reproduzir experimentos. Os esquemas e a saída Linux são ilustrativos; não comprovam testes reais do grupo.
