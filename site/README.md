# DSA Demystified website

A desktop browser website built with Next.js, TypeScript, and Tailwind CSS. The real website is in `site/`; the original design prototype and review artifacts remain locally ignored in `.website/`.

## Run locally

Requires Node.js 22.18+, npm, and Python 3.9+. The project was verified using Node.js 26.

```sh
cd site
npm ci
npm run dev
```

Open **http://127.0.0.1:3000/**. The content catalog and published source assets are generated automatically before development starts.

For the production static export:

```sh
cd site
npm run build
npm run preview
```

Stop the existing preview before starting another server on port 3000. `out/` is the generated static website; no application server or database is required to host it. Deployment and a public domain have not been configured.

## Website sections

| URL                        | Content                                                                                                                           |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `/`                        | Homepage and working tree traversal preview.                                                                                      |
| `/foundations/`            | All 21 Deep Dive topics rendered as website lessons.                                                                              |
| `/foundations/trees/`      | Guided four-part Trees path, preserving the first implemented learning journey.                                                   |
| `/patterns/`               | 55 NeetCode patterns; written explainers and planned material clearly distinguished.                                              |
| `/practice/`               | Deduplicated catalog of 150 problems, with search, topic, difficulty, pattern, availability, completion, sorting, and pagination. |
| `/practice/blind-75/`      | 75 problems with their original Blind 75 topics and tracker order.                                                                |
| `/practice/neetcode-150/`  | Full 150-problem catalog in NeetCode order, including planned entries.                                                            |
| `/problems/[slug]/`        | Canonical problem, available study versions, statement, readable notebooks, saved outputs, traces, and interactive views.         |
| `/company-prep/atlassian/` | 13 exercises with source write-ups, notebooks, and available traces.                                                              |
| `/roadmap/`                | The repository’s concepts → classics → patterns → revision progression.                                                           |
| `/resources/`              | Markdown guides, videos, topic cheat sheets, PDFs, documents, spreadsheet planner, and poster.                                    |
| `/saved/`                  | Bookmarks across all sections and local progress reset controls.                                                                  |
| `/search/`                 | Full search results, including shareable queries.                                                                                 |

At the current source snapshot, all 75 Blind 75 notebooks and 67 native NeetCode notebooks exist. There are 109 unique problems with local material and 41 with material still planned. Twenty-seven of the 55 patterns have written explainers. These figures are generated from the files, not hardcoded into the interface. A NeetCode catalog entry may use shared Blind 75 material even before its native NeetCode version is written.

## Content pipeline

`npm run prepare:content` runs two steps:

1. `scripts/generate-catalog.py` reads the NeetCode pattern CSV, Blind 75 tracker and notebooks, Deep Dive folders, company exercises, and resource directories. It creates `generated/catalog.json` and `generated/search.json` with stable identities, route mappings, source versions, and per-track topics/order.
2. `scripts/publish-assets.mjs` copies approved repository content into `public/content/`, preserving relative paths. It also retains the initial Tree download URLs. A legacy Cloudflare analytics script is stripped from generated HTML copies; source files are unchanged.

Generated metadata, copied content, dependency directories, and build outputs are ignored by Git. `.website/` is excluded locally through `.git/info/exclude`.

`lib/content.ts` renders and sanitizes Markdown, rewrites links to native destinations, extracts Mermaid diagrams, and parses notebook cells and saved outputs. Notebook HTML outputs are sanitized; text and PNG outputs are displayed as saved results. Python is never executed by a website build or page view. References unavailable in published content become labeled text rather than broken links.

Shared problems use a canonical LeetCode slug. Both Blind 75 and NeetCode source versions remain accessible on the same page. The original repo tracker’s checked boxes do not initialize a visitor’s completion status.

## Learning interactions

- Original self-contained visualizations load on demand in isolated iframes, with an open-full-page option.
- Native Tree explorers support node inspection, traversal orders, stepping, playback, reset, and BST search for present/missing values.
- The Tree explorer uses edge-based height/depth; the Maximum Depth interview problem’s node-based convention is explained separately.
- Read and copy notebook code, inspect saved outputs, and download the actual notebooks. Use them within this repository for access to the shared `bench_utils.py` helper.
- Switch study versions and statement/notebook/trace tabs. Tabs support arrow-key navigation.
- Search from the header with Cmd+K / Ctrl+K, or open the full search page.
- Practice filters and sorting are stored in the URL. Personal completion, bookmarks, and theme are saved only in the current browser under `dsa-website-*`, separate from prototype state.
- Storage failures fall back to the current session. Saved provides bookmark clearing and progress reset controls.

Fonts are bundled locally with the Geist license. The website requires no accounts, API keys, or external content service. Mobile-specific design, cloud synchronization, and an online Python runtime are outside the current scope.

## Validation

```sh
npm run check:content
npm run typecheck
npm run build
npm run check:links
```

Content checks verify identities, track membership, source files, notebook JSON, pattern references, planned/available states, and independently expected Tree algorithm results. The export check validates internal links and local anchors across all generated website pages, excluding untouched legacy documents. Browser routines, screenshots, and verification notes remain in `.website/`.
