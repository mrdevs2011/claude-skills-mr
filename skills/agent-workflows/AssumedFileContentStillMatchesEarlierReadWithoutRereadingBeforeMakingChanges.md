---
name: assumed-stale-file-content
description: Agent avval o'qigan fayl mazmuni hali ham o'sha deb taxmin qilib, qayta o'qimasdan o'zgartirish kiritadi va eski holatga asoslangan noto'g'ri edit qiladi.
---

# Avval o'qilgan fayl mazmuni hali o'sha deb taxmin qilib, qayta o'qimasdan o'zgartirish

## Nima uchun bu skill kerak
Uzoq agent sessiyalarida yoki bir nechta qadamdan keyin agent faylni bir marta o'qiydi, keyin boshqa ishlar qiladi, so'ng o'sha eski o'qishga asoslanib edit_file yoki o'zgartirish qiladi. Orada foydalanuvchi yoki boshqa tool faylni o'zgartirgan bo'lishi mumkin, yoki agent o'zi avvalgi qadamda o'zgartirgan bo'lishi mumkin. Natijada conflict, yo'qolgan o'zgarishlar yoki noto'g'ri patch.

## Simptom (aynan shu)
- edit_file yoki write_file chaqiruvi "old_string not found" yoki kutilmagan natija beradi.
- Agent "men avval o'qiganimda shunday edi" deb aytadi, lekin hozirgi fayl boshqacha.
- O'zgartirish kiritilgandan keyin foydalanuvchi "bu qismni allaqachon o'zgartirgan edim" yoki "eski versiyaga qaytardi" deb e'tiroz bildiradi.
- Agent old_string sifatida o'zining eslab qolgan (eski) matnini beradi.

## Sabab (100%)
Agent fayl mazmunini bir marta o'qib, uni "haqiqat" deb xotirada saqladi va keyingi qadamlarda qayta o'qishni shart deb bilmadi. Vaqt o'tishi, boshqa tool chaqiruvlari yoki foydalanuvchi harakati faylni o'zgartirganini hisobga olmadi.

## Tasdiqlash
1. Agent avval faylni o'qigan vaqtini va o'sha vaqtdagi mazmunni eslab qoling.
2. Hozirgi fayl mazmunini (yoki oxirgi o'qishni) solishtiring — farq bormi?
3. Agent keyingi editda eski matnga asoslangan old_string yoki to'liq yozuv ishlatganmi?
4. Agar ha — bu shu holat.

## Tuzatish (aynan shu)
Har qanday o'zgartirish (edit_file, write_file, yoki mazmunni taxmin qiladigan harakat) oldidan faylni yangidan o'qing:

```
# XATO:
# 1. read_file path  (t=0)
# 2. boshqa tool'lar, vaqt o'tdi
# 3. edit_file old_string=eski_matn  # eski xotira asosida

# TO'G'RI:
# 1. read_file path  (t=0)
# 2. boshqa ishlar
# 3. read_file path  (t=n)  # qayta o'qi, hozirgi holatni ol
# 4. endi haqiqiy hozirgi matn asosida edit_file
```

Qoida: "O'zgartirishdan oldin har doim qayta o'qi." Xotira emas, diskdagi hozirgi holat asos.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Fayl mazmuni vaqt o'tishi bilan o'zgarishi mumkin — xotira eskiradi.
- Edit qilishdan oldin har doim yangi o'qish qil.
- "Avval ko'rganman" yetarli emas; hozirgi holatni tasdiqla.
