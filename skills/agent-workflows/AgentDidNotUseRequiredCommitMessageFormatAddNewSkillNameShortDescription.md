---
name: agent-did-not-use-required-commit-message-format-add-new-skill-name-short-description
description: Agent committed a new skill with a generic, incomplete, or wrong commit message instead of the exact required format "Add new skill: [skill-name] - [qisqa tavsif]".
---

# Agent Did Not Use Required Commit Message Format Add New Skill Name Short Description

## Nima uchun bu skill kerak
Skill yaratish va push qilish jarayonida aniq commit xabari formati talab qilinadi. Noto'g'ri yoki umumiy xabar (masalan "update", "add skill", "new file") git tarixini noaniq qiladi, keyingi qidiruv va hisobotda skill nomini va qisqa tavsifni topishni qiyinlashtiradi. Vazifa qadamlarida "git commit -m \"Add new skill: [skill-name] - [qisqa tavsif]\"" aniq ko'rsatilgan.

## Simptom (aynan shu)
- Yangi skill fayli qo'shilgan va commit qilingan.
- Commit xabari "Add new skill: skill-name - short description" formatida emas.
- Xabar "update skills", "add new file", "skill added", "fix", yoki faqat skill nomi bo'lishi mumkin.
- Keyingi `git log` da skillning aniq nomi va tavsifi yo'q.
- Hisobotda commit hash berilgan, lekin xabar formati tekshirilmagan.

## Sabab (100%)
Agent vazifa qadamlaridagi aniq commit xabari shablonini e'tiborsiz qoldirdi yoki umumiy xabar ishlatdi. instruction.md va architecture.md dagi qoidalarga amal qilinmadi, shuningdek o'qilgan qo'llanmalar hisobotida ko'rsatilmagan.

## Tasdiqlash
- `git log -1 --pretty=format:"%s"` chiqishini tekshir.
- Xabar aynan "Add new skill: " bilan boshlanadimi?
- Skill nomi (kebab-case yoki uzun descriptive) va qisqa tavsif (1-2 jumla) mavjudmi?
- Agar yo'q bo'lsa — noto'g'ri format.

## Tuzatish (aynan shu)
Commit qilishdan oldin xabarni aniq yoz:

```bash
git add .
git commit -m "Add new skill: AgentDidNotUseRequiredCommitMessageFormatAddNewSkillNameShortDescription - Agent committed new skill with wrong message format instead of required Add new skill: name - description"
```

Agar allaqachon noto'g'ri commit qilingan bo'lsa (push qilinmagan):

```bash
git commit --amend -m "Add new skill: [to'liq-fayl-nomi-siz-.md] - [qisqa aniq tavsif]"
```

Pushdan oldin `git log -1` bilan tekshir. Token yoki maxfiy ma'lumotni xabarga qo'yma.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Har doim skill qo'shishda commit xabarini aynan "Add new skill: [skill-name] - [qisqa tavsif]" formatida yoz. Bu git tarixini tushunarli qiladi va vazifa talabiga 100% mos keladi. Generic xabarlar ishlatma.
