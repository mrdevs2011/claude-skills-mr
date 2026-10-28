---
name: python-json-dumps-non-serializable-type-error
description: json.dumps yoki json.dump chaqiruvi datetime, set, bytes, custom object kabi serializatsiya qilinmaydigan tipdagi ma'lumotni o'z ichiga olgan dict/list bilan ishlatilganda TypeError chiqadi.
---

# Python json.dumps non-serializable tip bilan TypeError

## Nima uchun bu skill kerak
Agentlar va skriptlar tez-tez API javobi, log, config yoki ma'lumotni JSON ga aylantiradi. Agar ichida `datetime`, `date`, `set`, `bytes`, `Decimal`, custom class instance bo'lsa, standart `json.dumps` TypeError beradi. Bu agent workflowlarida, API handlerlarda yoki data export qilishda keng tarqalgan.

## Simptom (aynan shu)
- Kodda `json.dumps(data)` yoki `json.dump(data, file)` bor.
- `data` ichida `datetime.datetime`, `datetime.date`, `set`, `bytes`, yoki oddiy class instance bor.
- Xato matni: `TypeError: Object of type datetime is not JSON serializable` (yoki set, bytes, Decimal va h.k.).
- Oddiy dict/list/str/int/float/bool/None bilan ishlaydi, lekin murakkab tip qo'shilganda buziladi.

## Sabab (100%)
Standart `json` moduli faqat asosiy tiplarni qo'llab-quvvatlaydi. `datetime`, `set`, custom object kabi narsalar uchun default encoder yo'q. Agent "JSON ga aylantiraman" deb `dumps` chaqiradi, lekin ma'lumotni oldindan tozalashni yoki `default=` parametrini unutadi.

## Tasdiqlash
1. Xato stacktrace'da `json.dumps` yoki `json.dump` ko'rinadimi?
2. Xato xabari "not JSON serializable" va tip nomini aytadimi (datetime, set, va h.k.)?
3. `data` ni print/repr qilib, ichida non-serializable tip bormi?
4. `default=` yoki custom `JSONEncoder` ishlatilganmi?

## Tuzatish (aynan shu)
Har doim `default=` parametrini bering yoki ma'lumotni oldindan tozalang.

```python
import json
from datetime import datetime, date
from decimal import Decimal

# Noto'g'ri (TypeError):
data = {
    "created": datetime.now(),
    "tags": {"a", "b"},
    "amount": Decimal("10.5")
}
json.dumps(data)  # TypeError

# To'g'ri — default handler bilan:
def json_default(obj):
    if isinstance(obj, (datetime, date)):
        return obj.isoformat()
    if isinstance(obj, set):
        return list(obj)
    if isinstance(obj, Decimal):
        return float(obj)  # yoki str(obj) aniqlik uchun
    if isinstance(obj, bytes):
        return obj.decode("utf-8", errors="replace")
    raise TypeError(f"Object of type {type(obj).__name__} is not JSON serializable")

result = json.dumps(data, default=json_default, ensure_ascii=False)

# Yoki oddiy holatlar uchun oldindan convert:
clean_data = {
    "created": datetime.now().isoformat(),
    "tags": list({"a", "b"}),
    "amount": str(Decimal("10.5"))
}
json.dumps(clean_data)
```

Qoidalar:
- `default=` funksiyasi faqat qo'llab-quvvatlanmagan tipni qaytarsin, qolganini `raise TypeError`.
- Aniqlik muhim bo'lsa (pul), Decimal ni `str` qiling, `float` emas.
- Agar tez-tez ishlatilsa, subclass `json.JSONEncoder` yozib, `cls=` bilan ishlating.
- `ensure_ascii=False` o'zbek/boshqa tillar uchun.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- `json.dumps` faqat asosiy tiplarni biladi; datetime/set/custom uchun `default=` kerak.
- Xato chiqsa, avval ma'lumot strukturasini tekshir, keyin handler qo'sh.
- Oldindan tozalash yoki default handler ikkalasi ham ishlaydi; handler qulayroq.
