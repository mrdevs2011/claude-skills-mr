---
name: python-used-json-loads-on-malformed-input-without-try-except
description: json.loads yoki json.load chaqirilganda noto'g'ri yoki bo'sh JSON input tufayli JSONDecodeError chiqadi, chunki try/except bilan o'ralmagan. Qachon: tashqi API, fayl yoki foydalanuvchi inputidan JSON o'qilayotganda xato e'tiborsiz qoldiriladi.
---

# Python Used Json Loads On Malformed Input Without Try Except

## Nima uchun bu skill kerak
Tashqi manbalardan (API javobi, fayl, foydalanuvchi kiritgan matn) kelgan JSON har doim to'g'ri bo'lishi shart emas. Try/except'siz `json.loads` yoki `json.load` ishlatilsa, bitta noto'g'ri belgi yoki bo'sh string butun dasturini to'xtatadi. Bu skill shu aniq xatoni oldini oladi.

## Simptom (aynan shu)
```
json.decoder.JSONDecodeError: Expecting value: line 1 column 1 (char 0)
```
yoki
```
json.decoder.JSONDecodeError: Extra data: line 1 column 5 (char 4)
```
Dastur to'xtaydi, stack trace chiqadi, foydalanuvchiga tushunarli xato xabari yo'q.

## Sabab (100%)
`json.loads(raw_string)` yoki `json.load(file_obj)` chaqiruvi try/except bloki ichida emas. Input bo'sh, noto'g'ri formatlangan, yoki kutilmagan qo' shimcha ma'lumot o'z ichiga olgan. Validatsiya yoki xato ushlash qo'shilmagan.

## Tasdiqlash
- Xato matnida aniq `JSONDecodeError` bor.
- Kodda `json.loads` yoki `json.load` chaqiruvi try/except bilan o'ralmagan.
- Input manbai tashqi (API, fayl, request body) ekanligini tekshir.
- `python -c "import json; json.loads('')"` ni ishga tushirib xuddi shu xatoni qayta hosil qilish mumkin.

## Tuzatish (aynan shu)
Har doim try/except bilan o'ra va aniq xato xabari ber:

```python
import json

def parse_json_safely(raw: str) -> dict | None:
    try:
        return json.loads(raw)
    except json.JSONDecodeError as e:
        # Log qil yoki foydalanuvchiga tushunarli xabar ber
        print(f"JSON parse xatosi: {e}")
        return None

# Fayl uchun:
def load_json_file(path: str) -> dict | None:
    try:
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    except (json.JSONDecodeError, OSError) as e:
        print(f"Fayl JSON o'qish xatosi: {e}")
        return None
```

Bo'sh string yoki noto'g'ri formatni oldindan tekshirish ham qo'shilishi mumkin, lekin asosiy himoya try/except.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Tashqi yoki ishonchsiz manbadan kelgan JSON ni `json.loads`/`json.load` bilan o'qishdan oldin har doim try/except `JSONDecodeError` bilan o'rash kerak. Aks holda bitta noto'g'ri input butun jarayonni to'xtatadi. Bu oddiy, lekin juda keng tarqalgan xato.
