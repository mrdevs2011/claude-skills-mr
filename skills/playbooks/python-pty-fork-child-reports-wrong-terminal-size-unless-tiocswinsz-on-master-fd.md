---
name: python-pty-fork-child-reports-wrong-terminal-size-unless-tiocswinsz-on-master-fd
description: pty.fork child sees 0x0 or 80x24 terminal size because TIOCSWINSZ not set on master fd before exec. Fix with fcntl.ioctl. Triggers on web terminal wraps at 80 or get_terminal_size 0.
id: python-pty-fork-child-reports-wrong-terminal-size-unless-tiocswinsz-on-master-fd
type: playbook
stack: Python 3.10.21 + pty + termios + fcntl (Linux)
confirmed_on: 2026-11-11
confidence: high (measured in sandbox)
triggers:
  - "terminal always 80 columns"
  - "pty child sees 0x0"
  - "os.get_terminal_size() returns 0"
  - "web terminal wraps at 80"
  - "Flask pty resize not working"
  - "SIGWINCH not sent"
  - "TIOCSWINSZ"
  - "pty.fork window size"
  - "shell prompt wraps wrong in web terminal"
  - "ioctl TIOCSWINSZ before exec"
related:
  - chrome-mv3-service-worker-terminates-after-30s-idle-losing-in-memory-state-use-storage-alarms
---

# TL;DR
Simptom: pty.fork() qilingan child (bash/python) `os.get_terminal_size()` yoki `stty size` da 0x0 yoki default 80x24 ko'rsatadi, web terminal keng bo'lsa ham wrapping 80 da. Sabab: master fd ga TIOCSWINSZ ioctl qilinmagan, shuning uchun SIGWINCH ketmaydi. Birinchi buyruq: `fcntl.ioctl(fd, termios.TIOCSWINSZ, struct.pack("HHHH", rows, cols, 0, 0))` child exec dan oldin. Done: child `os.get_terminal_size()` siz bergan rows/cols ni qaytaradi.

## Qachon ishlatish / ishlatmaslik
Ishlat: Flask/SocketIO yoki oddiy Python bilan web/CLI terminal qurayotganda, pty.fork() yoki openpty ishlatib, child shell/programmaning chiqishi noto'g'ri kenglikda wrap qilsa yoki size 0/80 bo'lsa.
Ishlatma: oddiy subprocess.Popen (pty yo'q), yoki child allaqachon to'g'ri size ko'rsatayotgan bo'lsa, yoki Windows (pty Unix only).

## Mental model (nima uchun)
Pseudo-terminal (PTY) master/slave juftligi. Child slave tomonda ishlaydi va size ni kernel'dan o'qiydi. Siz master fd ga TIOCSWINSZ yubormasangiz, kernel default (ko'pincha 0 yoki 80x24) saqlaydi va SIGWINCH signal yubormaydi. Child shu size bo'yicha line wrapping, prompt, curses va h.k. qiladi. Docs: pty.spawn "Doesn't set slave ... window size" [SRC:https://docs.python.org/3/library/pty.html@3.15 2026-11-11].

## Diagnosis tree
1. Child size ni tekshir: `python3 -c "import os; print(os.get_terminal_size())"` yoki child ichida `stty size`. EXPECTED: siz xohlagan (masalan 40 120). Agar 0 0 yoki 24 80 bo'lsa → 2 ga o't.
2. Master fd da size set qilinganmi: kodda `fcntl.ioctl(master_fd, termios.TIOCSWINSZ, ...)` child fork/exec dan OLDIN bor-mi? Yo'q bo'lsa → sabab shu.
3. Agar set qilingan lekin ishlamasa: fd to'g'rimi (master, slave emas), rows/cols int, pack "HHHH" to'g'rimi, OSError yo'qmi. `try/except` qo'shib log.
4. Resize event (browser resize) da qayta ioctl qilish kerakmi? Ha bo'lsa, har resize da qayta set + child SIGWINCH olishi kerak.

## Fix (copy-paste)
```python
import os, pty, fcntl, termios, struct, select

def set_winsize(fd, rows, cols):
    winsize = struct.pack("HHHH", rows, cols, 0, 0)
    fcntl.ioctl(fd, termios.TIOCSWINSZ, winsize)

pid, fd = pty.fork()
if pid == 0:  # child
    os.execvp("python3", ["python3", "-c", "import os; print(os.get_terminal_size())"])
else:  # parent
    set_winsize(fd, 40, 120)  # <-- bu qator majburiy, exec dan oldin
    r, _, _ = select.select([fd], [], [], 1)
    if r:
        print(os.read(fd, 1024).decode(errors="replace"))
    os.waitpid(pid, 0)
    os.close(fd)
```
Re-check: chiqish `os.terminal_size(columns=120, lines=40)` bo'lishi kerak.

## Agents go wrong
1. ioctl ni child ichida (slave) qilish — master ga kerak.
2. set qilishni exec dan keyin qilish — child allaqachon o'qib olgan.
3. `pty.spawn` ishlatib, o'zi size set qiladi deb o'ylash — spawn ham set qilmaydi (docs bugs).
4. Faqat env LINES/COLUMNS set qilish — ba'zi programlar (curses) e'tibor bermaydi, ioctl kerak.

## Edge cases
1. Non-tty parent: size 0 bo'lishi mumkin, shuning uchun explicit set kerak.
2. Resize dan keyin: client (xterm.js) yangi cols/rows yuborsa, master ga qayta ioctl qiling, SIGWINCH avtomatik ketadi.
3. MacOS: pty.fork ba'zan xavfli (docs warning), Linux'da ishlaydi [SANDBOX].

## Done criteria
```bash
python3 - << 'PY'
import os, pty, fcntl, termios, struct, select
def set_winsize(fd, r, c):
    fcntl.ioctl(fd, termios.TIOCSWINSZ, struct.pack("HHHH", r, c, 0, 0))
pid, fd = pty.fork()
if pid == 0:
    os.execvp("python3", ["python3", "-c", "import os; s=os.get_terminal_size(); print(s.columns, s.lines); import sys; sys.exit(0 if s.columns==120 and s.lines==40 else 1)"])
else:
    set_winsize(fd, 40, 120)
    select.select([fd], [], [], 1)
    out = os.read(fd, 1024).decode()
    print(out)
    status = os.waitpid(pid, 0)[1]
    os.close(fd)
    assert "120 40" in out and status == 0, "FAIL"
    print("PASS")
PY
```
PASS chiqishi kerak.

## Agar hali ham ishlamasa
- `strace -e ioctl` bilan TIOCSWINSZ chaqirilganini tekshir.
- Child da `import shutil; print(shutil.get_terminal_size())` sinab ko'r.
- Flask-SocketIO resize handler da set_winsize chaqirilayotganini log qil.
- [SRC:https://docs.python.org/3/library/termios.html@3.15] TIOCSWINSZ.

## Sources + confidence
- [SRC:https://docs.python.org/3/library/pty.html 2026-11-11] spawn doesn't set window size.
- [SANDBOX] Python 3.10.21, Linux: wrong = columns=0 lines=0; right = 120x40. High confidence.
- termios.TIOCSWINSZ man ioctl.
