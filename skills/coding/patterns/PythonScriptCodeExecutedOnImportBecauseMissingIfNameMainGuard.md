---
name: python-script-code-executed-on-import-because-missing-if-name-main-guard
description: Python file contains executable code at module level without if __name__ == "__main__" guard, so the code runs immediately when the module is imported, causing unwanted side effects or errors.
---

# PythonScriptCodeExecutedOnImportBecauseMissingIfNameMainGuard

## Nima uchun bu skill kerak
Python modullari import qilinganda barcha top-level kod bajariladi. Agar skript logikasi (main() chaqirish, server ishga tushirish, fayl yozish) `if __name__ == "__main__":` ostida bo'lmasa, modul boshqa joydan import qilinganda ham avtomatik ishga tushadi. Bu testlarda, kutubxona sifatida ishlatilganda yoki circular importlarda muammo yaratadi.

## Simptom (aynan shu)
- Modulni import qilganda (`import my_script`) darhol chiqish, server ishga tushishi yoki side-effect bo'ladi.
- Testlar import qilganda asosiy logika ishlaydi.
- "Import qildim, lekin u o'zi ishga tushdi" holati.
- Circular import yoki unwanted execution xatolari.
- Skript sifatida ishlaydi (`python my_script.py`), lekin import qilganda ham xuddi shunday qiladi.

## Sabab (100%)
Top-level kod import vaqtida bajariladi. `__name__` o'zgaruvchisi skript sifatida ishga tushirilganda `"__main__"`, import qilinganda modul nomi bo'ladi. Guard bo'lmasa, farq qilinmaydi.

## Tasdiqlash
1. Faylda `if __name__ == "__main__":` yo'qligini tekshir.
2. Boshqa fayldan import qilib, side-effect bor-yo'qligini ko'r.
3. `python -c "import my_module"` bilan sinab ko'r.

## Tuzatish (aynan shu)
Asosiy logikani funksiyaga ajrat va faqat main ostida chaqir:

```python
# Noto'g'ri
print("Starting...")
result = do_work()
print(result)

# To'g'ri
def main():
    print("Starting...")
    result = do_work()
    print(result)

if __name__ == "__main__":
    main()
```

Qoidalar:
- Barcha executable top-level kodni `main()` ga ko'chir.
- Faqat constant, function/class definitionlar top-level'da qolsin.
- Bu skript va library ikkalasi sifatida ishlatish imkonini beradi.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Python'da top-level kod import vaqtida ishga tushadi. Skript logikasini `if __name__ == "__main__":` ostiga qo'yish kerak, aks holda import qilinganda ham bajariladi va noxush side-effectlar yuzaga keladi.
