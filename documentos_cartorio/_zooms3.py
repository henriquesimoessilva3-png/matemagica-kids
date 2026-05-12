from PIL import Image
from pathlib import Path
img = Image.open('imagens/9007_1_img-000.jpg')
OUT = Path('imagens')
def zoom(box, name, factor=5):
    c = img.crop(box)
    c.resize((c.size[0]*factor, c.size[1]*factor), Image.LANCZOS).save(OUT / f'z3_{name}.jpg', quality=92)

# Try the ribeirao text properly. Looking at the grid, it's around y=305-340
zoom((110, 295, 380, 345), 'ribeirao_v2')
# Line 8 (rio Mendes) y~275-315 x=150-1240
zoom((130, 270, 1240, 320), 'linha8_rio_mendes')
# Line 9 (ribeirao Ganafas) y~300-340
zoom((130, 295, 1240, 345), 'linha9_ganafas')
# Line 10 (des de Souza) y~325-365
zoom((130, 320, 1240, 365), 'linha10')
# Line 11 (escritura publica) y~345-385
zoom((130, 345, 1240, 390), 'linha11')
# Signature line y~375-412
zoom((130, 370, 1240, 412), 'linha_sig')
# Just the date
zoom((90, 50, 200, 95), 'data_only')
# Number column wider
zoom((10, 30, 150, 100), 'num_only')

print('OK')
