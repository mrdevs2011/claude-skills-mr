---
name: agent-used-browser-for-simple-fetch
description: Oddiy statik sahifa matnini olish uchun browser_execute yoki to'liq brauzer avtomatizatsiyasidan foydalanish — open_page yoki web_search yetarli va engilroq bo'lganda.
---

# Oddiy sahifa kontenti uchun og'ir brauzer ishlatish

## Nima uchun bu skill kerak
Agentlar ba'zan oddiy ma'lumot olish (maqola matni, hujjat, API docs) uchun to'liq browser_execute, snapshot, click va hokazo ishlatadi. Bu sekin, token sarflaydi, xato ehtimoli yuqori va keraksiz murakkablik keltiradi. Engil tool yetarli bo'lsa uni ishlatish kerak.

## Simptom (aynan shu)
- Foydalanuvchi oddiy URL yoki sahifa kontentini so'radi.
- Agent browser_execute bilan page.goto, snapshot, evaluate qiladi.
- open_page yoki web_search tooli mavjud va yetarli edi.
- Natija olish uchun ko'p qadam va vaqt ketdi, yoki brauzer bloklandi.

## Sabab (100%)
Agent "brauzer har doim ishonchli" yoki "avval shu usulni sinadim" deb hisoblab, mavjud engil tool'larni (open_page, web_search) tekshirmaydi yoki ularni yetarli deb hisoblamaydi. Progressiv disclosure va eng arzon yo'l tamoyilini qo'llamaydi.

## Tasdiqlash
- So'rov oddiy matn/HTML kontentmi yoki interaktiv element talab qiladimi?
- open_page yoki web_search bilan birinchi urinish qilinganmi?
- Brauzer faqat dinamik, JS-heavy yoki login talab qiladigan holatda ishlatilganmi?
- Tool chaqiruvlar soni minimalmi?

## Tuzatish (aynan shu)
1. So'rovni bahola: oddiy o'qishmi yoki klik/forma/JS kerakmi?
2. Oddiy bo'lsa birinchi **open_page(url)** yoki **web_search** chaqir.
3. Faqat ochiq page yetarli bo'lmasa yoki dinamik kontent kerak bo'lsa browser_execute'ga o't.
4. Parallel qilish mumkin bo'lsa parallel qil, lekin keraksiz og'irlikni qo'shma.
5. Natijani olgach, agar yetarli bo'lsa to'xtat — qo'shimcha brauzer qadamlarini qo'shma.

Misol to'g'ri tartib:
- Avval: open_page("https://example.com/docs")
- Yetmasa: keyin browser_execute faqat kerakli qism uchun.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Oddiy kontent uchun doim engil tool'ni (open_page, web_search) birinchi sinab ko'r.
- Brauzer avtomatizatsiyasi faqat haqiqiy interaktiv yoki murakkab holatlar uchun.
- Bu tejamkorlik va ishonchlilikni oshiradi, token va vaqtni tejaydi.
