---
name: agent-relied-on-web-search-snippets-for-detailed-technical-content-instead-of-opening-full-page-with-open-page-tool
description: Agent batafsil texnik kontent yoki aniq sahifa bo'limlari kerak bo'lganda faqat web_search snippetlariga tayanadi, to'liq sahifani open_page bilan ochmaydi — muhim ma'lumotlar yo'qoladi.
---

# Web search snippetlariga tayanib to'liq sahifani open_page bilan ochmaslik

## Nima uchun bu skill kerak
Agentlar foydalanuvchi aniq URL yoki batafsil texnik hujjat, API dokumentatsiya, kod misoli yoki to'liq sahifa mazmunini so'raganda faqat web_search natijalaridagi qisqa snippetlarga tayanadi. Natijada muhim qismlar, kod bloklari, jadval yoki kontekst yo'qoladi. open_page tool'i to'liq sahifa yoki pattern bilan aniq qismlarni olish imkonini beradi. Bu token tejaydi va aniq javob beradi.

## Simptom (aynan shu)
- Foydalanuvchi aniq URL, "to'liq hujjatni o'qi", "shu sahifadagi API misoli", "kod qanday yozilgan" yoki batafsil texnik savol beradi.
- Agent faqat web_search chaqiradi va snippetlardan javob chiqaradi.
- Javobda muhim kod, jadval, shartlar yoki to'liq kontekst yo'q yoki noto'g'ri.
- open_page tool'i umuman chaqirilmagan.

## Sabab (100%)
Agent web_search yetarli deb hisoblaydi va to'liq sahifa mazmunini olish uchun open_page tool'i mavjudligini unutadi yoki e'tiborsiz qoldiradi. Snippetlar qisqa bo'lib, asosiy kontentni to'liq qamrab olmaydi.

## Tasdiqlash
- So'rovda aniq URL yoki batafsil kontent talabi bormi?
- Agent faqat web_search ishlatganmi, open_page chaqirilmaganmi?
- Javobda to'liq kod/jadval/shartlar yetishmaydimi?
- open_page bilan pattern yoki start_line ishlatilishi mumkinmi?

## Tuzatish (aynan shu)
1. Agar aniq URL berilgan bo'lsa yoki snippet yetarli bo'lmasa — darhol open_page(url=...) chaqir.
2. Uzun sahifada kerakli qismni topish uchun pattern="regex" va context_lines yoki start_line ishlat.
3. open_page natijasidan to'liq matnni o'qib, aniq javob chiqar.
4. Hech qachon batafsil texnik so'rov uchun faqat snippetga tayanma — open_page bilan to'liq ol.
5. Kerak bo'lsa bir nechta open_page chaqiruvi qil (parallel agar mustaqil bo'lsa).

Misol:
- Noto'g'ri: faqat web_search(query="site:docs.python.org pathlib Path") va snippetdan javob.
- To'g'ri: open_page(url="https://docs.python.org/3/library/pathlib.html", pattern="Path\\.write_text") va to'liq misolni ol.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Batafsil texnik kontent yoki aniq URL uchun web_search snippetlari yetarli emas — open_page ishlatish shart.
- open_page pattern va start_line bilan uzun sahifadan faqat kerakli qismni olish mumkin, token tejaydi.
- Bu usul aniqroq, to'liqroq javob beradi va foydalanuvchiga to'g'ri ma'lumot yetkazadi.
