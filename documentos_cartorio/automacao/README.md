# Automação — Transcrição em Escala via API

Pipeline para processar **80-100 mil imagens** de registros manuscritos chamando a Claude API (vision).

## Pré-requisitos

```bash
pip install anthropic pillow tqdm
export ANTHROPIC_API_KEY=sk-ant-...
```

Tools de sistema:
- `pdfimages` (poppler-utils) — extração de imagens dos PDFs
- (opcional) `pandoc` — geração de .docx

## Fluxo

```
pdfs/                    ← entrada (PDFs do cartório)
   ↓ batch_transcribe.py
imagens/<stem>/          ← cache de extrações
   ↓
html/<stem>.html         ← saída legível
notas/<stem>.json        ← saída estruturada
checkpoints/             ← controle de retomada
logs/                    ← log estruturado por execução
glossario.md             ← atualizado incrementalmente
```

## Comandos

```bash
# Modo dry-run: mostra o que seria processado
python batch_transcribe.py --dry-run

# Processar todos os pendentes
python batch_transcribe.py

# Processar apenas N
python batch_transcribe.py --limit 50

# Retomar interrompido
python batch_transcribe.py --resume

# Reprocessar mesmo que exista output
python batch_transcribe.py --force

# Dupla passagem (QA opcional)
python batch_transcribe.py --double-pass
```

## Custo estimado (Claude Sonnet 4.6 com vision)

- Entrada: ~1500 tokens por imagem (1240px largura, comprimida) + glossário (~3k tokens) = ~4500 tokens/doc
- Saída: ~2000 tokens (HTML+JSON estruturados)
- Custo aproximado: ~US$ 0,02/doc → **US$ 2.000 para 100k imagens** em single-pass
- Com prompt caching: pode cair para ~US$ 1.000

## QA (opções a decidir)

- **single-pass + score**: cada doc retorna confiança 0-1; abaixo do limiar vai para fila de revisão
- **double-pass**: 2 leituras independentes; divergências viram incertezas
- **batch + amostragem**: 100% single-pass + revisão humana de 5% aleatório

## Limitações conhecidas

- **Caligrafia muito danificada**: imagens com tinta apagada/papel manchado podem retornar incertezas em massa
- **Documentos pré-1900**: ortografia pré-reforma de 1911 pode confundir o modelo; pré-tunar prompt com exemplos da época
- **Multi-página**: registros que ocupam 3-4 imagens precisam ser identificados (heurística: imagens consecutivas com mesmo número de registro no cabeçalho)
