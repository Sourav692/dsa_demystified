# DFS Height and Global

A post-order DFS that **returns** one thing to the parent (a height, or a "max gain") while **updating** another: a global/`nonlocal` best answer, or a `-1` sentinel that means "already failed".

**Type:** Trees · **Problems:** 3 · [Interactive lesson](02_dfs_height_and_global_lesson.html)

## The tell

- The answer at a node needs **both** children's results: "at every node, compare left and right", "path between any two nodes", "may or may not pass through the root".
- The thing the parent needs is **different** from the answer:
  - the parent needs a height (one arm), the answer is a path (two arms) → Diameter, Max Path Sum;
  - the parent needs a height, the answer is True/False → Balanced.
- A first idea that calls `height()` inside a recursion over every node. That is the `O(n²)` brute force this pattern replaces.

## The idea

Ask the children first (post-order), so each node sees its children's values once. At each node, ask three questions:

1. **Base case:** what does an empty subtree hand back? (`0`)
2. **Side effect:** what answer uses *both* arms here? Record it in `best` (or turn it into `-1`).
3. **Return:** what *one* value can the parent extend? (`1 + max(left, right)`)

```
            1          best = max(best, L + R)  <- uses BOTH arms (recorded, never returned)
          /   \
         2     3       return 1 + max(L, R)      <- ONE arm handed to the parent
        / \
       4   5

  post-order:  4 -> 5 -> 2 -> 3 -> 1     (values flow bottom-up, each node visited once)
```

## Template

The optimal approach in every notebook below is this skeleton.

```python
def solve(root):
    best = 0                              # global answer (only if the answer != what dfs returns)

    def dfs(node):                        # returns ONE thing to the parent: a height / max gain
        nonlocal best
        if not node:
            return 0                      # base case: an empty subtree contributes 0

        left = dfs(node.left)             # post-order: children first
        right = dfs(node.right)
        # (sentinel variant) if left == -1 or right == -1 or <node fails>: return -1

        best = max(best, left + right)    # side effect: the answer that uses BOTH arms here
        return 1 + max(left, right)       # return: the ONE arm a parent can extend

    dfs(root)
    return best                           # (sentinel variant) return dfs(root) != -1
```

## Problems

| # | Problem | Difficulty | Twist on the template | Time | Space | Notebook | Interactive |
|---|---------|------------|-----------------------|------|-------|----------|-------------|
| 1 | Balanced Binary Tree | 🟢 Easy | Return height, or `-1` as a sentinel when a subtree is unbalanced; no global needed | `O(n)` | `O(h)` | [ipynb](balanced_binary_tree.ipynb) | [html](balanced_binary_tree.html) |
| 2 | Diameter of Binary Tree | 🟢 Easy | Return height; global `best = max(best, left + right)` (edges) | `O(n)` | `O(h)` | [ipynb](diameter_of_binary_tree.ipynb) | [html](diameter_of_binary_tree.html) |
| 3 | Binary Tree Maximum Path Sum | 🔴 Hard | Return best downward *gain* `node.val + max(left, right)`, clamping negative arms to `0`; global best = `node.val + left + right`, seeded with `-inf` | `O(n)` | `O(h)` | [ipynb](binary_tree_maximum_path_sum.ipynb) | [html](binary_tree_maximum_path_sum.html) |

`h` = tree height (`log n` when balanced, `n` for a one-sided chain). Each notebook's brute force re-measures heights or downward sums at every node (`O(n²)` upper bound) and benchmarks it against the one-pass DFS.

## Traps and look-alikes

- **Returning the two-armed value.** Returning `left + right` (or `node + left + right`) to the parent is the classic bug: a parent's path cannot use both arms of a child. Record it in `best`, return one arm.
- **Returning only the depth.** Writing plain max-depth and returning `max(left, right)` loses the path that bends at the node. Any value built from *two* subtrees needs the side-effect variable.
- **Plain DFS Basics** (Max Depth, Same Tree, Invert): the returned value *is* the answer. If the answer is the same thing the parent needs, you don't need a global. This pattern starts when they differ.
- **Validate BST** looks like the same DFS but needs bounds passed *down* from ancestors, not values passed *up* from children.
- **Sentinel not propagated.** In Balanced, a parent that gets `-1` from a child must return `-1` at once; otherwise `-1` is treated as a real height.
- **Max Path Sum specifics:** seed `best` with `-inf` (all-negative trees), and clamp a negative arm to `0` (skip it) before using it.
- **Edges vs nodes.** Diameter counts edges, so `left + right` with node-count heights is already correct; don't add 1.

## Say it in the interview

"Each node needs its children's heights, so I'll do one post-order DFS. The function returns the height, which is the one arm a parent can extend, and as a side effect it updates a global best with `left + right`, the path that bends at this node. Every node is visited once, so it's `O(n)` time and `O(h)` stack space."
