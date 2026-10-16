# Fixed Window

Slide a window of exactly `k` elements along an array or string: each step one element enters on the right and one leaves on the left, and a running summary of the window is updated instead of recomputed.

**Type:** Sliding Window · **Problems:** 2 · [Interactive lesson](02_fixed_window_lesson.html)

## The tell

- The window **size is given and never changes**: "subarray / substring of length `k`", "window of size `k`", "every `k` consecutive elements".
- The size is **implied by another input**: "a permutation / anagram of `p` inside `s`" means every candidate has length `len(p)`.
- One answer **per window**: "maximum / minimum / average of each window of size `k`".
- Contrast: "**longest / shortest** substring such that ..." makes the size the unknown. That is a [Variable Window](../01_Variable_Window/README.md).

## The idea

Two neighbouring windows share `k - 1` elements. So don't rebuild the window's summary (counts, sum, max) from scratch: add the one element that enters, remove the one that leaves. With an `O(1)` update per step, `n - k + 1` windows cost `O(n)` instead of `O(n·k)`.

```
Permutation in String: s1 = "ab" (need {a:1, b:1}), s2 = "eidbaooo", k = 2

r = 1    [e i] d  b  a  o o o                 window {e:1, i:1}    full, no match
r = 2     e [i  d] b  a  o o o    +d  -e      window {i:1, d:1}    no
r = 3     e  i [d  b] a  o o o    +b  -i      window {d:1, b:1}    no
r = 4     e  i  d [b  a] o o o    +a  -d      window {b:1, a:1}    == need -> True
                      ^ s2[r] enters; s2[r - k] = d left
```

## Template

The optimal approach in both notebooks (`check_inclusion_window`, `max_sliding_window_deque`) is this loop; only the summary and the three marked lines change.

```python
def fixed_window(arr, k):
    state = ...                          # window summary: letter counts, a sum, a monotonic deque, ...
    ans = []
    for r in range(len(arr)):
        add(arr[r], state)               # 1) arr[r] enters on the right
        if r >= k:
            remove(arr[r - k], state)    # 2) arr[r - k] leaves on the left: the size stays k
        if r >= k - 1:                   # 3) window arr[r-k+1 .. r] is full
            ans.append(record(state))    #    check it / record its answer
    return ans
```

## Problems

| # | Problem | Difficulty | Twist on the template | Time | Space | Notebook | Interactive |
|---|---------|------------|-----------------------|------|-------|----------|-------------|
| 1 | [Permutation in String](https://leetcode.com/problems/permutation-in-string/) | Medium | Summary = 26 letter counts (`+1` in, `-1` out); record = `window == need`, return `True` on the first full window that matches | `O(n)` | `O(1)` | [notebook](permutation_in_string.ipynb) | [interactive](permutation_in_string.html) |
| 2 | [Sliding Window Maximum](https://leetcode.com/problems/sliding-window-maximum/) | Hard | A max can't be "subtracted", so the summary is a monotonic deque of indices: *add* pops every smaller-or-equal value off the back, *remove* pops the front only if its index is `r - k`, *record* is `nums[q[0]]` | `O(n)` | `O(k)` | [notebook](sliding_window_maximum.ipynb) | [interactive](sliding_window_maximum.html) |

`n` = length of `s2` / `nums`, `k` = window size. Both notebooks start from a brute force that rescans every window (`O(n·k)`; with `k = n/2` the benchmark measures about 4x per doubling, against about 2x for the sliding window). Permutation in String also shows sorting every window (`O(n·k log k)`); Sliding Window Maximum also shows a max-heap with lazy deletion (`O(n log n)`, `O(n)` space).

## Traps and look-alikes

- **Removing the wrong element.** The one leaving is `arr[r - k]`; `arr[r - k + 1]` is still the window's first element.
- **Recording too early.** Until `r >= k - 1` the window is not full; a partial window is not a candidate.
- **Variable Window look-alike.** If the problem asks for the longest / shortest window that satisfies a condition, the size is the unknown: grow on the right and shrink the left with a `while` until valid ([Variable Window](../01_Variable_Window/README.md)). Here the size is known, so every step is exactly one in, one out, and there is no inner shrink loop.
- **A max or min can't be undone.** A sum or a count subtracts the leaving element. A maximum can't: when it leaves you don't know the runner-up. Keep a monotonic deque (or a heap with lazy deletion, `O(n log n)`).
- **Monotonic stack look-alike** (Daily Temperatures). Same "pop what the newcomer beats" move, but a stack pops from one end only. A window also has to drop its oldest element from the front, hence a deque, and the deque stores indices so you can tell when the front has left.
- **Counts, not sets.** `"aab"` vs `"abbba"`: every window has the letters `{a, b}`, none has two `a`s. Compare counts.
- **"Subarray sum equals k" is not a window of size `k`.** There `k` is a target sum, not a length; with negative numbers no window can shrink in one direction, and the tool is prefix sums + a hash map.

## Say it in the interview

"Every candidate has the same length `k`, so I'll slide a fixed window: at each step one element enters on the right and the element at `r - k` leaves on the left, and I update a summary of the window instead of rebuilding it. For the permutation check the summary is 26 letter counts, so each step is `O(1)` and the scan is `O(n)`. For the window maximum a max can't be subtracted, so I keep a deque of indices with decreasing values: the front is the max, and each index enters and leaves once, so it's still `O(n)`."
