	.text

	/*
	 * void thread_switch(uint64 antigo, uint64 novo)
	 *
	 * a0 = endereco do contexto da thread que SAI
	 * a1 = endereco do contexto da thread que ENTRA
	 *
	 * Salva ra, sp e s0-s11 (registradores callee-saved da convencao
	 * RISC-V) em *a0 e carrega os mesmos registradores de *a1.
	 * Os deslocamentos seguem a struct context de uthread.c.
	 */

	.globl thread_switch
thread_switch:
	/* salva o contexto da thread atual */
	sd ra, 0(a0)
	sd sp, 8(a0)
	sd s0, 16(a0)
	sd s1, 24(a0)
	sd s2, 32(a0)
	sd s3, 40(a0)
	sd s4, 48(a0)
	sd s5, 56(a0)
	sd s6, 64(a0)
	sd s7, 72(a0)
	sd s8, 80(a0)
	sd s9, 88(a0)
	sd s10, 96(a0)
	sd s11, 104(a0)

	/* restaura o contexto da proxima thread */
	ld ra, 0(a1)
	ld sp, 8(a1)
	ld s0, 16(a1)
	ld s1, 24(a1)
	ld s2, 32(a1)
	ld s3, 40(a1)
	ld s4, 48(a1)
	ld s5, 56(a1)
	ld s6, 64(a1)
	ld s7, 72(a1)
	ld s8, 80(a1)
	ld s9, 88(a1)
	ld s10, 96(a1)
	ld s11, 104(a1)

	ret	/* salta para ra: onde a proxima thread parou (ou o inicio da sua funcao) */