---
name: added-skill-forgot-readme-update
description: Yangi skill fayl skills/ papkasiga qo'shildi, lekin architecture.md talab qilganidek README.md dagi struktura ro'yxati yangilanmadi — natijada hujjatlar eskiradi, yangi skill qidiruvda ko'rinadi lekin insonlar/README orqali topilmaydi.
---

# Yangi skill qo'shildi lekin README struktura ro'yxati yangilanmadi

## Nima uchun bu skill kerak
architecture.md aniq talab qiladi: yangi skill qo'shilganda `README.md` dagi struktura ro'yxatini yangilash. Agentlar ko'pincha faqat SKILL.md (yoki .md fayl) ni yaratib, commit qilib qo'yadi, lekin README ni yangilashni unutadi. Natijada README eskirgan qoladi, yangi skill'lar hujjatda ko'rinmaydi, keyingi agentlar yoki insonlar nima borligini bilmaydi.

## Simptom (aynan shu)
- Yangi skill fayl `skills/<kategoriya>/<LongDescriptiveName>.md` da yaratildi va git add/commit qilindi.
- README.md dagi skills/ struktura ro'yxati (yoki deploy qismidagi fayl ro'yxati) yangilanmadi — yangi fayl nomi yo'q.
- architecture.md dagi kategoriya ro'yxati yangi papka bo'lsa yangilanmadi.
- Skill `search_skills` orqali topiladi (chunki fayl bor), lekin README o'qiganda yo'qdek ko'rinadi.
- Keyingi "skill ro'yxati" so'rovida yoki deploy tekshiruvida yangi skill eslatilmaydi.

## Sabab (100%)
Agent architecture.md ni to'liq o'qimagan yoki "faqat fayl yaratish yetarli, search avtomatik ko'radi" deb faqat skill faylini qo'shgan. README yangilash qadamini o'tkazib yuborgan. Yoki README uzun bo'lgani uchun "kerak emas" deb hisoblagan.

## Tasdiqlash
- Yangi .md fayl skills/ ostida bor, lekin `grep -n "YangiSkillNomi" README.md` hech narsa qaytarmaydimi?
- architecture.md "README.md dagi struktura ro'yxatini yangila" deb yozilganmi? (ha)
- Commit faqat skill faylini o'z ichiga oladimi, README o'zgarmaganmi?
- Skill qidiruvda ishlaydi, lekin hujjatlar mos emasmi?

## Tuzatish (aynan shu)
Skill faylini yaratgandan keyin darhol README ni yangila:

1. architecture.md ni o'qi — "Yangi skill qo'shish tartibi" qadamlarini tekshir.
2. README.md dagi `skills/` struktura blokini top (odatda "skills/" dan boshlanadigan markdown code block).
3. Yangi fayl nomini to'g'ri kategoriya ostiga qo'sh (alfavit yoki mavjud tartibda).
4. Agar yangi papka yaratilgan bo'lsa, architecture.md dagi kategoriya ro'yxatini ham yangila.
5. Keyin git add skill.md README.md (va kerak bo'lsa architecture.md).

Misol (README ga qo'shish):
```markdown
  agent-workflows/
    AddedNewSkillFileButForgotToUpdateReadmeStructureList.md   # yangi skill README yangilanmagan
    AgentPreloadedEntireSkillsCatalogIntoContextInsteadOfQueryingSearchSkills.md
    ...
```

Tekshirish:
```bash
grep -q "AddedNewSkillFileButForgotToUpdateReadmeStructureList" README.md && echo "OK" || echo "README yangilanmagan"
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Yangi skill qo'shish faqat fayl yaratish emas. architecture.md majburiy qadam sifatida README.md (va yangi kategoriya bo'lsa architecture.md) struktura ro'yxatini yangilashni talab qiladi. Aks holda hujjatlar eskiradi va keyingi foydalanuvchilar/agentlar to'liq rasmni ko'rmaydi. Skill yaratishdan oldin va keyin ro'yxatni tekshir.
