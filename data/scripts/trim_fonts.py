"""Make the site's fonts from the design's fonts by keeping only the weights the design uses (500 to 700).

Input:  design/assets/fonts/*.woff2   (Anek Devanagari and Anek Latin from Google Fonts, weights 100 to 800)
Output: src/styles/assets/fonts/*.woff2

No letters are removed and the rules that join Devanagari conjuncts (GSUB) are kept as they are.
Run again only if the design's font files change:

    python3 -m venv .venv && .venv/bin/pip install fonttools brotli
    .venv/bin/python data/scripts/trim_fonts.py
"""
import glob, io, os
from fontTools.misc.xmlWriter import XMLWriter
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

SRC, OUT = 'design/assets/fonts', 'src/styles/assets/fonts'

def gsub(font):
    buf = io.StringIO()
    font['GSUB'].toXML(XMLWriter(buf), font)
    return buf.getvalue()

for path in sorted(glob.glob(os.path.join(SRC, '*.woff2'))):
    name = os.path.basename(path)
    font = TTFont(path)
    glyphs, cmap, rules = len(font.getGlyphOrder()), dict(font.getBestCmap()), gsub(font)
    trimmed = instancer.instantiateVariableFont(font, {'wght': (500, 700)})
    trimmed.flavor = 'woff2'
    out = os.path.join(OUT, name)
    trimmed.save(out)
    check = TTFont(out)
    assert len(check.getGlyphOrder()) == glyphs and dict(check.getBestCmap()) == cmap, name + ': letters changed'
    if 'devanagari' in name:
        assert gsub(check) == rules, name + ': Devanagari joining rules changed'
    print(f'{name}: {os.path.getsize(path)} -> {os.path.getsize(out)} bytes')
