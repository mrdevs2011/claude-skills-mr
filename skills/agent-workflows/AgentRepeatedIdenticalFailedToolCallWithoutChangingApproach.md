---
name: agent-repeated-identical-failed-tool-call-without-changing-approach
description: Agent kept calling the same tool with identical arguments after a failure or empty result instead of analyzing the error and adjusting parameters, query, or switching tools.
---

# Agent Repeated Identical Failed Tool Call Without Changing Approach

## Nima uchun bu skill kerak
Agent biror tool (web_search, open_page, bash, browser_execute va h.k.) chaqirib xato, bo'sh natija yoki "topilmadi" olganda, xuddi shu argumentlar bilan qayta-qayta chaqiradi. Bu vaqtni va tokenni sarflaydi, muammoni hal qilmaydi, va vazifa to'xtab qoladi.

## Simptom (aynan shu)
- Tool bir marta chaqirilgan va xato, bo'sh ro'yxat, "no results", timeout, yoki noto'g'ri formatdagi javob qaytargan.
- Agent keyingi qadamda aynan bir xil tool_name va bir xil arguments bilan yana chaqiradi.
- 2–3 marta takrorlanganidan keyin ham o'zgarish yo'q, natija o'zgarmaydi.
- Hisobotda "urinib ko'rdim" deyiladi, lekin yondashuv o'zgarmagan.

## Sabab (100%)
Agent xato matnini to'liq o'qimagan yoki tahlil qilmagan. instruction.md da "xato bo'lsa, odamdek harakat qil: sababini tushun, soddalashtir, boshqa ruxsat etilgan yo'lni sina" deyilgan. Takroriy bir xil chaqiruv bu qoidaga zid.

## Tasdiqlash
- Oxirgi tool natijasida error, empty, "not found", "failed", exit code != 0 bormi?
- Keyingi function call da tool nomi va arguments 100% bir xilmi?
- Qidiruv so'rovi, URL, parametrlar, yoki tool turi o'zgartirilganmi?
- Agar o'zgartirilmagan bo'lsa — bu skill qo'llaniladi.

## Tuzatish (aynan shu)
Xato olgandan keyin:

1. To'liq xato matnini o'qi (stderr, error field, message).
2. Sababni aniqlа: noto'g'ri query? noto'g'ri URL? yetishmaydigan parametr? tool noto'g'ri tanlangan?
3. O'zgartir:
   - Query ni aniqroq qil yoki operator qo'sh (site:, filetype:).
   - Boshqa tool ga o't (web_search → open_page, bash → read_file).
   - Parametrlarni to'g'rila (limit, pattern, offset).
4. Faqat o'zgartirilgan argumentlar bilan qayta chaqir.
5. 2 marta bir xil urinishdan keyin boshqa yo'lga o't yoki foydalanuvchiga aniq xatoni ayt.

Misol:

```python
# Noto'g'ri (takror)
web_search(query="python list slice off by one")
# xato / bo'sh
web_search(query="python list slice off by one")  # yana bir xil

# To'g'ri
web_search(query="python list slice off by one site:stackoverflow.com")
# yoki
open_page(url="https://docs.python.org/3/tutorial/datastructures.html", pattern="slice")
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Bir xil tool chaqiruvini xato olgandan keyin takrorlama. Avval xatoni tahlil qil, argumentlarni yoki toolni o'zgartir, keyin qayta urin. Bu token tejaydi va vazifani tezroq hal qiladi.
