---
name: agent-created-excessively-long-skill-markdown
description: Agent yangi skill yaratganda SKILL.md yoki .md faylni juda uzun, keraksiz misollar, takroriy bo'limlar yoki umumiy maslahatlar bilan to'ldiradi — natijada qidiruv va o'qish samaradorligi pasayadi, architecture.md dagi "juda tor va bitta nuqtaga qaratilgan" qoidasini buzadi.
---

# Skill markdown faylini haddan tashqari uzun va fokusdan chiqqan holda yaratish

## Nima uchun bu skill kerak
architecture.md qoidasiga ko'ra skill'lar juda tor, bitta aniq simptom, bitta sabab, bitta tuzatish bo'lishi shart. Umumiy "yaxshi amaliyot" maslahatlari yozilmaydi. Uzun fayllar search_skills orqali topilganda context'ni ifloslantiradi va agent bir o'qishda tushunmaydi.

## Simptom (aynan shu)
- Yangi skill .md fayli 150+ qator, 3+ kod bloki, takroriy tushuntirishlar yoki qo'shimcha bo'limlar (masalan "Qo'shimcha maslahatlar", "Boshqa misollar") bilan yaratilgan.
- Frontmatter description 2 jumladan uzun yoki umumiy.
- Tuzatish bo'limida bitta aniq tuzatish o'rniga bir nechta variantlar yoki uzun hikoya bor.
- Xulosa bo'limi 5+ bullet bilan cho'zilgan.

## Sabab (100%)
Agent architecture.md dagi "bitta aniq" talabini o'qigan, lekin to'liq amal qilmay, "yaxshiroq bo'lishi uchun" qo'shimcha ma'lumot, misollar yoki kontekst qo'shadi. Yoki o'xshash mavjud skill'larni nusxa qilib kengaytiradi.

## Tasdiqlash
1. Skill faylini ochib qatorlar sonini tekshir (wc -l yoki read).
2. Bo'limlar faqat majburiy 6 ta (Nima uchun, Simptom, Sabab, Tasdiqlash, Tuzatish, Xulosa) mi?
3. Tuzatishda bitta aniq kod misoli bormi, yoki bir nechtasi?
4. search_skills bilan query qilganda description mos keladimi, lekin matn haddan tashqari uzunmi?

## Tuzatish (aynan shu)
Skill yaratishdan oldin architecture.md formatini qayta o'qi. Faqat quyidagilarni yoz:

- Frontmatter: name (kebab), description (1-2 jumla, simptom kalit so'zlari bilan).
- 6 majburiy bo'lim, har biri 3-8 qator.
- Tuzatishda bitta aniq kod/misol bloki.
- Xulosa: 3-4 bullet, nima o'rgandingiz.

Misol qisqa tuzatish:
```md
## Tuzatish (aynan shu)
Skill faylini 100 qatordan oshirmasdan yoz. Keraksiz bo'limlarni olib tashla.
Faqat bitta aniq tuzatish ko'rsat.
```

Yangi skillni yaratgandan keyin `wc -l skills/.../yangi.md` bilan uzunligini tekshir. 120 qatordan oshsa qisqartir.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Skill'lar tor va fokuslangan bo'lishi shart — uzun umumiy matn search va context uchun zararli.
- Faqat architecture.md dagi majburiy 6 bo'lim + qisqa frontmatter.
- Tuzatishda bitta aniq misol yetarli, qo'shimcha "yaxshilash" kerak emas.
- Yaratgandan keyin uzunlikni tekshir va qisqartir.
