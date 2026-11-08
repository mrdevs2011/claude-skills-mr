---
name: agent-used-web-search-for-local-content
description: Agent lokal ish papkasi, klon qilingan repo yoki mavjud fayllardagi ma'lumotni topish uchun web_search ishlatdi — read_file, ls yoki bash orqali lokal tekshirish o'rniga.
---

# Lokal mavjud ma'lumotni web_search orqali qidirish

## Nima uchun bu skill kerak
Agentlar ba'zida allaqachon lokalda (working directory, /tmp/skills-repo, artifacts, klon qilingan repo) mavjud bo'lgan qo'llanmalar, skill fayllari, kod yoki hujjatlarni web_search bilan qidirishadi. Bu vaqtni isrof qiladi, noto'g'ri yoki eskirgan natijalar beradi, va lokal kontekstni e'tiborsiz qoldiradi.

## Simptom (aynan shu)
- So'rov lokal fayl, repo strukturasi, architecture.md, instruction.md yoki mavjud skill haqida.
- Agent darhol web_search yoki open_page chaqiradi.
- Lokal `read_file`, `ls`, `find` yoki `bash` bilan tekshirmagan.
- Natija umumiy internet ma'lumoti, lokal hujjatning aniq matni emas.

## Sabab (100%)
Agent "bu ma'lumot internetda bor" deb taxmin qiladi yoki lokal fayllarni birinchi navbatda tekshirish odatini yo'qotadi. Tool tanlashda eng yaqin va ishonchli manba (lokal fayl) o'rniga tashqi qidiruvni tanlaydi.

## Tasdiqlash
1. So'ralgan ma'lumot lokal fayl yoki klon qilingan repoda bormi?
2. Agent avval `read_file`, `ls -R`, `find`, yoki `cat` ishlatdimi?
3. Agar to'g'ridan-to'g'ri web_search ishlatgan bo'lsa — bu holat.
4. Lokal manba aniqroq va tezroq ekanini tekshirish mumkinmi? (ha)

## Tuzatish (aynan shu)
Lokal ma'lumot uchun har doim avval lokal toollarni ishlat:

1. Avval papka tuzilmasini ko'r: `ls -la` yoki `find . -name "*.md"`.
2. Aniq faylni o'qi: `read_file` tool (limit va offset bilan katta fayllar uchun).
3. Qidirish kerak bo'lsa: `grep` yoki bash `grep -r "keyword" .`.
4. Faqat lokalda topilmasa yoki tashqi/hozirgi voqea bo'lsa web_search ishlat.
5. Misol:
   - Noto'g'ri: web_search("how to write skill in architecture.md")
   - To'g'ri: read_file("/tmp/skills-repo/architecture.md")
6. Har bir tool chaqirishdan oldin: "Bu lokalda bormi?" deb o'zingni so'ra.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Lokalda mavjud bo'lgan fayl, qo'llanma yoki kodni web_search bilan qidirish isrof va xato manba. Avval read_file, ls, find ishlat. Tashqi qidiruvni faqat lokalda yo'q bo'lsa qo'lla. Bu tezroq, aniqroq va kontekstga mos natija beradi.
