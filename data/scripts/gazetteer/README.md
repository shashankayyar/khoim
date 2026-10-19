# Reading the Gazetteer's spelling list (phase 4, A1)

How the Gazetteer columns of `data/village_names_review.xlsx` were filled from *Gazetteer of the Union Territory Goa, Daman and Diu, Part 1* (1979), "A list of spellings of place names", pages 997 to 1007 (https://archive.org/details/dli.ministry.08183).

The rule (`docs/phase4-brief.md`, A1): read every line twice, once from the page image and once by OCR, and keep a value only where both readings are exactly the same. Everything else goes to `docs/gazetteer-disagreements.md` for a reviewer.

## Files
- `data/gazetteer/eye_readings_1979.tsv`: the reading from the page images (page leaf, line, then the four columns). A value starting with `?` was not read with confidence and is never kept.
- `data/gazetteer/ocr_readings_1979.tsv`: the OCR reading of each cell.
- `data/gazetteer/readings_1979.csv`: both readings side by side, with `kept` = yes or no.
- `data/gazetteer/matches_1979.csv`: each line of the list matched to an LGD code on taluka plus spelling, and how the taluka was found.
- `docs/gazetteer-disagreements.md` and `docs/gazetteer-crops/`: what a reviewer needs to settle.

## The scripts, in order
They are a record of what was done, not part of the site build. They need Tesseract 5 (`brew install tesseract`), the `mar`, `hin` and `eng` files from github.com/tesseract-ocr/tessdata_best in a folder named `tessdata`, and Python with Pillow, NumPy, SciPy and openpyxl. Each takes a working folder holding the page images (`img/p1013.png` to `img/p1023.png`, `dir/p0960.png` to `dir/p1012.png`, from the item's JP2 zip) and `GR557_djvu.txt`.
1. `1_rows.py`: finds the text lines on each page.
2. `2_cells.py`: cuts each line into its four columns.
3. `3_ocr.py`: OCR of every cell (English for the spellings, Marathi plus Hindi for the Devanagari).
4. `4_directory.py`: OCR of the name column of the Directory of Villages and Towns (pages 944 to 996), which gives each village's taluka.
5. `5_match.py`: matches each line to an LGD code on taluka plus exact spelling.
6. `6_assemble.py`: compares the two readings, writes the agreed values into the review sheet, saves the crops.
7. `7_document.py`: writes `docs/gazetteer-disagreements.md`.

Invisible joining characters (U+200C, U+200D) that OCR inserts are removed before comparing; nothing else is changed.
