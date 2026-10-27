---
name: python-global-keyword-module-level-mutation
description: Python da `global` kalit so'zi bilan modul darajasidagi o'zgaruvchini o'zgartirish — kutilmagan side-effect va testlash qiyinligi. Qachon kerak: funksiya ichida global o'zgaruvchini o'zgartirayotgan kod topilganda.
---

# PythonUsedGlobalKeywordToModifyModuleLevelVariableInsteadOfReturningValue

## Nima uchun bu skill kerak
Python'da `global` kalit so'zi funksiya ichidan modul darajasidagi o'zgaruvchini o'zgartirishga imkon beradi. Bu yashirin side-effect yaratadi, kodni testlashni qiyinlashtiradi, parallel yoki qayta ishlatishda xato beradi. Bu skill aynan shu holatni aniqlash va tuzatish uchun: o'zgaruvchini qaytarish yoki parametr orqali uzatish.

## Simptom (aynan shu)
- Funksiya ichida `global some_var` yozilgan va `some_var = ...` qilinadi.
- Modul darajasida `some_var = initial` bor.
- Funksiyani chaqirgandan keyin `some_var` qiymati o'zgargan (kutilmagan).
- Bir necha funksiya bir xil global'ni o'zgartiradi, tartibga bog'liq xato chiqadi.
- Unit testlarda oldingi testning o'zgarishi keyingisiga ta'sir qiladi.

## Sabab (100%)
`global` kalit so'zi funksiya lokal o'zgaruvchi o'rniga modul global'ini bog'laydi. Bu Python'ning LEGB qoidasini chetlab o'tadi va yashirin o'zgarish (side-effect) yaratadi. Kod o'qilishi va xatolik topishi qiyinlashadi, chunki o'zgarish funksiya imzosida ko'rinmaydi.

## Tasdiqlash
1. Kodda `global ` so'zini qidiring.
2. U qayerda ishlatilganini va qaysi o'zgaruvchini o'zgartirayotganini ko'ring.
3. O'sha o'zgaruvchi modul darajasida e'lon qilinganmi tekshiring.
4. Funksiyani ikki marta chaqirib, global qiymat o'zgarganini tasdiqlang.
5. Agar funksiya qiymat qaytarmasa va faqat global'ni o'zgartirsa — bu skill holati.

## Tuzatish (aynan shu)
`global` ni olib tashlang. Qiymatni funksiyadan `return` qiling yoki parametr sifatida qabul qiling va yangi qiymatni qaytaring. Agar holat saqlash kerak bo'lsa, class yoki aniq data structure ishlating.

Misol (noto'g'ri):
```python
counter = 0

def increment():
    global counter
    counter += 1
    # hech narsa qaytarmaydi

increment()
print(counter)  # 1 — yashirin o'zgarish
```

Misol (to'g'ri):
```python
def increment(counter: int) -> int:
    return counter + 1

counter = 0
counter = increment(counter)
print(counter)  # 1 — aniq
```

Yoki class bilan:
```python
class Counter:
    def __init__(self):
        self.value = 0
    def increment(self):
        self.value += 1
        return self.value
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- `global` yashirin side-effect yaratadi va testlashni buzadi.
- Doim qiymatni qaytaring yoki parametr orqali uzating.
- Holat saqlash kerak bo'lsa class yoki aniq container ishlating, global o'zgaruvchi emas.
