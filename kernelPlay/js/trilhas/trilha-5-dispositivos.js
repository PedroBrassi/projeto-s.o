/* KernelPlay — Trilha 5. Fonte e referências: docs/trilhas/Trilha_5_Dispositivos_e_Entrada_Saida.md.
   Conteúdo didático; os cartões xv6 usam esquemas, não evidências de execução. */
TRILHAS.push({
  "id": "dispositivos",
  "numero": 5,
  "titulo": "Dispositivos e Entrada/Saída",
  "subtitulo": "DMA, interrupções, drivers, /dev, ioctl e buffers; conexões com a espera dos processos por E/S.",
  "fases": [
    {
      "id": "es-dma",
      "etapa": "5.1",
      "titulo": "DMA — Direct Memory Access",
      "descricao": "Transferência de dados e participação da CPU",
      "icone": "📦",
      "desafios": [
        {
          "tipo": "conceito",
          "titulo": "DMA — Direct Memory Access",
          "texto": "<p class=\"destaque\">Transferência de dados entre um dispositivo e a memória sem a CPU copiar cada unidade de dados.</p><p>O driver prepara buffers e descritores com endereços acessíveis ao dispositivo, tamanhos e direção da transferência. O dispositivo ou controlador realiza o movimento dos dados. A CPU continua responsável pela configuração e pelo tratamento da conclusão ou de erros. DMA pode disputar largura de banda da memória; não significa custo zero. A conclusão pode ser percebida por interrupção ou consulta, e uma interrupção pode reunir várias conclusões.</p><p><b>Exemplo:</b> O driver VirtIO do xv6 prepara descritores que apontam para os dados de um buffer; o dispositivo emulado usa esses endereços para realizar a operação.</p>"
        },
        {
          "tipo": "multipla",
          "pergunta": "Qual trabalho a CPU deixa de fazer diretamente quando se usa DMA?",
          "opcoes": [
            "Configurar o dispositivo",
            "Copiar cada unidade de dados durante a transferência",
            "Tratar erros",
            "Preparar os buffers"
          ],
          "correta": 1,
          "dica": "Diferencie preparar uma operação de mover seus dados.",
          "explicacao": "DMA reduz a participação da CPU na cópia dos dados; a preparação e o tratamento da conclusão continuam necessários."
        },
        {
          "tipo": "multipla",
          "pergunta": "Uma requisição usa DMA. O que podemos afirmar sobre sua conclusão?",
          "opcoes": [
            "Sempre haverá exatamente uma interrupção por requisição",
            "A CPU não participa de nenhuma etapa",
            "Pode ser detectada por interrupção ou consulta, conforme o dispositivo e o driver",
            "Os dados nunca passam pela RAM"
          ],
          "correta": 2,
          "dica": "DMA é o mecanismo de transferência, não uma regra universal de notificação.",
          "explicacao": "Transferência e notificação são decisões distintas. Dispositivos podem agrupar notificações ou usar consulta."
        },
        {
          "tipo": "ordenar",
          "pergunta": "Organize o fluxo simplificado de uma transferência DMA.",
          "itens": [
            "Driver prepara o buffer e os descritores",
            "Driver disponibiliza a requisição ao dispositivo",
            "Dispositivo transfere os dados",
            "Driver verifica a conclusão e libera o uso do resultado"
          ],
          "dica": "Comece pela preparação ou pelo evento; termine no tratamento da conclusão.",
          "explicacao": "Este é um fluxo didático: detalhes e formas de notificação variam conforme a arquitetura e o driver."
        }
      ],
      "man": [
        {
          "termo": "dma",
          "secao": "7",
          "resumo": "Transferência de dados entre um dispositivo e a memória sem a CPU copiar cada unidade de dados.",
          "detalhe": "O driver prepara buffers e descritores com endereços acessíveis ao dispositivo, tamanhos e direção da transferência. O dispositivo ou controlador realiza o movimento dos dados. A CPU continua responsável pela configuração e pelo tratamento da conclusão ou de erros. DMA pode disputar largura de banda da memória; não significa custo zero. A conclusão pode ser percebida por interrupção ou consulta, e uma interrupção pode reunir várias conclusões.",
          "exemplo": "O driver VirtIO do xv6 prepara descritores que apontam para os dados de um buffer; o dispositivo emulado usa esses endereços para realizar a operação."
        }
      ],
      "xv6": {
        "nota": "Esquema didático baseado no xv6 RISC-V oficial; não representa execução real nem transcrição de código.",
        "titulo": "DMA com descritores VirtIO",
        "arquivo": "kernel/virtio_disk.c",
        "codigo": "driver -> descritores -> fila disponível -> dispositivo\ndispositivo -> fila de usados -> driver",
        "texto": "Esquema didático, não código C executável. Consulte virtio_disk_rw() e virtio_disk_intr(). O exemplo é VirtIO em QEMU, não um disco NVMe."
      }
    },
    {
      "id": "es-interrupcao",
      "etapa": "5.2",
      "titulo": "IRQ — Interrupção de hardware",
      "descricao": "Eventos assíncronos e tratamento no kernel",
      "icone": "⚡",
      "desafios": [
        {
          "tipo": "conceito",
          "titulo": "IRQ — Interrupção de hardware",
          "texto": "<p class=\"destaque\">Notificação de hardware que solicita atenção da CPU para um evento assíncrono.</p><p>A notificação pode usar uma linha física ou uma mensagem, dependendo da arquitetura. Controladores como APIC em x86 e PLIC para interrupções externas no xv6 RISC-V ajudam no encaminhamento. O hardware registra o estado mínimo de retorno, e o código de entrada do kernel salva os registradores necessários e chama o tratador apropriado. A interrupção pode ocorrer durante execução de usuário ou do próprio kernel; só há mudança de privilégio quando necessária. Nem toda interrupção vem de um periférico: há também temporizadores.</p><p><b>Exemplo:</b> Uma entrada na UART ou a conclusão de uma operação VirtIO pode provocar uma interrupção externa no xv6.</p>"
        },
        {
          "tipo": "multipla",
          "pergunta": "Uma interrupção chega enquanto a CPU já executa código do kernel. Ela precisa vir do modo usuário?",
          "opcoes": [
            "Sim, interrupções só acontecem em programas de usuário",
            "Não; interrupções também podem ocorrer no kernel quando habilitadas",
            "Sim, o driver sempre é um programa de usuário",
            "Não, porque interrupções nunca usam tratadores"
          ],
          "correta": 1,
          "dica": "O evento do dispositivo é assíncrono em relação ao programa.",
          "explicacao": "A CPU pode ser interrompida em modo usuário ou kernel. O caminho de entrada e a necessidade de mudança de privilégio dependem do contexto."
        },
        {
          "tipo": "multipla",
          "pergunta": "Qual é a diferença entre DMA e interrupção?",
          "opcoes": [
            "São nomes para a mesma técnica",
            "DMA transfere dados; uma interrupção notifica um evento",
            "Interrupção sempre copia os dados do disco",
            "DMA só funciona com teclado"
          ],
          "correta": 1,
          "dica": "Uma técnica move os dados; a outra sinaliza um evento.",
          "explicacao": "DMA trata do movimento de dados. Uma interrupção pode avisar sobre a conclusão, mas não é a transferência em si."
        },
        {
          "tipo": "ordenar",
          "pergunta": "Organize o fluxo simplificado de atendimento de uma interrupção externa.",
          "itens": [
            "Dispositivo sinaliza um evento",
            "Controlador encaminha a interrupção habilitada",
            "Código de entrada salva o contexto necessário",
            "Tratador identifica e atende o evento",
            "Kernel conclui o atendimento e pode retomar a execução"
          ],
          "dica": "Comece pela preparação ou pelo evento; termine no tratamento da conclusão.",
          "explicacao": "Este é um fluxo didático: detalhes e formas de notificação variam conforme a arquitetura e o driver."
        }
      ],
      "man": [
        {
          "termo": "interrupcao",
          "secao": "7",
          "resumo": "Notificação de hardware que solicita atenção da CPU para um evento assíncrono.",
          "detalhe": "A notificação pode usar uma linha física ou uma mensagem, dependendo da arquitetura. Controladores como APIC em x86 e PLIC para interrupções externas no xv6 RISC-V ajudam no encaminhamento. O hardware registra o estado mínimo de retorno, e o código de entrada do kernel salva os registradores necessários e chama o tratador apropriado. A interrupção pode ocorrer durante execução de usuário ou do próprio kernel; só há mudança de privilégio quando necessária. Nem toda interrupção vem de um periférico: há também temporizadores.",
          "exemplo": "Uma entrada na UART ou a conclusão de uma operação VirtIO pode provocar uma interrupção externa no xv6."
        }
      ],
      "xv6": {
        "nota": "Esquema didático baseado no xv6 RISC-V oficial; não representa execução real nem transcrição de código.",
        "titulo": "Interrupções externas no xv6",
        "arquivo": "kernel/trap.c e kernel/plic.c",
        "codigo": "interrupção externa -> devintr() -> plic_claim()\nIRQ UART -> uartintr()\nIRQ VirtIO -> virtio_disk_intr()\nfinalização -> plic_complete()",
        "texto": "Esquema do caminho de interrupções externas. O PLIC não é o encaminhador de todas as classes de interrupção, como temporizadores. Um processo acordado pode voltar a ficar pronto e aguardar escalonamento."
      }
    },
    {
      "id": "es-driver",
      "etapa": "5.3",
      "titulo": "Device driver",
      "descricao": "A ponte entre a interface do SO e o dispositivo",
      "icone": "🔌",
      "desafios": [
        {
          "tipo": "conceito",
          "titulo": "Device driver",
          "texto": "<p class=\"destaque\">Componente de software que controla um dispositivo e adapta suas operações às interfaces do sistema.</p><p>Um driver conhece registradores, filas, formatos de comandos e regras do dispositivo. Pode preparar DMA, tratar interrupções e oferecer operações de leitura, escrita ou controle. No Linux, drivers podem ser compilados no kernel ou fornecidos como módulos carregáveis; nem todo driver é um arquivo .ko. As interfaces suportadas variam por dispositivo. No xv6, o código dos drivers faz parte do kernel didático.</p><p><b>Exemplo:</b> kernel/virtio_disk.c controla o disco VirtIO; kernel/uart.c controla a UART no xv6.</p>"
        },
        {
          "tipo": "multipla",
          "pergunta": "Qual tarefa pertence ao driver de um dispositivo?",
          "opcoes": [
            "Traduzir uma operação do SO para comandos específicos do dispositivo",
            "Eliminar a necessidade de hardware",
            "Executar todos os programas de usuário",
            "Substituir a memória RAM"
          ],
          "correta": 0,
          "dica": "Ele conhece a interface concreta do hardware.",
          "explicacao": "O driver faz a adaptação entre as interfaces do SO e o protocolo do dispositivo."
        },
        {
          "tipo": "multipla",
          "pergunta": "Qual afirmação sobre drivers Linux é correta?",
          "opcoes": [
            "Todos precisam ser carregados de arquivos .ko",
            "Todos oferecem exatamente os mesmos comandos ioctl",
            "Podem estar integrados ao kernel ou ser módulos carregáveis",
            "São sempre programas executados pelo shell"
          ],
          "correta": 2,
          "dica": "Módulo carregável é uma forma de distribuição, não uma definição de driver.",
          "explicacao": "Um driver pode ser embutido no kernel ou modular, e suas operações dependem do dispositivo."
        },
        {
          "tipo": "associar",
          "pergunta": "Associe cada termo à sua função.",
          "pares": [
            [
              "Driver",
              "Conhece comandos e registradores do dispositivo"
            ],
            [
              "Controlador",
              "Implementa a interface do dispositivo em hardware ou emulação"
            ],
            [
              "Aplicação",
              "Solicita operações usando interfaces do SO"
            ]
          ],
          "dica": "Separe a interface, sua finalidade e os detalhes específicos do sistema.",
          "explicacao": "Componente de software que controla um dispositivo e adapta suas operações às interfaces do sistema."
        }
      ],
      "man": [
        {
          "termo": "driver",
          "secao": "7",
          "resumo": "Componente de software que controla um dispositivo e adapta suas operações às interfaces do sistema.",
          "detalhe": "Um driver conhece registradores, filas, formatos de comandos e regras do dispositivo. Pode preparar DMA, tratar interrupções e oferecer operações de leitura, escrita ou controle. No Linux, drivers podem ser compilados no kernel ou fornecidos como módulos carregáveis; nem todo driver é um arquivo .ko. As interfaces suportadas variam por dispositivo. No xv6, o código dos drivers faz parte do kernel didático.",
          "exemplo": "kernel/virtio_disk.c controla o disco VirtIO; kernel/uart.c controla a UART no xv6."
        }
      ],
      "xv6": {
        "nota": "Esquema didático baseado no xv6 RISC-V oficial; não representa execução real nem transcrição de código.",
        "titulo": "Disco e console têm caminhos diferentes",
        "arquivo": "kernel/virtio_disk.c, kernel/uart.c e kernel/console.c",
        "codigo": "disco: buffer cache -> driver VirtIO\nconsole: interface de dispositivo -> console/UART",
        "texto": "Esquema didático. O disco do xv6 é acessado internamente pelo sistema de arquivos; não suponha que todo driver apareça como um arquivo em /dev."
      }
    },
    {
      "id": "es-dev",
      "etapa": "5.4",
      "titulo": "/dev — Arquivos especiais de dispositivo",
      "descricao": "Dispositivos físicos e virtuais como arquivos",
      "icone": "📁",
      "desafios": [
        {
          "tipo": "conceito",
          "titulo": "/dev — Arquivos especiais de dispositivo",
          "texto": "<p class=\"destaque\">Diretório que reúne muitos nós de dispositivo em sistemas Unix/Linux, incluindo dispositivos virtuais.</p><p>Nós especiais de bloco (b) e de caractere (c) têm números major e minor que identificam o tipo de dispositivo e a instância, interpretados pelo subsistema e pelo driver. /dev/null é virtual: não corresponde a um periférico físico. Nem toda entrada em /dev é um nó de bloco ou caractere, e nem todo dispositivo é acessado por um arquivo ali. Esses caminhos são exemplos de Linux; o xv6 padrão usa um nó console em sua raiz e não reproduz toda a organização de /dev.</p><p><b>Exemplo:</b> /dev/sda: exemplo de disco; /dev/ttyS0: exemplo de porta serial; /dev/null: descarte de dados. A existência e os números variam conforme o sistema.</p>"
        },
        {
          "tipo": "multipla",
          "pergunta": "O que /dev/null demonstra?",
          "opcoes": [
            "Todo arquivo em /dev representa um disco físico",
            "Um dispositivo também pode ser virtual",
            "Arquivos de dispositivo não têm permissões",
            "O xv6 exige /dev/null para iniciar"
          ],
          "correta": 1,
          "dica": "Um destino que descarta dados não precisa de um periférico físico.",
          "explicacao": "/dev/null é um dispositivo virtual. A interface de arquivo não implica hardware físico."
        },
        {
          "tipo": "multipla",
          "pergunta": "Em uma saída de ls -l, como reconhecer um nó especial de caractere?",
          "opcoes": [
            "Pela letra c no início do modo",
            "Pela extensão .c",
            "Pelo nome conter dev",
            "Por seu tamanho ser sempre zero"
          ],
          "correta": 0,
          "dica": "Observe o tipo no primeiro caractere da listagem.",
          "explicacao": "O tipo c indica dispositivo de caractere; b indica dispositivo de bloco. Major e minor aparecem em lugar do tamanho usual."
        },
        {
          "tipo": "associar",
          "pergunta": "Associe cada termo à sua função.",
          "pares": [
            [
              "b",
              "Nó de dispositivo de bloco"
            ],
            [
              "c",
              "Nó de dispositivo de caractere"
            ],
            [
              "major/minor",
              "Identificação de dispositivo interpretada pelo sistema"
            ],
            [
              "/dev/null",
              "Dispositivo virtual que descarta dados escritos"
            ]
          ],
          "dica": "Separe a interface, sua finalidade e os detalhes específicos do sistema.",
          "explicacao": "Diretório que reúne muitos nós de dispositivo em sistemas Unix/Linux, incluindo dispositivos virtuais."
        }
      ],
      "man": [
        {
          "termo": "/dev",
          "secao": "7",
          "resumo": "Diretório que reúne muitos nós de dispositivo em sistemas Unix/Linux, incluindo dispositivos virtuais.",
          "detalhe": "Nós especiais de bloco (b) e de caractere (c) têm números major e minor que identificam o tipo de dispositivo e a instância, interpretados pelo subsistema e pelo driver. /dev/null é virtual: não corresponde a um periférico físico. Nem toda entrada em /dev é um nó de bloco ou caractere, e nem todo dispositivo é acessado por um arquivo ali. Esses caminhos são exemplos de Linux; o xv6 padrão usa um nó console em sua raiz e não reproduz toda a organização de /dev.",
          "exemplo": "/dev/sda: exemplo de disco; /dev/ttyS0: exemplo de porta serial; /dev/null: descarte de dados. A existência e os números variam conforme o sistema."
        }
      ],
      "xv6": {
        "nota": "Esquema didático baseado no xv6 RISC-V oficial; não representa execução real nem transcrição de código.",
        "titulo": "O nó console do xv6",
        "arquivo": "kernel/sysfile.c e kernel/file.c",
        "codigo": "mknod -> inode de dispositivo\nmajor/minor -> identificação\nleitura/escrita -> tabela devsw",
        "texto": "Esquema didático. O xv6 possui sua própria interface mknod e nós de dispositivo, mas não implementa a árvore /dev completa do Linux. Não execute exemplos de criação de nós no computador real para esta atividade."
      },
      "linux": {
        "titulo": "Reconhecendo dispositivos no Linux",
        "comando": "ls -l /dev/null",
        "saida": "crw-rw-rw- 1 root root 1, 3 ... /dev/null",
        "texto": "Saída ilustrativa, não capturada nesta atividade. O c identifica um nó de caractere; 1 e 3 são major e minor neste exemplo. Permissões e outros campos podem variar."
      }
    },
    {
      "id": "es-ioctl",
      "etapa": "5.5",
      "titulo": "ioctl — Input/Output Control",
      "descricao": "Operações de controle além do fluxo de bytes",
      "icone": "🎛️",
      "desafios": [
        {
          "tipo": "conceito",
          "titulo": "ioctl — Input/Output Control",
          "texto": "<p class=\"destaque\">Chamada de sistema usada para operações de controle específicas sobre um descritor aberto.</p><p>Recebe um descritor, um código de operação e, quando necessário, argumentos ou um buffer. É usada quando uma operação não se expressa como simples leitura ou escrita de bytes. O código e o formato dos argumentos dependem da interface. Nem todo descritor suporta toda operação; uma requisição inadequada pode falhar. No Linux, bibliotecas também podem oferecer funções próprias sobre esses mecanismos. O xv6 padrão não oferece a chamada ioctl.</p><p><b>Exemplo:</b> TIOCGWINSZ permite consultar as dimensões de um terminal em sistemas que oferecem essa operação.</p>"
        },
        {
          "tipo": "multipla",
          "pergunta": "Qual situação combina com ioctl?",
          "opcoes": [
            "Ler o conteúdo inteiro de um arquivo comum",
            "Consultar dimensões de um terminal por uma operação suportada",
            "Criar automaticamente um driver",
            "Garantir que qualquer descritor aceite qualquer comando"
          ],
          "correta": 1,
          "dica": "Pense em controle ou configuração, além de transferir bytes.",
          "explicacao": "Consultar propriedades do terminal é uma operação de controle; o descritor e o comando precisam ser compatíveis."
        },
        {
          "tipo": "multipla",
          "pergunta": "Podemos chamar ioctl no xv6 padrão como se fosse Linux?",
          "opcoes": [
            "Sim, todas as chamadas Linux existem no xv6",
            "Não; o xv6 padrão não implementa essa chamada",
            "Sim, basta mudar o nome do dispositivo",
            "Não, porque Linux também não possui ioctl"
          ],
          "correta": 1,
          "dica": "O xv6 é um sistema didático com um conjunto pequeno de chamadas.",
          "explicacao": "ioctl é apresentado aqui como interface Unix/Linux. Adicioná-la ao xv6 exigiria uma implementação própria."
        },
        {
          "tipo": "associar",
          "pergunta": "Associe cada termo à sua função.",
          "pares": [
            [
              "read",
              "Obtém bytes por uma interface de leitura"
            ],
            [
              "write",
              "Envia bytes por uma interface de escrita"
            ],
            [
              "ioctl",
              "Solicita uma operação de controle suportada"
            ]
          ],
          "dica": "Separe a interface, sua finalidade e os detalhes específicos do sistema.",
          "explicacao": "Chamada de sistema usada para operações de controle específicas sobre um descritor aberto."
        }
      ],
      "man": [
        {
          "termo": "ioctl",
          "secao": "2",
          "resumo": "Chamada de sistema usada para operações de controle específicas sobre um descritor aberto.",
          "detalhe": "Recebe um descritor, um código de operação e, quando necessário, argumentos ou um buffer. É usada quando uma operação não se expressa como simples leitura ou escrita de bytes. O código e o formato dos argumentos dependem da interface. Nem todo descritor suporta toda operação; uma requisição inadequada pode falhar. No Linux, bibliotecas também podem oferecer funções próprias sobre esses mecanismos. O xv6 padrão não oferece a chamada ioctl.",
          "exemplo": "TIOCGWINSZ permite consultar as dimensões de um terminal em sistemas que oferecem essa operação."
        }
      ],
      "xv6": {
        "nota": "Esquema didático baseado no xv6 RISC-V oficial; não representa execução real nem transcrição de código.",
        "titulo": "Limite da comparação com Linux",
        "arquivo": "kernel/syscall.h",
        "codigo": "xv6 padrão: conjunto reduzido de chamadas\nLinux: ioctl(fd, operação, argumentos)",
        "texto": "Comparação de interfaces, não código executado. O xv6 padrão não tem ioctl; a ausência é parte do conteúdo desta etapa."
      }
    },
    {
      "id": "es-buffer",
      "etapa": "5.6",
      "titulo": "Buffers, cache e double buffering",
      "descricao": "Três ideias relacionadas, com objetivos diferentes",
      "icone": "🔄",
      "desafios": [
        {
          "tipo": "conceito",
          "titulo": "Buffers, cache e double buffering",
          "texto": "<p class=\"destaque\">Buffers intermedeiam transferências; caches reaproveitam dados; double buffering alterna dois buffers.</p><p>Um buffer armazena dados temporariamente para acomodar transferências e diferenças de ritmo. Um cache mantém cópias para reutilização e pode evitar novas leituras do dispositivo. Double buffering alterna dois buffers para permitir sobreposição entre produção e consumo quando o projeto oferece concorrência. Essas técnicas podem coexistir, mas não são sinônimos e não garantem assincronia sozinhas. O bcache do xv6 guarda blocos do sistema de arquivos; não é, por isso, uma implementação de double buffering.</p><p><b>Exemplo:</b> Em bio.c, bread() obtém um buffer e só solicita leitura ao disco se o bloco ainda não estiver válido no cache.</p>"
        },
        {
          "tipo": "multipla",
          "pergunta": "Qual situação mostra benefício de um cache de blocos?",
          "opcoes": [
            "Reutilizar um bloco válido em RAM sem fazer nova leitura ao disco",
            "Sempre ler o disco duas vezes",
            "Eliminar toda sincronização",
            "Guardar exatamente dois blocos, obrigatoriamente"
          ],
          "correta": 0,
          "dica": "O ganho vem da reutilização.",
          "explicacao": "Um bloco válido já em cache pode atender a leitura. Se não estiver válido, é necessário buscar os dados."
        },
        {
          "tipo": "multipla",
          "pergunta": "Qual afirmação diferencia double buffering de buffer cache?",
          "opcoes": [
            "Ambos significam exatamente a mesma coisa",
            "Double buffering alterna dois buffers; cache busca reutilizar dados",
            "bcache sempre tem apenas dois buffers",
            "Um buffer sempre torna qualquer operação assíncrona"
          ],
          "correta": 1,
          "dica": "Compare sobreposição de etapas com reaproveitamento.",
          "explicacao": "Double buffering organiza alternância e possível sobreposição. Cache organiza reutilização. A sincronização continua necessária."
        },
        {
          "tipo": "associar",
          "pergunta": "Associe cada termo à sua função.",
          "pares": [
            [
              "Buffer",
              "Armazenamento intermediário temporário"
            ],
            [
              "Cache",
              "Reutilização de dados já disponíveis"
            ],
            [
              "Double buffering",
              "Alternância entre dois buffers"
            ],
            [
              "bcache do xv6",
              "Cache de blocos do sistema de arquivos"
            ]
          ],
          "dica": "Separe a interface, sua finalidade e os detalhes específicos do sistema.",
          "explicacao": "Buffers intermedeiam transferências; caches reaproveitam dados; double buffering alterna dois buffers."
        }
      ],
      "man": [
        {
          "termo": "buffer cache",
          "secao": "7",
          "resumo": "Buffers intermedeiam transferências; caches reaproveitam dados; double buffering alterna dois buffers.",
          "detalhe": "Um buffer armazena dados temporariamente para acomodar transferências e diferenças de ritmo. Um cache mantém cópias para reutilização e pode evitar novas leituras do dispositivo. Double buffering alterna dois buffers para permitir sobreposição entre produção e consumo quando o projeto oferece concorrência. Essas técnicas podem coexistir, mas não são sinônimos e não garantem assincronia sozinhas. O bcache do xv6 guarda blocos do sistema de arquivos; não é, por isso, uma implementação de double buffering.",
          "exemplo": "Em bio.c, bread() obtém um buffer e só solicita leitura ao disco se o bloco ainda não estiver válido no cache."
        },
        {
          "termo": "double buffering",
          "secao": "7",
          "resumo": "alternar dois buffers para possibilitar sobreposição entre produção e consumo",
          "detalhe": "A alternância exige coordenação para que um produtor não sobrescreva dados ainda em uso. Não é sinônimo de cache nem garantia automática de assincronia.",
          "exemplo": "Uma etapa preenche um buffer enquanto outra processa o anterior, quando há recursos para essa sobreposição."
        }
      ],
      "xv6": {
        "nota": "Esquema didático baseado no xv6 RISC-V oficial; não representa execução real nem transcrição de código.",
        "titulo": "Cache de blocos e espera por E/S",
        "arquivo": "kernel/bio.c e kernel/virtio_disk.c",
        "codigo": "bread -> busca buffer\nse inválido -> solicita leitura VirtIO\nconclusão -> buffer válido -> consumidor usa os dados",
        "texto": "Esquema didático. Na espera pelo disco, o processo pode dormir; a conclusão acorda quem espera. Acordar o processo o torna elegível para execução, sem garantir execução imediata. Este cache é distinto do page cache de sistemas como Linux."
      },
      "chefe": true
    }
  ]
});
