---
name: python-os-system-instead-of-subprocess
description: Python kodda os.system() bilan tashqi buyruq chaqirilgan — shell injection xavfi, chiqish kodini tekshirish qiyin, stdout/stderr nazorati yo'q, va xavfsizlik muammolari.
---

# os.system() o'rniga subprocess ishlatish

## Nima uchun bu skill kerak
os.system() shell orqali buyruq ishga tushiradi, foydalanuvchi inputi bilan injection xavfi tug'diradi, return kodini to'g'ri ishlash qiyin, va chiqishlarni capture qilish murakkab. subprocess moduli aniqroq, xavfsizroq va nazorat qilinadigan.

## Simptom (aynan shu)
- Kodda `os.system("ls " + user_input)` yoki `os.system(command)` kabi chaqiruvlar.
- Buyruq muvaffaqiyatsiz bo'lsa ham dastur davom etadi (return kod tekshirilmaydi).
- stdout/stderr alohida olinmaydi yoki log qilinmaydi.
- Foydalanuvchi yoki tashqi ma'lumot to'g'ridan-to'g'ri shellga uzatiladi.

## Sabab (100%)
Dasturchi oddiy va qisqa usulni tanlaydi, lekin os.system shell=True ekvivalentini ishlatadi va xavfsizlik/error handling ni e'tiborsiz qoldiradi. subprocess.run yoki Popen to'g'ri alternativa.

## Tasdiqlash
1. os.system() yoki os.popen() ishlatilganmi?
2. Buyruq qatorida foydalanuvchi inputi yoki o'zgaruvchi bor-mi (shell injection)?
3. Return kod (0/1) tekshirilmaydimi yoki chiqishlar capture qilinmaydimi?
4. Agar ha — subprocess ga o'tish kerak.

## Tuzatish (aynan shu)
os.system ni subprocess.run bilan almashtir. shell=False (default) ishlat, argumentlarni list sifatida ber, check=True va capture_output ishlat.

Noto'g'ri:
```python
import os
os.system("ls " + user_dir)
os.system("echo hello > file.txt")
```

To'g'ri:
```python
import subprocess

# Oddiy buyruq
result = subprocess.run(["ls", user_dir], check=True, capture_output=True, text=True)
print(result.stdout)

# Yoki chiqishni faylga
with open("file.txt", "w") as f:
    subprocess.run(["echo", "hello"], stdout=f, check=True)
```

Agar shell kerak bo'lsa (kam hollarda), shu tarzda:
```python
subprocess.run("ls | grep txt", shell=True, check=True)  # faqat ishonchli input bilan
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
os.system() dan qoch — u shell injection, yomon error handling va nazoratsiz chiqishlarga olib keladi. Har doim subprocess.run (yoki Popen) ishlat: argument list, check=True, capture_output=True. Bu xavfsizroq va ishonchliroq.
