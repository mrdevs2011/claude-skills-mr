---
name: used-edit-file-without-reading-first
description: edit_file yoki search-replace ishlatishdan oldin fayl mazmunini read_file bilan o'qimaslik — replace muvaffaqiyatsiz yoki noto'g'ri kontekstda amalga oshadi.
---

# edit_file ishlatishdan oldin faylni o'qimaslik

## Nima uchun bu skill kerak
Agentlar ko'pincha faylni o'zgartirish uchun darhol edit_file yoki replace chaqiradilar, lekin avval uning hozirgi mazmunini o'qimaydilar. Natijada old_string topilmaydi, replace xato beradi, yoki noto'g'ri qism o'zgartiriladi.

## Simptom (aynan shu)
- edit_file / replace tool chaqirilganda "old_string not found" yoki shunga o'xshash xato qaytadi.
- Agent faylni o'zgartirishni rejalashtirgan, lekin read_file (yoki ekvivalent) chaqirilmagan.
- O'zgartirish noto'g'ri joyda amalga oshadi yoki umuman ishlamaydi.
- Keyingi qadamlar eski/noto'g'ri mazmunga tayanadi.

## Sabab (100%)
Agent "men bilaman faylda nima bor" deb taxmin qiladi yoki oldingi o'qishdan eslab qolganini hisoblaydi. Tool talab qiladigan aniq old_string ni olish uchun hozirgi holatni o'qishni unutadi yoki shart emas deb hisoblaydi.

## Tasdiqlash
- edit_file yoki replace chaqiruvidan oldin shu faylga read_file (yoki cat/view) bo'lganmi?
- Tool javobida "not found", "no match", yoki o'xshash xato bormi?
- old_string faylning haqiqiy hozirgi qismi bilan mos kelmayaptimi?

## Tuzatish (aynan shu)
Har doim o'zgartirishdan oldin faylni o'qi:

1. Avval `read_file` (yoki ekvivalent) bilan fayl mazmunini ol.
2. Aniq o'zgartiriladigan qismni (old_string) hozirgi matndan nusxa olib ol.
3. Faqat shundan keyin `edit_file` / replace ni chaqir.
4. Agar old_string topilmasa — qayta o'qi va to'g'ri matnni ishlat, taxmin qilma.

Misol:
```text
# Noto'g'ri:
edit_file(file_path="config.js", old_string="port: 3000", new_string="port: 8080")
# (fayl o'qilmagan, matn mos kelmasligi mumkin)

# To'g'ri:
content = read_file("config.js")
# content dan aniq qatorni olib
edit_file(file_path="config.js", old_string="  port: 3000,", new_string="  port: 8080,")
```

Agar fayl katta bo'lsa ham, o'zgartiriladigan qism atrofidagi konteksti o'qi.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- edit_file yoki replace ishlatishdan oldin doim faylni o'qi — taxmin qilma.
- old_string faqat haqiqiy hozirgi matndan olinishi kerak.
- Bu oddiy qoida replace xatolarining 90% ini oldini oladi.
