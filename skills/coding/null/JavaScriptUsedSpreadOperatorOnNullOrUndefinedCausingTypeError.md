---
name: javascript-spread-on-null-or-undefined
description: JavaScript object or array spread on null/undefined throws TypeError. Use when seeing "Cannot spread non-iterable" or "is not iterable" after ...null.
---

# JavaScript Spread on Null or Undefined Causes TypeError

## Nima uchun bu skill kerak
Object yoki array spread (`...`) null yoki undefined qiymatga qo'llanilganda TypeError chiqadi. Bu xato ko'pincha API javobidagi optional field yoki optional chaining yetishmasligidan kelib chiqadi. Skill aniq holatni tez topish va tuzatish uchun.

## Simptom (aynan shu)
- `TypeError: Cannot spread non-iterable instance` yoki `is not iterable`
- `TypeError: Invalid attempt to spread non-iterable instance`
- Kod: `const merged = { ...userData, ...defaults };` ishlamaydi, chunki `userData` null
- Array: `const items = [...maybeNullArray];` xato beradi

## Sabab (100%)
JavaScript spread operatori faqat iterable yoki object bo'lgan qiymatlarni qabul qiladi. `null` va `undefined` iterable emas. Optional field (`user?.profile`) undefined bo'lsa yoki API null qaytarsa, to'g'ridan-to'g'ri spread xato beradi. Bu TypeScriptda ham runtime'da yuz beradi, chunki type narrow qilinmagan.

## Tasdiqlash
1. Xato stack trace'da spread (`...`) qatorini top.
2. Spread qilinayotgan o'zgaruvchini console yoki debugger bilan tekshir: qiymati `null` yoki `undefined` ekanini tasdiqla.
3. `typeof value === 'object' && value !== null` yoki `Array.isArray` bilan tekshirib ko'r.
4. Agar TypeScript ishlatilsa, optional type (`T | null | undefined`) ekanini ko'r.

## Tuzatish (aynan shu)
Null/undefined holatini oldindan default qiymat bilan almashtir yoki conditional spread ishlat.

```javascript
// Noto'g'ri — userData null bo'lsa TypeError
const merged = { ...userData, id: 1 };

// To'g'ri — default empty object
const merged = { ...(userData ?? {}), id: 1 };

// Array uchun
const items = [...(maybeArray ?? [])];

// Yoki explicit check
const safeData = userData && typeof userData === 'object' ? userData : {};
const merged = { ...safeData, id: 1 };
```

TypeScriptda:
```typescript
interface User { name: string }
function merge(user: User | null) {
  return { ...(user ?? { name: 'guest' }), active: true };
}
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Spread (`...`) null yoki undefined ga qo'llanilsa TypeError chiqadi. Doim `?? {}` yoki `?? []` bilan default ber, yoki explicit null check qil. Bu optional API field'larida eng keng tarqalgan xato.
