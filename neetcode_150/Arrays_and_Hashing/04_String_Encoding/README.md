# String Encoding

Pack a list of strings into one string and get the exact list back by writing each string's **length** in front of it, so the reader always knows how far to read.

**Type:** Arrays and Hashing · **Problems:** 1 · [Interactive lesson](04_string_encoding_lesson.html)

## The tell

- "Encode a list of strings to a single string" / "decode it back to the original list".
- "Serialize / deserialize", "send over the network", "store in one field".
- The strings may contain **any** character: there is no character you can safely reserve as a separator.
- `decode` gets only the encoded string: nothing else is shared between the two calls ("stateless").

## The idea

A separator alone is ambiguous: if the data can contain `#`, then `"a#b"` could be one string or two. A length prefix removes the ambiguity. Each string becomes a *frame*: its length in digits, a `#` marker that ends the digits, then the content. The decoder reads digits up to the `#`, then takes exactly that many characters without looking at them. A `#` inside the content is never examined as a marker, because the next search for `#` starts only after the content.

```
strs = ["lint", "code", "a#b"]

encode:  "4#" + "lint"  +  "4#" + "code"  +  "3#" + "a#b"   ->  "4#lint4#code3#a#b"

decode:  4#lint4#code3#a#b
         ^^                  read "4" up to '#'   -> take 4 chars: "lint"   (i = 6)
               ^^            read "4" up to '#'   -> take 4 chars: "code"   (i = 12)
                     ^^      read "3" up to '#'   -> take 3 chars: "a#b"    (i = 17 = end)
                               the '#' inside "a#b" is skipped over, never searched
```

## Template

The notebook's optimal approach (`encode` / `decode`) is exactly this skeleton.

```python
def encode(strs):
    parts = []
    for w in strs:
        parts.append(str(len(w)) + "#" + w)   # frame = length, marker, content
    return "".join(parts)                     # build a list, join once: O(total)

def decode(s):
    res, i = [], 0
    while i < len(s):                         # i always sits at the start of a frame
        j = i
        while s[j] != "#":                    # digits run up to the marker
            j += 1
        length = int(s[i:j])                  # the header: how many chars to take
        start = j + 1
        res.append(s[start:start + length])   # take them blindly: any char is safe
        i = start + length                    # jump past the content to the next frame
    return res
```

## Problems

| # | Problem | Difficulty | Twist on the template | Time | Space | Notebook | Interactive |
|---|---------|------------|-----------------------|------|-------|----------|-------------|
| 1 | [Encode and Decode Strings](https://leetcode.com/problems/encode-and-decode-strings/) (LeetCode Premium, free on [neetcode.io](https://neetcode.io/problems/string-encode-and-decode)) | Medium | None: the template as is | `O(total length)` | `O(total length)` | [notebook](encode_and_decode_strings.ipynb) | [interactive](encode_and_decode_strings.html) |

The notebook also shows the naive scheme (`"#".join` + `split("#")`): same `O(total length)` cost in its benchmark (both ≈2× per doubling), but wrong output: `["a#b"]` decodes to `['a', 'b']`.

## Traps and look-alikes

- **Delimiter only.** `"#".join(strs)` cannot tell `["a#b"]` from `["a", "b"]` (both encode to `"a#b"`), and it cannot tell `[]` from `[""]` (both encode to `""`). Any separator character fails the same way, because the data may contain it.
- **Length without a marker.** `"4lint"` works until a string starts with a digit or a length has two digits: is `"12abc"` length 1 + `"2"` or length 12? The `#` ends the digits. A fixed-width header (`"0004lint"`) is the other fix.
- **Searching for `#` from the wrong place.** The scan for `#` must start at the frame start `i`. Searching the whole string (`s.index("#")` from 0, or `split`) finds markers inside content.
- **Multi-digit lengths.** A 12-character string encodes as `"12#..."`. Read *all* digits up to the `#`, not just one character.
- **Empty strings.** `""` encodes as `"0#"`, so `[""]`, `["", ""]` and `[]` all stay distinct (`"0#"`, `"0#0#"`, `""`).
- **Escaping look-alike.** Escaping (`#` → `/#`, `/` → `//`, then a plain `#` ends each string) also round-trips, but decode must inspect every character for escapes. The length prefix lets decode slice content without reading it, and the code is shorter.
- **Serialize and Deserialize Binary Tree** is the same family (turn a structure into one string and back) but it lives in Trees: there the markers are `null` placeholders in a traversal order, not lengths.

## Say it in the interview

"A plain delimiter breaks because the strings can contain any character, including the delimiter. So I'll frame each string as its length, a `#`, then the content. Decoding reads digits up to the `#`, then slices exactly that many characters, so a `#` inside the data is never treated as a marker. Both directions touch each character once: O(total length) time and space."
