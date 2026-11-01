---
name: used-string-concatenation-or-hardcoded-separators-for-file-path-construction-instead-of-pathlib
description: Fayl yo'llarini string concatenation yoki hardcoded separatorlar bilan yig'ish portativ emas va xato oson; pathlib.Path yoki os.path.join ishlatish kerak.
---

# Fayl yo'llarini string bilan yig'ish o'rniga pathlib ishlatish

## Nima uchun bu skill kerak
String concatenation (`+`) yoki hardcoded `/` yoki `\\` bilan path yig'ish turli OS'larda (Windows vs Unix) xato beradi, relative/absolute aralashganda muammo chiqadi va o'qish qiyin. `pathlib` yoki `os.path` platformadan mustaqil va xavfsiz.

## Simptom (aynan shu)
Kod ba'zi mashinalarda ishlaydi, boshqalarida `FileNotFoundError` yoki noto'g'ri path. Masalan, Windows'da `/` ishlaydi ba'zan, lekin `\\` bilan yoki mixed. Yoki `base + "/" + file` relative path'da xato.

## Sabab (100%)
Path separatorlari OS-ga bog'liq (`os.sep`). String `+` absolute/relative ni to'g'ri birlashtirmaydi (masalan, absolute keyin relative qo'shsa noto'g'ri). `pathlib.Path` operatorlari va metodlari buni to'g'ri boshqaradi.

## Tasdiqlash
Kodda path yig'ish qidir: `+` bilan string, `"/" +`, `"\\" +`, yoki f-string bilan separator. Test:

```python
from pathlib import Path
base = Path("/tmp")
print(base / "file.txt")  # to'g'ri
# noto'g'ri: base_str + "/file.txt"
```

## Tuzatish (aynan shu)
Doim `pathlib.Path` ishlat (Python 3.4+). `/` operatori bilan yig':

```python
from pathlib import Path

base = Path("/workspace")
full = base / "artifacts" / "output.txt"
full.write_text("data")

# yoki os.path (eski kod uchun)
import os
full = os.path.join("/workspace", "artifacts", "output.txt")
```

Hardcoded separator yoki `+` o'rniga shu.

Agar eski Python yoki oddiy string kerak bo'lsa, `os.path.join`.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Fayl pathlarini string concatenation bilan yig'ma. `pathlib.Path` (yoki `os.path.join`) ishlat — portativ, xavfsiz va o'qilishi oson. Absolute/relative aralashishni to'g'ri boshqaradi.
