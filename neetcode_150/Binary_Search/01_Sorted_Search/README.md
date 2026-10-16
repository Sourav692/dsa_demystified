# Sorted Search

Find a value, or the boundary next to it, in data that is already sorted, by keeping a range `[lo, hi]` and throwing away half of it after every comparison with the middle.

**Type:** Binary Search · **Problems:** 3 · [Interactive lesson](01_sorted_search_lesson.html)

## The tell

- The input is **sorted**: "sorted in ascending order", "each row is sorted", timestamps that "are strictly increasing".
- The task is to **find** something in it: an index, yes/no membership, or "the value at time `t`".
- A required speed of **`O(log n)`** (or `O(log(m·n))`), which rules out reading every element.
- Boundary wording: "largest timestamp `<=` t", "most recent at or before", "first position where …", "insert position".
- The data is sorted **in some reading order** even if it is not a flat list: a grid read row by row, a per-key history list.

## The idea

Keep a range `[lo, hi]` that is guaranteed to contain the answer if there is one. Compare the target with the middle element. Because the data is sorted, that single comparison proves that one whole half cannot hold the answer, so drop it, **including `mid`** (`lo = mid + 1` or `hi = mid - 1`). The range shrinks every step, so the loop ends after about `log₂ n + 1` comparisons. When `lo > hi` the range is empty.

```
nums = [-1, 0, 3, 5, 9, 12], target = 9

 index:   0   1   2   3   4   5
         -1   0   3   5   9  12
step 1:  lo      mid         hi     nums[2] = 3 < 9  -> lo = 3   (drop 0..2)
step 2:              lo  mid hi     nums[4] = 9 == 9 -> return 4
```

Two shapes of the same loop cover all three problems:

- **Exact match** (Binary Search, Search a 2D Matrix): return as soon as `nums[mid] == target`; return `-1` / `False` when the range empties.
- **Boundary** (Time Based Key-Value Store): there is no exact match to stop on. When `nums[mid]` fits the condition (`time <= t`), **record it as a candidate** and keep searching the side where a better one could be (`lo = mid + 1` for "the last one that fits"). The last candidate recorded is the answer.

## Template

The optimal approach in every notebook (`search_binary`, `search_matrix_flat`, `TimeMap.get`) is this skeleton.

```python
def sorted_search(nums, target):
    lo, hi = 0, len(nums) - 1          # inclusive range: the answer, if any, is in nums[lo..hi]
    while lo <= hi:                    # range still holds at least one element
        mid = (lo + hi) // 2           # Python ints don't overflow; lo + (hi - lo) // 2 in Java/C++
        if nums[mid] == target:
            return mid                 # exact-match form: done
        if nums[mid] < target:
            lo = mid + 1               # mid and everything left of it are too small
        else:
            hi = mid - 1               # mid and everything right of it are too big
    return -1                          # range empty: not present

def last_at_or_before(times, t):       # boundary form (Time Based Key-Value Store)
    res = -1
    lo, hi = 0, len(times) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if times[mid] <= t:
            res = mid                  # fits: record it, then look right for a later one
            lo = mid + 1
        else:
            hi = mid - 1               # too late: the answer is to the left
    return res                         # index of the last time <= t, or -1
```

## Problems

| # | Problem | Difficulty | Twist on the template | Time | Space | Notebook | Interactive |
|---|---------|------------|-----------------------|------|-------|----------|-------------|
| 1 | [Binary Search](https://leetcode.com/problems/binary-search/) | Easy | None: the exact-match template as is | `O(log n)` | `O(1)` | [notebook](binary_search.ipynb) | [interactive](binary_search.html) |
| 2 | [Search a 2D Matrix](https://leetcode.com/problems/search-a-2d-matrix/) | Medium | Search flat indices `0 .. m·n - 1`; read each one with `r, c = divmod(mid, n)` | `O(log(m·n))` | `O(1)` | [notebook](search_a_2d_matrix.ipynb) | [interactive](search_a_2d_matrix.html) |
| 3 | [Time Based Key-Value Store](https://leetcode.com/problems/time-based-key-value-store/) | Medium | Hash map of per-key `(time, value)` lists; boundary form "last time `<= t`" on `get` | `get` `O(log n)`, `set` `O(1)` | `O(N)` stored | [notebook](time_based_key_value_store.ipynb) | [interactive](time_based_key_value_store.html) |

Each notebook also solves the problem without binary search and measures the difference: a linear scan (`O(n)`, ≈2× per doubling), a cell-by-cell scan and a top-right "staircase" walk for the matrix (`O(m·n)` and `O(m + n)`, ≈2× and ≈1.5× per doubling on a square grid), and a full history scan per `get` (`O(n)`, ≈2× per doubling). The binary searches stay ≈1×.

## Traps and look-alikes

- **Mixing loop styles.** `while lo <= hi` goes with `hi = len - 1` and `hi = mid - 1`. Writing `while lo < hi` here skips the last element (a one-element array returns `-1`); writing `lo = mid` or `hi = mid` can stop the range from shrinking and loop forever.
- **Boundary search that stops too early.** In Time Based Key-Value Store, returning at the first `times[mid] <= t` gives *a* valid time, not the *latest* one. Record and keep going right. After the loop `hi` is the answer's index and `lo` is one past it.
- **Flattening the wrong way.** The 2D index map is `divmod(mid, n)` with `n` = number of **columns**. And it is only valid when each row starts above the previous row's end; if rows are sorted but do not chain (Search a 2D Matrix II), use the `O(m + n)` staircase walk instead.
- **[Rotated Array](../02_Rotated_Array/README.md)** look-alike: "sorted" but shifted. A plain comparison with `nums[mid]` no longer tells you which half to drop; first find which half is sorted.
- **[Search on Answer](../03_Search_on_Answer/README.md)** look-alike: there is no sorted array to search, only a range of possible answers (a speed, a capacity) and a yes/no `feasible(x)` that flips once. Same halving, applied to the answer instead of an index.
- **[Partition Search](../04_Partition_Search/README.md)** look-alike: two sorted arrays and a median or k-th element. Binary search the cut position in the smaller array, not a value.
- **Sorted input that should use two pointers.** "Find a pair summing to x" in a sorted array is two pointers (`O(n)`), not `n` binary searches (`O(n log n)`).

## Say it in the interview

"The data is sorted, so one comparison with the middle tells me which half can't contain the answer. I keep an inclusive range `[lo, hi]` with the invariant 'if the answer exists it's in here', and move `lo` or `hi` past `mid` each step, so the loop runs `O(log n)` times with `O(1)` space. For the 'latest at or before `t`' variant there's no exact hit, so I record each `mid` that fits and keep searching right; the last one recorded is the answer."
