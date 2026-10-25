---
name: javascript-loose-equality-double-equals
description: JavaScript'da == (loose equality) ishlatilganda type coercion tufayli kutilmagan true/false natijalar chiqadi — === (strict) o'rniga.
---

# JavaScript'da == o'rniga === ishlatmaslik

## Nima uchun bu skill kerak
JavaScript'da == operator type coercion qiladi: turli tiplarni solishtirishdan oldin o'zgartiradi. Bu ko'pincha yashirin bug'larga olib keladi (masalan "0" == 0 true, null == undefined true). === hech qanday o'zgartirishsiz solishtiradi va aniqroq. Agentlar ba'zan == yozib, keyin nima uchun shart noto'g'ri ishlayotganini tushunmaydi.

## Simptom (aynan shu)
- Kodda == yoki != ishlatilgan (=== yoki !== emas).
- Shart kutilmaganda true yoki false qaytaryapti.
- Masalan: if (value == 0) ba'zan string "0", false, null, "" bilan ham true bo'ladi.
- Console'da "0" == 0 → true, lekin "0" === 0 → false.
- Bug faqat ma'lum ma'lumot tiplarida paydo bo'ladi.

## Sabab (100%)
== JavaScript'ning Abstract Equality Comparison Algorithm'ini ishlatadi, u type coercion qiladi (Number, String, Boolean, null/undefined maxsus holatlar). === Identity comparison — faqat bir xil type va bir xil qiymat bo'lsa true. Agent yoki dasturchi "oddiy solishtirish" deb == yozgan, coercion'ni hisobga olmagan.

## Tasdiqlash
1. Kodda == yoki != bormi? (grep " == " yoki " != ")
2. Solishtirilayotgan qiymatlar har doim bir xil type'mi? (agar yo'q bo'lsa, xavfli)
3. Kutilgan natija === bilan bir xilmi? (console.log yoki test bilan tekshir)
4. null/undefined, 0/false/"0"/"" kabi edge case'lar bor bo'lsa, ayniqsa tekshir.

## Tuzatish (aynan shu)
Har doim === va !== ishlat. Faqat maxsus holatda (masalan null == undefined ni ataylab xohlasang) == qoldir, lekin izoh bilan.

```javascript
// Noto'g'ri — type coercion
if (userInput == 0) {  // "0", false, "", null ham true bo'lishi mumkin
  // ...
}
if (status != "active") { }

// To'g'ri — strict
if (userInput === 0) {  // faqat number 0
  // ...
}
if (status !== "active") { }

// Maxsus holat (kamdan-kam)
if (value == null) {  // null yoki undefined ni tutadi
  // izoh: ataylab == ishlatilgan
}
```

Agar mavjud kodni tuzatayotgan bo'lsang, barcha == ni === ga o'zgartir va test qil (ayniqsa string/number aralash joylarda).

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- JavaScript'da har doim === (strict equality) ishlat — type coercion bug'larini oldini oladi.
- == faqat ataylab null/undefined kabi holatlarda, izoh bilan.
- Bu oddiy o'zgarish ko'p yashirin xatolarni yo'q qiladi.
