# Opposite Ends

Put one pointer at each end of an array or string and walk them toward each other, moving exactly one per step by a rule that proves the element you move past can't be in a better answer.

**Type:** Two Pointers · **Problems:** 5 · [Interactive lesson](01_opposite_ends_lesson.html)

## The tell

- The input is **sorted** (or you are allowed to sort it) and the question is about a **pair**: "two numbers that add up to target", "triplets that sum to zero".
- The answer compares **mirror positions**: "palindrome", "reads the same forwards and backwards".
- The answer is a **pair of positions scored by the shorter / lower side times or minus something**: "two lines that hold the most water", "water trapped between bars".
- A constraint like "`O(1)` extra space" on a problem whose obvious fix is a hash map or a copy.
- The brute force is "try every pair `i < j`" (`O(n²)`), and one comparison of the two ends can rule out a whole row of pairs.

## The idea

Every pair `(lo, hi)` of the array sits in a triangle of candidates. Looking at the two ends answers a question about one of them for **every** partner still in range: "`nums[lo]` is too small even with the biggest value left", or "`height[lo]` is the shorter wall, so no narrower container using it can be bigger". That end is finished, so drop it. Each step removes one element; after at most `n - 1` steps the pointers meet.

```
Two Sum II, numbers = [1, 3, 4, 5, 7, 10, 11], target = 9

 lo                   hi
 [1, 3, 4, 5, 7, 10, 11]   1 + 11 = 12  too big   -> drop 11 (hi -= 1)
 [1, 3, 4, 5, 7, 10]       1 + 10 = 11  too big   -> drop 10
 [1, 3, 4, 5, 7]           1 + 7  = 8   too small -> drop 1  (lo += 1)
    [3, 4, 5, 7]           3 + 7  = 10  too big   -> drop 7
    [3, 4, 5]              3 + 5  = 8   too small -> drop 3
       [4, 5]              4 + 5  = 9   found     -> return [3, 4] (1-indexed)
```

## Template

The optimal approach in every notebook here is this loop; only the "look" line and the "which side is finished" rule change.

```python
def opposite_ends(arr):
    lo, hi = 0, len(arr) - 1              # one pointer at each end
    while lo < hi:                        # stop when they meet: every useful pair is covered
        # look at arr[lo] and arr[hi] together (compare, sum, area, ...)
        if found(arr[lo], arr[hi]):
            return answer(lo, hi)
        if left_side_is_finished(arr, lo, hi):   # e.g. sum < target, or height[lo] is the shorter wall
            lo += 1                       # arr[lo] can't be in any better answer: drop it
        else:
            hi -= 1                       # mirror case: drop arr[hi]
    return default
```

Two Sum II, the purest form (`two_sum_ii_two_pointers`):

```python
def two_sum_ii_two_pointers(numbers, target):
    lo, hi = 0, len(numbers) - 1
    while lo < hi:
        s = numbers[lo] + numbers[hi]
        if s == target:
            return [lo + 1, hi + 1]       # 1-indexed answer
        if s < target:
            lo += 1                       # numbers[lo] is too small for every partner left
        else:
            hi -= 1                       # numbers[hi] is too big for every partner left
    return []
```

## Problems

| # | Problem | Difficulty | Twist on the template | Time | Space | Notebook | Interactive |
|---|---------|------------|-----------------------|------|-------|----------|-------------|
| 1 | [Valid Palindrome](https://leetcode.com/problems/valid-palindrome/) | Easy | Mirror check: skip non-alphanumerics on each side, compare lowercased, move **both** pointers on a match | `O(n)` | `O(1)` | [notebook](valid_palindrome.ipynb) | [interactive](valid_palindrome.html) |
| 2 | [Two Sum II - Input Array Is Sorted](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/) | Medium | None: the template as is, the sum versus `target` picks the side | `O(n)` | `O(1)` | [notebook](two_sum_ii.ipynb) | [interactive](two_sum_ii.html) |
| 3 | [3Sum](https://leetcode.com/problems/3sum/) | Medium | Sort, fix an anchor `i`, run Two Sum II on the rest for `-nums[i]`; skip equal neighbours to avoid duplicate triplets | `O(n²)` | `O(1)` + output | [notebook](three_sum.ipynb) | [interactive](three_sum.html) |
| 4 | [Container With Most Water](https://leetcode.com/problems/container-with-most-water/) | Medium | No target: keep a running best area and always move the **shorter** wall | `O(n)` | `O(1)` | [notebook](container_with_most_water.ipynb) | [interactive](container_with_most_water.html) |
| 5 | [Trapping Rain Water](https://leetcode.com/problems/trapping-rain-water/) | Hard | Each pointer carries a running max; move the side with the **smaller** max and fill the bar it lands on | `O(n)` | `O(1)` | [notebook](trapping_rain_water.ipynb) | [interactive](trapping_rain_water.html) |

Each notebook also has slower approaches, measured with the doubling benchmark: try-every-pair brute force for Two Sum II and Container (`O(n²)`), a hash map for Two Sum II (`O(n)` time but `O(n)` space), a triple loop (`O(n³)`) and hash-set-per-anchor (`O(n²)`) for 3Sum, per-bar rescans (`O(n²)`) and prefix/suffix max arrays (`O(n)` time, `O(n)` space) for Trapping Rain Water, and clean-then-reverse (`O(n)` space) for Valid Palindrome. The 3Sum sort adds `O(n log n)`, which the `O(n²)` sweep dominates.

## Traps and look-alikes

- **Sliding window look-alike.** Both use two indices, but a sliding window moves both pointers in the **same** direction to maintain a region of valid states ("longest substring without repeats", "window", "longest / shortest length"). Opposite Ends looks for **one** pair or meeting point and starts the pointers apart. Ask: am I keeping a window valid, or ruling out ends?
- **Hash map on sorted input** (Two Sum II). It passes, in `O(n)` time, but uses `O(n)` memory the problem forbids and ignores the sorted order. Sorted + pair → two pointers.
- **3Sum duplicates.** Sorting is what makes deduplication a neighbour skip. Skip equal anchors (`nums[i] == nums[i-1]`) **and** equal `lo` / `hi` values after a hit, or the same triplet comes out twice.
- **Moving the wrong side.** Container: moving the taller wall can never help, because the area is capped by the shorter one. Trapping Rain Water: move the side with the smaller running max; the other side's water level is not known yet.
- **Container vs Trapping Rain Water.** Container picks **one** pair of walls and the water between them; Trapping Rain Water adds up a separate column of water above **every** bar.
- **Don't sort when order matters.** Valid Palindrome needs the original order; sort only when the problem is about values, not positions (3Sum returns values, so sorting is fine; Two Sum II returns positions, so it must already be sorted).
- **`lo <= hi` instead of `lo < hi`.** That pairs an element with itself.

## Say it in the interview

"The input is sorted and I need a pair, so I'll put one pointer at each end. If the sum is too small, the left value can't work with any partner that's left, so I move it right; if it's too big, I move the right pointer left. Each step discards one element for good, so it's O(n) time and O(1) space, versus O(n²) for checking every pair."
