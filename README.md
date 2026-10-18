# DSA Demystified

Data structures and algorithms study material in three tracks: **concepts first**, then **interview problems**, then **pattern-wise drilling**. Each track is organized by topic, not by content type: a topic's tutorial, runnable notebook, interactive HTML step-through, and cheat sheet all sit in that topic's folder.

## Website

The desktop website lives in [`site/`](site/README.md). It brings together all 21 Foundations topics, pattern explainers, Blind 75 and NeetCode 150 practice, company preparation, roadmap, and resources. Problems share one identity across tracks while preserving their available notebooks, explanations, and interactive walkthroughs. Planned study material is labeled clearly.

```bash
cd site
npm ci
npm run dev
```

Open `http://127.0.0.1:3000/`. See [`site/README.md`](site/README.md) for the static production build, available pages, and validation commands.

## Tracks

| Track | Use it for | Start here |
|---|---|---|
| [**deep_dive**](deep_dive/README.md) | Learning the structures and algorithms themselves from first principles: hashing, sorting, binary search, two pointers, greedy, backtracking, trees, heaps, tries, graphs, shortest paths, MST, topological sort, SCCs. 21 numbered topics. | [`deep_dive/README.md`](deep_dive/README.md) · [`deep_dive/index.html`](deep_dive/index.html) |
| [**blind_75**](blind_75/README.md) | Drilling the 75 classic interview problems, grouped by topic and pattern (two pointers, sliding window, DFS/BFS, DP, …). | [`blind_75/README.md`](blind_75/README.md) · [`blind_75/index.html`](blind_75/index.html) · [tracker](blind_75/Blind75_Tracker.md) |
| [**neetcode_150**](neetcode_150/README.md) | The 150 NeetCode problems **pattern-wise**: 14 DSA types → 55 patterns, each with a pattern explainer, an interactive pattern lesson, and a notebook + interactive HTML per problem. Built one pattern at a time with `/neetcode-pattern`. Also a question tracker and reference docs: pattern archetypes, red-herring traps, a 20-day spaced-repetition plan, a mnemonic poster, YouTube links. | [`neetcode_150/README.md`](neetcode_150/README.md) · [tracker](neetcode_150/index.html) · [`neetcode_150/docs/`](neetcode_150/docs/) |

Also at the root: [`leetcode-prep-roadmap.html`](leetcode-prep-roadmap.html) (overall prep roadmap) and [`docs/`](docs/) (course and NeetCode link lists).

## Suggested order

1. Work through **deep_dive** track by track, in the order its README lists them, to build the concepts.
2. Move to **blind_75** and go topic by topic, applying those concepts to real interview problems. Tick problems off in [`Blind75_Tracker.md`](blind_75/Blind75_Tracker.md).
3. Drill **neetcode_150** pattern by pattern: read the pattern's README and lesson, then solve its problems in order.
4. Before an interview, revisit the one topic or pattern folder you need. Everything about it is in that folder.

## Layout

```
bench_utils.py                     shared complexity-benchmark helper (one copy, used by every notebook)
outputs/<slug>/                    skill output when no folder is named (staging; move into a track when ready)

deep_dive/
├── README.md, index.html          track index + visual hub
└── NN_Title_Case/
    ├── README.md                  concept tutorial
    ├── NN_snake.ipynb             runnable notebook
    ├── NN_snake_lesson.html       interactive lesson
    └── NN_snake_explained.md      step-by-step trace write-up (where one exists)

blind_75/
├── README.md, index.html          track index + visual hub
├── Blind75_Tracker.md             progress checklist
└── <Topic>/
    ├── README.md                  concept tutorial for the topic
    ├── index.html, patterns.html  visual hub + interview cheat sheet
    └── [<Group folder>/]          one folder per pattern group (some topics are flat)
        ├── <problem>.ipynb        brute → optimal solutions, asserts, complexity benchmark
        ├── <problem>.html         interactive step-through
        └── <problem>_explained.md step-by-step trace write-up (where one exists)

neetcode_150/
├── README.md                      all 150 problems by type → pattern, with build status (generated)
├── index.html, docs/              question tracker + reference docs
└── <Type>/<NN_Pattern>/           e.g. Trees/03_BFS_Level_Order/
    ├── README.md                  the pattern: the tell, template, problems table, traps
    ├── <nn_pattern>_lesson.html   interactive pattern lesson
    ├── <problem>.ipynb            brute → optimal solutions, asserts, complexity benchmark
    └── <problem>.html             interactive step-through
```

## Running the notebooks

The notebooks need only the Python standard library. `matplotlib` is optional: it adds the complexity plots, and the benchmark tables still print without it. To set up the environment and start Jupyter:

```bash
uv venv && uv pip install jupyter matplotlib
uv run jupyter lab
```

Each notebook finds `bench_utils.py` by walking up from its own folder, so you can open it from anywhere in the repo. Blind 75 notebooks check correctness in a `# Correctness check` assert cell.

To run a notebook top to bottom without opening Jupyter (this also refreshes its saved outputs):

```bash
uvx --python 3.12 --with ipykernel --with matplotlib --from nbconvert jupyter-nbconvert --to notebook --execute --inplace \
    --ExecutePreprocessor.kernel_name=python3 "<path/to/notebook.ipynb>"
```

A nonzero exit means an assert or a cell failed. Notebook outputs are committed, so re-run a notebook after changing its code.

## Claude Code skills

Project skills live in [`.claude/skills/`](.claude/skills/). Claude picks one up automatically when your request matches. You can also call one directly as `/<skill-name> <arguments>`.

| Skill | What it does | Arguments / input | Output |
|---|---|---|---|
| [`neetcode-pattern`](.claude/skills/neetcode-pattern/SKILL.md) | Builds one NeetCode 150 pattern end to end: pattern explainer, interactive pattern lesson, and a notebook + interactive HTML for every problem in it. Copies problems already solved in `blind_75/`; generates the rest with the skills below. | A pattern (`Trees/BFS`, `dynamic knapsack`) or a problem name (builds its whole pattern). `pattern_plan.py list` shows what's done. | `neetcode_150/<Type>/<NN_Pattern>/`: `README.md`, `<nn_pattern>_lesson.html`, `<problem>.ipynb` + `<problem>.html` each; then `neetcode_150/README.md` is regenerated. |
| [`leetcode-notebook`](.claude/skills/leetcode-notebook/SKILL.md) | Builds a study notebook for any coding problem (LeetCode, Blind 75, NeetCode 150, or one you paste). It can also restyle an existing notebook's Concepts cell into plain bullets. | Problem name, number or statement; optionally a target folder (e.g. `blind_75/Tree/`). Or a notebook/folder to reformat. | `<slug>.ipynb` in the [output location](#where-skills-write), with cells in this order: concepts + "what is it" primers, problem, brute → optimal approaches, asserts, `bench_utils` benchmark, patterns learned. For a reformat: the Concepts cell is replaced in place. |
| [`leetcode-visualizer`](.claude/skills/leetcode-visualizer/SKILL.md) | Turns study notebooks into self-contained interactive HTML explainers, plus a patterns cheat sheet when given a folder. | A notebook path, a problem name, or any folder (e.g. `blind_75/Array/`, `outputs/`). The notebooks must exist first. | One `<slug>.html` next to each notebook. For a folder, also `patterns.html` and `index.html` at that folder's root. Pages work offline with no CDNs. |
| [`dsa-interactive-lesson`](.claude/skills/dsa-interactive-lesson/SKILL.md) | Builds a beginner-friendly interactive HTML lesson for one DSA concept: the Deep Dive `_lesson.html` format. | A concept (e.g. `Union-Find`), optionally a target folder. It takes the code and example from a matching notebook when one exists. | `<slug>_lesson.html` in the [output location](#where-skills-write) (for a Deep Dive topic: `deep_dive/NN_Title_Case/NN_snake_lesson.html`): one offline file with 13 fixed sections, step-through traces (Previous / Resume / Next / Reset) synced to the code, edge-case tabs and practice questions. It is checked with `scripts/check_lesson.py`, and screenshotted too when a browser tool is available. |
| [`dsa-snippet-explainer`](.claude/skills/dsa-snippet-explainer/SKILL.md) | Traces notebook code step by step in a `Step \| Action \| state` table that matches the notebook's asserts. | The target code cell or notebook. Optional: **file** mode (default is cell mode) and **Bengali** (default is English). | **Cell mode:** one markdown cell inserted after the code. **File mode:** `<notebook>_explained.md` next to the notebook, or `outputs/<slug>/` for pasted code. **Bengali:** a translated cell after the English one, or `_explained_bn.md`. |
| [`register-content`](.claude/skills/register-content/SKILL.md) | After content is added or moved, updates every index that should link to it and checks that all links resolve. | Optional path. With no path, it uses everything changed in `git status`. | Edits to the topic `README.md`, `index.html` and `patterns.html`, the track README tables and counts, `deep_dive/index.html`, and this README. For `neetcode_150/`, it regenerates `neetcode_150/README.md`. In other folders, it updates the nearest index that lists the new file's siblings. It skips `outputs/`. Ends with a case-sensitive link check (what GitHub serves) and a report. It does not commit. |
| [`dsa-mock`](.claude/skills/dsa-mock/SKILL.md) | Runs a Socratic mock coding interview (DSA, SQL, follow-up variants). Claude plays the interviewer and never hands you the solution. | A pasted or named problem, optionally with follow-ups. | A live interview in chat, with free-form feedback at the end. |
| [`fde-system-design-mock`](.claude/skills/fde-system-design-mock/SKILL.md) | Runs a voice-friendly mock AI system design interview for a Forward Deployed Engineer role. | A use case or domain, optional. If you don't give one, it generates a fresh one. | A live interview in chat. Each answer gets a clarity/communication grade, and the session ends with a full scorecard. |

### Where skills write

The skills that create files pick a folder in this order:

1. **The folder you name**, e.g. "make a notebook for Two Sum in `blind_75/Array/Group 1_ hashing-pattern/`".
2. **Next to the existing source**: an HTML page or `_explained.md` goes beside the notebook it explains, in whatever folder that is.
3. **`outputs/<slug>/`** at the repo root, when neither applies. All of one problem's files (notebook, HTML, write-up) gather there. Move the folder into a track when it's ready, then run `/register-content` to link it from the indexes.

The repo also has a hook in [`.claude/settings.json`](.claude/settings.json). After any edit to an `.ipynb` file, it checks that the notebook is still valid JSON, so a broken edit is reported straight away.

### Note: `dsa-interactive-lesson` vs `leetcode-visualizer`

Both produce offline HTML pages you can step through, but they do different jobs.

- **`dsa-interactive-lesson`** teaches one **concept** from first principles. It writes a `_lesson.html` with a fixed 13-section structure (the Deep Dive lesson format).
- **`leetcode-visualizer`** explains **problems** from their existing notebooks, in any folder. It writes one page per problem, plus a `patterns.html` cheat sheet when given a folder.

`dsa-interactive-lesson` was originally written for Genspark. It has been ported to Claude Code:

- The Genspark screenshot and delivery steps are replaced by `scripts/check_lesson.py`, a structural check that runs locally. When a Playwright or Chrome DevTools browser tool is available, the skill also takes a screenshot.
- A Cloudflare analytics beacon has been removed from the template.
- Every existing `deep_dive/*/*_lesson.html` passes the checker.

The `excalidraw-diagram` skill was removed from this repo, because the identical skill is installed globally in `~/.claude/skills/`.
