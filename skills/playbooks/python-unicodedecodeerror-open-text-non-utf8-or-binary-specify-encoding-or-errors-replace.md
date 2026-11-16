---
name: python-unicodedecodeerror-open-text-non-utf8-or-binary-specify-encoding-or-errors-replace
description: open() text mode da UnicodeDecodeError 'utf-8' codec can't decode byte — fayl UTF-8 emas yoki binary. encoding= yoki errors="replace" yoki "rb" ishlat.
id: python-unicodedecodeerror-open-text-non-utf8-or-binary-specify-encoding-or-errors-replace
type: playbook
stack: Python 3.10.21 (open, codecs)
confirmed_on: 2026-11-16
confidence: high (reproduced in sandbox + official docs)
triggers:
  - UnicodeDecodeError: 'utf-8' codec can't decode byte
  - UnicodeDecodeError utf-8 codec can't decode byte 0xff in position 0
  - UnicodeDecodeError invalid start byte
  - open() UnicodeDecodeError when reading file
  - Python can't decode file as utf-8
  - UnicodeDecodeError 'charmap' codec can't decode
  - reading non-utf8 file with open() fails
  - UnicodeDecodeError on CSV or log file
  - 'utf-8' codec can't decode byte in position
  - open text mode binary file error
related:
  - python-filenotfounderror-open-relative-path-fails-because-cwd-differs-from-script-dir-use-path-file-parent
  - python-input-eoferror-non-interactive-stdin-in-bash-tool-use-argv-or-file
---

# UnicodeDecodeError: open() text mode da non-UTF-8 yoki binary fayl — encoding yoki errors yoki "rb" ishlat

## TL;DR
Simptom: `with open("file.txt") as f: f.read()` yoki `Path.read_text()` UnicodeDecodeError: 'utf-8' codec can't decode byte 0x.. in position ..: invalid start byte beradi. Sabab: fayl UTF-8 emas (latin1, utf-16, CP1252, binary) yoki locale encoding farq qiladi. Birinchi buyruq: `python3 -c "with open('file', 'rb') as f: print(f.read(16))"` — birinchi baytlarni ko'r. Done: `open(path, encoding="utf-8", errors="replace")` yoki to'g'ri encoding yoki binary mode ishlaydi, xato yo'q.

## Qachon ishlatish / ishlatmaslik
Ishlat: `open(path)` yoki `open(path, "r")` yoki `Path.read_text()` UnicodeDecodeError chiqarganda, ayniqsa 'utf-8' codec can't decode byte. CSV, log, user-uploaded, Windows-dan kelgan fayllar, binary (rasm, zip) ni text deb ochishda.
Ishlatma: fayl haqiqatan UTF-8 va encoding boshqa muammo (JSON invalid, etc.). Yoki `json.loads` xatosi. Yoki encoding ni bilib turib noto'g'ri qo'ygan bo'lsang.

## Mental model (nima uchun)
[SRC:https://docs.python.org/3/library/functions.html#open @ 3.10, 2026-11] `open(file, mode='r')` text mode da encoding ni default locale.getpreferredencoding(False) dan oladi (ko'p Linux da utf-8). Binary yoki boshqa encoding faylni decode qila olmaydi → UnicodeDecodeError. `errors` param (strict default) xato chiqaradi. "rb" binary mode da bayt qaytaradi, decode qilmaydi. Agentlar ko'pincha encoding="utf-8" qo'ymaydi yoki faylni tekshirmaydi. [SANDBOX: UTF-16LE BOM fayl open() da 0xff invalid start byte]

## Diagnosis tree (arzonidan qimmatiga)
1. Xato matnini o'qi: `UnicodeDecodeError: 'utf-8' codec can't decode byte 0xff in position 0: invalid start byte`. EXPECTED: 'utf-8' yoki boshqa codec, position, byte. Agar boshqa Exception → bu skill emas.

2. Fayl birinchi baytlarini ko'r (binary):
   ```bash
   python3 -c "with open('yourfile', 'rb') as f: print(f.read(32))"
   # yoki
   xxd -l 32 yourfile 2>/dev/null || python3 -c "import sys; print(open(sys.argv[1],'rb').read(32))" yourfile
   ```
   EXPECTED: b'\xff\xfe...' (UTF-16LE BOM) yoki b'\xef\xbb\xbf' (UTF-8 BOM) yoki oddiy ASCII yoki binary (zip PK\x03\x04, PNG \x89PNG). Agar \x00 ko'p → binary yoki UTF-16. [SANDBOX]

3. Encoding ni taxmin qil:
   ```bash
   python3 -c "
import chardet  # agar o'rnatilgan bo'lsa, aks holda skip
print('no chardet')" 2>/dev/null || true
python3 -c "
data = open('yourfile','rb').read(1024)
for enc in ['utf-8','utf-8-sig','latin1','cp1252','utf-16','utf-16le']:
    try:
        print(enc, ':', data.decode(enc)[:50])
        break
    except UnicodeDecodeError:
        print(enc, 'fail')
"
   ```
   EXPECTED: birorta encoding ishlaydi. Agar hammasi fail → binary yoki corrupted.

4. Locale ni tekshir:
   ```bash
   python3 -c "import locale; print(locale.getpreferredencoding())"
   ```
   EXPECTED: utf-8. Agar boshqa → default open shu encoding da.

## Fix har bir sabab uchun
Sabab 1 (eng ko'p): fayl UTF-8 emas, text kerak.  
Fix (copy-paste, encoding bilinsa):
```python
with open("file.txt", encoding="latin1", errors="replace") as f:  # yoki cp1252, utf-16le
    content = f.read()
```
Yoki pathlib:
```python
from pathlib import Path
content = Path("file.txt").read_text(encoding="utf-8", errors="replace")
```
Tekshir: xato yo'q, content o'qiladi.

Sabab 2: binary fayl (rasm, zip, executable) ni text deb ochyapsan.  
Fix:
```python
with open("file.bin", "rb") as f:
    data = f.read()
# keyin kerak bo'lsa decode qilma
```

Sabab 3: noma'lum encoding, xato o'rniga davom etish.  
Fix: `errors="replace"` yoki `"ignore"` yoki `"backslashreplace"`.
```python
with open("file.txt", encoding="utf-8", errors="replace") as f:
    content = f.read()
```
[SRC:https://docs.python.org/3/library/codecs.html#error-handlers @ 3.10]

Sabab 4: UTF-8 BOM. `encoding="utf-8-sig"`.

## Agentlar qayerda adashadi
1. Har doim encoding="utf-8" qo'yishni unutadi yoki default ga ishonadi — Windows fayllarida fail.
2. Binary faylni text mode da ochib, keyin .decode() qilish o'rniga to'g'ridan-to'g'ri open("r").
3. errors="ignore" ishlatib ma'lumot yo'qotishni e'tiborsiz qoldiradi; avval baytlarni ko'rish kerak.
4. chardet yoki file util ni o'rnatmasdan taxmin qiladi.

## Edge cases
1. Katta fayl: butunini o'qimasdan birinchi 1KB ni tekshir, keyin streaming.
2. Mixed encoding yoki corrupted: errors="replace" ishlat, keyin tozalash.
3. stdin yoki pipe: `sys.stdin.buffer` binary, yoki encoding aniq ber.
4. Python <3.0 da boshqacha, lekin 3.10+ da shu.

## Done criteria (isbotlovchi buyruqlar)
```bash
python3 -c "
with open('testfile', encoding='utf-8', errors='replace') as f:
    print(len(f.read()))
print('OK')
"  # xato chiqmasligi kerak
# yoki to'g'ri encoding bilan:
python3 -c "print(open('testfile', encoding='latin1').read()[:20])"
```
EXPECTED: "OK" va content, UnicodeDecodeError yo'q. [SANDBOX]

## Agar hali ham ishlamasa
- Fayl corrupted yoki to'liq binary — `file yourfile` yoki `xxd` bilan tekshir.
- Encoding ni aniq bilmasang, `errors="replace"` bilan o'qi, keyin tahlil qil.
- Boshqa Exception (PermissionError, FileNotFoundError) bo'lsa — tegishli skillga o't.

## Manbalar + ishonch
- [SRC:https://docs.python.org/3/library/functions.html#open @ Python 3.10 docs, 2026-11]
- [SRC:https://docs.python.org/3/library/codecs.html#error-handlers @ Python 3.10 docs, 2026-11]
- [SANDBOX] UTF-16LE va binary fayl bilan real xato va tuzatish tasdiqlandi. Confidence: high.
