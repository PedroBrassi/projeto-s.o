# Seja o Escalonador

Acesso: menu inicial do KernelPlay, botão **Seja o Escalonador**.

## Como jogar

Escolha 1:1 ou N:1 e inicie o turno. Clique em uma tarefa pronta para despachá-la em um dos dois núcleos livres. Clique em um núcleo ocupado para preemptar sua tarefa. Uma tarefa continua executando até concluir, solicitar E/S ou sofrer preempção manual. Não há quantum automático.

O turno tem 60 segundos simulados. Pausar congela a simulação; esconder a aba pausa automaticamente. Sair pelo menu, manual ou marca encerra a instância sem conceder a recompensa de um turno incompleto.

## Processos e threads

- **1:1:** cada thread tem uma entidade escalonável do kernel. Duas threads do mesmo processo podem ocupar núcleos diferentes, e uma E/S bloqueante suspende somente a thread solicitante.
- **N:1:** várias threads de usuário compartilham uma entidade escalonável do kernel por processo. Só uma thread de cada processo pode executar por vez. No cenário representado, uma chamada bloqueante de E/S suspende todas as threads desse processo. Isso não significa que toda chamada de sistema necessariamente bloqueie.
- Os processos web-srv têm duas threads explícitas. A conclusão de cada thread é contabilizada separadamente; o processo termina quando ambas concluem.
- Pronto, executando, bloqueado e concluído são estados simplificados da simulação; não correspondem diretamente a todos os estados internos do xv6.

## Cenário, pontuação e métricas

As chegadas ocorrem no início e a cada cinco segundos. Cada tarefa tem carga de CPU e pontos de solicitação de E/S predeterminados por seu progresso de CPU. A E/S dura três segundos simulados. Repetir o cenário ou trocar o modelo preserva essa carga, permitindo comparar suas decisões; as diferenças de resultados também dependem de como você escalonou as tarefas.

Concluir uma tarefa vale 100 pontos, ou 120 se ela tiver E/S. Cada preempção manual custa 15 pontos. Um episódio de 12 segundos consecutivos na fila custa 40 pontos, uma única vez até a tarefa voltar a receber CPU. A tarefa não é removida. Espera prolongada indica risco de starvation; uma rodada finita não demonstra inanição indefinida.

Essas penalidades são regras do jogo e não tempo real de troca de contexto. O modelo não contabiliza custo de troca na CPU. O fim de cada turno concede ciclos positivos iguais à pontuação dividida por dez e arredondada; pontuação negativa concede zero ciclos.

- Utilização: segundos ocupados nos núcleos / (2 × tempo simulado decorrido).
- Espera média: tempo acumulado no estado pronto, dividido por todas as tarefas criadas, inclusive inacabadas.
- Resposta média: intervalo entre chegada e primeiro despacho, considerando apenas as tarefas que receberam CPU.

Os resultados dos dois modelos ficam visíveis enquanto a tela do minigame estiver aberta. O progresso das trilhas continua separado, e o modo do minigame fica travado durante a partida, inclusive em pausa.

## Referência e limites

MAZIERO, Carlos A. *Sistemas Operacionais: Conceitos e Mecanismos*. Capítulo 5, Threads, seção 5.4, modelos de implementação. [Texto do autor](https://wiki.inf.ufpr.br/maziero/lib/exe/fetch.php?media=socm:socm-texto-05.pdf).

O minigame ilustra os conceitos; não implementa threads reais, drivers, xv6 ou o escalonador de um SO. Cada passo avança um segundo simulado; atrasos do navegador podem aumentar a duração real da rodada.

## Verificação

Execute `node tests/escalonador.cjs` na raiz do repositório. Os testes cobrem exclusão de paralelismo N:1, paralelismo 1:1, bloqueio e desbloqueio, duração completa, espera, carga repetível, conclusão de processos/threads, métricas e encerramento do temporizador.
