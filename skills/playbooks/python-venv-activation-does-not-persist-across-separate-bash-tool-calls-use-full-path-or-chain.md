---
name: python-venv-activation-does-not-persist-across-separate-bash-tool-calls-use-full-path-or-chain
description: Har bir bash tool chaqiruvi yangi shell. source venv/bin/activate keyingi chaqiruvda yo'qoladi, VIRTUAL_ENV set emas, which python system. ModuleNotFoundError. To'liq path yoki bitta buyruqda zanjirla.
id: python-venv-activation-does-not-persist-across-separate-bash-tool-calls-use-full-path-or-chain
type: playbook
stack: Python 3.10.21 (venv), bash tool (fresh shell per call)
confirmed_on: 2026-11-12
confidence: high (reproduced in sandbox [SANDBOX])
triggers:
  - venv activated but module not found next command
  - source bin/activate then ModuleNotFoundError
  - bash tool doesn't remember activate or cd
  - VIRTUAL_ENV not set in next shell
  - python package installed in venv but import fails
  - which python shows system after activate
  - venv activation not persisting across tool calls
  - use full path to venv python
  - chain source && command in one bash
  - ModuleNotFoundError after pip install in venv
  - VIRTUAL_ENV empty after source activate
  - sys.prefix is system python not venv
  - activation lost between bash calls
related:
  - bash-tool-long-command-times-out-after-30s-backgrounds-poll-output-with-get-terminal-command-output
  - python-pty-fork-child-reports-wrong-terminal-size-unless-tiocswinsz-on-master-fd
  - shell-script-cannot-execute-required-file-not-found-due-to-crlf-in-shebang
---

# Python venv aktivatsiyasi alohida bash chaqiruvlarida saqlanmaydi — to'liq path yoki zanjir ishlat

## TL;DR
Simptom: `source venv/bin/activate && pip install foo` qilding, keyingi bash chaqiruvda `python -c "import foo"` → ModuleNotFoundError. `which python` system python ko'rsatadi.
Sabab: Har bash tool yangi shell. Aktivatsiya faqat o'sha shellda PATH/VIRTUAL_ENV ni o'zgartiradi.
Birinchi buyruq: `venv/bin/python -c "import sys; print(sys.prefix)"` yoki `source venv/bin/activate && python ...` bitta chaqiruvda.
Done: `sys.prefix` venv yo'lini ko'rsatadi, import muvaffaqiyatli.

## Qachon ishlatish / ishlatmaslik
Ishlat: Agent bir necha bash tool chaqiruvi qiladi (install, keyin run), venv ishlatmoqchi, ModuleNotFound yoki noto'g'ri python.
Ishlatma: Bitta chaqiruvda hammasi zanjirlangan bo'lsa, yoki doim to'liq path ishlatilsa, yoki persistent shell (tmux/psession) bor bo'lsa.

## Mental model (nima uchun)
[SANDBOX] Bash tool har chaqiruv yangi, xotirasiz shell. `source venv/bin/activate` faqat joriy shellning PATH ga venv/bin ni qo'shadi va VIRTUAL_ENV ni o'rnatadi. Keyingi tool chaqiruvi bu o'zgarishlarni meros qilmaydi. [SRC:https://docs.python.org/3/library/venv.html @3.10+] Aktivatsiya shart emas — to'liq path bilan venv pythonini chaqirish kifoya. [REPO:instruction.md stateless runner]

## Diagnosis tree (arzonidan qimmatiga)
1. Joriy python qaysi ekanini tekshir:
   ```
   which python; python -c 'import sys; print(sys.prefix); print(sys.executable)'
   ```
   EXPECTED: agar venv faol bo'lsa prefix venv yo'li, executable .../venv/bin/python. Agar /usr/... yoki system — aktiv emas. [SANDBOX]
   Agar system — 2-qadam.

2. Venv mavjudligini tekshir:
   ```
   ls -d venv .venv myvenv 2>/dev/null || find . -name activate -path '*/bin/activate' 2>/dev/null | head -3
   ```
   EXPECTED: venv papkasi bor. Yo'q bo'lsa — avval `python3 -m venv venv`.

3. To'liq path bilan sinab ko'r:
   ```
   ./venv/bin/python -c 'import sys; print(sys.prefix)'
   ```
   EXPECTED: venv prefix. Agar "No such file" — yo'l noto'g'ri, ls qil.

4. Agar install kerak bo'lsa, bitta chaqiruvda:
   ```
   source venv/bin/activate && pip install requests && python -c 'import requests; print("ok")'
   ```
   EXPECTED: ok. [SANDBOX]

## Fix per cause
- **Aktivatsiya keyingi chaqiruvda yo'q**: Doim to'liq path ishlat: `venv/bin/python script.py`, `venv/bin/pip install pkg`. Yoki bitta bashda zanjirla: `source venv/bin/activate && python script.py`.
- **Paket o'rnatilmagan**: `venv/bin/pip install -r requirements.txt` yoki `venv/bin/python -m pip install pkg`.
- **Noto'g'ri venv yo'li**: `find . -type d -name bin -exec test -f {}/python \; -print` bilan top.

Copy-paste to'g'ri:
```
python3 -m venv .venv
.venv/bin/pip install requests
.venv/bin/python -c "import requests; print(requests.__version__)"
```
EXPECTED: versiya chiqadi. [SANDBOX]

## Where agents go wrong
1. `source activate` qilib, keyingi alohida tool chaqiruvda `python` deb o'ylash — holat saqlanmaydi.
2. `pip install` (system) qilib, venv da ishlatishni kutish.
3. `cd` ham saqlanmaydi — har chaqiruvda to'liq yo'l yoki `cd && command`.
4. `which python` ni tekshirmasdan "activated" deb hisoblash.

## Edge cases
1. Windows: `venv\Scripts\python.exe` yoki `Activate.ps1`. [not verified in sandbox]
2. Fish shell: `source venv/bin/activate.fish`. Bash tool odatda bash. [not verified]
3. Persistent session (tmux/psession) bo'lsa — bir marta activate, keyin shu sessiyada ishlaydi. [REPO:instruction.md psession.sh]
4. Shebang bilan script: `#!/path/to/venv/bin/python` ishlaydi, activate shart emas.

## Done criteria
```
venv/bin/python -c 'import sys; assert sys.prefix.endswith("venv") or "venv" in sys.prefix; print("venv ok")'
venv/bin/python -c 'import requests; print("import ok")'  # agar o'rnatilgan bo'lsa
```
EXPECTED: "venv ok" va import muvaffaqiyatli. System python bilan bir xil bo'lmasin.

## If still failing
- `venv/bin/python -m pip list` bilan paketlar ro'yxati.
- Yangi venv yarat: `rm -rf venv && python3 -m venv venv`.
- Python versiyasi mosligini tekshir: `python3 --version` vs venv ichidagi.
- Agar persistent shell kerak — psession yoki tmux ishlat (agar mavjud).

## Sources + confidence
- [SRC:https://docs.python.org/3/library/venv.html @ Python 3.10 docs, 2026-11-12] Aktivatsiya faqat joriy shell, to'liq path yetarli.
- [SANDBOX] Reproduced: source in one call, next call system python, full path works.
- Confidence: high. [not verified] for non-bash shells or Windows.
