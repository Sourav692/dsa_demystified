# BFS Level Order

Walk a tree one level at a time with a queue, snapshotting `len(q)` so each pass of the inner loop handles exactly one level.

**Type:** Trees · **Problems:** 2 · [Interactive lesson](03_bfs_level_order_lesson.html)

## The tell

- The output is grouped **per level**: "level order", "level by level", "row by row", "by depth", "top to bottom".
- Each level contributes **one answer**: "visible from the right side", "rightmost / leftmost node of each level", "average of each level".
- Level-shape variants: zigzag order, minimum depth (first leaf reached), connecting next pointers across a level.
- "Shortest path" in an unweighted tree or graph: BFS reaches nodes in order of distance from the start.

## The idea

A queue (first in, first out) keeps nodes in the order they were found. Children always join the **back**, so every node of level `d` leaves the queue before any node of level `d + 1`. At the start of a level, the queue holds exactly that level, so `len(q)` at that moment is the level's size. Pop that many nodes, push their children, and the queue now holds exactly the next level.

```
tree: [3,9,20,null,null,15,7]          queue at the start of each level

        3          level 0             [3]        -> pop 1 node  -> record [3]
       / \
      9   20       level 1             [9, 20]    -> pop 2 nodes -> record [9, 20]
         /  \
        15   7     level 2             [15, 7]    -> pop 2 nodes -> record [15, 7]
                                       []         -> done: [[3], [9, 20], [15, 7]]
```

## Template

The optimal approach in both notebooks (`level_order_bfs`, `right_side_view_bfs`) is this skeleton; only the "what to record per level" line changes.

```python
from collections import deque

def level_order(root):
    res = []
    if not root:                      # empty tree: no levels
        return res
    q = deque([root])                 # deque: O(1) popleft (list.pop(0) is O(n))
    while q:
        level = []                    # what this level contributes
        for _ in range(len(q)):       # THE key line: len(q) is frozen = size of this level
            node = q.popleft()
            level.append(node.val)
            if node.left:  q.append(node.left)    # children join the back,
            if node.right: q.append(node.right)   # they are the next level
        res.append(level)             # per-level record: full list, last node, max, ...
    return res
```

## Problems

| # | Problem | Difficulty | Twist on the template | Time | Space | Notebook | Interactive |
|---|---------|------------|-----------------------|------|-------|----------|-------------|
| 1 | [Binary Tree Level Order Traversal](https://leetcode.com/problems/binary-tree-level-order-traversal/) | Medium | None: the template as is, recording each level's full list | `O(n)` | `O(n)` | [notebook](binary_tree_level_order_traversal.ipynb) | [interactive](binary_tree_level_order_traversal.html) |
| 2 | [Binary Tree Right Side View](https://leetcode.com/problems/binary-tree-right-side-view/) | Medium | Record only the last node popped in each level (`res.append(node.val)` after the inner loop) | `O(n)` | `O(w)` | [notebook](binary_tree_right_side_view.ipynb) | [interactive](binary_tree_right_side_view.html) |

`w` = the widest level of the tree. Both notebooks also solve the problem with DFS that tracks depth (`O(n)` time, `O(h)` space); Right Side View adds a brute force that rescans the tree once per depth (`O(n·h)`, measured ≈4× per doubling on a chain-shaped tree).

## Traps and look-alikes

- **Reading `len(q)` after children were appended.** Snapshot it once at the start of the level (`for _ in range(len(q))` evaluates it once). Checking `while q` alone, without the inner loop, mixes levels together.
- **Using a `list` as the queue.** `list.pop(0)` shifts every element, `O(n)` per pop. Use `collections.deque.popleft()`.
- **Right Side View is not "walk the right spine".** When the right subtree is shorter, a left-subtree node is the rightmost node of a deeper level: `[1,2,3,4,null,null,null,5]` → `[1, 3, 4, 5]`.
- **Tree DFS look-alike.** DFS can also produce level groups or the right side view if it carries a `depth` argument (`if depth == len(res)`), and the notebooks show it. Reach for BFS when the answer is organised *by level*; reach for DFS when the answer comes from a whole root-to-leaf path or from combining subtree results (height, diameter, path sums).
- **Minimum depth** (same family): return at the first **leaf** popped (`not node.left and not node.right`), not at the first node of the shallowest level.
- **Zigzag** (same family): reverse every other level's list, or fill each level from alternating ends of a deque. Plain level order alone is not enough.

## Say it in the interview

"The answer is organised by level, so I'll do a BFS with a deque. At the start of each level I freeze the queue's size, pop exactly that many nodes, and push their children, so each pass of the inner loop is one level. That visits every node once: O(n) time, and the queue holds at most about one level, O(w) space."
