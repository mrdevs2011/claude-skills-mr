---
name: python-c-quoting-syntaxerror-unterminated-string-literal-in-bash-tool-use-heredoc-or-file
description: python -c yoki bash -c ichida string/paren yopilmagan yoki quote muammosi bo'lsa SyntaxError: unterminated string literal yoki '(' was never closed chiqadi. Bash tool da nested quotes. Heredoc, escaped quotes yoki fayl ishlat.
id: python-c-quoting-syntaxerror-unterminated-string-literal-in-bash-tool-use-heredoc-or-file
type: playbook
stack: Python 3.10.21 (bash tool fresh shell)
confirmed_on: 2026-11-18
confidence: high (reproduced in sandbox: wrong -c → SyntaxError; heredoc/escaped/file → works)
triggers:
  - SyntaxError: unterminated string literal
  - python -c unterminated string literal
  - unexpected EOF while parsing python -c
  - '(' was never closed in python -c
  - bash tool python -c quote error
  - how to run python code with quotes in bash tool
  - SyntaxError in python -c from quoting
  - python one-liner quoting problem
  - unterminated string in command line python
  - fix python -c SyntaxError quotes
related:
  - python-input-eoferror-non-interactive-stdin-in-bash-tool-use-argv-or-file
  - sh-syntax-error-open-parenthesis-unexpected-bash-array-or-feature-use-bash-shebang
  - python-subprocess-run-string-command-without-shell-true-raises-filenotfounderror-use-list-or-shlex
---

# python -c quoting SyntaxError — unterminated string yoki never closed; heredoc yoki fayl ishlat

## TL;DR
Simptom: `python3 -c 'print("hello'` yoki shunga o'xshash → SyntaxError: unterminated string literal (detected at line 1) yoki '(' was never closed.
Sabab: Bash tool buyrug'ida single/double quote nesting xato, Python ga to'liq kod yetib bormaydi.
Birinchi buyruq: `python3 << 'PY'\nprint("hello")\nPY` yoki kodni faylga yozib `python3 /tmp/script.py`.
Done: kod xatosiz ishlaydi, kutilgan output chiqadi.

## Qachon ishlatish / ishlatmaslik
Ishlat: bash tool orqali python -c yoki -c "..." ishlatayotganda SyntaxError quoting haqida chiqsa, yoki murakkab string/quote bor kodni bir qatorda yozishga urinayotganda.
Ishlatma: oddiy sintaksis xatosi faylda (editor da), yoki input() EOFError (alohida skill), yoki sh syntax (array ( ) unexpected).

## Mental model (nima uchun)
[SANDBOX] Bash tool buyrug'i shell tomonidan parse qilinadi. Single quotes ichida single quote bo'lishi mumkin emas, double ichida escape kerak. Agar quote yopilmasa yoki paren yopilmasa, Python interpreter to'liq statement ololmaydi va SyntaxError beradi. [SRC:https://docs.python.org/3/reference/lexical_analysis.html#string-literals @3.10, 2026-11] String literal yopilishi shart. Eng xavfsiz: heredoc yoki vaqtinchalik fayl, quoting muammosidan qochadi.

## Diagnosis tree (arzonidan qimmatiga)
1. Xato matnini tekshir: "unterminated string literal" yoki "was never closed" yoki "unexpected EOF".
   EXPECTED: File "<string>", line 1, SyntaxError: ... [SANDBOX]
   Agar boshqa xato (NameError, TypeError) — boshqa skill.

2. Buyruqni ko'r: python3 -c '...' ichida quote yopilganmi, paren/qavs to'liqmi.
   EXPECTED: yopilmagan " yoki ' yoki ( ko'rinadi.

3. Oddiy test: `python3 -c 'print("ok")'`
   EXPECTED: ok. Agar xato — quoting usuli noto'g'ri.

4. Heredoc bilan sinab ko'r:
   ```
   python3 << 'PY'
   print("hello world")
   PY
   ```
   EXPECTED: hello world. [SANDBOX]

5. Agar hali xato — kodni alohida faylga yoz, python3 file.py.

## Fix per cause
- **Quote yopilmagan yoki nesting xato**: Heredoc ishlat yoki escape qil.
  Copy-paste:
  ```
  python3 << 'PY'
  print("hello 'world'")
  print({"key": "value"})
  PY
  ```
  EXPECTED: chiqish to'g'ri. [SANDBOX]

- **Murakkab kod**: Fayl yoz.
  ```
  cat > /tmp/fix.py << 'EOF'
  print("complex \"quote\"")
  data = {"a": 1}
  print(data)
  EOF
  python3 /tmp/fix.py
  rm /tmp/fix.py
  ```
  EXPECTED: output to'g'ri.

- **Double quotes bilan**: `python3 -c "print(\"hello\")"` ishlaydi, lekin heredoc ishonchliroq.

## Where agents go wrong (>=3)
1. Nested single quotes ichida single quote qo'yishga urinadi — shell single quote ichida ' ni qabul qilmaydi.
2. Faqat escape qo'shib qayta urinadi, lekin murakkab kodda muvaffaqiyatsiz.
3. Xatoni Python sintaksis xatosi deb o'ylab, kodni o'zgartiradi, aslida shell quoting.
4. To'liq kodni bitta qatorga siqib, o'qilishi qiyin va xato oson.

## Edge cases (>=2)
1. Kod ichida o'zida quote va paren ko'p bo'lsa — heredoc yoki fayl majburiy. [SANDBOX]
2. Multi-line kod -c da: \n yoki ; ishlatish mumkin, lekin heredoc yaxshiroq.
3. Fish shell (agar bo'lsa): boshqa quoting qoidalari. [not verified]

## Done criteria (proving commands)
```
python3 << 'PY'
print("hello")
assert 1 + 1 == 2
print("ok")
PY
```
EXPECTED: hello\nok , exit 0.
Yoki fayl bilan bir xil.

## If still failing
- Xato matnini to'liq ko'chir (line, ^ belgisi).
- Kodni oddiy print("test") ga qisqartirib sinab ko'r.
- `bash -x` bilan buyruqni debug qil (lekin token ehtiyot).
- Docs: Python string literals, bash quoting.

## Sources + confidence
- [SANDBOX] 2026-11-18: `python3 -c 'print("hello'` → SyntaxError: unterminated string literal (detected at line 1). Heredoc va escaped ishladi.
- [SRC:https://docs.python.org/3/reference/lexical_analysis.html#string-literals @ Python 3.10 docs, 2026-11] String literals must be closed.
- [SRC:https://www.gnu.org/software/bash/manual/html_node/Quoting.html] Single quotes preserve literal, no escape inside.
- Confidence: high. [not verified] for non-bash shells.
