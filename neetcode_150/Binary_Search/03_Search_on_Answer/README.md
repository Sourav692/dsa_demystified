# Search on Answer

Binary-search the range of possible **answers** (a speed, a capacity, a number of days) instead of an array, using a yes/no feasibility check to decide which half to keep.

**Type:** Binary Search · **Problems:** 1 · [Interactive lesson](03_search_on_answer_lesson.html)

## The tell

- The question asks for the **minimum** (or maximum) value of something you get to **choose**: "minimum eating speed", "least ship capacity", "fewest days", "smallest largest sum".
- It comes with a limit to meet: "within `h` hours", "within `D` days", "into `m` parts".
- "Minimize the maximum" / "maximize the minimum".
- The possible answers span a **huge range** (up to `10^9`) while `n` is small, so trying every answer is too slow but checking **one** answer is a quick `O(n)` pass.
- Checking a guess is easy and **monotonic**: if speed `k` is fast enough, every faster speed is too.

## The idea

Line up the candidate answers in order and ask the feasibility question of each. Because the check is monotonic, the answers read `no, no, ..., no, YES, YES, ..., YES`. The answer is the first `YES`, the boundary, and binary search finds a boundary in `O(log M)` checks. The array itself is never sorted or searched: it is only read inside the check.

```
Koko, piles = [3, 6, 7, 11], h = 8          feasible(k) = sum(ceil(p / k)) <= 8

speed k      1    2    3    4    5    6    7    8    9   10   11
hours       27   15   10    8    8    6    5    5    5    5    4
feasible?    no   no   no  YES  YES  YES  YES  YES  YES  YES  YES
                            ^
                   first YES = answer 4

binary search on [1, 11]:  mid 6 YES -> hi=6 | mid 3 no -> lo=4 | mid 5 YES -> hi=5 | mid 4 YES -> hi=4 | lo == hi = 4
```

## Template

The optimal approach in the notebook (`min_eating_speed_binary`) is this skeleton; only the bounds and `feasible` change from problem to problem.

```python
def search_on_answer(lo, hi, feasible):
    """Smallest x in [lo, hi] with feasible(x) True. feasible must be monotonic:
    False ... False True ... True. hi must be a value known to be feasible."""
    while lo < hi:                  # stop when one candidate is left
        mid = (lo + hi) // 2        # lower middle, so lo = mid + 1 always makes progress
        if feasible(mid):
            hi = mid                # mid works: the answer is mid or smaller (keep mid)
        else:
            lo = mid + 1            # mid fails: the answer is strictly bigger
    return lo                       # lo == hi == first feasible value

# Koko Eating Bananas
def min_eating_speed(piles, h):
    def feasible(k):                # can Koko finish at speed k?  O(n)
        return sum((p + k - 1) // k for p in piles) <= h    # ceil(p / k) with integers
    return search_on_answer(1, max(piles), feasible)        # bounds of the ANSWER, not the array
```

## Problems

| # | Problem | Difficulty | Twist on the template | Time | Space | Notebook | Interactive |
|---|---------|------------|-----------------------|------|-------|----------|-------------|
| 1 | [Koko Eating Bananas](https://leetcode.com/problems/koko-eating-bananas/) | Medium | None: the template as is; `feasible(k)` = total `ceil(p / k)` hours `<= h`, answer in `[1, max(piles)]` | `O(n log M)` | `O(1)` | [notebook](koko_eating_bananas.ipynb) | [interactive](koko_eating_bananas.html) |

`n` = number of piles, `M` = `max(piles)`. The notebook also has the brute force that tries every speed from 1 upward (`O(n·M)`); on `piles = [1..n]`, `h = n` it measured about 4x per doubling, against about 2.2x for the binary search.

Follow-up variants (same template, different `feasible`; not in this folder, practise them after Koko):

| Variant | Search range | `feasible(x)` |
|---------|--------------|---------------|
| Capacity To Ship Packages Within D Days (LC 1011) | `[max(weights), sum(weights)]` | Load packages in order; start a new day when the next one would exceed `x`; feasible if days used `<= D`. |
| Split Array Largest Sum (LC 410) | `[max(nums), sum(nums)]` | Same greedy as shipping: cut a new part when the running sum would exceed `x`; feasible if parts `<= k`. |
| Minimum Number of Days to Make m Bouquets (LC 1482) | `[min(bloomDay), max(bloomDay)]` | On day `x`, count runs of `k` adjacent bloomed flowers (`bloomDay[i] <= x`); feasible if bouquets `>= m`. Return `-1` first if `m * k > n`. |

## Traps and look-alikes

- **`hi = mid - 1` on a feasible `mid`.** A feasible `mid` may *be* the answer. Keep it: `hi = mid`. Only the infeasible side moves past `mid` (`lo = mid + 1`).
- **`lo = mid` with `mid = (lo + hi) // 2`.** When `hi = lo + 1`, `mid == lo` and the loop never ends. The "smallest that works" template pairs the lower middle with `lo = mid + 1`.
- **Wrong bounds.** `lo = 0` divides by zero in Koko's check. `hi` must be a value that is certainly feasible (`max(piles)` for Koko; `sum(weights)` for shipping). For shipping, `lo` is `max(weights)`, not 1: a ship smaller than the heaviest package can never work.
- **Float ceiling.** `math.ceil(p / k)` goes through floats; `(p + k - 1) // k` is exact.
- **Sorted Search look-alike** ([Sorted Search](../01_Sorted_Search/README.md)). Same `lo`/`hi`/`mid` loop, different question. Sorted Search looks for a *value inside a sorted array*; Search on Answer looks for the *smallest value that passes a check*, and the input array is usually unsorted. Tell: is the thing you return an element/index of the input (Sorted Search) or a number you choose (Search on Answer)?
- **Looks like greedy or DP.** "Least capacity to ship in `D` days" or "split into `m` parts minimising the largest sum" read like DP. If one guess can be checked greedily in `O(n)` and the check is monotonic, binary search the guess instead.
- **Linear scan over answers.** Correct but `O(n·M)` with `M` up to `10^9`: it times out. The notebook's brute force is this scan.

## Say it in the interview

"I can't search the piles, but I can search the speed. If Koko can finish at speed `k`, she can finish at any faster speed, so feasibility is monotonic over `[1, max(piles)]`. I binary-search that range: if `mid` works I keep it and go left with `hi = mid`, otherwise `lo = mid + 1`. Each check is one `O(n)` pass with integer ceiling division, so the total is `O(n log M)` time and `O(1)` space."
