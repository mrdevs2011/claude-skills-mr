---
name: agent-placed-skill-in-wrong-category
description: Yangi skill yaratilganda noto'g'ri kategoriya papkasiga qo'yilgan — to'g'ri papkaga joylashtirish yoki yangi papka yaratish kerak bo'lganda.
---

# Yangi skillni noto'g'ri kategoriya papkasiga qo'yish

## Nima uchun bu skill kerak

`search_skills` skill'larni kategoriya papkalari bo'yicha indeks qiladi. Noto'g'ri joylashtirish skillni topishni qiyinlashtiradi va tuzilmani buzadi. architecture.md qoidalariga amal qilish majburiy.

## Simptom (aynan shu)

Yangi skill `.md` fayli `skills/` ildizida qolgan, yoki mavzuga mos kelmaydigan papkada (masalan productivity skill coding/patterns/ da), yoki yangi kategoriya kerak bo'lganda papka yaratilmagan va architecture.md yangilanmagan.

## Sabab (100%)

Agent `architecture.md` dagi "Kategoriya (papka) qoidasi" bo'limini o'qimagan yoki e'tiborsiz qoldirgan: 1) mavjud kategoriyaga mos kelsa o'sha papkaga, 2) mos kategoriya yo'q bo'lsa yangi papka yaratiladi, 3) meta-qoidalar coding/ ildizida.

## Tasdiqlash

```bash
cd /tmp/skills-repo
find skills -name "*NewSkillName*.md"
# va architecture.md dagi kategoriya ro'yxati bilan solishtirish
```

Agar fayl noto'g'ri joyda bo'lsa — bu skill kerak.

## Tuzatish (aynan shu)

1. Skill mavzusini aniqlang (coding patterns → coding/patterns/, agent workflows → agent-workflows/, productivity → productivity/, debugging simptomlari → tegishli coding/ subfolder).

2. Mavjud papkaga mos kelsa ko'chiring:
```bash
mv skills/WrongLocation/SkillName.md skills/agent-workflows/
```

3. Agar yangi kategoriya kerak bo'lsa:
```bash
mkdir -p skills/new-category-name
mv skills/SkillName.md skills/new-category-name/
# keyin architecture.md dagi kategoriya ro'yxatini yangilang
```

4. README.md dagi struktura ro'yxatini ham yangilang.

## Xulosa — bu skillni o'qib nimani bilib oldingiz

Yangi skill yaratishdan oldin architecture.md ni o'qib, to'g'ri kategoriya tanlash yoki yangi papka yaratish + ro'yxatlarni yangilash kerak. Bu searchability va tartibni saqlaydi.
