---
name: agent-included-raw-unprocessed-tool-output-in-response
description: Agent yakuniy javobda tool natijasining xom (raw) chiqishi, to'liq stack trace yoki JSON dump'ni to'g'ridan-to'g'ri joylashtiradi, foydalanuvchiga toza xulosa o'rniga shovqinli texnik matn beradi.
---

# Agent Included Raw Unprocessed Tool Output Or Stack Trace In Final User Response Instead Of Clean Summary

## Nima uchun bu skill kerak

Tool'lar (bash, web_search, browser_execute va boshqalar) ko'pincha uzun, xom, texnik chiqish qaytaradi. Foydalanuvchi (ayniqsa MR) qisqa, tushunarli, natijaga yo'naltirilgan javob kutadi. Xom chiqishni to'g'ridan-to'g'ri javobga qo'yish kontekstni ifloslaydi, o'qishni qiyinlashtiradi va professional ko'rinishni buzadi.

## Simptom (aynan shu)

Yakuniy javob ichida quyidagilar ko'rinadi:
- To'liq bash/command output (stdout/stderr) copy-paste qilingan
- Stack trace yoki error traceback to'liq matn sifatida
- Tool qaytargan JSON yoki XML raw dump
- "Tool returned: ..." deb boshlanib, keyin uzun xom matn

Foydalanuvchi xulosa o'rniga shovqinli texnik log ko'radi.

## Sabab (100%)

Agent tool natijasini "ishonchli qilish" yoki "to'liq ko'rsatish" uchun qayta ishlamasdan to'g'ridan-to'g'ri javobga joylashtiradi. Instruction'dagi "qisqa va to'g'ridan-to'g'ri", "keraksiz cho'zmasdan" va style.md dagi ohang qoidalarini e'tiborsiz qoldiradi. Natijani tahlil qilib, faqat foydali qismini ajratib olish o'rniga, hamma narsani chiqaradi.

## Tasdiqlash

1. Yakuniy javobni o'qi — unda to'liq command output, traceback yoki raw JSON bormi?
2. Bu matn foydalanuvchiga nima qilish kerakligini tushuntirishdan ko'ra, log sifatida ko'rinadimi?
3. Xulosa/qisqa tahlil bormi, yoki faqat xom chiqish?

Agar xom chiqish bor va toza xulosa yo'q — bu skill qo'llanadi.

## Tuzatish (aynan shu)

Xom chiqishni hech qachon to'g'ridan-to'g'ri javobga qo'yma. Quyidagini qil:

1. Tool natijasini o'zing tahlil qil (muvaffaqiyatli/m? xato sababi? asosiy ma'lumot nima?).
2. Foydalanuvchiga faqat kerakli xulosa, natija va keyingi qadamni ayt.
3. Agar aniq xato bo'lsa — qisqa sabab + tuzatish yo'li.
4. Kerak bo'lsa, faqat eng muhim 2-3 qatorni quote qil (to'liq emas).

**Yomon misol:**
```
Buyruq natijasi:
exit: 1
Error: something failed
Traceback (most recent call last):
  File "x.py", line 10
    ...
```

**Yaxshi misol:**
Buyruq xato bilan tugadi — sabab: fayl topilmadi (`No such file`). Yo'lni tekshirib, to'g'ri path bilan qayta urin.

## Xulosa — bu skillni o'qib nimani bilib oldingiz

Tool natijasini xom holatda foydalanuvchiga berish o'rniga, uni tahlil qilib, qisqa, tushunarli, amaliy xulosa berish kerak. Bu javobni o'qishga yaroqli va professional qiladi.
