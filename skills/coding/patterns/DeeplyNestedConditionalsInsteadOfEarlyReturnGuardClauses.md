---
name: deeply-nested-conditionals-early-return
description: Kod chuqur ichki if-else yoki nested conditionallar bilan yozilgan, erta qaytish (early return) yoki guard clause ishlatilishi mumkin bo'lganda — o'qish qiyin, xato ehtimoli yuqori.
---

# Chuqur nested if-else o'rniga early return / guard clause ishlatmaslik

## Nima uchun bu skill kerak
Agentlar (va dasturchilar) shartlarni ichma-ich yozishadi, natijada 4-5 darajali nesting paydo bo'ladi. Bu kodni o'qishni qiyinlashtiradi, "else" qismlarida xato qilish oson, va refaktor qilish og'ir. Early return va guard clause patterni ancha toza va xavfsizroq.

## Simptom (aynan shu)
- Funksiya ichida if ichida if ichida if (3+ daraja nesting).
- Asosiy "happy path" eng ichki qatorda yozilgan.
- Ko'p `else` bloklari bor yoki indentatsiya haddan tashqari chuqur.
- Kod "ishlaydi", lekin o'qish va saqlash qiyin. Yangi shart qo'shilganda nesting yanada oshadi.

## Sabab (100%)
Agent avval barcha shartlarni yozib, keyin ichiga asosiy mantiqni joylashtiradi. Early return (guard clause) patternini o'ylamaydi yoki "hamma narsa bir joyda bo'lsin" deb ichki strukturani tanlaydi. Natijada o'qish oqimi teskari bo'ladi.

## Tasdiqlash
1. Funksiyani ochib, indentatsiya darajasini ko'r (3+ bo'lsa ehtimol bor).
2. Asosiy return yoki asosiy ish eng ichki blokdamimi?
3. Agar tashqi shartlar "agar bu noto'g'ri bo'lsa return" qilib chiqarilsa, nesting kamayadimi?
4. Mavjud testlar bor bo'lsa, refaktor qilish xavfsizligini tekshir.

## Tuzatish (aynan shu)
Guard clause va early return ishlatib, nestingni kamaytir:

```js
// Noto'g'ri (chuqur nesting):
function processUser(user) {
  if (user) {
    if (user.isActive) {
      if (user.hasPermission) {
        // asosiy ish shu yerda
        return doWork(user);
      } else {
        return "no permission";
      }
    } else {
      return "not active";
    }
  } else {
    return "no user";
  }
}

// To'g'ri (early return / guard):
function processUser(user) {
  if (!user) return "no user";
  if (!user.isActive) return "not active";
  if (!user.hasPermission) return "no permission";

  // asosiy happy path endi eng yuqorida, nesting yo'q
  return doWork(user);
}
```

Qoidalar:
- Noto'g'ri holatlarni avval tekshirib, darhol return qil.
- Asosiy mantiq funksiyaning oxirida yoki eng kam indent bilan qolsin.
- Har bir guard bitta aniq sababni qaytarsin.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Chuqur nesting o'rniga early return va guard clause ishlat.
- Bu kodni o'qishni osonlashtiradi va xato ehtimolini kamaytiradi.
- Happy path eng yuqori darajada qolishi kerak.
