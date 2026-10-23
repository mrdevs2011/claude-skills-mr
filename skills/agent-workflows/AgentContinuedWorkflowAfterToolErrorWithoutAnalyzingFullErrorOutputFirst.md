---
name: continued-after-tool-error-without-analyzing
description: Tool xato qaytarganida (non-zero exit yoki error message) to'liq xato matnini o'qimasdan, tahlil qilmasdan keyingi qadamga o'tish — xato takrorlanadi yoki noto'g'ri davom etiladi.
---

# Tool xatosidan keyin tahlil qilmasdan davom etish

## Nima uchun bu skill kerak
Agent tool (bash, edit_file, web_search va h.k.) chaqirganda xato oladi, lekin to'liq stderr/output'ni o'qib sababni tushunmasdan "qayta urinib ko'raman" yoki keyingi qadamga o'tadi. Bu vaqt isrofi va bir xil xatoning takrorlanishiga olib keladi.

## Simptom (aynan shu)
- Tool javobi non-zero exit code yoki aniq error matni (masalan "command not found", "permission denied", "old_string not found", "rate limit") qaytaradi.
- Agent bu xatoni qisqa e'tiborsiz qoldiradi yoki faqat oxirgi qatorni ko'radi.
- Xuddi shu buyruq/parametr bilan qayta chaqiriladi yoki keyingi qadam (commit, push, keyingi edit) amalga oshiriladi.
- Xato tuzatilmagan holda hisobotda "muvaffaqiyatli" deyiladi.

## Sabab (100%)
Agent tool javobini to'liq o'qishni unutadi yoki "xato oddiy, bilaman" deb taxmin qiladi. To'liq error output'ni (stderr, full message, line numbers) tahlil qilish o'rniga darhol keyingi harakatga o'tadi.

## Tasdiqlash
- Oxirgi tool chaqiruvining javobida error/non-zero bor-yu, agent uni to'liq quote qilmaganmi yoki sababni aytmaganmi?
- Xato matnida aniq ko'rsatma (fayl nomi, qator, missing package) bor-yu, agent uni e'tiborsiz qoldirganmi?
- Bir xil buyruq xato berganidan keyin o'zgartirilmasdan qayta chaqirilganmi?

## Tuzatish (aynan shu)
Xato chiqqanida darhol to'xtab, to'liq tahlil qil:

1. Tool javobining **butun** matnini o'qi (stdout + stderr, exit code).
2. Xato matnidan aniq sababni ajrat (masalan "No such file", "syntax error at line X", "401 Unauthorized").
3. Sababni bir jumlada yoz va tuzatishni rejalashtir (parametr o'zgartirish, fayl yaratish, boshqa tool ishlatish).
4. Faqat tuzatilgan versiyani qayta chaqir. Bir xil argument bilan qayta urinma.
5. Agar xato tushunarsiz bo'lsa — qo'shimcha diagnostika (masalan `ls`, `which`, `cat` kichik qism) qil, lekin asosiy buyruqni ko'r-ko'rona takrorlama.

Misol:
```text
# Noto'g'ri:
bash("git push origin main")  # rejected, non-fast-forward
# Agent: "Xato chiqdi, qayta urinib ko'raman" → yana xuddi shu buyruq

# To'g'ri:
# Javobni o'qi: "rejected: non-fast-forward"
# Sabab: remote'da yangi commit bor.
# Tuzatish: avval git pull --rebase, keyin push.
bash("git pull --rebase origin main && git push origin main")
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Har qanday tool xatosida to'liq output'ni o'qi va sababni aniqlab, tuzatib keyin davom et.
- Bir xil buyruqni xato berganidan keyin o'zgartirmasdan qayta chaqirma.
- Bu oddiy qoida "blind retry" xatolarining ko'pini oldini oladi va vaqtni tejaydi.
