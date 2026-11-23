// uthread.c - Threads de usuario cooperativas no xv6 (modelo N:1).
// Projeto Integrador de Sistemas Operacionais - Grupo 3 (Processos e Threads)
//
// Base: esqueleto do laboratorio "Multithreading" do MIT 6.1810
//       (git://g.csail.mit.edu/xv6-labs-2023, branch thread, commit 0d65be5).
// Adaptacoes: contexto por thread, thread_exit(), thread main que espera
// as demais, contador compartilhado, identificacao e verificacoes.
//
// Uso no shell do xv6:  uthread

#include "kernel/types.h"
#include "kernel/stat.h"
#include "user/user.h"

/* Estados possiveis de uma thread */
#define FREE        0x0
#define RUNNING     0x1
#define RUNNABLE    0x2

#define STACK_SIZE  8192
#define MAX_THREAD  4
#define ITERACOES   5            // incrementos feitos por cada thread

// Registradores preservados na troca de contexto.
// Pela convencao de chamadas RISC-V, ra, sp e s0-s11 sao callee-saved:
// quem chama thread_switch() espera encontra-los intactos no retorno.
// Os demais (a0-a7, t0-t6) o compilador ja trata como descartaveis.
// A ORDEM dos campos define os deslocamentos usados em uthread_switch.S.
struct context {
  uint64 ra;    //   0  endereco de retorno: onde a thread continua
  uint64 sp;    //   8  topo da pilha da thread
  uint64 s0;    //  16
  uint64 s1;    //  24
  uint64 s2;    //  32
  uint64 s3;    //  40
  uint64 s4;    //  48
  uint64 s5;    //  56
  uint64 s6;    //  64
  uint64 s7;    //  72
  uint64 s8;    //  80
  uint64 s9;    //  88
  uint64 s10;   //  96
  uint64 s11;   // 104
};

struct thread {
  struct context context;            // registradores salvos enquanto a thread nao roda
  char           stack[STACK_SIZE];  // pilha propria da thread
  int            state;              // FREE, RUNNING ou RUNNABLE
  int            tid;                // identificador: posicao em all_thread
  char          *nome;
};

struct thread all_thread[MAX_THREAD];
struct thread *current_thread;
extern void thread_switch(uint64 antigo, uint64 novo);   // em uthread_switch.S

// Dados globais: ficam no segmento de dados do processo e sao
// compartilhados por todas as threads.
int contador = 0;                 // contador compartilhado
int vivas = 0;                    // threads criadas que ainda nao terminaram
int ordem[2 * ITERACOES];         // tid de quem fez cada incremento
int pid_visto[MAX_THREAD];        // PID observado por cada thread
int pilha_ok[MAX_THREAD];         // 1 se a variavel local estava na pilha da thread

void
thread_init(void)
{
  // main() passa a ser a thread 0 e continua na pilha original do processo.
  current_thread = &all_thread[0];
  current_thread->state = RUNNING;
  current_thread->tid = 0;
  current_thread->nome = "main";
}

void
thread_schedule(void)
{
  struct thread *t, *next_thread;

  /* Procura a proxima thread RUNNABLE, em rodizio a partir da atual. */
  next_thread = 0;
  t = current_thread + 1;
  for(int i = 0; i < MAX_THREAD; i++){
    if(t >= all_thread + MAX_THREAD)
      t = all_thread;
    if(t->state == RUNNABLE) {
      next_thread = t;
      break;
    }
    t = t + 1;
  }

  if (next_thread == 0) {
    printf("thread_schedule: no runnable threads\n");
    exit(-1);
  }

  if (current_thread != next_thread) {
    next_thread->state = RUNNING;
    t = current_thread;
    current_thread = next_thread;
    // Salva os registradores de t e carrega os de next_thread.
    // Para t, esta chamada so "retorna" quando ela for escalonada de novo.
    thread_switch((uint64)&t->context, (uint64)&next_thread->context);
  } else {
    // A unica thread pronta e a propria atual: ela continua executando.
    next_thread->state = RUNNING;
  }
}

int
thread_create(void (*func)(), char *nome)
{
  struct thread *t;

  for (t = all_thread; t < all_thread + MAX_THREAD; t++) {
    if (t->state == FREE) break;
  }
  if (t == all_thread + MAX_THREAD)
    return -1;                                   // nao ha posicao livre

  memset(&t->context, 0, sizeof(t->context));
  // Na primeira troca para esta thread, o "ret" de thread_switch salta
  // para ra, isto e, para o inicio de func, ja usando a pilha propria.
  t->context.ra = (uint64)func;
  // A pilha cresce para baixo: sp comeca no fim do vetor, alinhado
  // a 16 bytes como exige a ABI RISC-V.
  t->context.sp = (uint64)(t->stack + STACK_SIZE) & ~(uint64)0xF;
  t->tid = t - all_thread;
  t->nome = nome;
  t->state = RUNNABLE;
  vivas++;
  return t->tid;
}

void
thread_yield(void)
{
  // Cessao EXPLICITA da CPU: o unico ponto em que ocorre troca de thread.
  current_thread->state = RUNNABLE;
  thread_schedule();
}

// Encerra a thread atual e nunca retorna. A funcao de uma thread nao
// pode simplesmente dar "return": nao existe quem a chamou para onde voltar.
void
thread_exit(void)
{
  printf("[pid %d | thread %s (tid %d)] terminou\n",
         getpid(), current_thread->nome, current_thread->tid);
  current_thread->state = FREE;
  vivas--;
  thread_schedule();
}

// Corpo executado pelas threads A e B: mesmo codigo, pilhas diferentes.
void
trabalho(void)
{
  struct thread *eu = current_thread;
  int local = 0;                                 // vive na pilha DESTA thread
  int pid = getpid();

  pid_visto[eu->tid] = pid;
  pilha_ok[eu->tid] = (char *)&local >= eu->stack &&
                      (char *)&local <  eu->stack + STACK_SIZE;
  printf("[pid %d | thread %s (tid %d)] iniciou; variavel local em %p, pilha %p..%p\n",
         pid, eu->nome, eu->tid, &local, eu->stack, eu->stack + STACK_SIZE);

  for (int i = 1; i <= ITERACOES; i++) {
    int lido = contador;                         // le o valor compartilhado
    ordem[lido] = eu->tid;                       // registra quem fez este incremento
    contador = lido + 1;                         // grava o novo valor
    printf("[pid %d | thread %s (tid %d)] iteracao %d: contador %d -> %d; cedendo a vez\n",
           pid, eu->nome, eu->tid, i, lido, contador);
    thread_yield();
  }
  thread_exit();
}

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
  int pid = getpid();
  int falhas = 0;

  thread_init();
  printf("[pid %d | thread main (tid 0)] criando as threads A e B\n", pid);
  if (thread_create(trabalho, "A") < 0 || thread_create(trabalho, "B") < 0) {
    printf("[pid %d] erro: nao ha posicao livre para criar thread\n", pid);
    exit(1);
  }

  // A main tambem coopera: cede a vez ate que A e B terminem.
  while (vivas > 0)
    thread_yield();

  printf("[pid %d | thread main (tid 0)] A e B terminaram; contador final = %d\n", pid, contador);
  printf("[pid %d | thread main (tid 0)] verificacoes:\n", pid);

  int alterna = 1;
  for (int k = 0; k + 1 < 2 * ITERACOES; k++)
    if (ordem[k] == ordem[k + 1])
      alterna = 0;

  falhas += confere("contador final = 2 x ITERACOES (10)", contador == 2 * ITERACOES);
  falhas += confere("A e B terminaram (vivas = 0 e posicoes FREE)",
                    vivas == 0 && all_thread[1].state == FREE && all_thread[2].state == FREE);
  falhas += confere("A e B executaram no mesmo processo (mesmo PID da main)",
                    pid_visto[1] == pid && pid_visto[2] == pid);
  falhas += confere("cada thread usou a sua propria pilha", pilha_ok[1] && pilha_ok[2]);
  falhas += confere("os incrementos alternaram entre A e B", alterna);

  printf("[pid %d | thread main (tid 0)] resultado: %s\n",
         pid, falhas == 0 ? "TODAS AS VERIFICACOES OK" : "HOUVE FALHAS");
  exit(falhas == 0 ? 0 : 1);
}