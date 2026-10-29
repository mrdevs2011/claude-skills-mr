---
name: python-os-path-join-absolute-discards-previous
description: os.path.join() ga keyingi argument sifatida absolute path berilganda oldingi qismlar tashlab yuboriladi — kutilgan yo'l o'rniga faqat absolute path qoladi.
---

# os.path.join() absolute path argumenti oldingi segmentlarni tashlaydi

## Nima uchun bu skill kerak
Python'da `os.path.join()` portable yo'llar qurish uchun ishlatiladi, lekin agar keyingi argument absolute path (masalan `/usr` yoki `C:\\Windows`) bo'lsa, funksiya oldingi barcha qismlarni e'tiborsiz qoldirib, faqat o'sha absolute pathni qaytaradi. Bu ko'pincha config yoki user inputdan kelgan yo'lni base pathga qo'shishda yuz beradi va kutilmagan fayl joylashuvi yoki xavfsizlik muammosiga olib keladi.

## Simptom (aynan shu)
- `os.path.join(base, subpath)` chaqirilganda `subpath` absolute bo'lsa, natija `base`ni o'z ichiga olmaydi.
- Misol: `os.path.join("/home/user/project", "/etc/passwd")` → `"/etc/passwd"` (kutilgan `/home/user/project/etc/passwd` emas).
- Log yoki debugda yo'l to'g'ri ko'rinadi, lekin aslida boshqa joyga yoziladi yoki o'qiladi.
- Windowsda `os.path.join("C:\\app", "D:\\data")` → `"D:\\data"`.

## Sabab (100%)
`os.path.join()` hujjatiga ko'ra: agar biror argument absolute path bo'lsa, oldingi barcha argumentlar tashlab yuboriladi va shu absolute pathdan boshlanadi. Bu POSIX va Windowsda bir xil xulq. Agent yoki dasturchi buni bilmasdan "har doim qo'shadi" deb o'ylaydi.

## Tasdiqlash
1. `os.path.join(a, b)` natijasini `print` yoki assert bilan tekshir.
2. `b` `os.path.isabs(b)` True qaytaradimi?
3. Natija `a` bilan boshlanmaydimi?
4. `pathlib.Path(a) / b` bilan solishtir (Path boshqacha xulq qilishi mumkin, lekin absolute bo'lsa ham ehtiyot bo'lish kerak).

## Tuzatish (aynan shu)
Absolute pathni oldindan tekshir yoki relative qilib ol:

```python
import os

def safe_join(base: str, *paths: str) -> str:
    result = base
    for p in paths:
        # Absolute bo'lsa, faqat oxirgi qismini ol yoki rad et
        if os.path.isabs(p):
            p = os.path.relpath(p, "/")  # yoki maxsus mantiq
        result = os.path.join(result, p)
    return os.path.normpath(result)

# Yoki oddiy:
sub = user_input
if os.path.isabs(sub):
    raise ValueError("Absolute path not allowed")
final = os.path.join(base_dir, sub)
```

Afzal: `pathlib.Path` ishlat va `Path(base) / Path(sub).relative_to("/")` yoki aniq relative ekanligini tekshir.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- `os.path.join` keyingi absolute argumentda oldingi segmentlarni tashlaydi.
- User/config dan kelgan yo'lni qo'shishdan oldin `os.path.isabs` bilan tekshir.
- Xavfsiz qo'shish uchun absolute ni rad et yoki relative ga aylantir.
