---
name: agent-used-read-file-on-image-or-binary
description: Agent read_file tool'ini rasm, PDF, yoki boshqa binary faylga ishlatdi — natijada o'qib bo'lmaydigan chiqish, xato yoki context buzilishi yuz berdi.
---

# Agent rasm yoki binary faylga ReadFile ishlatdi

## Nima uchun bu skill kerak
Agentlar ba'zan foydalanuvchi bergan rasm URL'i yoki lokal binary fayl (rasm, PDF, video, zip) ni oddiy matn sifatida o'qishga urinadi. Bu tool noto'g'ri ishlatilganda chiqish axlatga aylanadi, context to'lib ketadi yoki foydali ma'lumot olinmaydi. To'g'ri tool'ni tanlash agentning samaradorligini oshiradi.

## Simptom (aynan shu)
- `read_file` yoki `cat`/`head` bilan rasm (`.png`, `.jpg`, `.webp`), PDF, yoki binary fayl o'qilganda terminalda `�` belgilar, `binary file` ogohlantirish yoki to'liq o'qib bo'lmaydigan chiqish chiqadi.
- Agent rasm mazmunini "o'qib" tushuntirishga urinadi, lekin hech qanday foydali tavsif yo'q.
- Tool natijasi juda uzun va foydasiz bo'lib, keyingi qadamlar uchun context'ni to'ldiradi.
- Foydalanuvchi rasm bergan, lekin agent `view_image` ni chaqirmagan.

## Sabab (100%)
1. Agent fayl kengaytmasini yoki content-type'ni tekshirmasdan `read_file` ni universal o'qish tool'i deb hisobladi.
2. Rasm URL'i berilganida `view_image` tool'i mavjudligini esdan chiqardi yoki bilmagan.
3. Binary fayllarni matn sifatida o'qish mumkin emas — encoding mos kelmaydi va tool xato yoki axlat qaytaradi.

## Tasdiqlash
1. Foydalanuvchi bergan fayl yoki URL kengaytmasini tekshir (`.png`, `.jpg`, `.pdf`, `.zip` va h.k.).
2. Agar `read_file` chaqiruvi qilingan va chiqishda binary belgilar yoki "not a text file" kabi narsa bo'lsa — bu aynan shu holat.
3. `view_image` tool'i mavjudligini tekshir (rasmlar uchun).

## Tuzatish (aynan shu)
Rasm URL'i bo'lsa, doim `view_image` ishlat:

```python
# Noto'g'ri:
# read_file(file_path="image.png")  # yoki URL uchun open_page

# To'g'ri:
view_image(image_url="https://example.com/image.png")
```

Lokal binary fayl bo'lsa va rasm bo'lmasa (masalan PDF yoki zip), `read_file` o'rniga maxsus tool yoki `bash` bilan `file` buyrug'i orqali turini aniqlab, kerakli usulni tanla. Matn emasligini bilgan holda `read_file` ni chaqirma.

Agar rasm mazmunini tushunish kerak bo'lsa, faqat `view_image` natijasiga asoslan.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Rasm va binary fayllarni hech qachon `read_file` bilan o'qima — bu tool faqat matn uchun.
- Rasm URL'i berilsa, doim `view_image` tool'ini chaqir.
- Fayl turini oldindan tekshirib, to'g'ri tool'ni tanlash agentning ishonchliligi va context samaradorligini oshiradi.
