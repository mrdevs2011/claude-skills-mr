---
name: python-used-eval-or-exec-on-untrusted-input
description: Python'da foydalanuvchi yoki tashqi manbadan kelgan ma'lumotni eval() yoki exec() ga berish — ixtiyoriy kod bajarilishi xavfi. Qachon kerak: eval/exec ishlatilgan va input ishonchsiz bo'lsa.
---

# Python'da ishonchsiz inputni eval/exec ga berish

## Nima uchun bu skill kerak

AI ba'zan "dinamik" narsa qilish uchun `eval()` yoki `exec()` ishlatadi. Agar argument foydalanuvchi, API, fayl yoki boshqa tashqi manbadan kelsa — bu to'liq kod bajarilishi (RCE) imkoniyatini ochadi. Model "faqat matematik ifoda" deb o'ylaydi, lekin hujumchi ixtiyoriy Python kodini yuborishi mumkin.

## Simptom (aynan shu)

Kodda quyidagi holatlardan biri ko'rinadi:

- `result = eval(user_input)`
- `exec(request.json["code"])`
- `eval(open("config.txt").read())` (fayl tashqi yoki o'zgartirilishi mumkin)
- `eval(f"1 + {user_expression}")` kabi string interpolyatsiya bilan

Va input ishonchsiz manbadan keladi (HTTP request, CLI arg, form, tashqi API, yuklangan fayl).

## Sabab (100%)

`eval()` va `exec()` o'z argumentidagi matnni to'liq Python kod sifatida bajaradi. Hech qanday sandbox yo'q. Foydalanuvchi `__import__('os').system('rm -rf /')` yoki shunga o'xshash narsa yuborishi mumkin. "Faqat oddiy ifoda" degan taxmin xavfsiz emas — parserlar va filterlar oson aylanib o'tiladi.

## Tasdiqlash

1. Kodda `eval(` yoki `exec(` qidir.
2. Argument qayerdan kelayotganini tekshir (user input, request, file, env, API).
3. Agar manba ishonchsiz bo'lsa — bu skill qo'llaniladi.
4. Ishonchli, o'zingiz yozgan, statik string bo'lsa — odatda xavfsiz (lekin baribir afzal emas).

## Tuzatish (aynan shu)

**Hech qachon ishonchsiz ma'lumotni `eval`/`exec` ga berma.**

### Oddiy matematik ifoda kerak bo'lsa:

```python
import ast

def safe_eval(expr: str) -> float:
    """Faqat literal sonlar va oddiy operatorlarni qabul qiladi."""
    try:
        node = ast.parse(expr, mode='eval')
        for subnode in ast.walk(node):
            if not isinstance(subnode, (ast.Expression, ast.BinOp, ast.UnaryOp,
                                         ast.Constant, ast.Num, ast.Load,
                                         ast.Add, ast.Sub, ast.Mult, ast.Div)):
                raise ValueError("Ruxsat etilmagan ifoda")
        return eval(compile(node, '<string>', 'eval'))  # endi xavfsiz, chunki AST tekshirildi
    except Exception:
        raise ValueError("Noto'g'ri ifoda")
```

Yoki yanada yaxshiroq — maxsus parser yoki `sympy`/`simpleeval` kabi kutubxona.

### Umumiy holat:

```python
# XATO
result = eval(user_input)

# TO'G'RI — aniq operatsiya
if user_input == "sum":
    result = sum(values)
elif user_input == "avg":
    result = sum(values) / len(values)
else:
    raise ValueError("Noma'lum operatsiya")
```

Yoki JSON/dict konfiguratsiya ishlat, kod emas.

## Xulosa — bu skillni o'qib nimani bilib oldingiz

- `eval()` va `exec()` ishonchsiz input bilan — to'g'ridan-to'g'ri RCE.
- "Faqat matematik" degan taxmin xavfli.
- O'rniga AST tekshiruvi, maxsus parser yoki aniq if/else ishlat.
- Statik, o'zingiz yozgan stringlar uchun ham afzal emas.
