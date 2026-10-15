---
name: leetcode-notebook
description: Generate a structured Jupyter notebook (.ipynb) for a LeetCode / Blind 75 problem. Each notebook opens with the underlying concepts — including a first-principles "what is it" primer for every data structure/technique named (e.g. what a hash map is and how it works) — then presents multiple Python solutions ordered by complexity (brute-force → better → optimal), each with a markdown explanation, inline-commented code, and complexity analysis, and closes with the reusable patterns learned. Invoke when the user asks to "make a notebook", "solve", "implement", or "practice" a specific LeetCode/Blind 75 problem, or wants a study notebook for one. Also use it to reformat an existing notebook's Concepts/theory cell into plain-language bullets (one notebook or a whole folder) when the user asks to make it "easier to read", "simpler language", or "proper bullet points".
---

# LeetCode Notebook Generator

Produce a single Jupyter notebook (`.ipynb`) per problem that doubles as a **learning document** and a **runnable solution set**. The notebook must teach the concept, show a progression of solutions from worst to best complexity, and distill transferable patterns.

## When to use

- User names a specific problem ("make a notebook for Two Sum", "implement Coin Change", "practice Number of Islands").
- User wants to work through Blind 75 / LeetCode problems as study notebooks.
- If the user names a topic or "next problem" without a specific one, pick the next unchecked problem from `Blind75_Tracker.md` (if present) and confirm before generating.

## Output location & naming

- Save notebooks in the topic folder, inside the pattern-group subfolder when the topic has groups: `blind_75/<Topic>/[<Group folder>/]<snake_case>.ipynb`, e.g. `blind_75/Tree/Group 1_Basic Tree DFS/same_tree.ipynb`. List the topic folder first and reuse the existing group folder whose pattern fits; ask before creating a new group. Paths contain spaces — quote them.
- The shared `bench_utils.py` lives once at `blind_75/bench_utils.py` (a byte-identical copy is at `deep_dive/bench_utils.py`; change both together).
- After saving, run the `register-content` skill so the topic README/index pages link the new notebook.
- File name: `snake_case` of the problem title.
- One notebook per problem. Do **not** overwrite an existing notebook without asking.

## How to build the file

Use the **NotebookEdit** tool to create cells one at a time (preferred — validates structure), or **Write** a complete valid `.ipynb` JSON (nbformat 4, `"language": "python"`). Every code cell must be **runnable top-to-bottom** with no external dependencies beyond the Python standard library (`collections`, `heapq`, `bisect`, `math`, `typing`, etc.). Include a `__main__`-style test block in the final code cell.

## Required notebook structure

Build the cells in this exact order.

### 1. Title cell (markdown)
```
# <Problem Number>. <Problem Title>
**Difficulty:** 🟢/🟡/🔴 · **Topic:** <topic> · **LeetCode:** <url>
```

### 2. Concepts cell (markdown) — *explain the concepts BEFORE any code*
Explain the data structures / techniques the problem is built on, so the reader understands the "why" before the "how". Cover:
- **Core concept(s):** e.g. hashing, two pointers, sliding window, DFS/BFS, DP, binary search, heap.
- **Why they apply here:** the property of the problem that makes each technique viable.
- **Key intuition / mental model** in 2–4 sentences.
- **Prerequisite knowledge** (short bullet list) if any.

**MANDATORY — "What is it?" primer for every named data structure / technique.**
Assume the reader may be meeting the concept for the first time. Whenever the notebook names a data structure or algorithmic technique *anywhere* (concepts cell, an approach's idea, or the Patterns Learned cell) — hash map, heap/priority queue, stack, queue, deque, trie, linked list, binary search, two pointers, sliding window, DFS, BFS, recursion, memoization, dynamic programming, union-find, etc. — the Concepts cell MUST include a short first-principles primer for it. Give each primer a **bold sub-heading** and cover:
- **What it is:** a plain-English definition, one or two sentences.
- **How it works internally / mental picture:** the underlying mechanism (e.g. a hash map hashes a key to a bucket index for direct access).
- **Key operations + complexity:** the common operations and their Big-O (e.g. insert / lookup / delete: O(1) average for a hash map).
- **In Python:** the concrete built-in or stdlib type used (e.g. `dict`/`set`, `list`, `collections.deque`, `heapq`).

**Write the Concepts cell as plain-language bullets, never dense paragraphs:**
1. One idea per bullet. A paragraph making three points becomes three bullets — no chaining ideas with `--` or semicolons.
2. Simplify the words, not the content. Every Big-O bound, definition, caveat, and example stays; only the phrasing gets plainer.
3. Each primer keeps its **bold sub-heading**, then bullets for what it is / how it works / operations + complexity / in Python.
4. Code spans and Big-O notation are written exactly (`O(N²)`, `` `"".join(pieces)` ``).
5. Ordered steps stay a numbered list.
6. A closing "one thing to remember" intuition, if any, is its own short line — not buried in a bullet.

Example primer:
> **What is a Hash Map?**
> - A hash map (Python `dict`) stores key → value pairs.
> - It runs each key through a *hash function* to pick a slot in an array, so it jumps straight to the value instead of scanning.
> - Insert, lookup, and delete are **O(1) on average** (O(n) in rare worst-case collisions).
> - In Python: `dict` for key → value, `set` when you only need membership.
> - Why it matters here: we can check "have I seen this value?" inside a loop without a second scan.

Only write a primer once per concept per notebook — do not repeat it if the same structure appears in multiple approaches.

### 3. Problem statement cell (markdown)
Restate the problem concisely in your own words + 1–2 example input/output pairs + constraints.

### 4. Solution progression — one **markdown + code** pair per approach
Provide **three** approaches when the problem admits them, clearly labeled. If only two meaningfully distinct approaches exist, provide two and say so; never pad with duplicates.

Order them **worst → best**:

| Label | Meaning |
|-------|---------|
| **Approach 1 — Brute Force** | Highest time/space complexity; the intuitive first idea. |
| **Approach 2 — Better** | An intermediate optimization (e.g. sorting, memoization). |
| **Approach 3 — Optimal** | Best achievable time/space; the interview target. |

For **each** approach:

**a) Markdown cell** containing:
- `### Approach N — <name>`
- **Idea:** how the approach works, step by step.
- **Time complexity:** `O(...)` with a one-line justification.
- **Space complexity:** `O(...)` with a one-line justification.

**b) Code cell** containing:
- A clean function/class implementation using type hints.
- **Inline comments** on the non-obvious lines explaining *what* and *why* (match the density to the logic — comment the trick, not the trivial).
- The function should be named to reflect the approach, e.g. `two_sum_brute`, `two_sum_optimal`.

### 5. Test / verification cell (code)
One final code cell that runs all approaches against a few test cases and prints results, so the reader can confirm correctness by running the notebook.

### 6. Empirical complexity benchmark (markdown + code) — *confirm the Big-O by measuring*
After correctness is verified, add a section that lets the reader **observe** each approach's complexity instead of taking the claimed Big-O on faith.
- **Markdown cell:** explain that Big-O can't be read off directly but can be measured via the **doubling ratio** — time each approach on inputs of growing `n` and watch how runtime grows when `n` doubles (~2× ⇒ linear/`n log n`, ~4× ⇒ quadratic, ~1× ⇒ constant/log). Include the expected-ratio table.
- **Code cell — reuse the shared helper, do NOT re-implement the loop.** Every notebook imports one tested function from `blind_75/bench_utils.py`:
  - `benchmark(solutions, make_worst_case, sizes, repeats=1, plot=False)` prints the per-approach `n | time (ms) | ratio vs prev` table and, when `plot=True`, draws a log-log runtime chart with O(n)/O(n²) reference slopes. The matplotlib import inside it is **guarded** — if matplotlib is missing it prints a skip message and the table still works, so the notebook never hard-depends on a third-party library.
  - The notebook's benchmark cell only declares three things and calls the helper:
    1. a **bootstrap** that locates `bench_utils.py` by walking up from `os.getcwd()` and adds it to `sys.path` (so it works whatever folder the kernel starts in), then `from bench_utils import benchmark`;
    2. `make_worst_case(n)` — returns a **tuple** of args producing a worst-case (no-early-exit) input of size `n`;
    3. `solutions` (label → function) and `sizes` (doubling, e.g. `[1000, 2000, 4000, 8000]`); then `benchmark(solutions, make_worst_case, sizes, plot=True)`.
  - **Watch out for arithmetic that isn't O(1):** if the algorithm multiplies values into ever-larger integers (e.g. product problems), Python big-int math inflates the timing and hides the true shape. Use bounded-magnitude worst-case inputs (e.g. values in `{+1, -1}`) so each operation stays O(1).
  - Keep `sizes` modest enough that the slowest approach (e.g. O(n³) brute) finishes in a few seconds. Helper output is ASCII-only so it runs in any console.
  - Never create another `bench_utils.py`; every topic and group folder shares the one at the `blind_75/` root (found by the walk-up bootstrap).

### 7. Patterns Learned cell (markdown) — *at the very end*
```
## 🧩 Patterns Learned
```
A bulleted list of transferable takeaways from this problem:
- The **named pattern(s)** (e.g. "Hash Map for O(1) complement lookup", "Two-pointer on sorted array", "Kadane's algorithm").
- **When to reach for this pattern** — the signal in a problem statement that hints at it.
- **Related problems** that use the same pattern (2–4 examples).
- **Common pitfalls** to avoid.

## Quality bar

- Complexity claims must be **correct** — double-check the Big-O for every approach, and confirm the empirical benchmark's doubling ratios actually track those claims.
- **Reuse the shared `bench_utils.benchmark` helper** (section 6) — never hand-roll the timing loop in a notebook; that keeps every notebook consistent and lets fixes land in one place.
- **Every named data structure / technique has a "What is it?" primer** in the Concepts cell (see section 2) — never reference a concept the reader hasn't been introduced to.
- Code must actually run and produce correct output for the test cases.
- Comments explain reasoning, not restate syntax.
- Keep markdown tight and skimmable; use bold labels and short bullets over long paragraphs.
- After generating, tell the user the file path and offer to tick the problem off in `Blind75_Tracker.md`.

## Reformatting an existing Concepts cell

When the user asks to make an existing notebook's Concepts/theory cell easier to read (one notebook or a whole folder):

1. Read the notebook and find the `## 💡 Concepts` cell id. Touch only that cell unless the user names another — Problem, Approach, and Patterns Learned cells stay as they are.
2. Rewrite it with the bullet rules in section 2. This is a reformat, not a rewrite: don't invent facts, don't drop any. If unsure whether a compression loses precision, keep the original claim.
3. `NotebookEdit` with `edit_mode: replace` on that cell id. No need to re-run code — nothing executable changed.
4. Folder batches: one notebook at a time, each keeps its own primers and examples (only the shape is shared). Report the list of files updated.

## Minimal cell template (for reference)

Markdown (concepts):
> **Core concept:** Hash map for constant-time lookups.
> - **Why here:** for each element we must know whether its complement exists — a membership test a hash map answers in O(1).

Code (optimal):
```python
from typing import List

def two_sum_optimal(nums: List[int], target: int) -> List[int]:
    seen = {}                       # value -> index of values we've passed
    for i, x in enumerate(nums):
        need = target - x           # the complement that would complete the pair
        if need in seen:            # O(1) membership test — the whole point
            return [seen[need], i]
        seen[x] = i                 # record current value for future complements
    return []
```
