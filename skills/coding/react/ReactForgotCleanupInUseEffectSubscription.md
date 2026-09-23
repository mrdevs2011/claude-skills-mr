---
name: react-forgot-cleanup-useeffect-subscription
description: useEffect ichida subscribe/timer/listener qo'shilgan, lekin return cleanup yo'q — memory leak, ikki marta event, yoki unmounted component da setState.
---

# React: useEffect da cleanup unutilgan

## Nima uchun bu skill kerak
AI `useEffect` da `addEventListener`, `setInterval`, WebSocket, yoki store.subscribe yozadi va `return () => {...}` cleanup ni unutadi. Component unmount bo'lganda listener qoladi — leak, yoki setState on unmounted component ogohlantirishi. Bu React effect qoidalarining muhim qismi.

## Simptom (aynan shu)
- Konsol: `Can't perform a React state update on an unmounted component`.
- Event ikki/uch marta ishlaydi (Strict Mode yoki re-mount da).
- `setInterval` / `addEventListener` useEffect da, return yo'q.
- Memory yoki listener soni o'sib boradi.

## Sabab (100%)
Effect side-effect ochadi, lekin yopish (cleanup) yozilmaydi. AI "subscribe qildim" deb to'xtaydi.

## Tasdiqlash
1. `useEffect` ichida listener, timer, subscription bormi?
2. `return () => { ... }` cleanup bormi?
3. Cleanup da o'sha listener/timer bekor qilinadimi?
4. Agar yo'q — leak xavfi.

## Tuzatish (aynan shu)
Har doim cleanup qaytaring:

```jsx
// XATO:
useEffect(() => {
  const id = setInterval(() => setCount(c => c + 1), 1000);
  window.addEventListener('resize', onResize);
  // cleanup yo'q
}, []);

// TO'G'RI:
useEffect(() => {
  const id = setInterval(() => setCount(c => c + 1), 1000);
  window.addEventListener('resize', onResize);
  return () => {
    clearInterval(id);
    window.removeEventListener('resize', onResize);
  };
}, []);

// WebSocket / subscribe:
useEffect(() => {
  const unsub = store.subscribe(handleChange);
  return () => unsub();
}, []);
```

Qoida: effect da ochilgan har bir resource — cleanup da yopiladi.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Subscribe/timer/listener = majburiy cleanup.
- Cleanup yo'q = leak va unmounted setState.
- AI effect yozib, return ni unutadi.
