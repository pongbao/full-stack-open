# Regex

1. Basic Characters:

   - `.` : Matches any character except a newline.
   - `\d` : Matches any digit (0-9).
   - `\D` : Matches any non-digit character.
   - `\w` : Matches any word character (alphanumeric character plus underscore \_).
   - `\W` : Matches any non-word character.

2. Quantifiers:

   - `*` : Matches zero or more occurrences of the previous character.
   - `+` : Matches one or more occurrences of the previous character.
   - `?` : Matches zero or one occurrence of the previous character.
   - `{n}` : Matches exactly n occurrences of the previous character.
   - `{n,}` : Matches n or more occurrences of the previous character.
   - `{n,m}` : Matches between n and m occurrences of the previous character.

3. Character Classes:

   - `[abc]` : Matches any character a, b, or c.
   - `[^abc]` : Matches any character except a, b, or c.
   - `[a-z]` : Matches any lowercase letter.
   - `[A-Z]` : Matches any uppercase letter.
   - `[0-9]` : Matches any digit.
   - `[\s]` : Matches any whitespace character.
   - `[\S]` : Matches any non-whitespace character.

4. Anchors:

   - `^` : Matches the start of a string.
   - `$` : Matches the end of a string.
   - `\b` : Matches a word boundary.
   - `\B` : Matches a non-word boundary.

5. Alternation:

   - `|` : Acts like a logical OR. Matches the expression before or after the pipe.

6. Groups and Capturing:

   - `(...)` : Groups multiple characters together.
   - `(?:...)` : Non-capturing group. Matches the expression but doesn't capture it.

7. Escaping Special Characters:

   - `.` : To match a literal period/dot.
   - `\(` : To match a literal opening parenthesis.
   - `\\` : To match a literal backslash.

8. Flags/Modifiers:
   - `i` : Case-insensitive matching.
   - `g` : Global matching (find all matches, not just the first one).
   - `m` : Multi-line matching.

# Fly.io

## Virtual Machines

https://fly.io/docs/apps/scale-machine/#:~:text=fly%20scale%20commands%20apply%20VM,even%20if%20it%20has%20crashed.
