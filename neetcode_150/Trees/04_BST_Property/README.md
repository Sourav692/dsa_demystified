# BST Property

Use the ordering rule of a binary search tree (left subtree smaller, right subtree larger, at every node) to decide where to go, what range a node must fit in, or in what order to visit nodes.

**Type:** Trees · **Problems:** 3 · [Interactive lesson](04_bst_property_lesson.html)

## The tell

- The input is a **binary search tree**, not just a binary tree. If the statement says "BST", the ordering is a gift: use it.
- "Lowest common ancestor **in a BST**", "where do the paths to `p` and `q` split": compare values to walk one path.
- "Is this a **valid** BST?", "is the tree ordered correctly": every node must fit a range set by **all** its ancestors.
- "**k-th smallest** / k-th largest in a BST", "sorted order of a BST": an in-order walk visits values in sorted order.

## The idea

At every node the BST rule splits the value line in two: everything left is smaller, everything right is larger. That one fact gives three moves.

```
          6              at 6:  both targets < 6  -> go left
        /   \                   both targets > 6  -> go right
       2     8                  otherwise          -> split here = LCA
      / \   / \
     0   4 7   9         window each node must fit:  8 in (6, +inf),  7 in (6, 8)

     in-order (left, node, right):  0  2  4  6  7  8  9   <- sorted
```

1. **Walk by comparison.** One comparison per level throws away a whole subtree, so a search costs `O(h)`, not `O(n)`.
2. **Carry a `(low, high)` window down.** Going left caps `high` at the node's value; going right raises `low`. A node that falls outside its window breaks the BST, even if it looks fine next to its parent.
3. **In-order is sorted.** Left, node, right visits a BST from smallest to largest, so "the k-th smallest" is "the k-th node in-order".

## Template

The three moves, as the notebooks' optimal approaches write them:

```python
# 1) Walk by comparison (LCA of a BST) — O(h) time, O(1) space
def lca_iter(root, p, q):
    node = root
    while node:
        if p < node.val and q < node.val:   # both smaller -> answer is on the left
            node = node.left
        elif p > node.val and q > node.val: # both larger -> answer is on the right
            node = node.right
        else:                               # they split here (or one equals node)
            return node.val
    return -1

# 2) Carry a (low, high) window down the DFS (Validate BST) — O(n) time, O(h) space
def is_valid_bounds(root):
    def valid(node, low, high):
        if not node:
            return True                     # empty subtree is fine
        if not (low < node.val < high):     # strict: duplicates are not allowed
            return False
        return valid(node.left, low, node.val) and valid(node.right, node.val, high)
    return valid(root, float("-inf"), float("inf"))

# 3) In-order with a counter, stop early (Kth Smallest) — O(h + k) time, O(h) space
def kth_early(root, k):
    stack, node, count = [], root, 0
    while stack or node:
        while node:                         # dive to the smallest unvisited node
            stack.append(node)
            node = node.left
        node = stack.pop()
        count += 1                          # one more value visited, in sorted order
        if count == k:
            return node.val                 # stop: no need to walk the rest
        node = node.right
    return -1
```

## Problems

| # | Problem                                                                                                         | Difficulty | Twist on the template                                                                                  | Time         | Space    | Notebook                                         | Interactive                                         |
| - | --------------------------------------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------ | ------------ | -------- | ------------------------------------------------ | --------------------------------------------------- |
| 1 | [Lowest Common Ancestor of a BST](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/) | Medium     | Walk by comparison; the first node where `p` and `q` go different ways (or equal it) is the answer | `O(h)`     | `O(1)` | [notebook](lowest_common_ancestor_of_a_bst.ipynb) | [step-through](lowest_common_ancestor_of_a_bst.html) |
| 2 | [Validate Binary Search Tree](https://leetcode.com/problems/validate-binary-search-tree/)                        | Medium     | DFS carrying `(low, high)` bounds; alternative: in-order values must strictly increase               | `O(n)`     | `O(h)` | [notebook](validate_binary_search_tree.ipynb)     | [step-through](validate_binary_search_tree.html)     |
| 3 | [Kth Smallest Element in a BST](https://leetcode.com/problems/kth-smallest-element-in-a-bst/)                    | Medium     | Iterative in-order with a counter; return at `count == k`                                            | `O(h + k)` | `O(h)` | [notebook](kth_smallest_element_in_a_bst.ipynb)   | [step-through](kth_smallest_element_in_a_bst.html)   |

`h` is the tree height: `log n` when balanced, `n` when the tree is a chain.

## Traps and look-alikes

- **Comparing a node only with its parent (Validate BST).** In `[5,4,6,None,None,3,7]` the node `3` is a fine left child of `6`, but it sits in `5`'s right subtree, so it must be greater than `5`. Only the inherited `(low, high)` window catches that. This is the canonical trap in the NeetCode notes.
- **`<=` vs `<`.** The notebooks treat duplicates as invalid: the bounds check is strict (`low < node.val < high`) and the in-order check fails on `node.val <= prev`.
- **LCA of a plain binary tree** looks the same but has no ordering, so you cannot pick a side by comparison; you have to search both subtrees (`O(n)`). If the statement does not say BST, this pattern does not apply.
- **Forgetting the "equal" case in LCA.** If `p` (or `q`) equals the current node, that node is the answer. The `else` branch covers it because neither "both smaller" nor "both larger" holds.
- **Collecting the whole in-order list for k-th smallest.** Correct but `O(n)` time and space; stopping at `count == k` costs `O(h + k)`.
- **1-indexed `k`.** The k-th smallest is `vals[k - 1]` in the full list, or the node where `count == k`.
- **Reaching for a heap on "k-th smallest".** That is the Top-K pattern for unsorted data; a BST is already sorted in-order, so no heap is needed.

## Say it in the interview

"It's a BST, so at every node everything left is smaller and everything right is larger. For LCA I compare both targets with the node and walk toward them until they split, which is `O(h)`. For validation I pass a `(low, high)` window down the recursion, because a node has to respect every ancestor, not just its parent; for k-th smallest I walk in-order, which is sorted, and stop at the k-th node."
