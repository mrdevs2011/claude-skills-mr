---
name: react-conditional-hook-call
description: useState/useEffect/useMemo if, loop yoki shartli return dan keyin chaqirilgan — Rules of Hooks buziladi, "Rendered more hooks than during the previous render".
---

# React: hook shartli yoki noto'g'ri tartibda chaqirilgan

## Nima uchun bu skill kerak
AI `if (x) { useState(...) }` yoki early return dan keyin hook yozadi. React hook'larni har renderda bir xil tartibda chaqilishini kutadi. Shartli chaqiruv — tartib buziladi, xato yoki noto'g'ri state. Bu React'ning eng qat'iy qoidalaridan biri.

## Simptom (aynan shu)
- Xato: `Rendered more hooks than during the previous render`.
- Yoki: `React has detected a change in the order of Hooks called`.
- `useState`/`useEffect`/`useMemo`/`useCallback` if ichida yoki `return` dan keyin.
- Loop ichida hook chaqirilgan.

## Sabab (100%)
Rules of Hooks: hook'lar faqat React funksiya componenti (yoki custom hook) eng yuqori darajasida, shartsiz chaqiriladi. AI "agar kerak bo'lsa state yarat" deb if ichiga yozadi.

## Tasdiqlash
1. Barcha `use*` chaqiruvlarini toping.
2. Ulardan oldin `if`, `for`, `return`, `switch` bormi?
3. Har renderda bir xil son va tartibda chaqiladimi?
4. Agar yo'q — qoida buzilgan.

## Tuzatish (aynan shu)
Hook'larni har doim eng yuqorida, shartsiz chaqiring:

```jsx
// XATO:
function User({ id }) {
  if (!id) return null;
  const [user, setUser] = useState(null); // early return dan keyin
  useEffect(() => { ... }, [id]);
  return <div>{user?.name}</div>;
}

// TO'G'RI:
function User({ id }) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    if (!id) return;
    // ...
  }, [id]);
  if (!id) return null;
  return <div>{user?.name}</div>;
}

// XATO — if ichida:
if (isAdmin) {
  const [flag, setFlag] = useState(false);
}

// TO'G'RI — har doim chaqir, ichida shart:
const [flag, setFlag] = useState(false);
// isAdmin ni boshqa joyda ishlat
```

Qoida: barcha hook'lar — component boshida, hech qanday shart/loop/return siz. Shart — hook ichida yoki undan keyin.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Hook'lar har renderda bir xil tartibda chaqilishi shart.
- if/loop/early return ichida hook — taqiqlangan.
- AI "kerak bo'lsa chaqir" deb qoidani buzadi.
