# Build and Serialize

Turn a tree into a flat sequence and back again: one traversal plus just enough extra information (inorder positions, or explicit null markers) pins the tree down uniquely.

**Type:** Trees · **Problems:** 2 · [Interactive lesson](05_build_and_serialize_lesson.html)

## The tell

- "Construct / rebuild / recover the tree from its traversals" (preorder + inorder, inorder + postorder).
- "Serialize and deserialize", "encode / decode", "save and restore a tree", "send a tree as a string".
- The input or output is a **flat list or string**, and the other side is a **tree with a specific shape**.
- Signals from the plan: *Recursion + inorder index map* (Construct) and *BFS or preorder with nulls* (Serialize).

## The idea

Preorder lists nodes as **root, left subtree, right subtree**. So the next unread preorder value is always the root of whatever subtree you are about to build. What preorder alone does *not* tell you is where the left subtree stops and the right one starts. Two ways to supply that missing piece:

1. **Inorder positions** (Construct). In inorder the root sits *between* its left and right subtrees. Look the root up in a `value -> inorder index` map: everything to its left in the current inorder window is the left subtree, everything to its right is the right subtree.
2. **Null markers** (Serialize). Write a `#` for every empty child. Now each `#` says "this subtree ends here", so preorder by itself is enough to rebuild the shape.

```
preorder = [3, 9, 20, 15, 7]      inorder = [9, 3, 15, 20, 7]
            ^ root                             |  ^  |
                                          left    right
            3                                 [9] 3 [15, 20, 7]
           / \
          9   20          serialize([1,2,3,None,None,4,5])
             /  \           -> "1,2,#,#,3,4,#,#,5,#,#"
            15   7             each '#' closes an empty child
```

Both directions read the sequence in the **same order it was written**: one pointer (or iterator) moves forward through preorder, and each recursive call takes exactly the values its subtree owns.

## Template

The optimal approach in both notebooks is this shape: a recursive helper that consumes the sequence front to back, building the root first, then the left subtree, then the right.

```python
# --- Build from preorder + inorder (Construct, notebook Approach 2) ---
def build_fast(preorder, inorder):
    idx = {v: i for i, v in enumerate(inorder)}  # value -> inorder position, O(1) split
    self_pre = [0]                               # next unread preorder index (list so helper can mutate it)
    def helper(lo, hi):                          # build the subtree whose values are inorder[lo..hi]
        if lo > hi:                              # empty window -> no node
            return None
        val = preorder[self_pre[0]]              # next preorder value is this subtree's root
        self_pre[0] += 1
        node = TreeNode(val)
        m = idx[val]                             # root's inorder position splits the window
        node.left = helper(lo, m - 1)            # left FIRST: preorder lists the left subtree next
        node.right = helper(m + 1, hi)
        return node
    return helper(0, len(inorder) - 1)

# --- Serialize / deserialize with null markers (Serialize, notebook Approach 2) ---
def serialize(root):
    out = []
    def dfs(n):
        if not n:
            out.append("#")                      # marker: an empty child, so the shape is recorded
            return
        out.append(str(n.val))                   # root, then left, then right (preorder)
        dfs(n.left); dfs(n.right)
    dfs(root)
    return ",".join(out)

def deserialize(data):
    vals = iter(data.split(","))                 # read tokens in the SAME order they were written
    def build():
        v = next(vals)
        if v == "#":
            return None
        node = TreeNode(int(v))
        node.left = build()                      # left first, matching serialize
        node.right = build()
        return node
    return build()
```

## Problems

| # | Problem | Difficulty | Twist on the template | Time | Space | Notebook | Interactive |
|---|---------|------------|-----------------------|------|-------|----------|-------------|
| 1 | [Construct Binary Tree from Preorder and Inorder Traversal](https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/) | Medium | The split comes from a `value -> inorder index` map; recurse on index bounds `(lo, hi)` instead of slices. Naive `list.index` + slicing is `O(n²)`. | `O(n)` | `O(n)` | [notebook](construct_binary_tree_preorder_inorder.ipynb) | [step-through](construct_binary_tree_preorder_inorder.html) |
| 2 | [Serialize and Deserialize Binary Tree](https://leetcode.com/problems/serialize-and-deserialize-binary-tree/) | Hard | You design the format: write `#` for every empty child so one traversal is enough. Preorder DFS (optimal, shorter) or BFS level order (the notebook's Approach 1). | `O(n)` | `O(n)` | [notebook](serialize_and_deserialize_binary_tree.ipynb) | [step-through](serialize_and_deserialize_binary_tree.html) |

## Traps and look-alikes

- **Slicing instead of bounds.** `preorder[1:mid+1]` and `inorder[:mid]` copy lists at every level and invite off-by-one errors. Pass `(lo, hi)` and one shared preorder pointer.
- **Scanning for the root.** `inorder.index(root)` inside the recursion is what makes the naive build `O(n²)`; the precomputed dict removes it.
- **Building right before left.** The preorder pointer only works if you recurse left first, because preorder lists the whole left subtree before the right one.
- **Skipping the markers.** Without `#` for empty children, `"1,2"` could be 2 as a left child or a right child: the shape is ambiguous.
- **Reading back in a different order.** Deserialize must mirror serialize: preorder writer, preorder reader (or BFS writer, BFS reader).
- **Distinct values.** The inorder map assumes every value is unique, which the Construct problem guarantees. Serialize needs no such assumption.
- **Look-alike: [Binary Tree Level Order Traversal](../03_BFS_Level_Order/).** BFS appears here too, but only as one way to *write* the sequence; the goal is a lossless round trip, not a per-level answer.
- **Look-alike: Same Tree / Subtree of Another Tree ([DFS Basics](../01_DFS_Basics/)).** Those compare two trees node by node. Serialization can also do that comparison, but there you only read trees, you never build one.

## Say it in the interview

"Preorder hands me roots in order, but it doesn't tell me where the left subtree ends. For Construct I get that from inorder: a hash map from value to inorder index tells me the split in O(1), so with one moving preorder pointer and index bounds the whole build is O(n). For Serialize I make preorder self-describing by writing a `#` for every empty child, and deserialize reads the tokens back in exactly the same order, so both directions are O(n)."
