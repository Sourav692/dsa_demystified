# Variable Window

Keep a contiguous window `[left, right]` plus a small summary of what is inside it; grow `right` every step and move `left` forward only when the rule says so, so every index enters and leaves the window once.

**Type:** Sliding Window · **Problems:** 4 · [Interactive lesson](01_variable_window_lesson.html)

## The tell

- The answer is a **contiguous** range: "substring", "subarray", "window", "consecutive days".
- It asks for the **longest** or **shortest** such range, or the best value over ranges: "longest substring without repeating characters", "longest ... after at most `k` replacements", "minimum window containing all of `t`", "max profit buying before selling".
- The rule can be checked from a running summary of the window (a set, a count map, a "still missing" counter, a running minimum) without rescanning it.
- If a window breaks the rule, every window containing it breaks it too. That is what makes shrinking from the left safe.

## The idea

The brute force tries every `(start, end)` pair: `O(n²)` windows. The variable window never goes backwards. `right` moves one step per loop and adds `s[right]` to the state. If the window is now invalid, `left` moves forward, removing `s[left]` from the state, until it is valid again. Since `left` can move at most `n` times in total, the whole run is `O(n)`.

```
s = "abcabcbb"   rule: no repeated character   state: seen = set of chars in the window

 index   0 1 2 3 4 5 6 7
         a b c a b c b b
right=2  [a b c]              seen={a,b,c}  len 3 -> best 3
right=3    [b c a]            'a' repeats: drop s[0], left 0 -> 1, then add 'a'
right=6          [c b]        'b' repeats: drop 'a','b', left 3 -> 5, then add 'b'
right=7              [b]      'b' repeats: drop 'c','b', left 5 -> 7, then add 'b'
                              answer: best = 3
```

Two shapes of the same loop:

- **Longest valid window** (Longest Substring, Character Replacement): shrink **while invalid**, then record `right - left + 1`.
- **Shortest valid window** (Minimum Window Substring): grow until valid, then shrink **while valid**, recording the window before each drop.

**Best Time to Buy and Sell Stock is the degenerate window.** Think of `left` as the buy day and `right` as today; the window's value is `prices[right] - prices[left]`. The notebook's `min_price` is `prices[left]`. There is no gradual shrinking: when a cheaper day arrives, every window that starts earlier is now worse, so `left` jumps straight to that day (`min_price = min(min_price, p)`), and `best` keeps the largest `p - min_price` seen.

## Template

The optimal approach in the notebooks is this skeleton; only the state, the validity test, and where the answer is recorded change. `length_window_set` is it exactly.

```python
def longest_valid_window(s):
    state = set()                       # what is inside s[left..right]: set / count dict / need counter
    left = best = 0
    for right in range(len(s)):         # grow: right moves every step
        while s[right] in state:        # shrink WHILE adding s[right] would break the rule
            state.remove(s[left])       # undo s[left] in the state ...
            left += 1                   # ... then move left forward (never backwards)
        state.add(s[right])             # the window s[left..right] is valid again
        best = max(best, right - left + 1)   # record AFTER the shrink: only valid windows count
    return best

# Shortest-window variant (Minimum Window Substring):
#   for right ...: add s[right]
#       while window_is_valid():        # shrink WHILE still valid
#           record right - left + 1     # record BEFORE the drop
#           remove s[left]; left += 1
```

## Problems

| # | Problem | Difficulty | Twist on the template | Time | Space | Notebook | Interactive |
|---|---------|------------|-----------------------|------|-------|----------|-------------|
| 1 | [Best Time to Buy and Sell Stock](https://leetcode.com/problems/best-time-to-buy-and-sell-stock/) | Easy | Degenerate window: `left` (the running `min_price`) jumps to each new low; the value is `price - min_price` | `O(n)` | `O(1)` | [notebook](best_time_to_buy_and_sell_stock.ipynb) | [interactive](best_time_to_buy_and_sell_stock.html) |
| 2 | [Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters/) | Medium | None: the template as is with a `set`; the optimal version stores last indices and jumps `left = last[c] + 1` | `O(n)` | `O(n)` | [notebook](longest_substring_without_repeating.ipynb) | [interactive](longest_substring_without_repeating.html) |
| 3 | [Longest Repeating Character Replacement](https://leetcode.com/problems/longest-repeating-character-replacement/) | Medium | State is a count `dict` plus `maxf`; invalid when `(right - left + 1) - maxf > k` | `O(n)` | `O(1)` | [notebook](longest_repeating_character_replacement.ipynb) | [interactive](longest_repeating_character_replacement.html) |
| 4 | [Minimum Window Substring](https://leetcode.com/problems/minimum-window-substring/) | Hard | Shortest-window flip: `need` counter + `missing`; shrink while `missing == 0`, record before each drop | `O(n)` | `O(m)` | [notebook](minimum_window_substring.ipynb) | [interactive](minimum_window_substring.html) |

`m` = length of `t`. Space `O(1)` for Character Replacement means at most 26 letters in the count map. Every notebook also has a brute force that tries every start (`O(n²)`; `O(n²·m)` for Minimum Window), and its benchmark measures about 4x per doubling for the brute force and about 2x for the window.

## Traps and look-alikes

- **`if` instead of `while` when shrinking.** One drop may not be enough: on `"abcabcbb"` at `right = 6`, both `'a'` and `'b'` must leave before the new `'b'` can join.
- **Recording at the wrong moment.** Longest: record after the shrink (the window is valid). Shortest: record inside the shrink loop, before the drop that breaks validity.
- **Stale positions in the last-seen map.** On `"abba"` the final `'a'` was last seen at 0, but `left` is already 2. Without the `last[c] >= left` check, `left` jumps back and the answer becomes 3 instead of 2.
- **Counting extra copies.** In Minimum Window Substring, only decrement `missing` when `need[c] > 0`; a second `'B'` when one is enough does not help coverage.
- **Two pointers look-alike.** Two pointers on a sorted array look for one meeting point (pairs, triplets). A sliding window maintains a region of valid states. "Longest / shortest substring" or "window" picks the sliding window.
- **Prefix sum look-alike.** "Subarray sum equals `k`" with negative numbers or an exact target is not a sliding window: the sum is not monotonic as the window grows, so shrinking can skip answers. Use prefix sums + a hash map instead.
- **Fixed-size window.** If the window length is given (Permutation in String, window of size `k`), `left` simply trails `right` by `k`; there is no "shrink while" decision.

## Say it in the interview

"The answer is a contiguous substring and the rule can be checked incrementally, so I'll use a variable sliding window. I grow `right` one character at a time, keep a set of what's in the window, and while the new character is a repeat I remove `s[left]` and move `left` forward; then I update the best length. Each index enters and leaves the window at most once, so it's O(n) time and O(n) space for the set, or O(1) for a fixed alphabet."
