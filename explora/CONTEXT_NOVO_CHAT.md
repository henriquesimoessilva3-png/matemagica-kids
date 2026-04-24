# Contexto para novo chat — EXPLORA

Cole isto no início da nova conversa (ou simplesmente mande a primeira linha — o Claude vai ler a memória `project_explora_app.md` automaticamente):

---

## Prompt curto (use este)

> Continuando o app **EXPLORA** (pasta `/Users/henriquesimoessilva/Meu Drive/arquivos pessoais/Novos Negocios/Historiando/`). Ver memória `project_explora_app.md` pra contexto completo. Pendente: adicionar 7 jogos novos (tipos VF, cloze, memória) no array `JOGOS` de `ano_4.html` — os ids já estão registrados nos `CAPS` mas os objetos não existem. Motor e CSS desses 3 tipos já estão prontos em `explora_shared.js` e `historia_shared.css`.

---

## Prompt completo (caso queira colar tudo)

> Vamos retomar o **EXPLORA**, app PWA educacional de História e Geografia (BNCC, 4º ano).
>
> **Pasta:** `/Users/henriquesimoessilva/Meu Drive/arquivos pessoais/Novos Negocios/Historiando/`
> **Servidor:** preview "explora" na porta 8222
>
> **Estado:**
> - 4º ano COMPLETO com ~496 perguntas, 7 capítulos (3 História + 4 Geografia)
> - 25 jogos entre quizzes (21-25 perguntas cada), classif (7-9 rodadas), ordenar linha do tempo (13 rodadas)
> - Modo Prova funcionando: SOS, Minhas Provas, Editor
> - 3 tipos novos recém-implementados no motor (`explora_shared.js`): **vf** (verdadeiro/falso), **cloze** (completar lacuna), **memoria** (pares)
> - CSS dos 3 tipos novos em `historia_shared.css`
>
> **Última tarefa interrompida:**
> Adicionar 7 jogos novos no array `JOGOS` em `ano_4.html` (os ids já foram registrados nos CAPS):
> - `memoria_ancestrais` (cap h1)
> - `vf_prehistoria` (cap h2)
> - `cloze_brasil_prehist` (cap h3)
> - `memoria_cardeais` (cap g1)
> - `vf_terra` (cap g2)
> - `cloze_mapas` (cap g3)
> - `memoria_regioes` (cap g4)
>
> Inserir antes do `\n];` final do array JOGOS (linha ~4714). Cada jogo com 8-10 perguntas, distribuindo fácil/médio/difícil. Seguir o padrão de distratores plausíveis (mesmo campo semântico, tamanho similar).
>
> **Regras importantes (feedback do usuário):**
> 1. Sem copyright — nada de personagens do livro (Lita, Tude, Lito, Tata)
> 2. Distratores plausíveis, NÃO absurdos. Mesmo tamanho da resposta certa.
> 3. Linguagem clara para 4º ano, sem abreviações.
>
> Pode começar criando os 7 jogos novos.

---

## O que tem nesta memória
A memória `project_explora_app.md` (já indexada em `MEMORY.md`) tem tudo sobre:
- Estrutura de pastas e arquivos
- Arquitetura de CAPS/JOGOS no ano_4
- Tipos de jogo implementados (motor)
- Como `provas.html` carrega dados de cada ano_N
- Estatísticas de perguntas atuais
- Estrutura de dados exata para cada tipo novo
- Feedback qualitativo do usuário
- Como retomar (servidor, cache-bust etc)

## Só para ter em mente
- `ano_4.html` está com ~4.700 linhas; pode ficar pesado para contexto. O foco do novo chat é só adicionar os 7 jogos, então não precisa carregar o arquivo inteiro — basta inserir antes do `\n];` final.
- Se quiser contar perguntas: abrir preview 8222, console, rodar `carregarAno(4, () => console.log(JOGOS_POR_ANO[4].length))`.
