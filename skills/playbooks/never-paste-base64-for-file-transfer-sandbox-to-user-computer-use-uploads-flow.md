---
name: never-paste-base64-for-file-transfer-sandbox-to-user-computer-use-uploads-flow
description: Sandbox va foydalanuvchi kompyuteri alohida; fayl o'tkazish uchun chatda base64 yozish taqiqlangan. Uploads repo oqimi ishlat. Triggers: base64 paste, cat << EOF base64 -d, file transfer sandbox to computer.
id: never-paste-base64-for-file-transfer-sandbox-to-user-computer-use-uploads-flow
type: playbook
stack: Grok sandbox bash + connected tools (get_upload_token, CMC run_command), GitHub uploads repo
confirmed_on: 2026-11-12
confidence: high (repo rules + size demo)
triggers:
  - base64 in chat for file transfer
  - paste base64 then cat <<EOF base64 -d
  - sandbox to user computer file move
  - never paste base64
  - uploads repo flow for transfer
  - get_upload_token then git push uploads
  - ~/.uploads-pull.sh
  - file transfer between sandbox and local
  - base64 too large for context
  - how to send file from sandbox to computer without base64
related:
  - agent-workflows/AgentPushedSkillOrFilesToUploadsRepoOrInvokedCmcDespiteStrictInstructionToOnlyTargetClaudeSkillsMrRepo.md
---

# Sandboxdan kompyuterga fayl o'tkazishda chatda base64 yozma — uploads oqimi ishlat

## TL;DR
Simptom: agent katta faylni sandboxdan foydalanuvchi kompyuteriga o'tkazish uchun base64 matnini chatga yozadi yoki `cat > fayl << EOF` + `base64 -d` buyrug'ini beradi.
Sabab: sandbox va local computer bir-birini ko'rmaydi; base64 chatga qo'yish taqiqlangan (context overflow, xavfsizlik).
Birinchi buyruq: get_upload_token chaqir (agar aniq so'ralgan bo'lsa), keyin bashda uploads clone + push.
Done: fayl uploadsda, keyin CMC `~/.uploads-pull.sh` bilan tortildi, base64 yo'q.

## Qachon ishlatish / ishlatmaslik
Ishlat: sandboxda yaratilgan zip/artifact/faylni foydalanuvchi kompyuteriga, mrdrive yoki loyiha repo'siga o'tkazish kerak bo'lganda.
Ishlatma: oddiy matn javob, kichik kod snippet (chatda to'g'ridan-to'g'ri), yoki foydalanuvchi aniq base64 so'ramagan. CMC yo'q bo'lsa push qilma.

## Mental model (nima uchun)
[REPO:instruction.md] Sandbox (bu remote container) va foydalanuvchi kompyuteri alohida — fayl tizimi umumiy emas. Base64 chatda yozish: 1) contextni to'ldiradi (1MB binary → 1.33MB text), 2) xavfsizlik (token o'xshash), 3) taqiqlangan. To'g'ri yo'l: `mrdevs2011/uploads` vaqtinchalik ko'prik, get_upload_token → git push → CMC `~/.uploads-pull.sh`. [SANDBOX] base64 size demo.

## Diagnosis tree (arzonidan qimmatiga)
1. So'rov fayl o'tkazishmi? "sandboxdan kompyuterga", "faylni yubor", "push qil" kabi.
   EXPECTED: ha. Agar oddiy kod — bu skill emas.
   Agar base64 yozishni o'ylayotgan bo'lsang — 2-qadam.

2. Hajmni tekshir: `ls -l fayl` yoki `wc -c`.
   EXPECTED: >100KB bo'lsa base64 yomon. [SANDBOX]

3. Uploads yo'li: get_upload_token tool chaqir → token ol (chatga chiqarma).
   EXPECTED: {"token": "github_pat_***"}. 401/403 = token failed, to'xta.

4. Bashda (bitta chaqiruvda):
   ```bash
   T='<token>'
   git clone -q "https://x-access-token:${T}@github.com/mrdevs2011/uploads.git" /tmp/uploads-repo
   cd /tmp/uploads-repo
   cp /path/to/file.zip .
   git config user.email "cmmgh@local"; git config user.name "CMMGH"
   git add file.zip && git commit -qm "add file.zip"
   git push origin main
   ```
   EXPECTED: success, commit hash. Chiqishni sed bilan redact qil. [REPO]

5. CMC da: `~/.uploads-pull.sh NOM.zip [MANZIL]`
   EXPECTED: OK: yo'l (N fayl, M bayt). Repo tozalandi.

6. Agar bir nechta fayl: avval zip qil, bitta zip push.

## Fix per cause
- Base64 urinish: to'xta, uploads oqimini ishlat.
- Token ko'rinmasin: sed filter, bitta bash chaqiruv.
- 100MB+ : GitHub qabul qilmaydi, foydalanuvchiga ayt.
- CMC yo'q: present_files yoki chatda kichik matn.

Copy-paste (token placeholder):
```
# Faqat get_upload_token dan keyin
T='TOKEN_HERE'
git clone -q "https://x-access-token:${T}@github.com/mrdevs2011/uploads.git" /tmp/uploads-repo
# ... qolgani yuqorida
```

## Where agents go wrong (>=3)
1. Base64 matnini javobga yozib, keyin CMC da decode qilishni buyuradi — taqiqlangan, context to'ladi.
2. Tokenni echo yoki set -x bilan chiqaradi — leak.
3. Uploads o'rniga loyiha repo'siga push qiladi — noto'g'ri.
4. get_upload_token ni so'ramasdan chaqiradi.

## Edge cases (>=2)
1. Kichik matn fayl (<1KB): baribir base64 taqiqlangan, uploads yoki to'g'ridan-to'g'ri chat.
2. Bir nechta fayl: zip qil, bitta push.
3. Token 401: "token failed" deb hisobot, to'xta.
4. CMC run_command yo'q: push qilma, present_files ishlat.

## Done criteria (proving commands)
- git log --oneline -1 uploadsda yangi commit.
- CMC: `~/.uploads-pull.sh` OK chiqishi.
- Chatda base64 yo'q, token yo'q.
- `ls -l` fayl kompyuterda bor.

## If still failing
- Token muddati: yangi get_upload_token.
- Push rejected: pull --rebase, lekin conflict = to'xta.
- Katta fayl: zip siq yoki foydalanuvchiga ayt.

## Sources + confidence
[REPO:instruction.md lines 286-364 fayl o'tkazish bo'limi] — base64 taqiqlangan, uploads oqimi.
[SANDBOX] python3 -c "import base64; print(len(base64.b64encode(b'a'*1000000)))" → 1333336 (1.33x).
Confidence: high, based on documented repo rules and size measurement. Transfer full flow not executed here (requires connected CMC).
