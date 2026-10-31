---
name: python-os-system-or-subprocess-shell-true-with-user-input
description: Python'da os.system yoki subprocess.run(..., shell=True) bilan foydalanuvchi inputini to'g'ridan-to'g'ri ishlatish sababli command injection xavfi. Qidiruv: os.system user input, subprocess shell=True unsanitized, command injection python.
---

# Python: os.system yoki subprocess shell=True bilan unsanitized input

## Nima uchun bu skill kerak
AI yoki dasturchi shell buyruqlarini tez yozish uchun `os.system(f"cmd {user_input}")` yoki `subprocess.run(cmd, shell=True)` ishlatadi. Foydalanuvchi inputi escape qilinmagan bo'lsa, hujumchi `; rm -rf /` kabi buyruqlar qo'shib kodni bajarishi mumkin. Bu xavfsizlik muammosi — faqat "ishlaydi" deb qoldirish mumkin emas.

## Simptom (aynan shu)
- Kodda `os.system(...)` yoki `subprocess.run(..., shell=True)` / `subprocess.Popen(..., shell=True)` ko'rinadi.
- Argument ichida f-string, `.format()`, yoki string concatenation bilan tashqi input (request, argv, env, file content) bor.
- Hech qanday `shlex.quote`, parametrlangan chaqiruv yoki allowlist yo'q.
- Xavf: input `"; malicious_command"` yoki `$(whoami)` bo'lsa buyruq ishlaydi.

## Sabab (100%)
`shell=True` yoki `os.system` shell interpretatorini ishga tushiradi. String to'liq buyruq sifatida parse qilinadi. Unsanitized input shell metacharacters (`;`, `|`, `&`, `` ` ``, `$()`, `\n`) orqali qo'shimcha buyruqlar bajarishga imkon beradi. Parametrlangan chaqiruv (`shell=False` + list) buni oldini oladi, chunki input faqat argument sifatida o'tadi.

## Tasdiqlash
1. `os.system`, `subprocess.run`, `subprocess.Popen`, `subprocess.call` qidir.
2. `shell=True` yoki `os.system` bormi?
3. Birinchi argument f-string/format/concat bilan tashqi o'zgaruvchidan keladimi?
4. `shlex.quote` yoki allowlist tekshiruvi yo'qmi?
5. Agar ha — bu aynan command injection nuqtasi.

## Tuzatish (aynan shu)
`shell=False` va argumentlar ro'yxati ishlat. Kerak bo'lsa `shlex.quote` yoki qat'iy allowlist:

```python
import subprocess
import shlex

# XATO (injection xavfi):
user_file = request.args.get("file")  # "report.txt; rm -rf /tmp"
os.system(f"cat {user_file}")
# yoki
subprocess.run(f"ls {user_file}", shell=True)

# TO'G'RI (shell=False + list):
subprocess.run(["cat", user_file], check=True)  # user_file faqat argument

# Agar shell kerak bo'lsa (kamdan-kam):
safe_file = shlex.quote(user_file)
subprocess.run(f"cat {safe_file}", shell=True)

# Eng yaxshisi: allowlist
ALLOWED = {"report.txt", "summary.txt"}
if user_file not in ALLOWED:
    raise ValueError("Invalid file")
subprocess.run(["cat", user_file], check=True)
```

Hech qachon foydalanuvchi inputini to'g'ridan-to'g'ri shell stringiga qo'yma.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- `os.system` va `shell=True` shell parse qiladi — unsanitized input = command injection.
- Har doim `shell=False` + argument list ishlat.
- Zarur bo'lsa `shlex.quote` yoki allowlist bilan chekla.
- Bu debugging emas — yozish paytida oldini olish kerak bo'lgan xavfsizlik qoidasi.
