---
name: agent-did-not-set-git-config-user-email-and-name-before-commit
description: Agent skill repo'da commit qilishdan oldin git config user.email va user.name ni belgilamaydi, natijada default yoki anonim author bilan commit tushadi va hisobotda noto'g'ri ko'rinadi.
---

# Skill qo'shishda git config user.email va user.name o'rnatilmadi

## Nima uchun bu skill kerak
Vazifa qoidalarida commitdan oldin aniq `git config user.email "automation@local"` va `git config user.name "Skill Generator"` qilish kerak. Buni qilmaslik commit authorini noto'g'ri qiladi, history'ni ifloslaydi va keyingi tekshiruvlarda chalkashlik keltiradi.

## Simptom (aynan shu)
- `git commit` bajarilgan.
- `git log -1` da author "root" yoki bo'sh yoki boshqa default qiymat.
- Hisobotda commit hash berilgan, lekin author Skill Generator emas.
- Keyingi push'da GitHub'da noto'g'ri author ko'rinadi.

## Sabab (100%)
Agent vazifadagi 8-qadamni o'tkazib yuborgan: "git config user.email "automation@local"; git config user.name "Skill Generator"". Faqat add va commit qilgan.

## Tasdiqlash
1. Commitdan oldin `git config user.email` va `git config user.name` chiqishi tekshirilganmi?
2. Ular "automation@local" va "Skill Generator" ga tengmi?
3. `git log -1 --pretty=format:"%an <%ae>"` da to'g'ri author bormi?

## Tuzatish (aynan shu)
Commitdan oldin majburiy:

```bash
cd /tmp/skills-repo
git config user.email "automation@local"
git config user.name "Skill Generator"
# Tekshir
git config user.email
git config user.name
```

Keyin `git add . && git commit -m "Add new skill: [skill-name] - [qisqa tavsif]"`.

Agar allaqachon noto'g'ri commit qilingan bo'lsa, `git commit --amend --author="Skill Generator <automation@local>"` qil (lekin pushdan oldin).

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Har safar skill repo'da commit qilishdan oldin git config user.email va user.name ni aniq belgilab, tekshir. Bu commit authorini to'g'ri saqlaydi va vazifa talabiga 100% amal qiladi.
