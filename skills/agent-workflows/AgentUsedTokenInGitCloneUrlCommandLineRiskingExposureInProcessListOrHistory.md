---
name: agent-used-token-in-git-clone-url-command-line-risking-exposure
description: Agent git clone yoki remote set qilishda tokenni to'g'ridan-to'g'ri command line URL ichida ishlatganida, token process list, shell history yoki loglarda ochiq qolishi xavfi. Qachon: git operatsiyasida token URL'da ko'rinadi.
---

# Agent tokenni git clone URL command line ichida ishlatib, process list yoki history'da ochiq qoldirdi

## Nima uchun bu skill kerak
GitHub personal access token yoki boshqa secret'ni `git clone https://x-access-token:TOKEN@github.com/...` kabi command line'da berish xavfsizlik xatosi. Token `ps`, `/proc`, shell history, CI log yoki tool output'da ko'rinib qolishi mumkin. Agent bunday qilmasligi kerak.

## Simptom (aynan shu)
- `git clone` yoki `git remote add/set-url` buyrug'ida token to'g'ridan-to'g'ri URL ichida yozilgan.
- Tool call yoki bash command output/logida token matni ko'rinadi.
- Process list yoki history'da `github_pat_...` yoki shunga o'xshash secret bor.

## Sabab (100%)
Agent secret'ni environment variable, credential helper, GIT_ASKPASS yoki `.netrc` orqali berish o'rniga, to'g'ridan-to'g'ri command line argument sifatida URL'ga qo'shdi. Bu shell va process monitoring orqali oson ochiladi.

## Tasdiqlash
1. Ishlatilgan buyruqni tekshir: token `https://` dan keyin `:TOKEN@` shaklida bormi?
2. `ps aux | grep git` yoki ekvivalent bilan process'da token ko'rinadimi?
3. Tool natijasida yoki report'da token chiqdimi?

## Tuzatish (aynan shu)
Tokenni hech qachon command line'ga qo'yma. Buning o'rniga:

- Environment variable ishlat:
  ```bash
  export GITHUB_TOKEN="your_token_here"   # faqat session ichida, log qilma
  git clone "https://x-access-token:${GITHUB_TOKEN}@github.com/user/repo.git" /tmp/repo
  unset GITHUB_TOKEN
  ```
  Yoki yaxshiroq: `gh` CLI yoki credential helper.

- Credential helper sozla (tavsiya etiladi):
  ```bash
  git config --global credential.helper store   # yoki cache, manager
  # keyin oddiy clone, token bir marta so'raladi va saqlanadi
  git clone https://github.com/user/repo.git
  ```

- Agar majburiy URL kerak bo'lsa, tokenni hech qachon log qilma, va buyruqni ishga tushirgandan keyin history'dan o'chir (`history -c` yoki `HISTCONTROL=ignorespace`).

Har doim push/report'da tokenni mask qil yoki umuman chiqarma.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Git operatsiyalarida secret'ni command line URL ichiga qo'yish process list va history orqali ochiq qoldiradi. Buning o'rniga env var + unset, credential helper yoki `gh` ishlatib, tokenni hech qachon log yoki output'da ko'rsatmaslik kerak.
