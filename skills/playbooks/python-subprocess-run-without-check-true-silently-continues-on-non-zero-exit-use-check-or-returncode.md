---
name: python-subprocess-run-without-check-true-silently-continues-on-non-zero-exit-use-check-or-returncode
description: subprocess.run check=False da CalledProcessError not raised, silent failure, no exception on non-zero exit, returncode ignored. Use check=True. subprocess.run returns success but command failed, no exception.
id: python-subprocess-run-without-check-true-silently-continues-on-non-zero-exit-use-check-or-returncode
type: playbook
stack: Python 3.10.21 (subprocess)
confirmed_on: 2026-11-18
confidence: high (reproduced in sandbox + official docs)
triggers:
  - subprocess.run returns success but command failed
  - no exception on failed subprocess
  - CalledProcessError not raised
  - subprocess.run(["false"]) continues
  - check returncode after subprocess.run
  - silent failure in subprocess.run
  - subprocess CompletedProcess returncode 1 but no error
  - python subprocess non-zero exit ignored
  - run command failed but script continued
  - subprocess.run without check=True silent
related:
  - python-subprocess-run-string-command-without-shell-true-raises-filenotfounderror-use-list-or-shlex
  - python-subprocess-timeout-shell-true-leaves-child-processes-running-use-start-new-session-killpg-or-exec
---

# subprocess.run check=False da xato chiqarmaydi — check=True yoki returncode tekshir

## TL;DR
Simptom: `subprocess.run(["false"])` yoki boshqa non-zero command exception bermaydi, kod davom etadi, keyin noto'g'ri natija. Sabab: check=False default. Birinchi buyruq: `r = subprocess.run(...); print(r.returncode)`. Done: check=True bilan CalledProcessError yoki if r.returncode != 0: handle.

## Qachon ishlatish / ishlatmaslik
Ishlat: subprocess.run dan keyin exception kutildi lekin yo'q, yoki command fail bo'lishi kerak edi lekin script davom etdi. [SANDBOX]
Ishlatma: Popen ishlatilgan (alohida), yoki returncode allaqachon tekshirilgan, yoki check_call/check_output (ular default check).

## Mental model (nima uchun)
[SRC:https://docs.python.org/3/library/subprocess.html#subprocess.run @3.10] check=False default. Non-zero exit da CompletedProcess qaytaradi, exception yo'q. Agents ko'pincha returncode ni e'tiborsiz qoldiradi. check=True da CalledProcessError. [SANDBOX]

## Diagnosis tree (arzonidan qimmatiga)
1. Kodda subprocess.run ni top, check= parametr bormi?
   EXPECTED: yo'q yoki False. Agar True — boshqa sabab.
   Agar yo'q — 2-qadam.

2. Mini repro: 
   python3 -c 'import subprocess; r=subprocess.run(["false"]); print("rc", r.returncode)'
   EXPECTED: rc 1, no exception. [SANDBOX]
   Agar 0 — command success, boshqa.

3. To'liq xato/traceback yo'qligini tasdiqla (exception kutildi lekin chiqmadi).
   EXPECTED: script oxirigacha yuguradi.

4. Official: python3 -c 'import subprocess,inspect; print(inspect.signature(subprocess.run))'
   EXPECTED: check=False ko'rinadi.

## Tuzatish (sabab bo'yicha)
Sabab: check=False va returncode tekshirilmagan.
Tuzatish (copy-paste):
```python
import subprocess
r = subprocess.run(["false"], check=True)  # raises CalledProcessError
# yoki
r = subprocess.run(["false"])
if r.returncode != 0:
    raise subprocess.CalledProcessError(r.returncode, r.args)
```
Qayta tekshir: xuddi shu command endi exception beradi. [SANDBOX]

## Agents qayerda adashadi
1. check=True ni unutadi, returncode ni print qilmaydi.
2. shell=True bilan string ishlatib, exit code ni e'tiborsiz qoldiradi.
3. try/except faqat Exception qilib, CalledProcessError ni tutmaydi (lekin u Exception).
4. capture_output=True qiladi lekin returncode ni tekshirmaydi.

## Edge cases
1. timeout= bilan: TimeoutExpired alohida, check undan oldin.
2. shell=True va non-zero: ham xuddi shu, check=True ishlaydi.
3. Windows vs POSIX: returncode ma'nosi o'xshash, lekin signal farq qilishi mumkin. [not verified Windows]

## Done criteria
Proving:
python3 -c 'import subprocess; subprocess.run(["false"], check=True)'
EXPECTED: CalledProcessError: Command '['false']' returned non-zero exit status 1.
Agar chiqmasa — tuzatish ishlamadi.

## Agar hali ham ishlamasa
- Popen ishlatilganmi? poll/wait + returncode tekshir.
- Command haqiqatan 0 qaytaryaptimi? (true/false bilan sinash)
- search_skills("subprocess returncode")

## Sources + confidence
[SRC:https://docs.python.org/3.10/library/subprocess.html#subprocess.run 2026-11-18]
[SRC:https://docs.python.org/3.10/library/subprocess.html#subprocess.CalledProcessError]
[SANDBOX] python3 -c reproductions above, real outputs.
confidence: high (measured 100% on false command in sandbox)
