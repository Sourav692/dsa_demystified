# Monotonic Stack

Keep a stack of indices whose values stay sorted (always decreasing, or always increasing); each new element pops every element it "beats", and each pop is the moment that element's answer (next greater, next smaller, a distance, a width) becomes known.

**Type:** Stack · **Problems:** 3 · [Interactive lesson](02_monotonic_stack_lesson.html)

## The tell

- **Next greater / next smaller:** "how many days until a warmer temperature", "the next taller building", "the first element to the right that is larger / smaller".
- The answer for an element is a **distance or a span**: "how many days", "how wide", "how far it can extend".
- **Spans bounded by the smallest bar:** "largest rectangle in a histogram", "maximum area under the skyline", "the range where this element is the minimum".
- **Things on a line that block each other:** "cars cannot pass", "catches up and moves as one fleet", "who can see whom". Sort by position first, then sweep with a stack.
- NeetCode's trigger list for the Stack category: next greater/smaller element, "remove k digits", histogram areas.

## The idea

Walk the input once. Elements that have not found their answer yet **wait** on a stack. Because a newer element resolves every older, weaker element it meets, the elements still waiting are always in sorted order: for "next greater" their values go **down** from bottom to top. When a new element arrives, pop from the top while it beats the top; each popped index gets its answer from the current index. Then push the new index. Every index is pushed once and popped at most once, so the whole pass is `O(n)` even with a `while` inside the `for`.

```
Daily Temperatures, temps = [73, 74, 75, 71, 69, 72, 76, 73]       stack = indices (temps), top on the right

i  temp   pops (j -> res[j] = i - j)        stack after
0   73    -                                 [0(73)]
1   74    0 -> 1                            [1(74)]
2   75    1 -> 1                            [2(75)]
3   71    -  (71 < 75, waits)               [2(75), 3(71)]
4   69    -                                 [2(75), 3(71), 4(69)]       values go DOWN bottom -> top
5   72    4 -> 1, 3 -> 2   (stops at 75)    [2(75), 5(72)]
6   76    5 -> 1, 2 -> 4                    [6(76)]
7   73    -                                 [6(76), 7(73)]   leftovers: no warmer day -> 0
                                            res = [1, 1, 4, 2, 1, 1, 0, 0]
```

## Template

Daily Temperatures' `daily_temperatures_stack` is this skeleton as is. Largest Rectangle's `largest_rectangle_stack` flips the comparison (an increasing stack, "next smaller") and computes a width at pop time. Car Fleet's `car_fleet_stack` runs it on arrival times after sorting by position.

```python
def next_greater_distance(nums):
    res = [0] * len(nums)                  # default for elements that are never resolved
    stack = []                             # INDICES; nums[stack] stays decreasing bottom -> top
    for i, x in enumerate(nums):
        while stack and nums[stack[-1]] < x:   # x beats the top: it is the top's answer
            j = stack.pop()                # (flip to > for "next smaller" = increasing stack)
            res[j] = i - j                 # record j's answer from i: a distance, a width, a value
        stack.append(i)                    # i waits for its own answer
    return res                             # leftovers keep the default (or flush with a sentinel)
```

## Problems

| # | Problem | Difficulty | Twist on the template | Time | Space | Notebook | Interactive |
|---|---------|------------|-----------------------|------|-------|----------|-------------|
| 1 | [Daily Temperatures](https://leetcode.com/problems/daily-temperatures/) | Medium | None: the template as is; a decreasing stack of day indices, `res[j] = i - j` on each pop | `O(n)` | `O(n)` | [notebook](daily_temperatures.ipynb) | [interactive](daily_temperatures.html) |
| 2 | [Car Fleet](https://leetcode.com/problems/car-fleet/) | Medium | Sort cars by position (closest to the target first) and stack their arrival times `(target - p) / s`; a car with `t <= top` catches the fleet ahead and is not pushed; answer = `len(stack)` | `O(n log n)` | `O(n)` | [notebook](car_fleet.ipynb) | [interactive](car_fleet.html) |
| 3 | [Largest Rectangle in Histogram](https://leetcode.com/problems/largest-rectangle-in-histogram/) | Hard | Increasing stack ("next smaller"); when bar `top` is popped at `i`, the new top is its left wall: area `heights[top] * (i - left - 1)`; a height-0 sentinel at the end flushes the stack | `O(n)` | `O(n)` | [notebook](largest_rectangle_in_histogram.ipynb) | [interactive](largest_rectangle_in_histogram.html) |

Each notebook starts from an `O(n²)` brute force: Daily Temperatures scans right from every day, Car Fleet checks every car ahead of every car, and Largest Rectangle tries every pair of walls. Daily Temperatures adds a right-to-left pass that jumps along answers already found (`O(n)` amortized, `O(1)` extra space), and Largest Rectangle adds a two-pass version (nearest shorter bar on the left, then on the right) before the one-pass stack. In the doubling benchmarks the brute forces grow about 4× per doubling of `n`, the stack versions about 2× (Car Fleet's sort + stack 1.8–2.5×, the `log n` of the sort).

## Traps and look-alikes

- **Storing values instead of indices.** The answer is usually a distance or a width (`i - j`), and a stack of temperatures has already lost the positions. Store indices; read the value as `nums[j]`.
- **Wrong direction.** "Next greater" keeps a **decreasing** stack and pops while `nums[top] < x`; "next smaller" keeps an **increasing** stack and pops while `nums[top] > x`.
- **Strict vs non-strict.** An equal temperature is not warmer: pop on `<`, not `<=` (`[50, 50, 51]` → `[2, 1, 0]`). In Car Fleet the opposite holds: a car that catches the fleet exactly at the target merges, so the merge test is `t <= top`.
- **Forgetting the leftovers.** Indices still on the stack at the end never met their answer. Daily Temperatures leaves them at `0`; Largest Rectangle must still compute their areas, which the height-0 sentinel does (without it `[1, 2, 3]` returns `0` instead of `4`).
- **Width off by the popped bars.** In Largest Rectangle the width is `i - left - 1` with `left` = the new top after the pop, not `i - top`: the rectangle also covers the taller bars popped earlier.
- **Car Fleet order.** Sweep from the car closest to the target (a car's fate depends only on the cars ahead), sort because the input is unsorted, and use true division: `(target - p) // s` rounds times down and merges cars that never meet.
- **Stack Simulation look-alike ([pattern 01](../01_Stack_Simulation/README.md)).** Valid Parentheses and RPN pop exactly the one item each token needs, and the stack is not kept in sorted order. Monotonic Stack pops in a `while` loop until the order is restored, and the pops are where the answers are written.
- **Sliding Window Maximum** looks like "next greater" but the window also expires elements from the **front**, so it needs a monotonic **deque**, not a stack (NeetCode files it under Sliding Window).
- **Trapping Rain Water** can be solved with a monotonic stack, but the NeetCode list teaches it with two pointers (Two Pointers pattern), which uses `O(1)` space.

## Say it in the interview

"For each element I need the next greater (or smaller) element, so I'll keep a stack of indices that are still waiting for their answer; the values on it stay monotonic. Each new element pops every waiting element it beats, and that pop is where I write the answer, a distance `i - j` or a width `i - left - 1`. Every index is pushed and popped at most once, so it is O(n) time and O(n) space; for Car Fleet I sort by position first, so O(n log n)."
