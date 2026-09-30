---
name: khoim-design
description: Use this skill to generate well-branded interfaces and assets for Khoim (खंय), the Konkani place-names map of Goa, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for protoyping.
user-invocable: true
---

Read the readme.md file within this skill, and explore the other available files.
If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.
If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

Hold these without reading further:
- The direction is frozen: Goa as painted houses. House colours from `--house-*`, white trim between talukas, a trim frame inside every house surface.
- AAA: every text pair 7:1 (use each house's `-on` ink), no text at reduced opacity, 44px+ targets, visible two-ring focus, reduced motion respected.
- Names only from `components/data/` (CSV-derived). Never invent Konkani, Romi, pronunciations or speakers. Missing forms use PendingName.
- Devanagari: Anek Devanagari, line height ≥1.5, no letter-spacing, real weights. Romi upright and full ink.
- No emoji, pins, pills, gradients, blur, stock photos, beach or feni imagery.
