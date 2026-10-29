---
name: python-open-mode-w-truncates-file
description: open(..., "w") yoki "wb" ishlatilganda mavjud fayl butunlay tozalanadi (truncate). Agar append yoki mavjud kontentni saqlash kerak bo'lsa — "a", "r+", yoki "x" ishlatilishi kerak.
---

# open("w") mavjud faylni tozalab yuboradi

## Nima uchun bu skill kerak
Python'da `open(path, "w")` har doim faylni 0 baytga qisqartiradi (truncate), hatto fayl oldindan mavjud bo'lsa ham. AI yoki dasturchi "yozish" deb o'ylab "w" qo'yadi, lekin aslida qo'shish (append) yoki mavjud kontentni o'qib yangilash kerak bo'ladi. Natijada: log fayli tozalanadi, config yo'qoladi, data overwrite bo'ladi — hech qanday exception chiqmaydi.

## Simptom (aynan shu)
- Fayl oldin bor edi, kod ishlagandan keyin bo'sh yoki faqat yangi yozilgan qism qoldi.
- Hech qanday xato yo'q — faqat kontent yo'qolgan.
- Kodda `open(..., "w")` yoki `open(..., mode="w")` bor.
- Ko'pincha log, cache, config, yoki ma'lumot fayli bilan.

## Sabab (100%)
`"w"` (write) rejimi faylni ochishdan oldin uni tozalaydi (truncate). Bu hujjatda aniq: "w" = write (truncate if exists). "a" = append, "r+" = read+write (truncate qilmaydi), "x" = exclusive create (mavjud bo'lsa xato).

## Tasdiqlash
1. Kodda `open(fayl, "w")` yoki ekvivalent top.
2. Fayl oldindan mavjudligini tekshir (`os.path.exists` yoki log).
3. Operatsiyadan keyin fayl hajmi 0 yoki faqat yangi yozilgan qatorlar ekanini ko'r.
4. Agar append kerak bo'lgan joyda "w" ishlatilgan bo'lsa — bu skill.

## Tuzatish (aynan shu)
Maqsadga qarab rejimni almashtir:

```python
# XATO — mavjud kontentni tozalaydi:
with open("app.log", "w") as f:
    f.write("yangi xabar\n")

# TO'G'RI — qo'shish (append):
with open("app.log", "a") as f:
    f.write("yangi xabar\n")

# TO'G'RI — o'qib yangilash (truncate qilmasdan):
with open("config.json", "r+") as f:
    data = json.load(f)
    data["key"] = "value"
    f.seek(0)
    json.dump(data, f)
    f.truncate()  # faqat kerakli uzunlikka qisqartir

# TO'G'RI — faqat yangi yaratish (mavjud bo'lsa xato):
with open("newfile.txt", "x") as f:
    f.write("faqat birinchi marta")
```

Qoida: "yozish" degani har doim "w" emas. Append = "a", update = "r+", create-only = "x".

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- `open(..., "w")` har doim faylni tozalaydi — exception yo'q, lekin data yo'qoladi.
- Append kerak bo'lsa `"a"`, mavjudni o'qib yangilash kerak bo'lsa `"r+"` + seek/truncate.
- Yangi fayl yaratish va mavjud bo'lsa xato berish uchun `"x"` ishlat.
