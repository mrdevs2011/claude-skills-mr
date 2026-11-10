---
name: AgentDidNotMaskPersonalAccessTokenInAllGitCommandOutputsAndLogs
description: Agent tokenni git clone yoki push buyruqlarining chiqishida yoki loglarda yashirmadi, shu sababli maxfiy token ochiq qoldi.
---

# Agent tokenni barcha git buyruq chiqishlari va loglarda yashirmadi

## Nima uchun bu skill kerak
GitHub Personal Access Token (PAT) git clone URL ichida ishlatilganda, buyruq chiqishi yoki terminal logida token to'liq ko'rinishi mumkin. Bu xavfsizlik muammosi — token ochiq qolsa, repo'ga ruxsatsiz kirish mumkin. Skill agentni har doim chiqishni mask qilishga o'rgatadi.

## Simptom (aynan shu)
Git clone yoki push buyrug'i bajarilganda terminal chiqishida `github_pat_...` yoki to'liq token matni ko'rinadi, yoki log faylida saqlanadi. Masalan: "Cloning into '...' from https://x-access-token:github_pat_11CDW...@github.com/..."

## Sabab (100%)
Agent git clone buyrug'ini bash orqali ishga tushirganda chiqishni filtrlash (sed yoki boshqa) qo'llamadi, yoki tokenni URL'dan chiqarib, lekin logda qoldirdi. Tokenni hech qachon chiqarishda yoki logda ko'rsatmaslik qoidasiga amal qilmadi.

## Tasdiqlash
1. Buyruqni ishga tushirgandan keyin chiqish matnini tekshir.
2. Tokenning biron qismi (github_pat_ bilan boshlanadigan) ko'rinmasa, to'g'ri.
3. Agar ko'rinsa, sed yoki shunga o'xshash bilan mask qilinganligini tekshir.

## Tuzatish (aynan shu)
Har doim git clone buyrug'ini ishga tushirayotganda chiqishni mask qil:

```bash
git clone https://x-access-token:TOKEN@github.com/user/repo.git /tmp/path 2>&1 | sed 's/github_pat_[^@]*@/TOKEN_HIDDEN@/g'
```

Yoki tokenni o'zgaruvchiga olib, echo qilmasdan ishlat. Pushdan oldin ham xuddi shunday. Hech qachon to'liq URL'ni logga yozma yoki javobda ko'rsatma.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Git buyruqlarida PAT ishlatilganda chiqishni har doim mask qilish shart. Tokenni hech qachon ochiq qoldirmaslik xavfsizlikning asosiy qoidasi.
