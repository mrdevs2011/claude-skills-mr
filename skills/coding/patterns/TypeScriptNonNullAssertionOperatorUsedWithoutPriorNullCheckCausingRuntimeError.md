---
name: typescript-non-null-assertion-without-prior-null-check
description: TypeScript da ! (non-null assertion) operatori ishlatilganda runtime da qiymat null yoki undefined bo'lsa TypeError yoki crash yuzaga keladi; oldindan tekshiruv yoki optional chaining (?) ishlatish kerak.
---

# TypeScript non-null assertion (!) ishlatish runtime xatosiga olib keladi

## Nima uchun bu skill kerak
TypeScript kompilyatorga "bu qiymat null/undefined emas" deb aytadi `!` operatori bilan, lekin runtime da tekshiruv yo'q. Agar qiymat haqiqatan null bo'lsa, keyingi chaqiruv yoki property access crash qiladi. Bu tipik "compile-time xavfsiz, runtime xavfli" holat.

## Simptom (aynan shu)
Kod TypeScript da xatosiz kompilyatsiya qilinadi, lekin runtime da `Cannot read properties of null` yoki `Cannot read properties of undefined` xatosi chiqadi. Ayniqsa API javobi, DOM element, yoki ixtiyoriy property larda.

## Sabab (100%)
`!` (non-null assertion operator) faqat TypeScript type checker uchun ishlaydi — u runtime kodga hech narsa qo'shmaydi. U `value!` ni `value` ga o'giradi, null tekshiruvsiz. Agar source null bo'lsa, keyingi `.method()` yoki `.prop` TypeError beradi.

## Tasdiqlash
Kodda `!` qidir. Ayniqsa quyidagi holatlarda:

```typescript
const user = getUser()!;
console.log(user.name);  // getUser() null qaytarsa crash

element!.addEventListener(...);  // element null bo'lishi mumkin
```

Runtime da null qiymat bilan test qil.

## Tuzatish (aynan shu)
`!` o'rniga explicit tekshiruv, optional chaining yoki default ishlat:

```typescript
// Noto'g'ri
const name = user!.name;

// To'g'ri: optional chaining
const name = user?.name;

// To'g'ri: explicit check
if (user) {
  const name = user.name;
}

// To'g'ri: default
const name = user?.name ?? "unknown";

// Agar haqiqatan non-null ekanligiga ishonch bo'lsa va test qilingan bo'lsa,
// komment bilan ! ishlatish mumkin, lekin imkon qadar kamaytir.
```

Agar TypeScript strictNullChecks yoqilgan bo'lsa, `!` ni kamaytirish yanada muhim.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
`!` operatori faqat type checker ni aldaydi, runtime himoya bermaydi. Null/undefined ehtimoli bor joylarda optional chaining (`?.`), nullish coalescing (`??`) yoki explicit `if` tekshiruv ishlat. Bu runtime crash larni oldini oladi.
