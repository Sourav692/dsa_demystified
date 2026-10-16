# DFS Basics

Solve a tree problem by asking each node the same small question, letting recursion ask its children, and combining their answers on the way back up.

**Type:** Trees · **Problems:** 5 · [Interactive lesson](01_dfs_basics_lesson.html)

## The tell

- The input is a binary tree (`root: TreeNode`) and the answer is built from **every node**: invert, depth, count, compare.
- The question about a node can be answered from **the same question about its children**: "how deep is my left subtree?", "are my left subtrees equal?".
- Words like *depth*, *height*, *mirror / flip*, *identical*, *subtree*, *on the path from the root*.
- Something must travel **down** from the ancestors (the largest value on the path so far) or **up** from the children (a count, a depth, a yes/no).

## The idea

A tree is a node plus two smaller trees. So write a function for one node and trust it for the children:

1. **Base case:** an empty child (`None`) has a fixed answer: `0`, `True`, `None`.
2. **Work at this node:** swap children, compare values, check "is this node good?".
3. **Recurse:** call the same function on `node.left` and `node.right`, passing down any state the children need.
4. **Combine:** build this node's answer from the two child answers and return it to the parent.

```
            state goes DOWN (e.g. max on path)
                 |
              [ 3 ]          answer = combine(3, left, right)
              /    \
         [ 1 ]      [ 4 ]    each child runs the same function
         /          /   \
      [ 3 ]      [ 1 ]  [ 5 ]
        ^
        answers come back UP (counts, depths, True/False)
```

Every node is visited once (`O(n)` time). The call stack holds one frame per level of the current path (`O(h)` space, `h` = tree height: `log n` when balanced, `n` for a chain).

## Template

The optimal approach in every notebook here is this skeleton with the blanks filled in:

```python
def solve(root):
    def dfs(node, state):                   # state: what the ancestors pass down (optional)
        if not node:                        # 1. base case: empty subtree
            return BASE                     #    0 for counts/depth, True for "all match", None to rebuild
        # 2. work at this node: use state and node.val, maybe change the node
        new_state = update(state, node.val)  #    e.g. max(max_so_far, node.val)
        left = dfs(node.left, new_state)    # 3. same question for each child
        right = dfs(node.right, new_state)
        return combine(node, left, right)   # 4. this node's answer from the children's
    return dfs(root, initial_state)
```

Count Good Nodes fills it in like this (the notebook's Approach 2, type hints dropped):

```python
def good_nodes_dfs(root):
    def dfs(node, max_so_far):
        if not node:
            return 0                                   # base case: empty adds nothing
        good = 1 if node.val >= max_so_far else 0      # nothing above is bigger -> good
        new_max = max(max_so_far, node.val)            # state handed DOWN to the children
        return good + dfs(node.left, new_max) + dfs(node.right, new_max)
    return dfs(root, root.val) if root else 0
```

## Problems

| # | Problem | Difficulty | Twist on the template | Time | Space | Notebook | Interactive |
|---|---------|------------|-----------------------|------|-------|----------|-------------|
| 1 | Invert Binary Tree | Easy | Work = swap the two children; combine = return the node | `O(n)` | `O(h)` | [ipynb](invert_binary_tree.ipynb) | [html](invert_binary_tree.html) |
| 2 | Maximum Depth of Binary Tree | Easy | No state down; combine = `1 + max(left, right)` | `O(n)` | `O(h)` | [ipynb](maximum_depth_of_binary_tree.ipynb) | [html](maximum_depth_of_binary_tree.html) |
| 3 | Same Tree | Easy | Walk two trees in lockstep; base = both empty `True` / one empty `False`; combine = `left and right` | `O(n)` | `O(h)` | [ipynb](same_tree.ipynb) | [html](same_tree.html) |
| 4 | Subtree of Another Tree | Easy | Outer DFS runs Same Tree at every node; combine = `left or right` (serializing both trees is the `O(m+n)` upgrade) | `O(m·n)` | `O(h)` | [ipynb](subtree_of_another_tree.ipynb) | [html](subtree_of_another_tree.html) |
| 5 | Count Good Nodes in Binary Tree | Medium | State down = max on the path; combine = `good + left + right` | `O(n)` | `O(h)` | [ipynb](count_good_nodes_in_binary_tree.ipynb) | [html](count_good_nodes_in_binary_tree.html) |

## Traps and look-alikes

- **DFS Height and Global** (Diameter, Balanced Binary Tree, Max Path Sum) uses the same recursion, but the answer can pass *through* a node using both children. Returning only the depth loses it: keep a separate best-so-far variable and still return `1 + max(left, right)`.
- **BST property** (Validate BST) also passes state down, like Count Good Nodes. But comparing a node only with its parent misses violations from a grandparent: pass a `(low, high)` range from all ancestors.
- **BFS level order** fits "level by level", "right side view", "zigzag". Maximum Depth works either way; once the question is *per level*, a queue is the natural fit.
- **Base case first.** Same Tree must handle "both empty" and "one empty" before reading `.val`, or it crashes on `None`.
- **Equal values count** in Count Good Nodes: the test is `>=`, not `>`. Start `max_so_far` at `root.val` (not `0`) so negative values work.
- **Subtree by serialization** needs markers for values and empty children, or `12` matches a stray `2`.
- **Recursion depth.** A chain of `n` nodes makes `n` nested calls; Python stops at about 1000 by default. The Count Good Nodes benchmark raises it with `sys.setrecursionlimit`.

## Say it in the interview

"This is a tree, and the answer for a node depends only on its children's answers plus what its ancestors tell it, so I'll write one recursive DFS. The base case is an empty node; at each node I do constant work, pass any path state down, and combine the left and right results on the way up. That visits each node once, so it's O(n) time and O(h) space for the call stack."
