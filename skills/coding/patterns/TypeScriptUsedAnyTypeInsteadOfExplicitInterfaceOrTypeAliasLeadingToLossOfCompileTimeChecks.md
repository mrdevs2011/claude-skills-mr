---
name: typescript-used-any-type
description: TypeScript kodida any tipini ishlatish — kompilyatsiya vaqtidagi tekshiruvlar yo'qoladi, runtime xatolari paydo bo'ladi, type safety buziladi.
---

# TypeScript'da any tipini ishlatish

## Nima uchun bu skill kerak
Agentlar yoki dasturchilar TypeScript'da tezlik uchun any ishlatadi. Bu type checker'ni o'chiradi, xatolarni yashiradi va keyinchalik ishlatishda TypeError yoki noto'g'ri data shakli bilan muammo chiqadi. TypeScript'ning asosiy foydasi yo'qoladi.

## Simptom (aynan shu)
- O'zgaruvchi yoki funksiya parametri any deb belgilangan.
- IDE/type checker hech qanday xato ko'rsatmaydi, lekin runtime'da property access yoki method chaqiruvi xato beradi.
- Refactor qilganda tip xatolari sezilmaydi.
- any ishlatilgan joyda autocomplete ishlamaydi yoki noto'g'ri.

## Sabab (100%)
"TypeScript murakkab, any bilan tezroq yozaman" yoki "tashqi API tipi noma'lum" deb o'ylab, to'g'ri interface/type yozish o'rniga any ishlatiladi. unknown + type guard o'rniga ham any tanlanadi.

## Tasdiqlash
- Kodda `: any` yoki `as any` bormi?
- any ishlatilgan o'zgaruvchi keyinroq xavfsiz ishlatilayaptimi (property check yo'qmi)?
- Tashqi data uchun interface yozilmaganmi?

## Tuzatish (aynan shu)
any o'rniga aniq tip yoki unknown + guard ishlat:

Yomon:
```ts
function processData(data: any) {
  return data.items.map((item: any) => item.name);
}
```

Yaxshi:
```ts
interface Item {
  name: string;
  id: number;
}

interface Response {
  items: Item[];
}

function processData(data: Response) {
  return data.items.map(item => item.name);
}

// Yoki noma'lum uchun:
function processUnknown(data: unknown) {
  if (typeof data === 'object' && data !== null && 'items' in data) {
    // type guard
    const typed = data as Response;
    return typed.items.map(item => item.name);
  }
  throw new Error('Invalid data shape');
}
```

- Tashqi API uchun alohida interface yoz.
- Zarurat bo'lsa unknown + type predicate ishlat, any emas.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- TypeScript'da any ishlatma — u type safety'ni butunlay o'chiradi.
- Aniq interface/type yoz yoki unknown + type guard ishlat.
- Bu runtime xatolarini kompilyatsiya vaqtida ushlash imkonini beradi va kodni ishonchli qiladi.
