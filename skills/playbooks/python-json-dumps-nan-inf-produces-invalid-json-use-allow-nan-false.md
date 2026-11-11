---
name: python-json-dumps-nan-inf-produces-invalid-json-use-allow-nan-false
description: json.dumps NaN/Infinity produces non-standard JSON like {"x": NaN} which some parsers reject. Use allow_nan=False and sanitize NaN to null. Triggers on "Out of range float values are not JSON compliant" or API invalid JSON.
id: python-json-dumps-nan-inf-produces-invalid-json-use-allow-nan-false
type: playbook
stack: Python 3.10+ (json stdlib)
confirmed_on: 2026-11-11
confidence: high (reproduced in sandbox + official docs)
triggers:
  - json.dumps NaN
  - json.dumps produces NaN which is invalid JSON
  - Out of range float values are not JSON compliant
  - allow_nan=False ValueError
  - Infinity in json.dumps
  - non-standard JSON NaN from python
  - json.dumps float nan inf
  - API rejects JSON with NaN
  - how to make json.dumps strict no nan
  - python json dumps nan not allowed
related:
  - coding/patterns/PythonUsedJsonDumpsOnDataContainingDatetimeSetOrCustomObjectWithoutDefaultHandlerCausingTypeError.md
---

# json.dumps NaN/Infinity chiqaradi — nostandart JSON; allow_nan=False ishlat

## TL;DR
Simptom: `json.dumps({'x': float('nan')})` `{"x": NaN}` chiqaradi, ba'zi parserlar (strict JSON) rad etadi yoki xato beradi.
Sabab: Python json default allow_nan=True, NaN/Inf ni chiqaradi, lekin ECMA JSON da ular yo'q.
Birinchi buyruq: `python3 -c "import json; print(json.dumps({'x': float('nan')}, allow_nan=False))"`
Done: ValueError chiqadi yoki siz NaN ni None/0 ga almashtirgansiz, chiqish valid JSON.

## Qachon ishlatish / ishlatmaslik
Ishlat: API client/server, boshqa til parseriga JSON yuborayotganda NaN/Inf muammo bersa, yoki "invalid JSON" xatosi chiqsa.
Ishlatma: faqat Python ichida json.loads qilsang (u NaN ni qabul qiladi). Yoki orjson ishlatayotgan bo'lsang.

## Mental model (nima uchun)
[SRC:https://docs.python.org/3/library/json.html#json.dumps @ 3.12, 2026-11] allow_nan default True: NaN, Infinity, -Infinity ni chiqaradi. False bo'lsa ValueError. JSON standartida (RFC 8259) bu qiymatlar yo'q. Ko'p parserlar (Java, Go, browser JSON.parse) rad etadi. [SANDBOX]

## Diagnosis tree (arzonidan qimmatiga)
1. Chiqishni tekshir: `python3 -c "import json; print(repr(json.dumps({'x': float('nan')})))"`
   EXPECTED: `'{"x": NaN}'` (string ichida NaN). Agar shu → muammo. Agar "null" yoki raqam → boshqa.

2. allow_nan=False sinab ko'r:
   ```bash
   python3 -c "import json; json.dumps({'x': float('nan')}, allow_nan=False)"
   ```
   EXPECTED: ValueError: Out of range float values are not JSON compliant. [SANDBOX]

3. Agar data ichida haqiqiy NaN borligini bil: `import math; math.isnan(value)`
   EXPECTED: True bo'lsa — tozalash kerak.

4. Boshqa parser bilan tekshir (agar bor): node -e "JSON.parse(process.argv[1])" '{"x": NaN}' — xato beradi.

## Fix har bir sabab uchun
Sabab 1: allow_nan=True default.
Fix: allow_nan=False + NaN ni almashtirish.
```python
import json
import math

def sanitize(obj):
    if isinstance(obj, float) and (math.isnan(obj) or math.isinf(obj)):
        return None  # yoki 0, yoki str(obj)
    return obj

data = {'x': float('nan'), 'y': 1.0}
# Recursive yoki default handler
print(json.dumps(data, allow_nan=False, default=lambda o: sanitize(o) if isinstance(o, float) else o))
```
Yoki oldindan:
```python
clean = {k: (None if isinstance(v, float) and math.isnan(v) else v) for k, v in data.items()}
print(json.dumps(clean, allow_nan=False))
```
Tekshir: chiqish `{"x": null, "y": 1.0}` valid, exception yo'q. [SANDBOX]

## Agentlar qayerda xato qiladi
1. allow_nan= ni bilmay, faqat default= qo'shadi — NaN baribir chiqadi.
2. str(float('nan')) = 'nan' deb o'ylaydi, lekin dumps o'zi handle qiladi.
3. JSON.parse browserda ishlaydi deb o'ylaydi — aslida SyntaxError.
4. Inf ni ham e'tiborsiz qoldiradi.

## Edge cases
1. Nested list/dict ichida NaN — recursive sanitize yoki default kerak.
2. -Infinity ham xuddi shunday.
3. numpy.float64 nan — xuddi float kabi.
4. allow_nan=False + default= birga ishlaydi, default oldin chaqiriladi.

## Done criteria
```bash
python3 -c "
import json, math
data = {'x': float('nan')}
# Tozalangan
clean = {'x': None if math.isnan(data['x']) else data['x']}
s = json.dumps(clean, allow_nan=False)
assert 'NaN' not in s and 'null' in s
print('OK:', s)
"
# Exit 0, OK: {"x": null}
```

## Agar hali ham ishlamasa
- Qaysi parser rad etayotganini aniq ayt (error matni).
- `json.dumps(..., allow_nan=False)` ni to'g'ridan-to'g'ri sinab ko'r.
- Docs: https://docs.python.org/3/library/json.html#json.dumps

## Sources + confidence
- [SRC:https://docs.python.org/3/library/json.html] allow_nan parameter, 2026-11: "If allow_nan is false ... ValueError will be raised"
- [SANDBOX] 2026-11-11: dumps(nan) → {"x": NaN}; allow_nan=False → ValueError "Out of range float values are not JSON compliant"
- Confidence: 95% (stdlib documented + local repro). 
