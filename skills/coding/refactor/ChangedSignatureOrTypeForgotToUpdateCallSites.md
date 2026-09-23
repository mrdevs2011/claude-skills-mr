---
name: changed-signature-forgot-call-sites
description: Funksiya yoki tip o'zgartirilgan, lekin uni chaqiradigan joylar yangilanmagan — runtime'da argument soni/tipi mos kelmaydi yoki TypeScript xato beradi.
---

# Signature o'zgardi, chaqiruv joylari qoldi

## Nima uchun bu skill kerak
AI bir funksiyani "yaxshilash" yoki parametr qo'shish/o'chirish paytida faqat o'sha funksiya tanasini o'zgartiradi. Uni chaqiradigan barcha joylarni (call sites) yangilashni unutadi yoki to'liq qidirib chiqmaydi. Bu e'tiborsizlikning eng klassik ko'rinishi — o'zi yozgan o'zgarishni oxiriga yetkazmaydi.

## Simptom (aynan shu)
- TypeScript: `Expected N arguments, but got M` yoki tip mos kelmasligi.
- Runtime: `undefined` argument, noto'g'ri tartibda qiymat, yoki "missing required property".
- Ba'zi chaqiruvlar ishlaydi (yangilanganlari), ba'zilari yiqiladi (unutilganlari).
- Yoki hammasi "ishlayotgandek", lekin yangi parametr hech qachon uzatilmaydi.

## Sabab (100%)
Funksiya e'loni (yoki tip/interface) o'zgartirilgan, lekin loyihadagi barcha chaqiruv joylari qidirilib yangilanmagan. AI odatda:
- Faqat o'zi ko'rib turgan faylni o'zgartiradi.
- `grep` / project-wide search qilmaydi.
- Default qiymat qo'shib "hamma joyda ishlayveradi" deb o'ylaydi, lekin chaqiruvchilar eski tartibda qoladi.

## Tasdiqlash
1. O'zgargan funksiya/tip nomini oling.
2. Butun loyihada qidiring: `grep -rn "functionName(" .` yoki IDE'da "Find all references".
3. Har bir chaqiruvda argumentlar soni, tartibi va turlari yangi signature bilan mos kelishini tekshiring.
4. Agar birorta eski uslubda qolgan bo'lsa — shu.

## Tuzatish (aynan shu)
1. Signature'ni o'zgartirishdan **oldin** yoki darhol keyin barcha call site'larni toping.
2. Har birini yangi signature'ga moslang.
3. Agar parametr majburiy qilib qo'yilgan bo'lsa — default bilan yashirmang, chaqiruvchilarni majburiy yangilang.

```js
// XATO: faqat e'lon o'zgardi
function getUser(id, options) { ... }  // avval faqat id edi

// chaqiruvlar eskicha qolgan:
getUser(123);  // options undefined

// TO'G'RI: barcha joylar yangilandi
getUser(123, { withPosts: true });
// yoki default bilan (agar haqiqatan optional bo'lsa):
function getUser(id, options = {}) { ... }
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Signature/tip o'zgarsa — majburiy ravishda barcha call site'larni qidirib yangilang.
- "Faqat shu faylni o'zgartirdim" deb qolmang — AI eng ko'p shu yerda chalg'iydi.
- IDE "Find all references" yoki `grep` ni ishlatish majburiy qadam.