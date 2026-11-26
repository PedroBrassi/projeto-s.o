# Demonstração no xv6 — Processos e Threads

Projeto Integrador de Sistemas Operacionais — Grupo 3 (Processos e Threads).

Esta pasta reúne o código, as instruções e as evidências reais de dois experimentos executados no xv6:

1. **Processos** com `fork`, `getpid`, `exit` e `wait`.
2. **Threads de usuário cooperativas** (modelo N:1), baseadas no laboratório Uthread do MIT 6.1810.

Os trechos e terminais simulados do KernelPlay são materiais didáticos. Esta pasta registra a execução real.

## Conteúdo

```text
xv6-demo/
  README.md
  codigo/
    proc_demo.c            experimento 1 (processos)
    uthread.c              experimento 2 (biblioteca de threads + programa de teste)
    uthread_switch.S       experimento 2 (troca de contexto em assembly RISC-V)
    integracao.patch       todas as alterações em relação à base registrada
  evidencias/
    ambiente.txt                        versões reais do ambiente
    comandos-e-resultados.md            esperado x observado e situação das verificações
    reproducao-gabriel.md               reprodução independente com capturas originais
    passo3-proc_demo.txt                sessão gravada do experimento 1
    passo4-uthread-e-copia-limpa.txt    sessão gravada do experimento 2 e da reprodução limpa
    capturas/
      passo3-ctrlp-zombie.png           Ctrl-P antes do wait(): filho zombie
      passo3-ctrlp-apos-wait.png        Ctrl-P depois do wait(): filho fora da tabela
      passo7-copia-limpa.png            proc_demo e uthread na cópia limpa com o patch
      gabriel/                         capturas de proc_demo, proc_demo pausa e uthread
```

## Ambiente e versão exata

| Item | Valor |
|---|---|
| Sistema | Windows + WSL 2 (Ubuntu 24.04.5 LTS) |
| Contêiner | Docker Engine 29.10.0, imagem `so-xv6:2024` (ID `76d830f56c1a`) fornecida pelo professor e aberta pelo script `xv6.sh` |
| Ferramentas da imagem | QEMU 8.2.2, `riscv64-linux-gnu-gcc` 13.3.0 |
| Base do xv6 | `git://g.csail.mit.edu/xv6-labs-2024`, branch `util`, commit `79e8024d61c3dd92ccf064fc67bb99cb999f70ab` |
| Esqueleto do Uthread | `git://g.csail.mit.edu/xv6-labs-2023`, branch `thread`, commit `0d65be5d1d880afafbf08c2adb605cf9f72216e2` |

Detalhes completos no [registro do ambiente](evidencias/ambiente.txt). Os resultados esperados, observados e a reprodução independente de Gabriel estão em [comandos e resultados](evidencias/comandos-e-resultados.md).

O branch `thread` não existe em `xv6-labs-2024`, nem na imagem do professor nem no servidor do MIT. Por isso, apenas o esqueleto de `uthread.c`, `uthread_switch.S` e a regra de compilação foram tomados do `xv6-labs-2023` e aplicados sobre a base 2024. A ligação do `uthread` usa o script `user/user.ld`, o mesmo dos demais programas da versão 2024.

## Pré-requisitos

- Windows com WSL 2 (ou Linux) e Docker acessível sem `sudo`.
- Kit do professor: `xv6.sh` e `so-xv6-2024.tar`.
- Este repositório, para obter `codigo/integracao.patch`.

## Arquivos criados ou modificados no xv6

| Arquivo | Alteração |
|---|---|
| `user/proc_demo.c` | novo |
| `user/uthread.c` | novo, a partir do esqueleto do MIT |
| `user/uthread_switch.S` | novo, a partir do esqueleto do MIT |
| `Makefile` | `$U/_proc_demo` e `$U/_uthread` em `UPROGS`; regras para `uthread_switch.o` e `_uthread` |

O patch tem 4 arquivos e 390 linhas, todas inseridas. Nenhuma linha da base é removida.

## Como reproduzir

Há três ambientes, e cada comando abaixo indica o seu: o terminal do **WSL** (`wsl:...$`), o **contêiner** (`(xv6) /lab/xv6-labs-2024 $`) e o **shell do xv6** (`$`).

1. **WSL:** coloque `xv6.sh`, `so-xv6-2024.tar` e uma cópia de `codigo/integracao.patch` na mesma pasta. Em seguida, nessa pasta:
   ```bash
   bash xv6.sh
   ```
   Na primeira vez, o script carrega a imagem e cria `xv6-labs-2024` no branch `util`.
2. **Contêiner:** confira a base e aplique o patch.
   ```bash
   git log -1 --format='%H'        # deve ser 79e8024d61c3dd92ccf064fc67bb99cb999f70ab
   git status --short              # deve estar vazio
   git apply --check /lab/integracao.patch && git apply /lab/integracao.patch
   make qemu
   ```
   Se a sua cópia já tiver alterações, use uma cópia limpa em `/tmp`:
   ```bash
   git clone -q -b util /opt/xv6-labs-2024.git /tmp/xv6-limpo
   cd /tmp/xv6-limpo
   git apply /lab/integracao.patch
   make qemu
   ```
3. **xv6:** digite um comando por vez e espere o `$` voltar antes do próximo.
   ```
   proc_demo
   proc_demo pausa
   uthread
   ```
   Durante a pausa do `proc_demo pausa`, pressione `Ctrl-P` logo após a mensagem "pressione Ctrl-P agora".
4. **Sair:** no QEMU, `Ctrl-a` e depois `x`. No contêiner, `exit`.

**Cuidados**

- Digite os comandos no xv6 em vez de colá-los. Não digite nada enquanto um programa estiver imprimindo: o console do xv6 ecoa as teclas e pode produzir `exec ... failed` ou caracteres trocados.
- No Windows, salve os arquivos com fim de linha **LF**. As linhas de comando do `Makefile` precisam começar com TAB.

## Experimento 1 — Processos com fork, wait e exit

### Objetivo

Demonstrar a criação de um processo filho, a identificação por PID, o isolamento de memória entre pai e filho, o término com status conhecido e a coleta do filho pelo pai, distinguindo **terminar** de **ser coletado**.

### Lógica

- `fork()` retorna 0 no filho, o PID do filho no pai e -1 em caso de falha. A falha é tratada e encerra o programa com status 1.
- Uma variável global `valor` começa com 100. O filho a altera para 999 e termina com `exit(42)`.
- O pai coleta o filho com `wait(&status)` e confere o PID e o status. Um segundo `wait()` deve devolver -1, porque não há mais filhos.
- **Sincronização explícita.** Depois do `fork()`, a ordem de execução não é garantida (o xv6 roda com 3 CPUs), e o `printf` do xv6 escreve um caractere por vez. Para ordenar a saída sem depender do escalonador, o pai cria um pipe antes do `fork()` e fecha a sua ponta de escrita. O filho mantém a ponta de escrita aberta e nunca escreve nela. O `read()` do pai só devolve EOF quando o filho entra em `exit()` e o kernel fecha os arquivos dele. Se o pai não fechar a própria ponta de escrita, o `read()` nunca recebe EOF.
- Com o argumento `pausa`, o pai dorme cerca de 5 s (50 ticks) antes do `wait()`. Nesse intervalo, o `Ctrl-P` do console lista a tabela de processos.
- Ao final, o programa imprime `[OK]` ou `[FALHA]` para cada propriedade.

### Resultado esperado

PIDs distintos; filho com 100 → 999 e pai com 100; `wait()` devolvendo o PID do filho e `status = 42`; segundo `wait()` devolvendo -1; cinco `[OK]`; filho em estado `zombie` no `Ctrl-P` antes do `wait()`.

### Resultado observado

- Em todas as execuções, pai e filho tiveram PIDs distintos (por exemplo, pai 3 e filho 4; pai 5 e filho 6).
- O filho gravou 999 e o pai manteve 100. As três impressões mostraram o mesmo endereço virtual, `0x2000`: o endereço virtual é igual, mas cada processo tem a sua tabela de páginas e as suas páginas físicas, copiadas pelo `fork()`.
- `wait()` devolveu o PID do filho e `status = 42`; o segundo `wait()` devolveu -1. Todas as execuções terminaram com cinco `[OK]`.
- Com `Ctrl-P` antes do `wait()`: `4 zombie proc_demo` e `3 sleep proc_demo`. O filho tinha terminado, mas ainda não tinha sido coletado.
- Com `Ctrl-P` depois do `wait()`: o filho não aparecia mais na tabela. A saída do kernel se misturou à do `printf` do processo, o que ilustra a escrita caractere a caractere.
- O programa pode ser repetido sem travar, com PIDs sempre crescentes.

## Experimento 2 — Threads de usuário cooperativas (Uthread)

### Objetivo

Demonstrar duas threads dentro de um único processo, cada uma com a sua pilha. O contexto é salvo e restaurado na troca, a alternância é cooperativa (por chamadas explícitas ao escalonador da biblioteca), um contador global é compartilhado, cada thread se identifica junto com o PID do processo, e as threads terminam corretamente.

### Estruturas de dados

- `struct context`: `ra`, `sp` e `s0`–`s11`. Pela convenção de chamadas RISC-V, esses são os registradores *callee-saved*. Como a troca acontece dentro de uma chamada de função (`thread_switch`), basta preservá-los; os demais o compilador já trata como descartáveis. É o mesmo princípio do `swtch.S` do kernel.
- `struct thread`: o contexto, uma pilha própria de 8 KB, o estado (`FREE`, `RUNNABLE` ou `RUNNING`), o `tid` e o nome.
- `all_thread[4]`: a posição 0 é a `main`, que continua na pilha original do processo; as posições 1 e 2 são as threads A e B.

### Lógica

- `thread_create(func, nome)` escolhe uma posição `FREE`, faz `ra = func` e aponta `sp` para o fim da pilha da thread, alinhado a 16 bytes, já que a pilha cresce para baixo. Na primeira troca, o `ret` de `thread_switch` salta para o início de `func`, já usando essa pilha.
- `thread_switch(antigo, novo)` (assembly) grava os 14 registradores no contexto de quem sai, carrega os de quem entra e executa `ret`, que salta para o `ra` recém-carregado.
- `thread_schedule()` escolhe, em rodízio circular a partir da thread atual, a próxima `RUNNABLE`.
- `thread_yield()` marca a thread atual como `RUNNABLE` e chama o escalonador. **É o único ponto onde ocorre troca de thread.**
- `thread_exit()` marca a posição como `FREE`, decrementa o número de threads vivas e escalona outra. Uma função de thread não pode simplesmente retornar, porque não há quem a chamou para onde voltar.
- A `main` cria A e B e cede a vez em laço até que ambas terminem. Depois, verifica os resultados e encerra com `exit(0)`.
- A e B executam o mesmo código: 5 iterações, cada uma lendo o contador global, gravando o valor seguinte, imprimindo e chamando `thread_yield()`.

### Resultado esperado

O mesmo PID em todas as linhas; pilhas de A e B em faixas distintas, com a variável local de cada uma dentro da sua faixa; o contador de 0 a 10 alternando A, B, A, B; A e B terminam, e a `main` imprime cinco `[OK]`.

### Resultado observado

- Seis execuções (PIDs 3, 7 e 8 na primeira sessão; 3 e 4 na segunda; 5 na cópia limpa), todas com cinco `[OK]`.
- Pilha de A: `0x4158..0x6158`, com a variável local em `0x60FC`. Pilha de B: `0x61D8..0x81D8`, com a variável local em `0x817C`. As faixas estão separadas por `0x2080` = 8320 bytes, exatamente o tamanho de `struct thread` (112 do contexto + 8192 da pilha + 4 + 4 do estado e do tid + 8 do ponteiro do nome).
- O contador foi de 0 a 10 em alternância estrita A, B, A, B, sempre com o mesmo PID para `main`, A e B.
- A e B imprimiram "terminou", e a `main` encerrou normalmente, sem a mensagem `no runnable threads` do esqueleto original.
- Uma tentativa registrou `exec uthread failed`, com o comando digitado enquanto o programa anterior imprimia. Repetido digitando um comando por vez, não voltou a ocorrer.

### O que este experimento não demonstra

- **Modelo N:1.** O kernel vê um único processo com uma única thread de kernel. A, B e `main` existem apenas na biblioteca do programa. Elas **não executam em paralelo**, mesmo com 3 CPUs no QEMU, e não há preempção: só há troca em `thread_yield()`. Uma chamada de sistema bloqueante pararia todas as threads.
- Não são threads nativas do kernel. O xv6 não oferece `clone` nem threads de kernel para processos de usuário.
- **O contador não é uma demonstração de condição de corrida.** Como a troca só ocorre depois do incremento, o resultado é determinístico (10). Ele demonstra memória compartilhada entre threads e alternância cooperativa. Uma condição de corrida exigiria troca entre a leitura e a escrita ou execução realmente paralela.

## Reprodução a partir de cópia limpa

Dentro do contêiner, o branch `util` foi clonado da cópia embutida na imagem para `/tmp/xv6-limpo`. Em seguida, `git apply --check` confirmou o patch (`PATCH APLICAVEL`), o patch foi aplicado e o xv6 foi compilado do zero. `proc_demo` e `uthread` terminaram com todas as verificações `[OK]`. Veja o [log da reprodução limpa](evidencias/passo4-uthread-e-copia-limpa.txt) e a [captura correspondente](evidencias/capturas/passo7-copia-limpa.png).

## Limitações

- A pausa do `proc_demo pausa` é fixa (cerca de 5 s). Se o `Ctrl-P` for pressionado depois do `wait()`, o filho já não aparece como `zombie`.
- Testado apenas com a imagem `so-xv6:2024` e a base `util@79e8024`.
- A reprodução por Gabriel Alves Domingos está registrada em [reprodução independente](evidencias/reproducao-gabriel.md), com capturas dos três comandos e verificações aprovadas. O grupo confirmou a execução em cópia limpa; a data exata e o log integral dessa sessão não foram informados.

## Relação com o KernelPlay

O KernelPlay trata processos e threads por meio de simulações e terminais didáticos. Esta demonstração mostra os mesmos conceitos em execução real no xv6:

- criação por `fork()`;
- isolamento de memória;
- estados de processo, incluindo o `zombie`, visível pelo `Ctrl-P`;
- término e coleta com `exit()` e `wait()`;
- threads de usuário no modelo N:1, com troca de contexto explícita.

O conteúdo do jogo não substitui estas evidências.

## Referências

- Russ Cox, Frans Kaashoek e Robert Morris. *xv6: a simple, Unix-like teaching operating system* (book-riscv-rev4).
- MIT PDOS, xv6-riscv: https://github.com/mit-pdos/xv6-riscv
- MIT 6.1810, Lab: Multithreading: https://pdos.csail.mit.edu/6.1810/2024/labs/thread.html
- Repositórios dos laboratórios: `git://g.csail.mit.edu/xv6-labs-2024` e `git://g.csail.mit.edu/xv6-labs-2023`.
- Material da disciplina: "Virtualização, Containers e o Ambiente do xv6" e o kit `xv6.sh` / `so-xv6-2024.tar`.