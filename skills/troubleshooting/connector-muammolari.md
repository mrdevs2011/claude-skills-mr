# connector-muammolari

# Connector ishlamasa: tashxis va xabar berish tartibi

Connectorlarni (hub'dagi beshtasi: lifemr, cmc, claude_skills, mrdrive,
connectmymcpgithub) doim ON saqlash — MR ning zimmasida. Sen ularsiz to'liq
ishlay olmaysan. Kerakli connector ishlamasa/ulanmagan bo'lsa — jim aylanib
o'tma, MR dan talab qil.

Qachon shu skillga bor: joriy vazifa shu connectorsiz bajarilmasa VA kerakli
tool ro'yxatda yo'q yoki chaqirilganda xato qaytgan (timeout, 401/403,
"connector server error", tunnel yo'q) va bitta qayta urinish yordam bermagan
bo'lsa.

Qachon EMAS: vazifa connector talab qilmasa — connector holati haqida hech
narsa dema, suhbat boshida "tekshirib chiqma".

## Tashxis
1. Bir nechta connector (yoki hammasi) birdaniga javob bermasa -> A: hub uxlab qolgan.
2. Faqat cmc javob bermasa: run_command ga eng oddiy "echo ok" yubor.
   - "echo ok" ham xato bersa, 10 soniyadan keyin qayta urinib ham o'tmasa -> B: cmc ishga tushirilmagan.
   - "echo ok" o'tsa, muammo yuborgan buyruqning o'zida -> soddalashtir/qismlarga bo'l, MR dan talab qilma.
3. Boshqa bitta connector xato bersa -> C.

## A. Hub uxlab qolgan
web_fetch bor bo'lsa https://mcp-hub-cdnq.onrender.com/ ga o'zing kirib uyg'ot,
30-60 soniya kutib qayta urin. Uyg'onsa bir jumla ayt. Uyg'onmasa MR ga link ber.

## B. cmc bor, kompyuterga ulana olmayapti
MR ga ayt: terminalda "cmc --start" qilib yuborsin, kerak bo'lmagan qismni davom ettir.

## C. Boshqa bitta connector ishlamasa
Xato matnini aynan ayt (tokenni yashirib), hub sahifasidagi Test tugmasini
bosishni tavsiya qil. CMMGH uchun: 403 -> GH_TOKEN yangilash, 401 -> MCP_AUTH_TOKEN.

## Umumiy qoidalar
Taxmin qilma, MR "ulab qo'ydim" desa darhol qayta urin, bajarilmagan ishni
"bajardim" dema, bir xil talabni takrorlab bezor qilma, taqiqlangan yo'l bilan
aylanib o'tma.

## Xavotirli holat
O'z-o'ziga zarar, umidsizlik, bir necha kun yomon kayfiyat — bu holat hamma
narsadan ustun. lifemr playbook (get_guide) shu holatni qanday boshqarishni
belgilaydi. lifemr ulanmagan/javob bermasa ham bu qoida kuchida qoladi:
vaziyatga jiddiy va mehribonlik bilan javob ber, keyinga qoldirma.
