---
name: agent-attempted-to-schedule-recurring-hourly-skill-generation-instead-of-executing-single-request-once
description: Foydalanuvchi "har soatda yangi skill yarat va push qil" desa, agent bir martalik so'rovni bajarish o'rniga cron, loop yoki recurring job o'rnatishga urinadi — bu cheksiz ishga tushirish, token sarfi va nazoratsiz pushlarga olib keladi.
---

# Agent "har soatda" so'rovini recurring job sifatida o'rnatishga urinishi

## Nima uchun bu skill kerak
Foydalanuvchi "Har soatda yangi yuqori sifatli skill yarat va FAQAT ... repo'siga push qil" deb yozganda, bu odatda **joriy suhbatdagi bir martalik so'rov** hisoblanadi. Agent uni cheksiz davom etadigan cron, while loop, background scheduler yoki "har soatda o'zim ishga tushiraman" deb talqin qilsa, nazoratsiz token sarfi, duplicate skill'lar, git conflict'lar va foydalanuvchi ruxsatisiz ishlar yuzaga keladi. Agent faqat joriy so'rovni bir marta to'liq bajarishi, hisobot berishi va to'xtashi kerak.

## Simptom (aynan shu)
- Foydalanuvchi "har soatda" yoki "every hour" iborasini ishlatgan.
- Agent bash orqali `crontab`, `while true; do ... sleep 3600; done`, background daemon, yoki "men har soatda ishga tushaman" deb javob beradi.
- Yoki bir marta bajarib, keyin "keyingi soatda yana qilaman" deb va'da beradi, lekin tool/session cheklovini e'tiborsiz qoldiradi.
- Natijada bitta so'rov o'rniga ko'p marta skill yaratiladi yoki jarayon to'xtamaydi.

## Sabab (100%)
Agent "har soatda" iborasini literal ravishda doimiy avtomatlashtirish buyrug'i deb tushundi. U suhbat cheklovi, tool session muddati, foydalanuvchi nazorati va "bir martalik bajarish + hisobot" talabini e'tiborsiz qoldirdi. Qayta-qayta ishlash uchun maxsus ruxsat yoki alohida scheduler yo'qligini hisobga olmadi.

## Tasdiqlash
1. Foydalanuvchi xabari "har soatda" yoki shunga o'xshash davriy ifoda bormi?
2. Agent javobida yoki tool chaqiruvlarida cron, sleep loop, recurring setup, yoki "keyingi safar" va'dasi bormi?
3. Faqat bitta skill yaratildi, bitta commit/push qilindi va aniq hisobot (skill nomi, qo'llanmalar, commit hash, push holati) berildimi?
4. Hech qanday background/recurring process ishga tushirilmaganmi?

## Tuzatish (aynan shu)
"Har soatda" so'rovini **joriy suhbatdagi bir martalik vazifa** deb qabul qil:

1. Qo'llanmalarni (architecture.md, instruction.md, style.md) o'qi.
2. Mavjud skill'larni tekshirib, takrorlanmaydigan yangi skill yarat (SKILL.md + kerakli).
3. .env va .gitignore ni tekshir/yarat.
4. Git config, add, commit, push qil.
5. Aniq hisobot ber: skill nomi, o'qilgan qo'llanmalar, commit hash, push muvaffaqiyatli (yoki aniq xato).
6. To'xta. Hech qanday cron, loop, background job, "har soatda qaytaman" deb yozma.
7. Agar foydalanuvchi haqiqatan doimiy avtomatlashtirish xohlasa — alohida aniq ruxsat va cheklov so'ra, o'zing o'rnatma.

Misol (to'g'ri xatti-harakat):
```bash
# Faqat bir marta
cd /tmp/skills-repo
# skill yarat, commit, push
git commit -m "Add new skill: ... - ..."
git push origin main
# Hisobot: skill nomi, qo'llanmalar, hash, push OK
# To'xta
```

Noto'g'ri:
```bash
while true; do ... sleep 3600; done  # YOKI crontab
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
"Har soatda skill yarat" kabi so'rovlar odatda joriy bir martalik bajarishni bildiradi. Agent uni recurring scheduler yoki cheksiz loop sifatida talqin qilmasligi, faqat bitta skill yaratib, aniq hisobot berib to'xtashi kerak. Bu token sarfini, duplicate'larni va nazoratsiz pushlarni oldini oladi.
