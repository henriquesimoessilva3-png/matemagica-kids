from PIL import Image, ImageEnhance, ImageOps
from pathlib import Path

img = Image.open('imagens/9007_1_img-000.jpg')
OUT = Path('imagens')

def zoom_save(box, name, factor=4):
    crop = img.crop(box)
    cw, ch = crop.size
    z = crop.resize((cw*factor, ch*factor), Image.LANCZOS)
    z.save(OUT / f'z2_{name}.jpg', quality=92)

# Date detail
zoom_save((90, 30, 220, 80), 'data_detail', factor=6)

# Ribeirao name - line ~290-325, x ~150-360
zoom_save((110, 285, 380, 330), 'ribeirao', factor=5)

# "fere em" detail - end of line 7 (y=240-280) right
zoom_save((1050, 230, 1240, 285), 'fere_detail', factor=5)

# "testato/testada" detail line 8 (y=275-320) right
zoom_save((950, 275, 1240, 325), 'testada', factor=5)

# Signature 1: "A publicacao official, Eemar Cage Santos"
zoom_save((150, 360, 800, 412), 'sig1', factor=4)
# Signature 2: "O Oficial, Jose de Oliveira Santos"
zoom_save((620, 360, 1240, 412), 'sig2', factor=4)

# "do Em-" abbreviation
zoom_save((280, 5, 480, 50), 'do_em2', factor=6)

# Header for "Local" / district columns: lines 1-2 left part
zoom_save((250, 0, 520, 80), 'header_full', factor=5)

# "compra, conf..." continuation right edge line ~340
zoom_save((1050, 320, 1240, 380), 'compra', factor=5)

# Stamps with text on them
zoom_save((90, 175, 290, 295), 'selo_text', factor=4)

print('OK')
