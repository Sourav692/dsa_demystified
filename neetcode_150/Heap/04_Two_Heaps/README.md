# Two Heaps

Split a growing set of numbers at its middle: a max-heap holds the lower half, a min-heap holds the upper half, and the two tops are the values on either side of the split.

**Type:** Heap · **Problems:** 1 · [Interactive lesson](04_two_heaps_lesson.html)

## The tell

- A **median** or **middle value** that must be reported again and again while numbers keep arriving: "data stream", "running median", "after each insertion".
- More generally, the boundary between a **lower group** and an **upper group** that changes as items come in or go out.
- The question asks for the middle often, so sorting on every query is too slow, and a single sorted list pays `O(n)` per insert.

## The idea

You never need the whole stream in order, only the values right next to the middle. Keep two heaps:

- `low`: a **max-heap** of the smaller half. Its top is the largest of the small values.
- `high`: a **min-heap** of the larger half. Its top is the smallest of the large values.

Two invariants hold after every `addNum`:

1. **Order:** every value in `low` is `<=` every value in `high`.
2. **Size:** `len(low) == len(high)` or `len(low) == len(high) + 1`.

Then the median is `low`'s top (odd count) or the average of both tops (even count).

```
stream 5, 15, 1, 3, 8   (heaps drawn in sorted order; the top sits next to the bar)

after 5:          [5]        |                 median = 5.0          (odd: low top)
after 15:         [5]        |  [15]           median = (5+15)/2 = 10.0
after 1:       [1, 5]        |  [15]           median = 5.0
after 3:       [1, 3]        |  [5, 15]        median = (3+5)/2 = 4.0
after 8:    [1, 3, 5]        |  [8, 15]        median = 5.0
             low (max-heap)     high (min-heap)
```

Adding 8 shows why every number goes through `low` first: 8 enters `low`, is `low`'s largest, so it moves to `high`. Now `high` has 3 values and `low` 2, so `high`'s smallest (5) moves back. 8 ends up on the right side of the split without a single comparison written by hand.

## Template

The notebook's optimal approach, `MedianFinder`, is this skeleton:

```python
import heapq

class MedianFinder:
    def __init__(self):
        self.low = []    # max-heap of the smaller half (heapq is a min-heap, so store -x)
        self.high = []   # min-heap of the larger half

    def addNum(self, num: int) -> None:
        heapq.heappush(self.low, -num)                        # 1. every number enters low
        heapq.heappush(self.high, -heapq.heappop(self.low))   # 2. low's largest crosses: order invariant holds
        if len(self.high) > len(self.low):                    # 3. size invariant: low gets the extra value
            heapq.heappush(self.low, -heapq.heappop(self.high))

    def findMedian(self) -> float:
        if len(self.low) > len(self.high):
            return float(-self.low[0])                        # odd count: low's top is the middle
        return (-self.low[0] + self.high[0]) / 2              # even count: average the two tops
```

## Problems

| # | Problem | Difficulty | Twist on the template | Time | Space | Notebook | Interactive |
|---|---------|------------|-----------------------|------|-------|----------|-------------|
| 1 | [Find Median from Data Stream](https://leetcode.com/problems/find-median-from-data-stream/) | Hard | None: the template as is | `addNum` `O(log n)`, `findMedian` `O(1)` | `O(n)` | [notebook](find_median_from_data_stream.ipynb) | [interactive](find_median_from_data_stream.html) |

The notebook also has two slower approaches: sort the list on every `findMedian`, and keep one sorted list with `bisect.insort` (`O(n)` per insert because of the shift). With a median after every add on a decreasing stream, both measured about 4× time per doubling of `n` (`O(n²)` in total); the two heaps measured about 2× (`O(n log n)` in total).

## Traps and look-alikes

- **Forgetting the negation.** `heapq` only has a min-heap. `low` stores `-x`, so read its top as `-low[0]` and push `-x`. Mixing signs quietly breaks the order invariant.
- **Pushing into one heap by comparison only, without rebalancing.** "If `num <= -low[0]` go to `low`, else `high`" is fine, but you still need the size fix-up afterwards. The template's "always through `low`, then move one across" does both in three fixed steps.
- **Two conventions at once.** Pick which heap may hold the extra value (here `low`) and read the odd-count median from that heap. Reading `high`'s top for an odd count gives the wrong value.
- **Integer averaging.** `(a + b) // 2` drops the `.5`: `(5 + 15) // 2` is fine, `(3 + 4) // 2` is not. Use `/ 2`.
- **[Top K](../01_Top_K/README.md) look-alike.** "Kth largest in a stream" also keeps a heap over a stream, but it needs only **one** min-heap of size `k`: the boundary sits at a fixed rank from the top. The median's rank moves with the count, so it needs both halves.
- **[Median of Two Sorted Arrays](../../Binary_Search/04_Partition_Search/README.md) look-alike.** Same word "median", but the input is two **static, already sorted** arrays. No heaps: binary search the cut in `O(log min(m, n))`.
- **Sliding Window Median (LC 480).** Values also **leave**. `heapq` cannot delete from the middle cheaply, so the two heaps need lazy deletion (mark, then pop when it reaches the top) or a sorted container. Same two halves, harder bookkeeping.
- **Bounded values (LeetCode follow-up).** If every number is in `0..100`, a count array of 101 buckets beats heaps: add is `O(1)`, the median is a walk over at most 101 counts.

## Say it in the interview

"I only ever need the two values next to the middle, so I'll keep the lower half in a max-heap and the upper half in a min-heap. Each add goes into the low heap, its top moves to the high heap, and if the high heap gets bigger I move its top back, so low has the same size or one more. The median is low's top or the average of both tops: O(log n) per add, O(1) per median, O(n) space."
