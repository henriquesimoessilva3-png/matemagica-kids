from PIL import Image, ImageEnhance, ImageOps
from pathlib import Path
img = Image.open('imagens/9007_1_img-000.jpg')
OUT = Path('imagens')

def zoom(box, name, factor=8):
    c = img.crop(box)
    z = c.resize((c.size[0]*factor, c.size[1]*factor), Image.LANCZOS)
    z.save(OUT / f'z4_{name}.jpg', quality=92)
    g = ImageOps.grayscale(z)
    ImageEnhance.Contrast(g).enhance(2.0).save(OUT / f'z4_{name}_ct.jpg', quality=92)

# First name in signature: 230-470 width approx, y=370-405
zoom((220, 370, 510, 410), 'name1')
# Middle 'Cage' word: x=440-620
zoom((420, 370, 640, 410), 'middle_word')
# 'Santos' first: x=580-720
zoom((560, 370, 760, 410), 'santos1')
# 'O Oficial': x=720-870
zoom((700, 370, 880, 410), 'o_oficial')
# 'Jose de Oliveira': x=860-1100
zoom((830, 370, 1130, 410), 'jose')
# 'Santos.' last: x=1080-1240
zoom((1050, 370, 1240, 410), 'santos2')

# 'ribeirão Ganafas' zoom
zoom((130, 290, 380, 335), 'rib_name', factor=8)

# 'fere em [...]' tail of line 7
zoom((1050, 220, 1240, 270), 'fere_em2', factor=8)

# 'rio Mendes de Souza' detail line 8 left
zoom((130, 265, 600, 315), 'rio_mendes', factor=6)

# 'do testa[do]' detail
zoom((950, 270, 1240, 315), 'testato2', factor=8)

# Belgo Mineira detail
zoom((1050, 0, 1240, 110), 'belgo', factor=6)

# Local column header "Conego do Entre folhas"
zoom((250, 0, 500, 100), 'conego_folhas', factor=6)

print('OK')
