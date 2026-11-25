# Como contribuir

## Primeiro acesso

1. Envie seu usuário do GitHub ao responsável pelo repositório e aceite o convite de colaboração.
2. Baixe ou clone o repositório. Para enviar pelo navegador, abra a pasta correta e use **Add file → Upload files**.

## Onde colocar sua parte

| Material | Pasta |
|---|---|
| Site do simulador | `kernelPlay/` |
| Textos das trilhas | `docs/trilhas/` |
| Justificativa em Markdown, Word e PDF | `docs/justificativa/` |
| Documentação de desenvolvimento em Markdown, Word e PDF | `docs/desenvolvimento/` |
| Código da demonstração xv6 | `xv6-demo/codigo/` |
| Capturas e saídas reais do xv6 | `xv6-demo/evidencias/` |
| Slides editáveis e PDF | `apresentacao/` |
| Imagens e proposta visual | `design/` |

## Envio e revisão

1. Atualize sua cópia com a versão principal antes de começar.
2. Crie uma branch por tarefa, por exemplo `docs/justificativa`, `feat/demo-xv6` ou `docs/slides-linux`.
3. Faça alterações apenas nos arquivos relacionados à sua tarefa. Evite duas pessoas editando o mesmo arquivo de apresentação simultaneamente.
4. Envie a branch e abra um pull request explicando o que mudou e como verificou. Pelo navegador, escolha criar uma nova branch ao salvar.
5. Peça revisão a outro integrante antes de incorporar à `main`, pois ela pode alimentar o site publicado.
6. Atualize o planejamento e, após revisão, os materiais finais no Padlet.

## Cuidados com as entregas

- Use nomes descritivos, sem espaços ou acentos, como `justificativa-tecnica.pdf` e `processos-threads-linux.pdf`.
- Guarde a fonte editável junto do PDF. O repositório ignora arquivos ZIP; envie os arquivos extraídos nas pastas certas.
- Ao revisar um documento, mantenha Markdown, Word e PDF com o mesmo conteúdo e a mesma data de revisão. Nos documentos finais, mantenha a fonte preta, inclusive nos títulos e links, preservando os hiperlinks clicáveis.
- Registre prompts de IA realmente usados e identifique o agente; informe a versão do modelo apenas quando houver registro verificável. A análise das heurísticas deve citar exemplos e limites, sem atribuir testes com usuários que não ocorreram.
- Registre comandos e saídas realmente executados no xv6, incluindo a versão utilizada. Separe resultado esperado de resultado observado.
- Ao alterar o site, confira abertura, trilha de processos, imagens e modo apresentação. Preserve `kernelPlay/` e o redirecionamento da raiz.
- Não envie senhas, chaves, arquivos pessoais ou instalações completas de ferramentas.

## Conferência antes do envio

- Confira os links internos dos READMEs e mantenha a situação das entregas alinhada ao [planejamento](docs/planejamento.md).
- Para alterações nas regras ou na integração do minigame, execute `node tests/escalonador.cjs` na raiz do repositório. Alterações apenas nos READMEs exigem conferência do texto e dos links.
- Para documentos, abra o Word e o PDF e confira paginação, tabelas e referências. A [justificativa](docs/justificativa/README.md) e a [documentação de desenvolvimento](docs/desenvolvimento/README.md) indicam os arquivos finais.
- Enviar uma branch não a integra automaticamente à `main` nem publica os anexos no Padlet. Confirme a integração e a publicação de cada entrega antes de marcá-la como concluída.
