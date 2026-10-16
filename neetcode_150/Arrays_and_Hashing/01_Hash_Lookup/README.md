# Hash Lookup

Replace an inner "search the rest of the data" loop with an O(1) average membership test in a hash set or hash map: remember what you have seen, and ask the memory instead of rescanning.

**Type:** Arrays and Hashing · **Problems:** 4 · [Interactive lesson](01_hash_lookup_lesson.html)

## The tell

- **"Have I seen this before?"**: duplicates, "all unique?", "appears at least twice", "first repeated".
- **"Does its partner exist?"**: a pair that sums or matches to a target (the partner is a *complement* you can compute, `target - x`).
- **"No repeats within each group"**: rows, columns, boxes, buckets. Give each group its own set.
- **"Is the neighbour present?"**: runs of consecutive values, "x - 1 / x + 1 exists", especially with "O(n), no sorting".
- The brute force is a nested loop whose inner loop only *looks for* a value. That inner search is what a hash lookup replaces.

## The idea

A Python `set` (or `dict`) hashes a value straight to a slot, so `x in seen` costs O(1) on average instead of the O(n) a list scan costs. Walk the input once. For each item, compute the **key** whose presence would answer the question, look it up, and only then record the current item.

```
Contains Duplicate, nums = [1, 2, 3, 1]

 i   x   x in seen?   seen after
 0   1   no           {1}
 1   2   no           {1, 2}
 2   3   no           {1, 2, 3}
 3   1   YES  -> return True        (one pass; no pair of positions compared)
```

The four problems differ only in the key they look up and what the memory stores:

```
problem               look up                 memory
Contains Duplicate    x                       set of values
Two Sum               target - x              dict value -> index
Valid Sudoku          v in its row/col/box    one set per row, column, box
Longest Consecutive   x - 1, then x + k       set of all values (built first)
```

## Template

The optimal approach in all four notebooks (`contains_duplicate_set`, `two_sum_optimal`, `is_valid_sudoku_sets`, `longest_consec_set`) is this skeleton.

```python
def hash_lookup(items):
    seen = set()                 # or dict: value -> what you need later (index, ...)
    for x in items:
        key = x                  # what would answer the question: x, target - x, (unit, x), x - 1
        if key in seen:          # O(1) average membership test: the whole point
            return ...           # found: a repeat, a partner, a conflict
        seen.add(x)              # record x only AFTER the check, so x can't match itself
    return ...                   # nothing found
```

Longest Consecutive Sequence uses the two-phase form: build the whole set first (`numset = set(nums)`), then loop over it and probe neighbours (`x - 1 not in numset`, `x + length in numset`).

## Problems

| # | Problem | Difficulty | Twist on the template | Time | Space | Notebook | Interactive |
|---|---------|------------|-----------------------|------|-------|----------|-------------|
| 1 | [Contains Duplicate](https://leetcode.com/problems/contains-duplicate/) | Easy | None: the key is `x` itself, the memory a `set` | `O(n)` | `O(n)` | [notebook](contains_duplicate.ipynb) | [interactive](contains_duplicate.html) |
| 2 | [Two Sum](https://leetcode.com/problems/two-sum/) | Easy | Look up the complement `target - x`; store `x -> index` in a `dict` | `O(n)` | `O(n)` | [notebook](two_sum.ipynb) | [interactive](two_sum.html) |
| 3 | [Valid Sudoku](https://leetcode.com/problems/valid-sudoku/) | Medium | Three families of sets (rows, columns, boxes `(r // 3, c // 3)`); check all three, then add to all three | `O(n²)` | `O(n²)` | [notebook](valid_sudoku.ipynb) | [interactive](valid_sudoku.html) |
| 4 | [Longest Consecutive Sequence](https://leetcode.com/problems/longest-consecutive-sequence/) | Medium | Build the set first; start a run only where `x - 1` is missing, then grow it with `x + length in numset` | `O(n)` | `O(n)` | [notebook](longest_consecutive_sequence.ipynb) | [interactive](longest_consecutive_sequence.html) |

Valid Sudoku's `n` is the board side: on LeetCode's fixed 9×9 board both its approaches are `O(1)`. The notebook grows the board to `n×n` (`n = b²`) to measure the gap: the brute force rescans each cell's row, column and box (`O(n³)`, ≈48–57× per 16× more cells) against ≈14–18× for the sets. The other brute forces: Contains Duplicate and Two Sum check every pair (`O(n²)`); both also have a sort-based `O(n log n)` middle step, and Longest Consecutive Sequence's only alternative is sort-then-scan (`O(n log n)`).

## Traps and look-alikes

- **Adding before checking.** In Two Sum, `[3, 3]` with target 6 must return `[0, 1]`; with `[3, 2, 4]`, inserting `3` before looking up `6 - 3` would pair index 0 with itself. Check first, then record.
- **A `list` as the memory.** `x in some_list` scans the list, O(n) per test, and the whole thing goes back to O(n²). Use `set` / `dict`.
- **Sorting when the answer is indices.** Sorting Two Sum's array loses the original positions unless you carry them along (the notebook's `(value, index)` pairs). The hash map keeps them for free.
- **Sorted input → Two Pointers instead.** Two Sum II gives a sorted array: two pointers find the pair in O(1) extra space, while a hash map spends O(n).
- **"Constant extra memory" or a linked list → not a set.** Linked List Cycle can be solved with a `set` of visited nodes, but the O(1)-space answer is Floyd's fast/slow pointers.
- **Counting runs from every element.** In Longest Consecutive Sequence, without the `x - 1 not in numset` start check each element walks its whole run, and a long run becomes O(n²).
- **Valid ≠ solvable.** Valid Sudoku only checks the digits already placed. Filling the board is Sudoku Solver (backtracking).
- **Box id collisions.** `(r // 3, c // 3)` or `r // 3 * 3 + c // 3` identify a box; `r // 3 + c // 3` does not (boxes `(0, 1)` and `(1, 0)` would share a key).

## Say it in the interview

"The brute force is a nested loop where the inner loop only searches for a value, so I'll replace that search with a hash set: as I walk the array I remember what I've seen, and for each element I ask the set for the value that would answer the question, the element itself, its complement, or its neighbour. I check before I insert so an element can't match itself. That's one pass with O(1) average lookups: O(n) time for O(n) extra space."
