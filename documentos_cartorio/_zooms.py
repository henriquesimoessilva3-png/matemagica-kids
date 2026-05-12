from PIL import Image, ImageEnhance, ImageOps
from pathlib import Path

img = Image.open('imagens/9007_1_img-000.jpg')
w, h = img.size
print(f"original: {w}x{h}")

OUT = Path('imagens')

def zoom_save(box, name, factor=4):
    crop = img.crop(box)
    cw, ch = crop.size
    z = crop.resize((cw*factor, ch*factor), Image.LANCZOS)
    z.save(OUT / f'z_{name}.jpg', quality=92)
    # Also contrast version
    g = ImageOps.grayscale(z)
    ImageEnhance.Contrast(g).enhance(2.5).save(OUT / f'z_{name}_ct.jpg', quality=92)

# Right edge (cut off content)
zoom_save((1050, 0, w, h), 'borda_direita', factor=2)

# Top-right band: "Cia Siderurgica Belgo-Mineira" area
zoom_save((1000, 0, w, 100), 'topo_direita', factor=4)

# "Entre Folhas" header area (top-middle column)
zoom_save((250, 0, 500, 80), 'header_local', factor=4)

# Number + date column closeup
zoom_save((0, 0, 200, 90), 'numero_data', factor=4)

# Specific uncertain words
# "Ganafas" / "Garrafas"  (line y~280-320, around x=200-450)
zoom_save((130, 270, 450, 320), 'ganafas', factor=5)

# "fere em" + "rio Mendes" (line y~240-310, x=1050-1240)
zoom_save((1040, 220, 1240, 310), 'fere_em', factor=4)

# Stamp/seal text overlay (left side, y=170-300)
zoom_save((0, 170, 280, 310), 'selos', factor=3)

# "tesato" area (around y=290-330, x=1000-1240)
zoom_save((950, 280, 1240, 330), 'testato', factor=5)

# Signatures
zoom_save((150, 365, 1240, 412), 'sig_full', factor=3)

# Specific signature names
zoom_save((250, 365, 700, 412), 'sig_eemar', factor=6)
zoom_save((700, 365, 1240, 412), 'sig_oficial', factor=6)

# "do Em" / abbreviation area top
zoom_save((220, 0, 480, 50), 'do_em', factor=6)

print('OK')
