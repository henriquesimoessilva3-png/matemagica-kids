"""Pipeline reutilizavel para extrair imagens e gerar zooms padrao por documento.

Uso:
  python3 _pipeline_lib.py <stem>     # processa o PDF pdfs/<stem>.pdf
"""
from pathlib import Path
import subprocess
import sys
from PIL import Image, ImageEnhance, ImageOps, ImageDraw

ROOT = Path(__file__).parent
IMG_DIR = ROOT / 'imagens'
IMG_DIR.mkdir(exist_ok=True)


def extract(stem: str) -> Path:
    pdf = ROOT / 'pdfs' / f'{stem}.pdf'
    img_glob = list(IMG_DIR.glob(f'{stem}_img-*.jpg'))
    if not img_glob:
        subprocess.run(['pdfimages', '-all', str(pdf), str(IMG_DIR / f'{stem}_img')], check=True)
        img_glob = list(IMG_DIR.glob(f'{stem}_img-*.jpg'))
    return sorted(img_glob)[0]


def standard_pack(stem: str):
    """Gera overview 2x, grid e bandas horizontais por documento."""
    src = extract(stem)
    img = Image.open(src)
    w, h = img.size
    out = IMG_DIR / stem
    out.mkdir(exist_ok=True)

    # Overview 2x
    img.resize((w*2, h*2), Image.LANCZOS).save(out / 'overview_2x.jpg', quality=92)

    # Grid (vermelho a cada 20px Y, azul a cada 100px X)
    grid = img.copy().convert('RGB')
    d = ImageDraw.Draw(grid)
    for y in range(0, h, 20):
        d.line((0, y, w, y), fill='red', width=1)
        d.text((5, y+2), str(y), fill='red')
    for x in range(0, w, 100):
        d.line((x, 0, x, h), fill='blue', width=1)
        d.text((x+2, 5), str(x), fill='blue')
    grid.save(out / 'grid.jpg', quality=85)

    # Bandas horizontais a cada ~80px Y, mais a coluna esquerda
    band_h = 100
    overlap = 30
    y = 0
    i = 0
    while y < h:
        y2 = min(y + band_h, h)
        band = img.crop((0, y, w, y2))
        band.resize((band.size[0]*2, band.size[1]*2), Image.LANCZOS).save(
            out / f'banda_{i:02d}_y{y}-{y2}.jpg', quality=88)
        i += 1
        y += band_h - overlap

    # Coluna esquerda (numero + data)
    img.crop((0, 0, 260, h)).resize((260*3, h*3), Image.LANCZOS).save(
        out / 'col_esquerda.jpg', quality=92)

    # Borda direita (continuacoes cortadas)
    img.crop((max(0, w-220), 0, w, h)).resize((220*3, h*3), Image.LANCZOS).save(
        out / 'borda_direita.jpg', quality=92)

    print(f'[{stem}] w={w} h={h} bandas={i}')
    return img, w, h


def zoom(stem: str, box, name: str, factor: int = 6, contrast: bool = False):
    src = extract(stem)
    img = Image.open(src)
    out_dir = IMG_DIR / stem
    out_dir.mkdir(exist_ok=True)
    c = img.crop(box)
    z = c.resize((c.size[0]*factor, c.size[1]*factor), Image.LANCZOS)
    z.save(out_dir / f'z_{name}.jpg', quality=92)
    if contrast:
        g = ImageOps.grayscale(z)
        ImageEnhance.Contrast(g).enhance(2.5).save(out_dir / f'z_{name}_ct.jpg', quality=92)


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print('uso: _pipeline_lib.py <stem>')
        sys.exit(1)
    for s in sys.argv[1:]:
        standard_pack(s)
