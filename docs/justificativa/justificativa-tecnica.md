# Justificativa técnica do KernelPlay

Projeto Integrador de Sistemas Operacionais

Grupo 3 | Processos e Threads | Revisão documental de 25 de novembro de 2026

## Identificação e objetivo

Desenvolvemos o KernelPlay como uma plataforma educativa para relacionar conceitos de Sistemas Operacionais com ações que o aluno pode observar e experimentar. Nosso recorte principal é Processos e Threads: criação e término de processos, estados de execução, bloqueio por entrada e saída, escalonamento e modelos de implementação de threads. As demais trilhas oferecem o contexto de memória, arquivos e dispositivos usado por essas tarefas.

O simulador pode ser acessado em https://pedrobrassi.github.io/projeto-s.o/kernelPlay/ e seu código está em https://github.com/PedroBrassi/projeto-s.o. A descrição das regras do simulador tem como base a versão 998980660419f90c246a42e0e7219967799ba175, com o minigame Seja o Escalonador integrado. Esta revisão documental, de 25/11/2026, acrescenta a análise de usabilidade, o registro de IA e esclarecimentos sobre a carga fixa; também atualiza a situação da demonstração xv6 conforme os arquivos do repositório. As correções de conteúdo de 23/11/2026 são registradas separadamente em docs/revisao-conteudo-2026-11-23.md. As explicações abaixo descrevem as regras implementadas e distinguem as representações didáticas do funcionamento de um kernel real.

Integram o grupo: Ana Flávia dos Santos Peixoto; Aurélio Junior; Gabriel Alves Domingos; Guilherme Gouvêa da Silva; Pedro Brassi Luccas; Pedro Lima; Victor Orlando Avelar. O Padlet reúne as entregas em https://padlet.com/pedroluccas2/grupo-3-processos-e-threads-s024zwdrjwwsaqd4z88l.

## 1 O que o simulador mostra

### Conceitos de Sistemas Operacionais

Nosso objetivo é mostrar que um processo não ocupa a CPU durante toda a sua existência. Ele pode estar pronto, executando, bloqueado por um evento ou aguardando a coleta do término pelo pai. O aluno aplica ações e verifica por que uma tarefa deixa de disputar a CPU, quando volta a ficar apta e por que conclusão e coleta são momentos diferentes.

Também mostramos que um processo pode conter mais de uma thread. No minigame, tarefas com o mesmo PID pertencem ao mesmo processo e possuem identificadores individuais. O compartilhamento do PID representa esse vínculo; não implementamos compartilhamento real de memória, registradores ou pilhas. O comportamento de execução depende do modelo 1:1 ou N:1 escolhido.

A fundamentação curricular é o livro de Carlos Maziero [R1]. A seção 5.4 do capítulo Implementação de tarefas apresenta threads e seus modelos; o capítulo Escalonamento de tarefas fornece a referência para as políticas estudadas [R2, R3]. Os exemplos de xv6 servem para ligar as abstrações do jogo ao código de um sistema didático [R4].

### Qual algoritmo é usado em cada atividade

| Componente | Conceito e algoritmo efetivamente implementado |
|---|---|
| Simulação de processos nas trilhas | Máquina de estados, com validação de ações e despacho manual em uma CPU |
| Treino de escalonamento no laboratório | FCFS, SJF não preemptivo, SRTF e Round-Robin sobre cargas geradas |
| Seja o Escalonador | Simulação em passos discretos com despacho e preempção manuais em dois núcleos; comparação 1:1 e N:1 |
| Substituição de páginas | FIFO, LRU e OPT, como conteúdo complementar de memória |
| Roteiros de terminal | Interpretação limitada de comandos e alteração de estruturas em memória |

O minigame não recebe o nome de Round-Robin porque não tem quantum nem rotação automática da fila. Também não implementa SJF, prioridades automáticas ou aging: a escolha de quem recebe CPU é do jogador. O treino do laboratório é o local em que as políticas clássicas são calculadas automaticamente.

## 2 Como funciona a lógica e quais estruturas usamos

### Máquina de estados dos processos

Representamos os processos em um array de objetos com nome, estado, pai e motivo de bloqueio. O objeto Simulador recebe uma cópia do cenário inicial da atividade. Aplicar uma ação significa localizar o processo, conferir sua situação, alterar os campos permitidos e produzir uma mensagem explicativa.

Escalonar exige uma tarefa pronta e a CPU livre. yield devolve a CPU e torna a tarefa pronta. I/O bloqueia quem estava executando e Fim da E/S torna o processo pronto, sem colocá-lo diretamente na CPU. fork cria um filho pronto; exit transforma o processo em zumbi; wait pode coletar um filho já terminado ou bloquear o pai até que exista um término a coletar.

Quando o filho termina e o pai estava esperando, o pai volta a ficar pronto. Seu próximo despacho pode concluir a coleta do zumbi. A atividade compara o estado de cada processo com um conjunto de objetivos; o desafio termina quando todas as condições são satisfeitas. A representação tem uma CPU e limite de seis processos vivos para manter o exercício legível.

| Nome interno | Significado no jogo | Correspondência apresentada do xv6 |
|---|---|---|
| READY | Pronto para disputar a CPU | RUNNABLE |
| RUNNING | Ocupa a CPU | RUNNING |
| SLEEPING | Aguarda E/S ou término de filho | SLEEPING |
| ZOMBIE | Terminou e aguarda coleta | ZOMBIE |
| UNUSED | Removido ou liberado no modelo | UNUSED |

Os nomes ajudam na leitura do código, mas a tabela não reproduz todo o ciclo interno do xv6. Por exemplo, o Novo do diagrama é uma entrada visual: o filho já é armazenado como pronto. Também não copiamos memória nem salvamos registradores ao executar fork ou trocar a tarefa representada na CPU.

### Políticas de escalonamento no laboratório

O treino cria quatro processos com chegada c e duração de CPU b. Calculamos o término de cada processo e construímos um Gantt, que é a sequência dos intervalos de execução. Usamos arrays para duração restante e término, um Set para marcar concluídos em políticas não preemptivas e uma fila de índices para Round-Robin.

No FCFS, selecionamos o primeiro processo pronto na ordem de chegada e o executamos até o fim. No SJF, escolhemos a menor duração entre as tarefas que já chegaram. No SRTF, a cada unidade de tempo reavaliamos a tarefa com menor tempo restante. No Round-Robin, retiramos o primeiro índice da fila, executamos até o limite do quantum e recolocamos a tarefa se ainda houver trabalho. As chegadas durante um quantum entram antes do retorno da tarefa preemptada.

O gerador usa quantum de 2 ou 3 unidades para Round-Robin. Os empates são resolvidos pela ordem dos processos no array. Os dados gerados têm chegadas ordenadas e duração positiva; o algoritmo trabalha com essas condições. A explicação apresenta a espera individual e a comparação das médias na carga sorteada.

```text
espera de um processo = término - chegada - duração de CPU
espera média = soma das esperas / quantidade de processos
```

Essa conta pertence ao cenário do laboratório, com uma CPU e sem E/S. Não a utilizamos como fórmula geral para qualquer execução com bloqueios. No minigame, contamos diretamente quanto tempo cada tarefa permanece pronta.

### Minigame com processos e threads

Separar as regras da interface permite verificar o modelo sem depender do desenho da tela. SimulacaoEscalonador mantém a carga, o tempo e as transições; JogoEscalonador recebe os cliques, agenda os passos e apresenta os resultados. A integração com jogo.js acrescenta o acesso pelo menu e recebe os ciclos concedidos no fim da partida.

| Estrutura | Conteúdo e função |
|---|---|
| tarefas | Array de objetos com PID, uid, estado, carga, E/S e tempos |
| cpus | Array de duas posições; cada posição referencia uma tarefa ou null |
| eventos | Array com até oito mensagens recentes |
| resultado | Contadores e métricas calculados a partir do estado |
| resultados por modelo | Comparação local de turnos 1:1 e N:1 na mesma tela |

Cada tarefa guarda total e restante de CPU, os pontos de E/S, instante de chegada, primeiro despacho, espera acumulada, espera consecutiva e instante de despertar. Os estados são pronto, executando, bloqueado e concluido. As listas da tela são obtidas filtrando o array pelo estado; não criamos filas de kernel independentes.

O cenário inicia três processos e acrescenta um novo processo a cada cinco passos, até o instante 55. Os rótulos web-srv, gcc, bash e postgres representam cargas predeterminadas. Cada web-srv tem duas threads, cada uma com oito unidades de CPU; os pontos de E/S diferem entre as threads. As durações não são benchmarks desses programas reais.

O despacho procura uma tarefa pronta e o primeiro núcleo livre. Em N:1, verifica também se algum núcleo já executa uma tarefa do mesmo PID: nesse caso, o segundo despacho é recusado. Em 1:1, duas threads do mesmo processo podem ocupar os núcleos simultaneamente. Essa verificação é a regra que torna observável a diferença entre os modelos.

### Ordem do passo e bloqueio por E/S

Em cada passo, primeiro acrescentamos espera às tarefas prontas. Em seguida, registramos as tarefas que já estavam bloqueadas e consumimos uma unidade de CPU das que ocupam os núcleos. Depois verificamos conclusões e novas solicitações de E/S, liberamos os núcleos correspondentes, acordamos quem já completou a espera e avançamos o relógio.

Uma nova E/S agenda o despertar para três unidades após o fim do passo corrente. Usar o conjunto de bloqueados anteriores evita descontar uma unidade de uma E/S que acabou de começar. Assim, uma solicitação iniciada no instante 2 só volta a ficar pronta no instante 5. O jogador precisa então despachá-la novamente; despertar não significa executar imediatamente.

Em 1:1, a solicitante bloqueia individualmente. Em N:1, uma operação bloqueante do caso representado suspende todas as threads não concluídas do mesmo processo. A regra descreve essa situação específica; não afirma que toda chamada de sistema, nem toda operação de E/S possível, precise bloquear o processo inteiro.

```text
repetir enquanto o turno não terminou
  acumular espera das tarefas prontas
  guardar as tarefas já bloqueadas
  para cada núcleo ocupado
    consumir uma unidade de CPU
    concluir a tarefa ou iniciar E/S quando previsto
  acordar tarefas anteriores cujo prazo chegou
  avançar o relógio e criar a chegada prevista
  encerrar quando o relógio atingir 60
```

Concluir uma thread explícita aumenta o contador de threads. O contador de processos só aumenta quando todas as tarefas com aquele PID estão concluídas. Processos de uma única tarefa contribuem para processos concluídos, mas não para o contador reservado às threads explícitas do web-srv.

### Métricas e pontuação

Calculamos utilização como segundos ocupados nos dois núcleos divididos por duas vezes o tempo simulado decorrido. A espera média soma os passos em que cada tarefa ficou pronta e divide por todas as tarefas criadas, inclusive as inacabadas. A resposta média usa primeiro despacho menos chegada e considera somente tarefas que já receberam CPU. Sem tarefa atendida, a tela mostra um traço para resposta.

Concluir uma tarefa concede 100 pontos, ou 120 se ela possui E/S. Uma preempção manual custa 15 pontos. Ao completar 12 segundos consecutivos na fila de prontos, uma tarefa causa uma penalidade de 40, uma vez por episódio até receber CPU novamente. Ela continua disponível; não é descartada. Essa espera longa indica risco de starvation, mas a partida não demonstra inanição indefinida.

O placar não é uma medida física do kernel. O turno concede ciclos iguais à pontuação dividida por dez e arredondada, com mínimo de zero. Comparações entre os modelos devem registrar também as decisões do jogador: a carga é fixa, mas diferentes escolhas de despacho e preempção podem modificar o resultado.

## 3 Decisões tomadas e por quê

### Execução no navegador

Usamos HTML, CSS e JavaScript para permitir acesso pelo link, sem instalar um sistema operacional experimental. A estrutura estática também facilita hospedar o projeto no GitHub Pages e compartilhar o mesmo material com o professor. A consequência é que trabalhamos com representações em memória, sem executar o xv6, acessar o hardware diretamente ou criar processos nativos.

### Passo a passo e tempo simulado

Na máquina de estados, escolhemos ações passo a passo porque cada transição precisa ser examinada: o aluno pode observar que fim da E/S leva a pronto, e não diretamente a executando. No minigame, adotamos passos temporizados de um segundo simulado para representar competição por CPU e chegadas enquanto o jogador decide.

Mantivemos pausa manual e pausa automática quando a aba fica oculta para permitir observação e evitar que a rodada avance sem o aluno. Um turno tem 60 passos completos; o temporizador do navegador não garante duração física exata, pois pode sofrer atrasos. Pausar interrompe a contagem e continuar retoma o agendamento.

### Mesmo cenário para comparar threads

Adotamos uma carga fixa para que repetir em 1:1 e N:1 preserve chegadas, trabalho de CPU e pontos de E/S por tarefa. Isso torna a comparação mais interpretável do que trocar o cenário junto com o modelo. Durante uma rodada, inclusive em pausa, a troca de modelo fica bloqueada. O laboratório mantém exercícios sorteados porque seu objetivo é praticar contas com dados novos.

A interação do aluno ocorre na escolha do modelo, no despacho, na preempção e na pausa. A versão entregue não oferece entrada personalizada para chegadas, durações de CPU ou eventos de E/S. A carga fixa é uma decisão de escopo para favorecer repetição e comparação; ela limita a investigação de cenários próprios e difere de uma proposta com carga informada pelo usuário. Mesmo com a mesma carga, as decisões do jogador podem alterar as métricas. A configuração de cargas é uma possibilidade de evolução, não uma funcionalidade implementada. Essa justificativa não substitui a conferência de eventual exigência de entrada personalizada no enunciado da disciplina.

### Despacho manual e métricas visíveis

Colocamos o jogador no papel de escalonador para que a escolha tenha consequência observável. Uma tarefa pode esperar enquanto existe uma decisão pendente do jogador; portanto, as métricas refletem tanto as regras do modelo quanto sua interação. Não há prioridade automática, aging ou quantum no minigame. Ações de yield da máquina de estados representam devolução voluntária; a retirada por clique no núcleo do minigame é identificada como preempção manual.

Separar processos e threads concluídos evita contar cada thread como um processo independente. Mostrar espera, resposta e utilização ajuda a discutir que ocupar CPU, atender rapidamente e distribuir oportunidades são objetivos diferentes. Definimos a população de cada média para que o leitor saiba como tarefas ainda não atendidas afetam os números.

### Estruturas simples e conteúdo organizado

Arrays e objetos são suficientes para as cargas pequenas do exercício e permitem explicar o algoritmo com o próprio código. Map é utilizado no shell para acessar i-nodes e processos por identificador; Set auxilia o controle de processos já concluídos nos cálculos do laboratório. Não reproduzimos estruturas especializadas e mecanismos de sincronização de um kernel multiprocessado.

Separar arquivos de conteúdo por trilha facilita revisar enunciados e referências sem reescrever as regras gerais. A interface mantém textos explicativos ao lado das ações. O manual relaciona os termos ao avanço do aluno; o modo apresentação permite demonstrar qualquer etapa sem alterar o progresso normal.

### Sessão temporária e encerramento da instância

Usamos sessionStorage para manter o progresso durante a sessão sem pedir cadastro. Isso facilita iniciar a atividade, mas não serve como registro acadêmico permanente nem sincroniza dispositivos. Ao sair do minigame, cancelamos seu temporizador e removemos eventos para que uma tela encerrada não continue simulando ou concedendo ciclos.

## 4 Simplificações em relação a um SO real

### O que preservamos conceitualmente

Preservamos a distinção entre estar pronto e estar executando; o bloqueio retira a tarefa da disputa por CPU; o despertar a torna apta a disputar novamente; e um filho pode terminar antes da coleta por wait. Mantemos também o vínculo entre threads de um processo, a possibilidade de paralelismo em 1:1 e a limitação de uma entidade do kernel por processo em N:1 no cenário mostrado.

Essas relações tornam o modelo útil para explicar o conteúdo e compará-lo com código e ferramentas reais. A correspondência é uma aproximação de comportamento, sem afirmar que o JavaScript executa as chamadas de sistema ou a política interna de um kernel.

| Aspecto | Modelo do KernelPlay | Diferença em um SO real |
|---|---|---|
| Execução | Objetos e contadores no navegador | Instruções, modo usuário e kernel, registradores e memória |
| Recursos | Uma CPU nas atividades de estados; dois núcleos no minigame | Topologia e número de CPUs variáveis, interrupções e atividades do kernel |
| Despacho | Ação do aluno no minigame e nas simulações de estados | Política e mecanismos executados pelo kernel |
| Threads | PID e uid associam tarefas | Contextos, pilhas e recursos efetivamente compartilhados |
| fork | Cria um registro filho pronto | Criação e inicialização de recursos e contextos conforme o SO |
| E/S | Eventos em pontos fixos e espera de 3 passos no minigame | Dispositivos, latências, filas, erros e operações bloqueantes ou não |
| Troca de contexto | Preempção altera referências e custa pontos | Salvamento de contexto e custos de execução e memória |
| Espera longa | Alerta aos 12 segundos simulados | Starvation depende da política e da falta persistente de atendimento |
| Identificadores e estados | Tabelas pequenas e estados reduzidos | Estruturas, transições e limites específicos de cada kernel |
| Terminal | Expressões cadastradas ou shell em memória | Comandos e processos realmente executados pelo SO |
| Persistência | Dados temporários de sessão | Arquivos, serviços e mecanismos duráveis, quando configurados |

A simulação de estados admite no máximo seis processos vivos. O minigame usa um cenário curto, com chegadas e durações predeterminadas, sem custo temporal de troca, afinidade de CPU, migração custosa, TLB, níveis de cache ou interferência de outras aplicações. A ordem das ações é sequencial no JavaScript; os núcleos mostrados são duas posições do modelo, não threads nativas executadas em paralelo.

Não implementamos um escalonador completo do Linux nem um kernel xv6. O terminal dos roteiros possui arquivos, permissões e sinais simplificados; o terminal das trilhas pode apenas reconhecer o comando e apresentar uma saída previamente cadastrada. As saídas e cartões didáticos não constituem evidências de execução real em Linux ou xv6.

Na memória, OPT usa conhecimento da cadeia futura e funciona como referência teórica. No shell, grupos de permissões, pipelines e resolução de caminhos não têm toda a semântica de um ambiente Unix. O manifesto de aplicação facilita a apresentação do site, mas não existe service worker registrado para garantir uso offline.

### Limite da entrega prática

A demonstração em xv6 é uma entrega separada e já possui código e evidências de execução no repositório: proc_demo para processos e uthread para threads cooperativas de usuário. O README de xv6-demo registra a base xv6-labs-2024, branch util, commit 79e8024d61c3dd92ccf064fc67bb99cb999f70ab, e a origem do esqueleto Uthread em xv6-labs-2023. O planejamento de 23/11 registra a reprodução independente como pendente. Esta revisão documental não representa uma nova execução dos experimentos. A comparação com um SO atual continua vinculada aos slides e às referências da entrega correspondente; esta justificativa não substitui esses materiais.

## Validação da implementação

Em 19/11/2026, executamos node tests/escalonador.cjs e as nove verificações passaram. Elas cobrem restrição de paralelismo N:1, paralelismo 1:1 e bloqueio individual, bloqueio de grupo, duração de 60 passos, espera longa, carga equivalente, conclusão de processos e threads, métricas e cancelamento do temporizador. Os testes verificam as regras da simulação, inclusive o controle de callbacks em ambiente simulado.

Na integração foram conferidos o carregamento dos scripts, acesso pelo menu, despacho, pausa, navegação, comportamento N:1 e layout em largura reduzida. Essa verificação não equivale a um estudo de eficácia pedagógica, a uma auditoria completa de acessibilidade ou a testes de todas as etapas da plataforma. O código e os testes ficam disponíveis para o professor reproduzir a avaliação.

## Análise de usabilidade pelas heurísticas de Nielsen

Relacionamos as dez heurísticas de Nielsen [R7] com funcionalidades identificadas no KernelPlay. A tabela apresenta uma análise do grupo sobre a interface e seus limites. Ela não constitui certificação de atendimento integral nem estudo de usabilidade com participantes.

| Heurística | Evidência no KernelPlay | Limite da análise |
|---|---|---|
| 1. Visibilidade do estado | Tempo, estados das tarefas, ocupação dos núcleos e métricas. | Compreensão pelos alunos ainda precisa ser avaliada. |
| 2. Correspondência com o mundo real | CPU, filas e E/S acompanhadas de explicações. | Terminologia técnica exige contextualização. |
| 3. Controle e liberdade | Pausa, saída e repetição do minigame. | Não há desfazer geral das decisões da rodada. |
| 4. Consistência e padrões | Botões e estados seguem padrões visuais recorrentes. | Consistência não foi medida com participantes. |
| 5. Prevenção de erros | Ações inválidas bloqueadas e confirmação para apagar progresso. | Restrições não evitam todos os enganos. |
| 6. Reconhecimento em vez de memorização | Opções, estados e dicas ficam disponíveis na interface. | Atividades de terminal ainda exigem lembrar comandos. |
| 7. Flexibilidade e eficiência | Menu por teclado e modo apresentação. | Cargas do minigame não são personalizáveis. |
| 8. Estética e minimalismo | Trilhas divididas em etapas e manual acessado sob demanda. | Densidade visual merece avaliação em telas pequenas. |
| 9. Reconhecer e recuperar erros | Feedback explica respostas e restrições de ações. | Recuperação depende do tipo de atividade. |
| 10. Ajuda e documentação | Manual com busca, dicas e instruções contextuais. | Cobertura da ajuda deve acompanhar revisões do conteúdo. |

Os exemplos podem ser localizados em kernelPlay/js/jogo.js, que organiza navegação, manual e feedback; em kernelPlay/js/escalonador.js, que apresenta o minigame, seus estados e controles; e em kernelPlay/css/estilo.css, que define os padrões visuais. O terminal e os trechos ilustrativos devem ser interpretados dentro das simplificações descritas neste documento.

## Uso de inteligência artificial e principais prompts

Durante o desenvolvimento do KernelPlay, utilizamos o ChatGPT/Codex como apoio à avaliação de propostas, à elaboração da documentação e à revisão técnica. As respostas foram utilizadas como material de trabalho sujeito a conferência. O grupo permanece responsável pelo conteúdo entregue, pelas decisões de implementação e pela explicação do funcionamento da plataforma.

### Agente e versão utilizados

Foi utilizado o Codex, agente de programação da OpenAI, para apoiar a análise do código, a implementação autorizada, as verificações e a elaboração da documentação. O histórico também contém interações referenciadas do ChatGPT. A versão específica do modelo utilizado em cada etapa não foi registrada no histórico consultado; por isso, não atribuímos uma versão não comprovada a todo o trabalho.

### Principais prompts utilizados

Os pedidos abaixo foram extraídos do histórico de trabalho, preservando sua grafia original.

**1. Avaliação do minigame antes da implementação**

“Queria adicionar um jogo, vou te mandar os codigos e voce faz uma avaliação e antes de implementar me avise.”

O pedido foi acompanhado do código proposto. A ferramenta auxiliou na avaliação do minigame, cuja integração ocorreu posteriormente, mediante autorização.

**2. Elaboração da documentação e da justificativa técnica**

“Pode dar ele como finalizado. Quero agora, que voce faça uma documentação completa de todo desenvolvimento dessa plataforma. Além disso, faça um documento contendo: Justificativa técnica 1. O que o simulador mostra: qual conceito de SO e qual algoritmo. 2. Como funciona: a lógica do algoritmo e as estruturas de dados usadas, explicadas pelo grupo. 3. Decisões tomadas e por quê (ex.: passo a passo em vez de tempo real). 4. Simplificações: o que é diferente ou igual a de um SO real.”

Esse pedido orientou a organização inicial da justificativa nos quatro itens solicitados. A documentação descreve as funcionalidades implementadas, as estruturas utilizadas e os limites do modelo didático. As quebras de linha do pedido foram reunidas neste registro para facilitar a leitura.

**3. Revisão das informações da plataforma**

“Quero que voce verifique se todas as informações presente no KernelPlay estão atualizadas.”

A revisão envolveu consulta ao código e a fontes técnicas. Foram identificadas e corrigidas imprecisões em conceitos, exemplos, gabaritos e textos de apoio, com registro das alterações no repositório.

**4. Avaliação de melhorias na justificativa**

“Me fale quais melhorias a gente pode colocar. Antes de implementar, voce me fala o que acha?”

A ferramenta auxiliou na análise de possíveis complementos à justificativa, incluindo o registro dos prompts, a relação entre funcionalidades e heurísticas de usabilidade e a explicação da escolha de carga fixa no minigame.

### Conferência e responsabilidade pelo conteúdo

As contribuições da IA foram acompanhadas de verificações registradas no histórico, incluindo consulta a referências técnicas, conferência do código, validação de sintaxe e comparação de resultados calculados. A atividade de Round-Robin, por exemplo, foi comparada com o algoritmo do laboratório. Também foram executadas as nove verificações da suíte existente do minigame, conforme o registro de validação deste documento.

Essas verificações possuem escopo limitado e não comprovam a ausência de erros. Elas também não equivalem à execução de todos os programas citados nas trilhas ou à realização de testes de usabilidade com participantes.

Os prompts apresentados registram interações relevantes do desenvolvimento, sem constituir um inventário completo de todas as consultas. A utilização da IA como apoio não transfere a responsabilidade acadêmica: cabe ao grupo compreender, revisar e explicar o material apresentado.

## Referências

[R1] MAZIERO, Carlos A. Sistemas Operacionais: Conceitos e Mecanismos. Editora da UFPR, 2019. Portal oficial: https://wiki.inf.ufpr.br/maziero/doku.php?id=socm:start. Consulta em 19/11/2026.

[R2] MAZIERO, Carlos A. Implementação de tarefas. Capítulo 5, seção 5.4 Threads, especialmente 5.4.2 Modelos de threads. https://wiki.inf.ufpr.br/maziero/lib/exe/fetch.php?media=socm:socm-texto-05.pdf. Consulta em 19/11/2026.

[R3] MAZIERO, Carlos A. Escalonamento de tarefas. Capítulo 6. https://wiki.inf.ufpr.br/maziero/lib/exe/fetch.php?media=socm:socm-texto-06.pdf. Consulta em 19/11/2026.

[R4] MIT PDOS. xv6 RISC V. Código do kernel, especialmente kernel/proc.c e kernel/proc.h. https://github.com/mit-pdos/xv6-riscv. Os cartões do jogo também citam xv6-labs-2024. A revisão exata da demonstração e a origem do Uthread estão registradas em xv6-demo/README.md e xv6-demo/evidencias/ambiente.txt.

[R5] MDN Web Docs. Window sessionStorage property e Window setInterval method. https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage e https://developer.mozilla.org/en-US/docs/Web/API/Window/setInterval. Consulta em 19/11/2026.

[R6] Grupo 3. KernelPlay, código da versão 998980660419f90c246a42e0e7219967799ba175. https://github.com/PedroBrassi/projeto-s.o/tree/998980660419f90c246a42e0e7219967799ba175. Arquivos centrais: kernelPlay/js/simulador.js, laboratorio.js, escalonador.js, shell.js, jogo.js e tests/escalonador.cjs.

[R7] NIELSEN, Jakob. 10 Usability Heuristics for User Interface Design. Nielsen Norman Group. Publicado em 24/04/1994; última revisão em 30/01/2024. https://www.nngroup.com/articles/ten-usability-heuristics/. Consulta em 25/11/2026.
