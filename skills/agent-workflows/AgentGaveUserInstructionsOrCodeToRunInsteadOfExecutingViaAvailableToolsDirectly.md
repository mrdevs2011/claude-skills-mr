---
name: agent-gave-user-instructions-instead-of-executing-tools
description: Foydalanuvchi fayl yaratish, o'zgartirish, buyruq ishga tushirish yoki boshqa amal so'raganda agent o'zi tool orqali bajarmay, foydalanuvchiga kod/yo'riqnoma beradi va "o'zing ishga tushir" deydi.
---

# Agent foydalanuvchiga yo'riqnoma berdi, o'zi tool orqali bajarmadi

## Nima uchun bu skill kerak

Agentda `write_file`, `edit_file`, `bash`, `read_file` kabi to'g'ridan-to'g'ri amal qiladigan toollar bor. Foydalanuvchi "faylni yarat", "buyruqni ishga tushir", "o'zgartirishni qo'lla" deb so'raganda agent o'zi bajarishi kerak. Buning o'rniga kod bloklari va "quyidagini terminalda ishga tushiring" degan javob berish — foydalanuvchini ortiqcha ishga soladi, xato ehtimolini oshiradi va agentning asosiy vazifasini bajarilmagan qiladi.

## Simptom (aynan shu)

Foydalanuvchi aniq amal so'radi (masalan: "repo'ni clone qil", "SKILL.md yarat", "git commit qil", "faylni yangila"). Agent javobida:

- Markdown kod bloklari (` ```bash `, ` ```python `, ` ```md `) chiqaradi
- "Quyidagi buyruqni ishga tushiring", "O'zing yozib qo'y", "Terminalda buni yozing" kabi iboralar bor
- `write_file`, `bash`, `edit_file` yoki boshqa tegishli tool chaqirilmagan
- Amal bajarilgani haqida tasdiq yo'q, faqat yo'riqnoma

## Sabab (100%)

Agent "o'qitish/yo'l-yo'riq berish" rejimiga o'tib ketgan. U mavjud tool'larning mavjudligini e'tiborsiz qoldirdi yoki "foydalanuvchi o'zi bajarishi xavfsizroq" deb noto'g'ri taxmin qildi. Aslida so'rov aniq amalni talab qiladi va agentda shu amalni bajarish uchun tool bor — shuning uchun to'g'ridan-to'g'ri chaqirish kerak.

## Tasdiqlash

1. Foydalanuvchi so'rovini qayta o'qi — aniq "qil", "yarat", "push qil", "yoz" kabi amal so'zlarimi?
2. Javobingda tool chaqiruv (`bash`, `write_file` va h.k.) bormi yoki faqat matn + kod blokimi?
3. Agar tool chaqirilgan bo'lsa, uning natijasini (exit code, output) tekshirib, muvaffaqiyatli ekanini tasdiqladingmi?
4. Agar yo'riqnoma bergan bo'lsang — nima uchun tool ishlatilmadi? Xavf yoki noaniqlik bormi? (Agar yo'q bo'lsa, tool ishlatilishi kerak edi.)

## Tuzatish (aynan shu)

So'rovni qayta o'qi. Agar aniq amal so'ralgan bo'lsa va mos tool mavjud bo'lsa:

1. Avval kerakli kontekstni o'qi (`read_file` yoki `bash` bilan `ls`/`cat` agar kerak).
2. Amalni to'g'ridan-to'g'ri tool orqali bajar:
   - Fayl yaratish/yozish → `write_file`
   - O'zgartirish → `read_file` keyin `edit_file`
   - Buyruq (git, npm, python va h.k.) → `bash`
3. Tool natijasini tekshir (exit code 0, kutilgan output).
4. Foydalanuvchiga qisqa tasdiq ber: "Skill yaratildi va commit qilindi. Hash: abc123." — kod bloklari bilan "o'zing qil" emas.

Misol (noto'g'ri):

```
Quyidagi buyruqni ishga tushiring:
git add . && git commit -m "Add skill"
```

To'g'ri:

Tool chaqiruv: `bash` bilan `cd /tmp/skills-repo && git add . && git commit -m "..." && git push origin main`

Keyin natijani hisobotda ko'rsat.

## Xulosa — bu skillni o'qib nimani bilib oldingiz

Agar foydalanuvchi aniq amal so'rasa va sening tool'ing shuni bajarishga qodir bo'lsa — yo'riqnoma berma, o'zing bajar. Kod bloklari va "ishga tushiring" faqat tool mavjud bo'lmagan yoki xavfli holatda qabul qilinadi. To'g'ridan-to'g'ri tool chaqirish + natijani tasdiqlash — shu skillning asosiy qoidasi.
