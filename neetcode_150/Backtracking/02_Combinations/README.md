# Combinations

List every combination that meets a goal by building it one choice at a time (choose, explore, undo), with a start index so each set is built in only one order.

**Type:** Backtracking · **Problems:** 4 · [Interactive lesson](02_combinations_lesson.html)

## The tell

- "Return **all** combinations / all possible strings / all well-formed ...": the answers must be listed, not counted.
- Order inside an answer doesn't matter (`[2, 3]` and `[3, 2]` are the same combination).
- A reuse rule: "the same number may be chosen an unlimited number of times" (recurse with `i`) or "each number may only be used once" (recurse with `i + 1`).
- "May contain duplicates, but the answer must not contain duplicate combinations": sort and skip equal siblings.
- One choice per position from a fixed menu (digits → letters), or a rule that can be checked on a prefix (brackets that never close more than they opened).

## The idea

The search is a tree. Each call is a node holding a partial answer in one shared `path` list; each edge appends one more choice. A call only looks at choices from `start` onward, so earlier choices are never revisited and no answer is built twice. When the goal is met, save a copy (`path[:]`); after each recursive call, `pop` the choice so the next sibling starts clean. Sorting makes "too big" final: the first candidate that overshoots ends the loop (`break`).

```
Combination Sum, candidates = [2, 3, 6, 7], target = 7      [x] = remain at that call

[7]
├─ +2 → [5]
│   ├─ +2 → [3]
│   │   ├─ +2 → [1]
│   │   │   └─ +2 → stop (2 > 1: break)
│   │   ├─ +3 → [0]   save [2, 2, 3]
│   │   └─ +6 → stop (6 > 3)
│   ├─ +3 → [2]
│   │   └─ +3 → stop (3 > 2)        start = 1: the 2 is behind us, never tried again
│   └─ +6 → stop (6 > 5)
├─ +3 → [4]
│   ├─ +3 → [1]
│   │   └─ +3 → stop (3 > 1)
│   └─ +6 → stop (6 > 4)
├─ +6 → [1]
│   └─ +6 → stop (6 > 1)
└─ +7 → [0]   save [7]
```

## Template

The optimal approach in all four notebooks is this skeleton. Combination Sum uses it as written; the other problems change the marked lines.

```python
def combination_sum_start_index(candidates, target):
    candidates = sorted(candidates)        # sorted -> one overshoot ends the loop
    res = []
    def backtrack(start, remain, path):
        if remain == 0:                    # goal reached
            res.append(path[:])            # save a COPY, not the shared list
            return
        for i in range(start, len(candidates)):   # only forward: no reordered duplicates
            if candidates[i] > remain:
                break                      # prune: everything later is bigger too
            # (Combination Sum II) if i > start and candidates[i] == candidates[i - 1]: continue
            path.append(candidates[i])     # choose
            backtrack(i, remain - candidates[i], path)   # explore: i = reuse, i + 1 = once only
            path.pop()                     # un-choose
    backtrack(0, target, [])
    return res
```

The knobs: **the menu** at each level (candidates from `start`, the letters of `digits[i]`, `(` or `)`), **reuse** (`i` vs `i + 1`), **duplicates** (sort + `if i > start and c[i] == c[i - 1]: continue`), and **pruning** (`break` on overshoot, prefix rules such as `close < open`). Include/exclude (one yes/no decision per candidate) explores the same answers and appears in the notebooks as the alternate form.

## Problems

| # | Problem | Difficulty | Twist on the template | Time | Space | Notebook | Interactive |
|---|---------|------------|-----------------------|------|-------|----------|-------------|
| 1 | [Combination Sum](https://leetcode.com/problems/combination-sum/) | Medium | The template as is: recurse with `i` (reuse), `break` when a candidate exceeds `remain` | `O(N^(T/M + 1))` | `O(T/M)` | [notebook](combination_sum.ipynb) | [interactive](combination_sum.html) |
| 2 | [Combination Sum II](https://leetcode.com/problems/combination-sum-ii/) | Medium | Recurse with `i + 1` (once only) and skip a sibling equal to the previous one (`i > start`) | `O(2^n · n)` | `O(n)` | [notebook](combination_sum_ii.ipynb) | [interactive](combination_sum_ii.html) |
| 3 | [Letter Combinations of a Phone Number](https://leetcode.com/problems/letter-combinations-of-a-phone-number/) | Medium | The start index becomes the digit position `i`; level `i` loops over the letters of `digits[i]`; no pruning | `O(n · 4^n)` | `O(n)` | [notebook](letter_combinations_of_a_phone_number.ipynb) | [interactive](letter_combinations_of_a_phone_number.html) |
| 4 | [Generate Parentheses](https://leetcode.com/problems/generate-parentheses/) | Medium | The menu is `(` / `)`; counts prune: `(` while `open < n`, `)` while `close < open` | `O(4^n / √n)` | `O(n)` | [notebook](generate_parentheses.ipynb) | [interactive](generate_parentheses.html) |

`N` = number of candidates, `T` = target, `M` = smallest candidate, `n` = input length (or number of pairs). Space is the recursion depth, output not counted. All four are exponential because the output itself can be: the notebooks benchmark over a small growing parameter (target +4, elements +2, digits +1, pairs +1), so their ratios are per step, not per doubling.

Each notebook also has a slower approach for comparison: include/exclude for Combination Sum; a brute force that builds every subset and dedupes with a set (on `[1] * n` its time grows ≈4× per +2 elements while the template's stays flat) plus include/exclude with a run skip for Combination Sum II; an iterative level-by-level product for Letter Combinations (same Big-O, faster in CPython); and "build all `4^n` strings, then filter" for Generate Parentheses.

**Generate Parentheses** is filed under **Stack** by NeetCode (#24), because *checking* brackets is a stack/counter job. *Generating* every valid string is a backtracking build over a choice tree, so it sits in this pattern here.

## Traps and look-alikes

- **`res.append(path)` without a copy.** Every saved entry is the same list object, which ends up empty after the final pops. Save `path[:]`.
- **Missing `path.pop()`.** Choices leak into sibling branches. Every `append` needs its `pop`.
- **`i` vs `i + 1` vs `0`.** `i` allows reuse (Combination Sum), `i + 1` forbids it (Combination Sum II), `0` rebuilds the same set in every order (that would be permutations with repetition).
- **Duplicate skip with `i > 0` instead of `i > start`.** It wrongly skips the first copy at a deeper level and loses answers like `[1, 1, 6]`. Skip only between siblings, and sort first so equal values are adjacent.
- **Deduplicating with a set at the end.** Correct output, but every duplicate branch is still built: exponential extra work on inputs with many repeats.
- **`break` on unsorted candidates.** Without sorting, use `continue` (or the include/exclude fit check), otherwise valid smaller candidates later in the list are skipped.
- **Subsets look-alike** ([Subsets](../01_Subsets/README.md)): the same start-index loop, but every node is an answer (record at the top of every call), not only nodes that hit a target.
- **Permutations look-alike** ([Permutations](../03_Permutations/README.md)): order matters, so each level loops over *all* unused items (a `used` set or swaps), not from a start index.
- **Counting instead of listing** (Coin Change II, Combination Sum IV): if only the number of combinations is asked, use DP; backtracking would enumerate an exponential number of answers just to count them.

## Say it in the interview

"We need every combination, so I'll backtrack: append a choice, recurse, pop it. A start index means I never go back to earlier candidates, so each set is generated exactly once, and I pass `i` because reuse is allowed (`i + 1` if it weren't, plus a sorted skip of equal siblings when the input has duplicates). I sort so I can break as soon as a candidate exceeds what's left; the running time is exponential, bounded by the number of answers, and the extra space is the recursion depth."
