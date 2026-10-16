# Phase 2 decisions, 16 Oct 2026

Shashank's answers to everything open in PRs 1 to 3. Apply them, then carry on with the brief (`docs/phase2-brief.md`).

## Merging: you do it now
Shashank no longer merges. `CLAUDE.md` DEPLOY steps 5 to 7 now say when you merge yourself and when you stop and ask. This replaces "never merge yourself" in the brief. Commit the `CLAUDE.md` change in PR 1. Merge order: PR 1, then 2, then 3, then the design PR, bringing each up to date by merging `main` into the branch (not rebasing, no force-push) before merging. Then continue through A6, A7 and Part B the same way: PR, preview check, merge, check khoim.in.

## Permissions
`.claude/settings.json` now starts sessions in auto mode and no longer asks before `gh pr merge`, `rm` or `git rebase`. Commit it in PR 1 along with `CLAUDE.md`. It still asks before `gh api`, `git reset`, `npm uninstall`, and edits to workflows, `wrangler.jsonc` or the settings file.

## PR 1 (A1, indexing)
- District and taluka pages are always indexable, whatever their name status, because they now carry village lists. Dharbandora goes back in the sitemap. Villages keep the rule as written.

## PR 3 (A5, village tables)
- Hide the Population, Panchayat and Type columns until A2 data exists. A column appears on a taluka page only when at least one village in that taluka has a value. No "To load" cells on indexable pages.

## PR 2 (A3, matches)
Set `checked=yes` on every match below. Anything not listed stays as it is.

**Spelling variants: all confirmed.**
Anjadiva and Anjediva = Angediva (627029). Collem = Colem (626977). Cumbharjua = Cumbarjua (626728). Goa Velha = Goa-Velha (626734). Harmal (Arambol) = Arambol (626658). Carambolim-Brama (626793). Harvalem = Arvalem (917385). Khandepar = Candepar (626853, both videos). Mayem = Maem (626752). Shiroli = Siroli (626769). Veling = Velinga (626854).

**Ambiguous names: decided.**
| Name | Code | Why |
| --- | --- | --- |
| Amona (Luis, P1) | 626758 Amone, Bicholim | He describes a riverside settlement; the Bicholim one is on the Mandovi, the Quepem one is inland. |
| Camurlim (Luis, P2) | 626663 Bardez | His article puts it on the Chapora, which is the Bardez one. |
| Tambdi Surla (video) | 626974 Surla, Dharbandora | The temple is at Surla near Mollem, in Dharbandora. |
| Vainguinim (Luis, R2) | blank | His origin is for the Dona Paula Vainguinim, which is not an LGD village. It must not go on the Bicholim or Sattari pages. |

**Video places with no exact LGD name: decided.**
| Video place | Code | Why |
| --- | --- | --- |
| Kavlem | 626871 Queula, Ponda | Gazetteer gives Queula (Kavale). |
| Keri (Ponda) | 626850 Querim, Ponda | Vijaydurga temple is at Keri, Ponda. |
| Narve | 626755 Naroa, Bicholim | The video title says Bicholim; Narve is Naroa. |
| Dhavem (Sattari) | 626801 Davem, Sattari | Same village, Portuguese-era spelling. |
| Dhamshem (Sattari) | 626831 Damocem, Sattari | Same village, Portuguese-era spelling. |
| Mapusa | attach to the existing Mapusa town page | Brief says attach town videos only where the town has a page; it does. |
| Panaji, Ponda | 945834, 945835 | Municipal towns with pages. |
| Marcel | blank | Marcel (Mashel) is not an LGD village. Keep the row for a later town or locality page. |

**Localities, not villages: leave blank.** Ashwem (in Mandrem), Baga (Calangute), Dona Paula (Taleigao), Banastarim, Ribandar, Agassaim. Don't attach their origins or GI products to the parent village, because the origin is for the locality's name, not the village's. Add a `locality_of` column with the parent where known, for a later localities layer.

**Feasts:** Lairai zatra goes to Sirigao (626746). Find its point for the map (A2).

**Stations:** keep Wikidata coordinates for Kalem; 500 m does not matter at map scale. Keep the Wikidata Marmagao entry and note the OpenStreetMap gap in the README.

## Titles (A6)
The patterns in the brief are approved as written. Go ahead with A6 and A7 once PRs 1 to 3 are merged.

## Design (Part B)
The phase 2 design export is unzipped at `.design-phase2/` in the repo root (kept out of git through `.git/info/exclude`). No Claude Design sign-in needed. In its own branch and PR: replace `design/` with the contents of `.design-phase2/`, leaving out `scraps/` and `uploads/`. The phase 2 section of `design/design_handoff_khoim/README.md` is then the spec for Part B. Start Part B after that PR and PRs 1 to 3 are merged.

## Still waiting on Shashank
The LGD and Census 2011 files for A2.
