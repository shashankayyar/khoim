# Fonts for the link-preview images

Static copies of the site's own fonts (`src/styles/assets/fonts/`), used only by `scripts/og/cards.mjs` when the site is built. They are never sent to visitors.

- `AnekLatin-latin-500.ttf`, `AnekLatin-latin-600.ttf`: Anek Latin, Latin subset, weights 500 and 600.
- `AnekDevanagari-devanagari-600.ttf`: Anek Devanagari, Devanagari subset, weight 600. Its shaping features (half forms, conjuncts, vowel signs) are kept.

Anek Latin and Anek Devanagari are by Ek Type, under the SIL Open Font License 1.1 (https://openfontlicense.org).

The image renderer cannot read the site's variable woff2 files, so each weight was fixed and saved as TTF with fontTools:

```
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
font = instantiateVariableFont(TTFont('src/styles/assets/fonts/AnekLatin-latin.woff2'), {'wght': 600}, updateFontNames=True)
font.flavor = None
font.save('scripts/og/fonts/AnekLatin-latin-600.ttf')
```

If a name ever uses a letter these subsets lack, the build stops and names the font to add.
