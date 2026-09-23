---
name: did-not-read-existing-code
description: AI mavjud kodni to'liq o'qimasdan o'zgartirish qiladi — natijada boshqa joydagi mantiq buziladi, takrorlanish chiqadi yoki mavjud yechim e'tiborsiz qoldiriladi.
---

# Mavjud kodni o'qimasdan o'zgartirish

## Nima uchun bu skill kerak
AI xato yoki so'rovni ko'rib, darhol yozishga kirishadi. Atrofdagi funksiyalar, mavjud yordamchi util'lar, o'xshash yechimlar yoki bog'liq joylarni o'qimasdan. Natijada: allaqachon bor funksiyani qayta yozadi, boshqa joydagi shartni buzadi, yoki noto'g'ri joyga tuzatish kiritadi. Bu e'tibor chalg'ishining eng asosiy shakli.

## Simptom (aynan shu)
- AI yangi funksiya yozdi, lekin loyihada xuddi shu ishni qiladigan funksiya allaqachon bor.
- O'zgarish boshqa joydagi mantiqni buzdi (chunki o'sha joy o'qilmagan).
- Tuzatish noto'g'ri faylga yoki noto'g'ri qatorda qilingan.
- Foydalanuvchi "bu allaqachon bor edi" yoki "boshqa joy buzildi" deb aytadi.

## Sabab (100%)
AI so'rov/xato matniga qarab darhol yechim yozishga o'tadi. Mavjud kodni qidirish, o'qish, bog'liqliklarni tushunish bosqichini o'tkazib yuboradi. "Tezroq javob beray" deb o'ylaydi.

## Tasdiqlash
1. O'zgarishdan oldin AI mavjud o'xshash kodni qidirdi mi? (`grep`, fayl ochish)
2. O'zgartirilayotgan funksiya/faylning chaqiruvchilari va bog'liqliklari ko'rib chiqilganmi?
3. Agar yo'q — bu shu.

## Tuzatish (aynan shu)
Yozishdan **oldin** o'qing:

```
// XATO yondashuv:
// 1. Xato/so'rovni ko'rdi
// 2. Darhol yangi kod yozdi

// TO'G'RI yondashuv:
// 1. Xato/so'rovni o'qi
// 2. Mavjud o'xshash kodni qidir (funksiya nomi, pattern, fayl)
// 3. Bog'liq joylarni ochib ko'r
// 4. Keyin eng kichik o'zgarishni qil
```

Qoida: "Avval o'qi, keyin yoz." Mavjud yechim bo'lsa — uni ishlat yoki kengaytir, qayta yozma.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Yozishdan oldin mavjud kodni o'qish majburiy.
- AI tez javob berish uchun o'qishni tashlab ketishi eng ko'p chalg'ish.
- Qidir → o'qi → bog'liqlikni tushun → keyin o'zgartir.