from PIL import Image, ImageEnhance, ImageOps
from pathlib import Path
img = Image.open('imagens/9007_1_img-000.jpg')
OUT = Path('imagens')

def zoom(box, name, factor=10):
    c = img.crop(box)
    z = c.resize((c.size[0]*factor, c.size[1]*factor), Image.LANCZOS)
    z.save(OUT / f'z5_{name}.jpg', quality=92)
    g = ImageOps.grayscale(z)
    ImageEnhance.Contrast(g).enhance(2.5).save(OUT / f'z5_{name}_ct.jpg', quality=92)

# tighter zoom on the contested "testado" word
zoom((1100, 280, 1240, 320), 'testato_tight')

# tighter on "fere em ..."
zoom((1075, 235, 1240, 280), 'fere_tight')

# Mendes de Souza near start of line
zoom((130, 270, 480, 315), 'mendes_souza')

# Ganafas tight
zoom((170, 290, 350, 335), 'ganafas_tight')

# Pre-Cinquenta abbreviation: "do "En"
zoom((280, 0, 410, 50), 'abbr_en')

# Just date - 17 detail
zoom((90, 50, 200, 90), 'data_17')

# "A pub. oficial" detail at start of signatures
zoom((150, 365, 350, 410), 'a_pub_detail')

# Name "Cemar/Cesar"
zoom((280, 365, 470, 410), 'cemar_tight')

# Name "Cage/Lage"
zoom((440, 365, 620, 410), 'lage_tight')

print('OK')
