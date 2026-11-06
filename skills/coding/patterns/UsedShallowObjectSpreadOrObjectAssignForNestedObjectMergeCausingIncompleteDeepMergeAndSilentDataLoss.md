---
name: used-shallow-object-spread-or-object-assign-for-nested-object-merge-causing-incomplete-deep-merge-and-silent-data-loss
description: Qachon nested obyektlarni merge qilish kerak bo'lsa, Object.assign yoki spread faqat shallow merge qiladi va ichki obyektlarni to'liq birlashtirmaydi.
---

# Nested obyektlarni shallow merge qilish to'liq birlashmagan ma'lumotga olib keladi

## Nima uchun bu skill kerak
Agent yoki kod yozuvchi nested konfiguratsiya, default options yoki API javoblarini birlashtirishda oddiy spread yoki Object.assign ishlatadi. Bu faqat birinchi darajadagi kalitlarni merge qiladi, ichki obyektlar esa to'liq almashtiriladi yoki yo'qoladi. Natijada kutilmagan data loss yoki noto'g'ri sozlamalar paydo bo'ladi.

## Simptom (aynan shu)
- `const merged = { ...defaults, ...userOptions }` yoki `Object.assign({}, defaults, userOptions)` ishlatilgan.
- `defaults` va `userOptions` ichida nested obyektlar bor (masalan `settings: { theme: {}, features: {} }`).
- Natijada userOptions dagi nested kalitlar defaults dagi ba'zi ichki qiymatlarni butunlay almashtiradi, qisman merge bo'lmaydi.
- Hech qanday xato chiqmaydi, faqat kutilmagan final obyekt.

## Sabab (100%)
JavaScript (va Python dict update/spread) shallow copy/merge qiladi. Nested obyektlar reference bo'yicha yoki to'liq overwrite qilinadi. Deep merge uchun maxsus funksiya yoki library (lodash.merge, deepmerge) yoki rekursiv yozilgan kod kerak. Agent buni oddiy spread yetarli deb o'ylaydi.

## Tasdiqlash
1. Kodda `{ ...a, ...b }` yoki `Object.assign` yoki `dict.update` nested data ustida ishlatilganmi?
2. Ikkala obyektda bir xil ichki kalitlar bormi?
3. Final natijada ichki obyektning ba'zi propertylari yo'qolganmi yoki to'liq almashtirilganmi?
4. Hech qanday deep merge utility chaqirilmaganmi?

## Tuzatish (aynan shu)
Shallow merge o'rniga deep merge ishlat:

JavaScript misoli (oddiy rekursiv):
```js
function deepMerge(target, source) {
  const output = { ...target };
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      output[key] = deepMerge(output[key] || {}, source[key]);
    } else {
      output[key] = source[key];
    }
  }
  return output;
}

const merged = deepMerge(defaults, userOptions);
```

Yoki lodash:
```js
import merge from 'lodash.merge';
const merged = merge({}, defaults, userOptions);
```

Python uchun:
```python
from copy import deepcopy
def deep_merge(a, b):
    result = deepcopy(a)
    for k, v in b.items():
        if k in result and isinstance(result[k], dict) and isinstance(v, dict):
            result[k] = deep_merge(result[k], v)
        else:
            result[k] = deepcopy(v)
    return result
```

Hech qachon nested data uchun oddiy spread/assign ishlatma.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Object spread va Object.assign faqat birinchi darajani merge qiladi.
- Nested obyektlar to'liq overwrite bo'ladi — silent data loss.
- Har doim deep merge utility yoki rekursiv funksiya ishlat, ayniqsa config va default options uchun.
