# Email links and icons

## mailto links (all go to hello@khoim.in)
URL-encode subject and body. `{Official}` is the LGD official name, `{Taluka}` the taluka's official name, `{code}` the LGD village code, `{page link}` the full khoim.in URL of the current page.

| Where | Subject | Body first line |
| --- | --- | --- |
| About, "Write to us" | Helping with Khoim | (none) |
| Draft banner, "Tell us what is wrong" | Something on Khoim needs fixing | Page: {page link} |
| Village card, "Tell us" (no Konkani name yet) | Konkani name for {Official}, {Taluka} | Place: {Official}, {Taluka}, LGD {code} |
| Correction on a named place | Correction for {Official}, {Taluka} | Place: {Official}, {Taluka}, LGD {code} |

For districts and talukas there is no LGD village code: use `Place: {Official}` only.

## Icons (in `public/`)
खं in Anek Devanagari 700 (outlined, no font needed), soot on haldi, with the white trim.

- `favicon.svg`, `favicon.ico` (16/32/48), `apple-touch-icon.png` (180, square corners), `icon-192.png`, `icon-512.png`.

```html
<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<meta name="theme-color" content="#E8B23A">
```
Add a web manifest only if the design asks for one; 192 and 512 are there if it does.
