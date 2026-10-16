# Grid Backtracking

Search a grid for a path of neighbouring cells with DFS: mark the current cell as used, explore its 4 neighbours, then restore the cell on the way back so other paths can still use it.

**Type:** Backtracking · **Problems:** 1 · [Interactive lesson](05_grid_backtracking_lesson.html)

## The tell

- A **2D board** of letters or values, and the answer is a **path of adjacent cells** (up, down, left, right).
- "**Each cell may be used at most once**" / "the same letter cell may not be used more than once": a per-path no-reuse rule.
- The question is about **one path** matching a sequence ("does the word exist", "find a path that spells / sums to"), not about whole regions.
- Small limits (Word Search: board up to 6×6, word up to 15 letters): a hint that an exponential search with pruning is expected.

## The idea

Run a DFS from every cell. A call `dfs(r, c, i)` asks: *can the word, from letter `i` on, start at cell (r, c)?*

1. **Prune:** off the board, or the cell's letter is not `word[i]` → `False` immediately.
2. **Choose:** overwrite the cell with `#`. The path can't step on it again, because `#` never matches a letter.
3. **Explore:** try the 4 neighbours for `word[i + 1]`.
4. **Un-choose:** write the letter back before returning, whatever the result.

The mark belongs to the **current path only**. When the DFS backs out of a cell, the cell is free again for the next path.

```
board            word = "ABCCED"           path while dfs(2,1,5) runs     after all calls return

A B C E          dfs(0,0,0) A  mark        # # # E                         A B C E
S F C S          dfs(0,1,1) B  mark        S F # S                         S F C S
A D E E          dfs(0,2,2) C  mark        A # # E                         A D E E
                 dfs(1,2,3) C  mark
                 dfs(2,2,4) E  mark        (1,2) is '#', so the E at        every '#' restored:
                 dfs(2,1,5) D  mark         (2,2) can't step back on it     the board is unchanged
                 dfs(3,1,6) i == 6 -> True
```

## Template

The optimal approach in the notebook (`exist`) is this skeleton:

```python
def exist(board, word):
    rows, cols = len(board), len(board[0])

    def dfs(r, c, i):                       # can word[i:] start at cell (r, c)?
        if i == len(word):
            return True                     # every letter matched
        if r < 0 or c < 0 or r >= rows or c >= cols or board[r][c] != word[i]:
            return False                    # prune: off the board, wrong letter, or '#' (used on this path)
        tmp = board[r][c]; board[r][c] = "#"            # choose: mark the cell used
        found = (dfs(r + 1, c, i + 1) or dfs(r - 1, c, i + 1) or
                 dfs(r, c + 1, i + 1) or dfs(r, c - 1, i + 1))   # explore the 4 neighbours
        board[r][c] = tmp                   # un-choose: restore, so other paths can use the cell
        return found

    return any(dfs(r, c, 0) for r in range(rows) for c in range(cols))   # try every start cell
```

## Problems

| # | Problem | Difficulty | Twist on the template | Time | Space | Notebook | Interactive |
|---|---------|------------|-----------------------|------|-------|----------|-------------|
| 1 | [Word Search](https://leetcode.com/problems/word-search/) | Medium | None: the template as is, matching `word[i]` at depth `i` | `O(rows·cols·3^L)` | `O(L)` | [notebook](word_search.ipynb) | [interactive](word_search.html) |

`L` = word length. After the first step a path has at most 3 unused neighbours, hence `3^L`. The notebook also has a brute force that builds every path of `L` cells and compares letters only at the end (`O(rows·cols·3^L·L)`). Its benchmark shows:

- **Grid sweep:** both approaches grow about 4× when the grid side doubles.
- **Worst-case word sweep** (all-`'A'` board): both grow about 2.1–2.5× per extra letter, so the exponential worst case is the same.
- **Random board:** the brute force still grows about 2.1–2.5× per letter, while backtracking stays flat, because the letter check cuts almost every path after one step.

## Traps and look-alikes

- **Flood fill (Number of Islands) looks the same but never restores.** Both run DFS over 4 neighbours of a grid. In [Number of Islands](https://leetcode.com/problems/number-of-islands/) a visited cell stays visited for good, since each cell belongs to one island and is counted once. In Word Search the mark is undone on the way back, because a cell that failed on one path may be needed by another. Ask: am I *covering regions* (mark forever) or *searching for one path* (mark and restore)?
- **One global `visited` set that is never cleared.** It behaves like flood fill and gives wrong answers. In the notebook's test `[["C","A","A"],["A","A","A"],["B","C","D"]]`, `"AAB"` is `True`, but a never-cleared set returns `False`: the earlier failed paths leave the cells it needs blocked.
- **Forgetting the restore.** The same bug in another form: the `#` marks pile up, and later start cells see a board full of holes.
- **Reusing a cell inside one word.** Without a mark, `[["a","a"]]` with `"aaa"` would bounce back and forth and return `True`; the answer is `False`.
- **"Word search" does not mean trie.** One word needs only this DFS. A trie appears in the follow-up *Word Search II* (many words): it is the dictionary that prunes by prefix, while the search itself is still this grid DFS with mark and restore.
- **General backtracking look-alike.** This is the same choose → explore → un-choose loop as [Subsets](../01_Subsets/README.md). The choices are the 4 neighbours instead of the remaining elements, and the "path" is the board's `#` marks instead of a `path` list.

## Say it in the interview

"The word must be a path of adjacent cells with no reuse, so I'll run a DFS from every cell. At each step I check the letter and prune at once if it doesn't match. Otherwise I mark the cell with `#`, try the 4 neighbours for the next letter, and restore it on the way back so other paths can use it. Worst case is O(rows·cols·3^L) time, because each step has at most 3 new neighbours, and O(L) space for the recursion."
