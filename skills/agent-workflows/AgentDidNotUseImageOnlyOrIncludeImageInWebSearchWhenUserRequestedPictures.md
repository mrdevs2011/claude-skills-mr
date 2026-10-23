---
name: agent-did-not-use-image-flags-in-web-search
description: Foydalanuvchi rasm yoki vizual so'raganda web_search'da image_only yoki include_image ishlatmaslik — oddiy matn natijalari qaytariladi.
---

# Web search'da rasm so'rovlari uchun image flag'larini ishlatmaslik

## Nima uchun bu skill kerak
Agentlar foydalanuvchi "rasmlarni ko'rsat", "qanday ko'rinadi", diagramma, screenshot yoki boshqa vizual kontent so'raganda oddiy web_search chaqiradi va image_only yoki include_image parametrlarini bermaydi. Natijada faqat matnli sahifalar keladi, asosiy rasmlar biriktirilmaydi. Bu qo'shimcha chaqiruvlar, token sarfi va yomon foydalanuvchi tajribasiga olib keladi. Tool'da maxsus flag'lar borligini bilish kerak.

## Simptom (aynan shu)
- So'rovda rasm, foto, diagramma, screenshot, "ko'rsat", "qanday ko'rinadi" kabi vizual so'rovlar bor.
- Agent web_search(query="...") chaqiradi, lekin include_image yoki image_only parametrlarini aniq bermaydi.
- Qaytgan natijalar asosan matnli, attached image file path'lar yo'q yoki kam.
- Agent keyin "rasm topilmadi" deydi, oddiy linklar beradi yoki alohida qidiruv qiladi.

## Sabab (100%)
Agent web_search tool'ining include_image (asosiy rasmni biriktiradi) va image_only (faqat rasmlarni qaytaradi) parametrlarini unutadi yoki e'tiborsiz qoldiradi. Har qanday qidiruv uchun oddiy query yetarli deb hisoblaydi, vizual so'rovlar uchun maxsus rejim borligini bilmaydi.

## Tasdiqlash
- Foydalanuvchi so'rovida vizual/rasm so'zlari bormi?
- web_search chaqiruvida image_only=true yoki include_image=true aniq berilganmi?
- Tool natijasida image file path'lar (searched_images) yoki attached images bormi?
- Faqat rasmlar kerak bo'lsa image_only ishlatilganmi?

## Tuzatish (aynan shu)
1. Agar foydalanuvchi faqat rasmlarni so'rasa — web_search(query="...", image_only=true, num_results=5) ishlat.
2. Agar matn + asosiy rasmlar kerak bo'lsa — include_image=true (default bo'lsa ham aniq ko'rsat) va kerak bo'lsa num_results oshir.
3. Natijadagi image file path'larni keyingi tool'larga (view_image, render_generated_image yoki foydalanuvchiga ko'rsatish) uzat.
4. Hech qachon rasm so'rovi uchun flag'siz web_search qilma va keyin "rasm yo'q" dema.
5. image_only=true ishlatilganda faqat rasmli sahifalar qaytadi — alohida image search tool kerak emas.

Misol:
- Noto'g'ri: web_search(query="modern React component diagram")
- To'g'ri: web_search(query="modern React component diagram", image_only=true)

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- web_search tool'ida include_image va image_only parametrlari bor va ularni vizual so'rovlar uchun ishlatish shart.
- image_only=true alohida image qidiruv o'rnini bosadi va faqat rasmlarni qaytaradi.
- Bu flag'larni to'g'ri ishlatish to'g'ri vizual natija beradi, qo'shimcha chaqiruvlarni kamaytiradi va foydalanuvchiga tezroq javob beradi.
