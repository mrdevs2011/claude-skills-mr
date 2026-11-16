---
name: python-subprocess-timeout-shell-true-leaves-child-processes-running-use-start-new-session-killpg-or-exec
description: subprocess.run(..., shell=True, timeout=N) TimeoutExpired chiqaradi lekin shell'ning child processlari (sleep, python, ffmpeg va h.k.) o'lmaydi, davom etadi. start_new_session + os.killpg yoki "exec " prefix ishlat.
id: python-subprocess-timeout-shell-true-leaves-child-processes-running-use-start-new-session-killpg-or-exec
type: playbook
stack: Python 3.10.21 (subprocess, os, signal)
confirmed_on: 2026-11-16
confidence: high (reproduced in sandbox + official docs + CPython issues)
triggers:
  - TimeoutExpired but process still running
  - subprocess.run shell=True timeout leaves child processes
  - sleep or command continues after TimeoutExpired
  - TimeoutExpired Command timed out but ps shows still running
  - subprocess timeout does not kill grandchildren
  - shell=True timeout only kills shell not children
  - process group not killed after timeout
  - TimeoutExpired still see sleep in ps aux
  - subprocess.run timeout shell true child survives
  - "timed out after" but background process continues
related:
  - python-subprocess-run-string-command-without-shell-true-raises-filenotfounderror-use-list-or-shlex
  - python-subprocess-partial-env-dict-causes-filenotfounderror-or-missing-vars-use-os-environ-copy
  - bash-tool-long-command-times-out-after-30s-backgrounds-poll-output-with-get-terminal-command-output
---

# subprocess.run shell=True timeout faqat shell'ni o'ldiradi — child processlar qoladi

## TL;DR
Simptom: `subprocess.run("sleep 10; echo done", shell=True, timeout=2)` TimeoutExpired chiqaradi, lekin `ps` da sleep hali ishlayapti. Sabab: shell=True da to'g'ridan-to'g'ri child shell, haqiqiy buyruq grandchild; timeout faqat shell'ga SIGKILL yuboradi. Birinchi buyruq: `ps aux | grep sleep` yoki o'xshash. Done: start_new_session=True + os.killpg yoki "exec " prefix bilan process yo'qoladi.

## Qachon ishlatish / ishlatmaslik
Ishlat: TimeoutExpired chiqdi, lekin buyruq (yoki uning childlari) hali ishlayapti, ayniqsa shell=True, pipeline, ; yoki & bilan. Yoki timeoutdan keyin resurslar (CPU, lock, port) band.
Ishlatma: oddiy list args + shell=False (to'g'ridan-to'g'ri process o'ladi), yoki timeout umuman chiqmasa (boshqa muammo). Windows da process group boshqacha.

## Mental model (nima uchun)
[SRC:https://docs.python.org/3/library/subprocess.html#subprocess.run @ 3.10+, 2026-11] timeout expire bo'lsa child process kill qilinadi va wait qilinadi. Lekin shell=True da child = /bin/sh (yoki shell), u esa haqiqiy dasturini fork qiladi. Kill faqat sh ni o'ldiradi, grandchild init ga o'tadi va davom etadi. [SANDBOX: python3 da run("sleep 10", shell=True, timeout=2) dan keyin sleep qoladi]. start_new_session=True yangi session/process group yaratadi, shunda killpg butun guruhni o'ldiradi. "exec cmd" shell o'rniga cmd ni replace qiladi.

## Diagnosis tree (arzonidan qimmatiga)
1. TimeoutExpired chiqdimi va qanday chaqiruv?
   ```bash
   python3 -c 'import subprocess; subprocess.run("sleep 5", shell=True, timeout=1)'
   ```
   EXPECTED: TimeoutExpired. Agar list bo'lsa va baribir qolsa → boshqa (daemon, ignore signal).

2. Process hali bormi?
   ```bash
   ps aux | grep -E 'sleep|yourcmd' | grep -v grep
   ```
   EXPECTED: timeoutdan keyin hali ko'rinadi → bu skill. Yo'qolgan bo'lsa → boshqa sabab.

3. shell=True yoki shell syntax (|, ;, &) ishlatilganmi? Kodni tekshir. EXPECTED: ha.

4. start_new_session ishlatilganmi? Yo'q bo'lsa, quyidagi fixni sinab ko'r.

## Fix har bir sabab uchun
Sabab 1 (eng ko'p): shell=True + timeout faqat shell ni kill qiladi.

Fix A (tavsiya, to'liq nazorat): Popen + start_new_session + killpg
```python
import subprocess, os, signal
p = subprocess.Popen("sleep 10; echo done", shell=True, start_new_session=True,
                     stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
try:
    out, err = p.communicate(timeout=2)
    print("done", out)
except subprocess.TimeoutExpired:
    print("timeout, killpg")
    os.killpg(os.getpgid(p.pid), signal.SIGTERM)
    try:
        p.communicate(timeout=1)
    except subprocess.TimeoutExpired:
        os.killpg(os.getpgid(p.pid), signal.SIGKILL)
        p.communicate()
print("returncode", p.returncode)
```
Tekshir: keyin `ps` da sleep yo'q.

Fix B (oddiy buyruqlar uchun): "exec " prefix (shell o'rnini egallaydi)
```python
import subprocess
try:
    r = subprocess.run("exec sleep 10", shell=True, timeout=2, capture_output=True)
except subprocess.TimeoutExpired:
    print("timeout, process killed")
```
Tekshir: sleep yo'qoladi.

Fix C: shell=False + list (agar mumkin bo'lsa)
```python
subprocess.run(["sleep", "10"], timeout=2)  # to'g'ridan-to'g'ri kill ishlaydi
```

## Agentlar qayerda xato qiladi
1. run(..., timeout=) yetarli deb o'ylaydi, ps tekshirmaydi — child qoladi.
2. start_new_session=True qo'shadi lekin killpg qilmaydi — hali ham qolishi mumkin.
3. SIGTERM o'rniga faqat SIGKILL, yoki process group o'rniga faqat p.kill().
4. shell=True ni olib tashlashga harakat qiladi, lekin murakkab shell syntax kerak bo'lsa buziladi.
5. Windows da os.killpg ishlatishga urinadi (AttributeError yoki ishlamaydi).

## Edge cases
1. Windows: start_new_session/killpg yo'q; CREATE_NEW_PROCESS_GROUP + taskkill yoki psutil kerak. [not verified]
2. Child o'zi process group o'zgartirsa yoki signal ignore qilsa, killpg yetarli bo'lmasligi mumkin.
3. "exec " faqat bitta buyruq uchun; pipeline yoki ; bilan ishlamaydi (shell kerak).
4. capture_output=True + timeout ba'zi eski Python versiyalarida hang qilishi mumkin (CPython bpo-37424, 3.8+ da tuzatilgan, lekin children baribir qoladi).

## Done criteria
```bash
python3 << 'PY'
import subprocess, os, signal, time
# wrong: leaves process
p1 = subprocess.Popen("sleep 5", shell=True)
try:
    p1.communicate(timeout=1)
except subprocess.TimeoutExpired:
    p1.kill()
time.sleep(0.5)
# right
p2 = subprocess.Popen("sleep 5", shell=True, start_new_session=True)
try:
    p2.communicate(timeout=1)
except subprocess.TimeoutExpired:
    os.killpg(os.getpgid(p2.pid), signal.SIGKILL)
    p2.communicate()
print("returncode", p2.returncode)
PY
ps aux | grep sleep | grep -v grep || echo "no sleep left — OK"
# Mutation: killpg olib tashlansa sleep qoladi
```

## Agar hali ham ishlamasa
- Child daemonize qilgan (double fork, setsid o'zi) — maxsus cleanup kerak.
- Signal ignore (SIGTERM) — SIGKILL ishlat.
- Boshqa skill: search_skills("subprocess timeout") yoki process still running.
- psutil yordamida process tree ni topib kill qilish mumkin.

## Manbalar + ishonch
- [SRC:https://docs.python.org/3/library/subprocess.html#subprocess.Popen @ 3.10 docs, 2026-11-16] start_new_session, timeout kills direct child
- [SRC:https://bugs.python.org/issue37424] Timeout with shell=True leaves grandchildren, hang on capture
- [SRC:https://docs.python.org/3/library/os.html#os.killpg]
- [SANDBOX] Python 3.10.21: run("sleep 10", shell=True, timeout=2) → TimeoutExpired, sleep qoladi; start_new_session + killpg yoki "exec sleep" bilan yo'qoladi.
- Ishonch: high (o'lchangan, docs va issue mos)
