# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

DSA study repo: Jupyter notebooks + self-contained interactive HTML lessons + markdown write-ups. No build, no CI, no test runner — correctness lives in each notebook's `# Correctness check` cell (asserts).

## Tracks and naming

- `DSA_Deep_Dive/NN_Title_Case/` — concept tutorials, read in number order. Files: `NN_snake.ipynb`, `NN_snake_lesson.html`, `README.md` (+ optional `NN_snake_explained.md`).
- `DSA_Blind 75/<Topic>/[Group N_<pattern>/]` — interview problems. Files: `<problem>.ipynb`, `<problem>.html`, `<problem>_explained.md`, snake_case. Each topic has `README.md`, `index.html`, `patterns.html`.
- `Neetcode_150/` — `index.html` + `docs/` (reference docx/xlsx/pdf).
- Paths contain spaces (`DSA_Blind 75`, `Group 1_Basic Tree DFS`): always quote them in shell; URL-encode as `%20` in markdown links.

## Adding content

- New problem/topic is not done until every index linking it is updated: topic `README.md` + `index.html`, track `README.md` table (Blind 75 problem counts; Deep Dive "Interactive HTML" column), `DSA_Deep_Dive/index.html`, root `README.md`. Use `/register-content`.
- Use the existing skills in `.claude/skills/` (`leetcode-notebook`, `leetcode-visualizer`, `dsa-interactive-lesson`, `dsa-snippet-explainer`, …) rather than hand-rolling formats — they encode the house structure.
- Blind 75 notebook cell order: title + `**Difficulty:** · **Topic:** · **LeetCode:** <url>` → `## 💡 Concepts` → `## 📝 Problem` → setup cell → `### Approach N — <name>` (Idea/Time/Space + code), brute → optimal → `# Correctness check` → `## ⏱️ Empirically Checking the Complexities` → `## 🧩 Patterns Learned`.
- HTML lessons are single self-contained files (inline CSS/JS, no build step).

## Python

- Run notebooks in the root uv `.venv` (kernel `.venv`). Code is stdlib-only; `matplotlib` is optional (import guarded).
- `bench_utils.py` is duplicated in `DSA_Blind 75/` and `DSA_Deep_Dive/` — edit both copies identically. Notebooks locate it by walking up parent dirs onto `sys.path`; don't replace that with a relative import.
- Commit notebooks with executed outputs (do not strip them). Re-run the notebook after editing code cells so outputs match.

## Git

- Commits: short conventional one-liner, scope = track or topic, e.g. `feat(blind75-tree): add group 3 notebooks`; details in body. Make sure the message matches the diff.
- `.claude/skills/` is committed; `.claude/skills-workspace/` and `.claude/napkin.md` are not.
