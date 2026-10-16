# Permutations

List every ordering of distinct items by filling one slot at a time: each slot may take any item not already used, tracked with a `used[]` array; choose it, explore the remaining slots, then un-choose it.

**Type:** Backtracking · **Problems:** 1 · [Interactive lesson](03_permutations_lesson.html)

## The tell

- The output is **every ordering**: "all permutations", "all possible orders", "every arrangement", "rearrange in all ways".
- **Order matters**: `[1, 2]` and `[2, 1]` are two different answers. (If they count as one, it is [Subsets](../01_Subsets/README.md) or [Combinations](../02_Combinations/README.md).)
- The input is **small**: LeetCode caps Permutations at `n <= 6`, because the answer alone has `n!` entries.
- Each item is used **exactly once** in every answer, and the answer length is always `n`.

## The idea

Build one ordering in a `path` list. At every level, loop over **all** indices (not from a `start` index, because an earlier index may come later in the ordering) and skip the ones whose `used[i]` is `True`. Choose an item (mark it and append it), recurse to fill the next slot, then un-choose it (pop and unmark) so the next item can try the same slot. When the path holds all `n` items, it is a leaf: save a copy.

```
nums = [1, 2, 3]                       path / used at the deepest point of each branch

                  []                   used = [F, F, F]
        /         |         \
      [1]        [2]        [3]        slot 0: 3 choices
     /   \      /   \      /   \
  [1,2] [1,3] [2,1] [2,3] [3,1] [3,2]  slot 1: 2 choices
    |     |     |     |     |     |
 [1,2,3] ...                           slot 2: 1 choice   -> 3 * 2 * 1 = 6 leaves, one per answer

after recording [1,2,3]: pop 3 (used[2]=F), pop 2 (used[1]=F) -> back at [1], the loop tries 3 next
```

## Template

The notebook's optimal approach (`permute_backtrack`) is this skeleton; it has the same shape and choose / explore / un-choose vocabulary as [Deep Dive 21 — Backtracking](../../../deep_dive/21_Backtracking/README.md).

```python
def permute(nums):
    out, path, used = [], [], [False] * len(nums)
    def backtrack():
        if len(path) == len(nums):            # every slot filled: one complete ordering
            out.append(path[:])               # record a COPY; path keeps changing
            return
        for i in range(len(nums)):            # ALL indices: order matters, earlier ones may come later
            if used[i]:
                continue                      # already on the path (pruning / duplicate skips go here too)
            used[i] = True;  path.append(nums[i])   # CHOOSE (two pieces of state)
            backtrack()                             # EXPLORE the next slot
            path.pop();      used[i] = False        # UN-CHOOSE (both pieces, reverse order)
    backtrack()
    return out
```

Swap variant (the notebook's `permute_swap`): the array is the path, `nums[first:]` is the unused set; `swap(first, i)`, recurse on `first + 1`, swap back. No `used[]`, same complexity, different output order.

## Problems

| # | Problem | Difficulty | Twist on the template | Time | Space | Notebook | Interactive |
|---|---------|------------|-----------------------|------|-------|----------|-------------|
| 1 | [Permutations](https://leetcode.com/problems/permutations/) | Medium | None: the template as is (`used[]` DFS); the in-place swap version is the alternate | `O(n · n!)` | `O(n)` extra | [notebook](permutations.ipynb) | [interactive](permutations.html) |

The notebook also builds the answer iteratively by inserting each new number into every gap of every ordering so far (`O(n · n!)` time, `O(n!)` extra memory), and checks all three against `itertools.permutations` for every `n` from 1 to 6. Because `n!` explodes, its benchmark grows `n` by 1 (5 → 9) instead of doubling: the predicted ratio per step is `(n+1)²/n` (≈ 7.2×, 8.2×, 9.1×, 10.1×), climbing by about 1× per step, and the measured ratios follow it.

**Follow-up variants** (not separate NeetCode 150 problems, asked as follow-ups): Permutations II (LC 47, duplicates: sort, then skip `i > 0 and nums[i] == nums[i-1] and not used[i-1]`), Next Permutation (LC 31, one in-place step in sorted order, no recursion), Permutation Sequence (LC 60, the k-th ordering by counting `(n-1)!` blocks). The lesson's practice section works one example of each.

## Traps and look-alikes

- **Subsets / Combinations look-alike.** Their loop is `for i in range(start, n)` and recurses with `i + 1`: it never looks back, so it produces each *set* once. Copying that loop here gives combinations, not orderings. Permutations loop over `range(n)` and use `used[i]` instead. See [Subsets](../01_Subsets/README.md) and [Combinations](../02_Combinations/README.md).
- **Un-choose both pieces of state.** `path.pop()` without `used[i] = False` leaves numbers marked forever: after the first ordering nothing is free, and the result is just `[[1, 2, 3]]`.
- **Record a copy.** `out.append(path)` stores the same list object every time; it is empty when the search ends. Use `path[:]`.
- **Duplicates in the input** (Permutations II). The plain template treats equal values as different items: `[1, 1, 2]` gives 6 lists, only 3 distinct. Sort, then skip a value equal to its left neighbour when that neighbour is **not** used (it was already tried at this level).
- **Swap version.** Forgetting to swap back scrambles the array for later branches; starting the loop at `first + 1` skips the ordering that keeps `nums[first]` in place. Its output is not in sorted order.
- **Next Permutation is not this pattern.** It asks for one ordering, not all of them: a right-to-left scan, one swap and a suffix reverse, `O(n)`.

## Say it in the interview

"Order matters, so this is permutations: I'll backtrack with a path and a used array, and at each level loop over every index, skipping the used ones. I choose by marking and appending, recurse, then pop and unmark; when the path has n numbers I append a copy. There are n! orderings and each copy costs O(n), so it's O(n · n!) time, which is the size of the output, with O(n) extra space for the path, the used array and the call stack."
