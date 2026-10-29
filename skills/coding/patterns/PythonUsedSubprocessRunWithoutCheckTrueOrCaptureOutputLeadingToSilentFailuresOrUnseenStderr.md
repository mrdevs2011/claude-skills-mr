---
name: python-subprocess-run-without-check-or-capture
description: Python kodda subprocess.run yoki Popen chaqirilgan, lekin check=True yoki capture_output yo'q — buyruq xato bilan chiqsa silent fail yoki stderr ko'rinmaydi.
---

# subprocess.run da check=True va capture_output ishlatilmagan

## Nima uchun bu skill kerak
subprocess.run default holatda returncode ni tekshirmaydi va stdout/stderr ni capture qilmaydi. Natijada buyruq muvaffaqiyatsiz tugasa dastur davom etadi (silent failure), xato matni yo'qoladi yoki terminalda aralashib ketadi. Bu debug qilishni qiyinlashtiradi va kutilmagan holatlarga olib keladi.

## Simptom (aynan shu)
- `subprocess.run(["cmd", "arg"])` yoki `subprocess.run("cmd", shell=True)` chaqiruvi bor, lekin `check=True` yo'q.
- Buyruq 0 dan boshqa kod bilan chiqsa dastur xato bermay davom etadi.
- stderr chiqishi terminalga ketadi yoki umuman ko'rinmaydi (capture yo'q).
- Keyinroq "nima uchun fayl yaratilmadi" yoki "buyruq ishlamadi" degan holatlar paydo bo'ladi, lekin exception yo'q.

## Sabab (100%)
Dasturchi subprocess.run ni oddiy "ishga tushirish" deb o'ylaydi va uning default xatti-harakati (returncode ni ignore qilish, output ni capture qilmaslik) ni hisobga olmaydi. check=True berilmasa CalledProcessError ko'tarilmaydi.

## Tasdiqlash
1. subprocess.run yoki Popen ishlatilganmi?
2. check=True yoki check_call ishlatilmaganmi?
3. capture_output=True yoki stdout/stderr=PIPE yo'qmi, va xato holati handle qilinmaganmi?
4. Agar ha — bu holat. check=True + capture + try/except kerak.

## Tuzatish (aynan shu)
Doim check=True ishlat (yoki returncode ni qo'lda tekshir). Output kerak bo'lsa capture_output=True. Xatolarni handle qil.

Noto'g'ri:
```python
import subprocess
subprocess.run(["git", "status"])  # xato bo'lsa ham davom etadi, stderr terminalga
subprocess.run("ls /nonexistent", shell=True)
```

To'g'ri:
```python
import subprocess

try:
    result = subprocess.run(
        ["git", "status"],
        check=True,
        capture_output=True,
        text=True,
    )
    print(result.stdout)
except subprocess.CalledProcessError as e:
    print(f"Buyruq xato bilan chiqdi: {e.returncode}")
    print(e.stderr)
```

Agar faqat ishga tushirish kerak va output muhim emas:
```python
subprocess.run(["cmd"], check=True)
```

Eslatma: shell=True ishlatishdan saqlaning (alohida skill). User input bo'lsa list argument ishlat.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
subprocess.run da default silent failure. Har doim check=True (yoki returncode tekshiruvi) va kerak bo'lsa capture_output ishlat — xatolar darhol ko'rinadi, debug osonlashadi, kutilmagan davom etishlar yo'qoladi.
