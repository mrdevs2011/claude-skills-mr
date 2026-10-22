---
name: long-running-command-foreground-block
description: Uzoq davom etadigan buyruqni foreground'da ishga tushirish, sessionni bloklash yoki timeout bermaslik — agent keyingi qadamlarga o'tolmaydi yoki hung holatga tushadi.
---

# Uzoq buyruqni foreground'da ishga tushirish, background yoki timeout ishlatmaslik

## Nima uchun bu skill kerak
Agentlar ba'zan git clone, npm install, build, test suite, yoki boshqa uzoq ishlaydigan buyruqlarni oddiy `bash` chaqiruvi bilan ishga tushiradi. Agar tool foreground'da kutsa, session bloklanadi, progress yo'qoladi va keyingi qadamlar bajarilmaydi. Bu ayniqsa parallel ishlar yoki multi-step vazifalarda muammo.

## Simptom (aynan shu)
- Bash yoki command tool chaqiruvida uzoq ishlaydigan buyruq (clone, install, build, server start) berilgan.
- `block_until_ms` yoki timeout parametri ishlatilmagan, yoki default qiymat juda kichik/katta.
- Natijada tool uzoq kutadi, agent keyingi tool'larni chaqira olmaydi, yoki "hung" holatda qoladi.
- Foydalanuvchi "hali ham ishlayapti" yoki progress yo'q deb his qiladi.

## Sabab (100%)
Agent buyruqning qancha vaqt olishini oldindan taxmin qilmagan va tool'ning background/timeout imkoniyatlarini ishlatmagan. Barcha buyruqlarni "tez tugaydi" deb hisoblagan.

## Tasdiqlash
- Buyruq 10-30 soniyadan uzoqroq ishlashi mumkinmi? (clone, npm ci, docker build, testlar)
- Tool chaqiruvida background flag yoki katta timeout ko'rsatilmaganmi?
- Keyingi qadamlar shu buyruq tugashiga bog'liq, lekin agent parallel yoki keyinroq tekshirish rejasini qilmaganmi?

## Tuzatish (aynan shu)
Uzoq ishlashi mumkin bo'lgan buyruqlarni background'ga tushir yoki yetarli timeout ber:

1. Agar tool `block_until_ms` yoki background parametrini qo'llasa — uni ishlat.
2. Background qilgandan keyin statusni polling qil yoki logni o'qi.
3. Hech qachon uzoq buyruqni default foreground'da qoldirma.

Misol (bash tool bilan):
```python
# Noto'g'ri: foreground'da uzoq buyruq
bash(command="npm install", description="Install deps")

# To'g'ri: background yoki katta timeout
bash(command="npm install", description="Install deps", block_until_ms=0)  # background
# keyin get_terminal_command_output bilan tekshir

# Yoki
bash(command="npm install", description="Install deps", block_until_ms=120000)
```

Qoidalar:
- Clone, install, build, test, server start — har doim timeout yoki background.
- Tugagandan keyin exit code va outputni tekshir (boshqa skill'ga qara).
- Progress kerak bo'lsa, log faylga yozdirib, uni o'qi.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Uzoq buyruqlarni foreground'da ishga tushirma — session bloklanadi.
- Background yoki yetarli timeout ishlat, keyin statusni alohida tekshir.
- Bu agentning multi-step vazifalarda "osilib qolish"ini oldini oladi.
