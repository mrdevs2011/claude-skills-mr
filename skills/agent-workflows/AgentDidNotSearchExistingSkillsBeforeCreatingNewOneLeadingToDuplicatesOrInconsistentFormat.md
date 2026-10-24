---
name: agent-did-not-search-existing-skills-before-creating-new
description: Yangi skill yaratishdan oldin mavjud skills/ papkasidagi fayllarni qidirilmagan yoki o'qilmagan — natijada takroriy yoki formatga mos kelmaydigan skill paydo bo'ladi.
---

# Mavjud skilllarni qidirmasdan yangi skill yaratish

## Nima uchun bu skill kerak
Agent yangi skill yozishga shoshiladi va skills/ ichidagi mavjud .md fayllarni (yoki search_skills orqali) tekshirmaydi. Bu bir xil simptomga ega takroriy skillar, yoki architecture.md dagi majburiy formatga (YAML frontmatter, aniq bo'limlar) mos kelmaydigan fayllar yaratilishiga olib keladi. Keyinchalik search_skills ishlamaydi yoki chalkashlik bo'ladi.

## Simptom (aynan shu)
- Yangi skill qo'shilgandan keyin bir xil mavzudagi ikki yoki undan ortiq skill topiladi.
- SKILL.md yoki .md faylda YAML frontmatter (`name:` va `description:`) yo'q.
- Bo'limlar architecture.md dagi shablonga mos emas (Simptom, Sabab, Tasdiqlash, Tuzatish, Xulosa yo'q).
- Nomlash kebab-case yoki aniq simptomni bildirmaydi.
- README.md yoki architecture.md dagi ro'yxat yangilanmagan (agar kategoriya yangi bo'lsa).

## Sabab (100%)
Agent "yangi skill yarat" buyrug'ini olganda darhol yozishni boshlaydi. Mavjud katalogni `find skills -name "*.md"`, `grep`, yoki `search_skills` bilan tekshirishni unutadi. Formatni architecture.md va instruction.md dan o'qishni ham o'tkazib yuboradi.

## Tasdiqlash
1. Yangi skill yaratishdan oldin: `cd /tmp/skills-repo && find skills -type f -name "*.md" | xargs grep -l "qidirilayotgan simptom yoki kalit so'z"` yoki oddiy `ls skills/**/*.md`.
2. Mavjud skillning frontmatter va bo'limlarini o'qib solishtir.
3. architecture.md dagi "Fayl formati" bo'limini qayta o'qi.
4. Agar takror topilsa — yangi yaratma, mavjudini yaxshila yoki boshqa tor simptom tanla.

## Tuzatish (aynan shu)
Skill yaratishdan oldin majburiy qadamlar:

```bash
# 1. Mavjud skilllarni ko'r
cd /tmp/skills-repo
find skills -type f -name "*.md" | head -50
# Yoki aniq kalit so'z bilan:
grep -r "frontmatter\|hardcoded\|await" skills/ --include="*.md" | head -10

# 2. architecture.md formatini o'qi
head -100 architecture.md

# 3. Agar o'xshash skill bo'lsa — yangisini yaratma
# Faqat aniq yangi, takrorlanmaydigan simptom bo'lsa davom et
```

Keyin faylni quyidagi shablonda yoz:

```md
---
name: qisqa-kebab-case-id
description: 1-2 jumla — qachon kerak, aniq simptom.
---

# Sarlavha

## Nima uchun bu skill kerak
...

## Simptom (aynan shu)
...

## Sabab (100%)
...

## Tasdiqlash
...

## Tuzatish (aynan shu)
... (kod misoli bilan)

## Xulosa — bu skillni o'qib nimani bilib oldingiz
...
```

Faylni `skills/<kategoriya>/<AniqNom>.md` ga qo'y. Kategoriya yangi bo'lsa architecture.md va README ni yangila.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Yangi skill yaratishdan oldin har doim mavjud skills/ ni qidir va o'qi.
- Formatni architecture.md ga 100% moslashtir (YAML + majburiy bo'limlar).
- Takroriy skill yaratma — tor, yangi simptom tanla.
