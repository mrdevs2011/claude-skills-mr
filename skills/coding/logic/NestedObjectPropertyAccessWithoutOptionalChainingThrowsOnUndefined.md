---
name: nested-object-property-access-without-optional-chaining-throws
description: Potansiyal undefined oraliq obyektga nuqta orqali kirish (obj.a.b) TypeError beradi — optional chaining (?.) ishlatilmaganda.
---

# Oraliq undefined bo'lganda nuqta orqali nested property o'qish TypeError beradi

## Nima uchun bu skill kerak
API javoblari, konfiguratsiya yoki foydalanuvchi ma'lumotlarida oraliq maydonlar ko'pincha undefined bo'lishi mumkin. Oddiy nuqta notatsiyasi (obj.nested.prop) oraliq undefined bo'lsa darhol TypeError tashlaydi va dastur to'xtaydi. Bu holat juda keng tarqalgan va oddiy optional chaining bilan oldini olish mumkin.

## Simptom (aynan shu)
- Runtime'da `TypeError: Cannot read properties of undefined (reading 'xyz')` xatosi.
- Xato stack trace nested property o'qish qatorida (masalan `user.profile.name` yoki `response.data.items[0].title`).
- Kod lokalda ishlaydi (ma'lumot to'liq bo'lganda), lekin real API javobida yoki edge case'da yiqiladi.
- `?.` (optional chaining) hech qayerda ishlatilmagan.

## Sabab (100%)
Oraliq obyekt (masalan `user.profile`) undefined yoki null bo'lishi mumkinligini hisobga olmasdan oddiy nuqta orqali kirish ishlatilgan. JavaScript (va ko'p tillar) undefined'ga property o'qishga ruxsat bermaydi.

## Tasdiqlash
- Xato matni "Cannot read properties of undefined" yoki "Cannot read property 'x' of undefined"mi?
- Stack trace aynan nested access qatorida mi?
- Shu qatorda `?.` ishlatilmaganmi?
- Ma'lumot manbai (API, localStorage, form) ba'zan to'liq bo'lmasligi mumkinmi?

## Tuzatish (aynan shu)
Oddiy nuqta o'rniga optional chaining ishlat:

```js
// Noto'g'ri — oraliq undefined bo'lsa yiqiladi
const name = user.profile.name;
const title = response.data.items[0].title;

// To'g'ri
const name = user.profile?.name;
const title = response.data?.items?.[0]?.title;

// Default qiymat bilan
const name = user.profile?.name ?? 'Guest';
const title = response.data?.items?.[0]?.title ?? 'No title';
```

Agar bir nechta joyda bir xil access bo'lsa, kichik helper yoki early return bilan himoya qil:

```js
if (!user?.profile) return;
const name = user.profile.name; // endi xavfsiz
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Nested property o'qishda oraliq undefined bo'lishi mumkin bo'lsa har doim `?.` ishlat.
- Bu bitta belgi ko'p runtime TypeError'larning oldini oladi.
- Default qiymat kerak bo'lsa `??` bilan birlashtir.
- Har qanday tashqi ma'lumot (API, user input) uchun bu qoidani qo'lla.
