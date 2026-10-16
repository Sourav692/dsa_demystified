# Frequency Count

Tally how many times each key appears in a hash map in one pass, then answer the question by reading the tallies: compare them, group by them, rank by them, or multiply them.

**Type:** Arrays and Hashing · **Problems:** 4 · [Interactive lesson](02_frequency_count_lesson.html)

## The tell

- **"Same letters / same items, any order"**: anagram, permutation of, rearrange, "same characters". Order doesn't matter, only how many of each.
- **"Group things that are equivalent"**: the items share a multiset of parts, so a frozen count can be the group's key.
- **"Most frequent / top k / appears more than"**: the answer is ranked by how often something occurs.
- **"Duplicates are treated as different" + "how many ways"**: equal items multiply the answer, so you need their counts, not just their presence.
- A constraint asking for `O(n)` where sorting would be `O(n log n)`.

## The idea

A hash map turns "how many of X have I seen?" into one `O(1)` lookup. Build it once (one pass, `O(n)`), and every later question about counts is cheap. The four problems differ only in what they do with the finished counts.

```
s = "anagram"                      t = "nagaram"
tally s            ->  {a:3, n:1, g:1, r:1, m:1}
spend t letter by letter:
  n -> {a:3, g:1, r:1, m:1}   (n hit 0, removed)
  a -> {a:2, g:1, r:1, m:1}
  ...
  m -> {}                      every count cancelled -> anagram

count -> compare   (Valid Anagram)      count -> key of another map   (Group Anagrams)
count -> rank      (Top K Frequent)     count -> multiply             (Detect Squares)
```

## Template

The optimal approach in every notebook here (`is_anagram_count`, `group_count`, `top_k_bucket`, `DetectSquares`) is this skeleton; only the "read the counts" step changes.

```python
def frequency_count(items):
    count = {}                              # key -> how many times it was seen
    for x in items:                         # ONE pass: O(n)
        key = x                             # a letter, a value, a point (x, y) ...
        count[key] = count.get(key, 0) + 1  # O(1) average per update
    # Read the counts to answer (this is the only line that changes):
    #   compare two count maps      -> Valid Anagram
    #   tuple(counts) as a dict key -> Group Anagrams
    #   bucket[freq].append(key)    -> Top K Frequent Elements
    #   cnt[a] * cnt[b] * cnt[c]    -> Detect Squares
    return count
```

`collections.Counter(items)` builds the same map in one call; reading a missing key from a `Counter` returns `0` without inserting it.

## Problems

| # | Problem | Difficulty | Twist on the template | Time | Space | Notebook | Interactive |
|---|---------|------------|-----------------------|------|-------|----------|-------------|
| 1 | [Valid Anagram](https://leetcode.com/problems/valid-anagram/) | Easy | Tally `s`, then spend the tallies on `t`; an empty map at the end means equal counts | `O(n)` | `O(1)` (≤ 26 keys) | [notebook](valid_anagram.ipynb) | [interactive](valid_anagram.html) |
| 2 | [Group Anagrams](https://leetcode.com/problems/group-anagrams/) | Medium | Each word's 26-letter count, frozen as a `tuple`, is the key of a second map that collects the group | `O(n·k)` | `O(n·k)` | [notebook](group_anagrams.ipynb) | [interactive](group_anagrams.html) |
| 3 | [Top K Frequent Elements](https://leetcode.com/problems/top-k-frequent-elements/) | Medium | Count values, then bucket them by count (`bucket[freq]`) and read buckets from the top | `O(n)` | `O(n)` | [notebook](top_k_frequent_elements.ipynb) | [interactive](top_k_frequent_elements.html) |
| 4 | [Detect Squares](https://leetcode.com/problems/detect-squares/) | Medium | Count points as they are added; `count(q)` multiplies three corner counts for each diagonal point | `add` `O(1)`, `count` `O(n)` | `O(n)` | [notebook](detect_squares.ipynb) | [interactive](detect_squares.html) |

`n` = input length (letters, words, values, or added points), `k` = word length. Each notebook also has a slower approach to compare against:

- **Valid Anagram, Group Anagrams:** sort instead of count (`O(n log n)`, `O(n·k log k)`). With the notebooks' inputs (one repeated short pattern, words of length 4) both approaches measure ≈2× per doubling, and the sort-based code is not slower in Python. The `log` factor is real but small next to Python's per-step overhead.
- **Top K Frequent:** a size-`k` heap via `heapq.nlargest` (`O(n log k)`). With `k = 10` it also measures ≈2× per doubling.
- **Detect Squares:** a plain list rescanned for each corner (`O(n²)` per `count`). On the notebook's worst case it measures ≈4× per doubling, against ≈2× for the counter.

## Traps and look-alikes

- **Hash Lookup (the pattern before this one).** A `set` or `dict` answering "have I seen X?" is presence; frequency count is *how many*. If duplicates change the answer (anagrams, "duplicates count as different"), you need counts.
- **Raw string or list as a key.** Group by a canonical form (sorted string, or `tuple` of 26 counts), never by the word itself. A `list` can't be a dict key: convert to `tuple`.
- **Not checking for leftovers** in Valid Anagram: with `s = "ab"`, `t = "a"` every letter of `t` is found, but `b:1` is left over. The notebook's count version ends with `return len(count) == 0`; its up-front `len(s) != len(t)` check is a quick reject for the same case.
- **Sorting all counts for Top K.** `sorted(count.items(), key=...)` is `O(n log n)`. A size-`k` min-heap is `O(n log k)`; buckets indexed by frequency are `O(n)` because a frequency is at most `n`. (NeetCode's heap trap: for the k *largest*, keep a *min*-heap of size k.)
- **Detect Squares zero area.** `|dx| == |dy|` is also true when both are 0. Require `px != qx`.
- **Detect Squares duplicates.** Multiply counts; don't dedupe, and don't iterate the raw list of duplicates *and* multiply by the count (that double-counts).
- **Inserting while iterating.** Reading a missing key from a `defaultdict` inserts it and breaks `for ... in cnt.items()`. `Counter[...]` and `dict.get` reads don't insert.
- **When `O(1)` extra space is demanded.** A hash map is `O(distinct keys)` space. NeetCode's Arrays & Hashing trap: under an `O(1)`-space constraint (or a linked structure), the map is the wrong tool.

## Say it in the interview

"Order doesn't matter here, only how many of each, so I'll build a frequency map in one pass, O(n). Then I answer from the counts: compare them for an anagram, use them as a tuple key to group, bucket by them for top k, or multiply them to count combinations. Each lookup is O(1) on average, so the whole thing stays linear."
