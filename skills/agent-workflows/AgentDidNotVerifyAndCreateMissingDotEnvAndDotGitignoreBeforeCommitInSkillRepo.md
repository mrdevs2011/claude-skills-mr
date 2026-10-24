---
name: agent-did-not-verify-and-create-missing-dotenv-and-gitignore-before-commit-in-skill-repo
description: Skill repo clone qilingandan keyin .env va .gitignore fayllari mavjudligini tekshirmasdan yoki yaratmasdan git commit qilish. Qachon: yangi skill qo'shishdan oldin repo setup qadamlarida .env/.gitignore yo'qligi e'tiborsiz qoldiriladi.
---

# Agent skill repo'sida .env va .gitignore mavjudligini tekshirmasdan va yaratmasdan commit qildi

## Nima uchun bu skill kerak
Skill yaratish va push qilish jarayonida .env (environment variables uchun) va .gitignore (maxfiy fayllar, loglar, cache'larni commitdan chiqarish uchun) majburiy. Ularni tekshirmasdan commit qilish maxfiy ma'lumotlarning oshkor bo'lishiga yoki keraksiz fayllarning remote'ga tushishiga olib keladi. Agent har safar setupda ularni tasdiqlashi va kerak bo'lsa yaratishi/yangilashi kerak.

## Simptom (aynan shu)
- `ls -la` yoki `test -f .env` qilinganda .env yo'q.
- .gitignore yo'q yoki to'liq emas (.env, *.log, __pycache__/ va h.k. yo'q).
- Git status'da .env yoki log fayllari untracked/modified ko'rinadi.
- Commitdan keyin .env remote'ga tushgan yoki .gitignore yangilanmagan.

## Sabab (100%)
Agent clone'dan keyin faqat skill faylini qo'shishga o'tdi, .env va .gitignore mavjudligini `ls`, `test -f` yoki `cat` bilan tekshirmadi va kerak bo'lsa `echo ... > .env` / `.gitignore` bilan yaratmadi/yangilamadi. Setup qadamlari to'liq bajarilmadi.

## Tasdiqlash
1. `cd /tmp/skills-repo && ls -la .env .gitignore` — ikkalasi ham bormi?
2. `cat .gitignore` — `.env`, `*.log`, `__pycache__/`, `.DS_Store`, `node_modules/` borimi?
3. `git status` — .env tracked emasligi (gitignore'da) va keraksiz fayllar yo'qligi.
4. Agar yo'q bo'lsa, yaratish buyruqlari ishlatilganmi?

## Tuzatish (aynan shu)
Clone'dan keyin har doim:

```bash
cd /tmp/skills-repo
# .gitignore tekshir va yarat/yangila
if [ ! -f .gitignore ]; then
  echo -e '.env\n*.log\n__pycache__/\n.DS_Store\nnode_modules/' > .gitignore
else
  # kerakli qatorlar borligini tekshir, yo'q bo'lsa qo'sh
  grep -q '^\.env$' .gitignore || echo '.env' >> .gitignore
  # boshqa qatorlar uchun ham xuddi shunday
fi

# .env tekshir va yarat
if [ ! -f .env ]; then
  echo '# Skill environment variables
# Example: API_KEY=your_key_here' > .env
fi

# Keyin skill qo'sh, git add, commit
git status   # tekshir
git add .
git commit -m "..."
```

Har safar setupda shu tekshiruvni qil. .env hech qachon commit qilinmasin (gitignore'da bo'lishi shart).

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Skill repo setupida .env va .gitignore ni har safar tekshirish, yo'q bo'lsa yaratish yoki yangilash majburiy. Buni qilmasdan commit qilish maxfiy ma'lumotlarni oshkor qilishi yoki keraksiz fayllarni remote'ga tushirishiga olib keladi. Agent doim `ls`/`test` + conditional create qilishi kerak.
