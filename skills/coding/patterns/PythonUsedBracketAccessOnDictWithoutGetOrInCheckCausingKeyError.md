---
name: python-dict-bracket-access-without-get-causing-keyerror
description: Dict'dan kalitni [key] bilan olish, .get() yoki 'in' tekshiruvisiz. Kalit yo'q bo'lsa KeyError chiqadi, xato yuzaga keladi.
---

# Python'da dict[key] o'rniga .get() yoki 'in' tekshiruvi

## Nima uchun bu skill kerak
Agentlar tez-tez API javobi, config yoki user input'dan kelgan dict'dan kalitni to'g'ridan-to'g'ri `data["key"]` bilan oladi. Kalit yo'q yoki nom noto'g'ri bo'lsa darhol KeyError chiqadi. Bu productionda yoki edge case'da crash qiladi, default qiymat berish yoki xatoni yumshoq ushlash yo'q.

## Simptom (aynan shu)
- Kodda `value = data["required_key"]` yoki `obj["field"]` ishlatilgan.
- Oldindan `"key" in data` yoki `data.get("key")` yo'q.
- KeyError: 'xxx' xatosi chiqadi, ayniqsa tashqi ma'lumot (JSON, API, form) bilan.
- Default qiymat berilmagan, yoki try/except KeyError bilan qamrab olingan lekin ildiz sabab qolgan.
- Kalit nomi hardcode yoki taxminiy, schema tekshirilmagan.

## Sabab (100%)
Tez yozish: `data["key"]` eng qisqa. Agent ma'lumot har doim to'liq keladi deb taxmin qiladi, yoki "bu test" deb o'tadi. .get() yoki explicit checkni unutadi.

## Tasdiqlash
1. Kodda `dict["somekey"]` yoki `mapping[key]` chaqiruvlari bormi?
2. Oldindan `if key in data:` yoki `data.get(key, default)` ishlatilganmi?
3. Tashqi manbadan (API, JSON, env) kelgan dict'mi?
4. KeyError xatosi yoki uning izi bormi?

## Tuzatish (aynan shu)
Bracket access o'rniga .get() yoki 'in' tekshiruvi ishlat:

```python
# Noto'g'ri:
user_id = response["user"]["id"]          # KeyError agar "user" yoki "id" yo'q
status = data["status"]                   # KeyError

# To'g'ri:
user = response.get("user") or {}
user_id = user.get("id")                  # None yoki default
# yoki
if "status" in data:
    status = data["status"]
else:
    status = "unknown"                    # yoki log qil va default

# Yoki bir qatorda default bilan:
status = data.get("status", "unknown")
user_id = response.get("user", {}).get("id")
```

Qoidalar:
- Tashqi yoki o'zgaruvchan ma'lumot uchun har doim .get(key, default) yoki 'in' tekshir.
- Nested uchun zanjirli .get() yoki helper funksiya.
- KeyError ni try/except bilan yashirma — ildizni tekshir (schema, validation).
- Agar kalit majburiy bo'lsa, avval validate qil, keyin access.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- `dict["key"]` faqat kalit 100% mavjudligiga ishonching bo'lsa ishlat.
- API/JSON/config uchun .get() yoki explicit 'in' check KeyError'ni oldini oladi.
- Default qiymat berish crash o'rniga yumshoq davom etish imkonini beradi.
