---
name: agent-skipped-checking-or-creating-gitignore-and-env-before-skill-add
description: Agent cloned the skills repo and added a new skill but skipped verifying or creating .gitignore and .env as required by the automation steps, risking committing secrets or missing standard ignores.
---

# Agent Skipped Checking Or Creating Gitignore And Env Files Before Adding New Skill

## Nima uchun bu skill kerak
Har soatlik skill generator vazifasida aniq qadamlar bor: clone qilgandan keyin .gitignore va .env mavjudligini tekshir, yo'q bo'lsa yarat. Agar bu o'tkazib yuborilsa, .env commit qilinishi mumkin (secret leak) yoki keraksiz fayllar (log, pycache) remote'ga tushadi. Bu repo xavfsizligi va tozaligi uchun muhim.

## Simptom (aynan shu)
- Skill generator `/tmp/skills-repo` ga clone qildi.
- Yangi skill .md faylini skills/ ostiga qo'shdi.
- Lekin .gitignore yoki .env fayllari mavjudligini tekshirmagan yoki yaratmagan.
- Natijada git statusda .env yoki __pycache__ kabi fayllar staged bo'lishi mumkin, yoki ignore qoidasi yo'q.
- Hisobotda faqat skill nomi va commit haqida gapirilgan, tekshiruv qadamlarisiz.

## Sabab (100%)
Agent vazifa qadamlaridagi 3 va 4-bandlarni (gitignore va .env yaratish/tekshirish) e'tiborsiz qoldirdi. "Har safar tekshir, kerak bo'lsa yangila" deyilganiga qaramay, faqat skill yaratishga o'tdi. Architecture va instruction.md da aniq tartib bor, lekin o'qib amal qilinmadi.

## Tasdiqlash
- `ls -la /tmp/skills-repo/.gitignore /tmp/skills-repo/.env` chiqishida fayllar bormi?
- .gitignore ichida `.env`, `*.log`, `__pycache__/`, `.DS_Store`, `node_modules/` bor-mi?
- `git status` da .env yoki ignore qilinishi kerak bo'lgan fayllar staged emasmi?
- Skill qo'shishdan oldin bu tekshiruv bajarilganmi?

## Tuzatish (aynan shu)
Clone dan keyin darhol:

```bash
cd /tmp/skills-repo
if [ ! -f .gitignore ]; then
  echo -e '.env\n*.log\n__pycache__/\n.DS_Store\nnode_modules/' > .gitignore
fi
if [ ! -f .env ]; then
  echo '# Skill environment variables\n# Example: API_KEY=your_key_here' > .env
fi
# Tekshir va yangila agar kerak
cat .gitignore
# Keyin skill qo'sh, git add, commit
```

Har doim bu ikki faylni tekshir, yo'q bo'lsa yarat, mavjud bo'lsa kerakli qatorlar borligini tasdiqla. Keyin faqat skillni add qil.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Skill generator avtomatik ishga tushganda .gitignore va .env ni har safar tekshirib, yo'q bo'lsa yaratish majburiy. Bu secret'larni va keraksiz fayllarni commit qilishdan saqlaydi. Qadamlarni o'tkazib yubormasdan aniq tartibda bajar.
