---
name: python-used-subprocess-with-shell-true-and-user-or-external-input-leading-to-command-injection
description: Python'da subprocess.run/Popen yoki os.system bilan shell=True va foydalanuvchi/tashqi input ishlatilganda command injection xavfi. shell=False va argument listi ishlatish kerak.
---

# Python subprocess shell=True + user/external input command injection qiladi

## Nima uchun bu skill kerak
Agentlar tez-tez terminal buyruqlarini ishga tushirishda `subprocess.run(..., shell=True)` yoki `os.system()` ishlatadi, va buyruq matnini foydalanuvchi inputi, fayl nomi yoki boshqa tashqi ma'lumot bilan quradi. Bu shell metacharacter'lari orqali arbitrary buyruq ishga tushirishga imkon beradi (command injection). Xavfsizlik zaifligi, data o'chirish, RCE gacha borishi mumkin.

## Simptom (aynan shu)
- Kodda `subprocess.run(f"cmd {user_input}", shell=True)`, `subprocess.Popen(cmd_string, shell=True)`, `os.system(dynamic_string)` yoki `os.popen()` bor.
- Dynamic qism (user input, query param, filename, env) buyruq satriga to'g'ridan-to'g'ri qo'shilgan.
- Xavfsizlik skaneri, code review yoki runtime'da "command injection" warning.
- Kutilmagan buyruqlar ishga tushishi (masalan `; rm -rf /` yoki `| cat /etc/passwd`).

## Sabab (100%)
`shell=True` bo'lganda Python shell (sh/bash) orqali ishga tushiradi, va string ichidagi metacharacter'lar (`;`, `|`, `&`, `$()`, backtick, qo'shtirnoqlar) shell tomonidan interpretatsiya qilinadi. Foydalanuvchi inputi sanitizatsiya qilinmagan bo'lsa, u buyruqni o'zgartirishi yoki qo'shimcha buyruq qo'shishi mumkin. `shell=False` (default) da argumentlar list sifatida beriladi va shell interpretatsiya qilmaydi.

## Tasdiqlash
1. Kodda `shell=True`, `os.system(`, `os.popen(` qidir.
2. Buyruq stringi f-string, `.format()`, `%` yoki concatenation bilan dynamic qiymat qo'shilganmi?
3. Dynamic qiymat foydalanuvchi, network, fayl yoki boshqa ishonchsiz manbadan keladimi?
4. `shlex.quote` ishlatilganmi? (lekin eng yaxshisi shell=False).

## Tuzatish (aynan shu)
Doim `shell=False` va argumentlarni list/tuple sifatida ber:

```python
# Noto'g'ri (injection xavfi):
import subprocess
user_file = request.args.get("file")  # yoki input()
subprocess.run(f"ls -l {user_file}", shell=True)

# To'g'ri:
import subprocess
user_file = request.args.get("file")
subprocess.run(["ls", "-l", user_file], shell=False)  # shell=False default
# yoki
result = subprocess.run(["ls", "-l", user_file], capture_output=True, text=True, check=True)
```

Agar murakkab shell funksiyasi (pipe, redirect) kerak bo'lsa, alohida subprocess'lar bilan bog'la yoki `subprocess` + `shell=False` + explicit args. `shlex.split` faqat ishonchli string uchun. Hech qachon user inputini shell stringiga to'g'ridan-to'g'ri qo'yma.

`os.system` va `os.popen` o'rniga ham `subprocess` ishlat.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- `subprocess` da `shell=True` + dynamic input = command injection.
- Har doim argumentlarni list sifatida ber, `shell=False`.
- Bu RCE xavfini yo'qotadi va kodni xavfsizroq qiladi.
- Murakkab holatlarda alohida process'lar yoki ishonchli quoting, lekin list afzal.
