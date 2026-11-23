// proc_demo.c - Demonstracao de processos no xv6: fork, getpid, exit e wait.
// Projeto Integrador de Sistemas Operacionais - Grupo 3 (Processos e Threads)
//
// Uso no shell do xv6:
//   proc_demo          execucao normal
//   proc_demo pausa    pausa antes do wait() para observar o filho "zombie" com Ctrl-P

#include "kernel/types.h"
#include "kernel/stat.h"
#include "user/user.h"

#define VALOR_INICIAL   100   // valor da variavel antes do fork
#define VALOR_DO_FILHO  999   // valor que o filho grava na sua copia
#define STATUS_FILHO    42    // status de termino conhecido do filho
#define TICKS_PAUSA     50    // ~5 s no QEMU (1 tick ~ 0,1 s)

// Variavel global: fica no segmento de dados do processo.
// Apos o fork, pai e filho tem cada um a sua copia.
int valor = VALOR_INICIAL;

// Imprime [OK] ou [FALHA] e devolve 1 em caso de falha.
static int
confere(char *descricao, int condicao)
{
  printf("  [%s] %s\n", condicao ? "OK" : "FALHA", descricao);
  return condicao ? 0 : 1;
}

int
main(int argc, char *argv[])
{
  int pausa = (argc > 1 && strcmp(argv[1], "pausa") == 0);
  int pid_pai = getpid();
  int fds[2];          // fds[0] = leitura, fds[1] = escrita
  int falhas = 0;

  printf("[pai %d] inicio: valor = %d (endereco virtual %p)\n", pid_pai, valor, &valor);

  // Pipe criado ANTES do fork: pai e filho herdam as duas pontas.
  // Ele sera usado apenas como sinal: EOF = "o filho entrou em exit()".
  if(pipe(fds) < 0){
    printf("[pai %d] erro: pipe() falhou\n", pid_pai);
    exit(1);
  }

  int pid = fork();

  if(pid < 0){
    // Falha na criacao: nao existe filho.
    printf("[pai %d] erro: fork() falhou\n", pid_pai);
    close(fds[0]);
    close(fds[1]);
    exit(1);
  }

  if(pid == 0){
    // ---------------- FILHO ----------------
    // fork() retorna 0 no filho.
    close(fds[0]);                 // o filho nao le; mantem so a ponta de escrita
    int meu_pid = getpid();

    printf("[filho %d] fork() retornou 0 para mim\n", meu_pid);
    printf("[filho %d] valor herdado = %d (endereco virtual %p)\n", meu_pid, valor, &valor);
    valor = VALOR_DO_FILHO;        // altera somente a copia do filho
    printf("[filho %d] alterei a minha copia: valor = %d\n", meu_pid, valor);
    printf("[filho %d] chamando exit(%d)\n", meu_pid, STATUS_FILHO);

    exit(STATUS_FILHO);            // o kernel fecha fds[1] -> o pai recebe EOF
  }

  // ---------------- PAI ----------------
  // fork() retorna ao pai o PID do filho.
  close(fds[1]);                   // ESSENCIAL: senao o read() nunca recebe EOF

  char c;
  while(read(fds[0], &c, 1) > 0)   // bloqueia ate o filho fechar a ponta de escrita
    ;
  close(fds[0]);

  printf("[pai %d] fork() retornou %d (PID do filho)\n", pid_pai, pid);
  printf("[pai %d] o filho entrou em exit(), mas ainda nao foi coletado por wait()\n", pid_pai);

  if(pausa){
    printf("[pai %d] pressione Ctrl-P agora: o filho %d deve aparecer como zombie\n", pid_pai, pid);
    sleep(TICKS_PAUSA);
  }

  int status = -1;
  int coletado = wait(&status);    // recolhe o filho e libera sua entrada na tabela
  printf("[pai %d] wait() retornou pid = %d, status = %d\n", pid_pai, coletado, status);
  printf("[pai %d] o meu valor continua = %d (endereco virtual %p)\n", pid_pai, valor, &valor);

  int de_novo = wait(0);           // nao ha mais filhos: deve retornar -1

  printf("[pai %d] verificacoes:\n", pid_pai);
  falhas += confere("fork() criou um filho com PID diferente do pai", pid > 0 && pid != pid_pai);
  falhas += confere("wait() devolveu o PID do filho criado", coletado == pid);
  falhas += confere("wait() devolveu o status passado ao exit() do filho", status == STATUS_FILHO);
  falhas += confere("a variavel do pai permaneceu com o valor inicial", valor == VALOR_INICIAL);
  falhas += confere("um segundo wait() retorna -1 (filho ja coletado)", de_novo == -1);

  printf("[pai %d] resultado: %s\n", pid_pai, falhas == 0 ? "TODAS AS VERIFICACOES OK" : "HOUVE FALHAS");
  exit(falhas == 0 ? 0 : 1);
}
