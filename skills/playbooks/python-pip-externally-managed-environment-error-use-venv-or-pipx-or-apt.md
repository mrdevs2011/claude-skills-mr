---
id: python-pip-externally-managed-environment-error-use-venv-or-pipx-or-apt
name: python-pip-externally-managed-environment-error-use-venv-or-pipx-or-apt
description: pip install fails with error: externally-managed-environment on Debian/Ubuntu system Python. Use venv, pipx or apt instead of system-wide install. Triggers on exact error text.
type: playbook
stack: Python 3.11+ / pip 23+ / Debian 12+ Ubuntu 23.04+
confirmed_on: 2026-11-15
confidence: high (PEP 668 + marker file + venv repro in sandbox)
triggers:
  - error: externally-managed-environment
  - pip install fails with externally managed
  - This environment is externally managed
  - pip refuses to install system-wide Debian Ubuntu
  - EXTERNALLY-MANAGED marker file
  - cannot install packages with pip on system python
  - pip install --user still fails externally-managed
  - use venv instead of system pip
  - PEP 668 pip error
  - python3 -m pip install blocked by OS package manager
related:
  - python-venv-activation-does-not-persist-across-separate-bash-tool-calls-use-full-path-or-chain
---

# pip "externally-managed-environment" xatosi: tizim Python'iga o'rnatishni rad etadi

## TL;DR
Simptom: `pip install some-package` yoki `python3 -m pip install` "error: externally-managed-environment" / "This environment is externally managed" chiqaradi (Debian 12+, Ubuntu 23.04+).
Sabab: OS paket menejeri (apt) Python'ni boshqaradi (PEP 668), `EXTERNALLY-MANAGED` fayli bor, pip tizim `sys.path` ga yozishni rad etadi.
Birinchi buyruq: `ls $(python3 -c "import sysconfig; print(sysconfig.get_path('stdlib'))")/EXTERNALLY-MANAGED` yoki `python3 -m venv .venv && .venv/bin/pip install some-package`
Done: venv ichida paket o'rnatiladi, import ishlaydi, tizim Python o'zgarmaydi.

## Qachon ishlatish / ishlatmaslik
Ishlat: Linux distro (Debian/Ubuntu/Fedora va h.k.) da system Python bilan `pip install` ishlamasa, ayniqsa yangi distro.
Ishlatma: venv yoki conda ichida bo'lsangiz (u yerda ishlaydi). Yoki Docker image'da `--break-system-packages` ataylab ishlatilgan bo'lsa. Mac Homebrew ba'zan shunga o'xshash.

## Mental model (nima uchun)
[SRC:https://peps.python.org/pep-0668/ @ Final, 2021-2023] Distrolar Python'ni o'z paket menejeri orqali yetkazadi. `pip install` (system yoki --user) tizim paketlarini sindirishi mumkin (masalan dnf/apt o'zi Python'da). Shuning uchun distro `EXTERNALLY-MANAGED` marker faylini `stdlib` yo'lida qo'yadi. pip buni ko'rsa (va `sys.prefix == sys.base_prefix` bo'lsa) to'xtaydi va venv/pipx/apt ni tavsiya qiladi. [SANDBOX: /usr/lib/python3.11/EXTERNALLY-MANAGED mavjud]

## Diagnosis tree (arzonidan qimmatiga)
1. Xato matnini to'liq ko'r: `pip install requests 2>&1 | head -30`  
   EXPECTED: "error: externally-managed-environment" va "To install Python packages system-wide, try apt install python3-xyz" yoki venv tavsiyasi.  
   Agar boshqa xato (network, version) → bu skill emas.

2. Marker faylni tekshir: `python3 -c "import sysconfig; print(sysconfig.get_path('stdlib'))"` keyin `ls $(python3 -c "import sysconfig; print(sysconfig.get_path('stdlib'))")/EXTERNALLY-MANAGED`  
   EXPECTED: fayl mavjud, ichida Error= matn. Agar yo'q → boshqa sabab (permissions, eski pip).

3. Virtual env ekanligini tekshir: `python3 -c "import sys; print(sys.prefix == sys.base_prefix)"`  
   EXPECTED: True (system). False bo'lsa — venv ichidasiz, pip ishlashi kerak.

4. Distro paketini qidir: `apt search python3-requests | head -5` (yoki dnf/pacman ekvivalenti)  
   EXPECTED: paket topilsa, `sudo apt install python3-requests` ishlat.

## Fix har bir sabab uchun
Sabab 1 (asosiy): system Python externally managed.  
Fix 1 (loyiha uchun, eng to'g'ri):  
```bash
python3 -m venv .venv
.venv/bin/pip install requests
.venv/bin/python -c "import requests; print('ok', requests.__version__)"
```
Tekshir: yuqoridagi import ishlaydi.

Fix 2 (CLI tool uchun): `sudo apt install pipx && pipx install black` (keyin `black` PATH da).

Fix 3 (distro paketi bor bo'lsa): `sudo apt install python3-requests`

Fix 4 (oxirgi chora, xavfli): `pip install --break-system-packages requests` — faqat container yoki bilasizki sindirmaydi. [SANDBOX: venv ishladi]

## Agentlar qayerda xato qiladi
1. `--break-system-packages` ni darhol ishlatib, tizimni sindirish xavfini e'tiborsiz qoldirish.
2. `sudo pip install` qilib, hali ham xato olish (marker sudo ni ham bloklaydi).
3. venv yaratib, lekin `pip` ni system dan chaqirish (activate qilmasdan).
4. `python3 -m pip` o'rniga faqat `pip` (noto'g'ri interpreter).

## Edge cases
1. Python 3.10 yoki undan eski da marker yo'q bo'lishi mumkin (Debian 12 da 3.11 da bor). [SANDBOX]
2. Container image'larda (Docker) marker odatda saqlanadi, lekin `--break-system-packages` ishlatilishi mumkin.
3. Fedora/RHEL da xuddi shunday, lekin dnf va python3-pip paketi.
4. Windows/macOS da kamroq (Homebrew ba'zan). [not verified]

## Done criteria
```bash
# venv yaratilgan va paket o'rnatilgan
.venv/bin/python -c "import requests; print(requests.__version__)"
# tizim Python o'zgarmagan
python3 -c "import sys; print('system still', sys.prefix)"
# marker hali bor
ls /usr/lib/python3.11/EXTERNALLY-MANAGED 2>/dev/null || echo "no 3.11"
```
Agar venv ichida import muvaffaqiyatli va system Python toza — done.

## Agar hali ham ishlamasa
- `python3 -m ensurepip` yoki `apt install python3-venv python3-full`.
- `which python3; python3 --version`.
- Rasmiy: https://packaging.python.org/en/latest/specifications/externally-managed-environments/
- Minimal repro: Debian 12+ da `python3.11 -m pip install requests` (pip o'rnatilgan bo'lsa).

## Sources + confidence
- [SRC:https://peps.python.org/pep-0668/] Final, 2021: marker + pip refusal.
- [SRC:https://packaging.python.org/en/latest/specifications/externally-managed-environments/] current spec.
- [SANDBOX] 2026-11-15: /usr/lib/python3.11/EXTERNALLY-MANAGED content o'qildi; python3 -m venv /tmp/testvenv && pip install requests muvaffaqiyatli (requests 2.34.2).
- Confidence: 95% (docs + local marker + venv ishladi). 100% emas, chunki har distro marker matni biroz farq qilishi mumkin.
