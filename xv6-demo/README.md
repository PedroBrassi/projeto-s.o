# Demonstração no xv6 — em andamento

Esta pasta reúne o código, as instruções e as evidências reais da demonstração de Processos e Threads no xv6. O README final, com o roteiro completo de reprodução, será publicado ao término dos dois experimentos. Esta página registra o estado atual.

Os trechos e terminais simulados do KernelPlay são materiais didáticos e não substituem a execução real no xv6.

## Ambiente utilizado

- Windows + WSL 2 (Ubuntu 24.04.5 LTS) + Docker Engine 29.10.0
- Imagem fornecida pelo professor: `so-xv6:2024` (ID `76d830f56c1a`), aberta pelo script `xv6.sh` do kit da disciplina
- Ferramentas da imagem: QEMU 8.2.2 e `riscv64-linux-gnu-gcc`
- xv6: `git://g.csail.mit.edu/xv6-labs-2024`, branch `util`, commit `79e8024d61c3dd92ccf064fc67bb99cb999f70ab`
- O ambiente de trabalho fica em `xv6-desenvolvimento/`, ignorada pelo Git. Somente os arquivos da entrega ficam nesta pasta.

## Experimento 1 — Processos com fork, wait e exit (concluído)

### Objetivo

Demonstrar a criação de um processo filho, a identificação por PID, o isolamento de memória entre pai e filho, o término com status conhecido e a coleta do filho pelo pai.

### Arquivos

- `codigo/proc_demo.c`: programa de usuário do xv6.
- Integração: a linha `$U/_proc_demo\` foi acrescentada à lista `UPROGS` do `Makefile`. O patch completo será publicado em `codigo/integracao.patch`.

### Execução

No container do professor, em `/lab/xv6-labs-2024`, rode `make qemu`. No shell do xv6, digite:

```
proc_demo
proc_demo pausa
```

Com o argumento `pausa`, o pai espera cerca de 5 segundos antes do `wait()`. Nesse intervalo, pressione `Ctrl-P` para listar a tabela de processos. Para sair do QEMU, use `Ctrl-a` e depois `x`.

Digite os comandos no xv6 em vez de colá-los: caracteres invisíveis copiados de outras janelas podem fazer o shell não encontrar o programa (`exec ... failed`).

### Lógica

- `fork()` retorna 0 no filho, o PID do filho no pai e -1 em caso de falha. A falha é tratada e encerra o programa.
- Pai e filho imprimem o valor e o endereço da mesma variável global. O filho altera a sua cópia de 100 para 999 e termina com `exit(42)`.
- O pai coleta o filho com `wait()` e confere o PID e o status devolvidos. Um segundo `wait()` deve devolver -1, porque não há mais filhos.
- Sincronização explícita: o pai cria um pipe antes do `fork()` e fecha a sua ponta de escrita. O filho mantém a ponta de escrita aberta e nunca escreve nela. O `read()` do pai só retorna EOF quando o filho entra em `exit()` e o kernel fecha os arquivos dele. Assim, as mensagens do filho sempre aparecem antes das do pai, qualquer que seja a ordem escolhida pelo escalonador. Isso é necessário porque o `printf` do xv6 escreve um caractere por vez.
- Ao final, o programa imprime `[OK]` ou `[FALHA]` para cada propriedade verificada.

### Resultado esperado

- PIDs diferentes para pai e filho.
- O filho lê 100 e grava 999; o pai continua com 100.
- `wait()` devolve o PID do filho e `status = 42`; o segundo `wait()` devolve -1.
- Cinco verificações `[OK]` e a mensagem `TODAS AS VERIFICACOES OK`.
- Na pausa, o `Ctrl-P` mostra o filho em estado `zombie`.

### Resultado observado

- Em todas as execuções registradas, pai e filho tiveram PIDs distintos (por exemplo, pai 3 e filho 4; pai 5 e filho 6).
- O filho alterou a sua cópia para 999, e o pai manteve 100. As três impressões mostraram o mesmo endereço virtual, `0x2000`: o endereço virtual é igual, mas cada processo tem a sua própria tabela de páginas e as suas próprias páginas físicas.
- `wait()` devolveu o PID do filho e `status = 42`; o segundo `wait()` devolveu -1. Todas as execuções terminaram com cinco `[OK]`.
- Com `Ctrl-P` antes do `wait()`, a tabela mostrou `4 zombie proc_demo` e o pai `3 sleep proc_demo`: o filho já tinha terminado, mas ainda não tinha sido coletado.
- Com `Ctrl-P` depois do `wait()`, o filho já não aparecia na tabela. Nessa captura, a saída do kernel se misturou à do `printf` do processo, o que ilustra a escrita caractere a caractere no console.
- Os PIDs crescem a cada execução, e o programa pode ser repetido sem travar.

### Evidências

- `evidencias/passo3-proc_demo.txt`: sessão gravada com o comando `script`, sem os códigos de cor do terminal.
- `evidencias/capturas/passo3-ctrlp-zombie.png`: `Ctrl-P` antes do `wait()`, com o filho em estado `zombie`.
- `evidencias/capturas/passo3-ctrlp-apos-wait.png`: `Ctrl-P` depois do `wait()`, com o filho já fora da tabela.

## Experimento 2 — Threads de usuário cooperativas (pendente)

Será baseado no laboratório Uthread do MIT 6.1810. O branch `thread` não existe em `xv6-labs-2024`, nem na imagem do professor nem no servidor do MIT. Por isso, o esqueleto vem de `git://g.csail.mit.edu/xv6-labs-2023`, branch `thread`, commit `0d65be5d1d880afafbf08c2adb605cf9f72216e2`, aplicado sobre a base `xv6-labs-2024` registrada acima.

O experimento representa threads de usuário no modelo N:1: várias threads dentro de um único processo, com alternância cooperativa. Ele não demonstra paralelismo em vários núcleos nem implementa threads nativas do kernel.

## Pendências

- Implementar, executar e registrar o experimento de threads.
- Gerar `codigo/integracao.patch` em relação à base registrada.
- Escrever o README final, com o roteiro completo de reprodução.
- Reproduzir os experimentos a partir de uma cópia limpa da base.

## Referências

- MIT PDOS, xv6: https://github.com/mit-pdos/xv6-riscv
- MIT 6.1810, Lab Multithreading: https://pdos.csail.mit.edu/6.1810/2024/labs/thread.html
- Cox, Kaashoek e Morris, *xv6: a simple, Unix-like teaching operating system* (book-riscv-rev4)