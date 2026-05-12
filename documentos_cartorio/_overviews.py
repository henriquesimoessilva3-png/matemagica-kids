"""Extrai 1 imagem amostra de cada PDF na pasta pdfs/ e gera arquivo
unico-overview por PDF para inspecao rapida das caligrafias/epocas."""
from pathlib import Path
import subprocess
from PIL import Image

ROOT = Path(__file__).parent
PDFS = sorted((ROOT / 'pdfs').glob('*.pdf'))
OUT = ROOT / 'imagens'
OUT.mkdir(exist_ok=True)

for pdf in PDFS:
    stem = pdf.stem
    target_prefix = OUT / f'{stem}_img'
    # skip if first image already exists
    if list(OUT.glob(f'{stem}_img-*.jpg')):
        print(f"[skip] {stem} ja tem imagens")
        continue
    subprocess.run(['pdfimages', '-all', str(pdf), str(target_prefix)], check=True)
    print(f"[ok] {stem}")

# Gerar overview 1x para cada
for img_path in sorted(OUT.glob('*_img-000.*')):
    img = Image.open(img_path)
    w, h = img.size
    # Resize para max-largura 900 mantendo proporcao (compacto)
    scale = min(1.0, 900/w)
    new_w, new_h = int(w*scale), int(h*scale)
    out = OUT / f'ov_{img_path.stem.replace("_img-000","")}.jpg'
    img.resize((new_w, new_h), Image.LANCZOS).convert('RGB').save(out, quality=85)
    print(f"  -> {out.name}  {w}x{h} -> {new_w}x{new_h}")
print('OK')
