---
name: agent-used-websearch-for-skill-architecture-format-instead-of-reading-cloned-repo-architecture-md
description: Agent skill yozish formatini (frontmatter, bo'limlar, fayl nomi) web search orqali qidiradi, lekin clone qilingan repo ichidagi architecture.md, instruction.md va style.md ni o'qimaydi; natijada noto'g'ri formatdagi skill yaratiladi.
---

# Skill formatini web search bilan qidirish o'rniga lokal architecture.md o'qish

## Nima uchun bu skill kerak
Repo ichida aniq, majburiy format bor (architecture.md). Web search eski, umumiy yoki boshqa tizimlarning qoidalarini qaytarishi mumkin. Lokal fayllarni o'qimasdan skill yaratish arxitekturaga zid natija beradi va keyinchalik tuzatish talab qiladi.

## Simptom (aynan shu)
Agent yangi skill yaratishdan oldin `web_search` chaqirib "claude skill format" yoki "skill.md structure" qidiradi. Clone qilingan `/tmp/skills-repo/architecture.md` (yoki instruction.md, style.md) hech qachon o'qilmaydi yoki faqat qisman o'qiladi. Natijada skill fayli noto'g'ri nom, noto'g'ri frontmatter yoki yetishmayotgan bo'limlar bilan yoziladi.

## Sabab (100%)
Agent lokal kontekstda allaqachon mavjud bo'lgan aniq yo'riqnomani e'tiborsiz qoldiradi va tashqi qidiruvga ishonadi. Tool chaqiruv tartibida "avval mavjud hujjatni o'qi" qoidasi buziladi. Truncated output yoki default limit tufayli to'liq o'qilmagan deb hisoblanadi.

## Tasdiqlash
1. Tool chaqiruvlar tarixini tekshir: `web_search` skill format so'rovi bilan chaqirilganmi?
2. `read_file` yoki `cat`/`head` orqali `architecture.md` chaqirilganmi?
3. Yaratilgan skill faylida 6 ta majburiy bo'lim (Nima uchun, Simptom, Sabab, Tasdiqlash, Tuzatish, Xulosa) bormi va frontmatter to'g'rimi?

## Tuzatish (aynan shu)
Skill yaratishdan oldin majburiy ravishda lokal fayllarni to'liq o'qi:

```bash
# Avval to'liq o'qi (limit/offset ishlatib)
cat architecture.md
# yoki read_file limit=200 offset=1, keyin offset=201 va h.k.
```

Keyin formatga 100% amal qil. Web search faqat lokal hujjatda yo'q bo'lgan narsa uchun ishlatilsin. Agar output truncated bo'lsa, darhol davom etuvchi offset bilan qayta o'qi.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Skill yozish qoidalari clone qilingan repo ichidagi architecture.md, instruction.md va style.md da. Ularni to'liq o'qib, shu formatga amal qil. Web search lokal aniq yo'riqnoma o'rnini bosa olmaydi.
