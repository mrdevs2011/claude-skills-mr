---
name: process-media-without-reading-bundled-ffmpeg-skill
description: Video, audio, GIF yoki boshqa media fayllarni ffmpeg bilan qayta ishlash (convert, trim, compress, extract, merge va h.k.) so'ralganda bundled ffmpeg skill SKILL.md ni o'qimasdan to'g'ridan-to'g'ri bash buyruqlari yozilganda — noto'g'ri flaglar, optimallashtirilmagan sozlamalar yoki skilldagi eng yaxshi amaliyotlar buziladi.
---

# Media fayllarni qayta ishlashdan oldin bundled ffmpeg skillni o'qimaslik

## Nima uchun bu skill kerak
Agentlar ba'zan "ffmpeg bilaman" deb hisoblab, video/audio ishlashni to'g'ridan-to'g'ri bash orqali boshlaydi. Lekin loyihada maxsus bundled ffmpeg skill mavjud bo'lib, u to'g'ri flaglar, presetlar, xavfsiz ishlatish, umumiy xatolar va majburiy qadamlarni o'z ichiga oladi. O'qimasdan ishlash samarasiz, xato yoki skill talablariga zid natijaga olib keladi.

## Simptom (aynan shu)
- Foydalanuvchi video birlashtirish, kesish, compress qilish, GIF yasash, audio ajratish, subtitles qo'shish yoki boshqa ffmpeg ishini so'ragan.
- Agent to'g'ridan-to'g'ri `bash` tool bilan `ffmpeg ...` buyruqlarini yozgan.
- `/usr/share/grok/bundled-skills/bundled__ffmpeg/SKILL.md` `read_file` bilan o'qilmagan.
- Natijada noto'g'ri codec, yuqori fayl hajmi, yo'qolgan audio, yoki skillda tavsiya qilingan usul ishlatilmagan.

## Sabab (100%)
Agent mavjud bundled skill katalogini tekshirmagan yoki media ishlashni oddiy bash vazifasi deb taxmin qilgan. architecture.md va skill-creator tamoyillariga zid: maxsus tool/skill mavjud bo'lsa, avval o'qilishi shart.

## Tasdiqlash
- So'rovda "video", "ffmpeg", "gif", "compress video", "merge clips", "extract audio" kabi so'zlar bormi?
- Bundled skill yo'li `bundled__ffmpeg/SKILL.md` read_file bilan o'qilganmi?
- Agar o'qilmagan bo'lsa — shu skill qo'llaniladi.
- Ishlatilgan buyruq skilldagi tavsiyalarga mos keladimi (masalan, crf, preset, stream mapping)?

## Tuzatish (aynan shu)
1. Media ishlash so'rovi aniqlangach darhol skillni o'qi:
   `read_file` path `/usr/share/grok/bundled-skills/bundled__ffmpeg/SKILL.md`
2. Skilldagi barcha qoidalarga 100% amal qil (flaglar, cheklovlar, eng yaxshi amaliyotlar, xato holatlar).
3. Keyin faqat skillda ko'rsatilgan usul va flaglar bilan `bash` orqali ffmpeg chaqir.
4. Kerak bo'lsa natija faylni `render_file` bilan ko'rsat.
5. Hech qachon "men bilaman" deb skillni o'tkazib yuborma.

```bash
# Noto'g'ri
ffmpeg -i input.mp4 output.mp4   # skill o'qilmagan, default sozlamalar

# To'g'ri
1. read_file("/usr/share/grok/bundled-skills/bundled__ffmpeg/SKILL.md")
2. Skilldagi tavsiya asosida: ffmpeg -i input.mp4 -c:v libx264 -crf 23 -preset medium output.mp4
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Video/audio/GIF kabi media fayllarni ffmpeg bilan ishlashdan oldin har doim bundled ffmpeg skillini o'qi.
- Bu noto'g'ri flaglar, samarasiz compress, yo'qolgan funksiyalar va umumiy xatolarning oldini oladi.
- "Bilaman" taxmini o'rniga skilldagi aniq yo'riqnoma va eng yaxshi amaliyotlar ishlatiladi.
