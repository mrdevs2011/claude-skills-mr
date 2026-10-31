---
name: agent-pushed-without-verifying-remote-url-matches-claude-skills-mr
description: Agent git push qilishdan oldin `git remote -v` bilan origin URL ni tekshirmasdan push qildi — noto'g'ri repo'ga (uploads yoki boshqa) o'zgarishlar ketishi mumkin.
---

# Agent pushdan oldin remote URL ni tekshirmasdan o'zgarishlarni yubordi

## Nima uchun bu skill kerak
Vazifa aniq "faqat mrdevs2011/claude-skills-mr repo'siga push qil, uploads'ga tegma" deb belgilangan bo'lsa, agent baribir remote ni tekshirmasdan push qilishi mumkin. Clone qilingan URL token bilan bo'lsa ham, keyinchalik remote o'zgarishi yoki noto'g'ri clone bo'lishi xavfi bor. Tekshirish oldini oladi.

## Simptom (aynan shu)
- `git push origin main` chaqirilgan, lekin oldin `git remote -v` yoki `git config --get remote.origin.url` chiqarilmagan.
- Hisobotda "push muvaffaqiyatli" deb yozilgan, lekin qaysi repo ekanligi tasdiqlanmagan.
- Foydalanuvchi "faqat claude-skills-mr" deb aytgan, lekin agent boshqa remote bo'lishi mumkinligini tekshirmagan.
- Pushdan keyin `git log origin/main` yoki status bilan remote commit tasdiqlanmagan.

## Sabab (100%)
Agent clone qilganidan keyin remote to'g'ri deb taxmin qiladi va qo'shimcha tekshiruvni "ortiqcha" deb o'tkazib yuboradi. Token URL ichida bo'lgani uchun "ishlaydi" deb o'ylaydi, lekin aniq origin ni ko'rsatmaydi.

## Tasdiqlash
1. Pushdan oldin terminalda `git remote -v` chiqdimi? Chiqishi kerak va `mrdevs2011/claude-skills-mr` ni ko'rsatishi kerak.
2. Agar URL token bilan bo'lsa, logda to'liq token chiqmasligiga ishonch hosil qil (mask qil).
3. Pushdan keyin `git status` yoki `git log --oneline -1 origin/main` bilan remote yangilanganini tasdiqla.
4. Agar remote boshqa bo'lsa — to'xtat, xato ayt.

## Tuzatish (aynan shu)
Pushdan oldin doim remote ni tekshir:

```bash
# Noto'g'ri:
git add . && git commit -m "..." && git push origin main

# To'g'ri:
git remote -v | grep -E 'claude-skills-mr' || { echo "XATO: remote noto'g'ri"; exit 1; }
git add .
git commit -m "Add new skill: skill-name - qisqa tavsif"
git push origin main
# Keyin hash olish uchun:
git rev-parse HEAD
```

Agar remote noto'g'ri bo'lsa, `git remote set-url origin <to'g'ri-url>` bilan tuzat (tokenni logga chiqarma).

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Har qanday pushdan oldin `git remote -v` bilan origin aniq claude-skills-mr ekanini tasdiqla.
- Taxmin qilma — tekshir. Noto'g'ri repo'ga push qilish qat'iyan taqiqlangan.
- Tokenni hech qachon chiqishda ko'rsatma.
