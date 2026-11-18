# Trilha 5 — Dispositivos e Entrada/Saída

Seis etapas com conceitos, duas questões e um exercício de ordenação ou associação por etapa. As páginas do manual são liberadas ao concluir cada etapa; o modo apresentação permite consultá-las durante a apresentação.

## 5.1 — DMA — Direct Memory Access

Transferência de dados entre um dispositivo e a memória sem a CPU copiar cada unidade de dados.

O driver prepara buffers e descritores com endereços acessíveis ao dispositivo, tamanhos e direção da transferência. O dispositivo ou controlador realiza o movimento dos dados. A CPU continua responsável pela configuração e pelo tratamento da conclusão ou de erros. DMA pode disputar largura de banda da memória; não significa custo zero. A conclusão pode ser percebida por interrupção ou consulta, e uma interrupção pode reunir várias conclusões.

Exemplo: O driver VirtIO do xv6 prepara descritores que apontam para os dados de um buffer; o dispositivo emulado usa esses endereços para realizar a operação.

## 5.2 — IRQ — Interrupção de hardware

Notificação de hardware que solicita atenção da CPU para um evento assíncrono.

A notificação pode usar uma linha física ou uma mensagem, dependendo da arquitetura. Controladores como APIC em x86 e PLIC para interrupções externas no xv6 RISC-V ajudam no encaminhamento. O hardware registra o estado mínimo de retorno, e o código de entrada do kernel salva os registradores necessários e chama o tratador apropriado. A interrupção pode ocorrer durante execução de usuário ou do próprio kernel; só há mudança de privilégio quando necessária. Nem toda interrupção vem de um periférico: há também temporizadores.

Exemplo: Uma entrada na UART ou a conclusão de uma operação VirtIO pode provocar uma interrupção externa no xv6.

## 5.3 — Device driver

Componente de software que controla um dispositivo e adapta suas operações às interfaces do sistema.

Um driver conhece registradores, filas, formatos de comandos e regras do dispositivo. Pode preparar DMA, tratar interrupções e oferecer operações de leitura, escrita ou controle. No Linux, drivers podem ser compilados no kernel ou fornecidos como módulos carregáveis; nem todo driver é um arquivo .ko. As interfaces suportadas variam por dispositivo. No xv6, o código dos drivers faz parte do kernel didático.

Exemplo: kernel/virtio_disk.c controla o disco VirtIO; kernel/uart.c controla a UART no xv6.

## 5.4 — /dev — Arquivos especiais de dispositivo

Diretório que reúne muitos nós de dispositivo em sistemas Unix/Linux, incluindo dispositivos virtuais.

Nós especiais de bloco (b) e de caractere (c) têm números major e minor que identificam o tipo de dispositivo e a instância, interpretados pelo subsistema e pelo driver. /dev/null é virtual: não corresponde a um periférico físico. Nem toda entrada em /dev é um nó de bloco ou caractere, e nem todo dispositivo é acessado por um arquivo ali. Esses caminhos são exemplos de Linux; o xv6 padrão usa um nó console em sua raiz e não reproduz toda a organização de /dev.

Exemplo: /dev/sda: exemplo de disco; /dev/ttyS0: exemplo de porta serial; /dev/null: descarte de dados. A existência e os números variam conforme o sistema.

## 5.5 — ioctl — Input/Output Control

Chamada de sistema usada para operações de controle específicas sobre um descritor aberto.

Recebe um descritor, um código de operação e, quando necessário, argumentos ou um buffer. É usada quando uma operação não se expressa como simples leitura ou escrita de bytes. O código e o formato dos argumentos dependem da interface. Nem todo descritor suporta toda operação; uma requisição inadequada pode falhar. No Linux, bibliotecas também podem oferecer funções próprias sobre esses mecanismos. O xv6 padrão não oferece a chamada ioctl.

Exemplo: TIOCGWINSZ permite consultar as dimensões de um terminal em sistemas que oferecem essa operação.

## 5.6 — Buffers, cache e double buffering

Buffers intermedeiam transferências; caches reaproveitam dados; double buffering alterna dois buffers.

Um buffer armazena dados temporariamente para acomodar transferências e diferenças de ritmo. Um cache mantém cópias para reutilização e pode evitar novas leituras do dispositivo. Double buffering alterna dois buffers para permitir sobreposição entre produção e consumo quando o projeto oferece concorrência. Essas técnicas podem coexistir, mas não são sinônimos e não garantem assincronia sozinhas. O bcache do xv6 guarda blocos do sistema de arquivos; não é, por isso, uma implementação de double buffering.

Exemplo: Em bio.c, bread() obtém um buffer e só solicita leitura ao disco se o bloco ainda não estiver válido no cache.

## Relação com processos e threads

Uma tarefa que solicita E/S pode ficar bloqueada enquanto outra usa a CPU. A conclusão pode acordar a tarefa, que ainda depende do escalonador para executar. Buffers compartilhados exigem coordenação; interrupções e DMA não substituem essa sincronização.

## Revisão do material recebido

- DMA não elimina a CPU: configuração, endereçamento apropriado e conclusão continuam necessários. Não há regra de exatamente uma interrupção por transferência, nem exigência universal de um controlador tomar um barramento compartilhado.
- Interrupções podem usar linhas ou mensagens e chegar durante execução do kernel. Hardware e código de entrada dividem o salvamento de contexto; nem sempre ocorre mudança de modo.
- Drivers podem ser integrados ou modulares, com interfaces diferentes.
- /dev inclui dispositivos virtuais. O xv6 não replica a árvore /dev do Linux.
- ioctl é uma interface Unix/Linux, ausente no xv6 padrão.
- Buffer, buffer cache e double buffering foram distinguidos. O bcache do xv6 é um cache de blocos, não um exemplo automático de double buffering.

## Referências para conferir os mecanismos

- DMA e endereços de dispositivo: https://www.kernel.org/doc/html/latest/core-api/dma-api-howto.html
- Driver VirtIO e descritores: https://github.com/mit-pdos/xv6-riscv/blob/riscv/kernel/virtio_disk.c
- Entrada e encaminhamento de interrupções: https://github.com/mit-pdos/xv6-riscv/blob/riscv/kernel/trap.c
- PLIC: https://github.com/mit-pdos/xv6-riscv/blob/riscv/kernel/plic.c
- Cache de blocos: https://github.com/mit-pdos/xv6-riscv/blob/riscv/kernel/bio.c
- Arquivos especiais Linux: https://man7.org/linux/man-pages/man4/intro.4.html
- Identificação por major e minor: https://man7.org/linux/man-pages/man2/mknod.2.html
- ioctl: https://man7.org/linux/man-pages/man2/ioctl.2.html

Os caminhos xv6 referem-se à árvore oficial RISC-V. Confira a versão usada na disciplina antes de reproduzir experimentos. Os esquemas e a saída Linux são ilustrativos; não comprovam testes reais do grupo.
