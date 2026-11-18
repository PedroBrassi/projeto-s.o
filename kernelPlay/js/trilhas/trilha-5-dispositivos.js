/* =========================================================
   KernelPlay — Trilha 5: Dispositivos e Entrada/Saída — revisão 2
   Roteiro autoral organizado pelos capítulos 19, 20 e 21 de:
   MAZIERO, Carlos A. Sistemas Operacionais: Conceitos e Mecanismos.
   DINF/UFPR, 2019. Fonte oficial e seções na documentação acompanhante.

   Compatível com o formato atual de js/trilhas.js e js/jogo.js.
   Substitua a trilha 5 anterior: NÃO carregue duas versões ao mesmo tempo.
   Novos IDs es-v2-* iniciam progresso próprio para as novas etapas.
   Esquemas e saídas são didáticos, não resultados reais do grupo.
   Campos referencia e pergunta_guia são metadados (o motor os ignora).
   ========================================================= */

TRILHAS.push({
  id: "dispositivos",
  numero: 5,
  titulo: "Dispositivos e Entrada/Saída",
  subtitulo: "Hardware, drivers, classes, estratégias de E/S, DMA e armazenamento; conexões com processos e threads.",
  fases: [
    // ==================== FASE 5.1: Dispositivos, controladores e firmware
    {
      "id": "es-v2-hardware",
      "etapa": "5.1",
      "titulo": "Dispositivos, controladores e firmware",
      "descricao": "O caminho entre o mundo externo e o computador",
      "icone": "🔌",
      "referencia": "Maziero, cap. 19, §§19.1–19.2, p. 235–238",
      "pergunta_guia": "Como uma tecla pressionada se transforma em dados que um programa consegue ler?",
      "man": [
        {
          "termo": "dispositivo de E/S",
          "secao": "7",
          "resumo": "componente que permite trocar dados com o ambiente",
          "detalhe": "Pode captar entradas, produzir saídas ou realizar ambas. Armazenamento e comunicação também são formas de E/S.",
          "exemplo": "Teclado: entrada; monitor: saída; interface de rede: entrada e saída.",
          "veja": [
            "controlador(7)",
            "driver(7)"
          ]
        },
        {
          "termo": "controlador",
          "secao": "7",
          "resumo": "interface que coordena operações de um dispositivo",
          "detalhe": "Oferece comandos e informações de estado ao software. Pode ser integrado ao periférico, à placa ou implementado por emulação.",
          "exemplo": "O controlador de disco aceita requisições e informa sua conclusão.",
          "veja": [
            "firmware(7)"
          ]
        },
        {
          "termo": "firmware",
          "secao": "7",
          "resumo": "software que executa no dispositivo ou em seu controlador",
          "detalhe": "Coordena detalhes locais do equipamento. É diferente do driver, que integra o dispositivo ao sistema operacional.",
          "exemplo": "Código interno de uma impressora ou de um SSD.",
          "veja": [
            "driver(7)"
          ]
        }
      ],
      "desafios": [
        {
          "tipo": "conceito",
          "titulo": "Do evento físico ao dado",
          "texto": "<p class=\"destaque\">Como uma tecla pressionada chega a um programa?</p><p>O evento é captado pelo dispositivo. Seu controlador organiza a informação e fornece uma interface para o computador. O sistema operacional usa essa interface e entrega uma abstração às aplicações.</p><p><b>Entrada e saída</b> incluem interação com usuários, armazenamento e comunicação. O mesmo equipamento pode receber e enviar dados.</p>"
        },
        {
          "tipo": "multipla",
          "pergunta": "Qual equipamento realiza entrada e saída?",
          "opcoes": [
            "Teclado usado apenas para digitação",
            "Monitor usado apenas para exibição",
            "Interface de rede que recebe e envia pacotes",
            "Arquivo de texto fechado"
          ],
          "correta": 2,
          "dica": "Pense em receber e transmitir.",
          "explicacao": "Uma interface de rede recebe e transmite dados. A classificação depende da função observada."
        },
        {
          "tipo": "multipla",
          "pergunta": "Por que o SO precisa de abstrações para E/S?",
          "opcoes": [
            "Porque todos os periféricos têm a mesma interface",
            "Porque dispositivos diferem em comandos, formatos e velocidade",
            "Para impedir que aplicações usem dispositivos",
            "Para transformar todo dispositivo em memória RAM"
          ],
          "correta": 1,
          "dica": "Uma impressora e um disco não aceitam os mesmos comandos.",
          "explicacao": "Interfaces uniformes reduzem a necessidade de cada aplicação conhecer os detalhes de todos os equipamentos."
        },
        {
          "tipo": "conceito",
          "titulo": "Controlador, firmware e driver",
          "texto": "<p><b>Controlador:</b> coordena o dispositivo e expõe comandos, dados e estado.</p><p><b>Firmware:</b> código executado no próprio equipamento ou controlador.</p><p><b>Driver:</b> software que faz a integração com o SO. Um dispositivo emulado também possui uma interface e precisa de driver no sistema convidado.</p><p>Não confunda o controlador do dispositivo com um controlador de interrupções: eles têm funções diferentes.</p>"
        },
        {
          "tipo": "multipla",
          "pergunta": "Onde atua o driver do SO em relação ao controlador?",
          "opcoes": [
            "Interpreta a interface do controlador para solicitar operações",
            "Substitui o hardware do controlador fisicamente",
            "É sempre o firmware gravado no periférico",
            "É o programa que desenha toda interface gráfica"
          ],
          "correta": 0,
          "dica": "O driver conhece os comandos do equipamento.",
          "explicacao": "O driver traduz operações do sistema para a interface do dispositivo, incluindo tratamento de estado e erros."
        },
        {
          "tipo": "multipla",
          "pergunta": "O QEMU emula um disco VirtIO para o xv6. O xv6 ainda precisa de driver?",
          "opcoes": [
            "Não, emulação elimina qualquer interface",
            "Sim, o xv6 precisa conversar com a interface emulada",
            "Não, o arquivo fs.img é um driver",
            "Somente se o computador real não tiver SSD"
          ],
          "correta": 1,
          "dica": "Emulação muda a implementação do dispositivo, não elimina o protocolo.",
          "explicacao": "O dispositivo emulado atende um protocolo. O kernel convidado precisa saber usá-lo."
        },
        {
          "tipo": "associar",
          "pergunta": "Associe cada elemento à função correspondente.",
          "pares": [
            [
              "Dispositivo",
              "Troca dados com o ambiente"
            ],
            [
              "Controlador",
              "Expõe comandos e estado do equipamento"
            ],
            [
              "Firmware",
              "Executa funções internas do dispositivo"
            ],
            [
              "Driver",
              "Integra o dispositivo ao SO"
            ]
          ],
          "dica": "Compare as responsabilidades de cada elemento antes de ligar os pares.",
          "explicacao": "Cada camada assume uma responsabilidade; o driver não é sinônimo de firmware."
        },
        {
          "tipo": "ordenar",
          "pergunta": "Ordene um caminho didático de entrada de teclado.",
          "itens": [
            "Usuário pressiona uma tecla",
            "Dispositivo e controlador registram o evento",
            "Driver obtém os dados pela interface",
            "SO disponibiliza os dados à aplicação"
          ],
          "dica": "Comece pela causa da operação e termine no resultado para o solicitante.",
          "explicacao": "A aplicação utiliza a abstração oferecida pelo SO. A captura e o transporte acontecem em camadas inferiores."
        }
      ],
      "xv6": {
        "titulo": "Console e UART no xv6",
        "arquivo": "kernel/uart.c; kernel/console.c",
        "codigo": "UART emulada -> driver UART -> console -> processo leitor",
        "texto": "O console do xv6 permite estudar uma entrada de dados concreta sem supor que todo equipamento tenha a mesma interface.",
        "nota": "Esquema didático, não transcrição de código nem evidência de execução. Confira a versão do xv6 usada na disciplina."
      },
      "linux": {
        "titulo": "Identificar dispositivos conectados",
        "comando": "ls /sys/class",
        "saida": "block  input  net  tty  ...",
        "texto": "Saída ilustrativa; nomes, valores e disponibilidade variam conforme o sistema. O sysfs expõe informações organizadas por classes. /sys é uma interface de informações do kernel; não equivale a listar todos os nós de /dev."
      }
    },
    // ==================== FASE 5.2: Barramentos e interfaces de acesso
    {
      "id": "es-v2-interfaces",
      "etapa": "5.2",
      "titulo": "Barramentos e interfaces de acesso",
      "descricao": "Dados, estado, controle e endereçamento de portas",
      "icone": "🚌",
      "referencia": "Maziero, cap. 19, §§19.3–19.5, p. 238–243",
      "pergunta_guia": "Como o processador distingue enviar um dado de consultar o estado de um dispositivo?",
      "man": [
        {
          "termo": "barramento",
          "secao": "7",
          "resumo": "meio de interconexão e protocolo para transportar transações",
          "detalhe": "Há regras para endereçar e transferir dados. Taxa nominal, latência e capacidade compartilhada afetam o desempenho.",
          "exemplo": "PCIe e USB são exemplos de tecnologias de interconexão."
        },
        {
          "termo": "registradores de E/S",
          "secao": "7",
          "resumo": "pontos de dados, estado e controle da interface",
          "detalhe": "Um registrador pode oferecer dados recebidos, indicar disponibilidade ou aceitar comandos. Endereço e significado são definidos pelo dispositivo.",
          "exemplo": "Consultar READY antes de iniciar uma operação.",
          "veja": [
            "MMIO(7)"
          ]
        },
        {
          "termo": "MMIO",
          "secao": "7",
          "resumo": "Memory-Mapped I/O: registradores no espaço de endereços de memória",
          "detalhe": "O software do kernel acessa registradores mapeados conforme a arquitetura. O acesso deve respeitar largura, ordenação e proteção; não é uma autorização para um programa comum acessar hardware.",
          "exemplo": "O xv6 mapeia regiões de UART e VirtIO para o kernel.",
          "veja": [
            "registradores de E/S(7)"
          ]
        }
      ],
      "desafios": [
        {
          "tipo": "conceito",
          "titulo": "O barramento transporta transações",
          "texto": "<p class=\"destaque\">Conectar um dispositivo não significa falar sua linguagem.</p><p>O barramento fornece um meio e regras para transferências. O controlador ainda define seus próprios registradores e comandos. Um endereço seleciona o destino; dados e sinais de controle determinam a operação.</p><p>A taxa máxima anunciada não garante a mesma vazão para toda aplicação: há compartilhamento e outros custos.</p>"
        },
        {
          "tipo": "multipla",
          "pergunta": "Um barramento anuncia alta taxa de transferência. O que isso garante?",
          "opcoes": [
            "Que todo programa obterá exatamente essa taxa",
            "Que não haverá latência",
            "Um limite de capacidade que não elimina outros gargalos",
            "Que o dispositivo dispensará driver"
          ],
          "correta": 2,
          "dica": "Separe capacidade do enlace de desempenho fim a fim.",
          "explicacao": "Dispositivo, protocolo, filas, CPU e compartilhamento podem limitar a transferência efetiva."
        },
        {
          "tipo": "multipla",
          "pergunta": "Qual informação normalmente vem de um registrador de estado?",
          "opcoes": [
            "Pronto, ocupado ou erro",
            "O texto completo de todo arquivo",
            "O código-fonte do driver",
            "A senha do usuário"
          ],
          "correta": 0,
          "dica": "Estado descreve a situação da operação.",
          "explicacao": "Flags de estado ajudam o driver a decidir quando iniciar, continuar ou tratar uma operação."
        },
        {
          "tipo": "conceito",
          "titulo": "Dados, estado e controle",
          "texto": "<p><b>Dados:</b> conteúdo recebido ou enviado. <b>Estado:</b> condições como ocupado ou disponível. <b>Controle:</b> configuração e início de operações.</p><p>Há arquiteturas com portas em espaço separado e outras com <b>E/S mapeada em memória (MMIO)</b>. MMIO permite usar endereços de memória para registradores; não transforma esses registradores em RAM comum.</p><p>No xv6 RISC-V, os mapeamentos do kernel dão acesso às interfaces emuladas.</p>"
        },
        {
          "tipo": "multipla",
          "pergunta": "O que caracteriza MMIO?",
          "opcoes": [
            "Arquivos de dispositivo sempre ocupam RAM permanente",
            "Registradores de dispositivo são acessados por endereços do espaço de memória",
            "O driver é escrito obrigatoriamente em Assembly",
            "Qualquer processo pode escrever em qualquer dispositivo"
          ],
          "correta": 1,
          "dica": "O nome descreve o modo de endereçar registradores.",
          "explicacao": "MMIO mapeia registradores no espaço de endereços; proteção e regras de acesso continuam existindo."
        },
        {
          "tipo": "multipla",
          "pergunta": "Escrever em um registrador de controle pode servir para…",
          "opcoes": [
            "Solicitar o início de uma operação",
            "Trocar automaticamente o usuário do processo",
            "Desfragmentar todo o disco sem comando",
            "Modificar a resposta de uma leitura já concluída"
          ],
          "correta": 0,
          "dica": "Controle é diferente do dado transferido.",
          "explicacao": "Um comando escrito no registrador adequado pode disparar uma operação; os efeitos dependem do protocolo."
        },
        {
          "tipo": "associar",
          "pergunta": "Associe cada elemento à função correspondente.",
          "pares": [
            [
              "Dados",
              "Conteúdo da transferência"
            ],
            [
              "Estado",
              "Disponibilidade ou erro"
            ],
            [
              "Controle",
              "Comando ou configuração"
            ],
            [
              "MMIO",
              "Endereçamento de registradores por memória"
            ]
          ],
          "dica": "Compare as responsabilidades de cada elemento antes de ligar os pares.",
          "explicacao": "O significado de cada endereço é definido pela interface do controlador."
        },
        {
          "tipo": "ordenar",
          "pergunta": "Ordene uma transmissão didática por consulta ao estado.",
          "itens": [
            "Driver consulta a disponibilidade",
            "Driver constata que o dispositivo está pronto",
            "Driver escreve o dado na interface",
            "Driver sinaliza o comando de envio"
          ],
          "dica": "Comece pela causa da operação e termine no resultado para o solicitante.",
          "explicacao": "É um modelo de interface para estudo. A ordem concreta e os registradores variam por dispositivo."
        }
      ],
      "xv6": {
        "titulo": "Regiões de dispositivo do kernel",
        "arquivo": "kernel/memlayout.h; kernel/vm.c; kernel/uart.c",
        "codigo": "endereço de dispositivo -> mapeamento do kernel -> acesso a registradores",
        "texto": "Procure as regiões UART0 e VIRTIO0. Elas representam dispositivos; acesso MMIO não deve ser confundido com acesso a um buffer comum.",
        "nota": "Esquema didático, não transcrição de código nem evidência de execução. Confira a versão do xv6 usada na disciplina."
      },
      "linux": {
        "titulo": "Examinar o mapa de recursos",
        "comando": "cat /proc/iomem",
        "saida": "00000000-00000000 : System RAM\n00000000-00000000 : ...",
        "texto": "Saída ilustrativa; nomes, valores e disponibilidade variam conforme o sistema. Alguns sistemas ocultam os endereços para usuários comuns. Esta consulta é somente de leitura e não concede acesso aos registradores."
      }
    },
    // ==================== FASE 5.3: Interrupções e tratamento de eventos
    {
      "id": "es-v2-interrupcoes",
      "etapa": "5.3",
      "titulo": "Interrupções e tratamento de eventos",
      "descricao": "Do IRQ ao tratador: contexto e trabalho adiado",
      "icone": "⚡",
      "referencia": "Maziero, cap. 19, §19.6, p. 243–247; cap. 20, §20.6, p. 258–260",
      "pergunta_guia": "Como o dispositivo avisa que há trabalho sem a CPU perguntar o tempo todo?",
      "man": [
        {
          "termo": "IRQ",
          "secao": "7",
          "resumo": "requisição de interrupção associada a um evento",
          "detalhe": "Pode ser encaminhada por um controlador; linhas e mensagens são formas de sinalização possíveis. O evento pode ocorrer durante código de usuário ou do kernel.",
          "exemplo": "Conclusão de E/S ou chegada de dados.",
          "veja": [
            "tratador de interrupção(7)"
          ]
        },
        {
          "termo": "tratador de interrupção",
          "secao": "7",
          "resumo": "rotina que atende um evento de interrupção",
          "detalhe": "O caminho de entrada preserva o estado necessário. O tratador reconhece o evento e executa as ações exigidas pelo dispositivo. Nem todo trabalho precisa ser feito imediatamente.",
          "exemplo": "No xv6, devintr encaminha eventos externos.",
          "veja": [
            "PLIC(7)"
          ]
        },
        {
          "termo": "PLIC",
          "secao": "7",
          "resumo": "controlador de interrupções externas na plataforma RISC-V do xv6",
          "detalhe": "Permite identificar e concluir o atendimento de interrupções externas. Não é o caminho de todos os tipos de interrupção RISC-V.",
          "exemplo": "UART e VirtIO são fontes externas nessa plataforma."
        }
      ],
      "desafios": [
        {
          "tipo": "conceito",
          "titulo": "Um evento pede atenção",
          "texto": "<p class=\"destaque\">O dispositivo pode precisar de atenção enquanto outro programa usa a CPU.</p><p>Uma <b>IRQ</b> sinaliza um evento. O caminho de entrada preserva o estado necessário e encaminha o atendimento ao tratador. Ao terminar, o kernel pode retomar a execução ou tomar decisões de escalonamento.</p><p>Interrupção é notificação; ela não é sinônimo de transferência DMA. Uma interrupção também pode ocorrer quando a CPU já está no kernel.</p>"
        },
        {
          "tipo": "multipla",
          "pergunta": "Qual situação pode provocar uma interrupção de dispositivo?",
          "opcoes": [
            "A conclusão de uma requisição de disco",
            "A simples existência de uma variável local",
            "Todo acesso bem-sucedido a RAM",
            "Cada linha de um arquivo JavaScript"
          ],
          "correta": 0,
          "dica": "Pense em um evento assíncrono do periférico.",
          "explicacao": "A conclusão pode ser sinalizada para que o driver processe o resultado e acorde tarefas interessadas."
        },
        {
          "tipo": "multipla",
          "pergunta": "A CPU estava no kernel quando recebeu uma interrupção habilitada. Isso é impossível?",
          "opcoes": [
            "Sim, interrupções só vêm do modo usuário",
            "Não, o kernel também pode ser interrompido",
            "Sim, IRQ é chamada de sistema",
            "Não, porque a CPU descarta todo contexto"
          ],
          "correta": 1,
          "dica": "A origem do evento independe do programa corrente.",
          "explicacao": "Interrupções podem chegar em diferentes contextos. Salvar estado e mudar de privilégio são questões distintas."
        },
        {
          "tipo": "conceito",
          "titulo": "Atendimento rápido e trabalho adiado",
          "texto": "<p>O tratador deve respeitar as restrições do contexto de interrupção. Trabalho demorado pode ser adiado para outro contexto quando o sistema oferece esse mecanismo.</p><p>O modelo de atendimento em níveis separa resposta imediata e processamento posterior. Sua implementação varia por SO; não suponha que todo tratador execute como uma thread comum.</p><p>Uma tarefa acordada fica apta a disputar CPU. A conclusão da E/S não garante que ela execute imediatamente.</p>"
        },
        {
          "tipo": "multipla",
          "pergunta": "Por que evitar trabalho longo no trecho crítico do tratamento de interrupção?",
          "opcoes": [
            "Para nunca reconhecer o evento",
            "Para reduzir atrasos e o risco de perder atendimento de outros eventos",
            "Porque interrupções não têm qualquer custo",
            "Para impedir que outros processos executem para sempre"
          ],
          "correta": 1,
          "dica": "O sistema precisa continuar atendendo outras demandas.",
          "explicacao": "Uma resposta rápida e o adiamento adequado de trabalho ajudam a manter a responsividade."
        },
        {
          "tipo": "multipla",
          "pergunta": "No xv6, um processo acordado ao terminar uma E/S normalmente passa a…",
          "opcoes": [
            "RUNNABLE, aguardando possibilidade de execução",
            "ZOMBIE, obrigatoriamente",
            "RUNNING, imediatamente e sem escalonamento",
            "UNUSED, removido da tabela"
          ],
          "correta": 0,
          "dica": "Acordar não é o mesmo que receber a CPU.",
          "explicacao": "wakeup torna o processo elegível; o escalonador decide quando ele volta a executar."
        },
        {
          "tipo": "associar",
          "pergunta": "Associe cada elemento à função correspondente.",
          "pares": [
            [
              "IRQ",
              "Notificação de evento"
            ],
            [
              "Tratador",
              "Atendimento da ocorrência"
            ],
            [
              "Controlador de interrupções",
              "Encaminhamento e identificação de fontes"
            ],
            [
              "Tarefa acordada",
              "Pode voltar a disputar CPU"
            ]
          ],
          "dica": "Compare as responsabilidades de cada elemento antes de ligar os pares.",
          "explicacao": "A notificação, o atendimento e a retomada do processo são momentos diferentes."
        },
        {
          "tipo": "ordenar",
          "pergunta": "Ordene um atendimento externo simplificado.",
          "itens": [
            "Dispositivo sinaliza um evento",
            "CPU entra pelo caminho de interrupção",
            "Kernel identifica a origem e chama o tratador",
            "Driver atende e registra a conclusão",
            "Kernel finaliza o atendimento e decide a continuação"
          ],
          "dica": "Comece pela causa da operação e termine no resultado para o solicitante.",
          "explicacao": "O fluxo concreto depende da arquitetura e das regras do controlador."
        }
      ],
      "xv6": {
        "titulo": "Interrupções externas no xv6",
        "arquivo": "kernel/trap.c; kernel/plic.c",
        "codigo": "devintr -> plic_claim -> uartintr ou virtio_disk_intr -> plic_complete",
        "texto": "O esquema representa o encaminhamento externo. Temporizadores usam outro caminho. O contexto necessário é preservado pelo código de entrada.",
        "nota": "Esquema didático, não transcrição de código nem evidência de execução. Confira a versão do xv6 usada na disciplina."
      },
      "linux": {
        "titulo": "Observar contadores de interrupções",
        "comando": "cat /proc/interrupts",
        "saida": "           CPU0       CPU1\n  ...:       32         18  ... controlador/dispositivo",
        "texto": "Saída ilustrativa; nomes, valores e disponibilidade variam conforme o sistema. A apresentação depende da arquitetura. Contadores mostram ocorrências; não significam que cada ocorrência transferiu exatamente um bloco."
      }
    },
    // ==================== FASE 5.4: Camadas de E/S e drivers
    {
      "id": "es-v2-drivers",
      "etapa": "5.4",
      "titulo": "Camadas de E/S e drivers",
      "descricao": "Interfaces genéricas, operações específicas e erros",
      "icone": "🧩",
      "referencia": "Maziero, cap. 20, §§20.1–20.4, p. 248–252",
      "pergunta_guia": "Como o mesmo programa usa equipamentos diferentes sem conhecer cada modelo?",
      "man": [
        {
          "termo": "driver",
          "secao": "7",
          "resumo": "componente que adapta um dispositivo às interfaces do SO",
          "detalhe": "Gerencia inicialização, requisições, conclusão e erros de acordo com a interface do equipamento. Pode ser integrado ao kernel ou carregável, conforme o SO.",
          "exemplo": "virtio_disk.c no xv6."
        },
        {
          "termo": "interface genérica de dispositivo",
          "secao": "7",
          "resumo": "contrato compartilhado por dispositivos de uma classe",
          "detalhe": "Permite às camadas superiores trabalhar com operações comuns, enquanto os drivers resolvem detalhes específicos. Não elimina diferenças de capacidade.",
          "exemplo": "Interfaces de armazenamento em blocos."
        },
        {
          "termo": "fila de E/S",
          "secao": "7",
          "resumo": "conjunto de requisições aguardando ou em processamento",
          "detalhe": "Ajuda a coordenar solicitações concorrentes. A ordem e os critérios dependem do subsistema e do dispositivo.",
          "exemplo": "Vários processos podem solicitar leituras simultaneamente."
        }
      ],
      "desafios": [
        {
          "tipo": "conceito",
          "titulo": "Uma operação atravessa camadas",
          "texto": "<p class=\"destaque\">Uma chamada de leitura é uma solicitação, não uma ordem direta ao hardware.</p><p>A aplicação usa uma interface do sistema. Subsistemas do kernel validam e organizam a operação. O driver converte a requisição em comandos do dispositivo.</p><p>Uma leitura pode ser satisfeita por dados já disponíveis em memória. Portanto, nem toda chamada de leitura chega ao disco.</p>"
        },
        {
          "tipo": "multipla",
          "pergunta": "Qual componente conhece os registradores específicos de um dispositivo?",
          "opcoes": [
            "O driver correspondente",
            "Toda aplicação obrigatoriamente",
            "O nome do arquivo por si só",
            "O usuário ao apertar Enter"
          ],
          "correta": 0,
          "dica": "A camada específica resolve o protocolo do equipamento.",
          "explicacao": "O driver faz a adaptação entre operações do sistema e o protocolo concreto do controlador."
        },
        {
          "tipo": "multipla",
          "pergunta": "Toda chamada read precisa gerar acesso físico ao disco?",
          "opcoes": [
            "Sim, sempre",
            "Não; cache, tipo de descritor e estado da operação podem mudar o caminho",
            "Sim, mesmo em pipes",
            "Não, porque read nunca acessa dispositivos"
          ],
          "correta": 1,
          "dica": "Uma interface uniforme pode ter implementações diferentes.",
          "explicacao": "O descritor pode representar recursos diferentes, e dados em cache podem evitar uma nova leitura física."
        },
        {
          "tipo": "conceito",
          "titulo": "Mais do que ler e escrever",
          "texto": "<p>Um driver pode inicializar o equipamento, configurar parâmetros, organizar filas, acompanhar operações e reportar falhas.</p><p>Interfaces genéricas permitem tratar classes de dispositivos sem espalhar detalhes de fabricante pelas aplicações. Elas não garantem que qualquer operação seja suportada por qualquer dispositivo.</p><p>No Linux, alguns drivers são módulos e outros são integrados. No xv6, estudamos drivers que fazem parte do kernel didático.</p>"
        },
        {
          "tipo": "multipla",
          "pergunta": "Qual afirmação sobre drivers Linux é correta?",
          "opcoes": [
            "Todo driver precisa ser um arquivo .ko",
            "Um driver pode ser integrado ao kernel ou modular",
            "Drivers nunca tratam erros",
            "Um driver serve automaticamente para qualquer protocolo"
          ],
          "correta": 1,
          "dica": "Modo de distribuição e função são coisas diferentes.",
          "explicacao": "A configuração do kernel determina se um driver compatível é integrado ou carregável."
        },
        {
          "tipo": "multipla",
          "pergunta": "Se uma operação de dispositivo falha, o driver deve…",
          "opcoes": [
            "Fingir sucesso para a aplicação",
            "Reportar ou tratar a falha segundo o contrato do sistema",
            "Apagar todos os arquivos do usuário",
            "Desabilitar todos os outros dispositivos"
          ],
          "correta": 1,
          "dica": "A abstração precisa preservar a correção.",
          "explicacao": "Erros precisam ser comunicados ou tratados; uma interface simples não permite inventar sucesso."
        },
        {
          "tipo": "associar",
          "pergunta": "Associe cada elemento à função correspondente.",
          "pares": [
            [
              "Aplicação",
              "Solicita serviços por uma interface"
            ],
            [
              "Subsistema genérico",
              "Organiza operações compartilhadas da classe"
            ],
            [
              "Driver específico",
              "Adapta comandos ao equipamento"
            ],
            [
              "Controlador",
              "Executa o protocolo do dispositivo"
            ]
          ],
          "dica": "Compare as responsabilidades de cada elemento antes de ligar os pares.",
          "explicacao": "As camadas distribuem responsabilidades e permitem variar o hardware."
        },
        {
          "tipo": "ordenar",
          "pergunta": "Ordene uma leitura que realmente precisa chegar ao disco.",
          "itens": [
            "Aplicação solicita a leitura",
            "Kernel verifica e organiza a requisição",
            "Driver prepara a operação de disco",
            "Dispositivo realiza a operação",
            "Kernel entrega resultado ou erro à aplicação"
          ],
          "dica": "Comece pela causa da operação e termine no resultado para o solicitante.",
          "explicacao": "É um caminho didático para um caso sem dados disponíveis no cache; outras leituras podem terminar antes."
        }
      ],
      "xv6": {
        "titulo": "Um sistema, mais de um driver",
        "arquivo": "kernel/uart.c; kernel/virtio_disk.c; kernel/file.c",
        "codigo": "processo -> interface do kernel -> driver apropriado -> dispositivo",
        "texto": "UART e disco têm interfaces e caminhos diferentes. A existência de arquivos especiais não obriga todo dispositivo a ser exposto da mesma maneira.",
        "nota": "Esquema didático, não transcrição de código nem evidência de execução. Confira a versão do xv6 usada na disciplina."
      },
      "linux": {
        "titulo": "Ver módulos carregados",
        "comando": "cat /proc/modules",
        "saida": "nome_modulo  tamanho  referencias  ...",
        "texto": "Saída ilustrativa; nomes, valores e disponibilidade variam conforme o sistema. A lista não contém todos os drivers existentes: código integrado ao kernel não aparece como módulo carregado."
      }
    },
    // ==================== FASE 5.5: Classes, /dev e operações de controle
    {
      "id": "es-v2-classes",
      "etapa": "5.5",
      "titulo": "Classes, /dev e operações de controle",
      "descricao": "Blocos, caracteres, rede, gráficos e ioctl",
      "icone": "📁",
      "referencia": "Maziero, cap. 20, §§20.3–20.4, p. 249–252; apoio: cap. 22, §22.4",
      "pergunta_guia": "Por que um disco e um terminal podem usar arquivos sem se comportar do mesmo jeito?",
      "man": [
        {
          "termo": "dispositivo de bloco",
          "secao": "7",
          "resumo": "interface que organiza acesso em blocos endereçáveis",
          "detalhe": "É adequada ao armazenamento. O driver e o subsistema podem atender requisições em unidades e formatos definidos.",
          "exemplo": "Discos e suas partições no Linux."
        },
        {
          "termo": "/dev",
          "secao": "7",
          "resumo": "diretório com muitos nós de dispositivo em Unix/Linux",
          "detalhe": "Nós de bloco e caractere têm major e minor. Também existem dispositivos virtuais e outras entradas. Interfaces de rede normalmente são usadas por sockets, não por um nó de bloco/caractere.",
          "exemplo": "/dev/null é virtual; /dev/ttyS0 é exemplo de terminal serial."
        },
        {
          "termo": "ioctl",
          "secao": "2",
          "resumo": "solicita uma operação de controle suportada por um descritor",
          "detalhe": "Usa um código de operação e argumentos específicos. Não é uma transferência genérica de qualquer tipo de dado; uma operação incompatível pode falhar. O xv6 padrão não fornece ioctl.",
          "exemplo": "Consultar dimensões de terminal com TIOCGWINSZ no Linux."
        }
      ],
      "desafios": [
        {
          "tipo": "conceito",
          "titulo": "Classes organizam interfaces",
          "texto": "<p class=\"destaque\">Uma interface comum não torna todos os dispositivos iguais.</p><p><b>Blocos:</b> unidades endereçáveis de armazenamento. <b>Caracteres:</b> interface de fluxo ou operações próprias de dispositivos dessa classe. <b>Rede:</b> comunicação por mensagens e pacotes. <b>Gráficos:</b> operações e memória de vídeo específicas.</p><p>A classificação ajuda o software, mas o tamanho de cada chamada não define sozinho a classe: ler vários bytes não transforma um terminal em disco.</p>"
        },
        {
          "tipo": "multipla",
          "pergunta": "Qual propriedade combina com uma interface de armazenamento em blocos?",
          "opcoes": [
            "Acesso por unidades endereçáveis",
            "Obrigação de transferir somente um caractere por chamada",
            "Ausência de posições de dados",
            "Necessidade de tela gráfica"
          ],
          "correta": 0,
          "dica": "Pense na identificação de blocos em um volume.",
          "explicacao": "O endereçamento de unidades é uma característica importante de interfaces em blocos."
        },
        {
          "tipo": "multipla",
          "pergunta": "Um dispositivo de caractere devolveu vários bytes em read. Isso o transforma em dispositivo de bloco?",
          "opcoes": [
            "Sim, porque recebeu mais de um byte",
            "Não; a classe depende da interface, não só do tamanho da leitura",
            "Sim, se o arquivo estiver em /dev",
            "Não, porque dispositivos de caractere nunca usam read"
          ],
          "correta": 1,
          "dica": "Uma chamada pode transferir vários bytes de um fluxo.",
          "explicacao": "O tamanho de uma operação não é suficiente para classificar o dispositivo."
        },
        {
          "tipo": "conceito",
          "titulo": "Arquivos especiais e controle",
          "texto": "<p>Em sistemas Unix/Linux, muitos dispositivos são representados em <code>/dev</code>. A listagem usa <code>b</code> para bloco e <code>c</code> para caractere. Major/minor identificam o dispositivo segundo o subsistema.</p><p><code>/dev/null</code> descarta dados e não representa um disco físico. A chamada <code>ioctl</code> oferece controles específicos, como consultas de terminal. Nem todo descritor suporta o mesmo controle.</p><p>O xv6 usa uma organização reduzida, incluindo o nó console; não reproduz a árvore /dev nem a chamada ioctl do Linux.</p>"
        },
        {
          "tipo": "multipla",
          "pergunta": "O que /dev/null mostra sobre arquivos de dispositivo?",
          "opcoes": [
            "Todos representam hardware físico",
            "Também podem representar dispositivos virtuais",
            "Todos são arquivos comuns persistentes",
            "Todos aceitam qualquer ioctl"
          ],
          "correta": 1,
          "dica": "O destino descarta dados sem armazená-los em um disco.",
          "explicacao": "A interface de dispositivo pode representar um serviço virtual."
        },
        {
          "tipo": "multipla",
          "pergunta": "Qual uso combina com ioctl em um sistema que oferece a operação?",
          "opcoes": [
            "Consultar propriedades específicas de um terminal aberto",
            "Garantir leitura de qualquer arquivo sem permissão",
            "Criar um driver apenas ao passar seu nome",
            "Executar um comando Linux no xv6 sem implementação"
          ],
          "correta": 0,
          "dica": "É uma operação de controle sobre um descritor compatível.",
          "explicacao": "ioctl depende de um descritor válido e de uma operação suportada pelo objeto correspondente."
        },
        {
          "tipo": "associar",
          "pergunta": "Associe cada elemento à função correspondente.",
          "pares": [
            [
              "b na listagem",
              "Nó especial de bloco"
            ],
            [
              "c na listagem",
              "Nó especial de caractere"
            ],
            [
              "major/minor",
              "Identificação interpretada pelo subsistema"
            ],
            [
              "ioctl",
              "Operação de controle específica"
            ]
          ],
          "dica": "Compare as responsabilidades de cada elemento antes de ligar os pares.",
          "explicacao": "Arquivos especiais compartilham a interface de descritores, mas possuem semânticas próprias."
        },
        {
          "tipo": "terminal",
          "ambiente": "linux",
          "pergunta": "Neste terminal simulado, liste /dev/null em formato longo para identificar o tipo e major/minor.",
          "aceitar": [
            "ls\\s+-l\\s+/dev/null",
            "ls\\s+/dev/null\\s+-l"
          ],
          "saida": "crw-rw-rw- 1 root root 1, 3 ... /dev/null",
          "dica": "Use ls com a opção de listagem longa e o caminho completo.",
          "explicacao": "O c indica caractere. Os números 1 e 3 são major/minor neste exemplo. A saída é ilustrativa e não foi obtida no computador do jogador."
        }
      ],
      "xv6": {
        "titulo": "Nós de dispositivo no xv6",
        "arquivo": "kernel/sysfile.c; kernel/file.c; kernel/console.c",
        "codigo": "inode de dispositivo -> major -> entrada devsw -> operação do console",
        "texto": "O xv6 possui identificação e despacho de operações de dispositivo. Isso não implica suporte ao ioctl do Linux ou a todas as suas classes.",
        "nota": "Esquema didático, não transcrição de código nem evidência de execução. Confira a versão do xv6 usada na disciplina."
      },
      "linux": {
        "titulo": "Ler uma listagem de dispositivo",
        "comando": "ls -l /dev/null",
        "saida": "crw-rw-rw- 1 root root 1, 3 ... /dev/null",
        "texto": "Saída ilustrativa; nomes, valores e disponibilidade variam conforme o sistema. O primeiro caractere informa o tipo do nó; o exemplo usa 1,3. Outros dispositivos e ambientes apresentam valores diferentes."
      }
    },
    // ==================== FASE 5.6: Consulta, eventos e espera por E/S
    {
      "id": "es-v2-estrategias",
      "etapa": "5.6",
      "titulo": "Consulta, eventos e espera por E/S",
      "descricao": "Escolher como acompanhar a operação sem confundir conceitos",
      "icone": "⏳",
      "referencia": "Maziero, cap. 20, §§20.5.1–20.5.2, p. 252–256",
      "pergunta_guia": "Esperar por E/S precisa ocupar o processador?",
      "man": [
        {
          "termo": "polling",
          "secao": "7",
          "resumo": "consultar o estado para descobrir se uma condição ocorreu",
          "detalhe": "Pode ser implementado como espera ativa ou integrado a mecanismos com pausas. Consultar estado não significa automaticamente que todo o sistema fica parado.",
          "exemplo": "Consultar uma flag de conclusão."
        },
        {
          "termo": "espera ativa de E/S",
          "secao": "7",
          "resumo": "repetir consultas enquanto ocupa a CPU",
          "detalhe": "Uma repetição curta pode fazer sentido em casos específicos; uma espera longa consome tempo que poderia ser usado em outro trabalho.",
          "exemplo": "while (!pronto) { /* consultar */ }"
        },
        {
          "termo": "E/S por eventos",
          "secao": "7",
          "resumo": "iniciar a operação e tratar uma notificação posterior",
          "detalhe": "O solicitante pode bloquear e liberar a CPU. O driver e o kernel precisam coordenar a condição de espera e a notificação para evitar perder eventos.",
          "exemplo": "Um processo dorme até o resultado chegar.",
          "veja": [
            "IRQ(7)"
          ]
        }
      ],
      "desafios": [
        {
          "tipo": "conceito",
          "titulo": "Consultar ou receber uma notificação",
          "texto": "<p class=\"destaque\">Durante uma leitura de disco, o processador pode ter outras tarefas para fazer.</p><p>Na <b>consulta</b>, o software verifica o estado. Uma repetição contínua pode virar espera ativa. Na abordagem por <b>eventos</b>, a operação é iniciada e uma ocorrência posterior informa sua evolução ou conclusão.</p><p>Não confunda E/S bloqueante com espera ativa: bloquear uma tarefa pode justamente liberar a CPU para outra.</p>"
        },
        {
          "tipo": "multipla",
          "pergunta": "Qual cenário representa espera ativa?",
          "opcoes": [
            "O processo repete consultas continuamente até o dispositivo terminar",
            "O processo fica bloqueado e outra tarefa usa a CPU",
            "Um arquivo foi fechado",
            "A RAM preserva um resultado em cache"
          ],
          "correta": 0,
          "dica": "Observe se a tarefa continua executando enquanto espera.",
          "explicacao": "Na espera ativa, instruções de consulta continuam consumindo CPU."
        },
        {
          "tipo": "multipla",
          "pergunta": "Uma chamada bloqueante obriga a CPU a ficar sem executar outros processos?",
          "opcoes": [
            "Sim, em qualquer SO",
            "Não; o processo pode dormir e o escalonador executar outro",
            "Sim, pois bloquear é igual a desabilitar toda CPU",
            "Não, porque chamadas bloqueantes nunca esperam"
          ],
          "correta": 1,
          "dica": "A espera pertence à tarefa solicitante.",
          "explicacao": "O bloqueio da tarefa é um mecanismo de coordenação; outras tarefas prontas podem ser escalonadas."
        },
        {
          "tipo": "conceito",
          "titulo": "Acordar com a condição correta",
          "texto": "<p>O kernel deve verificar uma condição e organizar a espera com sincronização apropriada. Uma notificação não pode ser perdida entre a verificação e o bloqueio.</p><p>Quando a operação termina, a tarefa interessada pode voltar ao estado pronto. Ainda há disputa pela CPU. Em uma implementação real, acesso a filas e buffers também precisa ser protegido.</p><p>Na simulação a seguir, observe somente as transições de estado; ela não executa um driver real.</p>"
        },
        {
          "tipo": "multipla",
          "pergunta": "Por que sincronizar a verificação da condição e a espera?",
          "opcoes": [
            "Para evitar que uma notificação seja perdida nessa transição",
            "Para garantir que o disco nunca falhe",
            "Para eliminar o escalonador",
            "Para criar automaticamente mais memória"
          ],
          "correta": 0,
          "dica": "Considere o evento ocorrer logo depois da verificação.",
          "explicacao": "Uma transição desprotegida pode deixar a tarefa esperando depois que o evento já ocorreu."
        },
        {
          "tipo": "multipla",
          "pergunta": "Qual comparação é correta?",
          "opcoes": [
            "Polling e interrupção significam transferência DMA",
            "Espera ativa usa CPU; uma tarefa bloqueada pode liberar CPU",
            "Interrupção garante resultado sem erro",
            "E/S por eventos elimina qualquer necessidade de locks"
          ],
          "correta": 1,
          "dica": "Compare estado da tarefa com mecanismo de notificação.",
          "explicacao": "Notificação, transferência, espera e sincronização são aspectos relacionados, mas diferentes."
        },
        {
          "tipo": "associar",
          "pergunta": "Associe cada elemento à função correspondente.",
          "pares": [
            [
              "Consulta contínua",
              "Pode consumir CPU enquanto espera"
            ],
            [
              "Bloqueio do solicitante",
              "Permite executar outra tarefa pronta"
            ],
            [
              "Notificação de conclusão",
              "Informa que a condição pode ter mudado"
            ],
            [
              "Escalonamento",
              "Decide quem executa a seguir"
            ]
          ],
          "dica": "Compare as responsabilidades de cada elemento antes de ligar os pares.",
          "explicacao": "E/S eficiente exige coordenação entre driver, notificações e escalonador."
        },
        {
          "tipo": "simulacao",
          "pergunta": "Faça P1 pedir E/S e coloque P2 na CPU. Depois sinalize a conclusão de E/S de P1. Termine com P1 pronto e P2 executando.",
          "processos": [
            {
              "nome": "P1",
              "estado": "RUNNING"
            },
            {
              "nome": "P2",
              "estado": "READY"
            }
          ],
          "acoes": [
            "io",
            "escalonar",
            "fimIO"
          ],
          "objetivo": [
            {
              "processo": "P1",
              "estado": "READY"
            },
            {
              "processo": "P2",
              "estado": "RUNNING"
            }
          ],
          "dica": "P1: I/O. P2: Escalonar. P1: Fim da E/S.",
          "explicacao": "P1 libera a CPU ao bloquear. A conclusão o torna pronto; P2 continua executando. A simulação não mede desempenho nem executa E/S real."
        }
      ],
      "xv6": {
        "titulo": "Dormir e acordar no caminho do disco",
        "arquivo": "kernel/virtio_disk.c; kernel/proc.c",
        "codigo": "solicitante inicia E/S -> sleep\nconclusão -> wakeup -> RUNNABLE\nescalonador -> RUNNING",
        "texto": "É necessário coordenar condição, locks e espera. Consulte o código da versão usada para entender como evita perder a conclusão.",
        "nota": "Esquema didático, não transcrição de código nem evidência de execução. Confira a versão do xv6 usada na disciplina."
      },
      "linux": {
        "titulo": "Observar estados de tarefas",
        "comando": "ps -o pid,stat,comm",
        "saida": "  PID STAT COMMAND\n  120 S    processo\n  121 R    ps",
        "texto": "Saída ilustrativa; nomes, valores e disponibilidade variam conforme o sistema. S e D são estados de espera diferentes no Linux. Uma fotografia do ps não basta para concluir qual dispositivo ou operação causou a espera."
      }
    },
    // ==================== FASE 5.7: DMA e transferência de dados
    {
      "id": "es-v2-dma",
      "etapa": "5.7",
      "titulo": "DMA e transferência de dados",
      "descricao": "Buffers, descritores, conclusão e custo da operação",
      "icone": "📦",
      "referencia": "Maziero, cap. 20, §20.5.3, p. 256–258; complemento: Linux DMA API",
      "pergunta_guia": "Quem move os dados quando a CPU não copia cada unidade transferida?",
      "man": [
        {
          "termo": "DMA",
          "secao": "7",
          "resumo": "transferência entre dispositivo e memória sem a CPU copiar cada unidade",
          "detalhe": "O driver prepara a operação e acompanha sua conclusão. Endereços de dispositivo, direção e duração do uso do buffer precisam ser respeitados. Não implica custo zero.",
          "exemplo": "Dispositivo usa descritores para ler ou escrever um buffer.",
          "veja": [
            "descritor DMA(7)"
          ]
        },
        {
          "termo": "descritor DMA",
          "secao": "7",
          "resumo": "estrutura que descreve uma região ou parte de uma operação",
          "detalhe": "Pode incluir endereço, comprimento e flags. O formato depende do protocolo; seu uso exige preparação apropriada da memória.",
          "exemplo": "Cadeia de descritores VirtIO."
        },
        {
          "termo": "endereço DMA",
          "secao": "7",
          "resumo": "endereço usado pelo dispositivo para acessar memória",
          "detalhe": "Não deve ser confundido automaticamente com um ponteiro virtual da aplicação ou do kernel. Traduções e restrições dependem da plataforma.",
          "exemplo": "A API DMA do Linux retorna endereços adequados ao dispositivo."
        }
      ],
      "desafios": [
        {
          "tipo": "conceito",
          "titulo": "Preparar não é copiar cada byte",
          "texto": "<p class=\"destaque\">DMA economiza trabalho de cópia da CPU, mas não elimina o driver.</p><p>O software prepara regiões de memória e informações da requisição. O dispositivo ou um controlador realiza a transferência. A conclusão e os erros continuam precisando de tratamento.</p><p>DMA e interrupção resolvem questões diferentes: mover dados e notificar eventos. Conclusões podem ser agrupadas ou detectadas por consulta, dependendo do projeto.</p>"
        },
        {
          "tipo": "multipla",
          "pergunta": "Qual trabalho o DMA procura evitar para a CPU?",
          "opcoes": [
            "Copiar diretamente cada unidade de dados da transferência",
            "Preparar qualquer requisição",
            "Tratar todos os possíveis erros",
            "Executar o escalonador"
          ],
          "correta": 0,
          "dica": "Compare configuração da operação com o transporte dos dados.",
          "explicacao": "A CPU ainda participa da preparação e conclusão; o dispositivo assume o movimento de dados definido pelo protocolo."
        },
        {
          "tipo": "multipla",
          "pergunta": "É correto fornecer ao dispositivo qualquer ponteiro virtual de uma aplicação?",
          "opcoes": [
            "Sim, todos os endereços significam a mesma coisa",
            "Não; o acesso precisa ser preparado com endereçamento e memória adequados",
            "Sim, se o nome da variável for buffer",
            "Não, porque DMA não usa memória"
          ],
          "correta": 1,
          "dica": "O dispositivo não usa necessariamente o mesmo espaço de endereços da CPU.",
          "explicacao": "A memória e seus endereços precisam ser preparados conforme a arquitetura e a API. Um ponteiro arbitrário não é suficiente."
        },
        {
          "tipo": "conceito",
          "titulo": "Posse do buffer e custos",
          "texto": "<p>Enquanto um buffer está em uso pelo dispositivo, software e hardware precisam respeitar regras de acesso e visibilidade. Reutilizá-lo cedo pode corromper dados.</p><p>Há custos de configuração e possíveis disputas de memória. O benefício depende da carga e do tamanho das operações; DMA não é uma promessa de aceleração universal.</p><p>Os detalhes modernos de mapeamento e sincronização são complementados pela documentação técnica, além da visão introdutória do livro.</p>"
        },
        {
          "tipo": "multipla",
          "pergunta": "Um buffer DMA pode ser sobrescrito livremente antes da conclusão?",
          "opcoes": [
            "Sim, pois DMA cria uma cópia instantânea de tudo",
            "Não; é necessário respeitar o protocolo e o período de uso",
            "Sim, se o processo estiver bloqueado",
            "Somente se houver um arquivo /dev/null"
          ],
          "correta": 1,
          "dica": "O dispositivo ainda pode estar acessando a mesma região.",
          "explicacao": "A duração de uso e a sincronização do buffer são parte da correção da operação."
        },
        {
          "tipo": "multipla",
          "pergunta": "Toda transferência DMA gera exatamente uma interrupção?",
          "opcoes": [
            "Sim, por definição",
            "Não; a política de notificação varia",
            "Sim, independentemente do dispositivo",
            "Não, porque DMA proíbe interrupções"
          ],
          "correta": 1,
          "dica": "Transporte de dados e sinalização não são a mesma interface.",
          "explicacao": "Há projetos com notificações agrupadas ou consulta de conclusão. Não há essa regra universal."
        },
        {
          "tipo": "associar",
          "pergunta": "Associe cada elemento à função correspondente.",
          "pares": [
            [
              "Preparação",
              "Driver organiza memória e requisição"
            ],
            [
              "Transferência",
              "Dispositivo movimenta os dados"
            ],
            [
              "Conclusão",
              "Software confirma resultado e erros"
            ],
            [
              "Reutilização",
              "Buffer volta ao uso permitido pelo protocolo"
            ]
          ],
          "dica": "Compare as responsabilidades de cada elemento antes de ligar os pares.",
          "explicacao": "O transporte dos dados é apenas uma parte do ciclo de vida da requisição."
        },
        {
          "tipo": "ordenar",
          "pergunta": "Ordene o ciclo didático de uma requisição DMA.",
          "itens": [
            "Preparar buffer e endereços adequados",
            "Publicar descritores e iniciar a requisição",
            "Dispositivo realiza a transferência",
            "Verificar e sincronizar a conclusão",
            "Consumir ou reutilizar o buffer conforme o protocolo"
          ],
          "dica": "Comece pela causa da operação e termine no resultado para o solicitante.",
          "explicacao": "O buffer precisa permanecer válido durante o acesso. A forma concreta de mapeamento e notificação depende da plataforma."
        }
      ],
      "xv6": {
        "titulo": "Filas e descritores VirtIO",
        "arquivo": "kernel/virtio_disk.c",
        "codigo": "descritores -> fila disponível -> dispositivo\ndispositivo -> fila de usados -> tratamento da conclusão",
        "texto": "VirtIO é o exemplo usado pelo xv6 em QEMU. Este esquema não implica que seu controlador seja idêntico a um dispositivo NVMe real.",
        "nota": "Esquema didático, não transcrição de código nem evidência de execução. Confira a versão do xv6 usada na disciplina."
      },
      "linux": {
        "titulo": "Consultar informações de um driver",
        "comando": "readlink /sys/class/block/vda/device/driver",
        "saida": ".../drivers/virtio_blk",
        "texto": "Saída ilustrativa; nomes, valores e disponibilidade variam conforme o sistema. O nome vda é apenas um exemplo. O caminho pode não existir em sua máquina. Essa consulta identifica associações e não mede ou executa uma transferência DMA."
      }
    },
    // ==================== FASE 5.8: Buffers, cache e coordenação
    {
      "id": "es-v2-buffers",
      "etapa": "5.8",
      "titulo": "Buffers, cache e coordenação",
      "descricao": "Extensão prática: compartilhar dados sem confundir técnicas",
      "icone": "🔄",
      "referencia": "Apoio: Maziero, cap. 20, §20.5.2; complemento: xv6 bio.c e coordenação entre tarefas",
      "pergunta_guia": "Uma área de memória intermediária é sempre um cache? E sempre torna a E/S assíncrona?",
      "man": [
        {
          "termo": "buffer de E/S",
          "secao": "7",
          "resumo": "área temporária que intermedeia uma transferência",
          "detalhe": "Ajuda a acomodar unidades e ritmos diferentes. O uso concorrente exige regras de posse e sincronização.",
          "exemplo": "Fila de bytes recebidos antes da leitura pela aplicação."
        },
        {
          "termo": "buffer cache",
          "secao": "7",
          "resumo": "cache que conserva blocos para possível reutilização",
          "detalhe": "Um acerto pode evitar nova leitura física. O estado válido, os bloqueios e a coerência com escritas são importantes. Não é uma coleção obrigatória de apenas dois buffers.",
          "exemplo": "bcache e bread no xv6."
        },
        {
          "termo": "double buffering",
          "secao": "7",
          "resumo": "alternância entre duas áreas de dados",
          "detalhe": "Pode permitir que uma etapa preencha um buffer enquanto outra usa o anterior, quando há concorrência e coordenação. Não é sinônimo de cache.",
          "exemplo": "Dois buffers alternados por produtor e consumidor."
        }
      ],
      "desafios": [
        {
          "tipo": "conceito",
          "titulo": "Três objetivos distintos",
          "texto": "<p class=\"destaque\">Buffer, cache e double buffering podem coexistir, mas não são sinônimos.</p><p><b>Buffer:</b> intermedeia dados. <b>Cache:</b> procura reutilizar dados já disponíveis. <b>Double buffering:</b> alterna duas áreas para permitir sobreposição quando o sistema oferece concorrência.</p><p>Este aprofundamento é um complemento técnico. Não atribuímos a Maziero uma seção específica de double buffering não identificada na consulta.</p>"
        },
        {
          "tipo": "multipla",
          "pergunta": "Qual situação caracteriza um acerto de cache de blocos?",
          "opcoes": [
            "O bloco válido em memória atende a leitura sem nova busca no disco",
            "O disco é sempre lido duas vezes",
            "Dois buffers são obrigatoriamente trocados",
            "Toda escrita já foi persistida em qualquer circunstância"
          ],
          "correta": 0,
          "dica": "O benefício é a reutilização de um dado disponível.",
          "explicacao": "Um bloco válido pode ser reutilizado. Isso não garante, por si só, persistência de todas as escritas."
        },
        {
          "tipo": "multipla",
          "pergunta": "Qual é o objetivo típico de double buffering?",
          "opcoes": [
            "Alternar duas áreas para permitir sobreposição de etapas",
            "Guardar todos os arquivos permanentemente",
            "Eliminar qualquer sincronização",
            "Substituir o driver"
          ],
          "correta": 0,
          "dica": "Pense em uma etapa produzir enquanto outra consome.",
          "explicacao": "A alternância pode permitir sobreposição, mas precisa evitar sobrescrever um buffer ainda em uso."
        },
        {
          "tipo": "conceito",
          "titulo": "Buffers também são recursos compartilhados",
          "texto": "<p>Se duas tarefas ou uma tarefa e um dispositivo usam a mesma região, é preciso definir quando cada um pode acessá-la.</p><p>Um produtor não deve sobrescrever dados ainda não consumidos. Um consumidor não deve tratar como pronto um bloco que ainda está sendo preenchido.</p><p>Isso conecta E/S a processos e threads: filas, condições de espera e proteção de dados são necessários para manter a operação correta.</p>"
        },
        {
          "tipo": "multipla",
          "pergunta": "O produtor quer reutilizar um buffer que o consumidor ainda está lendo. Qual é a decisão correta?",
          "opcoes": [
            "Sobrescrever imediatamente",
            "Esperar a liberação ou usar outra área disponível com coordenação",
            "Apagar o processo consumidor",
            "Ignorar a situação porque o buffer fica na RAM"
          ],
          "correta": 1,
          "dica": "RAM compartilhada não resolve concorrência sozinha.",
          "explicacao": "É necessário respeitar a posse do buffer para impedir que o consumidor leia dados parcialmente substituídos."
        },
        {
          "tipo": "multipla",
          "pergunta": "A existência de um buffer torna qualquer chamada automaticamente assíncrona?",
          "opcoes": [
            "Sim, por definição",
            "Não; a semântica depende da interface e da implementação",
            "Sim, se o buffer tiver dois bytes",
            "Somente quando o arquivo se chama cache"
          ],
          "correta": 1,
          "dica": "Armazenamento intermediário e retorno da chamada são coisas diferentes.",
          "explicacao": "Uma chamada pode usar buffers e ainda assim bloquear. Assincronia depende do contrato e dos mecanismos usados."
        },
        {
          "tipo": "associar",
          "pergunta": "Associe cada elemento à função correspondente.",
          "pares": [
            [
              "Buffer",
              "Intermediação temporária"
            ],
            [
              "Cache",
              "Reutilização de dados"
            ],
            [
              "Double buffering",
              "Alternância entre duas áreas"
            ],
            [
              "Sincronização",
              "Coordenação do acesso compartilhado"
            ]
          ],
          "dica": "Compare as responsabilidades de cada elemento antes de ligar os pares.",
          "explicacao": "A finalidade da estrutura precisa ser identificada antes de avaliar o seu comportamento."
        },
        {
          "tipo": "ordenar",
          "pergunta": "Ordene uma leitura com falta no cache e conclusão por eventos.",
          "itens": [
            "Solicitar o bloco ao cache",
            "Constatar que os dados ainda não estão válidos",
            "Iniciar leitura e aguardar sua conclusão",
            "Marcar os dados como disponíveis após o sucesso",
            "Entregar o bloco ao solicitante"
          ],
          "dica": "Comece pela causa da operação e termine no resultado para o solicitante.",
          "explicacao": "Trata-se de um caso didático de falta no cache. Erros e concorrência exigem tratamento adicional na implementação real."
        }
      ],
      "xv6": {
        "titulo": "O cache de blocos do xv6",
        "arquivo": "kernel/bio.c; kernel/virtio_disk.c",
        "codigo": "bread -> bget\nbloco inválido -> leitura VirtIO\nleitura concluída -> bloco válido\nbrelse -> libera uso do buffer",
        "texto": "Procure a verificação de valid em bread. O bcache é um cache de blocos e não uma implementação automática de double buffering.",
        "nota": "Esquema didático, não transcrição de código nem evidência de execução. Confira a versão do xv6 usada na disciplina."
      },
      "linux": {
        "titulo": "Observar memória usada como cache",
        "comando": "grep -E \"^(Buffers|Cached):\" /proc/meminfo",
        "saida": "Buffers:          ... kB\nCached:           ... kB",
        "texto": "Saída ilustrativa; nomes, valores e disponibilidade variam conforme o sistema. Os campos possuem significados próprios no Linux. A saída não informa quantos buffers o xv6 utiliza nem comprova double buffering."
      }
    },
    // ==================== FASE 5.9: Armazenamento e revisão integrada
    {
      "id": "es-v2-armazenamento",
      "etapa": "5.9",
      "titulo": "Armazenamento e revisão integrada",
      "descricao": "HDD, SSD, filas, RAID e uma leitura do início ao fim",
      "icone": "💾",
      "referencia": "Maziero, cap. 21, §§21.1–21.4; revisão dos caps. 19–20",
      "pergunta_guia": "Como as características do dispositivo influenciam uma requisição de leitura?",
      "man": [
        {
          "termo": "HDD",
          "secao": "7",
          "resumo": "armazenamento magnético com movimento mecânico",
          "detalhe": "Posicionamento e rotação influenciam o acesso. Reordenar requisições pode reduzir deslocamentos em certos cenários.",
          "exemplo": "Disco com cabeças e superfícies magnéticas."
        },
        {
          "termo": "SSD",
          "secao": "7",
          "resumo": "armazenamento de estado sólido",
          "detalhe": "Não possui o mesmo custo de movimento mecânico do HDD. Memória flash exige gestão de apagamentos, desgaste e tradução de endereços.",
          "exemplo": "Um controlador usa uma camada de tradução flash."
        },
        {
          "termo": "RAID",
          "secao": "7",
          "resumo": "organização de vários dispositivos com políticas de distribuição e redundância",
          "detalhe": "As propriedades dependem do nível. Espelhamento e paridade não substituem cópias independentes para recuperar exclusões acidentais, corrupção ou outros incidentes.",
          "exemplo": "RAID 1: espelhamento; RAID 0: distribuição sem redundância."
        }
      ],
      "desafios": [
        {
          "tipo": "conceito",
          "titulo": "O dispositivo importa",
          "texto": "<p class=\"destaque\">Uma abstração em blocos pode esconder tecnologias muito diferentes.</p><p><b>HDD:</b> o movimento de cabeças e a rotação influenciam a latência. <b>SSD:</b> não há essa mecânica; tradução e gestão da memória flash continuam importantes.</p><p>Filas permitem organizar requisições. Reduzir movimento de cabeça é uma preocupação específica de discos mecânicos, não uma regra universal de otimização de SSDs.</p>"
        },
        {
          "tipo": "multipla",
          "pergunta": "Qual custo é específico do mecanismo de um HDD?",
          "opcoes": [
            "Deslocamento da cabeça e espera de rotação",
            "Toda troca de contexto de processo",
            "Toda cópia em memória RAM",
            "Qualquer chamada de sistema"
          ],
          "correta": 0,
          "dica": "Considere as partes móveis do dispositivo.",
          "explicacao": "HDDs possuem latências mecânicas. SSDs não têm o mesmo tipo de posicionamento físico."
        },
        {
          "tipo": "multipla",
          "pergunta": "Um SSD dispensa qualquer gestão interna porque não tem partes móveis?",
          "opcoes": [
            "Sim, flash aceita reescrita livre em qualquer granularidade",
            "Não; tradução, apagamento e desgaste ainda precisam de gestão",
            "Sim, portanto não existe controlador",
            "Não, porque na verdade há cabeças magnéticas"
          ],
          "correta": 1,
          "dica": "Ausência de mecânica não significa ausência de restrições.",
          "explicacao": "A tecnologia flash possui restrições e custos próprios que o controlador precisa administrar."
        },
        {
          "tipo": "conceito",
          "titulo": "Redundância e o caminho completo",
          "texto": "<p>RAID combina dispositivos por políticas específicas. Distribuição de dados e redundância são propriedades diferentes: <b>RAID 0 não oferece redundância</b>.</p><p>Redundância não é backup independente: uma exclusão acidental pode ser refletida nas cópias ativas.</p><p>Na revisão final, conecte aplicação, kernel, cache, driver, dispositivo, conclusão e escalonamento. Nem toda leitura percorre todo esse caminho: um acerto de cache pode encurtá-lo.</p>"
        },
        {
          "tipo": "multipla",
          "pergunta": "Qual afirmação sobre RAID é correta?",
          "opcoes": [
            "Todo nível fornece a mesma redundância",
            "RAID 0 distribui dados sem oferecer redundância",
            "RAID impede exclusão acidental em todas as cópias",
            "RAID transforma HDD em RAM"
          ],
          "correta": 1,
          "dica": "Distribuição não é automaticamente duplicação.",
          "explicacao": "As garantias dependem do nível e do cenário; RAID não substitui uma política de backup."
        },
        {
          "tipo": "multipla",
          "pergunta": "P1 dorme esperando uma leitura DMA e P2 está executando. A leitura termina com sucesso. O que é correto?",
          "opcoes": [
            "P1 necessariamente toma a CPU imediatamente",
            "O driver pode acordar P1; o escalonamento ainda determina sua execução",
            "P2 precisa terminar para que o dispositivo conclua a leitura",
            "DMA obriga P1 a virar ZOMBIE"
          ],
          "correta": 1,
          "dica": "Separe conclusão do dispositivo e despacho do processo.",
          "explicacao": "A conclusão modifica a condição de espera; acordar a tarefa não elimina a decisão do escalonador."
        },
        {
          "tipo": "associar",
          "pergunta": "Associe cada elemento à função correspondente.",
          "pares": [
            [
              "HDD",
              "Latência com componentes mecânicos"
            ],
            [
              "SSD",
              "Gestão de memória flash"
            ],
            [
              "RAID 0",
              "Distribuição sem redundância"
            ],
            [
              "Backup independente",
              "Cópia para recuperação fora do conjunto ativo"
            ]
          ],
          "dica": "Compare as responsabilidades de cada elemento antes de ligar os pares.",
          "explicacao": "Compare propriedades e limitações em vez de tratar todo armazenamento como equivalente."
        },
        {
          "tipo": "ordenar",
          "pergunta": "Ordene uma leitura de disco com falta no cache, DMA e espera por eventos.",
          "itens": [
            "Aplicação solicita a leitura",
            "Kernel identifica a falta no cache e prepara a requisição",
            "Driver inicia a operação e o solicitante bloqueia",
            "Dispositivo transfere os dados e sinaliza conclusão",
            "Driver confirma sucesso e acorda o solicitante",
            "Escalonador permite a retomada para consumir o resultado"
          ],
          "dica": "Comece pela causa da operação e termine no resultado para o solicitante.",
          "explicacao": "Fluxo integrado de um caso específico. Uma leitura em cache pode terminar antes; notificações e detalhes de DMA variam por implementação."
        }
      ],
      "xv6": {
        "titulo": "O experimento do xv6 é um modelo concreto",
        "arquivo": "kernel/bio.c; kernel/virtio_disk.c; kernel/proc.c",
        "codigo": "cache -> driver -> VirtIO -> conclusão -> wakeup -> escalonamento",
        "texto": "O disco visto pelo xv6 no QEMU é virtual. O experimento não mede movimento físico de HDD, desgaste de flash ou um RAID real. Use-o para explicar a coordenação de E/S.",
        "nota": "Esquema didático, não transcrição de código nem evidência de execução. Confira a versão do xv6 usada na disciplina."
      },
      "linux": {
        "titulo": "Inspecionar dispositivos de bloco",
        "comando": "lsblk -o NAME,TYPE,SIZE,ROTA",
        "saida": "NAME TYPE SIZE ROTA\nvda  disk ...     1\nvda1 part ...     1",
        "texto": "Saída ilustrativa; nomes, valores e disponibilidade variam conforme o sistema. ROTA informa a característica rotacional anunciada ao sistema. Em máquinas virtuais ela não prova qual mídia existe no host."
      },
      "chefe": true
    }
  ]
});
