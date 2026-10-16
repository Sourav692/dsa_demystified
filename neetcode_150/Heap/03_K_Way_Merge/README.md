# K Way Merge

Merge `k` already-sorted sources into one sorted stream with a min-heap that holds exactly one "front" item per source: pop the smallest, then push the next item from the same source.

**Type:** Heap · **Problems:** 2 · [Interactive lesson](03_k_way_merge_lesson.html)

## The tell

- The input is **several sorted sequences**: "k sorted lists", "k sorted arrays", "each row is sorted", "each user's tweets in time order".
- The output is **one ordered result across all of them**: "merge into one sorted list", "the 10 most recent across the feeds", "the kth smallest overall".
- Each source is sorted **for free**: a time stamp that only goes up, or a list the problem promises is sorted. If you would have to sort the sources first, the merge is not the main idea.
- Often you need only the **first few** merged items ("top 10", "kth smallest"): a merge can stop early, a full sort cannot.

## The idea

The next item of the merged output is always one of the `k` current fronts. A min-heap of those `k` fronts hands you the smallest in `O(log k)`. After popping it, only *its* source has a new front, so push that source's next item and repeat. The heap never holds more than `k` entries.

```
lists:  A: 1 -> 4 -> 5      heap of fronts        pop    push       merged
        B: 1 -> 3 -> 4      (1,A) (1,B) (2,C)     (1,A)  (4,A)      [1]
        C: 2 -> 6           (1,B) (2,C) (4,A)     (1,B)  (3,B)      [1, 1]
                            (2,C) (3,B) (4,A)     (2,C)  (6,C)      [1, 1, 2]
                            ...                   ...               [1, 1, 2, 3, 4, 4, 5, 6]
```

Design Twitter runs the same loop backwards in time: each user's tweet list is read from its newest end, the heap is keyed on `-time`, and the loop stops after 10 pops.

## Template

The optimal approach in both notebooks (`merge_k_heap`, `Twitter.getNewsFeed`) is this skeleton.

```python
import heapq

def k_way_merge(sources, limit=None):
    heap = []
    for i, src in enumerate(sources):
        if src:                                   # skip empty sources
            heap.append((key(first(src)), i, first(src)))   # (key, source index = tie-breaker, payload)
    heapq.heapify(heap)                           # O(k)
    out = []
    while heap and (limit is None or len(out) < limit):     # optional early stop (Design Twitter: 10)
        _, i, item = heapq.heappop(heap)          # smallest front across all k sources
        out.append(item)
        nxt = next_of(item, i)                    # the following item of THE SAME source
        if nxt is not None:
            heapq.heappush(heap, (key(nxt), i, nxt))
    return out
```

- **Merge k Sorted Lists:** `key = node.val`, `first = head`, `next_of = node.next`, no limit.
- **Design Twitter:** `key = -time` (max-heap via negation), `first` = the newest tweet (end of the user's list), `next_of` = the tweet at `index - 1`, `limit = 10`.

The middle item of the tuple matters. `heapq` compares tuples item by item, so when two keys are equal it compares the next item. `ListNode` has no `<`, so `(val, node)` raises `TypeError` on the first tie; `(val, i, node)` never reaches the node. The Merge k Sorted Lists notebook shows the `TypeError`.

## Problems

| # | Problem | Difficulty | Twist on the template | Time | Space | Notebook | Interactive |
|---|---------|------------|-----------------------|------|-------|----------|-------------|
| 1 | [Merge k Sorted Lists](https://leetcode.com/problems/merge-k-sorted-lists/) | Hard | None: the template on linked lists; the entry is `(val, list_index, node)` and the popped node is relinked, not copied | `O(N log k)` | `O(k)` | [notebook](merge_k_sorted_lists.ipynb) | [interactive](merge_k_sorted_lists.html) |
| 2 | [Design Twitter](https://leetcode.com/problems/design-twitter/) | Medium | Hash maps hold each user's tweets (sorted by time for free) and followees; the feed is the template read newest-first with `(-time, id, user, index)`, stopped after 10 pops | `O(k + 10 log k)` per feed, `O(1)` per post / follow | `O(k)` | [notebook](design_twitter.ipynb) | [interactive](design_twitter.html) |

`N` = total nodes, `k` = number of sources (lists, or followees + 1). Each notebook's brute force gathers everything and sorts it: `O(N log N)` for Merge k Sorted Lists, `O(T log T)` per feed for Design Twitter (`T` = tweets of the user and their followees). Measured: the Design Twitter feed stays flat (about 1x per doubling of `T`) with the heap and roughly doubles with the brute force. For Merge k Sorted Lists with `k = 10` both approaches measure about 2x per doubling: the doubling ratio cannot separate `N log N` from `N log k`, and Python's Timsort exploits the `k` sorted runs in the collected values.

## Traps and look-alikes

- **No tie-breaker in the heap entry.** `(val, node)` crashes with `TypeError` the first time two values are equal. Put a unique, comparable item (the source index) before the payload.
- **Pushing everything into the heap.** Pushing all `N` items is just heap sort: `O(N log N)` and `O(N)` space. The point of the pattern is a heap of size `k`, refilled one item at a time from the source that was just popped.
- **Pushing the wrong successor.** After a pop, push the next item of *that* source, not the next source's front.
- **Max-heap in Python.** `heapq` is a min-heap only. For "most recent first" key on `-time`, otherwise you get the oldest tweets.
- **Design Twitter details.** The feed must include the user's own tweets; following yourself must not show your tweets twice; `unfollow` of someone not followed must not raise (`set.discard`, not `remove`).
- **Top K look-alike** ([Top K](../01_Top_K/README.md)). Top K keeps a heap of size `k` over **one unsorted** stream and evicts the worst. K Way Merge has `k` **sorted** sources and the heap holds one front per source. Ask: "are there several inputs that are each already sorted?" If yes, merge.
- **Divide and conquer alternative** (NeetCode's other suggested solution; not implemented in the notebook). Merge the lists in pairs (1+2, 3+4, ...) and repeat: `log k` rounds, each touching all `N` nodes, so also `O(N log k)`. It cannot stop early, so it is a poor fit for "top 10" feeds.
- **Same family, not in this pattern's notebooks:** Kth Smallest Element in a Sorted Matrix (LC 378, rows are the `k` sources, pop `k` times) and Smallest Range Covering Elements from K Lists (LC 632, track the current max while popping the min).

## Say it in the interview

"Each of the `k` inputs is already sorted, so the next output item is always one of the `k` fronts. I keep those fronts in a min-heap as `(value, source index, item)`; the index breaks ties so Python never compares the nodes. Pop the smallest, push the next item from the same source: `O(N log k)` time and `O(k)` space, and if I only need the first 10, as in a news feed, I stop after 10 pops."
