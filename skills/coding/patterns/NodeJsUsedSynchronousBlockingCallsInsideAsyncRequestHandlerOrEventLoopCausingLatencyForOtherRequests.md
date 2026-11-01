---
name: nodejs-sync-calls-block-event-loop
description: Node.js async request handler, middleware yoki event loop kontekstida fs.readFileSync, child_process.execSync, yoki boshqa sinxron I/O chaqiruvi boshqa so'rovlarni bloklaydi va latency oshiradi.
---

# Node.js'da sinxron bloklovchi chaqiruvlar async kontekstda event loop'ni to'xtatadi

## Nima uchun bu skill kerak
Node.js single-threaded event loop asosida ishlaydi. Sinxron (blocking) I/O yoki CPU-intensiv operatsiyalar event loop'ni to'xtatadi — shu paytda boshqa so'rovlar, timerlar, va callbacklar ishlamaydi. Bu production'da sekin javoblar, timeoutlar va past throughput ga olib keladi, ayniqsa concurrent so'rovlar ko'p bo'lganda.

## Simptom (aynan shu)
- Request handler yoki middleware ichida `fs.readFileSync()`, `fs.writeFileSync()`, `child_process.execSync()`, `crypto.pbkdf2Sync()` yoki boshqa `*Sync` metodlar ishlatilgan.
- Server oddiy yuklamada ishlaydi, lekin bir nechta parallel so'rov kelganda javoblar sekinlashadi yoki timeout bo'ladi.
- `process.hrtime` yoki monitoringda event loop lag ko'rinadi.
- Kod "async" funksiya ichida bo'lsa ham, sinxron chaqiruv tufayli bloklanadi.

## Sabab (100%)
Node.js event loop bitta threadda ishlaydi. `*Sync` metodlar yoki uzoq CPU ishi shu threadni band qiladi va boshqa eventlar (incoming requests, timers, I/O callbacks) navbatda kutib qoladi. Async API (`fs.promises.readFile`, `exec` with callback/promise, `crypto.pbkdf2`) o'rniga sinxron versiyalar ishlatilgan.

## Tasdiqlash
1. Request handler yoki top-level async funksiyani och.
2. `Sync` bilan tugaydigan metodlarni qidir: `readFileSync`, `writeFileSync`, `execSync`, `spawnSync`, `pbkdf2Sync`, `scryptSync` va h.k.
3. Agar `await` yoki Promise qaytarmaydigan sinxron chaqiruv bo'lsa — bu bloklovchi.
4. `clinic.js` yoki `0x` bilan flamegraph qilsang, event loop blocked ko'rinadi.
5. Oddiy test: ikkita parallel so'rov yuborib, birinchisi uzun Sync ish qilsa ikkinchisi kutayotganini tekshir.

## Tuzatish (aynan shu)
Sinxron chaqiruvlarni async/non-blocking versiyalarga almashtir:

```js
// XATO (bloklovchi):
const fs = require('fs');
app.get('/data', (req, res) => {
  const content = fs.readFileSync('./data.json', 'utf8');  // event loop to'xtaydi
  res.json(JSON.parse(content));
});

// TO'G'RI (non-blocking):
const fs = require('fs/promises');
app.get('/data', async (req, res) => {
  const content = await fs.readFile('./data.json', 'utf8');
  res.json(JSON.parse(content));
});
```

```js
// XATO:
const { execSync } = require('child_process');
const output = execSync('ls -la');

// TO'G'RI:
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);
const { stdout } = await execAsync('ls -la');
```

Agar CPU-intensiv hisoblash bo'lsa — `worker_threads` ga o'tkaz.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Node.js'da `*Sync` metodlar event loop'ni bloklaydi va boshqa so'rovlarni sekinlashtiradi.
- Tuzatish: har doim async versiyalarni (`fs.promises`, `util.promisify`, native promises) ishlat.
- Request handler ichida hech qachon sinxron I/O qilma — non-blocking API tanla.
