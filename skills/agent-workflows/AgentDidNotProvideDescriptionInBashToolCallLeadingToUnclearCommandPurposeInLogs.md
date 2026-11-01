---
name: agent-did-not-provide-description-in-bash-tool-call-leading-to-unclear-command-purpose-in-logs
description: Bash tool chaqiruvlarida description parametrini berilmasa, loglarda buyruqning maqsadi tushunarsiz qoladi va keyinchalik audit yoki debug qilish qiyinlashadi. Har doim qisqa tavsif berish kerak.
---

# Bash tool chaqiruvlarida description berish

## Nima uchun bu skill kerak
Bash tool (yoki run_command) chaqiruvlarida description maydoni log va terminal chiqishlarida buyruqning nima uchun ishga tushirilganini tushuntiradi. Uni berilmasa, faqat raw command ko'rinadi, maqsad yo'qoladi, ayniqsa avtomatlashtirilgan skill yaratish yoki ko'p qadamli ishlarda.

## Simptom (aynan shu)
Tool chaqiruv loglarida yoki terminal history da faqat buyruq matni bor, "nima uchun" yo'q. Masalan, git clone yoki cat qilishda description bo'sh. Keyin qayta ko'rib chiqishda qaysi qadam nima qilganini eslash qiyin. Parallel yoki ko'p tool chaqiruvlarida aralashib ketadi.

## Sabab (100%)
Bash tool schema sida description majburiy yoki tavsiya etilgan maydon bo'lib, u tool natijasida va loglarda saqlanadi. Agent uni ixtiyoriy deb o'ylab o'tkazib yuboradi yoki qisqa qilib qo'ymaydi. Bu context va audit uchun muhim metadata.

## Tasdiqlash
Tool chaqiruv kodida yoki logda bash(...) chaqiruvlarini qara. description: "..." bo'lmasa yoki bo'sh bo'lsa — bu holat. Bir nechta ketma-ket chaqiruvlarda description yo'qligini tekshir.

## Tuzatish (aynan shu)
Har bir bash tool chaqiruviga aniq, qisqa description ber:

```javascript
// Noto'g'ri
bash(command="git clone https://... /tmp/repo")

// To'g'ri
bash(command="git clone https://... /tmp/repo", description="Clone the skills repository to temporary directory for new skill creation")
```

Description 1 jumla bo'lsin: nima qiladi va nima uchun. Uzun bo'lmasin, lekin ma'noli.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Bash tool chaqiruvlarida doim description parametrini to'ldirish kerak. Bu loglarni tushunarli qiladi, keyingi debug yoki hisobot uchun foydali va tool foydalanish qoidalariga amal qilishni ta'minlaydi.
