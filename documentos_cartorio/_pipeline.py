from PIL import Image, ImageEnhance, ImageOps, ImageDraw, ImageFont
from pathlib import Path

SRC = Path('imagens/9007_1_img-000.jpg')
OUT = Path('imagens')

img = Image.open(SRC)
w, h = img.size
print(f"Dimensoes originais: {w}x{h}")

img.resize((w*2, h*2), Image.LANCZOS).save(OUT / 'overview_2x.jpg', quality=92)

grid = img.copy().convert('RGB')
draw = ImageDraw.Draw(grid)
for y in range(0, h, 20):
    draw.line((0, y, w, y), fill='red', width=1)
    draw.text((5, y+2), str(y), fill='red')
for x in range(0, w, 100):
    draw.line((x, 0, x, h), fill='blue', width=1)
    draw.text((x+2, 5), str(x), fill='blue')
grid.save(OUT / 'grid.jpg', quality=92)

# Left column (numero + data)
left = img.crop((0, 0, 250, h))
left.resize((left.size[0]*3, left.size[1]*3), Image.LANCZOS).save(OUT / 'col_esquerda.jpg', quality=92)

# Top band
top = img.crop((250, 0, w, 140))
top.resize((top.size[0]*2, top.size[1]*2), Image.LANCZOS).save(OUT / 'banda_topo.jpg', quality=92)

# Middle band
mid = img.crop((250, 100, w, 280))
mid.resize((mid.size[0]*2, mid.size[1]*2), Image.LANCZOS).save(OUT / 'banda_meio.jpg', quality=92)

# Lower band
low = img.crop((250, 260, w, 440))
low.resize((low.size[0]*2, low.size[1]*2), Image.LANCZOS).save(OUT / 'banda_baixo.jpg', quality=92)

# Signatures
sig = img.crop((100, h-90, w, h))
sig.resize((sig.size[0]*2, sig.size[1]*2), Image.LANCZOS).save(OUT / 'assinaturas.jpg', quality=92)

print('OK')
