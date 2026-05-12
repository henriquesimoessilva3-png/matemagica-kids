#!/usr/bin/env python3
"""Pipeline de transcricao em escala via Claude API (vision).

Uso:
  python batch_transcribe.py [--dry-run] [--limit N] [--resume] [--force]
                              [--double-pass] [--model MODEL]

Pre-requisitos:
  pip install anthropic pillow tqdm
  export ANTHROPIC_API_KEY=sk-ant-...
  apt install poppler-utils

Estrutura esperada:
  documentos_cartorio/
    pdfs/              PDFs originais (entrada)
    imagens/<stem>/    cache de extracoes (overview, grid, bandas)
    html/<stem>.html   saida legivel
    notas/<stem>.json  saida estruturada
    checkpoints/       JSON de progresso (1 por execucao)
    logs/              logs estruturados
    glossario.md       referencia (entrada para o prompt)
"""

from __future__ import annotations

import argparse
import base64
import json
import os
import subprocess
import sys
import time
from dataclasses import dataclass, asdict
from datetime import datetime
from pathlib import Path
from typing import Optional

try:
    import anthropic
except ImportError:
    print("Instale: pip install anthropic", file=sys.stderr)
    sys.exit(1)

try:
    from PIL import Image
except ImportError:
    print("Instale: pip install pillow", file=sys.stderr)
    sys.exit(1)


# ----- Configuracao -----

ROOT = Path(__file__).parent.parent
PDFS_DIR = ROOT / "pdfs"
IMG_DIR = ROOT / "imagens"
HTML_DIR = ROOT / "html"
JSON_DIR = ROOT / "notas"
CHK_DIR = ROOT / "checkpoints"
LOG_DIR = ROOT / "logs"
GLOSSARIO = ROOT / "glossario.md"

DEFAULT_MODEL = "claude-sonnet-4-6"  # vision-capable, balanced cost/quality
MAX_IMAGE_WIDTH = 2000  # px; redimensiona se maior


# ----- Prompt -----

SYSTEM_PROMPT = """\
Voce e um especialista em paleografia brasileira do seculo XX. Sua tarefa e transcrever
documentos manuscritos de livros de registro de imoveis da comarca de Ferros (Minas Gerais),
periodo 1890-1976, escritos em caligrafia cursiva em portugues antigo.

REGRAS RIGIDAS:
1. PRESERVE A ORTOGRAFIA ORIGINAL. Nunca modernize. Mantenha "commum", "districto",
   "municipio" sem acento, "corego" sem rr, "transcricoes" como esta, etc. Se o escrivao
   errou, preserve o erro.
2. NAO INVENTE LETRAS. Se uma palavra esta parcialmente cortada ou ilegivel, marque com
   [?] no lugar das letras ausentes ou [ilegivel] para palavras totalmente ilegiveis.
3. MARQUE INCERTEZAS:
   - palavra de leitura provavel mas duvidosa: envolva em <span class="incerto"
     title="justificativa">palavra</span> no HTML, ou marque com confianca "media" no JSON.
   - duas hipoteses plausiveis: use [palavra1/palavra2].
4. VALIDE CONTRA O GLOSSARIO (anexo). Topnomos, pessoas e termos recorrentes ja conhecidos
   tem prioridade sobre leituras ad hoc.
5. ESTRUTURA: cada registro de imovel tem face de AQUISICOES (descricao do imovel,
   adquirente, area, confrontantes) e face de TRANSMISSOES (transmitente, titulo, forma,
   valor, condicoes, averbacoes).

SAIDA OBRIGATORIA: retorne UM JSON com este shape (e SO o JSON, sem prefixo):

{
  "html": "<conteudo HTML completo da transcricao>",
  "campos_estruturados": { /* metadados extraidos */ },
  "confrontantes": [...],
  "incertezas": [
    {"trecho": "...", "leitura_principal": "...", "leituras_alternativas": [...],
     "confianca": "alta|media|baixa", "justificativa": "..."}
  ],
  "selos_fiscais": {...},
  "score_confianca": 0.0..1.0,
  "glossario_adicoes": [
    {"categoria": "toponimo|pessoa|empresa|termo", "termo": "...", "contexto": "..."}
  ]
}
"""


PROMPT_USER_TEMPLATE = """\
Transcreva o documento manuscrito da imagem em anexo seguindo o pipeline e as regras
do system prompt.

Informacoes que podem ajudar:
- ID do documento: {stem}
- Periodo provavel: 1949-50 (calibrar caligrafia para esta epoca)
- Comarca: Ferros (MG)

GLOSSARIO DE REFERENCIA (use para validar leituras):

{glossario}

Retorne o JSON estruturado conforme o system prompt.
"""


# ----- Modelos -----

@dataclass
class JobResult:
    stem: str
    status: str  # ok | error | skipped
    duration_s: float
    score: Optional[float] = None
    error: Optional[str] = None
    output_html: Optional[str] = None
    output_json: Optional[str] = None


# ----- Helpers -----

def setup_dirs():
    for d in (PDFS_DIR, IMG_DIR, HTML_DIR, JSON_DIR, CHK_DIR, LOG_DIR):
        d.mkdir(parents=True, exist_ok=True)


def extract_first_image(stem: str) -> Path:
    """Extrai a primeira imagem do PDF se ainda nao foi extraida.
    Returns path do JPG principal."""
    out_pref = IMG_DIR / f"{stem}_img"
    existing = list(IMG_DIR.glob(f"{stem}_img-*.jpg"))
    if existing:
        return sorted(existing)[0]
    pdf = PDFS_DIR / f"{stem}.pdf"
    subprocess.run(
        ["pdfimages", "-all", str(pdf), str(out_pref)],
        check=True, capture_output=True
    )
    return sorted(IMG_DIR.glob(f"{stem}_img-*.jpg"))[0]


def encode_image_for_api(img_path: Path) -> dict:
    """Carrega e (se preciso) redimensiona a imagem para envio na API."""
    img = Image.open(img_path)
    w, h = img.size
    if w > MAX_IMAGE_WIDTH:
        scale = MAX_IMAGE_WIDTH / w
        img = img.resize((int(w*scale), int(h*scale)), Image.LANCZOS)
    # Salvar em buffer base64
    from io import BytesIO
    buf = BytesIO()
    img.convert("RGB").save(buf, format="JPEG", quality=88)
    data = base64.standard_b64encode(buf.getvalue()).decode("utf-8")
    return {
        "type": "image",
        "source": {
            "type": "base64",
            "media_type": "image/jpeg",
            "data": data,
        }
    }


def load_glossario() -> str:
    if GLOSSARIO.exists():
        return GLOSSARIO.read_text(encoding="utf-8")
    return "(glossario nao encontrado — sem contexto adicional)"


def pending_pdfs(force: bool = False) -> list[Path]:
    pdfs = sorted(PDFS_DIR.glob("*.pdf"))
    if force:
        return pdfs
    htmls = {p.stem for p in HTML_DIR.glob("*.html")}
    return [p for p in pdfs if p.stem not in htmls]


def write_outputs(stem: str, parsed: dict):
    if "html" in parsed:
        (HTML_DIR / f"{stem}.html").write_text(parsed["html"], encoding="utf-8")
    json_clone = {k: v for k, v in parsed.items() if k != "html"}
    json_clone["documento"] = f"{stem}.pdf"
    json_clone["data_processamento"] = datetime.now().isoformat()
    (JSON_DIR / f"{stem}.json").write_text(
        json.dumps(json_clone, ensure_ascii=False, indent=2), encoding="utf-8"
    )


def maybe_update_glossario(parsed: dict):
    """Anexa novas entradas detectadas pela API ao glossario."""
    adds = parsed.get("glossario_adicoes", [])
    if not adds:
        return
    section = "\n\n## Adicoes automaticas (revisar)\n"
    lines = []
    for a in adds:
        cat = a.get("categoria", "?")
        termo = a.get("termo", "?")
        ctx = a.get("contexto", "")
        lines.append(f"- [{cat}] **{termo}** — {ctx}")
    if lines:
        with GLOSSARIO.open("a", encoding="utf-8") as f:
            if not (section in GLOSSARIO.read_text(encoding="utf-8") if GLOSSARIO.exists() else False):
                f.write(section)
            f.write("\n" + "\n".join(lines))


# ----- Loop principal -----

def transcribe_one(client: anthropic.Anthropic, stem: str, model: str,
                   double_pass: bool = False) -> JobResult:
    t0 = time.time()
    try:
        img_path = extract_first_image(stem)
        img_block = encode_image_for_api(img_path)
        glossario = load_glossario()
        user_prompt = PROMPT_USER_TEMPLATE.format(stem=stem, glossario=glossario)

        # Primeira passagem
        resp = client.messages.create(
            model=model,
            max_tokens=4096,
            system=SYSTEM_PROMPT,
            messages=[{
                "role": "user",
                "content": [img_block, {"type": "text", "text": user_prompt}]
            }]
        )
        text = resp.content[0].text.strip()
        if text.startswith("```"):
            text = text.split("```")[1]
            if text.startswith("json"):
                text = text[4:].strip()
        parsed = json.loads(text)

        # Opcional: segunda passagem para QA
        if double_pass:
            resp2 = client.messages.create(
                model=model, max_tokens=4096, system=SYSTEM_PROMPT,
                messages=[{
                    "role": "user",
                    "content": [img_block, {"type": "text", "text": user_prompt}]
                }]
            )
            parsed2 = json.loads(resp2.content[0].text.strip().lstrip("`json\n").rstrip("`"))
            # Marcar divergencias como incertezas adicionais (heuristica simples)
            diffs = []
            for k in ("campos_estruturados", "confrontantes"):
                if json.dumps(parsed.get(k)) != json.dumps(parsed2.get(k)):
                    diffs.append(k)
            if diffs:
                parsed.setdefault("incertezas", []).append({
                    "trecho": f"divergencia entre passes em: {diffs}",
                    "confianca": "baixa",
                    "justificativa": "diferenca entre duas leituras independentes"
                })

        write_outputs(stem, parsed)
        maybe_update_glossario(parsed)
        score = parsed.get("score_confianca")
        return JobResult(stem=stem, status="ok", duration_s=time.time()-t0,
                         score=score, output_html=f"html/{stem}.html",
                         output_json=f"notas/{stem}.json")
    except Exception as e:
        return JobResult(stem=stem, status="error",
                         duration_s=time.time()-t0, error=str(e))


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--dry-run", action="store_true")
    p.add_argument("--limit", type=int, default=None)
    p.add_argument("--resume", action="store_true")
    p.add_argument("--force", action="store_true",
                   help="reprocessa mesmo que ja exista output")
    p.add_argument("--double-pass", action="store_true")
    p.add_argument("--model", default=DEFAULT_MODEL)
    args = p.parse_args()

    setup_dirs()

    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not args.dry_run and not api_key:
        print("ANTHROPIC_API_KEY nao configurado", file=sys.stderr)
        sys.exit(2)

    todos = pending_pdfs(force=args.force)
    if args.limit:
        todos = todos[:args.limit]

    print(f"PDFs pendentes: {len(todos)}")
    for pdf in todos[:10]:
        print(f"  - {pdf.name}")
    if len(todos) > 10:
        print(f"  ... +{len(todos)-10}")

    if args.dry_run:
        return

    client = anthropic.Anthropic(api_key=api_key)
    log_file = LOG_DIR / f"run_{datetime.now():%Y%m%d_%H%M%S}.jsonl"
    chk_file = CHK_DIR / "current.json"
    done = []
    if args.resume and chk_file.exists():
        done = json.loads(chk_file.read_text())

    try:
        from tqdm import tqdm
        it = tqdm(todos, desc="transcribing")
    except ImportError:
        it = todos

    results = []
    for pdf in it:
        if pdf.stem in done:
            continue
        r = transcribe_one(client, pdf.stem, args.model, args.double_pass)
        results.append(r)
        with log_file.open("a") as f:
            f.write(json.dumps(asdict(r), ensure_ascii=False) + "\n")
        done.append(pdf.stem)
        chk_file.write_text(json.dumps(done))

    ok = sum(1 for r in results if r.status == "ok")
    err = sum(1 for r in results if r.status == "error")
    print(f"\nResumo: {ok} ok, {err} erro")
    if err:
        print("Erros:")
        for r in results:
            if r.status == "error":
                print(f"  {r.stem}: {r.error}")


if __name__ == "__main__":
    main()
