# Trilha 5 — Dispositivos e Entrada/Saída

> **Origem:** proposta de substituição da trilha 5 do KernelPlay; roteiro autoral de estudo dirigido. Não foram atribuídos números de aulas ou materiais do professor não fornecidos.
> **Livro de referência:** MAZIERO, Carlos A. *Sistemas Operacionais: Conceitos e Mecanismos*. Curitiba: DINF/UFPR, 2019. Parte V — Gestão de entrada/saída, capítulos 19–21.
> **Consulta:** textos oficiais disponíveis no site do autor em 18/11/2026; páginas impressas da compilação de 26/06/2026, quando indicadas. Outras compilações podem variar.

| Fase | Aula | Tema | Livro (Maziero) |
|---|---|---|---|
| 5.1 | Estudo dirigido | Dispositivos, controladores e firmware | cap. 19, §§19.1–19.2, p. 235–238 |
| 5.2 | Estudo dirigido | Barramentos e interfaces de acesso | cap. 19, §§19.3–19.5, p. 238–243 |
| 5.3 | Estudo dirigido | Interrupções e tratamento de eventos | cap. 19, §19.6, p. 243–247; cap. 20, §20.6, p. 258–260 |
| 5.4 | Estudo dirigido | Camadas de E/S e drivers | cap. 20, §§20.1–20.4, p. 248–252 |
| 5.5 | Estudo dirigido | Classes, /dev e operações de controle | cap. 20, §§20.3–20.4, p. 249–252; apoio: cap. 22, §22.4 |
| 5.6 | Estudo dirigido | Consulta, eventos e espera por E/S | cap. 20, §§20.5.1–20.5.2, p. 252–256 |
| 5.7 | Estudo dirigido | DMA e transferência de dados | cap. 20, §20.5.3, p. 256–258; complemento: Linux DMA API |
| 5.8 | Estudo dirigido | Buffers, cache e coordenação | Apoio: cap. 20, §20.5.2; complemento: xv6 bio.c e coordenação entre tarefas |
| 5.9 | Estudo dirigido | Armazenamento e revisão integrada | cap. 21, §§21.1–21.4; revisão dos caps. 19–20 |

A sequência percorre hardware, software e estratégias de interação; termina com armazenamento e uma revisão integrada. A fase 5.8 é uma extensão prática identificada, especialmente em relação a cache e double buffering. O roteiro é um recorte para o jogo e não uma transcrição integral dos capítulos.

Cada fase possui dois blocos conceituais, quatro questões, uma associação e uma atividade final. O conjunto contém 72 desafios, 27 páginas no manual e cartões de conexão em todas as fases. As atividades finais incluem ordenação, terminal simulado e simulação de estados de processos.

---

## Fase 5.1 — Dispositivos, controladores e firmware

**Pergunta-guia:** Como uma tecla pressionada se transforma em dados que um programa consegue ler?

### Do evento físico ao dado

Como uma tecla pressionada chega a um programa?

O evento é captado pelo dispositivo. Seu controlador organiza a informação e fornece uma interface para o computador. O sistema operacional usa essa interface e entrega uma abstração às aplicações.

**Entrada e saída** incluem interação com usuários, armazenamento e comunicação. O mesmo equipamento pode receber e enviar dados.

### Controlador, firmware e driver

**Controlador:** coordena o dispositivo e expõe comandos, dados e estado.

**Firmware:** código executado no próprio equipamento ou controlador.

**Driver:** software que faz a integração com o SO. Um dispositivo emulado também possui uma interface e precisa de driver no sistema convidado.

Não confunda o controlador do dispositivo com um controlador de interrupções: eles têm funções diferentes.

> **Leitura de referência:** Maziero, cap. 19, §§19.1–19.2, p. 235–238.

### Desafios e respostas

1. **Qual equipamento realiza entrada e saída?** Resposta: Interface de rede que recebe e envia pacotes. Uma interface de rede recebe e transmite dados. A classificação depende da função observada.
2. **Por que o SO precisa de abstrações para E/S?** Resposta: Porque dispositivos diferem em comandos, formatos e velocidade. Interfaces uniformes reduzem a necessidade de cada aplicação conhecer os detalhes de todos os equipamentos.
3. **Onde atua o driver do SO em relação ao controlador?** Resposta: Interpreta a interface do controlador para solicitar operações. O driver traduz operações do sistema para a interface do dispositivo, incluindo tratamento de estado e erros.
4. **O QEMU emula um disco VirtIO para o xv6. O xv6 ainda precisa de driver?** Resposta: Sim, o xv6 precisa conversar com a interface emulada. O dispositivo emulado atende um protocolo. O kernel convidado precisa saber usá-lo.
5. **Associação:** Dispositivo → Troca dados com o ambiente; Controlador → Expõe comandos e estado do equipamento; Firmware → Executa funções internas do dispositivo; Driver → Integra o dispositivo ao SO.
6. **Ordene um caminho didático de entrada de teclado.** Usuário pressiona uma tecla → Dispositivo e controlador registram o evento → Driver obtém os dados pela interface → SO disponibiliza os dados à aplicação.

### Veja no xv6

**Console e UART no xv6** — `kernel/uart.c; kernel/console.c`.

```text
UART emulada -> driver UART -> console -> processo leitor
```

O console do xv6 permite estudar uma entrada de dados concreta sem supor que todo equipamento tenha a mesma interface.

### E no Linux?

```sh
ls /sys/class
```

Saída ilustrativa; nomes, valores e disponibilidade variam conforme o sistema. O sysfs expõe informações organizadas por classes. /sys é uma interface de informações do kernel; não equivale a listar todos os nós de /dev.

### Páginas do manual

`dispositivo de E/S(7)`, `controlador(7)`, `firmware(7)`.

---

## Fase 5.2 — Barramentos e interfaces de acesso

**Pergunta-guia:** Como o processador distingue enviar um dado de consultar o estado de um dispositivo?

### O barramento transporta transações

Conectar um dispositivo não significa falar sua linguagem.

O barramento fornece um meio e regras para transferências. O controlador ainda define seus próprios registradores e comandos. Um endereço seleciona o destino; dados e sinais de controle determinam a operação.

A taxa máxima anunciada não garante a mesma vazão para toda aplicação: há compartilhamento e outros custos.

### Dados, estado e controle

**Dados:** conteúdo recebido ou enviado. **Estado:** condições como ocupado ou disponível. **Controle:** configuração e início de operações.

Há arquiteturas com portas em espaço separado e outras com **E/S mapeada em memória (MMIO)**. MMIO permite usar endereços de memória para registradores; não transforma esses registradores em RAM comum.

No xv6 RISC-V, os mapeamentos do kernel dão acesso às interfaces emuladas.

> **Leitura de referência:** Maziero, cap. 19, §§19.3–19.5, p. 238–243.

### Desafios e respostas

1. **Um barramento anuncia alta taxa de transferência. O que isso garante?** Resposta: Um limite de capacidade que não elimina outros gargalos. Dispositivo, protocolo, filas, CPU e compartilhamento podem limitar a transferência efetiva.
2. **Qual informação normalmente vem de um registrador de estado?** Resposta: Pronto, ocupado ou erro. Flags de estado ajudam o driver a decidir quando iniciar, continuar ou tratar uma operação.
3. **O que caracteriza MMIO?** Resposta: Registradores de dispositivo são acessados por endereços do espaço de memória. MMIO mapeia registradores no espaço de endereços; proteção e regras de acesso continuam existindo.
4. **Escrever em um registrador de controle pode servir para…** Resposta: Solicitar o início de uma operação. Um comando escrito no registrador adequado pode disparar uma operação; os efeitos dependem do protocolo.
5. **Associação:** Dados → Conteúdo da transferência; Estado → Disponibilidade ou erro; Controle → Comando ou configuração; MMIO → Endereçamento de registradores por memória.
6. **Ordene uma transmissão didática por consulta ao estado.** Driver consulta a disponibilidade → Driver constata que o dispositivo está pronto → Driver escreve o dado na interface → Driver sinaliza o comando de envio.

### Veja no xv6

**Regiões de dispositivo do kernel** — `kernel/memlayout.h; kernel/vm.c; kernel/uart.c`.

```text
endereço de dispositivo -> mapeamento do kernel -> acesso a registradores
```

Procure as regiões UART0 e VIRTIO0. Elas representam dispositivos; acesso MMIO não deve ser confundido com acesso a um buffer comum.

### E no Linux?

```sh
cat /proc/iomem
```

Saída ilustrativa; nomes, valores e disponibilidade variam conforme o sistema. Alguns sistemas ocultam os endereços para usuários comuns. Esta consulta é somente de leitura e não concede acesso aos registradores.

### Páginas do manual

`barramento(7)`, `registradores de E/S(7)`, `MMIO(7)`.

---

## Fase 5.3 — Interrupções e tratamento de eventos

**Pergunta-guia:** Como o dispositivo avisa que há trabalho sem a CPU perguntar o tempo todo?

### Um evento pede atenção

O dispositivo pode precisar de atenção enquanto outro programa usa a CPU.

Uma **IRQ** sinaliza um evento. O caminho de entrada preserva o estado necessário e encaminha o atendimento ao tratador. Ao terminar, o kernel pode retomar a execução ou tomar decisões de escalonamento.

Interrupção é notificação; ela não é sinônimo de transferência DMA. Uma interrupção também pode ocorrer quando a CPU já está no kernel.

### Atendimento rápido e trabalho adiado

O tratador deve respeitar as restrições do contexto de interrupção. Trabalho demorado pode ser adiado para outro contexto quando o sistema oferece esse mecanismo.

O modelo de atendimento em níveis separa resposta imediata e processamento posterior. Sua implementação varia por SO; não suponha que todo tratador execute como uma thread comum.

Uma tarefa acordada fica apta a disputar CPU. A conclusão da E/S não garante que ela execute imediatamente.

> **Leitura de referência:** Maziero, cap. 19, §19.6, p. 243–247; cap. 20, §20.6, p. 258–260.

### Desafios e respostas

1. **Qual situação pode provocar uma interrupção de dispositivo?** Resposta: A conclusão de uma requisição de disco. A conclusão pode ser sinalizada para que o driver processe o resultado e acorde tarefas interessadas.
2. **A CPU estava no kernel quando recebeu uma interrupção habilitada. Isso é impossível?** Resposta: Não, o kernel também pode ser interrompido. Interrupções podem chegar em diferentes contextos. Salvar estado e mudar de privilégio são questões distintas.
3. **Por que evitar trabalho longo no trecho crítico do tratamento de interrupção?** Resposta: Para reduzir atrasos e o risco de perder atendimento de outros eventos. Uma resposta rápida e o adiamento adequado de trabalho ajudam a manter a responsividade.
4. **No xv6, um processo acordado ao terminar uma E/S normalmente passa a…** Resposta: RUNNABLE, aguardando possibilidade de execução. wakeup torna o processo elegível; o escalonador decide quando ele volta a executar.
5. **Associação:** IRQ → Notificação de evento; Tratador → Atendimento da ocorrência; Controlador de interrupções → Encaminhamento e identificação de fontes; Tarefa acordada → Pode voltar a disputar CPU.
6. **Ordene um atendimento externo simplificado.** Dispositivo sinaliza um evento → CPU entra pelo caminho de interrupção → Kernel identifica a origem e chama o tratador → Driver atende e registra a conclusão → Kernel finaliza o atendimento e decide a continuação.

### Veja no xv6

**Interrupções externas no xv6** — `kernel/trap.c; kernel/plic.c`.

```text
devintr -> plic_claim -> uartintr ou virtio_disk_intr -> plic_complete
```

O esquema representa o encaminhamento externo. Temporizadores usam outro caminho. O contexto necessário é preservado pelo código de entrada.

### E no Linux?

```sh
cat /proc/interrupts
```

Saída ilustrativa; nomes, valores e disponibilidade variam conforme o sistema. A apresentação depende da arquitetura. Contadores mostram ocorrências; não significam que cada ocorrência transferiu exatamente um bloco.

### Páginas do manual

`IRQ(7)`, `tratador de interrupção(7)`, `PLIC(7)`.

---

## Fase 5.4 — Camadas de E/S e drivers

**Pergunta-guia:** Como o mesmo programa usa equipamentos diferentes sem conhecer cada modelo?

### Uma operação atravessa camadas

Uma chamada de leitura é uma solicitação, não uma ordem direta ao hardware.

A aplicação usa uma interface do sistema. Subsistemas do kernel validam e organizam a operação. O driver converte a requisição em comandos do dispositivo.

Uma leitura pode ser satisfeita por dados já disponíveis em memória. Portanto, nem toda chamada de leitura chega ao disco.

### Mais do que ler e escrever

Um driver pode inicializar o equipamento, configurar parâmetros, organizar filas, acompanhar operações e reportar falhas.

Interfaces genéricas permitem tratar classes de dispositivos sem espalhar detalhes de fabricante pelas aplicações. Elas não garantem que qualquer operação seja suportada por qualquer dispositivo.

No Linux, alguns drivers são módulos e outros são integrados. No xv6, estudamos drivers que fazem parte do kernel didático.

> **Leitura de referência:** Maziero, cap. 20, §§20.1–20.4, p. 248–252.

### Desafios e respostas

1. **Qual componente conhece os registradores específicos de um dispositivo?** Resposta: O driver correspondente. O driver faz a adaptação entre operações do sistema e o protocolo concreto do controlador.
2. **Toda chamada read precisa gerar acesso físico ao disco?** Resposta: Não; cache, tipo de descritor e estado da operação podem mudar o caminho. O descritor pode representar recursos diferentes, e dados em cache podem evitar uma nova leitura física.
3. **Qual afirmação sobre drivers Linux é correta?** Resposta: Um driver pode ser integrado ao kernel ou modular. A configuração do kernel determina se um driver compatível é integrado ou carregável.
4. **Se uma operação de dispositivo falha, o driver deve…** Resposta: Reportar ou tratar a falha segundo o contrato do sistema. Erros precisam ser comunicados ou tratados; uma interface simples não permite inventar sucesso.
5. **Associação:** Aplicação → Solicita serviços por uma interface; Subsistema genérico → Organiza operações compartilhadas da classe; Driver específico → Adapta comandos ao equipamento; Controlador → Executa o protocolo do dispositivo.
6. **Ordene uma leitura que realmente precisa chegar ao disco.** Aplicação solicita a leitura → Kernel verifica e organiza a requisição → Driver prepara a operação de disco → Dispositivo realiza a operação → Kernel entrega resultado ou erro à aplicação.

### Veja no xv6

**Um sistema, mais de um driver** — `kernel/uart.c; kernel/virtio_disk.c; kernel/file.c`.

```text
processo -> interface do kernel -> driver apropriado -> dispositivo
```

UART e disco têm interfaces e caminhos diferentes. A existência de arquivos especiais não obriga todo dispositivo a ser exposto da mesma maneira.

### E no Linux?

```sh
cat /proc/modules
```

Saída ilustrativa; nomes, valores e disponibilidade variam conforme o sistema. A lista não contém todos os drivers existentes: código integrado ao kernel não aparece como módulo carregado.

### Páginas do manual

`driver(7)`, `interface genérica de dispositivo(7)`, `fila de E/S(7)`.

---

## Fase 5.5 — Classes, /dev e operações de controle

**Pergunta-guia:** Por que um disco e um terminal podem usar arquivos sem se comportar do mesmo jeito?

### Classes organizam interfaces

Uma interface comum não torna todos os dispositivos iguais.

**Blocos:** unidades endereçáveis de armazenamento. **Caracteres:** interface de fluxo ou operações próprias de dispositivos dessa classe. **Rede:** comunicação por mensagens e pacotes. **Gráficos:** operações e memória de vídeo específicas.

A classificação ajuda o software, mas o tamanho de cada chamada não define sozinho a classe: ler vários bytes não transforma um terminal em disco.

### Arquivos especiais e controle

Em sistemas Unix/Linux, muitos dispositivos são representados em `/dev`. A listagem usa `b` para bloco e `c` para caractere. Major/minor identificam o dispositivo segundo o subsistema.

`/dev/null` descarta dados e não representa um disco físico. A chamada `ioctl` oferece controles específicos, como consultas de terminal. Nem todo descritor suporta o mesmo controle.

O xv6 usa uma organização reduzida, incluindo o nó console; não reproduz a árvore /dev nem a chamada ioctl do Linux.

> **Leitura de referência:** Maziero, cap. 20, §§20.3–20.4, p. 249–252; apoio: cap. 22, §22.4.

### Desafios e respostas

1. **Qual propriedade combina com uma interface de armazenamento em blocos?** Resposta: Acesso por unidades endereçáveis. O endereçamento de unidades é uma característica importante de interfaces em blocos.
2. **Um dispositivo de caractere devolveu vários bytes em read. Isso o transforma em dispositivo de bloco?** Resposta: Não; a classe depende da interface, não só do tamanho da leitura. O tamanho de uma operação não é suficiente para classificar o dispositivo.
3. **O que /dev/null mostra sobre arquivos de dispositivo?** Resposta: Também podem representar dispositivos virtuais. A interface de dispositivo pode representar um serviço virtual.
4. **Qual uso combina com ioctl em um sistema que oferece a operação?** Resposta: Consultar propriedades específicas de um terminal aberto. ioctl depende de um descritor válido e de uma operação suportada pelo objeto correspondente.
5. **Associação:** b na listagem → Nó especial de bloco; c na listagem → Nó especial de caractere; major/minor → Identificação interpretada pelo subsistema; ioctl → Operação de controle específica.
6. **Terminal simulado:** `ls -l /dev/null`. O c indica caractere. Os números 1 e 3 são major/minor neste exemplo. A saída é ilustrativa e não foi obtida no computador do jogador.

### Veja no xv6

**Nós de dispositivo no xv6** — `kernel/sysfile.c; kernel/file.c; kernel/console.c`.

```text
inode de dispositivo -> major -> entrada devsw -> operação do console
```

O xv6 possui identificação e despacho de operações de dispositivo. Isso não implica suporte ao ioctl do Linux ou a todas as suas classes.

### E no Linux?

```sh
ls -l /dev/null
```

Saída ilustrativa; nomes, valores e disponibilidade variam conforme o sistema. O primeiro caractere informa o tipo do nó; o exemplo usa 1,3. Outros dispositivos e ambientes apresentam valores diferentes.

### Páginas do manual

`dispositivo de bloco(7)`, `/dev(7)`, `ioctl(2)`.

---

## Fase 5.6 — Consulta, eventos e espera por E/S

**Pergunta-guia:** Esperar por E/S precisa ocupar o processador?

### Consultar ou receber uma notificação

Durante uma leitura de disco, o processador pode ter outras tarefas para fazer.

Na **consulta**, o software verifica o estado. Uma repetição contínua pode virar espera ativa. Na abordagem por **eventos**, a operação é iniciada e uma ocorrência posterior informa sua evolução ou conclusão.

Não confunda E/S bloqueante com espera ativa: bloquear uma tarefa pode justamente liberar a CPU para outra.

### Acordar com a condição correta

O kernel deve verificar uma condição e organizar a espera com sincronização apropriada. Uma notificação não pode ser perdida entre a verificação e o bloqueio.

Quando a operação termina, a tarefa interessada pode voltar ao estado pronto. Ainda há disputa pela CPU. Em uma implementação real, acesso a filas e buffers também precisa ser protegido.

Na simulação a seguir, observe somente as transições de estado; ela não executa um driver real.

> **Leitura de referência:** Maziero, cap. 20, §§20.5.1–20.5.2, p. 252–256.

### Desafios e respostas

1. **Qual cenário representa espera ativa?** Resposta: O processo repete consultas continuamente até o dispositivo terminar. Na espera ativa, instruções de consulta continuam consumindo CPU.
2. **Uma chamada bloqueante obriga a CPU a ficar sem executar outros processos?** Resposta: Não; o processo pode dormir e o escalonador executar outro. O bloqueio da tarefa é um mecanismo de coordenação; outras tarefas prontas podem ser escalonadas.
3. **Por que sincronizar a verificação da condição e a espera?** Resposta: Para evitar que uma notificação seja perdida nessa transição. Uma transição desprotegida pode deixar a tarefa esperando depois que o evento já ocorreu.
4. **Qual comparação é correta?** Resposta: Espera ativa usa CPU; uma tarefa bloqueada pode liberar CPU. Notificação, transferência, espera e sincronização são aspectos relacionados, mas diferentes.
5. **Associação:** Consulta contínua → Pode consumir CPU enquanto espera; Bloqueio do solicitante → Permite executar outra tarefa pronta; Notificação de conclusão → Informa que a condição pode ter mudado; Escalonamento → Decide quem executa a seguir.
6. **Simulação de processos:** P1: I/O; P2: Escalonar; P1: Fim da E/S. P1 libera a CPU ao bloquear. A conclusão o torna pronto; P2 continua executando. A simulação não mede desempenho nem executa E/S real.

### Veja no xv6

**Dormir e acordar no caminho do disco** — `kernel/virtio_disk.c; kernel/proc.c`.

```text
solicitante inicia E/S -> sleep
conclusão -> wakeup -> RUNNABLE
escalonador -> RUNNING
```

É necessário coordenar condição, locks e espera. Consulte o código da versão usada para entender como evita perder a conclusão.

### E no Linux?

```sh
ps -o pid,stat,comm
```

Saída ilustrativa; nomes, valores e disponibilidade variam conforme o sistema. S e D são estados de espera diferentes no Linux. Uma fotografia do ps não basta para concluir qual dispositivo ou operação causou a espera.

### Páginas do manual

`polling(7)`, `espera ativa de E/S(7)`, `E/S por eventos(7)`.

---

## Fase 5.7 — DMA e transferência de dados

**Pergunta-guia:** Quem move os dados quando a CPU não copia cada unidade transferida?

### Preparar não é copiar cada byte

DMA economiza trabalho de cópia da CPU, mas não elimina o driver.

O software prepara regiões de memória e informações da requisição. O dispositivo ou um controlador realiza a transferência. A conclusão e os erros continuam precisando de tratamento.

DMA e interrupção resolvem questões diferentes: mover dados e notificar eventos. Conclusões podem ser agrupadas ou detectadas por consulta, dependendo do projeto.

### Posse do buffer e custos

Enquanto um buffer está em uso pelo dispositivo, software e hardware precisam respeitar regras de acesso e visibilidade. Reutilizá-lo cedo pode corromper dados.

Há custos de configuração e possíveis disputas de memória. O benefício depende da carga e do tamanho das operações; DMA não é uma promessa de aceleração universal.

Os detalhes modernos de mapeamento e sincronização são complementados pela documentação técnica, além da visão introdutória do livro.

> **Leitura de referência:** Maziero, cap. 20, §20.5.3, p. 256–258; complemento: Linux DMA API.

### Desafios e respostas

1. **Qual trabalho o DMA procura evitar para a CPU?** Resposta: Copiar diretamente cada unidade de dados da transferência. A CPU ainda participa da preparação e conclusão; o dispositivo assume o movimento de dados definido pelo protocolo.
2. **É correto fornecer ao dispositivo qualquer ponteiro virtual de uma aplicação?** Resposta: Não; o acesso precisa ser preparado com endereçamento e memória adequados. A memória e seus endereços precisam ser preparados conforme a arquitetura e a API. Um ponteiro arbitrário não é suficiente.
3. **Um buffer DMA pode ser sobrescrito livremente antes da conclusão?** Resposta: Não; é necessário respeitar o protocolo e o período de uso. A duração de uso e a sincronização do buffer são parte da correção da operação.
4. **Toda transferência DMA gera exatamente uma interrupção?** Resposta: Não; a política de notificação varia. Há projetos com notificações agrupadas ou consulta de conclusão. Não há essa regra universal.
5. **Associação:** Preparação → Driver organiza memória e requisição; Transferência → Dispositivo movimenta os dados; Conclusão → Software confirma resultado e erros; Reutilização → Buffer volta ao uso permitido pelo protocolo.
6. **Ordene o ciclo didático de uma requisição DMA.** Preparar buffer e endereços adequados → Publicar descritores e iniciar a requisição → Dispositivo realiza a transferência → Verificar e sincronizar a conclusão → Consumir ou reutilizar o buffer conforme o protocolo.

### Veja no xv6

**Filas e descritores VirtIO** — `kernel/virtio_disk.c`.

```text
descritores -> fila disponível -> dispositivo
dispositivo -> fila de usados -> tratamento da conclusão
```

VirtIO é o exemplo usado pelo xv6 em QEMU. Este esquema não implica que seu controlador seja idêntico a um dispositivo NVMe real.

### E no Linux?

```sh
readlink /sys/class/block/vda/device/driver
```

Saída ilustrativa; nomes, valores e disponibilidade variam conforme o sistema. O nome vda é apenas um exemplo. O caminho pode não existir em sua máquina. Essa consulta identifica associações e não mede ou executa uma transferência DMA.

### Páginas do manual

`DMA(7)`, `descritor DMA(7)`, `endereço DMA(7)`.

---

## Fase 5.8 — Buffers, cache e coordenação

**Pergunta-guia:** Uma área de memória intermediária é sempre um cache? E sempre torna a E/S assíncrona?

### Três objetivos distintos

Buffer, cache e double buffering podem coexistir, mas não são sinônimos.

**Buffer:** intermedeia dados. **Cache:** procura reutilizar dados já disponíveis. **Double buffering:** alterna duas áreas para permitir sobreposição quando o sistema oferece concorrência.

Este aprofundamento é um complemento técnico. Não atribuímos a Maziero uma seção específica de double buffering não identificada na consulta.

### Buffers também são recursos compartilhados

Se duas tarefas ou uma tarefa e um dispositivo usam a mesma região, é preciso definir quando cada um pode acessá-la.

Um produtor não deve sobrescrever dados ainda não consumidos. Um consumidor não deve tratar como pronto um bloco que ainda está sendo preenchido.

Isso conecta E/S a processos e threads: filas, condições de espera e proteção de dados são necessários para manter a operação correta.

> **Leitura de referência:** Apoio: Maziero, cap. 20, §20.5.2; complemento: xv6 bio.c e coordenação entre tarefas.

### Desafios e respostas

1. **Qual situação caracteriza um acerto de cache de blocos?** Resposta: O bloco válido em memória atende a leitura sem nova busca no disco. Um bloco válido pode ser reutilizado. Isso não garante, por si só, persistência de todas as escritas.
2. **Qual é o objetivo típico de double buffering?** Resposta: Alternar duas áreas para permitir sobreposição de etapas. A alternância pode permitir sobreposição, mas precisa evitar sobrescrever um buffer ainda em uso.
3. **O produtor quer reutilizar um buffer que o consumidor ainda está lendo. Qual é a decisão correta?** Resposta: Esperar a liberação ou usar outra área disponível com coordenação. É necessário respeitar a posse do buffer para impedir que o consumidor leia dados parcialmente substituídos.
4. **A existência de um buffer torna qualquer chamada automaticamente assíncrona?** Resposta: Não; a semântica depende da interface e da implementação. Uma chamada pode usar buffers e ainda assim bloquear. Assincronia depende do contrato e dos mecanismos usados.
5. **Associação:** Buffer → Intermediação temporária; Cache → Reutilização de dados; Double buffering → Alternância entre duas áreas; Sincronização → Coordenação do acesso compartilhado.
6. **Ordene uma leitura com falta no cache e conclusão por eventos.** Solicitar o bloco ao cache → Constatar que os dados ainda não estão válidos → Iniciar leitura e aguardar sua conclusão → Marcar os dados como disponíveis após o sucesso → Entregar o bloco ao solicitante.

### Veja no xv6

**O cache de blocos do xv6** — `kernel/bio.c; kernel/virtio_disk.c`.

```text
bread -> bget
bloco inválido -> leitura VirtIO
leitura concluída -> bloco válido
brelse -> libera uso do buffer
```

Procure a verificação de valid em bread. O bcache é um cache de blocos e não uma implementação automática de double buffering.

### E no Linux?

```sh
grep -E "^(Buffers|Cached):" /proc/meminfo
```

Saída ilustrativa; nomes, valores e disponibilidade variam conforme o sistema. Os campos possuem significados próprios no Linux. A saída não informa quantos buffers o xv6 utiliza nem comprova double buffering.

### Páginas do manual

`buffer de E/S(7)`, `buffer cache(7)`, `double buffering(7)`.

---

## Fase 5.9 — Armazenamento e revisão integrada

**Pergunta-guia:** Como as características do dispositivo influenciam uma requisição de leitura?

### O dispositivo importa

Uma abstração em blocos pode esconder tecnologias muito diferentes.

**HDD:** o movimento de cabeças e a rotação influenciam a latência. **SSD:** não há essa mecânica; tradução e gestão da memória flash continuam importantes.

Filas permitem organizar requisições. Reduzir movimento de cabeça é uma preocupação específica de discos mecânicos, não uma regra universal de otimização de SSDs.

### Redundância e o caminho completo

RAID combina dispositivos por políticas específicas. Distribuição de dados e redundância são propriedades diferentes: **RAID 0 não oferece redundância**.

Redundância não é backup independente: uma exclusão acidental pode ser refletida nas cópias ativas.

Na revisão final, conecte aplicação, kernel, cache, driver, dispositivo, conclusão e escalonamento. Nem toda leitura percorre todo esse caminho: um acerto de cache pode encurtá-lo.

> **Leitura de referência:** Maziero, cap. 21, §§21.1–21.4; revisão dos caps. 19–20.

### Desafios e respostas

1. **Qual custo é específico do mecanismo de um HDD?** Resposta: Deslocamento da cabeça e espera de rotação. HDDs possuem latências mecânicas. SSDs não têm o mesmo tipo de posicionamento físico.
2. **Um SSD dispensa qualquer gestão interna porque não tem partes móveis?** Resposta: Não; tradução, apagamento e desgaste ainda precisam de gestão. A tecnologia flash possui restrições e custos próprios que o controlador precisa administrar.
3. **Qual afirmação sobre RAID é correta?** Resposta: RAID 0 distribui dados sem oferecer redundância. As garantias dependem do nível e do cenário; RAID não substitui uma política de backup.
4. **P1 dorme esperando uma leitura DMA e P2 está executando. A leitura termina com sucesso. O que é correto?** Resposta: O driver pode acordar P1; o escalonamento ainda determina sua execução. A conclusão modifica a condição de espera; acordar a tarefa não elimina a decisão do escalonador.
5. **Associação:** HDD → Latência com componentes mecânicos; SSD → Gestão de memória flash; RAID 0 → Distribuição sem redundância; Backup independente → Cópia para recuperação fora do conjunto ativo.
6. **Ordene uma leitura de disco com falta no cache, DMA e espera por eventos.** Aplicação solicita a leitura → Kernel identifica a falta no cache e prepara a requisição → Driver inicia a operação e o solicitante bloqueia → Dispositivo transfere os dados e sinaliza conclusão → Driver confirma sucesso e acorda o solicitante → Escalonador permite a retomada para consumir o resultado.

### Veja no xv6

**O experimento do xv6 é um modelo concreto** — `kernel/bio.c; kernel/virtio_disk.c; kernel/proc.c`.

```text
cache -> driver -> VirtIO -> conclusão -> wakeup -> escalonamento
```

O disco visto pelo xv6 no QEMU é virtual. O experimento não mede movimento físico de HDD, desgaste de flash ou um RAID real. Use-o para explicar a coordenação de E/S.

### E no Linux?

```sh
lsblk -o NAME,TYPE,SIZE,ROTA
```

Saída ilustrativa; nomes, valores e disponibilidade variam conforme o sistema. ROTA informa a característica rotacional anunciada ao sistema. Em máquinas virtuais ela não prova qual mídia existe no host.

### Páginas do manual

`HDD(7)`, `SSD(7)`, `RAID(7)`.

---

## Referências e complementos

### Livro-base

MAZIERO, Carlos A. *Sistemas Operacionais: Conceitos e Mecanismos*. Curitiba: DINF/UFPR, 2019. ISBN 978-85-7335-340-2. Acesso em: 18 nov. 2026.

- [Página oficial e materiais](https://wiki.inf.ufpr.br/maziero/doku.php?id=socm:start).
- [Livro completo](https://wiki.inf.ufpr.br/maziero/lib/exe/fetch.php?media=socm:socm-livro.pdf).
- [Capítulo 19](https://wiki.inf.ufpr.br/maziero/lib/exe/fetch.php?media=socm:socm-texto-19.pdf).
- [Capítulo 20](https://wiki.inf.ufpr.br/maziero/lib/exe/fetch.php?media=socm:socm-texto-20.pdf).
- [Capítulo 21](https://wiki.inf.ufpr.br/maziero/lib/exe/fetch.php?media=socm:socm-texto-21.pdf).

Maziero é disponibilizado pelo autor sob CC BY-NC-SA 3.0. Os textos e desafios desta proposta foram redigidos para o jogo, sem reprodução das listagens ou figuras do livro.

### Implementações e interfaces

- [xv6 RISC-V oficial](https://github.com/mit-pdos/xv6-riscv/tree/riscv/kernel): `uart.c`, `console.c`, `trap.c`, `plic.c`, `virtio_disk.c`, `bio.c`, `proc.c`, `file.c`, `sysfile.c`, `memlayout.h` e `vm.c`. Confira os arquivos na versão usada pela disciplina; os esquemas fornecidos não são transcrições.
- [Linux DMA API HOWTO](https://www.kernel.org/doc/html/latest/core-api/dma-api-howto.html): complemento de mapeamento e sincronização.
- [Arquivos especiais](https://man7.org/linux/man-pages/man4/intro.4.html), [mknod](https://man7.org/linux/man-pages/man2/mknod.2.html) e [ioctl](https://man7.org/linux/man-pages/man2/ioctl.2.html): interfaces Unix/Linux.

Os comandos dos cartões são sugestões de observação no Linux. Podem não existir ou expor as mesmas informações em todos os ambientes. O terminal interno do jogo é simulado; aceitar um comando nele não comprova sua execução em Linux ou xv6 reais.
