# Rotated Array

Binary search on a sorted array that was cut at an unknown point and swapped around: compare `nums[mid]` with an endpoint to learn which side of `mid` is still in order, then keep the half that must hold the answer.

**Type:** Binary Search · **Problems:** 2 · [Interactive lesson](02_rotated_array_lesson.html)

## The tell

- "Sorted array **rotated** at an unknown pivot", "sorted then shifted", "sorted with one cliff".
- The statement demands **`O(log n)`**, so a linear scan, though correct, is not the answer.
- Values are **distinct** (both problems here). Duplicates are a separate follow-up (LeetCode 154 and 81) with a different worst case.
- What is asked: the **minimum / rotation point** (compare `mid` with the right end), or the **index of a target** (find the sorted half first).

## The idea

A rotated sorted array is two sorted runs, the second made of smaller values: `[4, 5, 6, 7 | 0, 1, 2]`. Cut it at any `mid` and at least one side is a single sorted run. An endpoint comparison tells you which side that is, and a sorted run is the one place where "is the answer in here?" can be answered with two comparisons. So every step still throws away half.

```
nums = [4, 5, 6, 7, 0, 1, 2]
idx     0  1  2  3  4  5  6
        lo       mid      hi

nums[mid] = 7 > nums[hi] = 2   -> the cliff (the minimum) is right of mid
nums[lo] = 4 <= nums[mid] = 7  -> [lo..mid] = [4, 5, 6, 7] is sorted
                                  target 0 is not in [4, 7)  -> go right
```

## Template

Both notebooks' optimal approaches are this binary search with an endpoint test in front of the usual comparison. Minimum (`find_min_binary`) searches for a boundary, so it uses `lo < hi` and `hi = mid`; target search (`search_rotated_binary`) looks for a value, so it uses `lo <= hi` and `mid ± 1`.

```python
def find_min(nums):                        # boundary form: converge on the rotation point
    lo, hi = 0, len(nums) - 1
    while lo < hi:                         # stop when one candidate is left
        mid = (lo + hi) // 2
        if nums[mid] > nums[hi]:           # mid is in the big left run...
            lo = mid + 1                   # ...the cliff is strictly right of mid
        else:
            hi = mid                       # mid could be the minimum: keep it
    return nums[lo]

def search(nums, target):                  # target form: find the sorted half first
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if nums[mid] == target:
            return mid
        if nums[lo] <= nums[mid]:          # left half [lo..mid] is sorted
            if nums[lo] <= target < nums[mid]:
                hi = mid - 1               # target is inside the sorted left half
            else:
                lo = mid + 1
        else:                              # right half [mid..hi] is sorted
            if nums[mid] < target <= nums[hi]:
                lo = mid + 1               # target is inside the sorted right half
            else:
                hi = mid - 1
    return -1
```

## Problems

| # | Problem | Difficulty | Twist on the template | Time | Space | Notebook | Interactive |
|---|---------|------------|-----------------------|------|-------|----------|-------------|
| 1 | [Find Minimum in Rotated Sorted Array](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/) | Medium | Boundary search: compare `nums[mid]` with `nums[hi]`, keep `mid` with `hi = mid` | `O(log n)` | `O(1)` | [notebook](find_minimum_in_rotated_sorted_array.ipynb) | [interactive](find_minimum_in_rotated_sorted_array.html) |
| 2 | [Search in Rotated Sorted Array](https://leetcode.com/problems/search-in-rotated-sorted-array/) | Medium | Target search: decide which half is sorted (`nums[lo] <= nums[mid]`), range-check the target there | `O(log n)` | `O(1)` | [notebook](search_in_rotated_sorted_array.ipynb) | [interactive](search_in_rotated_sorted_array.html) |

Both notebooks also solve the problem with an `O(n)` linear scan; the benchmark measures about 2x per doubling for the scan and a flat, sub-millisecond curve for the binary search.

## Traps and look-alikes

- **Plain binary search on a rotated array.** `if nums[mid] < target: lo = mid + 1` assumes the whole array is sorted. On `[4, 5, 6, 7, 0, 1, 2]` it returns `-1` for target `0`: at `mid = 3` it sees `7 > 0` and drops the right half, where `0` lives. Check which half is sorted *first*.
- **Comparing with `nums[lo]` to find the minimum.** On an unrotated array (`[11, 13, 15, 17]`) the left end is the minimum, and a `nums[mid] >= nums[lo]` rule walks away from it. `nums[hi]` works for every rotation, including zero.
- **`hi = mid - 1` in Find Minimum.** When `nums[mid] <= nums[hi]`, `mid` itself may be the minimum. Keep it (`hi = mid`) and loop on `lo < hi`.
- **`<` vs `<=` in the range check.** The sorted-left test is `nums[lo] <= nums[mid]` (with `<=`, so a one-element left half counts as sorted), and the target test is half-open: `nums[lo] <= target < nums[mid]`, because `nums[mid] == target` was already handled.
- **Duplicates (LeetCode 154 / 81).** With repeats, `nums[mid] == nums[hi]` says nothing about where the cliff is. The fix is `hi -= 1` in that case, which makes the worst case `O(n)` (an array of all-equal values).
- **Sorted Search look-alike** ([Sorted Search](../01_Sorted_Search/README.md)): if the array is fully sorted, plain binary search is enough. The rotated pattern adds one extra comparison per step to recover that order.

## Say it in the interview

"The array is two sorted runs, so for any `mid` at least one side is sorted, and comparing with an endpoint tells me which. For the minimum I compare `nums[mid]` to `nums[hi]`: bigger means the cliff is to the right, otherwise it's at `mid` or left, and I converge with `lo < hi`. For a target I find the sorted half, check whether the target falls in its range, and keep that half or the other. Either way I halve the range each step: O(log n) time, O(1) space."
