---
name: python-time-time-for-elapsed-duration-instead-of-perf-counter
description: Python kodda elapsed vaqtni o'lchash uchun time.time() ishlatilgan — monotonic emas, soat o'zgarishi yoki tizim vaqti tuzatilishi natijasini buzishi mumkin; time.perf_counter() kerak.
---

# Python da elapsed vaqtni o'lchash uchun time.time() ishlatish

## Nima uchun bu skill kerak
time.time() tizim soatiga bog'liq (wall-clock). Soat orqaga qaytsa (NTP tuzatish, leap second, virtual mashina), o'lchangan davomiylik manfiy yoki noto'g'ri chiqishi mumkin. time.perf_counter() monotonic va yuqori aniqlikdagi o'lchov uchun mo'ljallangan.

## Simptom (aynan shu)
- Kodda `start = time.time()` keyin `elapsed = time.time() - start` ko'rinishi.
- Ba'zan elapsed manfiy, 0, yoki kutilganidan ancha farq qiladi.
- Benchmark yoki timeout hisoblashida noto'g'ri natija.
- Loglarda "duration negative" yoki o'ta katta qiymatlar.

## Sabab (100%)
time.time() system clock ni qaytaradi. U monotoon emas — tizim soati o'zgarsa qiymat sakrashi mumkin. Elapsed vaqt uchun time.perf_counter() (yoki time.monotonic()) ishlatilishi kerak, chunki ular soat tuzatishlaridan ta'sirlanmaydi va yuqori resolution beradi.

## Tasdiqlash
1. time.time() dan ikki marta chaqirib farq olinayaptimi (elapsed hisoblash)?
2. time.perf_counter yoki time.monotonic ishlatilmaganmi?
3. Agar ha — bu holat. perf_counter ga o'zgartir.

## Tuzatish (aynan shu)
Elapsed (davomiylik) uchun time.perf_counter() ishlat.

Noto'g'ri:
```python
import time
start = time.time()
# ... ish ...
elapsed = time.time() - start
print(f"Took {elapsed:.3f}s")
```

To'g'ri:
```python
import time
start = time.perf_counter()
# ... ish ...
elapsed = time.perf_counter() - start
print(f"Took {elapsed:.3f}s")
```

Agar faqat joriy wall-clock vaqt kerak bo'lsa (log timestamp), time.time() yoki datetime.now() saqlanadi. Faqat farq/duration uchun perf_counter.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Elapsed vaqt o'lchash uchun doim time.perf_counter() ishlat — u monotoon va aniq. time.time() faqat wall-clock timestamp uchun. Bu soat tuzatishlari natijasida noto'g'ri duration chiqishini oldini oladi.
