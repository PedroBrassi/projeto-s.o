# Grupo 3 — Processos e Threads

Projeto Integrador de Sistemas Operacionais, organizado em três entregas: simulador educativo KernelPlay, demonstração prática no xv6 e comparação com um sistema operacional atual.

## Links

- [Jogar KernelPlay](https://pedrobrassi.github.io/projeto-s.o/kernelPlay/)
- [Modo apresentação](https://pedrobrassi.github.io/projeto-s.o/kernelPlay/?apresentacao)
- [Padlet do grupo](https://padlet.com/pedroluccas2/grupo-3-processos-e-threads-s024zwdrjwwsaqd4z88l)
- [Repositório](https://github.com/PedroBrassi/projeto-s.o)

## Estrutura

```text
projeto-s.o/
├── index.html                 # entrada do site; redireciona para kernelPlay/
├── kernelPlay/                # site publicado: HTML, CSS, JS e imagens
├── docs/
│   ├── planejamento.md        # entregas, responsáveis, prazos e situação
│   ├── trilhas/               # material educativo em Markdown
│   └── justificativa/         # texto editável e PDF final, quando concluídos
├── xv6-demo/                  # demonstração real no xv6: README, código, patch e evidências
│   ├── codigo/                # proc_demo.c, uthread.c, uthread_switch.S, integracao.patch
│   └── evidencias/            # ambiente, comandos e resultados, logs e capturas
├── apresentacao/              # fontes editáveis e PDF sobre SO atual
├── design/                    # proposta visual e imagens originais
└── CONTRIBUTING.md            # como colaborar
```

## Situação das entregas

| Entrega | Situação | Local |
|---|---|---|
| KernelPlay | Implementado; conteúdo revisado em 23/11/2026; revisão funcional conjunta pendente | [Site e documentação](kernelPlay/README.md) |
| Justificativa técnica | Word, Markdown e PDF gerados; revisão do grupo e publicação no Padlet pendentes | [Documentos](docs/justificativa/README.md) |
| Demonstração no xv6 | Processos (`fork`/`wait`/`exit`) e threads de usuário (`uthread`, modelo N:1) implementados e executados no `xv6-labs-2024` (`util@79e8024`), com patch reproduzido em cópia limpa; reprodução pela equipe de testes e publicação no Padlet pendentes | [Roteiro, código e evidências](xv6-demo/README.md) |
| SO atual | Primeira versão dos slides sobre Linux produzida no Canva (15 slides); correções, referências, comparação com KernelPlay e xv6 e envio da fonte editável + PDF pendentes | [Orientações](apresentacao/README.md) |
| Padlet | Identificação, quatro colunas, link do simulador e modelo de avaliações preparados | Link acima |

O conteúdo didático sobre xv6 dentro do jogo não comprova a execução da demonstração prática; as evidências reais estão em [`xv6-demo/evidencias/`](xv6-demo/evidencias/comandos-e-resultados.md).

Responsáveis e situação detalhada: [planejamento](docs/planejamento.md).

## Documentação da plataforma

- [Desenvolvimento completo em Markdown](docs/desenvolvimento/documentacao-desenvolvimento.md), [Word](docs/desenvolvimento/documentacao-desenvolvimento.docx) e [PDF](docs/desenvolvimento/documentacao-desenvolvimento.pdf): arquitetura, conteúdo, algoritmos, decisões, histórico, validação e manutenção.
- [Justificativa técnica](docs/justificativa/README.md): os quatro pontos da entrega, com enfoque em Processos e Threads.
- [Seja o Escalonador](docs/Minigame_Escalonador.md): minigame finalizado e integrado à versão `9989806`.

## Executar o site

Abra `kernelPlay/index.html` no navegador. O jogo usa HTML, CSS e JavaScript puro e não exige instalação de dependências.

O arquivo `index.html` da raiz mantém a entrada do GitHub Pages. A pasta `kernelPlay/` foi preservada. Após a renomeação do repositório para `projeto-s.o`, o endereço público passou a ser `https://pedrobrassi.github.io/projeto-s.o/kernelPlay/`. Atualize os links compartilhados anteriormente com `/kernel-play/`. Alterações locais só aparecem online depois de enviadas ao GitHub e publicadas.

## Trabalho em equipe

Leia [como contribuir](CONTRIBUTING.md) e registre a divisão em [planejamento](docs/planejamento.md). Mantenha os arquivos editáveis junto dos PDFs finais. Publique no Padlet apenas materiais revisados, identificando pendências com clareza.

## Integrantes — 7

- Ana Flávia dos Santos Peixoto
- Aurélio Junior
- Gabriel Alves Domingos
- Guilherme Gouvêa da Silva
- Pedro Brassi Luccas
- Pedro Lima
- Victor Orlando Avelar

## Créditos

- xv6: MIT PDOS, licença MIT — https://github.com/mit-pdos/xv6-riscv
- Mascote: ilustrações geradas com IA a partir da proposta visual do grupo.

## Revisão de conteúdo em 23/11/2026

As correções conceituais e os exemplos revisados estão descritos em [revisão do conteúdo](docs/revisao-conteudo-2026-11-23.md). Os documentos de desenvolvimento e justificativa de 19/11 identificam uma versão histórica; o estado atual da demonstração está em [xv6-demo](xv6-demo/README.md).
