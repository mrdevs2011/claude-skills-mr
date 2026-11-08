---
name: agent-failed-to-create-or-update-dotenv-gitignore
description: "Agent skill yaratish va push qilish jarayonida .gitignore va .env fayllarni tekshirmadi, yaratmadi yoki yangilamadi. Skill repo setupda ishlatiladi."
---

# Agent .gitignore va .env ni skill yaratish oldidan tekshirmadi

## Nima uchun bu skill kerak
Skill generatsiya qoidalarida (instruction.md) har safar .gitignore va .env mavjudligini tekshirish, yo'q bo'lsa yaratish majburiy. Bu qilinmasa, .env commit qilinishi yoki keraksiz fayllar push qilinishi mumkin.

## Simptom (aynan shu)
Skill yaratish workflow'ida git status yoki push oldidan .gitignore yoki .env yo'q, yoki ular bo'sh/noto'g'ri. Natijada .env remote'ga ketadi yoki log fayllar kiritiladi.

## Sabab (100%)
Agent qoidalardagi "Agar .gitignore yo'q bo'lsa yarat" va "Agar .env yo'q bo'lsa yarat" qadamlarini o'tkazib yubordi yoki mavjudligini tekshirmadi. Faqat skill faylini qo'shib, setup fayllarni e'tiborsiz qoldirdi.

## Tasdiqlash
1. Repo rootida `ls -la .gitignore .env` qiling.
2. Agar yo'q bo'lsa yoki .gitignore da `.env` qatori yo'q bo'lsa — bu skill kerak.
3. `git status` da .env ko'rinsa — darhol tuzatish.

## Tuzatish (aynan shu)
Repo rootida quyidagilarni bajaring:

```bash
# .gitignore
if [ ! -f .gitignore ]; then
  printf '.env\n*.log\n__pycache__/\n.DS_Store\nnode_modules/\n' > .gitignore
fi

# .env (bo'sh misol)
if [ ! -f .env ]; then
  printf '# Skill environment variables\n# Example: API_KEY=your_key_here\n' > .env
fi

# Tekshir
ls -la .gitignore .env
cat .gitignore
```

Keyin `git add .gitignore` ( .env ni add qilmang, u ignore'da).

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Skill push qilishdan oldin har doim .gitignore va .env ni tekshirish va kerak bo'lsa yaratish majburiy. Bu secret'larni va junk fayllarni commitdan himoya qiladi. Faqat skill.md ni qo'shib qo'yish yetarli emas.
