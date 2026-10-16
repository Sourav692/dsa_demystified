# Top K

Keep a heap capped at `k` items whose root is the *worst* of the kept ones, so each new item either replaces it or is thrown away: the k best of `n` items in `O(n log k)` time and `O(k)` memory.

**Type:** Heap · **Problems:** 3 · [Interactive lesson](01_top_k_lesson.html)

## The tell

- The question asks for **k of something**: "k-th largest", "k-th smallest", "top k", "k closest", "k nearest".
- Only the **k best** matter, and their order among themselves is free ("return in any order") or only the k-th one is needed.
- Values **arrive over time**: "a stream", "after each `add`", "design a class that returns ... after every insertion". Sorting again on every arrival is the slow answer.
- "Can you solve it without sorting?" next to a k-th-element question: a heap (`O(n log k)`) or quickselect (`O(n)` average).

## The idea

To keep the **k largest**, use a **min-heap** of size `k`. Its root is the smallest of the k largest, which is the k-th largest overall, and also the first one to evict when something bigger arrives. Push every value; whenever the heap holds `k + 1`, pop the root. For the **k smallest**, flip it: a **max-heap** of size `k` (in Python, push negated keys) so the root is the largest kept value.

```
k = 3, values arrive: 4 5 8 2 3 5 ...            min-heap (root on the left)

push 4, 5, 8          -> [4, 5, 8]               size 3 = k, root 4 = 3rd largest
push 2  -> size 4 > k -> pop 2   -> [4, 5, 8]     2 is too small to matter
push 3  -> size 4 > k -> pop 3   -> [4, 5, 8]     answer 4
push 5  -> size 4 > k -> pop 4   -> [5, 5, 8]     answer 5
                ^ the root is always "the bouncer": the weakest of the top k
```

Direction rule: **k largest → min-heap, k smallest → max-heap.** The root must be the item you would evict next.

## Template

The heap approach in all three notebooks (`KthLargest.add`, `k_closest_heap`, `find_kth_largest_heap`) is this skeleton; only the key changes. It is the optimal approach for the first two; for Kth Largest in an Array, quickselect beats it on average.

```python
import heapq

def top_k(items, k, key=lambda x: x):
    heap = []                                  # min-heap of (key, item): root = weakest kept
    for x in items:
        heapq.heappush(heap, (key(x), x))      # every item gets a chance
        if len(heap) > k:                      # one too many:
            heapq.heappop(heap)                # evict the weakest; it can never be top-k again
    return heap                                # the k largest keys; heap[0] = the k-th largest

# k smallest instead: key = lambda x: -score(x)   (heapq is a min-heap; negate to get a max-heap)
```

In the notebooks the key is written inline: plain values for Kth Largest (stream and array), `(-(x*x + y*y), x, y)` for K Closest Points.

## Problems

| # | Problem | Difficulty | Twist on the template | Time | Space | Notebook | Interactive |
|---|---------|------------|-----------------------|------|-------|----------|-------------|
| 1 | [Kth Largest Element in a Stream](https://leetcode.com/problems/kth-largest-element-in-a-stream/) | Easy | The template as a class: the heap lives on `self`, the constructor feeds `nums` through `add`, and `add` returns `heap[0]` | `O(log k)` per `add` (`O(n log k)` to build) | `O(k)` | [notebook](kth_largest_element_in_a_stream.ipynb) | [interactive](kth_largest_element_in_a_stream.html) |
| 2 | [K Closest Points to Origin](https://leetcode.com/problems/k-closest-points-to-origin/) | Medium | k **smallest** distances, so a max-heap: push `(-dist², x, y)` and return what is left | `O(n log k)` | `O(k)` | [notebook](k_closest_points_to_origin.ipynb) | [interactive](k_closest_points_to_origin.html) |
| 3 | [Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array/) | Medium | The template run once over a fixed array; quickselect (random pivot, 3-way partition) is the `O(n)`-average alternative | `O(n log k)` heap · `O(n)` avg quickselect | `O(k)` heap · `O(n)` copy, `O(1)` in place | [notebook](kth_largest_element_in_an_array.ipynb) | [interactive](kth_largest_element_in_an_array.html) |

What the benchmarks showed: the brute forces that redo work per item separate clearly (re-sort per `add` ≈4–5× per doubling, `k` scans for K Closest ≈4×), while the heap stays ≈2×. Heap versus `sorted` versus quickselect all measure ≈2×: a `log` factor is too small to see in a doubling ratio, and `sorted` runs in C, so it is often the fastest in absolute time. The heap's wins are `O(k)` memory and working on a stream.

## Traps and look-alikes

- **Wrong heap direction.** A min-heap capped at `k` keeps the k *largest*; for the k smallest you need a max-heap (negated keys). Using a plain min-heap for K Closest keeps the k *farthest* points.
- **Heap of everything.** Heapifying all `n` items and popping `k` times is correct but `O(n)` memory and no good for a stream. Cap the heap at `k`.
- **Off by one on "k-th largest".** It is index `n - k` in ascending order, or `heap[0]` of a size-k min-heap. Duplicates each count: in `[8, 5, 5, 4]` the 2nd and 3rd largest are both 5.
- **Tuple order in the heap.** `heapq` compares tuples item by item, so the priority goes first: `(-dist², x, y)`, not `(x, y, dist²)`.
- **Quickselect pitfalls.** A fixed pivot on sorted input is `O(n²)`; pick it at random. A 2-way partition slows down on many duplicates; the 3-way split settles all copies of the pivot at once.
- **Top K Frequent Elements** ([Frequency Count](../../Arrays_and_Hashing/02_Frequency_Count/README.md)) is a Top-K question too, but frequencies are bounded by `n`, so bucket sort gives `O(n)`; a size-k heap over the counts also works.
- **Heap Simulation** ([Last Stone Weight, Task Scheduler](../02_Heap_Simulation/README.md)) uses a max-heap of *all* items to replay a process; nothing is capped at `k`.
- **Two Heaps** ([Find Median from Data Stream](../04_Two_Heaps/README.md)) splits the stream into a lower and an upper half; one size-k heap only tracks one boundary.
- **K-Way Merge** ([Merge K Sorted Lists, Design Twitter](../03_K_Way_Merge/README.md)) keeps one item per *list* in the heap, not the k best items.

## Say it in the interview

"I only need the k largest, so I'll keep a min-heap capped at k: push each value, and if the size goes over k, pop the root, which is the smallest of the kept ones. At the end the root is the k-th largest. That's O(n log k) time and O(k) memory, and it works on a stream; if the array is all in memory and I may reorder it, quickselect with a random pivot gets O(n) on average."
