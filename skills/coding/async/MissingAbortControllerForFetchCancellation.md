---
name: missing-abort-controller-fetch
description: fetch/so'rov component unmount yoki yangi so'rov kelganda bekor qilinmagan — eski javob kelib state ni yangilaydi, race yoki unmounted setState.
---

# fetch bekor qilinmagan (AbortController yo'q)

## Nima uchun bu skill kerak
AI `useEffect` da `fetch` yozadi. Component unmount bo'ladi yoki dependency o'zgarib yangi so'rov ketadi — eski so'rov hali javob kutmoqda. Eski javob kelib `setState` qiladi: noto'g'ri ma'lumot yoki unmounted warning. AbortController bilan bekor qilish kerak.

## Simptom (aynan shu)
- Tez navigatsiya/filter da eski ma'lumot ko'rinadi.
- `Can't perform a React state update on an unmounted component`.
- `useEffect` da fetch, cleanup da abort yo'q.
- Race: ketma-ket so'rovlar, oxirgi emas oldingisi state ni yozadi.

## Sabab (100%)
Fetch odatda bekor qilinmaydi. AI faqat `.then(setData)` yozadi, signal/abort ni unutadi.

## Tasdiqlash
1. useEffect/async da fetch bormi?
2. Cleanup da `controller.abort()` bormi?
3. Dependency tez-tez o'zgaradimi (search, id)?
4. Agar abort yo'q — xavf bor.

## Tuzatish (aynan shu)
AbortController ishlating:

```jsx
// XATO:
useEffect(() => {
  fetch(`/api/users/${id}`)
    .then(r => r.json())
    .then(setUser);
}, [id]);

// TO'G'RI:
useEffect(() => {
  const controller = new AbortController();
  fetch(`/api/users/${id}`, { signal: controller.signal })
    .then(r => r.json())
    .then(setUser)
    .catch(e => {
      if (e.name === 'AbortError') return;
      setError(e);
    });
  return () => controller.abort();
}, [id]);
```

Qoida: effect da fetch = AbortController + cleanup da abort. Eski javob state yozmasin.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Unmount/yangi so'rov = eski fetch ni bekor qiling.
- AbortController — standart yechim.
- AI fetch yozib, cancel ni unutadi — race va warning.
