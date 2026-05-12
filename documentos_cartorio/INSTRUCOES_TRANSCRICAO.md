# Pipeline de Transcrição de Documentos Cartoriais Manuscritos

Instruções para Claude Code processar PDFs de livros de registro de imóveis (MG, décadas 1940-50, caligrafia cursiva).

---

## 1. Estrutura de pastas

```
documentos_cartorio/
├── pdfs/                    # PDFs originais (entrada)
├── imagens/                 # Imagens extraídas (cache)
├── html/                    # HTMLs gerados
├── docx/                    # Versões Word
├── notas/                   # JSON com incertezas por documento
└── _processar.py            # Script orquestrador
```

**Auto-detecção:** para cada PDF em `pdfs/`, só processar se NÃO existir o `.html` correspondente em `html/`. Reprocessar apenas se o PDF for mais recente.

---

## 2. Prompt para Claude Code

Cole isto como instrução no Claude Code, junto com o(s) PDF(s):

````
Você vai transcrever documentos manuscritos de livros de registro de imóveis brasileiros das décadas de 1940-1950 (caligrafia cursiva em português antigo). Siga RIGOROSAMENTE o pipeline abaixo. Não pule etapas. Não invente leituras.

## Pipeline obrigatório (por documento)

1. **Extrair imagem do PDF**
   ```bash
   pdfimages -all <arquivo.pdf> imagens/<nome>_img
   ```

2. **Inspeção geral** — visualizar a imagem completa para mapear:
   - Número do registro (geralmente coluna esquerda)
   - Data (logo abaixo do número)
   - Local/distrito/município (coluna intermediária)
   - Adquirente/proprietário (geralmente coluna direita ou no corpo)
   - Selos fiscais, carimbos, assinaturas

3. **Identificar linhas de texto** — gerar imagem com grid horizontal (linhas vermelhas a cada 10px com coordenada Y) para mapear Y inicial e final de cada linha.

4. **Leitura por blocos** — ampliar a imagem em 2x e ler bloco por bloco (esquerda → meio → direita).

5. **Resolução de dúvidas** — para CADA palavra duvidosa:
   - Recorte específico da palavra + zoom 8-10x
   - Aplicar grayscale + contraste 3.0
   - Comparar com OUTRAS ocorrências da mesma letra/palavra no MESMO documento (ex: comparar "F" duvidoso com "F" claro em outra palavra)
   - Se for topônimo, nome ou termo histórico ambíguo: usar web_search para validar contra contexto histórico-geográfico (município, comarca, empresa adquirente em registros da época)

6. **Validação cruzada** — passar o texto inteiro por uma segunda leitura para checar:
   - Coerência narrativa (a frase faz sentido?)
   - Concordância gramatical
   - Topônimos e nomes próprios consistentes com a região e década

## Regras de transcrição

- **Preserve a ortografia original** (ex: "commum", "corrego", "fere em", "Companhia"). Não modernize.
- **Preserve abreviações** com a notação original (ex: "Cia.", "S/A").
- **Marque incertezas**:
  - `[palavra?]` quando há leitura provável mas não certa
  - `[ilegível]` quando totalmente ilegível
  - `[palavra1/palavra2]` quando há duas hipóteses plausíveis
- **NUNCA invente letras** para completar palavras incompletas — use `[?]` para letras ausentes.
- **Identifique elementos visuais**: selos fiscais (valor, estado, quantidade), carimbos, assinaturas.

## Pipeline de análise visual (Python)

Use este snippet como base para o pipeline de imagem:

```python
from PIL import Image, ImageEnhance, ImageOps, ImageDraw

img = Image.open(path)
w, h = img.size

# 1. Versão 2x para leitura geral
img.resize((w*2, h*2), Image.LANCZOS).save('overview_2x.jpg', quality=95)

# 2. Grid para mapear linhas
grid = img.copy()
draw = ImageDraw.Draw(grid)
for y in range(0, h, 10):
    draw.line((0, y, w, y), fill='red', width=1)
    draw.text((5, y), str(y), fill='red')
grid.save('grid.jpg', quality=95)

# 3. Recorte de palavra duvidosa (ajustar x1,y1,x2,y2)
crop = img.crop((x1, y1, x2, y2))
crop_zoom = crop.resize((crop.size[0]*8, crop.size[1]*8), Image.LANCZOS)
crop_zoom.save('duvida_zoom.jpg', quality=95)

# 4. Versão alto contraste em grayscale
gray = ImageOps.grayscale(crop_zoom)
ImageEnhance.Contrast(gray).enhance(3.0).save('duvida_contraste.jpg', quality=95)
```

## Saída obrigatória (por documento)

Para cada PDF processado, gerar DOIS arquivos:

### A) HTML estruturado (`html/<nome>.html`)

Use exatamente este template (substitua os campos `{{ }}`):

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>Registro {{numero}} - {{data}}</title>
<style>
body { font-family: 'Georgia', serif; max-width: 720px; margin: 2em auto; line-height: 1.6; color: #222; }
h1 { border-bottom: 2px solid #333; padding-bottom: 0.3em; font-size: 1.4em; }
.meta { background: #f5f5f0; padding: 1em 1.2em; border-left: 4px solid #888; margin: 1em 0; }
.meta dt { font-weight: bold; display: inline-block; min-width: 130px; }
.meta dd { display: inline; margin: 0; }
.meta dl > div { margin-bottom: 0.3em; }
.transcricao { text-align: justify; text-indent: 2em; margin: 1.5em 0; }
.incerto { background: #fff3cd; padding: 0 2px; }
.ilegivel { background: #f8d7da; padding: 0 2px; font-style: italic; }
.notas { background: #fafafa; border: 1px solid #ddd; padding: 1em 1.5em; font-size: 0.9em; }
.notas h2 { font-size: 1.1em; margin-top: 0; }
.assinaturas { margin-top: 1.5em; font-style: italic; text-align: right; }
.elementos { font-size: 0.85em; color: #666; margin-top: 1em; }
</style>
</head>
<body>

<h1>Registro nº {{numero}} — {{data_extenso}}</h1>

<div class="meta">
<dl>
<div><dt>Número:</dt> <dd>{{numero}}</dd></div>
<div><dt>Data:</dt> <dd>{{data}}</dd></div>
<div><dt>Local:</dt> <dd>{{local}}</dd></div>
<div><dt>Distrito:</dt> <dd>{{distrito}}</dd></div>
<div><dt>Município:</dt> <dd>{{municipio}}</dd></div>
<div><dt>Comarca:</dt> <dd>{{comarca}}</dd></div>
<div><dt>Adquirente:</dt> <dd>{{adquirente}}</dd></div>
</dl>
</div>

<p class="transcricao">
{{texto_transcrito}}
</p>

<p class="assinaturas">
A publicação oficial, {{publicador}}.<br>
O Oficial, {{oficial}}.
</p>

<div class="elementos">
<strong>Elementos visuais:</strong> {{selos_e_carimbos}}
</div>

<div class="notas">
<h2>Notas de transcrição</h2>
<ul>
{{lista_de_incertezas}}
</ul>
</div>

</body>
</html>
```

Dentro de `{{texto_transcrito}}`, envolva incertezas em `<span class="incerto" title="motivo">palavra?</span>` e trechos ilegíveis em `<span class="ilegivel">[ilegível]</span>`.

### B) JSON de notas (`notas/<nome>.json`)

```json
{
  "documento": "<nome do arquivo>",
  "numero_registro": "9007",
  "data_processamento": "YYYY-MM-DD",
  "campos_estruturados": {
    "numero": "...",
    "data": "...",
    "distrito": "...",
    "municipio": "...",
    "comarca": "...",
    "adquirente": "...",
    "area_hectares": "...",
    "area_ares": "...",
    "area_centiares": "..."
  },
  "confrontantes": ["Joaquim de Souza Caldas", "Manoel Caldas", "..."],
  "incertezas": [
    {
      "trecho": "comarca de Ferros",
      "leitura_principal": "Ferros",
      "leituras_alternativas": ["Pinos", "Furos"],
      "confianca": "alta|media|baixa",
      "justificativa": "Comparação com letra F em 'Folhas' + contexto histórico: Mesquita foi desmembrada de Santana dos Ferros em 1923",
      "coordenadas_imagem": [280, 145, 400, 180]
    }
  ],
  "selos_fiscais": {
    "estado": "Minas Gerais",
    "valor_unitario": "Cr$ 0,50",
    "quantidade": 4
  }
}
```

## Checklist antes de entregar

- [ ] Toda palavra "fácil" foi transcrita literalmente?
- [ ] Toda palavra duvidosa tem zoom + grayscale gerados e está marcada `[?]`?
- [ ] Topônimos foram validados com contexto histórico (web_search)?
- [ ] Nomes de empresas foram verificados (ex: "Belgo-Mineira" em 1950)?
- [ ] HTML valida e abre no navegador?
- [ ] JSON de notas tem todas as incertezas listadas com coordenadas?

NÃO entregue se algum item do checklist falhar.
````

---

## 3. Conversão HTML → Word

Depois que o Code gerar os HTMLs, conversão em lote para `.docx` via **Pandoc** (mais limpo que python-docx para HTML estilizado):

```bash
# Instalar pandoc (uma vez)
brew install pandoc        # macOS
# ou: sudo apt install pandoc

# Converter todos os HTMLs em um comando
cd documentos_cartorio
mkdir -p docx
for f in html/*.html; do
    nome=$(basename "$f" .html)
    pandoc "$f" -o "docx/${nome}.docx" --reference-doc=referencia.docx
done
```

O `referencia.docx` (opcional) é um arquivo Word vazio com seus estilos preferidos (fonte, margens, cabeçalho do Botafogo se quiser branding). Sem ele, o Pandoc usa o estilo padrão — já fica bom.

---

## 4. Script orquestrador (auto-detecção)

`_processar.py` na raiz da pasta — detecta o que falta processar:

```python
from pathlib import Path
import subprocess

ROOT = Path(__file__).parent
pdfs = sorted((ROOT / 'pdfs').glob('*.pdf'))
htmls_existentes = {p.stem for p in (ROOT / 'html').glob('*.html')}

pendentes = [p for p in pdfs if p.stem not in htmls_existentes]

print(f"Total PDFs: {len(pdfs)}")
print(f"Já processados: {len(htmls_existentes)}")
print(f"Pendentes: {len(pendentes)}")
for p in pendentes:
    print(f"  - {p.name}")

# Os pendentes você passa pro Claude Code junto com INSTRUCOES_TRANSCRICAO.md
```

---

## 5. Fluxo de uso

1. Jogar os PDFs em `pdfs/`
2. Rodar `python _processar.py` — ver quais estão pendentes
3. Abrir Claude Code, anexar este arquivo (`INSTRUCOES_TRANSCRICAO.md`) + os PDFs pendentes
4. Pedir: *"Processe estes documentos seguindo INSTRUCOES_TRANSCRICAO.md"*
5. Quando terminar, rodar o loop do pandoc para gerar os `.docx`
6. Revisar os arquivos em `docx/` — focar nas incertezas marcadas em amarelo/vermelho no HTML

---

## 6. Para melhorar com o tempo

Mantenha um arquivo `glossario.md` com:
- Topônimos da região recorrentes (Ferros, Mesquita, Paraíso, Entre Folhas, etc.)
- Nomes próprios que aparecem em múltiplos documentos (mesmos confrontantes)
- Empresas adquirentes frequentes (Belgo-Mineira, Acesita, etc.)
- Termos jurídicos arcaicos ("fere em", "comum com", "centiares")

Atualize esse glossário a cada documento processado. Passe ele junto com o prompt no Code — vai aumentar a precisão das leituras duvidosas.
