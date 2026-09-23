---
name: async-unhandled-rejection-crash
description: Konsolda "UnhandledPromiseRejectionWarning" yoki "Unhandled promise rejection" chiqadi, yoki process kutilmaganda to'xtaydi/qayta ishga tushadi, log'da aniq stack trace yo'q — sabab aynan bitta, try/catch qilinmagan reject bo'lgan promise.
---

# Async: "Unhandled promise rejection" / process jim to'xtaydi

## Nima uchun bu skill kerak
Bu holatda log ko'pincha noaniq yoki umuman yo'q — process shunchaki
to'xtaydi. Aynan qaysi joyda `try/catch` yetishmayotganini tez topish
uchun bu skill kerak, taxmin qilib har joyga `try/catch` sepib chiqishdan
saqlanish uchun.

## Simptom (aynan shu)
- Konsolda `UnhandledPromiseRejectionWarning` yoki `Unhandled promise rejection` yozuvi bor.
- Yoki (ba'zi runtime/process manager'larda) process hech qanday tushunarli xatosiz to'xtab qoladi yoki qayta ishga tushadi.

## Sabab (100%)
Qayerdadir `await` qilingan (yoki `.then()`siz chaqirilgan) promise
`reject` bo'lgan, lekin uni tutib oladigan `try/catch` (yoki `.catch()`)
yo'q. Node/brauzer buni "boshqarilmagan xato" deb belgilaydi.

## Tasdiqlash
Xato xabaridagi stack trace'da (bo'lsa) qaysi `await` qatoridan
boshlanganini top. Agar stack trace yo'q yoki noaniq bo'lsa — oxirgi
o'zgartirilgan yoki eng ko'p tashqi resurs (API, DB, fayl) bilan
ishlaydigan `await` zanjirlarini birma-bir tekshir: har birida tashqi
`try/catch` bormi?

## Tuzatish (aynan shu)
```js
// XATO: reject bo'lsa hech kim tutmaydi
async function run() {
  const data = await fetchSomething(); // shu yerda reject bo'lishi mumkin
}
run();

// TO'G'RI:
async function run() {
  try {
    const data = await fetchSomething();
  } catch (err) {
    // logla yoki qayta ishla — jim yutib yubormaslik kerak
    console.error("fetchSomething xato berdi:", err.message);
  }
}
run();
```

Har bir "tashqi dunyo bilan gaplashadigan" (tarmoq, fayl, DB) `await`
zanjiri kamida bitta joyda `try/catch`ga o'ralganini tasdiqla.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Sabab: reject bo'lgan promise `try/catch`siz `await` qilingan.
- Tuzatish: o'sha `await` zanjirini `try/catch`ga o'rash, xatoni loglash
  yoki qayta ishlash, jim yutib yubormaslik.
