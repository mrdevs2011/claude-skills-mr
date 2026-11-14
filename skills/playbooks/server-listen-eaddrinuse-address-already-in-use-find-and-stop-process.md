---
name: server-listen-eaddrinuse-address-already-in-use-find-and-stop-process
description: Node EADDRINUSE or Python Errno 98 Address already in use when starting server — another process holds the port. Find with ps/lsof/ss and kill, or change port. Triggers on exact error texts.
id: server-listen-eaddrinuse-address-already-in-use-find-and-stop-process
type: playbook
stack: Node.js v20.20.2 / Python 3.10.21 (Linux)
confirmed_on: 2026-11-14
confidence: high (reproduced in sandbox + official docs)
triggers:
  - Error: listen EADDRINUSE: address already in use :::3000
  - OSError: [Errno 98] Address already in use
  - port already in use when starting server
  - node listen EADDRINUSE
  - python http.server Address already in use
  - address already in use 3000 or 8080
  - EADDRINUSE port busy
  - server won't start port taken
  - how to free port for node or python server
  - listen failed address already in use
related:
  - bash-tool-long-command-times-out-after-30s-backgrounds-poll-output-with-get-terminal-command-output
---

# Server listen EADDRINUSE yoki Errno 98 Address already in use — portni bo'shatish

## TL;DR
Simptom: Node `Error: listen EADDRINUSE: address already in use :::3000` yoki Python `OSError: [Errno 98] Address already in use` chiqadi, server ishga tushmaydi.
Sabab: o'sha portni boshqa process (ko'pincha eski server instance) ushlab turibdi.
Birinchi buyruq: `ps aux | grep -E 'node|python|http.server' | grep -v grep` (yoki `lsof -i :PORT` agar bor bo'lsa).
Done: process o'ldirilgach, qayta start xatosiz ishlaydi, `curl localhost:PORT` javob beradi.

## Qachon ishlatish / ishlatmaslik
Ishlat: Node, Python (http.server, Flask, FastAPI), yoki boshqa TCP server start qilayotganda "address already in use" / EADDRINUSE / Errno 98 chiqsa.
Ishlatma: oddiy "connection refused" (server yo'q), yoki port 0 (random) ishlatayotgan bo'lsangiz, yoki Windows (bu Linux/macOS focus).

## Mental model (nima uchun)
[SRC:https://nodejs.org/api/net.html @ v20, 2026-11] Node `server.listen(port)` OS'dan port so'raydi. Agar boshqa process allaqachon bind qilgan bo'lsa, kernel EADDRINUSE (errno 98) qaytaradi. Python socket.bind ham xuddi shunday OSError. [SANDBOX] Port TCP LISTEN holatida bo'lsa, yangi bind rad etiladi. TIME_WAIT holatida (tez restart) ba'zan SO_REUSEADDR yordam beradi, lekin asosiy sabab — hali ishlayotgan process.

## Diagnosis tree (arzonidan qimmatiga)
1. Xato matnini to'liq o'qi: Node `code: 'EADDRINUSE', port: 3000` yoki Python `Errno 98`. Port raqamini aniqlа. EXPECTED: aniq port. Agar boshqa xato → boshqa skill.
   Agar port aniq → 2-ga o't.

2. Oddiy usul (har doim ishlaydi): `ps aux | grep -E 'node|python3?|uvicorn|flask|gunicorn' | grep -v grep`
   EXPECTED: PID va command ko'rinadi (masalan python3 -m http.server 8080). Agar topilsa → shu PID'ni kill qil (3).
   Agar yo'q → 3 yoki 4 (lsof/ss).

3. Agar `lsof` bor bo'lsa (ko'p Linux/macOS da): `lsof -i :3000 -sTCP:LISTEN` yoki `lsof -ti :3000`
   EXPECTED: COMMAND PID ... TCP *:3000 (LISTEN). [SANDBOX: lsof yo'q edi, shuning uchun ps ishlatildi]
   Agar topilsa → kill PID.

4. `ss` bor bo'lsa (iproute2, zamonaviy): `ss -tlnp | grep :3000` yoki `ss -ltnp 'sport = :3000'`
   EXPECTED: users:(("node",pid=123,fd=...))
   Yo'q bo'lsa `which lsof ss` tekshir, apt install lsof yoki iproute2 kerak bo'lishi mumkin (user computerda).

5. Agar hali topilmasa: `cat /proc/net/tcp` va hex portni qidir (murakkab, oxirgi chora). Yoki boshqa port ishlat.

## Fix har bir sabab uchun
Sabab 1 (eng ko'p): eski/background server process.
Fix (copy-paste, PORT=3000 ni o'zgartir):
```bash
# Topish
ps aux | grep -E 'node|python' | grep -v grep
# yoki
lsof -ti :3000   # agar bor bo'lsa

# To'xtatish (avval yumshoq)
kill PID
sleep 1
# Agar hali band bo'lsa
kill -9 PID
```
Tekshir: qayta start `node ...` yoki `python3 -m http.server 3000` — xato yo'q, "Serving" yoki "listening" chiqadi.

Sabab 2: TIME_WAIT (tez restart, process yo'q lekin port band).
Fix: Python uchun `socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)` bind dan oldin. Node da odatda SO_REUSEADDR default. Yoki 30-60s kut, yoki boshqa port.

Sabab 3: boshqa dastur (nginx, apache) portni ushlagan.
Fix: `ps` yoki `lsof` bilan aniqlа, kerak bo'lsa to'xtat yoki o'z serveringni boshqa portga o'tkaz.

## Agentlar qayerda xato qiladi
1. Darhol portni o'zgartirishni taklif qiladi, processni topib o'ldirmaydi — keyingi runlarda yana xato.
2. `kill -9` ni birinchi qiladi, cleanup qilmaydi (file lock, log).
3. Faqat `grep node` qiladi, python yoki boshqa commandni o'tkazib yuboradi.
4. Sandbox va user computer farqini unutadi — sandboxda lsof yo'q bo'lishi mumkin, ps ishlatish kerak.
5. Xato matnini to'liq o'qimay, "port busy" deb taxmin qiladi.

## Edge cases
1. IPv6 vs IPv4: Node :::3000 (IPv6 wildcard). `lsof -i :3000` ikkalasini ham ko'rsatadi. [SANDBOX]
2. Port 0: random port oladi, EADDRINUSE kam. Agar aniq port kerak bo'lsa 0 ishlatma.
3. Docker/container: process container ichida, hostda `docker ps` + `docker stop`. Bu skill host process uchun.
4. Windows: `netstat -ano | findstr :3000` keyin `taskkill /PID xxx /F`. [not verified]
5. Permission: boshqa user processini kill qilish uchun sudo kerak bo'lishi mumkin.

## Done criteria
```bash
# Process yo'qligini isbot
ps aux | grep -E 'node|python.*server' | grep -v grep || echo "no server process"
# Port bo'sh (agar lsof/ss bor)
lsof -i :3000 || echo "port free (or lsof missing)"
# Server ishga tushadi
python3 -m http.server 3000 &
sleep 1
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 || echo "curl failed"
# 200 yoki 404 (http.server) — xato yo'q
kill %1
```
Agar start xatosiz va curl javob — done.

## Agar hali ham ishlamasa
- `ss -tlnp` yoki `netstat -tlnp` to'liq ro'yxatni ko'r.
- `sudo` bilan qayta urin (boshqa user).
- Firewall yoki SELinux (kam).
- Minimal repro: `python3 -m http.server 8080` ikki marta — ikkinchisida Errno 98.
- Docs: Node https://nodejs.org/api/net.html#serverlistenport-host-backlog-callback (EADDRINUSE section)
- Python socket docs: https://docs.python.org/3/library/socket.html

## Sources + confidence
- [SRC:https://nodejs.org/api/net.html @ Node 20, 2026-11] "One of the most common errors raised when listening is EADDRINUSE."
- [SRC:https://docs.python.org/3/library/socket.html @ 3.10] bind OSError on address in use.
- [SANDBOX 2026-11-14] Python 3.10.21: ikkinchi `python3 -m http.server 8080` → OSError: [Errno 98] Address already in use. Node v20.20.2: `Error: listen EADDRINUSE: address already in use :::3000`. ps aux bilan PID topildi, kill qilindi, keyin start ishladi. lsof/ss sandboxda yo'q edi.
- Confidence: 85% (docs + local repro). 100% emas, chunki har OS/tool seti boshqacha, TIME_WAIT edge, container.
