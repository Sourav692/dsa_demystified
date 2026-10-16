# Partition Search

Binary search for a **cut** through two sorted arrays, not for a value: choose how many elements the left half takes from the smaller array, and the other array's share is forced.

**Type:** Binary Search · **Problems:** 1 · [Interactive lesson](04_partition_search_lesson.html)

## The tell

- **Two sorted arrays**, and the question is about their **combined order**: "median of the two arrays", "k-th smallest of the union".
- A required time of `O(log (m + n))`. Merging is `O(m + n)`, so anything that reads every element is ruled out.
- The answer sits on the **boundary between a left group and a right group**: "the middle", "the k smallest", "split into two equal halves".

## The idea

The median splits the merged array into a left half and a right half. You never need the merged array, only **how many values of each array sit in the left half**. If the left half must hold `half` values and takes `i` from the smaller array `A`, it takes `j = half - i` from `B`. One unknown, `i`, so binary search it over `0 .. m`.

A cut is valid when every left value is `<=` every right value. The arrays are sorted, so only the four values next to the cuts need checking:

```
A = [8, 11, 16, 19]          B = [2, 4, 7, 10, 14, 17]          half = (4 + 6 + 1) // 2 = 5

guess i=2, j=3:  A: 8 11 | 16 19       B: 2 4 7 | 10 14 17
                 a_left 11 > b_right 10  -> too many from A, move the cut left  (hi = 1)

guess i=0, j=5:  A: | 8 11 16 19       B: 2 4 7 10 14 | 17
                 b_left 14 > a_right 8   -> too few from A, move the cut right  (lo = 1)

guess i=1, j=4:  A: 8 | 11 16 19       B: 2 4 7 10 | 14 17
                 8 <= 14 and 10 <= 11    -> valid. even total: (max(8,10) + min(11,14)) / 2 = 10.5
```

## Template

The optimal approach in the notebook (`find_median_partition`) is this skeleton.

```python
def find_median_partition(nums1, nums2):
    A, B = nums1, nums2
    if len(A) > len(B):
        A, B = B, A                     # search the SMALLER array: keeps j in 0..n, O(log min(m, n))
    m, n = len(A), len(B)
    half = (m + n + 1) // 2             # left-half size; the +1 gives it the extra value when the total is odd
    lo, hi = 0, m                       # i = how many values the left half takes from A
    while lo <= hi:
        i = (lo + hi) // 2              # cut in A
        j = half - i                    # cut in B is forced
        a_left  = A[i - 1] if i > 0 else float("-inf")   # sentinels: an empty side never blocks the check
        a_right = A[i]     if i < m else float("inf")
        b_left  = B[j - 1] if j > 0 else float("-inf")
        b_right = B[j]     if j < n else float("inf")
        if a_left <= b_right and b_left <= a_right:      # valid: every left value <= every right value
            if (m + n) % 2:
                return float(max(a_left, b_left))        # odd: the largest left value
            return (max(a_left, b_left) + min(a_right, b_right)) / 2
        elif a_left > b_right:
            hi = i - 1                  # too many from A: move the cut left
        else:
            lo = i + 1                  # too few from A: move the cut right
```

## Problems

| # | Problem | Difficulty | Twist on the template | Time | Space | Notebook | Interactive |
|---|---------|------------|-----------------------|------|-------|----------|-------------|
| 1 | [Median of Two Sorted Arrays](https://leetcode.com/problems/median-of-two-sorted-arrays/) | Hard | None: the template as is; odd totals return `max(left)`, even totals average `max(left)` and `min(right)` | `O(log min(m, n))` | `O(1)` | [notebook](median_of_two_sorted_arrays.ipynb) | [interactive](median_of_two_sorted_arrays.html) |

The notebook also solves it by merging (`O(m + n)` time and space) and by walking two pointers to the middle (`O(m + n)` time, `O(1)` space). Measured on two arrays of `n` values each (`n` = 125,000 → 1,000,000), both linear approaches grow about 2× per doubling while the partition search stays about 1× (17 → 20 binary-search steps; that row times 1000 calls because one call takes microseconds).

## Traps and look-alikes

- **Searching the larger array.** With `m > n`, some `i` give `j = half - i < 0` or `> n`, and `B[j - 1]` / `B[j]` go out of range. Swap first.
- **Forgetting the sentinels.** Cuts at `i = 0` or `i = m` (and `j = 0` or `j = n`) have a missing neighbour. Treat a missing left as `-inf` and a missing right as `+inf`; the check then works unchanged.
- **Mixing up the half size.** `half = (m + n + 1) // 2` puts the extra value on the left, so odd totals return `max(a_left, b_left)`. With `(m + n) // 2` the odd answer is `min(a_right, b_right)` instead. Pick one convention and keep it.
- **Integer division in the average.** `(x + y) // 2` floors `10 + 11` to `10`; use `/ 2`.
- **[Sorted Search](../01_Sorted_Search/README.md) look-alike.** Classic binary search looks for a *value* in one array. Here no value is searched for: the search space is the cut positions `0 .. m`, and the comparison is between the two arrays' boundary values.
- **Merging is the trap answer.** "Two sorted arrays" suggests the merge step of merge sort. It is correct but `O(m + n)`; the notebook's two-pointer walk halves the work but is still linear.
- **Find Median from Data Stream** (Heap · Two Heaps) shares the "left half / right half" picture, but the values arrive one by one and are unsorted, so it keeps two heaps instead of binary searching.

## Say it in the interview

"Merging is O(m + n), but the problem asks for O(log (m + n)), so I won't build the merged array. The left half of the merged order takes some `i` elements from the smaller array and `half - i` from the other, so I binary search `i`. A cut is valid when `A[i-1] <= B[j]` and `B[j-1] <= A[i]`, using minus and plus infinity for missing neighbours; if `A[i-1]` is too big I move left, otherwise right. That is O(log min(m, n)) time and O(1) space."
