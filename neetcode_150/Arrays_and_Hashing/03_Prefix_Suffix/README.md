# Prefix Suffix

Answer "everything except position `i`" by combining a running aggregate from the left with a running aggregate from the right, so each slot costs one operation instead of a rescan.

**Type:** Arrays and Hashing · **Problems:** 1 · [Interactive lesson](03_prefix_suffix_lesson.html)

## The tell

- "Product (or sum) of **all elements except** `nums[i]`".
- "**Without using division**" next to an `O(n)` requirement: you can't take a total and remove one element, so you have to build the answer from the two sides.
- Each answer depends on "everything to the **left**" and "everything to the **right**" of an index (left/right running products, sums, maxima).
- Many queries over contiguous ranges of a fixed array: precompute prefix sums once, then every range is a subtraction (`P[r + 1] - P[l]`).

## The idea

For index `i`, the elements other than `nums[i]` split into two groups: those before `i` and those after `i`. Their product is the answer. Both groups can be built incrementally: walking left to right, the product of "everything before `i`" just gains `nums[i - 1]` at each step; walking right to left, the product of "everything after `i`" gains `nums[i + 1]`.

So make two passes. The first writes each slot's left product into `out`. The second walks back with a single running `suffix` and multiplies it in. No division, so zeros need no special handling.

```
nums            [ 1,   2,   3,   4 ]

left pass       out[i] = product of nums[0..i-1]
                [ 1,   1,   2,   6 ]      (1 = empty product)

right pass      suffix = product of nums[i+1..]
                  24   12    4    1       (applied right to left)

out[i] * suffix [ 24,  12,  8,   6 ]  <-- answer
```

## Template

The notebook's optimal approach (`product_except_self_optimal`), without the comments the notebook adds. The prefix-sum version is the same shape with `+` instead of `*` and `0` instead of `1`.

```python
def product_except_self(nums):
    n = len(nums)
    out = [1] * n                   # the output doubles as the prefix store
    prefix = 1                      # product of everything LEFT of i (empty product = 1)
    for i in range(n):
        out[i] = prefix             # store first: out[i] must not include nums[i]
        prefix *= nums[i]           # then extend for the next index
    suffix = 1                      # product of everything RIGHT of i
    for i in range(n - 1, -1, -1):  # second pass, right to left
        out[i] *= suffix            # left part * right part
        suffix *= nums[i]
    return out
```

## Problems

| # | Problem | Difficulty | Twist on the template | Time | Space | Notebook | Interactive |
|---|---------|------------|-----------------------|------|-------|----------|-------------|
| 1 | [Product of Array Except Self](https://leetcode.com/problems/product-of-array-except-self/) | Medium | None: the template as is. The output array holds the prefix products, so only one running `suffix` variable is extra | `O(n)` | `O(1)` extra (output not counted) | [notebook](product_of_array_except_self.ipynb) | [interactive](product_of_array_except_self.html) |

The notebook also solves it by brute force (multiply every other element for each `i`, `O(n^2)`, measured ≈4x per doubling of `n`) and by division (`O(n)`, but forbidden by the problem and needing a zero count: one zero leaves only that slot nonzero, two or more zeros make every slot `0`).

## Traps and look-alikes

- **Off by one in the left pass.** Write `out[i] = prefix` *before* `prefix *= nums[i]`. Swapping the two lines gives the inclusive product, so every answer contains `nums[i]`.
- **Reaching for division.** The problem forbids it, and it breaks on zeros. Prefix times suffix needs no zero case: `[-1, 1, 0, -3, 3]` → `[0, 0, 9, 0, 0]` falls out of the same two passes.
- **Two extra arrays.** Separate `L` and `R` arrays (`L = [1, 1, 2, 6]`, `R = [24, 12, 4, 1]` for `[1, 2, 3, 4]`) are correct but use `O(n)` extra space. Write the prefix into `out` and keep the suffix in one variable.
- **Overflow in other languages.** Python integers never overflow, so the bug stays hidden. LeetCode guarantees the products fit in 32 bits; the notebook's benchmark uses only `+1` and `-1` so the products never grow into big integers that would distort the timings.
- **Maximum Product Subarray look-alike.** It says "product", but it asks for the best contiguous subarray, not "all except one". That is 1-D DP that tracks both the running max and the running min (a negative number swaps them), not prefix times suffix.
- **Subarray sum equals k look-alike.** Prefix sums show up there too, but paired with a hash map of earlier prefix sums ("have I seen `curr - k`?"). Negative numbers or an exact target rule out a sliding window and point to prefix sum + hash map.
- **Trapping Rain Water look-alike.** One standard solution builds prefix maxima and suffix maxima, the same "left side, right side" idea with `max` as the combine. NeetCode files it under Two Pointers, whose version needs only `O(1)` space.

## Say it in the interview

"Each answer is the product of everything to the left of `i` times everything to the right of `i`, so I don't need division. One left-to-right pass writes the left products into the output array, and one right-to-left pass multiplies in a running suffix product. That's two linear passes, `O(n)` time, and `O(1)` extra space besides the output, and zeros need no special case."
