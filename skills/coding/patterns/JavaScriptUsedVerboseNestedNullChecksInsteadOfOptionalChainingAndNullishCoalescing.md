---
name: javascript-used-verbose-nested-null-checks-instead-of-optional-chaining
description: JavaScript kodida property access uchun nested if yoki && zanjirlari ishlatilgan, optional chaining (?.) va nullish coalescing (??) o'rniga — kod uzun, xato ehtimoli yuqori.
---

# JavaScript verbose nested null checks ishlatildi, optional chaining o'rniga

## Nima uchun bu skill kerak
Optional chaining (`?.`) va nullish coalescing (`??`) ES2020 dan beri standart. Nested if yoki `&&` zanjirlari bilan null/undefined tekshiruvi kodni uzun qiladi, o'qishni qiyinlashtiradi va yangi property qo'shilganda xato ehtimolini oshiradi. Zamonaviy JS/TS loyihalarda bu pattern eskirgan.

## Simptom (aynan shu)
- Kodda `if (obj && obj.prop && obj.prop.nested)` yoki `obj && obj.prop ? obj.prop.value : default` kabi konstruksiyalar.
- Property access uchun bir necha qator if yoki ternary.
- `?.` yoki `??` operatori umuman ishlatilmagan, garchi muhit ES2020+ qo'llab-quvvatlasa.
- Kod o'qish qiyin, yangi daraja qo'shilganda if'lar ko'payadi.

## Sabab (100%)
Muallif eski JavaScript uslubida yozgan yoki optional chaining mavjudligini e'tiborsiz qoldirgan. "Ishlaydi" deb o'ylagan, lekin zamonaviy, qisqa va xavfsizroq alternativani tanlamagan.

## Tasdiqlash
1. Faylda property access uchun nested `&&` yoki if zanjiri bormi?
2. `?.` operatori ishlatilganmi? (yo'q bo'lsa — bu holat)
3. Target muhit (Node 14+, modern browser, TS target ES2020+) optional chainingni qo'llab-quvvatlaydimi?
4. Kod uzunligi va o'qilishi optional chaining bilan qisqarishi mumkinmi?

## Tuzatish (aynan shu)
Nested tekshiruvni optional chaining va nullish coalescing bilan almashtir:

**Oldin (verbose):**
```javascript
let value;
if (user && user.profile && user.profile.settings) {
  value = user.profile.settings.theme;
} else {
  value = 'light';
}
```

**Keyin (to'g'ri):**
```javascript
const value = user?.profile?.settings?.theme ?? 'light';
```

Yana misol:
```javascript
// Oldin
const name = data && data.user && data.user.name ? data.user.name : 'Guest';

// Keyin
const name = data?.user?.name ?? 'Guest';
```

Funksiya chaqiruvi uchun ham:
```javascript
obj?.method?.();
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Property access va default qiymat uchun doim `?.` va `??` ishlat. Nested if/`&&` zanjirlarini yo'qot. Bu kodni qisqartiradi, o'qilishini oshiradi va xato ehtimolini kamaytiradi. ES2020+ muhitda bu standart yondashuv.
