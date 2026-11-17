---
name: bash-stale-hash-table-causes-no-such-file-or-command-not-found-after-move-or-install-use-hash-r
description: Bash hashes command paths; after binary moved/removed/reinstalled in same session, run gives "/abs/path: No such file or directory" or still fails until hash -r. Triggers on command not found after apt/pip install, hashed old path, type shows wrong location.
id: bash-stale-hash-table-causes-no-such-file-or-command-not-found-after-move-or-install-use-hash-r
type: playbook
stack: GNU bash 5.2.15 (Linux)
confirmed_on: 2026-11-17
confidence: high (measured in sandbox + official docs)
triggers:
  - "bash: /usr/bin/foo: No such file or directory"
  - "command not found after apt install"
  - "command not found after pip install"
  - "hash -r"
  - "stale hash table"
  - "which shows old path"
  - "type -a shows hashed"
  - "binary moved but shell still uses old location"
  - "rehash bash"
  - "command not found same shell after install"
related:
  - bash-pipeline-exit-status-is-last-command-unless-set-o-pipefail
  - python-venv-activation-does-not-persist-across-separate-bash-tool-calls-use-full-path-or-chain
  - shell-script-cannot-execute-required-file-not-found-due-to-crlf-in-shebang
---

# TL;DR
Simptom: bir xil shell sessionda binary o'rnatilgandan, ko'chirilgandan yoki o'chirilgandan keyin `mycmd` `/old/path/mycmd: No such file or directory` yoki `command not found` beradi, garchi PATH to'g'ri va yangi joyda bo'lsa ham. Sabab: bash hash jadvali eski to'liq pathname'ni eslab qolgan. Birinchi buyruq: `hash -r` (yoki `hash -d mycmd`). Done: `hash` bo'sh yoki yangi path, `mycmd` ishlaydi, `type mycmd` yangi joy ko'rsatadi.

## Qachon ishlatish / ishlatmaslik
Ishlat: bir xil bash sessiyasida paket o'rnatgandan (`apt`, `pip install --user`, `npm -g`), binaryni ko'chirgandan, o'chirib qayta qo'yganingdan yoki PATH o'zgarmasdan yangi binary paydo bo'lgandan keyin `command not found` yoki absolute path bilan `No such file or directory` chiqsa. `type -a` yoki `hash -t` eski path ko'rsatsa.
Ishlatma: yangi shell ochilgan bo'lsa (hash yangi), PATH noto'g'ri (binary umuman yo'q yoki boshqa dirda), alias/function bor, yoki `command not found` haqiqiy o'rnatilmaganlikdan. Zsh da `rehash`, fish boshqacha.

## Mental model (nima uchun)
[SRC:https://www.gnu.org/software/bash/manual/html_node/Bash-Builtins.html @ Bash 5.2 2026-11-17] Bash har muvaffaqiyatli topilgan tashqi buyruqning to'liq pathname'ini hash jadvaliga saqlaydi, keyingi qidiruvni tezlashtirish uchun. PATH o'zgarmasa, eski absolute path ishlatiladi. Binary o'sha pathdan ko'chirilsa/o'chirilsa, xato `bash: /hashed/path: No such file or directory` chiqadi (oddiy `command not found` emas). Yangi binary o'rnatilsa, lekin eski hash bor bo'lsa, yangisini topmaydi. `hash -r` butun jadvalni tozalaydi, `hash -d name` bitta. PATH ga assign qilish ham tozalaydi. [SANDBOX]

## Diagnosis tree (arzonidan qimmatiga)
1. Xato matnini o'qi: `mycmd` ishga tushir. EXPECTED: `bash: /some/abs/path/mycmd: No such file or directory` (absolute path bilan) yoki oddiy `command not found`. Absolute path bo'lsa → hash muammosi ehtimoli yuqori, 2 ga o't. Oddiy not found bo'lsa ham tekshir.
2. Hash jadvalini ko'r: `hash` yoki `hash -t mycmd`. EXPECTED: `hits command` ostida `/old/path/mycmd` yoki `hash -t` shu path. Agar eski path ko'rinsa → sabab shu. Agar bo'sh yoki "not found" → 3 ga.
3. Haqiqiy joyini tekshir: `type -a mycmd` yoki `command -v mycmd` yoki `find /usr /home -name mycmd 2>/dev/null | head`. EXPECTED: yangi path chiqadi yoki hech narsa. Yangi path bor lekin hash eski → hash. Hech narsa → o'rnatilmagan yoki PATH yo'q.
4. PATH ni ko'r: `echo "$PATH" | tr ':' '\n'`. Binary dir ichida bormi? Yo'q bo'lsa PATH muammosi, hash emas.
5. Yangi shell bilan solishtir: `bash -c 'mycmd'` (yangi shell). Ishlasa, eski shell hash. Ishlamasa boshqa sabab.

## Fix per cause
**Sabab: stale hash (eski pathname eslab qolingan)**
Copy-paste:
```bash
hash -r                  # butun jadvalni tozala
# yoki faqat bitta:
hash -d mycmd
# tekshir:
hash -t mycmd || echo "cleared"
type mycmd
mycmd
```
Re-check: `hash` bo'sh yoki yangi path, `mycmd` ishlaydi, xato yo'q.

Agar yangi o'rnatilgan binary `~/.local/bin` yoki `/usr/local/bin` da bo'lsa va PATH da yo'q:
```bash
export PATH="$HOME/.local/bin:$PATH"
hash -r
mycmd
```
Keyin `~/.bashrc` ga qo'sh.

**Sabab: binary umuman yo'q**
`apt install ...` yoki `pip install ...` qil, keyin `hash -r`.

## Where agents go wrong (>=3)
1. Faqat `apt install` yoki `pip install` qilib, `hash -r` ni unutadi — bir xil sessiyada hali ham eski hash ishlaydi.
2. `which` yoki `type` eski hashed path ko'rsatishini e'tiborsiz qoldiradi, PATH ni noto'g'ri deb o'zgartiradi.
3. Yangi shell ochmasdan yoki `hash -r` qilmasdan "o'rnatilmagan" deb xulosa qiladi.
4. Absolute path xatosini (`/usr/bin/foo: No such file`) oddiy `command not found` deb aralashtiradi, hashni tekshirmaydi.
5. `sudo` bilan o'rnatilgan binary uchun oddiy user PATH da yo'qligini hash bilan aralashtiradi.

## Edge cases (>=2)
1. PATH o'zgartirilsa (`export PATH=...`) hash avtomatik tozalanadi. Lekin o'sha sessiyada binary ko'chirilsa va PATH o'zgarmasa — hash qoladi.
2. Alias yoki function bor bo'lsa, hash ishlamaydi; `type -a` alias/function ko'rsatadi. `command -v` yoki `\mycmd` bilan bypass.
3. `hash -p /full/path mycmd` bilan majburiy path berish mumkin, lekin keyin o'zgarsa yana stale.
4. Non-interactive script yoki yangi bash -c da hash bo'sh boshlanadi — muammo faqat uzoq yashaydigan interactive yoki persistent shell da.

## Done criteria (proving commands)
```bash
# Repro wrong:
# (old binary hashed, then mv)
# mycmd  →  bash: /tmp/bindir/mycmd: No such file or directory
hash -r
# after:
hash          # empty or no old entry
type mycmd    # shows new/correct path or "not found" if really gone
mycmd         # runs successfully if present
```
Agar `hash -t mycmd` eski path bermasa va `mycmd` ishlasa — done.

## If still failing
- `type -a mycmd` chiqishini to'liq o'qi: alias, function, hashed, file.
- `echo "$PATH"` va `ls -l $(command -v mycmd)` yoki find.
- Yangi shell och: `bash` yoki yangi terminal.
- `shopt -u checkhash` (default off, lekin tekshir).
- Binary executablemi: `ls -l /path/to/mycmd` va `file`.
- Boshqa shell (zsh `rehash`, fish `hash -r` yoki `source`).

## Sources + confidence
- [SRC:https://www.gnu.org/software/bash/manual/html_node/Bash-Builtins.html @ Bash 5.2, 2026-11-17]: hash builtin, remembers full pathname, -r forgets all, PATH assign clears.
- [SANDBOX]: real run: after mv, `bash: /tmp/bindir/mycmd: No such file or directory`; after `hash -r` → `command not found` (correctly); put back + hash -r → works.
- confidence: high (docs + measured outputs).
