---
name: sh-syntax-error-open-parenthesis-unexpected-bash-array-or-feature-use-bash-shebang
description: /bin/sh (dash) da bash array, [[ ]] yoki boshqa bashism ishlatilganda "Syntax error: "(" unexpected" yoki shunga o'xshash. Shebang #!/bin/bash yoki posix ga o'zgartir.
id: sh-syntax-error-open-parenthesis-unexpected-bash-array-or-feature-use-bash-shebang
type: playbook
stack: bash 5.x / dash (sh) on Linux (sandbox 2026-11)
confirmed_on: 2026-11-13
confidence: high (reproduced in sandbox)
triggers:
  - Syntax error: "(" unexpected
  - Syntax error: unexpected
  - bash array in sh
  - /bin/sh Syntax error
  - dash Syntax error
  - shebang sh but bash features
  - [[ ]] unexpected
  - process substitution not supported
  - bashism in posix shell
related:
  - playbooks/shell-script-cannot-execute-required-file-not-found-due-to-crlf-in-shebang.md
  - playbooks/python-input-eoferror-non-interactive-stdin-in-bash-tool-use-argv-or-file.md
---

# sh da bashism: Syntax error "(" unexpected — bash shebang yoki posix ishlat

## TL;DR
Simptom: script ishga tushganda "Syntax error: "(" unexpected" (yoki "unexpected" boshqa token) chiqadi, ayniqsa arr=(..) yoki [[ ]].
Sabab: shebang #!/bin/sh yoki sh bilan chaqirilgan, dash/posix sh bash array/[[/process subst ni qo'llab-quvvatlamaydi.
Birinchi buyruq: head -1 script.sh yoki file script.sh bilan shebang tekshir; bash script.sh bilan sinab ko'r.
Done: bash bilan ishlaydi, yoki posix qilib qayta yozilgan, xato yo'q.

## Qachon ishlatish / ishlatmaslik
Ishlat: Linux shell script yozayotganda yoki ishga tushirayotganda "Syntax error: "(" unexpected" yoki shunga o'xshash chiqsa, array, [[, <( ) ishlatilgan bo'lsa.
Ishlatma: haqiqiy syntax xato (qavs yopilmagan), yoki bash bilan ham xato bersa, yoki Windows CRLF (boshqa skill).

## Mental model (nima uchun)
[SANDBOX] /bin/sh ko'pincha dash (posix), bash emas. Bash-specific: arrays arr=(1 2), [[ test ]], process substitution <(cmd), {1..10}, local, etc. Dash ularni parse qilolmaydi, "(" unexpected deb to'xtaydi. Shebang yoki chaqiruv sh ni tanlaydi. [REPO:instruction.md Linux tools]

## Diagnosis tree (arzonidan qimmatiga)
1. Xato matnini o'qi: "Syntax error: "(" unexpected" yoki "Syntax error: unexpected" borligini tekshir.
   EXPECTED: shu xato. Agar "command not found" — boshqa. Agar bash da ham — syntax xato.

2. Shebang va chaqiruvni tekshir: head -1 script.sh; file script.sh; ps yoki qanday ishga tushirilgan.
   EXPECTED: #!/bin/sh yoki sh script.sh. Agar #!/bin/bash — boshqa sabab. [SANDBOX]

3. Bash bilan sinab ko'r: bash script.sh
   EXPECTED: ishlaydi (masalan echo 1). Agar xato — haqiqiy syntax, tuzat. [SANDBOX: bash /tmp/test.sh → 1]

4. Agar sh da xato, bash da ok — bashism. Qaysi qator: sh -n script.sh yoki xato qatorini ko'r.
   EXPECTED: array yoki [[ qatori.

5. Tuzatish: shebang ni #!/bin/bash qil, yoki posix qilib qayta yoz (array o'rniga positional, [[ o'rniga [ ).

## Fix per cause
- Array arr=(..): shebang #!/bin/bash yoki set -- 1 2; echo $1
- [[ ]]: [ ] yoki bash shebang
- Process <( ): bash shebang yoki pipe/file
- Range {1..10}: bash shebang yoki seq

Copy-paste (wrong → right):
```
# Wrong (sh)
#!/bin/sh
arr=(1 2)
echo ${arr[0]}
# → Syntax error: "(" unexpected

# Right
#!/bin/bash
arr=(1 2)
echo ${arr[0]}
# yoki posix:
#!/bin/sh
set -- 1 2
echo $1
```

## Where agents go wrong (>=3)
1. Shebang #!/bin/sh qoldirib, bash feature ishlatadi, xato oladi, kodni o'zgartirmay qayta urinadi.
2. Xatoni "qavs yopilmagan" deb o'ylaydi, qavs qo'shadi — yanada yomon.
3. sh -n bilan tekshirmaydi, to'g'ridan-to'g'ri ishga tushiradi.
4. Absolute /bin/bash o'rniga env ishlatadi, lekin PATH da bash yo'q bo'lishi mumkin (kam).

## Edge cases (>=2)
1. Script chmod +x, to'g'ridan-to'g'ri ./script.sh — shebang ishlatiladi.
2. source script.sh ichida — chaqiruvchi shell'ning turiga bog'liq.
3. Alpine yoki minimal distro'da bash o'rnatilmagan — posix qilish kerak.

## Done criteria (proving commands)
- bash script.sh muvaffaqiyatli, kutilgan output.
- sh script.sh ham (agar posix qilingan) yoki shebang bash bo'lsa ./script.sh ok.
- sh -n script.sh xato bermaydi (yoki bash -n).

## If still failing
- Xato qatorini aniq ko'rsat: set -x yoki sh -x.
- Boshqa bashism: declare, local, etc. — posix ga o'tkaz.
- Distro tekshir: ls -l /bin/sh; bash --version.

## Sources + confidence
[SANDBOX] Reproduced: /tmp/test.sh with arr=(1 2) under /bin/sh → "Syntax error: "(" unexpected"; bash → "1".
Confidence: high, based on actual runs in this environment.
