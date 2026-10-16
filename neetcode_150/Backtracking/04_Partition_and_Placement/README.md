# Partition and Placement

Backtracking where each step decides **where the next piece goes** (where a substring ends, which column the next queen takes), checks one cheap constraint before committing, recurses, then undoes the move.

**Type:** Backtracking · **Problems:** 2 · [Interactive lesson](04_partition_and_placement_lesson.html)

## The tell

- "Return **all** ways to **partition / split / cut / segment** a string so that every piece …" (is a palindrome, is a dictionary word, is a valid IP part).
- "Place `n` items on a board / in slots so that **no two conflict**, return every arrangement" (queens, Sudoku digits).
- The output is a list of complete arrangements, so you must enumerate, not just count or optimise.
- Each partial arrangement can be **rejected locally**: one new piece or one new queen can be tested against what is already placed, without looking at the rest.

## The idea

The recursion state is a **position** — `start` (where the next piece of the string begins) or `r` (the row that needs a queen). From that position, loop over every possible next move. A move that breaks the constraint is skipped **before** recursing, so its whole sub-tree is never built. A move that passes is applied to shared state, the recursion moves to the next position, and on return the move is undone exactly.

```
Palindrome Partitioning, s = "aab"            each node = a call, number = start

                    0
          "a"/      |"aa"     \"aab"
            1       2          x   (not a palindrome: pruned)
      "a"/   \"ab"   \"b"
        2     x       3  -> record ["aa","b"]
     "b"|
        3  -> record ["a","a","b"]

N-Queens: same loop, the "piece" is a column for row r; the check is three set lookups
   cols = {c}   diag = {r - c}   anti = {r + c}
```

## Template

The optimal approaches in both notebooks (`partition_backtrack`, `solve_n_queens_sets`) are this skeleton. Only the moves, the check, and the state that is applied and undone change.

```python
def solve(problem):
    out, path = [], []                     # answers, and the arrangement being built
    def backtrack(pos):                    # pos = where the next piece goes (start index / row)
        if pos == END:                     # everything placed
            out.append(snapshot(path))     # record a COPY: path keeps changing
            return
        for move in moves_from(pos):       # s[pos:end] for each end / each column c of row pos
            if not ok(move):               # PRUNE before recursing: palindrome? not attacked?
                continue
            apply(move)                    # CHOOSE: path.append(piece) / add c, r-c, r+c, put 'Q'
            backtrack(next_pos(move))      # EXPLORE: end / pos + 1
            undo(move)                     # UN-CHOOSE: mirror image of apply
    backtrack(0)
    return out
```

Palindrome Partitioning (`partition_backtrack`):

```python
def partition_backtrack(s):
    out, path = [], []
    def backtrack(start):
        if start == len(s):
            out.append(path[:]); return
        for end in range(start + 1, len(s) + 1):
            piece = s[start:end]
            if piece != piece[::-1]:          # PRUNE
                continue
            path.append(piece); backtrack(end); path.pop()
    backtrack(0)
    return out
```

N-Queens (`solve_n_queens_sets`): the check is `c in cols or (r - c) in diag or (r + c) in anti`; apply/undo touch all three sets **and** `board[r][c]`.

## Problems

| # | Problem | Difficulty | Twist on the template | Time | Space | Notebook | Interactive |
|---|---------|------------|-----------------------|------|-------|----------|-------------|
| 1 | [Palindrome Partitioning](https://leetcode.com/problems/palindrome-partitioning/) | Medium | Move = where the next piece ends (`s[start:end]`); check = palindrome; next position = `end` | `O(n · 2^n)` | `O(n)` | [notebook](palindrome_partitioning.ipynb) | [interactive](palindrome_partitioning.html) |
| 2 | [N-Queens](https://leetcode.com/problems/n-queens/) | Hard | Move = a column for row `r`; check = three `O(1)` set lookups (`cols`, `r - c`, `r + c`); next position = `r + 1` | `O(n!)` | `O(n²)` | [notebook](n_queens.ipynb) | [interactive](n_queens.html) |

Time is for the worst case; space excludes the output. Both notebooks also show what the template replaces:

- **Palindrome Partitioning:** the brute force enumerates all `2^(n-1)` cut patterns with a bitmask and filters them. A third approach precomputes an `is_pal` table (`O(n²)`) so every check is `O(1)`. On `"aaa…a"` all three grow ≈2× per extra character, because every pattern is an answer. On `"abcabc…"` the brute force still grows ≈2× per character, while backtracking stays near 1×: the prune removes every multi-letter piece.
- **N-Queens:** the brute force tries all `n!` column permutations (`O(n · n!)`); a middle approach backtracks but scans the placed queens for each check (`O(n)` per check). Measured from n = 5 to 9, the brute force grows roughly `n×` per extra row (5.7× up to 8.7×), the backtracking versions about 3–5×, and the set version is the fastest (≈5 ms at n = 9, against ≈14 ms for the scan and ≈130 ms for the brute force).

## Traps and look-alikes

- **Recording `path` instead of a copy.** `out.append(path)` stores one list that later pops empty. Use `path[:]`; for N-Queens build fresh strings with `["".join(row) for row in board]`.
- **Undoing only part of the move.** N-Queens changes four things per placement (`cols`, `diag`, `anti`, `board[r][c]`). Forget one and a phantom queen blocks later branches, or a recorded board shows two queens in a row.
- **Checking after recursing instead of before.** The test belongs before `apply`; testing only at the end turns backtracking back into the brute force (the measured ≈2× per character on palindrome-poor strings).
- **Off-by-one on the piece end.** With slicing, `end` runs `start + 1 .. len(s)` and `s[start:end]` excludes `end`; with an inclusive `is_pal[start][end]` table it runs `start .. n - 1` and the next call starts at `end + 1`.
- **Only one diagonal.** `r - c` covers `\` diagonals, `r + c` covers `/` diagonals; both sets are needed.
- **[Subsets](../01_Subsets/README.md) / [Combinations](../02_Combinations/README.md) look-alike.** Those choose **which element** joins the answer, from a start index, and every prefix may be an answer. Here the position is fixed (the next letter, the next row) and you choose **how far the piece reaches** or **where it lands**; only full coverage (`start == len(s)`, `r == n`) is an answer.
- **Counting or minimising is a different question.** "Minimum cuts for a palindrome partition" (Palindrome Partitioning II) or "how many ways" is DP, not enumeration. N-Queens II (count only) keeps the same backtracking but returns a counter instead of boards.

## Say it in the interview

"I need every arrangement, so this is backtracking. My state is the position of the next piece: the start index for the string, or the row for the queens. From there I try every next move, reject it immediately if it breaks the rule (not a palindrome, or the column or a diagonal is already taken, which I keep in three sets for O(1) checks), recurse, and then undo exactly what I did. The worst case is exponential because the output itself can be exponential, `O(n · 2^n)` for partitioning and bounded by `n!` placements for N-Queens, with O(n) extra space for the recursion."
