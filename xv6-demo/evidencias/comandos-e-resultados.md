# Comandos e resultados

Registro das verificações da demonstração no xv6. As saídas completas estão nos arquivos `.txt` desta pasta, gravados com o comando `script` (códigos de cor removidos).

Ambiente: ver `ambiente.txt`. Base: `xv6-labs-2024`, branch `util`, commit `79e8024`.

## Sessões registradas

| Data | Arquivo | Conteúdo |
|---|---|---|
| 2026-11-23 | `passo3-proc_demo.txt` | `proc_demo` e `proc_demo pausa` com Ctrl-P |
| 2026-11-23 | `passo4-uthread-e-copia-limpa.txt` | compilação do `uthread`, execuções de `uthread` e `proc_demo`, reprodução em cópia limpa |

Em 2026-11-20, antes de qualquer alteração, o xv6 original (`util@79e8024`) foi compilado e iniciado com `make qemu`: boot com 3 harts, `init: starting sh` e `ls` listando os programas padrão. Essa sessão não foi gravada em arquivo.

## Comandos

| Ambiente | Comando | Finalidade |
|---|---|---|
| WSL | `script -q logs/<arquivo>.txt -c "bash xv6.sh"` | abrir o contêiner gravando a sessão |
| Contêiner | `make qemu` | compilar e iniciar o xv6 |
| xv6 | `proc_demo` / `proc_demo pausa` + Ctrl-P | experimento 1 |
| xv6 | `uthread` | experimento 2 |
| QEMU | `Ctrl-a` `x` | sair do xv6 |
| Contêiner | `git add -N user/proc_demo.c user/uthread.c user/uthread_switch.S` e `git diff util > /lab/integracao.patch` | gerar o patch |
| Contêiner | `git clone -q -b util /opt/xv6-labs-2024.git /tmp/xv6-limpo`, `git apply --check`, `git apply`, `make qemu` | reprodução limpa |

## Verificações

| # | Verificação | Esperado | Observado | Situação |
|---|---|---|---|---|
| 1 | Criação do filho e PIDs distintos | `fork()` retorna 0 no filho e o PID do filho no pai | pai 3/filho 4, pai 5/filho 6 | ✅ |
| 2 | Isolamento de memória | filho 100 → 999; pai continua 100 | conforme esperado, mesmo endereço virtual `0x2000` | ✅ |
| 3 | PID e status do `wait()` | PID do filho e `status = 42`; segundo `wait()` = -1 | conforme esperado em todas as execuções | ✅ |
| 4 | Terminar ≠ ser coletado | filho `zombie` antes do `wait()`; ausente depois | `4 zombie proc_demo`; ausente após o `wait()` (capturas) | ✅ |
| 5 | Duas threads no mesmo processo | mesmo PID para `main`, A e B | mesmo PID em todas as linhas | ✅ |
| 6 | Pilhas próprias | variável local na faixa da própria pilha | A `0x60FC` em `0x4158..0x6158`; B `0x817C` em `0x61D8..0x81D8` | ✅ |
| 7 | Alternância cooperativa e contador | A, B, A, B; contador 0 → 10 | conforme esperado | ✅ |
| 8 | Encerramento correto | A e B terminam; `main` encerra com cinco `[OK]` | conforme esperado | ✅ |
| 9 | Repetição sem travamento | execuções seguidas funcionam | 6× `uthread` e várias `proc_demo` sem travar | ✅ |
| 10 | Reprodução em cópia limpa | patch aplicável; compila do zero; mesmos resultados | `PATCH APLICAVEL`; compilação completa; ambos `[OK]` | ✅ |
| 11 | Reprodução por outro integrante | seguir o README e obter os mesmos resultados | — | ⏳ pendente |

## Ocorrências registradas

- `exec proc_demo failed` e `exec uthread failed`: comandos colados ou digitados enquanto outro programa imprimia. Repetidos digitando um comando por vez, funcionaram.
- Em uma execução do `proc_demo pausa`, o Ctrl-P foi pressionado depois do `wait()`. Essa tentativa virou a captura `passo3-ctrlp-apos-wait.png`.