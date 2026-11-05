---
name: agent-used-cmc-or-other-repo-despite-explicit-instruction-to-only-push-to-claude-skills-mr
description: Agent chaqirgan tool yoki git operatsiyasi CMC yoki uploads repoga tegishli bo'lib, foydalanuvchi "CMC ishlatma, faqat mrdevs2011/claude-skills-mr" deb qat'iy buyruq berganda yuzaga keladi. Natijada noto'g'ri repo'ga push yoki ruxsat etilmagan connector ishlatiladi.
---

# AgentUsedCmcOrOtherRepoDespiteExplicitInstructionToOnlyPushToClaudeSkillsMr

## Nima uchun bu skill kerak
Foydalanuvchi skill generatsiya jarayonida aniq "CMC ishlatma. Faqat mrdevs2011/claude-skills-mr repo'siga push qil" deb yozganda, agent baribir CMC tool yoki boshqa remote/repo bilan ishlasa, xavfsizlik va aniq buyruq buziladi. Bu skill shu aniq holatni tutadi.

## Simptom (aynan shu)
- Tool call logida `cmc` , `uploads` yoki boshqa repo nomi ko'rinadi.
- Git push URL'si `mrdevs2011/claude-skills-mr` dan boshqa manzilga qaratilgan.
- Foydalanuvchi xabarda "CMC ishlatma" deb yozgan, lekin agent CMC bilan bog'liq tool chaqirgan.

## Sabab (100%)
Agent foydalanuvchi buyrug'idagi qat'iy cheklovni ("CMC ishlatma", "Uploads repo'siga umuman tegma") e'tibordan chetda qoldirib, odatdagi yoki parallel tool/workflow'ni ishga tushirgan. Context'da aniq taqiq bo'lishiga qaramay, umumiy agent odatiga yoki boshqa skill'ga ergashgan.

## Tasdiqlash
1. Foydalanuvchi so'rovida "CMC ishlatma" yoki "faqat ...claude-skills-mr" iborasi borligini tekshir.
2. Oxirgi tool call'lar va git remote'ni ko'rib chiq — CMC, uploads yoki boshqa remote bor-yo'qligini aniqlа.
3. Agar bor bo'lsa — bu skill mos.

## Tuzatish (aynan shu)
Faqat berilgan clone URL (token bilan) orqali `/tmp/skills-repo` ga clone qil, skillni `skills/` ostiga yoz, commit qil va `git push origin main` qil. Hech qanday CMC, uploads yoki boshqa connector/tool ishlatma.

```bash
# Faqat shu:
git clone https://x-access-token:${TOKEN}@github.com/mrdevs2011/claude-skills-mr.git /tmp/skills-repo
# ... skill yaratish ...
git push origin main
# Hech qachon: cmc_*, uploads, yoki boshqa remote
```

Agar CMC tool ko'rinsa — darhol to'xtа, faqat ruxsat etilgan yo'lni ishlat.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Foydalanuvchi "CMC ishlatma, faqat bitta aniq repo" deb yozganida, agent hech qanday boshqa remote, connector yoki CMC tool'ini chaqirmasligi shart. Faqat berilgan tokenli clone + push origin main. Bu qat'iy cheklovni buzish — to'g'ridan-to'g'ri buyruq buzilishi.
