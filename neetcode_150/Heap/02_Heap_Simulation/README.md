# Heap Simulation

Run the process the problem describes, step by step, and keep the items in a max-heap so "which one is biggest right now?" costs `O(log n)` per step instead of a re-sort.

**Type:** Heap · **Problems:** 2 · [Interactive lesson](02_heap_simulation_lesson.html)

## The tell

- The statement describes a **process**, not a target: "each turn", "repeatedly", "until one is left", "each interval the CPU…".
- Every step needs the **largest (or smallest) item of the current collection**: "the two heaviest stones", "the task with the most copies left".
- The collection **changes after each step**: something is removed, and something smaller (a leftover, a task with one copy fewer) goes back in.
- Optional twist: an item that was just used **may not come back yet**: "cooldown", "same task at least `n` apart", "no two equal neighbours".

## The idea

Sorting answers "what is biggest?" once, but the leftover that goes back in can land anywhere in the order, so a sorted list has to be sorted again every step. A **max-heap** keeps the biggest item at position 0 at all times: popping it or pushing a leftover only moves an item up or down one path of the tree, `O(log n)`. Python's `heapq` is a min-heap, so store values negated.

```
Last Stone Weight, stones = [2,7,4,1,8,1]       heap shown as real weights, list order

heapify            [8, 7, 4, 1, 2, 1]
pop 8, pop 7       [4, 2, 1, 1]          8 != 7 -> push 8 - 7 = 1
push 1             [4, 2, 1, 1, 1]
pop 4, pop 2       [1, 1, 1]             4 != 2 -> push 2
push 2             [2, 1, 1, 1]          2 rises to the front by itself
pop 2, pop 1       [1, 1]                push 1  -> [1, 1, 1]
pop 1, pop 1       [1]                   equal: nothing pushed -> answer 1
```

With a cooldown, the leftover does not go straight back. It waits in a FIFO queue tagged with the time it is released, and rejoins the heap at that time:

```
  heap --pop best--> run one step --copies left?--> cooldown queue [(left, free_at), ...]
   ^                                                      |
   +------------------ front released at free_at ---------+
```

## Template

The optimal approach in both notebooks (`last_stone_weight_heap`, `least_interval_heap`) is this loop: pop the best, apply one step of the rules, push back what is left.

```python
import heapq
from collections import deque

def simulate(values, n=None):
    heap = [-v for v in values]       # max-heap: heapq is a min-heap, so negate
    heapq.heapify(heap)               # O(n) build; -heap[0] is the current maximum
    cooldown = deque()                # only for the cooldown twist: (item, free_at)
    time = 0
    while heap or cooldown:           # Last Stone Weight: while len(heap) > 1
        time += 1
        if heap:
            best = -heapq.heappop(heap)        # O(log n): the biggest item right now
            left = step(best)                  # apply one step of the rules
            if left:                           # something remains of it
                cooldown.append((left, time + n))   # no cooldown: heappush(heap, -left)
        else:
            time = cooldown[0][1]              # nothing usable: jump to the next release
        if cooldown and cooldown[0][1] == time:
            heapq.heappush(heap, -cooldown.popleft()[0])   # back into the competition
    return time                        # or whatever the process leaves behind
```

Without a cooldown (Last Stone Weight) the `cooldown` queue and the clock disappear and the leftover is pushed straight back. The queue stays a plain `deque` because every item waits the same `n` ticks, so items are released in the order they entered.

## Problems

| # | Problem | Difficulty | Twist on the template | Time | Space | Notebook | Interactive |
|---|---------|------------|-----------------------|------|-------|----------|-------------|
| 1 | [Last Stone Weight](https://leetcode.com/problems/last-stone-weight/) | Easy | None: pop **two** per round, push `y - x` straight back if non-zero, stop at one stone | `O(n log n)` | `O(n)` | [notebook](last_stone_weight.ipynb) | [interactive](last_stone_weight.html) |
| 2 | [Task Scheduler](https://leetcode.com/problems/task-scheduler/) | Medium | Heap of **counts**; a pile that just ran waits in a cooldown `deque` as `(left, time + n)`; jump the clock when the heap is empty | `O(T log k)` | `O(k)` | [notebook](task_scheduler.ipynb) | [interactive](task_scheduler.html) |

`n` = stones, `T` = tasks, `k` = distinct task types (at most 26 on LeetCode). Both notebooks open with a brute force that finds the maximum the slow way: Last Stone Weight re-sorts the pile every round (`O(n² log n)` as written; measured ≈4× per doubling, because Python's Timsort re-sorts an almost-sorted list in about linear time), and Task Scheduler scans every type on every tick (`O(ticks·k)`, measured ≈4× per doubling once `k` grows with `T`). Task Scheduler also shows the closed-form count `max(len(tasks), (maxf - 1) * (n + 1) + count_max)` in `O(T)`.

## Traps and look-alikes

- **[Top K](../01_Top_K/README.md) look-alike.** Both use `heapq`. Top K keeps a heap of **fixed size `k`** and makes one pass over the input: items are pushed, the worst is evicted, nothing comes back. Heap Simulation keeps **every** item in the heap and loops until the process ends: items are popped, **changed**, and pushed back. Ask: "does a popped item return, smaller or later?" If yes, it is a simulation.
- **Sorting once is not enough.** The leftover (`y - x`, or a task with one copy fewer) can belong anywhere in the order. Re-sorting each step works but costs a full sort per step.
- **Negate both ways.** `heapq` is a min-heap: push `-v`, and negate what you pop. In Task Scheduler, `heappop(heap) + 1` on a negated count means "one copy fewer".
- **Pushing back too early.** In Task Scheduler a task that just ran is not allowed for `n` ticks. Pushing it straight back into the heap lets it run again immediately and gives a wrong (too small) answer.
- **Ticking through idle time.** When the heap is empty, jump `time` to the cooldown front's release tick. Looping one idle tick at a time makes the loop as long as the answer, not the input.
- **Formula vs simulation.** The Task Scheduler formula is `O(T)` but only returns a length. Variants that need the actual order (Reorganize String: no two equal neighbours) need the heap simulation.
- **The heap does not prove the greedy.** The heap only makes "take the biggest" fast. Task Scheduler's notebook backs the greedy with the frame lower bound and a 2000-case random cross-check against the formula.

## Say it in the interview

"The statement describes a process where every step needs the current maximum, and the collection changes after every step, so I'll simulate it with a max-heap: `heapq` with negated values. Each step pops the biggest, applies the rule, and pushes back whatever is left, so a step costs `O(log n)` instead of a sort. If a used item has to wait before it can come back, I park it in a queue with its release time and push it back into the heap when that time comes."
