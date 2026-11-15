---
name: python-sqlite3-operationalerror-database-is-locked-timeout-or-wal-or-close
description: sqlite3.OperationalError: database is locked (SQLITE_BUSY) — boshqa connection lock ushlab turgan, timeout=0 yoki unclosed transaction. timeout, WAL, close yoki BEGIN IMMEDIATE ishlat. baza qulflangan.
id: python-sqlite3-operationalerror-database-is-locked-timeout-or-wal-or-close
type: playbook
stack: Python 3.10 + sqlite3 3.40.1 (stdlib)
confirmed_on: 2026-11-15
confidence: high (reproduced in sandbox, official docs)
triggers:
  - sqlite3.OperationalError: database is locked
  - OperationalError: database is locked
  - database is locked
  - sqlite database is locked
  - Error: database is locked
  - SQLITE_BUSY
  - baza qulflangan
  - database is locked SQLITE_BUSY
related:
  - coding/deps/WrongPackageVersionOrPeerDependencyConflict.md
  - playbooks/server-listen-eaddrinuse-address-already-in-use-find-and-stop-process.md
---

# sqlite3.OperationalError: database is locked — timeout, WAL yoki connection yop

## TL;DR
Simptom: `sqlite3.OperationalError: database is locked` INSERT/UPDATE/DELETE paytida.
Sabab: boshqa connection (yoki o'zingiz) lock ushlab turibdi (uncommitted BEGIN yoki yopilmagan), default timeout=0.
Birinchi buyruq: `lsof your.db` yoki processni topib yop/kill; keyin `connect(..., timeout=5)` yoki `PRAGMA journal_mode=WAL`.
Done: insert muvaffaqiyatli, error yo'q, connection yopilgan.

## Qachon ishlatish / ishlatmaslik
Ishlat: Python sqlite3 da "database is locked", bir necha process/thread bir DB ga yozayotgan, yoki transaction uzoq ochiq.
Ishlatma: "no such table", syntax error, yoki boshqa OperationalError (masalan disk full).

## Mental model (nima uchun)
[SANDBOX] SQLite default rollback journal (DELETE mode): bitta writer, concurrent readerlar cheklangan. Default busy_timeout=0 — darhol fail. Lock ushlagan connection (BEGIN ochiq, commit/rollback yo'q, yoki close qilinmagan) boshqalarni bloklaydi. WAL mode reader+1 writer ruxsat beradi. [SRC:https://www.sqlite.org/lockingv3.html]

## Diagnosis tree (arzonidan qimmatiga)
1. Xato matnini o'qi: aynan "database is locked" mi?
   EXPECTED: OperationalError: database is locked. Agar boshqa — bu skill emas.
   Agar ha — 2-qadam.

2. Kim lock ushlab turibdi? `lsof your.db` yoki `fuser your.db` (agar mavjud), yoki `ps aux | grep python`.
   EXPECTED: python process. [SANDBOX: lsof not present, but process check works]
   Agar topildi — o'sha processni to'xtat (yoki uning connectionini yop), qayta urin. Agar yo'q — 3.

3. Timeout bor-yo'qligini tekshir: kodda `sqlite3.connect(db, timeout=?)` yoki `PRAGMA busy_timeout`.
   EXPECTED: timeout=0 yoki yo'q (default 0). [SANDBOX]
   Agar 0 — timeout=5 yoki PRAGMA busy_timeout=5000 qo'y, qayta urin.

4. Journal mode: `conn.execute("PRAGMA journal_mode")`.
   EXPECTED: delete (default). Agar wal — yaxshi. Aks holda WAL ga o'tkaz.

5. Transaction: kodda BEGIN bor lekin commit/rollback yo'qmi, yoki with ishlatilmaganmi?
   EXPECTED: unclosed. with sqlite3.connect(...) as conn: + commit ishlat.

## Fix per cause
**Cause 1: boshqa process lock ushlagan**
```bash
lsof your.db   # PID top
kill <PID>     # yoki processni to'g'ri yop
```
Qayta tekshir: insert ishlaydi.

**Cause 2: timeout=0**
```python
conn = sqlite3.connect("your.db", timeout=5.0)  # 5 soniya kut
# yoki
conn.execute("PRAGMA busy_timeout = 5000")
```
**Cause 3: default journal mode**
```python
conn = sqlite3.connect("your.db")
conn.execute("PRAGMA journal_mode=WAL")  # persist
print(conn.execute("PRAGMA journal_mode").fetchone())  # ('wal',)
```
**Cause 4: unclosed / uzun transaction**
```python
with sqlite3.connect("your.db", timeout=5) as conn:
    conn.execute("BEGIN IMMEDIATE")  # yozish uchun darhol lock
    conn.execute("INSERT INTO t VALUES (1)")
    conn.commit()  # yoki with avtomatik
# connection yopiladi
```
Qayta tekshir: bir necha marta insert, error yo'q.

## Where agents go wrong
1. Timeoutni oshirmasdan faqat "retry" loop yozish — asosiy sabab qoladi.
2. WAL ni faqat bir connectionda qo'yib, boshqalarda unutish (lekin persist).
3. with ishlatmasdan connectionni ochiq qoldirish, keyin boshqa processda lock.
4. BEGIN (deferred) ishlatib, keyin write — upgrade fail "database is locked".

## Edge cases
1. Network filesystem (NFS/SMB) da lock ishonchsiz — local disk ishlat yoki nobrl.
2. Bir necha thread: check_same_thread=False + queue yoki connection per thread.
3. Journal file (-journal yoki -wal) qolgan — delete qilmasdan, process yopilgandan keyin tozalanadi.

## Done criteria
```bash
python3 -c '
import sqlite3
with sqlite3.connect("testdone.db", timeout=1) as c:
    c.execute("CREATE TABLE IF NOT EXISTS t (id int)")
    c.execute("PRAGMA journal_mode=WAL")
    c.execute("INSERT INTO t VALUES (1)")
    c.commit()
print("ok")
'
# EXPECTED: ok, no OperationalError
```
Agar error qaytsa — lock hali bor.

## If still failing
- `sqlite3 your.db "PRAGMA integrity_check;"`
- Journal fayllarni tekshir: ls *.db-*
- Yangi DB yarating test uchun.
- Official: https://www.sqlite.org/lockingv3.html

## Sources + confidence
- [SANDBOX] Python 3.10.21 + sqlite 3.40.1: timeout=0.1 + BEGIN EXCLUSIVE → "database is locked"; timeout=5 yoki WAL → success.
- [SRC:https://www.sqlite.org/lockingv3.html @ SQLite 3.40] locking protocol, SQLITE_BUSY.
- [SRC:https://docs.python.org/3/library/sqlite3.html] connect timeout param.
Confidence: high (measured repro + official).
