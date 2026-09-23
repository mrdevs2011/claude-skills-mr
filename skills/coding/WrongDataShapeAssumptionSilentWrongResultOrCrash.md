---
name: wrong-data-shape-assumption
description: Kod ishlayotgandek ko'rinadi yoki kutilmagan joyda yiqiladi — sabab AI ma'lumot shaklini (array vs object, nested field, null) noto'g'ri taxmin qilgan, tekshirmagan.
---

# Noto'g'ri data shape taxmini

## Nima uchun bu skill kerak
AI eng ko'p qiladigan xatolardan biri — API javobi, funksiya qaytmasi yoki props shaklini "men bilaman" deb taxmin qilish. Natijada: bo'sh massiv o'rniga `undefined`, `{ data: [] }` o'rniga to'g'ridan-to'g'ri massiv, yoki optional fieldni majburiy deb hisoblash. Bu null skill'dan kengroq — ba'zan xato umuman chiqmaydi, faqat noto'g'ri natija beradi.

## Simptom (aynan shu)
- Kod "ishlayapti", lekin natija bo'sh, noto'g'ri yoki kutilmagan.
- Yoki faqat ba'zi hollarda `Cannot read properties...` / `map is not a function` chiqadi.
- `console.log` qilsang — kutilgan shakl emas (masalan array o'rniga object, yoki nested field yo'q).

## Sabab (100%)
Kod yozilgan paytda ma'lumotning **haqiqiy shakli** tekshirilmagan. Tipik taxminlar:
- API har doim array qaytaradi (aslida `{ items: [], total: 0 }`).
- Field har doim bor (aslida optional yoki ba'zi holatlarda yo'q).
- Funksiya har doim object qaytaradi (ba'zida `null` yoki primitiv).
- Nested path har doim mavjud (`user.profile.avatar`).

## Tasdiqlash
1. Muammo chiqqan joydagi qiymatni `console.log(JSON.stringify(value, null, 2))` bilan chiqar.
2. Kutilgan shakl bilan solishtir: arraymi? objectmi? qaysi kalitlar bor?
3. Manbani top (API javobi, oldingi funksiya, props, state) va u yerda ham log qo'y.
4. Agar TypeScript bo'lsa — tip e'lonini va haqiqiy runtime qiymatini solishtir (tip yolg'on bo'lishi mumkin).

## Tuzatish (aynan shu)
Haqiqiy shaklga moslashtir, taxminni olib tashla:

```js
// XATO (taxmin: response = []):
const names = response.map(u => u.name);

// TO'G'RI (haqiqiy shakl: { data: [] } yoki to'g'ridan-to'g'ri array):
const list = Array.isArray(response) ? response : (response?.data ?? []);
const names = list.map(u => u.name);

// XATO (taxmin: user.profile har doim bor):
const avatar = user.profile.avatar;

// TO'G'RI:
const avatar = user?.profile?.avatar ?? null;
```

Agar shakl o'zgaruvchan bo'lsa — guard yoz (Array.isArray, optional chaining, nullish coalescing). Agar shakl barqaror bo'lishi SHART bo'lsa — manba (API/funksiya) ni tuzat, `?.` bilan yashirma.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- AI ko'pincha ma'lumot shaklini taxmin qiladi va tekshirmaydi — natija either crash yoki jim noto'g'ri ishlash.
- Avval haqiqiy qiymatni log qilib ko'r, keyin kodni shunga moslashtir.
- `map is not a function` degani odatda "men array deb o'ylagan edim, lekin object/null keldi" degani.