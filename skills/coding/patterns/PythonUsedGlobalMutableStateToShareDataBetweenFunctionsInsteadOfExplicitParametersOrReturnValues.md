---
name: python-global-mutable-state-share-data
description: Funksiyalar orasida ma'lumot almashish uchun global mutable o'zgaruvchi ishlatilganda, kutilmagan yon ta'sirlar va test qilish qiyinligi paydo bo'ladi. Aniq parametr yoki return qiymat ishlatilishi kerak.
---

# Python'da global mutable state orqali ma'lumot almashish

## Nima uchun bu skill kerak
Agentlar ba'zan "oddiy" deb global ro'yxat yoki dict yaratib, bir nechta funksiyadan o'zgartirishadi. Bu kodni noaniq qiladi, testlashni qiyinlashtiradi va parallel yoki qayta chaqiruvlarda xatolarga olib keladi. Aniq parametr va qaytarish qiymati ishlatish toza va ishonchli.

## Simptom (aynan shu)
- Kodda `global results` yoki `global config` kabi e'lonlar bor.
- Bir funksiya global list/dict ga append/update qiladi, boshqasi o'qiydi.
- Funksiyalarni alohida chaqirganda yoki test qilganda kutilmagan oldingi holat saqlanib qoladi.
- Import qilingan modulda global o'zgaruvchi boshqa joylardan o'zgartiriladi.
- Kod o'qilishi qiyin: qayerdan qiymat kelayotgani aniq emas.

## Sabab (100%)
Global o'zgaruvchilar modul scope'da yashaydi va barcha funksiyalar tomonidan bo'lishiladi. Mutable bo'lsa (list, dict), o'zgarishlar boshqa chaqiruvlarga o'tadi. Bu implicit dependency yaratadi — funksiya imzosidan ko'rinmaydi.

## Tasdiqlash
1. Kodda `global` kalit so'zi borligini tekshir.
2. Funksiya ichida global o'zgaruvchini o'zgartirish (append, update, assignment) bormi?
3. Funksiyani ikki marta chaqirib, ikkinchisida birinchining o'zgarishi ta'sir qilyaptimi?
4. Unit test yozishga urin: globalni reset qilish kerak bo'lsa, bu belgi.

## Tuzatish (aynan shu)
Global o'rniga aniq parametr va return ishlat. Holat kerak bo'lsa, class yoki context manager.

```python
# Noto'g'ri (global mutable):
results = []

def add_result(value):
    global results
    results.append(value)

def get_results():
    return results

add_result("a")
print(get_results())  # ['a']
# Keyingi import yoki chaqiruvda hali ham ['a'] qoladi

# To'g'ri (explicit):
def add_result(value, results=None):
    if results is None:
        results = []
    results.append(value)
    return results

def process_items(items):
    results = []
    for item in items:
        results = add_result(item, results)
    return results

print(process_items(["a", "b"]))  # ['a', 'b']
# Har chaqiruv mustaqil
```

Agar holat saqlash kerak bo'lsa, class ishlat:

```python
class ResultCollector:
    def __init__(self):
        self.results = []
    
    def add(self, value):
        self.results.append(value)
    
    def get(self):
        return self.results.copy()
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Global mutable state implicit dependency va test qiyinligini keltirib chiqaradi.
- Har doim parametr + return yoki class orqali aniq qiling.
- Bu agentlar yozgan "tez" kodda tez-tez uchraydi — imzo aniq bo'lishi kerak.
