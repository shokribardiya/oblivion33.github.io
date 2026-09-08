# OBLIVION — Ecosystem Platform (Phase 1)

This delivers the **public homepage** of the OBLIVION rebuild, built as a
static, object-centric platform: HTML5 / CSS3 / vanilla JS, no framework,
no build step, deployable as-is to GitHub Pages under a project path
(`/Oblivions0.github.io/`) because every internal link and asset path is
relative.

## What's in this drop

```
index.html          Homepage — hero, active systems, stack diagram,
                     research, engineering, releases, developers, footer
404.html             Not-found page
robots.txt           Disallows /admin/, points to sitemap.xml
sitemap.xml          Lists routes that currently exist (homepage only)
css/style.css        Full design system (tokens, layout, components)
js/main.js           Renders data-driven sections, powers ⌘K search,
                     mobile drawer, and the interactive stack diagram
data/
  systems.json       PRODUCT/SYSTEM objects (Orbital, Sentinel, Graph)
  research.json      RESEARCH objects
  engineering.json   ARTICLE objects (engineering notes)
  releases.json      RELEASE objects
assets/images/       Brand mark + hero art carried over from your files
```

The homepage is **data-driven**: it fetches the JSON files above at load
time and renders the "Active systems", "Research", "Engineering" and
"Releases" sections from them. Add a new product by adding an entry to
`data/systems.json` — no HTML edit required. This is the seed of the
object model described in your brief (PRODUCT, SYSTEM, RESEARCH, ARTICLE,
RELEASE) — it's real, but the destination pages under `products/`,
`research/papers/`, etc. aren't built yet (see below).

## What's intentionally not in this drop

Your brief is a full CMS-backed ecosystem — dozens of routes, a
publishing workflow with drafts/review/rollback, media management, an
audit log, and a real multi-factor authenticated admin. That's a backend
project, not a static-site edit, and building it well in one pass would
mean guessing at a lot of decisions that should be yours. So this drop
is deliberately scoped to a strong, real Phase 1–3 (homepage + design
system + content objects) rather than a rushed 39-phase pass.

Not built yet:
- Individual object pages (`products/orbital/`, `research/papers/…/`,
  `engineering/notes/…/`, `releases/archive/…/`) — the homepage links to
  these paths already; they 404 until built
- `/admin/` — **no admin UI exists yet, on purpose**. A real multi-factor
  admin cannot be done safely as static JavaScript: any password check
  that runs in the browser can be read out of the page source, no matter
  how it's obfuscated. Building it means picking a real backend
  (GitHub API + a serverless function, or a small Node/Python service)
  to hold credentials and issue sessions. Tell me which you'd prefer and
  I'll build that layer next — I did not want to ship a fake login that
  *looks* secure and isn't
- `/developers/`, `/about/`, `/security/` destination pages
- JSON-LD for individual objects (Organization + WebSite are on the
  homepage now; `SoftwareApplication`/`Article`/`BreadcrumbList` belong
  on the pages they describe, once those exist)
- Sitemap generation — `sitemap.xml` currently lists only the homepage
  by hand; automating it needs the pages above to exist first

## Design choices, briefly

- **Panels, not cards-with-shadows.** Object grids use hairline borders
  on a shared 1px grid, not rounded corners + drop shadows — reads as an
  operational tool rather than a SaaS marketing kit.
- **Monospace is functional, not decorative.** It's reserved for IDs,
  statuses, timestamps and version strings — the things that would be
  monospace in a real ops interface — not used for every label.
- **One accent color** (`--signal`, a muted blue), used sparingly for
  links, the primary button, and the "core" status chip. Status color
  otherwise comes from what it means (active / research / critical),
  not decoration.
- No fabricated metrics, customers, or claims — status labels are
  "Active Development" / "Research" only, per your "no fake data" rule.

## Deploying

Push these files to the repo root. GitHub Pages project-site serving
will resolve every path correctly since nothing is rooted at `/`.

## Next steps (pick any, in any order)

1. Build the individual product/research/engineering/release pages so
   the homepage's links resolve
2. Design the real admin architecture (backend choice + auth model)
3. `/developers/`, `/about/`, `/security/` sections
4. Wire structured data + sitemap growth once (1) exists
