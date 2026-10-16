# Subsets

Build every subset with one include/exclude decision per element: take `nums[i]`, recurse, take it back out, then recurse without it. Each leaf of the recursion tree is one subset.

**Type:** Backtracking · **Problems:** 2 · [Interactive lesson](01_subsets_lesson.html)

## The tell

- The answer is **every selection**: "all subsets", "power set", "all combinations of any size".
- Each element is **either picked or not**, and order inside a selection does not matter (`[1, 2]` = `[2, 1]`).
- The output size is `2ⁿ` and the constraints are tiny (`n <= 10`): an exponential answer is expected.
- "May contain duplicates" + "must not contain duplicate subsets" → the same template plus **sort + skip equal values at the same decision point**.

## The idea

`backtrack(i)` decides `nums[i]`. One shared `path` holds the elements chosen so far. Include: append, recurse into `i + 1`, pop. Exclude: recurse into `i + 1` without it. After `n` decisions, `path` is a complete subset, so record a copy. `n` binary decisions give `2ⁿ` leaves, one per subset.

```
nums = [1, 2, 3]          +x = include x        skip x = exclude x

                         []                         decide 1
               +1 /             \ skip 1
               [1]                 []               decide 2
          +2 /    \ skip 2     +2 /   \ skip 2
          [1,2]    [1]        [2]      []           decide 3
         /    \   /   \      /   \    /   \
   [1,2,3] [1,2] [1,3] [1] [2,3] [2] [3]  []        leaves = the 8 subsets
```

With duplicates (`[1, 2, 2]`, sorted): the exclude branch jumps past **all** remaining copies of the value, so each value's copy count (`2, 1, 0` twos) is chosen once and only the 6 distinct subsets are built.

## Template

The optimal approach in both notebooks (`subsets_include_exclude`, `subsets_with_dup_include_exclude`) is this skeleton; Subsets II adds the sort and the run skip marked below.

```python
def subsets(nums):
    nums = sorted(nums)                  # Subsets II only: copies of a value become one run
    n = len(nums)
    out, path = [], []

    def backtrack(i):
        if i == n:                       # every element decided: path is one subset
            out.append(path[:])          # record a COPY, path keeps changing
            return
        path.append(nums[i])             # CHOOSE: include nums[i]
        backtrack(i + 1)                 # EXPLORE (the next copy may be included too)
        path.pop()                       # UN-CHOOSE before trying the other branch

        j = i + 1                        # EXCLUDE nums[i]; Subsets II also skips every
        while j < n and nums[j] == nums[i]:   # remaining copy of it (plain Subsets: j = i + 1)
            j += 1
        backtrack(j)

    backtrack(0)
    return out
```

Alternate shape, also in both notebooks (`subsets_start_index`, `subsets_with_dup_start_index`): record on entry, then loop over the next element to add; the duplicate skip lives in the loop.

```python
def backtrack(start):
    out.append(path[:])                  # every node of this tree is a subset
    for i in range(start, len(nums)):
        if i > start and nums[i] == nums[i - 1]:
            continue                     # Subsets II only: equal sibling already built this branch
        path.append(nums[i])
        backtrack(i + 1)                 # only move right: [1, 2] yes, [2, 1] never
        path.pop()
```

## Problems

| # | Problem | Difficulty | Twist on the template | Time | Space | Notebook | Interactive |
|---|---------|------------|-----------------------|------|-------|----------|-------------|
| 1 | [Subsets](https://leetcode.com/problems/subsets/) | Medium | None: the template as is (`j = i + 1`) | `O(n·2ⁿ)` | `O(n)` | [notebook](subsets.ipynb) | [interactive](subsets.html) |
| 2 | [Subsets II](https://leetcode.com/problems/subsets-ii/) | Medium | Sort, then the exclude branch skips the whole run of equal values (start-index form: `if i > start and nums[i] == nums[i - 1]: continue`) | `O(n·D)` | `O(n)` | [notebook](subsets_ii.ipynb) | [interactive](subsets_ii.html) |

Space excludes the output. `D` = number of distinct subsets, the product of `(count + 1)` over the distinct values (`2ⁿ` when all differ, `n + 1` when all are equal). Both notebooks also solve the problem with a bitmask brute force (`O(n·2ⁿ)`; Subsets II adds a set of tuples to drop repeats) and with the start-index loop. Benchmarks grow `n` by one element per row: every Subsets approach measures about 2× per element; on `[0] * n` the Subsets II brute force still measures about 2× while both backtracking forms stay about 1×.

## Traps and look-alikes

- **`out.append(path)` without a copy.** Every entry is the same list object, and it is empty when the recursion ends.
- **Missing `path.pop()`.** The exclude branch still carries `nums[i]`, so "excluded" subsets contain it.
- **Recording at every call in the include/exclude form.** Only leaves (`i == n`) are complete; recording internal nodes duplicates subsets. (The start-index form is the one that records on entry.)
- **Duplicate skip without sorting,** or with `i > 0` instead of `i > start`: the first misses non-adjacent copies; the second never builds `[2, 2]`.
- **Skipping the run on the include branch** instead of the exclude branch: a value can then never repeat inside a subset.
- **Filtering with a set afterwards.** Correct, but it still builds all `2ⁿ` subsets (the notebook measures it).
- **Combinations look-alike** ([Combinations](../02_Combinations/README.md)): same tree, but only paths of size `k` or with a target sum are recorded, and a sum lets you prune. Subsets records every leaf.
- **Permutations look-alike:** order matters there (`[1, 2]` ≠ `[2, 1]`), so each level may pick any unused element (a `used` array), not just elements to the right.

## Say it in the interview

"Every element is either in or out, so there are `2ⁿ` subsets; I'll backtrack over the index with an include branch and an exclude branch, sharing one path list that I pop after the include call, and append a copy at the leaves. That's `O(n·2ⁿ)` time, the size of the output, and `O(n)` extra space. If there are duplicates I sort first and make the exclude branch skip the whole run of equal values, so each distinct subset is built exactly once."
