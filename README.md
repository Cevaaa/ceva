# Academic Homepage — Xiao Chen (陈骁)

Personal academic homepage. Static site: plain HTML + CSS + a tiny bit of vanilla JS.
No build step, no framework, no dependencies.

## Structure

```
.
├── index.html                 # the entire page
├── assets/
│   ├── css/style.css          # all styling
│   ├── js/main.js             # language toggle, mobile nav, section highlight
│   └── img/
│       ├── avatar.jpg         # profile photo
│       ├── favicon.svg
│       └── pub/*.png          # paper teasers
├── .nojekyll                  # tell GitHub Pages to serve files as-is
└── .gitignore                 # excludes docs/ (private source material)
```

`docs/` (CV sources, raw photos, planning notes) is **gitignored** — it stays
local and is never pushed.

## Local preview

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy to GitHub Pages

This repo is already `Cevaaa/ceva`. To publish at `https://cevaaa.github.io/ceva/`:

```bash
git add -A
git commit -m "Add academic homepage"
git push origin main
```

Then in GitHub: **Settings → Pages → Build and deployment**
- Source: `Deploy from a branch`
- Branch: `main`, folder: `/ (root)`

To publish at `https://cevaaa.github.io/` instead, rename the repository to
`Cevaaa.github.io`.

`.nojekyll` is included so that GitHub Pages does not run Jekyll
(which would ignore files/folders beginning with `_`).

---

## Bilingual content (EN / 中文)

The page ships both languages in a single `index.html`. Any element that needs
translating carries a pair of attributes:

```html
<h2 data-en="Selected Publications" data-zh="代表性论文">Selected Publications</h2>
```

`assets/js/main.js` swaps `innerHTML` from `data-en` / `data-zh` when the
EN / 中文 buttons in the top-right are clicked. The choice is remembered in
`localStorage`; first-time visitors with a `zh-*` browser locale get Chinese
automatically. English is the fallback.

Rules when editing:

- **Always add both attributes** — a missing `data-zh` means that element keeps
  its English text after switching. Verify with:
  ```bash
  grep -c 'data-en=' index.html && grep -c 'data-zh=' index.html   # must match
  ```
- Inline markup inside the attributes must be HTML-escaped
  (`&lt;strong&gt;`, `&amp;`, `&quot;`).
- Paper titles, author names, venue abbreviations and code/paper links are
  deliberately **not** translated.
- Chinese mode adds `body.is-zh`, which switches to a CJK-capable serif stack.

## Remaining TODO

### 1. GroundPO links
The paper/code/project buttons are **omitted** for GroundPO while it is under
review (empty buttons look worse than none). When the links go public, add a
row back into the `#pub-groundpo` entry, after the `.tldr` paragraph:

```html
<p class="pub-links"><a href="URL" rel="noopener" data-en="Paper" data-zh="论文">Paper</a><a href="URL" rel="noopener" data-en="Code" data-zh="代码">Code</a></p>
```

### 2. GroundPO author list
Currently `Xiao Chen, et al.` — fill in co-authors.

### 3. Profile photo (optional)
`assets/img/avatar.jpg` is a crop of the night-sky silhouette photo from the
local (gitignored) `docs/` folder. Replace with a square headshot (≥720×720)
if preferred.

---

## Notes for future edits

**Research ↔ Publications linking.** Each direction in the Research section
lists work as short-name chips (`NCTTA`, `TTD`, …) that jump to the matching
paper via anchors (`#pub-nctta`, `#pub-ttd`, …). When adding a paper, keep the
`id` on `<li class="pub">` and the `.rel` chip in sync.

**Teaser figures.** `assets/img/pub/*.png` were rendered at 900px wide from the
source PDFs with PyMuPDF. To regenerate after updating a figure:

```python
import fitz
d = fitz.open("figure.pdf"); pg = d[0]
zoom = 900.0 / pg.rect.width
pg.get_pixmap(matrix=fitz.Matrix(zoom, zoom), alpha=False).save("out.png")
```

CSS caps them at `max-height: 230px` with `object-fit: contain`, so differing
aspect ratios stay visually aligned.

**CV.** Intentionally not linked from the homepage. The LaTeX source lives in
the local (gitignored) `docs/resume.tex`. To publish it later, put the PDF in
`assets/files/`, re-add the nav and contact links, and remove `docs/` privacy
concerns first.
