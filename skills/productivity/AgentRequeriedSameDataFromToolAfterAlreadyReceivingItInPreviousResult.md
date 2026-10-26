---
name: agent-requeried-same-data-from-tool-after-already-receiving-it-in-previous-result
description: Oldingi tool natijasida kerakli ma'lumot allaqachon bor ekan, agent yana bir marta xuddi shu tool yoki qidiruvni chaqirdi — keraksiz token, vaqt va context sarflandi.
---

# Oldingi tool natijasini e'tiborsiz qoldirib qayta so'rov yuborish

## Nima uchun bu skill kerak
Agentlar ba'zan tool chaqiruv natijasini diqqat bilan o'qimaydi yoki "yangi ma'lumot kerak" deb hisoblab, xuddi shu ma'lumotni qayta so'raydi. Bu token isrof qiladi, javobni sekinlashtiradi va instruction.md dagi tejamkorlik va "takror sinama" qoidalariga zid.

## Simptom (aynan shu)
- Bir xil yoki juda o'xshash so'rov bilan web_search, open_page, x_keyword_search yoki boshqa tool ikkinchi marta chaqirilgan.
- Oldingi natijada allaqachon javob, citation, card yoki kerakli matn bor.
- Foydalanuvchi so'rovi o'zgarmagan, yangi filtr yoki yangilanish sababi yo'q.
- Parallel yoki ketma-ket bir necha bir xil qidiruvlar.

## Sabab (100%)
Agent oldingi tool chiqishini to'liq o'qimadi, eslab qolmadi yoki "yana bir marta tekshiray" deb ortiqcha ehtiyotkorlik qildi. Kontekstdagi mavjud ma'lumotni e'tiborsiz qoldirdi.

## Tasdiqlash
- Suhbat tarixida yoki oldingi function call natijasida xuddi shu ma'lumot bormi?
- Yangi chaqiruv nima yangi narsa beradi (vaqt, filtr, boshqa parametr)?
- instruction.md "Kontekstni yodda tut: takror so'rama, takror sinama" qoidasi buzilganmi?
- Natija oldingisi bilan deyarli bir xilmi?

## Tuzatish (aynan shu)
1. Har qanday tool chaqirishdan oldin: "Bu ma'lumot allaqachon kontekstdami?" deb tekshir.
2. Oldingi natijani (tool response, card, citation) diqqat bilan o'qi va undan foydalan.
3. Faqat haqiqiy yangi so'rov (boshqa joy, boshqa filtr, yangilangan holat) bo'lsa qayta chaqir.
4. Agar shubha bo'lsa, birinchi natijani qayta ko'rib chiq, qayta so'rov yuborma.

```markdown
# Noto'g'ri
1. web_search("tashkent weather")
2. (natija keldi)
3. web_search("tashkent weather today")  # qayta

# To'g'ri
1. web_search yoki weather_forecast
2. Natijani o'qi, javob ber
3. Kerak bo'lsa faqat yangi parametr bilan
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Oldingi tool natijasini to'liq o'qi va undan foydalan — qayta so'rov yuborma.
- Bu token va vaqtni tejaydi, javobni tezroq qiladi.
- instruction.md dagi "takror sinama" qoidasiga amal qil.
