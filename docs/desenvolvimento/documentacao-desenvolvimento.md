# Documentação do desenvolvimento do KernelPlay

Projeto Integrador de Sistemas Operacionais

Grupo 3 | Processos e Threads | Revisão documental de 25 de novembro de 2026

## Apresentação

O KernelPlay é uma plataforma educativa que combina trilhas de estudo, desafios, simulações, terminal e exercícios de laboratório para ensinar Sistemas Operacionais. O foco do Projeto Integrador é Processos e Threads; memória, arquivos e entrada e saída ampliam o contexto necessário para entender como as tarefas utilizam os recursos do sistema.

Este documento descreve o produto, sua organização pedagógica, arquitetura, algoritmos, decisões de implementação, evolução registrada, validação e manutenção. A versão de referência é o commit 998980660419f90c246a42e0e7219967799ba175, que inclui o minigame Seja o Escalonador. A plataforma é executada no navegador e mantém modelos didáticos em JavaScript; ela não inicializa um kernel nem executa comandos no computador do aluno. A revisão documental de 25/11/2026 atualiza a situação das entregas e os vínculos com a justificativa. A descrição arquitetural conserva a versão de referência; as correções didáticas posteriores estão registradas em docs/revisao-conteudo-2026-11-23.md.

### Identificação e acesso

- Plataforma: https://pedrobrassi.github.io/projeto-s.o/kernelPlay/
- Modo apresentação: https://pedrobrassi.github.io/projeto-s.o/kernelPlay/?apresentacao
- Repositório: https://github.com/PedroBrassi/projeto-s.o
- Padlet: https://padlet.com/pedroluccas2/grupo-3-processos-e-threads-s024zwdrjwwsaqd4z88l

O grupo tem exatamente sete integrantes: Ana Flávia dos Santos Peixoto; Aurélio Junior; Gabriel Alves Domingos; Guilherme Gouvêa da Silva; Pedro Brassi Luccas; Pedro Lima; Victor Orlando Avelar. O jogo identifica Pedro Brassi como desenvolvedor. As responsabilidades individuais pelas demais entregas devem acompanhar o planejamento do grupo; o histórico de commits não estabelece, sozinho, a contribuição de cada integrante.

## 1 Objetivos e requisitos

O objetivo educativo é tornar observáveis ações que normalmente ficam escondidas dentro do sistema operacional: despachar um processo, bloquear por E/S, acordar uma tarefa, criar um filho, coletar seu término e distribuir threads entre núcleos. O aluno deve relacionar ação, alteração de estado e consequência, em vez de apenas memorizar nomes.

Os requisitos atendidos pela implementação incluem acesso por navegador; organização em cinco trilhas; progressão entre etapas; feedback imediato; dicas; repetição de questões; simulação de estados; terminal didático; laboratório sem perda de estabilidade; manual liberado por conclusão de etapas; modo apresentação e minigame independente. A interface adapta a disposição dos elementos à largura disponível e oferece atalhos de teclado em diferentes atividades.

A solução utiliza HTML, CSS e JavaScript sem framework, banco de dados ou servidor de aplicação. Essa arquitetura permite distribuir os arquivos pelo GitHub Pages e também abrir o arquivo de entrada localmente. Para uma execução local consistente com a hospedagem, recomenda-se um servidor HTTP estático. O navegador continua responsável pela execução, pelo DOM e pelo armazenamento de sessão.

Não fazem parte da plataforma atual: contas de alunos, notas centralizadas, sincronização entre dispositivos, execução remota de programas, emulação integral do xv6 e coleta de evidências da demonstração prática. A criação de documentos e exemplos dentro do jogo não conclui automaticamente as outras entregas do Projeto Integrador.

## 2 Organização pedagógica e inventário

O conteúdo das trilhas é definido em objetos JavaScript. O inventário da versão de referência contém 32 etapas, 329 blocos de desafio e 184 entradas de manual. A contagem de desafios inclui os blocos conceituais; portanto, não equivale a 329 questões avaliativas. Exercícios gerados no laboratório, passos dos roteiros e o minigame não entram nesse total.

| Trilha | Etapas | Blocos de desafio | Entradas de manual |
|---|---|---|---|
| 1 Introdução aos Sistemas Operacionais | 3 | 31 | 15 |
| 2 Gerenciamento de Processos | 9 | 95 | 61 |
| 3 Gerenciamento de Memória | 6 | 68 | 41 |
| 4 Gerenciamento de Arquivos | 5 | 63 | 40 |
| 5 Dispositivos e Entrada e Saída | 9 | 72 | 27 |
| Total | 32 | 329 | 184 |

### Percurso das trilhas

A trilha 1 apresenta a importância dos sistemas operacionais, sua evolução e seus conceitos básicos. A trilha 2 percorre processos, estados, criação e término, threads, comunicação e disputa, semáforos e monitores, escalonamento, problemas clássicos e deadlocks. O conteúdo de processos foi distribuído em três etapas iniciais para separar a descrição do processo, suas transições e seu ciclo de vida.

A trilha 3 aborda memória e MMU, paginação, uso e alocação da memória, paginação em disco e substituição de páginas. A trilha 4 trata de arquivos, sua utilização, sistemas de arquivos, formas de alocação, diretórios e atalhos. A trilha 5 segue um roteiro de nove etapas sobre hardware, interfaces, interrupções, drivers, classes de dispositivos, estratégias de E/S, DMA, buffers e armazenamento.

A referência curricular é Sistemas Operacionais: Conceitos e Mecanismos, de Carlos Maziero [R1]. Os textos de apoio estão em docs/trilhas/. Na trilha 5, a relação com os capítulos 19 a 21 foi explicitada e o aprofundamento sobre buffers e cache foi identificado como complemento. Números de página podem variar entre compilações do livro; capítulo e seção devem acompanhar qualquer referência a páginas.

### Formatos de aprendizagem

| Tipo no código | Quantidade nas trilhas | Participação do aluno |
|---|---|---|
| conceito | 83 | Ler uma explicação e avançar |
| multipla | 167 | Escolher a alternativa correta |
| ordenar | 19 | Construir uma sequência |
| associar | 35 | Relacionar pares de conceitos |
| simulacao | 7 | Aplicar ações até atingir estados objetivos |
| terminal | 15 | Digitar um comando aceito pelo desafio |
| substituicao | 3 | Selecionar a página vítima segundo uma política |

Os cartões finais de cada etapa fazem a conexão com xv6 e Linux. São material de leitura: trechos, esquemas, comandos e saídas apresentados pelo conteúdo. Eles não resultam de uma execução de kernel dentro do navegador. A versão revisada da trilha 5 permite notas específicas para identificar esquemas e simplificações.

## 3 Jornada de uso e regras de progressão

A abertura reproduz visualmente um início de sistema. O aluno acessa um menu inspirado no GRUB e escolhe uma trilha, o laboratório ou o minigame. Dentro de uma trilha, o mapa apresenta as etapas concluídas, disponíveis e bloqueadas. As trilhas podem ser escolhidas em qualquer ordem; a sequência de desbloqueio ocorre entre etapas da mesma trilha.

Uma lição cria uma fila de índices dos desafios da etapa. Cada resposta retira o índice atual da frente. Se a resposta exigir revisão e o desafio não tiver sido encerrado, o índice volta ao fim da fila. Quando a fila termina, o motor apresenta os cartões de conexão com xv6 e Linux e registra a conclusão da etapa. Algumas atividades interativas podem ser concluídas com erros já contabilizados e não repetem integralmente no mesmo momento.

A estabilidade começa em cinco segmentos, equivalentes a 100%. Um erro penalizável reduz um segmento; ao chegar a zero, aparece a tela de kernel panic. Concluir uma etapa sem erros pode recuperar um segmento. Esses indicadores pertencem à gamificação; não medem a saúde real do computador ou de um kernel.

Cada acerto concede 10 ciclos, com desconto de 5 se houver uso de dica. A partir de três acertos seguidos, o bônus de uptime acrescenta 5 ciclos. O uptime representa a sequência de acertos e zera ao errar. A precisão apresentada no resultado é calculada com os acertos e erros registrados durante a lição.

No laboratório, os erros não reduzem estabilidade nem desbloqueiam etapas das trilhas. O laboratório pode conceder ciclos e registrar a melhor precisão dos treinos e a conclusão dos roteiros. Isso permite praticar sem perder o avanço curricular. O minigame possui sua própria pontuação e concede ciclos apenas ao concluir um turno.

O manual é organizado por trilhas e etapas. As entradas são liberadas por conclusão de fase, possuem busca que desconsidera acentos e podem relacionar páginas em Veja também. O modo apresentação libera etapas e páginas, permite saltar entre desafios e mantém a estabilidade mínima em 20% durante erros comuns. Sua persistência usa uma chave separada da sessão normal.

## 4 Arquitetura e organização do repositório

O projeto é um site estático com uma única área principal, o elemento app. O motor substitui o conteúdo dessa área para mostrar telas e atividades. Não há roteador de framework nem comunicação com uma API de aprendizagem. Os módulos são scripts clássicos carregados em ordem explícita pelo HTML.

```text
projeto-s.o/
  index.html
  kernelPlay/
    index.html
    manifest.webmanifest
    css/estilo.css
    js/trilhas.js
    js/trilhas/trilha-1-introducao.js
    js/trilhas/trilha-2-processos.js
    js/trilhas/trilha-3-memoria.js
    js/trilhas/trilha-4-arquivos.js
    js/trilhas/trilha-5-dispositivos.js
    js/simulador.js
    js/shell.js
    js/laboratorio.js
    js/escalonador.js
    js/jogo.js
    assets/
  docs/trilhas/
  docs/justificativa/
  docs/desenvolvimento/
  tests/escalonador.cjs
  xv6-demo/codigo/
  xv6-demo/evidencias/
  apresentacao/
  design/
  CONTRIBUTING.md
```

As pastas docs/desenvolvimento/ e os documentos finais em docs/justificativa/ integram esta entrega documental. O redirecionamento na raiz preserva uma entrada simples para o site, enquanto kernelPlay/ mantém os caminhos relativos dos scripts, estilos e imagens. A separação entre código publicado e materiais acadêmicos permite revisar e compartilhar os documentos sem reorganizar o endereço do jogo.

| Arquivo ou grupo | Responsabilidade |
|---|---|
| trilhas.js e js/trilhas/ | Contrato do conteúdo, cadastro das trilhas e desafios |
| jogo.js | Navegação, renderização, avaliação, manual, persistência e integração |
| simulador.js | Regras e transições dos processos |
| shell.js | Sistema de arquivos e processos simulados dos roteiros |
| laboratorio.js | Exercícios gerados e critérios dos passos dos roteiros |
| escalonador.js | Motor e interface do minigame de dois núcleos |
| estilo.css e assets/ | Identidade visual, estados, layout e imagens |
| tests/escalonador.cjs | Verificações automatizadas das regras do minigame |

A ordem de carregamento é: lista-base de trilhas, cinco arquivos de conteúdo, simulador de estados, shell, laboratório, escalonador e motor geral. O motor depende das estruturas anteriores; inverter essa ordem pode impedir o cadastro ou o acesso a uma funcionalidade.

## 5 Modelo de dados e separação de responsabilidades

Cada trilha tem id, numero, titulo, subtitulo e um array fases. Cada fase identifica seus desafios, rótulo de etapa e cartões opcionais xv6, linux e man. O tipo do desafio determina os campos necessários e a função de montagem usada pelo motor. Essa estrutura concentra o texto educativo fora da maior parte da lógica de navegação.

O identificador de uma fase é a referência persistida de conclusão. IDs devem ser únicos e estáveis. A revisão da trilha 5 usa o prefixo es-v2- para que o novo conteúdo tenha um progresso próprio sem alterar os IDs das trilhas 1 a 4. Ao modificar um identificador, é preciso considerar a perda de associação com conclusões já registradas na sessão.

O estado global inclui ciclos, estabilidade, uptime, melhorUptime e concluidas; também pode registrar a trilha escolhida e os resultados do laboratório. O estado da lição inclui fase, fila de desafios, total, feitos, acertos, erros, ciclos, maiorUptime e dados do desafio atual. A fila de revisão contém índices, não cópias completas dos objetos de conteúdo.

O armazenamento usa JSON em sessionStorage com as chaves kernelplay-v2 e kernelplay-v2-apresentacao. Não há envio dessas informações a um servidor de aplicação. Esse armazenamento costuma sobreviver à recarga na mesma sessão, mas é temporário, associado à origem e à aba; não deve ser tratado como um cadastro permanente de aluno [R5]. As rotinas de leitura e escrita tratam exceções para que indisponibilidade do armazenamento não impeça a navegação.

O resultado do minigame é mantido na instância da tela para permitir comparação entre modelos. Ao sair dessa tela, a instância é destruída; o comparativo local não é um histórico persistente. Os ciclos positivos concedidos ao fim do turno são incorporados ao estado geral pelo retorno da integração.

## 6 Simulador de estados dos processos

Simulador, em simulador.js, mantém o array procs. Cada registro possui nome, estado, pai e motivo de bloqueio. O construtor copia os registros iniciais para que uma execução não modifique o cenário original do desafio. O próximo nome de processo deriva dos números já presentes; a atividade limita a tabela a seis processos vivos.

A lógica é uma máquina de estados acionada pelo aluno. aplicar(acao, nome) localiza o processo, verifica as condições da ação e retorna ok e msg. A interface mostra a mensagem e redesenha a tabela e o diagrama. objetivoCumprido compara os estados dos processos com todas as condições da atividade.

| Ação | Condição principal | Efeito didático |
|---|---|---|
| Escalonar | Processo pronto e CPU livre | READY para RUNNING |
| yield | Processo executando | RUNNING para READY |
| I/O | Processo executando | RUNNING para SLEEPING por E/S |
| Fim da E/S | Bloqueado por E/S | SLEEPING para READY |
| fork | Pai executando e espaço na tabela | Cria filho READY e preserva o pai |
| exit | Processo executando | Torna ZOMBIE e pode acordar o pai |
| wait | Pai executando e com filho | Coleta zumbi ou bloqueia o pai |

Se um pai bloqueia em wait, o término do filho torna o pai pronto, e seu próximo despacho pode concluir a coleta. Filhos de um processo que termina têm pai alterado para init. O modelo não executa cópia de memória, retorno duplo de fork, salvamento de registradores ou locks reais. A relação com xv6 é conceitual e pode ser comparada com proc.c e proc.h [R4].

READY é um nome interno do jogo, apresentado com a correspondência RUNNABLE do xv6. UNUSED representa remoção ou liberação no recorte didático; não é o mesmo que um processo ainda executando seu encerramento. O estado Novo aparece como entrada no diagrama, mas não é um estado duradouro do objeto criado por fork.

Esse simulador tem uma CPU e despacho manual. Ele não implementa seleção automática por FCFS, SJF ou Round-Robin. Essa distinção evita atribuir ao exercício de estados uma política que pertence a outra parte da plataforma.

## 7 Algoritmos e exercícios do laboratório

### Escalonamento de CPU

O gerador de escalonamento cria quatro processos com chegada c e duração b. As chegadas ficam ordenadas; as durações são positivas. O laboratório calcula FCFS, SJF, SRTF e Round-Robin sobre a mesma carga gerada para construir alternativas e uma explicação com Gantt. A função escalonar usa arrays de tempo restante e término, um Set de processos concluídos nas políticas não preemptivas e uma fila de índices no Round-Robin.

FCFS escolhe o primeiro processo disponível na ordem de chegada. SJF escolhe a menor duração entre os prontos e executa a tarefa até terminar. SRTF reavalia a menor duração restante a cada unidade de tempo. Round-Robin usa quantum de 2 ou 3 unidades, acrescenta as novas chegadas à fila antes de recolocar o processo que esgotou o quantum e preserva o restante de CPU para a rodada seguinte. Nos empates, a ordem dos índices estabiliza a escolha.

Os trechos consecutivos de um mesmo processo são agrupados no Gantt. O tempo de espera é término menos chegada menos duração, e a média divide a soma pelo número de processos. Essa fórmula é usada nesse cenário de uma CPU, sem E/S e sem custo de troca. Ela não substitui a contagem de espera por estado do minigame, que inclui bloqueios. As políticas apresentadas são discutidas no capítulo 6 de Maziero [R3].

### Memória e substituição de páginas

Na substituição, cada quadro guarda página, instante de entrada e último uso. A simulação avança automaticamente por acertos e faltas com quadro livre; ao precisar substituir, aguarda a escolha do aluno. FIFO remove o quadro com entrada mais antiga; LRU considera o uso menos recente; OPT consulta a referência futura mais distante. Empates válidos no OPT são aceitos pela interface. OPT serve como referência teórica, pois a sequência futura já é conhecida pelo exercício.

O gerador de endereços produz páginas de 1024, 2048 ou 4096 bytes e uma tabela de mapeamento. Página é a divisão inteira do endereço lógico pelo tamanho da página; deslocamento é o resto; endereço físico é quadro vezes tamanho mais deslocamento. A página marcada como inválida representa, no exercício, uma página fora da memória. Sistemas reais também podem gerar falhas por outros motivos, como proteção ou mapeamento inexistente.

### Arquivos e caminhos

Os demais geradores trabalham permissões rwx e octal, capacidade e fragmentação de blocos, ponteiros de i-nodes e normalização textual de caminhos. A normalização do exercício remove pontos e pares nome/..; ela não constitui uma implementação completa de resolução de caminhos com todas as particularidades de links simbólicos. O modo Misturado cria um desafio de cada família em ordem embaralhada.

## 8 Terminal e roteiros com estado

A plataforma possui dois mecanismos de terminal. Nas trilhas, montarTerminal compara o comando normalizado com expressões regulares definidas em aceitar, neutros e erradas. As saídas são cadastradas no conteúdo; um comando aceito conclui o desafio. Esse mecanismo treina a escolha do comando e não mantém uma sessão Linux ou xv6 real.

Nos roteiros do laboratório, ShellSimulado mantém um ambiente em memória. inodes é um Map indexado por número; diretórios guardam um Map filhos que relaciona nome a i-node. Arquivos contêm dados, permissões, dono, links e datas. Links físicos compartilham o mesmo i-node; links simbólicos guardam o alvo. procs é um Map de processos por PID e jobs é um array de tarefas em segundo plano. cwd e home orientam a resolução dos caminhos.

A entrada é separada em tokens com tratamento limitado de aspas, operadores, expansão de $$ e caminhos. O despachante chama métodos cmd_ correspondentes ao comando. Existem operações de criação e leitura de arquivos, navegação, cópia, remoção, links, permissões, consulta de processos e sinais. Pipelines implementam um subconjunto de filtros, principalmente grep e wc -l; alguns nomes são aceitos sem reproduzir toda a semântica da ferramenta original.

O roteiro Arquivos, links e permissões contém 15 passos. O roteiro Processos e sinais contém 14. Cada passo tem uma função ok que verifica o estado do shell e/ou o evento do último comando. Essa validação permite reconhecer o resultado da tarefa em vez de depender exclusivamente de uma frase digitada. Dicas e explicações ajudam o aluno a interpretar o efeito do comando.

Os sinais STOP e CONT alteram estados representados nos objetos; TERM e KILL seguem as regras simplificadas do simulador. Um TERM pendente em processo parado é tratado ao receber CONT. sleep e yes não são programas do sistema hospedeiro: suas representações servem aos exercícios. O próprio shell é protegido contra ações que encerrariam o roteiro.

As permissões não modelam integralmente grupos, ACLs ou a segurança do Linux: a verificação efetiva distingue dono e outros. Dados e processos são locais à instância e não alteram os arquivos ou processos do usuário. O terminal também não fornece um compilador, QEMU ou acesso ao computador por meio dos comandos digitados.

## 9 Desenvolvimento do minigame Seja o Escalonador

O minigame acrescenta prática direta sobre processos e threads. O jogador distribui tarefas prontas entre dois núcleos, observa bloqueios por E/S e compara os modelos 1:1 e N:1. Há uma política de despacho manual com preempção solicitada pelo jogador; não há quantum automático nem política fixa de prioridade.

A implementação separa SimulacaoEscalonador, que contém as regras, de JogoEscalonador, que controla interface e temporizador. O motor é exposto como JogoEscalonador.Simulacao para verificação sem navegador. tarefas é um array de objetos; cpus é um array de duas referências ou null; eventos guarda até oito mensagens recentes. PID agrupa as threads de um processo e uid identifica cada tarefa individual.

O cenário cria inicialmente web-srv, gcc e bash. Novos processos chegam a cada cinco passos até o instante 55. Os modelos fixam o trabalho de CPU e os pontos de E/S por progresso de execução. web-srv contém duas threads; cada uma recebe oito unidades de CPU, com solicitações de E/S em pontos distintos. Não há medição de desempenho dos programas reais com esses nomes: eles são rótulos de cargas didáticas.

Em 1:1, duas threads do mesmo PID podem ocupar os núcleos simultaneamente e apenas a solicitante bloqueia por E/S. Em N:1, o despacho impede que outro núcleo execute simultaneamente uma thread do mesmo PID; no caso de E/S bloqueante representado, todas as threads ainda não concluídas do processo aguardam. A comparação ilustra o mapeamento entre threads de usuário e entidades escalonáveis do kernel [R2].

### Ordem de um passo

1. Acrescentar espera às tarefas prontas e verificar episódios de espera prolongada.
2. Registrar quais tarefas já estavam bloqueadas antes do passo.
3. Consumir uma unidade de CPU de cada núcleo ocupado.
4. Processar conclusão ou início de E/S e liberar o núcleo correspondente.
5. Acordar as tarefas anteriormente bloqueadas cujo prazo terminou.
6. Avançar o relógio, gerar a próxima chegada prevista e verificar o fim do turno.

Essa ordem garante três intervalos completos de E/S e 60 passos úteis por turno. O temporizador pede um passo por segundo; atrasos do navegador podem alongar o tempo real [R6]. Pausar cancela o intervalo, e ocultar a aba pausa automaticamente. Sair pelo menu, marca ou manual destrói a instância e remove seus ouvintes, impedindo recompensas após a saída.

### Pontuação e métricas

Uma tarefa concluída vale 100 pontos, ou 120 quando possui E/S. Cada preempção manual custa 15. Uma tarefa que passa 12 segundos consecutivos pronta recebe uma penalidade de 40, uma vez por episódio até receber CPU. Ela permanece disponível. Esse evento é denominado espera longa; uma execução finita não comprova starvation indefinida. Os custos são pontuação educativa, não tempo real de troca de contexto.

Utilização é a ocupação acumulada dos núcleos dividida por duas vezes o tempo decorrido. Espera média inclui todas as tarefas criadas, inclusive inacabadas. Resposta média considera apenas tarefas já despachadas e mede primeiro despacho menos chegada. Threads explícitas e processos concluídos são contados separadamente; um processo com duas threads só conclui quando ambas terminam.

Ao final, ciclos são o máximo entre zero e a pontuação dividida por dez e arredondada. Os resultados dos dois modelos permanecem enquanto a tela estiver aberta. A mesma carga facilita a comparação, mas o comportamento do jogador também influencia os números; não se deve atribuir toda diferença observada apenas ao modelo de threads.

## 10 Decisões técnicas e consequências

### Tecnologias e distribuição

HTML, CSS e JavaScript permitem executar o material sem instalação de um ambiente de desenvolvimento de SO. A hospedagem estática pelo GitHub Pages distribui esses arquivos diretamente [R7]. A consequência é que não há processamento de servidor para salvar notas, executar kernels ou coordenar usuários. Um futuro cadastro exigiria uma arquitetura adicional.

### Conteúdo separado do motor

Os arquivos por trilha permitem revisar textos e acrescentar etapas mantendo a mesma mecânica. O motor geral ainda concentra navegação, avaliação e vários componentes; essa organização reduz a quantidade de infraestrutura, mas exige cuidado ao alterar uma função compartilhada. O uso de scripts globais torna a ordem de carregamento parte do contrato técnico.

### Interação em passos e execução temporizada

O simulador de estados usa ações explícitas para que o aluno examine cada transição. A substituição de páginas avança até o momento em que uma decisão é necessária. O minigame usa passos temporizados para mostrar competição por CPU, com pausa para permitir observação. A escolha combina explicação controlada e prática dinâmica sem apresentar o relógio do navegador como temporização de um SO real.

### Representações simples e cenário reproduzível

Arrays, objetos, Map e Set tornam as regras pequenas o suficiente para leitura pelo grupo. Filas prontas no minigame são obtidas filtrando tarefas pelo estado; não são filas de kernel com locks. A carga predeterminada facilita repetir a experiência entre 1:1 e N:1. O laboratório, por sua vez, sorteia dados para reduzir memorização e acompanha a resposta com o cálculo usado.

### Interface e acessibilidade

O visual usa cores por estado, tipografia de terminal, cabeçalhos inspirados em boot e seis poses do mascote. Rótulos textuais acompanham estados e ações. Botões nativos, indicadores de foco e atalhos de teclado apoiam a interação. O minigame recupera foco após redesenhar controles quando possível e empilha colunas em telas menores. Esses recursos não equivalem a uma auditoria completa de acessibilidade.

### Armazenamento e privacidade

A persistência temporária evita exigir login ou manter um servidor com dados de alunos. Em troca, o usuário não tem histórico acadêmico permanente nem garantia de continuidade entre abas, dispositivos ou sessões. O manifesto fornece nome, ícone, cores e modo de exibição; a versão inspecionada não registra service worker, portanto o manifesto sozinho não garante funcionamento offline nem instalação em todos os navegadores.

## 11 Evolução registrada do projeto

O histórico disponível começa com um primeiro commit já contendo uma base funcional. Ele permite descrever os marcos abaixo, mas não permite reconstruir datas ou etapas anteriores à entrada dos arquivos no Git. Os registros são identificados pelo hash para que possam ser consultados no repositório.

| Data | Commit | Marco registrado |
|---|---|---|
| 06/11/2026 | 1fdcf6b | Entrada inicial do projeto no Git |
| 06/11/2026 | de581ea | Manual separado por trilhas |
| 06/11/2026 | 0f6e420 | Organização das pastas e orientações de contribuição |
| 06/11/2026 | 5a73295 | Organização alfabética dos integrantes |
| 06/11/2026 | 87e1791 | Crédito do desenvolvedor e manual por trilhas |
| 18/11/2026 | d388698 | Atualização dos links para projeto-s.o |
| 18/11/2026 | 1dfe565 | Ampliação da trilha de dispositivos e E/S |
| 18/11/2026 | 0645331 | Alinhamento documental da trilha 5 ao Maziero |
| 18/11/2026 | 8871778 | Reestruturação progressiva completa da trilha 5 |
| 19/11/2026 | 9989806 | Integração do minigame Seja o Escalonador |

Na revisão da trilha 5, o conteúdo passou a explicitar referências, progressão e complementos. Sua estrutura final reúne dois blocos conceituais, quatro questões, uma associação e uma atividade final por etapa. A alteração atingiu o material escrito, o conteúdo usado pelo jogo e as notas de conexão com xv6 e Linux.

O minigame foi avaliado antes da integração. A implementação corrigiu paralelismo indevido em N:1, saída com temporizador ativo, duração incompleta do turno, consumo antecipado de E/S e contagem ambígua de preempções e conclusões. Também introduziu cenário fixo, pausa, métricas e verificações das regras. O commit foi enviado à branch main; a finalização dessa funcionalidade não representa encerramento das demais entregas acadêmicas.

## 12 Validação e evidências

Em 19/11/2026, o comando node tests/escalonador.cjs foi executado novamente durante a preparação documental. As nove verificações passaram. A suíte cobre regras do modelo e ciclo de vida da interface com ambiente simulado; ela não constitui uma prova completa de correção de todo o KernelPlay.

| Verificação automatizada | Resultado |
|---|---|
| Impedir paralelismo de threads do mesmo PID em N:1 | Passou |
| Permitir paralelismo e bloqueio individual em 1:1 | Passou |
| Bloquear e liberar o grupo em N:1 | Passou |
| Executar 60 passos e impedir avanço após o fim | Passou |
| Preservar tarefa com espera longa e reiniciar o episódio | Passou |
| Manter chegadas e carga equivalentes entre modelos | Passou |
| Concluir processo somente após suas duas threads | Passou |
| Calcular resposta, espera e utilização no cenário verificado | Passou |
| Cancelar temporizador e impedir callbacks adicionais | Passou |

Na integração do minigame também foram conferidos a sintaxe dos scripts, o acesso pelo menu, o despacho de threads, a pausa, a navegação para o manual, a restrição N:1 e a apresentação em largura reduzida. A inspeção do navegador não registrou erros de console naquele teste. Não foi registrada nesta entrega uma nova campanha completa de navegação por todas as 32 etapas.

O inventário de etapas, desafios e manual foi extraído dos objetos JavaScript carregados em ambiente isolado. Essa extração conferiu quantidades, mas não substitui revisão de cada enunciado, resposta, trecho de código ou referência bibliográfica. Também não foram executados testes de carga, estudo de aprendizagem com turma, auditoria de acessibilidade ou compilação real do xv6 como parte desta documentação.

### Roteiro de revisão para futuras alterações

1. Conferir sintaxe dos scripts alterados e unicidade dos IDs de fases.
2. Abrir a versão local por HTTP e testar abertura, menu e imagens.
3. Percorrer a etapa alterada com resposta correta, erro, dica e revisão.
4. Conferir os cartões xv6/Linux e o desbloqueio das páginas do manual.
5. Verificar modo apresentação, recarga de sessão, teclado e tela menor.
6. Executar a suíte do escalonador quando suas regras ou integração mudarem.
7. Após publicar, conferir o endereço público e a versão servida pelo navegador.

## 13 Execução publicação e manutenção

Para estudar o jogo, use o endereço público ou abra kernelPlay/index.html. Para testar alterações de forma próxima à publicação, execute, na raiz do repositório, python -m http.server 8000 e acesse http://localhost:8000/kernelPlay/. Python é uma conveniência para servir os arquivos; não é dependência do jogo distribuído. Node.js é necessário apenas para as verificações automatizadas fornecidas.

A edição de conteúdo começa no material de docs/trilhas/ e no arquivo JavaScript correspondente. Crie IDs únicos, confira os campos exigidos pelo tipo de desafio, valide respostas e registre fonte dos exemplos. Para acrescentar uma trilha, cadastre o objeto e inclua seu script depois de trilhas.js e antes de jogo.js. Para mudar o visual, use os tokens do início de estilo.css e revise os pontos de quebra.

Conforme CONTRIBUTING.md, o fluxo de colaboração é atualizar a cópia, criar uma branch por tarefa, alterar arquivos relacionados, enviar a branch, abrir revisão e incorporar à main. Essa revisão ajuda a proteger a versão que pode alimentar o site. Arquivos editáveis e PDFs devem permanecer juntos nas pastas de entrega. Evite incluir arquivos pessoais ou atribuir resultados reais a exemplos simulados.

O endereço atual usa projeto-s.o. Links antigos com kernel-play precisam ser atualizados nos materiais compartilhados. O HTML da raiz redireciona para kernelPlay/; preservar essa pasta evita quebrar o endereço do jogo e seus recursos relativos. O envio ao GitHub é uma etapa separada da atualização efetiva do GitHub Pages, que deve ser conferida após a publicação.

O jogo não usa compilação, instalação de pacotes ou pipeline de build no seu funcionamento atual. O manifesto não deve ser descrito como solução completa de cache offline. Conteúdo conceitual pode aceitar HTML interno do projeto; qualquer futura entrada externa de conteúdo deverá receber tratamento específico antes de ser renderizada como HTML.

## 14 Estado das entregas e continuidade

O minigame Seja o Escalonador está finalizado no escopo implementado e integra a versão 9989806. A plataforma possui os recursos documentados, com limitações explícitas e possibilidade de revisão pelo grupo. Esta entrega acrescenta a documentação de desenvolvimento e a justificativa técnica em fonte editável e PDF.

Na conferência documental de 25/11/2026, xv6-demo/ contém os experimentos proc_demo e uthread, código, patch, ambiente, logs e capturas reais. O registro de testes ainda identifica como pendente a reprodução por outro integrante; esta revisão não representa nova execução. O planejamento registra uma primeira versão dos slides no Canva, mas apresentacao/ ainda não contém a fonte editável nem o PDF final. A justificativa foi revisada com prompts de IA, identificação do agente, análise das heurísticas de Nielsen e esclarecimento sobre a carga fixa; a versão exata do modelo de IA não foi registrada. A revisão conjunta e a publicação dos materiais no Padlet continuam pendentes conforme os registros; gerar arquivos locais não os publica automaticamente.

Extensões possíveis incluem ampliar testes do simulador de estados e do shell, criar políticas automáticas selecionáveis no minigame, salvar comparações entre sessões e realizar avaliação com alunos. Essas possibilidades não são funcionalidades concluídas. Qualquer política nova deverá explicitar desempate, instante de preempção, custo de troca e população usada nas métricas para manter a comparação interpretável.

## Referências e arquivos de consulta

[R1] MAZIERO, Carlos A. Sistemas Operacionais: Conceitos e Mecanismos. Editora da UFPR, 2019. Portal oficial do livro e capítulos: https://wiki.inf.ufpr.br/maziero/doku.php?id=socm:start. Consulta em 19/11/2026.

[R2] MAZIERO, Carlos A. Implementação de tarefas. Capítulo 5, seção 5.4 Threads e seção 5.4.2 Modelos de threads. https://wiki.inf.ufpr.br/maziero/lib/exe/fetch.php?media=socm:socm-texto-05.pdf. Consulta em 19/11/2026.

[R3] MAZIERO, Carlos A. Escalonamento de tarefas. Capítulo 6. https://wiki.inf.ufpr.br/maziero/lib/exe/fetch.php?media=socm:socm-texto-06.pdf. Consulta em 19/11/2026.

[R4] MIT PDOS. xv6 RISC V. Código-fonte do sistema didático, especialmente kernel/proc.c e kernel/proc.h. https://github.com/mit-pdos/xv6-riscv. Os cartões do jogo também fazem referência ao xv6-labs-2024; a base utilizada e a origem do Uthread estão registradas em xv6-demo/README.md e xv6-demo/evidencias/ambiente.txt.

[R5] MDN Web Docs. Window sessionStorage property. https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage. Consulta em 19/11/2026.

[R6] MDN Web Docs. Window setInterval method. https://developer.mozilla.org/en-US/docs/Web/API/Window/setInterval. Consulta em 19/11/2026.

[R7] GitHub Docs. What is GitHub Pages. https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages. Consulta em 19/11/2026.

[R8] Grupo 3. Código e histórico do KernelPlay, versão 998980660419f90c246a42e0e7219967799ba175. https://github.com/PedroBrassi/projeto-s.o/tree/998980660419f90c246a42e0e7219967799ba175. Fontes principais: kernelPlay/js/, kernelPlay/index.html, kernelPlay/css/estilo.css, tests/escalonador.cjs, README.md e CONTRIBUTING.md.

Os trechos de xv6 mantêm o crédito ao MIT PDOS e sua licença MIT. O repositório informa que as ilustrações do mascote foram geradas com IA a partir da proposta visual do grupo. O uso do código e das imagens deve preservar os créditos existentes; esta documentação não atribui uma licença nova ao conjunto do projeto.
