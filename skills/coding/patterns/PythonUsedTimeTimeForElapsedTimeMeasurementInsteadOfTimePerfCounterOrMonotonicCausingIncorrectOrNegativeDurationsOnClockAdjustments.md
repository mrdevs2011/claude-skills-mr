---
name: python-used-time-time-for-elapsed-measurement-instead-of-perf-counter
description: O'tgan vaqtni o'lchash uchun time.time() ishlatilganda tizim soati o'zgarsa noto'g'ri yoki manfiy duration chiqadi; time.perf_counter() yoki time.monotonic() ishlatish kerak.
---

# O'tgan vaqt o'lchashda time.time() o'rniga time.perf_counter() ishlatish

## Nima uchun bu skill kerak
time.time() tizim soatiga bog'liq (wall-clock). NTP sinxronizatsiyasi, qo'lda soat o'zgartirish yoki VM suspend/resume da soat orqaga ketishi mumkin. Natijada duration manfiy yoki noto'g'ri chiqadi. Performance o'lchash va timeoutlar uchun monoto'n soat kerak.

## Simptom (aynan shu)
- start = time.time(); ...; duration = time.time() - start
- Ba'zan duration manfiy chiqadi yoki kutilganidan ancha kichik/katta.
- Xususan server, long-running process yoki soat o'zgartiriladigan muhitda.
- Logda "elapsed: -0.3s" yoki zero'ga yaqin noto'g'ri qiymat.

## Sabab (100%)
time.time() Unix epoch dan wall-clock vaqtni qaytaradi. U monoto'n emas — tizim soati o'zgarsa qiymat ham o'zgaradi. time.perf_counter() va time.monotonic() esa monoto'n soatlar: ular orqaga ketmaydi, faqat oldinga harakat qiladi. Perf_counter aniqroq (CPU vaqtiga yaqin), monotonic oddiy monoto'n.

## Tasdiqlash
Kodda o'tgan vaqt hisoblash uchun time.time() ishlatilganligini qidir. Test:

```python
import time
start = time.time()
time.sleep(0.1)
print(time.time() - start)  # odatda ~0.1, lekin soat o'zgarsa noto'g'ri
```

Agar manfiy yoki g'alati chiqsa — bu holat.

## Tuzatish (aynan shu)
Har doim performance yoki elapsed time uchun time.perf_counter() (yoki time.monotonic()) ishlat.

```python
import time

# Noto'g'ri
start = time.time()
do_work()
elapsed = time.time() - start

# To'g'ri
start = time.perf_counter()
do_work()
elapsed = time.perf_counter() - start

# Yoki timeout uchun
deadline = time.monotonic() + 5.0
while time.monotonic() < deadline:
    ...
```

time.time() faqat wall-clock kerak bo'lganda (log timestamp, "hozir soat nechchi") ishlat.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
O'tgan vaqtni o'lchash uchun hech qachon time.time() ishlatma — soat o'zgarsa buziladi. time.perf_counter() yoki time.monotonic() monoto'n va ishonchli. Bu performance profiling va timeoutlar uchun standart.
