---
name: agent-did-not-ensure-env-and-gitignore-exist-before-commit
description: Agent clones a skills repository and adds a new skill without first verifying or creating .gitignore and .env files as required by the procedure, risking accidental secret commits or missing ignores.
---

# Agent did not ensure .env and .gitignore exist before committing new skill

## Nima uchun bu skill kerak
Skills repo'ga yangi skill qo'shishda .gitignore va .env mavjudligi majburiy tekshiriladi. Agar agent bu fayllarni yaratmasa yoki tekshirmasa, .env ichidagi secret'lar commit qilinishi mumkin yoki log/pycache fayllar repo'ga tushadi. Bu ayniqsa avtomatik skill generator vazifalarida aniq ko'rsatilgan qadam.

## Simptom (aynan shu)
- Clone qilingan repo'da `.gitignore` yo'q yoki to'liq emas, lekin agent to'g'ridan-to'g'ri skill qo'shib commit qiladi.
- `.env` fayli yo'q, lekin agent uni yaratmaydi.
- Keyinchalik `git status` da kutilmagan fayllar (masalan `__pycache__`, `.env` agar ignore bo'lmasa) ko'rinadi.
- Push qilingandan keyin secret yoki vaqtinchalik fayllar GitHub'da paydo bo'ladi.

## Sabab (100%)
Agent user bergan qat'iy qadamlarni to'liq bajarmaydi: `.gitignore` va `.env` ni har safar tekshirib, yo'q bo'lsa yaratishni unutadi. To'g'ridan-to'g'ri skill yozish va `git add .` qiladi, ignore qoidalari yo'qligi sababli ortiqcha fayllar qo'shiladi.

## Tasdiqlash
1. Clone'dan keyin `ls -la .gitignore .env` qilib mavjudligini tekshir.
2. `.gitignore` ichida `.env`, `*.log`, `__pycache__/`, `.DS_Store`, `node_modules/` bor-yo'qligini o'qi.
3. `git status` ni `git add` dan oldin ko'rib, faqat kutilgan fayllar staged ekanini tasdiqla.

## Tuzatish (aynan shu)
Clone qilgandan keyin, skill qo'shishdan oldin:

```bash
# .gitignore yo'q bo'lsa yarat
if [ ! -f .gitignore ]; then
  echo -e '.env\n*.log\n__pycache__/\n.DS_Store\nnode_modules/' > .gitignore
fi

# .env yo'q bo'lsa yarat
if [ ! -f .env ]; then
  echo '# Skill environment variables\n# Example: API_KEY=your_key_here' > .env
fi

# Keyin skill qo'sh, git config, add, commit, push
```

Har safar bu tekshiruvni bajaring, keyin yangi skill faylini yozing.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Yangi skill qo'shishdan oldin .gitignore va .env mavjudligini tekshirish va yo'q bo'lsa yaratish shart.
- Bu qadam secret'larning tasodifiy commit qilinishini va ortiqcha fayllarning repo'ga tushishini oldini oladi.
- User qat'iy qadamlarni (har safar tekshir) e'tiborsiz qoldirmaslik kerak.
