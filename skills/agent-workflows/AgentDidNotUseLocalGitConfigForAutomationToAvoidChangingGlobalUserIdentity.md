---
name: agent-did-not-use-local-git-config-for-automation
description: Automation skriptida git config user.email va user.name ni local (repo ichida) o'rnatmasdan global o'zgartirishi — boshqa loyihalarga ta'sir qiladi, noto'g'ri commit author.
---

# Automationda git user identity ni local o'rnatmasdan global o'zgartirish

## Nima uchun bu skill kerak
Git commit qilishdan oldin `git config user.email` va `git config user.name` chaqirilganda, agar `--local` yoki repo ichida bo'lmasa, global config o'zgaradi. Bu boshqa loyihalarda noto'g'ri author bilan commit qilishga olib keladi, maxfiylik yoki ish oqimini buzadi. Skill generator kabi avtomatik jarayonlarda faqat shu repo uchun local sozlash kerak.

## Simptom (aynan shu)
- Avtomatik skill yaratish yoki commit qilish jarayonida `git config user.email "..."` va `git config user.name "..."` ishlatilgan.
- Buyruq `cd` qilingan repo ichida, lekin `git config --local` ishlatilmagan yoki `git config --global` aniq yozilgan.
- Natijada global `~/.gitconfig` o'zgargan, boshqa klonlangan repolarda ham shu nom/email ishlatiladi.
- Commit logda kutilmagan author ko'rinadi.

## Sabab (100%)
Agent yoki skript "tezda config qilay" deb o'ylaydi va default global configni o'zgartiradi. Local scope (faqat joriy repo) ni e'tiborsiz qoldiradi. Automationda bir martalik sozlash global ta'sir qilmasligi kerak.

## Tasdiqlash
1. Buyruq `git config user.email` yoki `user.name` bo'lganmi?
2. `--local` flagi bor-mi? Yoki ishchi papka repo ichida va `git config` (local default) ishlatilganmi?
3. `git config --global --get user.email` oldin va keyin farq qiladimi?
4. Faqat shu clone uchun kerakmi (ha bo'lsa — local bo'lishi shart)?

## Tuzatish (aynan shu)
Har doim local config ishlat:

```bash
cd /tmp/skills-repo
git config --local user.email "automation@local"
git config --local user.name "Skill Generator"
```

Yoki qisqacha (repo ichida bo'lsa `--local` default):

```bash
cd /tmp/skills-repo
git config user.email "automation@local"
git config user.name "Skill Generator"
```

Hech qachon `--global` ishlatma automation skriptida. Keyin `git config --local --list | grep user` bilan tasdiqla.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Automationda git identity ni faqat local sozla. Bu global configni o'zgartirmaydi, boshqa loyihalarga ta'sir qilmaydi va commit author aniq bo'ladi. `--local` yoki repo ichida default local ishlat.
