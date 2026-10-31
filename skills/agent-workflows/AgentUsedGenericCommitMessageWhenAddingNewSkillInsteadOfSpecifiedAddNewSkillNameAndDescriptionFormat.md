---
name: generic-commit-message-for-new-skill
description: Git commit for a newly created skill used a generic message like "update" or "add skill" instead of the required "Add new skill: [skill-name] - [qisqa tavsif]" format.
---

# Generic commit message when adding new skill

## Nima uchun bu skill kerak
Skill yaratish jarayonida commit xabari aniq formatda bo'lishi shart: "Add new skill: [skill-name] - [qisqa tavsif]". Generic xabar (masalan "update skills", "add new file", "fix") keyinchalik tarixni kuzatishni, nima qo'shilganini tushunishni qiyinlashtiradi va avtomatlashtirish skriptlarini buzishi mumkin.

## Simptom (aynan shu)
- `git log --oneline` da oxirgi commit xabari "Add new skill: ..." bilan boshlanmaydi.
- Yoki xabar juda qisqa/umumiy: "update", "add skill", "new", "changes".
- Pushdan keyin historyda skill nomi va qisqa tavsif ko'rinmaydi.

## Sabab (100%)
Commit yaratayotganda `-m` bayrog'iga kerakli formatdagi xabar yozilmadi. Qo'llanmadagi qadam "git commit -m \"Add new skill: [skill-name] - [qisqa tavsif]\"" e'tiborsiz qoldirildi yoki shablon o'rniga o'z xabari ishlatildi.

## Tasdiqlash
1. `git log -1 --pretty=format:"%s"` ni ishga tushir.
2. Natija "Add new skill: " bilan boshlanadimi tekshir.
3. Skill nomi va qisqa tavsif mavjudmi ko'r.
4. Agar yo'q bo'lsa — bu aynan shu muammo.

## Tuzatish (aynan shu)
Commit xabarini to'g'ri formatda yoz:

```bash
git add .
git commit -m "Add new skill: generic-commit-message-for-new-skill - Generic xabar o'rniga aniq format ishlatilmagan"
```

Agar allaqachon commit qilingan bo'lsa va push qilinmagan bo'lsa:

```bash
git commit --amend -m "Add new skill: [skill-name] - [qisqa tavsif]"
```

Push qilingan bo'lsa — yangi commit bilan to'g'rilash yoki force-pushdan oldin ehtiyot bo'lish.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Yangi skill qo'shishda commit xabari majburiy ravishda "Add new skill: [name] - [tavsif]" formatida bo'lishi kerak.
- Bu historyni o'qishga oson qiladi va jarayon qoidalariga amal qilishni ta'minlaydi.
- Har doim commitdan oldin xabar formatini tekshir.
