---
name: forgot-types-package-typescript
description: TypeScript loyihada JS paket ishlatilgan, lekin @types/xxx o'rnatilmagan — "Could not find a declaration file" yoki any ga tushib qolish.
---

# TypeScript: @types paketi o'rnatilmagan

## Nima uchun bu skill kerak
AI `npm install lodash` qiladi va import qiladi, lekin TypeScript uchun `@types/lodash` ni qo'shmaydi. Natija: `Could not find a declaration file for module 'xxx'`. Yoki `any` bo'lib type-safety yo'qoladi. Bu deps skillining TypeScript-maxsus shakli.

## Simptom (aynan shu)
- Xato: `Could not find a declaration file for module '...'`.
- Yoki import qizil, lekin runtime ishlaydi.
- `package.json` da paket bor, `@types/...` yo'q.
- `noImplicitAny` yoki strict rejimda muammo.

## Sabab (100%)
Ko'p eski paketlar o'z ichida types olib yurmaydi — alohida `@types/xxx` kerak. AI faqat runtime paketni o'rnatadi.

## Tasdiqlash
1. TypeScript xatosidagi modul nomini oling.
2. `node_modules/xxx/package.json` da `types` yoki `typings` bormi?
3. `@types/xxx` o'rnatilganmi?
4. Agar yo'q va paket types bermasa — shu.

## Tuzatish (aynan shu)
Types paketini qo'shing yoki o'z deklaratsiyangizni yozing:

```bash
# Ko'p holatda:
npm install -D @types/lodash
npm install -D @types/node
npm install -D @types/react

# Agar @types yo'q bo'lsa — ambient:
# types/xxx.d.ts
declare module 'some-untyped-package';
```

```json
// tsconfig — agar kerak bo'lsa
{
  "compilerOptions": {
    "typeRoots": ["./node_modules/@types", "./types"]
  }
}
```

Qoida: TS loyihada yangi JS paket = types bormi deb tekshir. Yo'q bo'lsa `@types/` yoki `.d.ts`.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Runtime paket ≠ TypeScript tushunadi.
- `@types/xxx` ko'pincha alohida kerak.
- AI faqat npm install qilib, types ni unutadi.
