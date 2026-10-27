---
name: agent-described-video-from-x-post-without-view-x-video
description: Agent X post URL yoki video havolasini olganda video mazmunini o'zi taxmin qilib yoki web_search bilan tasvirlab beradi, view_x_video toolini chaqirmaydi. Natijada noaniq yoki noto'g'ri video tavsifi.
---

# Agent X postdagi videoni view_x_video toolisiz tasvirladi

## Nima uchun bu skill kerak
view_x_video tooli X postdagi videoning interlaced freymlari va subtitrlarni qaytaradi. Agent buni chaqirmasdan video haqida gapirsa, mazmunni ko'rmagan holda taxmin qiladi yoki boshqa manbadan oladi — bu xato ma'lumot berishga olib keladi.

## Simptom (aynan shu)
Foydalanuvchi X post URL (https://x.com/user/status/id) yoki video.twimg.com havolasini berib, video mazmunini so'raydi. Agent javobida videoni tasvirlab beradi, lekin tool chaqiruvlarida view_x_video yo'q, yoki faqat web_search / open_page ishlatilgan.

## Sabab (100%)
Agent view_x_video toolining mavjudligini esdan chiqardi yoki "web_search yetarli" deb o'yladi. Tool schema yoki avvalgi natijalardagi media ro'yxatini e'tiborsiz qoldirdi.

## Tasdiqlash
- So'rovda x.com/status/ yoki video.twimg.com URL bor.
- Agent javobi video freymlari/subtitrlari haqida gapiradi.
- Tool call tarixida view_x_video(video_url=...) yo'q.

## Tuzatish (aynan shu)
X post URL yoki video URL berilganda darhol view_x_video ni chaqir:

```
view_x_video(video_url="https://x.com/user/status/1234567890")
```

yoki media ro'yxatidagi video.twimg.com URL bilan.

Natijadagi freymlar va subtitrlarni o'qib, faqat shu asosida javob ber. Taxmin qilma.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
X videosi haqida so'ralganda view_x_video toolini majburiy chaqirish kerak — boshqa usullar bilan video mazmunini bilib bo'lmaydi.
