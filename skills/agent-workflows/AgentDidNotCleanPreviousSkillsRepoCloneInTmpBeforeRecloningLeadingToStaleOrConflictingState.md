---
name: agent-did-not-clean-previous-skills-repo-clone-in-tmp-before-recloning
description: Temporary skills-repo clone in /tmp was not removed before a new git clone, causing stale files, git errors, or mixed state from previous runs.
---

# Agent Did Not Clean Previous Skills Repo Clone In Tmp Before Recloning

## Nima uchun bu skill kerak
Skill generator yoki agent har soatda yoki har vazifada `/tmp/skills-repo` ni qayta clone qiladi. Agar oldingi papka o'chirilmasa, yangi clone xato beradi yoki eski holat aralashib ketadi.

## Simptom (aynan shu)
`git clone ... /tmp/skills-repo` buyrug'i "fatal: destination path '/tmp/skills-repo' already exists and is not an empty directory" xatosini beradi. Yoki clone muvaffaqiyatli ko'rinadi, lekin eski skill fayllari, eski commitlar yoki tozalanmagan o'zgarishlar yangi ish bilan aralashadi.

## Sabab (100%)
Agent `rm -rf /tmp/skills-repo` yoki ekvivalent tozalash qadamini bajarmagan. Oldingi ish sessiyasidan qolgan papka toza emas edi, va yangi clone ustiga yozish yoki bo'sh papkaga clone qilish mumkin emas.

## Tasdiqlash
- `ls -la /tmp/skills-repo` chiqishi mavjud va `.git` ichida eski remote yoki commitlar ko'rinadi.
- Clone buyrug'i exit code != 0 va "already exists" matnini o'z ichiga oladi.
- Yangi skill qo'shilgandan keyin `git status` da kutilmagan eski fayllar chiqadi.

## Tuzatish (aynan shu)
Clone qilishdan oldin majburiy tozalash:

```bash
rm -rf /tmp/skills-repo
git clone https://x-access-token:${TOKEN}@github.com/mrdevs2011/claude-skills-mr.git /tmp/skills-repo
```

Tokenni hech qachon logga yoki chiqishga chiqarma. Tozalashdan keyin `ls /tmp/skills-repo` bilan yangi clone toza ekanligini tasdiqla. Keyin `cd /tmp/skills-repo` va ishni davom ettir.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Har safar `/tmp/skills-repo` ni clone qilishdan oldin `rm -rf` bilan tozalash shart. Aks holda clone muvaffaqiyatsiz bo'ladi yoki eski holat yangi skill yaratishni buzadi. Bu qadamni hech qachon o'tkazib yuborma.
