---
name: sql-string-concat-injection
description: SQL so'rov string concat yoki template bilan yozilgan, foydalanuvchi kiritishi to'g'ridan-to'g'ri qo'shilgan — SQL injection xavfi.
---

# SQL: string concat — injection xavfi

## Nima uchun bu skill kerak
AI SQL yozadi: `"SELECT * FROM users WHERE id = " + userId` yoki `` `... WHERE name = '${name}'` ``. Foydalanuvchi kiritishi to'g'ridan-to'g'ri so'rovga tushsa — SQL injection. Bu xavfsizlikning eng klassik va hali ham uchraydigan teshigi. AI "ishlaydi" deb yozadi, xavfni o'ylamaydi.

## Simptom (aynan shu)
- SQL so'rovda `+`, template literal, yoki string interpolate.
- Foydalanuvchi/input qiymati to'g'ridan-to'g'ri so'rov matniga qo'shilgan.
- Parameterized query / prepared statement / bind ishlatilmagan.
- ORM bo'lsa ham, raw query string concat bilan.

## Sabab (100%)
AI tez yechim uchun string yig'adi. Parameterized query yoki ORM helper'ni unutadi yoki bilmaydi.

## Tasdiqlash
1. SQL yoki raw query yozilgan joylarni toping.
2. Foydalanuvchi/input qiymati stringga `+` yoki `${}` bilan qo'shilganmi?
3. Placeholder (`$1`, `?`) yoki ORM param ishlatilganmi?
4. Agar concat bo'lsa — xavf bor.

## Tuzatish (aynan shu)
Parameterized query yoki ORM ishlating:

```js
// XATO — injection:
const q = "SELECT * FROM users WHERE id = " + userId;
const q2 = `SELECT * FROM users WHERE name = '${name}'`;
db.query(q);

// TO'G'RI — parameterized (pg misol):
const q = "SELECT * FROM users WHERE id = $1";
db.query(q, [userId]);

// TO'G'RI — mysql2:
db.execute("SELECT * FROM users WHERE id = ?", [userId]);

// TO'G'RI — ORM (Prisma):
prisma.user.findUnique({ where: { id: userId } });

// TO'G'RI — ORM raw (param bilan):
prisma.$queryRaw`SELECT * FROM users WHERE id = ${userId}`;
// (Prisma tagged template o'zi escape qiladi)
```

Qoida: hech qachon foydalanuvchi kiritishini SQL stringiga to'g'ridan-to'g'ri qo'shmang. Faqat placeholder + param yoki ORM.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- SQL + string concat = injection xavfi.
- Parameterized query yoki ORM — majburiy.
- AI "ishlaydi" deb xavfli so'rov yozishi mumkin.
