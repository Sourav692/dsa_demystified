# DSA Demystified

Data structures and algorithms study material in two tracks: **concepts first**, then **interview problems**. Each track is organized by topic, not by content type: a topic's tutorial, runnable notebook, interactive HTML step-through, and cheat sheet all sit in that topic's folder.

## Tracks

| Track | Use it for | Start here |
|---|---|---|
| [**deep_dive**](deep_dive/README.md) | Learning the structures and algorithms themselves from first principles: hashing, sorting, binary search, two pointers, greedy, backtracking, trees, heaps, tries, graphs, shortest paths, MST, topological sort, SCCs. 21 numbered topics. | [`deep_dive/README.md`](deep_dive/README.md) · [`deep_dive/index.html`](deep_dive/index.html) |
| [**blind_75**](blind_75/README.md) | Drilling the 75 classic interview problems, grouped by topic and pattern (two pointers, sliding window, DFS/BFS, DP, …). | [`blind_75/README.md`](blind_75/README.md) · [`blind_75/index.html`](blind_75/index.html) · [tracker](blind_75/Blind75_Tracker.md) |
| [**neetcode_150**](neetcode_150/index.html) | NeetCode 150 hub page plus reference docs: pattern archetypes, red-herring traps, a 20-day spaced-repetition plan, a mnemonic poster. | [`neetcode_150/index.html`](neetcode_150/index.html) · [`neetcode_150/docs/`](neetcode_150/docs/) |

Also at the root: [`leetcode-prep-roadmap.html`](leetcode-prep-roadmap.html) (overall prep roadmap) and [`docs/`](docs/) (course and NeetCode link lists).

## Suggested order

1. Work through **deep_dive** track by track, in the order its README lists them, to build the concepts.
2. Move to **blind_75** and go topic by topic, applying those concepts to real interview problems. Tick problems off in [`Blind75_Tracker.md`](blind_75/Blind75_Tracker.md).
3. Before an interview, revisit the one topic folder you need. Everything about it is in that folder.

## Layout

```
deep_dive/
├── README.md, index.html          track index + visual hub
├── bench_utils.py                 shared complexity-benchmark helper
└── NN_Title_Case/
    ├── README.md                  concept tutorial
    ├── NN_snake.ipynb             runnable notebook
    ├── NN_snake_lesson.html       interactive lesson
    └── NN_snake_explained.md      step-by-step trace write-up (where one exists)

blind_75/
├── README.md, index.html          track index + visual hub
├── Blind75_Tracker.md             progress checklist
├── bench_utils.py                 same helper (keep both copies identical)
└── <Topic>/
    ├── README.md                  concept tutorial for the topic
    ├── index.html, patterns.html  visual hub + interview cheat sheet
    └── [<Group folder>/]          one folder per pattern group (some topics are flat)
        ├── <problem>.ipynb        brute → optimal solutions, asserts, complexity benchmark
        ├── <problem>.html         interactive step-through
        └── <problem>_explained.md step-by-step trace write-up (where one exists)
```

## Running the notebooks

The notebooks need only the Python standard library. `matplotlib` is optional: it adds the complexity plots, and the benchmark tables still print without it. To set up the environment and start Jupyter:

```bash
uv venv && uv pip install jupyter matplotlib
uv run jupyter lab
```

Each notebook finds `bench_utils.py` by walking up from its own folder, so you can open it from anywhere in the repo. Blind 75 notebooks check correctness in a `# Correctness check` assert cell.

## Claude Code skills

Project skills live in [`.claude/skills/`](.claude/skills/). Claude picks one up automatically when your request matches. You can also call one directly as `/<skill-name> <arguments>`.

| Skill | What it does | Arguments / input | Output |
|---|---|---|---|
| [`leetcode-notebook`](.claude/skills/leetcode-notebook/SKILL.md) | Builds a study notebook for one LeetCode / Blind 75 problem. It can also restyle an existing notebook's Concepts cell into plain bullets. | Problem name or number (e.g. `Two Sum`), or a notebook/folder to reformat. | `blind_75/<Topic>/[<Group>/]<snake_case>.ipynb`, with cells in this order: concepts + "what is it" primers, problem, brute → optimal approaches, asserts, `bench_utils` benchmark, patterns learned. For a reformat: the Concepts cell is replaced in place. |
| [`leetcode-visualizer`](.claude/skills/leetcode-visualizer/SKILL.md) | Turns a topic's notebooks into self-contained interactive HTML explainers plus a patterns cheat sheet. | A topic (e.g. `Array`) or a single problem. The notebooks must exist first. | One `<problem>.html` next to each notebook, plus `blind_75/<Topic>/patterns.html` and `index.html`. Pages work offline with no CDNs. |
| [`dsa-snippet-explainer`](.claude/skills/dsa-snippet-explainer/SKILL.md) | Traces notebook code step by step in a `Step \| Action \| state` table that matches the notebook's asserts. | The target code cell or notebook. Optional: **file** mode (default is cell mode) and **Bengali** (default is English). | **Cell mode:** one markdown cell inserted after the code. **File mode:** `<notebook>_explained.md` next to the notebook. **Bengali:** a translated cell after the English one, or `_explained_bn.md`. |
| [`register-content`](.claude/skills/register-content/SKILL.md) | After content is added or moved, updates every index that should link to it and checks that all links resolve. | Optional path. With no path, it uses everything changed in `git status`. | Edits to the topic `README.md`, `index.html` and `patterns.html`, the track README tables and counts, `deep_dive/index.html`, and this README. Ends with a report of edited indexes and any broken links. It does not commit. |
| [`dsa-mock`](.claude/skills/dsa-mock/SKILL.md) | Runs a Socratic mock coding interview (DSA, SQL, follow-up variants). Claude plays the interviewer and never hands you the solution. | A pasted or named problem, optionally with follow-ups. | A live interview in chat, with free-form feedback at the end. |
| [`fde-system-design-mock`](.claude/skills/fde-system-design-mock/SKILL.md) | Runs a voice-friendly mock AI system design interview for a Forward Deployed Engineer role. | A use case or domain, optional. If you don't give one, it generates a fresh one. | A live interview in chat. Each answer gets a clarity/communication grade, and the session ends with a full scorecard. |

The repo also has a hook in [`.claude/settings.json`](.claude/settings.json). After any edit to an `.ipynb` file, it checks that the notebook is still valid JSON, so a broken edit is reported straight away.

### Note: `dsa-interactive-lesson` was removed

This skill used to generate the Deep Dive `NN_snake_lesson.html` pages: one self-contained HTML lesson per concept. Each page had 13 fixed sections, synced code highlighting, and Previous / Resume / Next / Reset trace controls. It was removed because its workflow depended on Genspark-only tools (`gsk screenshot`, `gsk understand_images`, `genspark_deliver_files`) that don't exist in Claude Code.

- **To make a new lesson:** copy the structure of an existing one, e.g. [`deep_dive/21_Backtracking/21_backtracking_lesson.html`](deep_dive/21_Backtracking/21_backtracking_lesson.html).
- **To restore the skill:** it is in git history (`git show 8779292:.claude/skills/dsa-interactive-lesson/SKILL.md`). Its reference template and `build_lesson.py` are in the same commit. Swap the Genspark steps for Claude Code equivalents before using it again.

The `excalidraw-diagram` skill was also removed from this repo, because the identical skill is installed globally in `~/.claude/skills/`.
