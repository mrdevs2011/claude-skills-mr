---
id: python-pip-failed-to-build-wheel-pg-config-not-found-use-binary-or-libpq-dev
name: python-pip-failed-to-build-wheel-pg-config-not-found-use-binary-or-libpq-dev
description: pip install psycopg2 (or similar C-extension) fails with "Error: pg_config executable not found" or "failed to build wheel" / "Getting requirements to build wheel did not run successfully". Use psycopg2-binary or install libpq-dev.
type: playbook
stack: Python 3.10 / pip 23.0.1 / Debian 12
confirmed_on: 2026-11-16
confidence: high (repro in sandbox + official docs)
triggers:
  - Error: pg_config executable not found
  - pg_config is required to build psycopg2 from source
  - failed to build wheel
  - Getting requirements to build wheel did not run successfully
  - subprocess-exited-with-error wheel psycopg2
  - cannot install psycopg2 missing pg_config
  - pip install psycopg2 error pg_config
  - use psycopg2-binary instead
  - libpq-dev missing for psycopg2
  - PostgreSQL development headers not found
related:
  - python-pip-externally-managed-environment-error-use-venv-or-pipx-or-apt
---

# pip "pg_config executable not found" / failed to build wheel: source o'rniga binary ishlat

## TL;DR
Simptom: `pip install psycopg2` "Error: pg_config executable not found" yoki "error: subprocess-exited-with-error" / "Getting requirements to build wheel did not run successfully" chiqaradi.
Sabab: paket source'dan compile qilinmoqda, lekin PostgreSQL client dev headers (pg_config, libpq) yo'q.
Birinchi buyruq: `pip install psycopg2-binary`
Done: `python -c "import psycopg2; print(psycopg2.__version__)"` versiya chiqaradi, xato yo'q.

## Qachon ishlatish / ishlatmaslik
Ishlat: `pip install` C-extension paket (psycopg2, lxml, cryptography va h.k.) da "failed to build wheel", "pg_config not found", "fatal error: Python.h: No such file", "Microsoft Visual C++ required" yoki shunga o'xshash compile xatosi chiqsa.
Ishlatma: oddiy pure-Python paket (requests) da network/version xatosi bo'lsa. Yoki externally-managed-environment (boshqa skill). Yoki binary mavjud emas platformada (masalan eski musl/Alpine ba'zida).

## Mental model (nima uchun)
[SRC:https://www.psycopg.org/docs/install.html @ Psycopg 2, accessed 2026-11-16] Ko'p paketlar (psycopg2) tezlik uchun C kodiga ega. PyPI'da ikkita variant: `psycopg2` (source, compile talab) va `psycopg2-binary` (oldindan yig'ilgan wheel). Source uchun `pg_config` (libpq-dev paketi) va compiler (gcc, python3-dev) kerak. Ularsiz setup.py yoki build backend "Error: pg_config executable not found" chiqaradi. [SANDBOX: pip 23.0.1 da psycopg2 source fail, psycopg2-binary wheel muvaffaqiyatli o'rnatildi va import ishladi]

## Diagnosis tree (arzonidan qimmatiga)
1. Xato matnini to'liq ol: `pip install psycopg2 2>&1 | tail -40`  
   EXPECTED: "Error: pg_config executable not found" yoki "Getting requirements to build wheel did not run successfully" + "subprocess-exited-with-error".  
   Agar "externally-managed-environment" → boshqa skill. Agar "No matching distribution" → versiya/platforma. Agar network timeout → internet.

2. Binary variant mavjudligini tekshir: `pip index versions psycopg2-binary 2>&1 | head -5` yoki to'g'ridan-to'g'ri `pip install psycopg2-binary` sinab ko'r.  
   EXPECTED: versiyalar chiqadi yoki "Successfully installed". Agar "No matching distribution found" → platforma uchun wheel yo'q, source + deps kerak.

3. pg_config borligini tekshir: `which pg_config` yoki `pg_config --version`  
   EXPECTED: "command not found" yoki yo'q. Agar bor, PATH yoki versiya noto'g'ri (libpq versiyasi mos emas).

4. Compiler va python headers: `gcc --version | head -1` va `python3-config --includes` (yoki `ls /usr/include/python3.10/Python.h`)  
   EXPECTED: gcc bor, Python.h yo'q bo'lsa python3-dev kerak. 

5. Distro paketini qidir (agar apt ruxsat bo'lsa): `apt-cache search libpq-dev | head -3`  
   EXPECTED: libpq-dev. Keyin `sudo apt install libpq-dev python3-dev build-essential` (sandbox'da apt ko'pincha ruxsat yo'q).

## Tuzatish (sabab bo'yicha)
**Asosiy (tavsiya etiladi):** binary ishlat.  
```bash
pip install psycopg2-binary
python -c "import psycopg2; print('ok', psycopg2.__version__)"
```
EXPECTED: "Successfully installed psycopg2-binary-..." va "ok 2.9.x".

**Agar source shart (masalan server bilan aniq moslik):**  
```bash
# Debian/Ubuntu
sudo apt-get update && sudo apt-get install -y libpq-dev python3-dev build-essential
# CentOS/RHEL
sudo yum install -y postgresql-devel python3-devel gcc
pip install psycopg2
```
EXPECTED: pg_config topiladi, wheel yig'iladi.

**Boshqa paketlar uchun umumiy:** xato matnida "No such file or directory" (masalan libxml2, openssl) bo'lsa, mos -dev paketini o'rnat yoki binary wheel qidir (`pip install package-binary` yoki manylinux wheel).

## Agentlar qayerda xato qiladi
- Source `psycopg2` ni majburlab o'rnatishga urinadi, binary'ni e'tiborsiz qoldiradi (docs'da birinchi tavsiya binary).
- `apt install postgresql` qiladi (server), lekin `libpq-dev` (client headers) kerak ekanini bilmaydi.
- Sandbox/container'da apt ishlamasa, "permission denied" da to'xtaydi, binary'ni sinamaydi.
- `--no-binary :all:` ishlatib ataylab source ga majbur qiladi.

## Edge cases
- Platforma uchun binary wheel yo'q (masalan ARM musl, eski Python): source + deps shart, yoki docker image'da oldindan o'rnatilgan ishlat.
- Production'da binary'ni xavfsizlik sababli rad etishadi (ba'zi distrolar): source + exact libpq versiyasi kerak.
- psycopg3 (`psycopg[binary]`) da o'xshash, lekin paket nomi boshqa.

## Done criteria
```bash
python -c "import psycopg2; print(psycopg2.__version__)"
# yoki
pip show psycopg2-binary | grep -E 'Name|Version'
```
EXPECTED: versiya chiqadi, ImportError yo'q. Agar source o'rnatilgan bo'lsa ham `import psycopg2` ishlaydi.

## Agar baribir ishlamasa
- Xato matnini to'liq o'qi (tail -50), "No such file" ni qidir, mos -dev paketini top.
- `pip install --verbose psycopg2 2>&1 | grep -E 'error:|Error:|not found'`
- Platformani tekshir: `python -c "import platform; print(platform.platform(), platform.machine())"`
- Agar venv emas system Python va externally-managed → boshqa skill.
- Oxirgi: `pip install --upgrade pip setuptools wheel` keyin qayta.

## Manbalar va ishonch
- [SRC:https://www.psycopg.org/docs/install.html @ Psycopg2 install, binary recommended, 2024+]
- [SRC:https://www.psycopg.org/install @ Quick install psycopg2-binary]
- [SANDBOX: 2026-11-16, Python 3.10.21, pip 23.0.1, Debian: source fail with exact "Error: pg_config executable not found", binary success, import ok]
- [GUESS: boshqa paketlar (lxml → libxml2-dev, cryptography → rustc/openssl-dev) uchun o'xshash mantiq, lekin har biri alohida tekshirilishi kerak]
