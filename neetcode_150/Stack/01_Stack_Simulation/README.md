# Stack Simulation

Scan the input once and keep the items that are still waiting on a stack; each token that resolves something pops the most recent waiting item, checks or combines it, and maybe pushes a result back.

**Type:** Stack · **Problems:** 3 · [Interactive lesson](01_stack_simulation_lesson.html)

## The tell

- **Matching pairs / nesting:** "valid parentheses", "balanced brackets", "every opener closed in the correct order". The most recent opener must close first.
- **Postfix evaluation:** "Reverse Polish Notation", "evaluate the expression", "each operator applies to the previous two values".
- **Design a stack with an extra O(1) query:** "retrieve the minimum element in constant time", "push, pop, top, getMin". The answer to the query is stored with every entry.
- More generally: the input is processed left to right and **the latest unfinished thing is the first one to be finished** (undo, back, collapse, cancel).

## The idea

A stack (last in, first out) is a pile: push onto the top, pop from the top. Items that cannot be resolved yet are pushed and wait. When a token arrives that resolves something, the item it needs is always the **most recent** one still waiting, which is exactly what `pop()` returns. Each token costs O(1), so one pass is O(n).

```
Valid Parentheses, s = "([]{})"          Evaluate RPN, tokens = 4 13 5 / +

char  action             stack           token  action                      stack
 (    opener -> push     [ (             4      number -> push              [4
 [    opener -> push     [ ( [           13     number -> push              [4 13
 ]    top is [ -> pop    [ (             5      number -> push              [4 13 5
 {    opener -> push     [ ( {           /      pop 5, pop 13, push 2       [4 2
 }    top is { -> pop    [ (             +      pop 2, pop 4, push 6        [6
 )    top is ( -> pop    [               end    one value left -> 6
end   stack empty -> True
```

Min Stack uses the same pile, but each entry carries extra state: `(value, min of this entry and everything below it)`. A stack never changes below its top, so that stored minimum stays correct until the entry is popped.

## Template

All three optimal approaches (`valid_paren_stack`, `eval_rpn_stack`, `MinStack`) are this skeleton; what changes is what is pushed and what a resolving token does with the popped item.

```python
def simulate(tokens):
    stack = []                         # items still waiting to be resolved
    for t in tokens:                   # one left-to-right pass
        if resolves(t):                # a closer, an operator, a pop() call ...
            if not stack:              # nothing waiting: invalid input (Valid Parentheses)
                return FAIL
            item = stack.pop()         # the MOST RECENT waiting item
            # check it (does the opener match?) or combine it (a op b),
            # and push a result if later tokens need it
        else:
            stack.append(t)            # wait until something resolves it
    return finish(stack)               # empty? single value left? top of the stack?
```

## Problems

| # | Problem | Difficulty | Twist on the template | Time | Space | Notebook | Interactive |
|---|---------|------------|-----------------------|------|-------|----------|-------------|
| 1 | [Valid Parentheses](https://leetcode.com/problems/valid-parentheses/) | Easy | Push openers; a closer must match the popped opener; valid only if the stack ends empty | `O(n)` | `O(n)` | [notebook](valid_parentheses.ipynb) | [interactive](valid_parentheses.html) |
| 2 | [Min Stack](https://leetcode.com/problems/min-stack/) | Medium | Design problem: push `(val, min so far)` pairs, so `getMin` reads the top and a pop restores the old minimum | `O(1)` per call | `O(n)` | [notebook](min_stack.ipynb) | [interactive](min_stack.html) |
| 3 | [Evaluate Reverse Polish Notation](https://leetcode.com/problems/evaluate-reverse-polish-notation/) | Medium | Push numbers; an operator pops `b` then `a` and pushes `a op b`; division is `int(a / b)` | `O(n)` | `O(n)` | [notebook](evaluate_reverse_polish_notation.ipynb) | [interactive](evaluate_reverse_polish_notation.html) |

Each notebook also has a brute force that the stack replaces: Valid Parentheses deletes adjacent pairs until nothing changes (`O(n²)`), Min Stack scans the whole list on every `getMin` (`O(n)` per call, so `O(n²)` for `n/2` pushes then `n/2` `getMin` calls), and RPN repeatedly collapses the first operator with its two operands (`O(n²)`). In the doubling benchmarks the brute forces grow about 3–4× per doubling of `n` and the stack versions about 2×.

## Traps and look-alikes

- **Popping an empty stack.** In Valid Parentheses a stray closer (`")"`, `"]["`) arrives with nothing waiting: check `not stack` before `stack.pop()`.
- **Forgetting the final check.** `"(("` never fails a match; it is invalid only because the stack is not empty at the end.
- **Operand order in RPN.** The first pop is the **right** operand: `a - b`, `a / b`, never `b - a`.
- **Floor vs truncate.** Python's `//` floors (`7 // -2 == -4`); the problem truncates toward zero (`-3`). Use `int(a / b)`.
- **One `min` variable in Min Stack.** It cannot be rolled back when the minimum is popped. Store the minimum per entry (or keep a second stack of minimums, pushing on `val <= min` so duplicates survive a pop).
- **Monotonic Stack look-alike (pattern 02).** If the problem asks for the *next greater / smaller element* or a *distance in days*, you pop while the top is smaller or larger than the current value and store **indices**, not values. Plain stack simulation pops exactly what each token needs; it does not keep the stack sorted.
- **Valid Parenthesis String with `*`** looks like this pattern, but the wildcard makes stack states explode. A greedy count of the possible open-bracket range (or two passes) is simpler.

## Say it in the interview

"The most recent unfinished item is always the first one to be resolved, so I'll keep the waiting items on a stack. I scan once: push what has to wait, and when a token resolves something, pop the top, check or combine it, and push any result back. Every token is O(1), so it's O(n) time and O(n) space for the stack; for Min Stack I store the running minimum with each entry so every call is O(1)."
