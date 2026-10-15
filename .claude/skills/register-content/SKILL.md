---
name: register-content
description: After adding or renaming a Blind 75 problem or a deep_dive topic, update every index that should link to it (topic README/index.html, track README tables and counts, deep_dive/index.html, root README). Use when new notebooks/HTML lessons were created, files were renamed/moved, or the user says "register", "link it up", "update the indexes".
---

Make new or moved content reachable from every index. Target: $ARGUMENTS (a path, or empty = everything changed per `git status`).

1. **Find what changed.** `git status --porcelain` plus the target path. List new/renamed `.ipynb`, `.html`, `_explained.md`, and folders. Quote paths — they contain spaces.

2. **Blind 75 problem** (`blind_75/<Topic>/[Group N_<pattern>/]<problem>.*`):
   - `<Topic>/README.md`: add the problem under its group/pattern section, matching neighbouring entries.
   - `<Topic>/index.html`: add a card/link for `<problem>.html`, copying an existing card's markup exactly.
   - `<Topic>/patterns.html`: add the problem to its pattern's list if the page lists problems per pattern.
   - `blind_75/README.md`: bump the `N problems` count in the Topics table; add a pattern to "Core patterns" only if genuinely new.
   - `blind_75/index.html`: update counts/links if it lists them.

3. **Deep Dive topic** (`deep_dive/NN_Title_Case/`):
   - `deep_dive/README.md`: add a row to the right track table: `| NN | [Title](NN_X/README.md) | what you'll learn | [open](NN_X/NN_x_lesson.html) |`.
   - `deep_dive/index.html`: add the topic card, copying an existing card's markup.
   - Root `README.md`: update the "NN numbered topics" count in the Track4. **Verify links — case-sensitively.** macOS ignores case, so a plain `os.path.exists` check passes links that 404 on GitHub. Check against the paths git tracks (plus untracked, non-ignored files):
   ```bash
   python3 - "blind_75/README.md" OTHER_EDITED_FILES <<'PY'
   import re, sys, os, subprocess
   from urllib.parse import unquote
   out = subprocess.run(["git", "ls-files", "-z", "--cached", "--others", "--exclude-standard"], capture_output=True, text=True).stdout
   known = set()
   for f in filter(None, out.split("\0")):
       while f:
           known.add(f); f = os.path.dirname(f)
   for f in sys.argv[1:]:
       for m in re.findall(r'\]\(([^)#\s]+)\)|href="([^"#]+)"', open(f).read()):
           p = m[0] or m[1]
           if p.startswith(("http", "mailto:")):
               continue
           if os.path.normpath(os.path.join(os.path.dirname(f), unquote(p))) not in known:
               print(f"MISSING in {f}: {p}")
   PY
   ```
   Fix every `MISSING` you introduced; report pre-existing ones. A folder whose case differs only on disk (e.g. git has `Docs/`, disk shows `docs/`) needs a two-step rename: `git mv Docs tmp && git mv tmp docs`.

ort pre-existing ones.

5. Report: one line per index edited, plus any index you deliberately skipped and why. Do not commit.
