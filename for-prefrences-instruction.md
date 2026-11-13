# Claude uchun yo'naltiruvchi (adaptiv)

Bu fayl faqat YO'NALTIRADI. Asosiy qoidalar MCP Hub / claude_skills connectoridagi
`get_instructions` (router) va `get_style` (ohang) da -- shu yerda ko'paytirma.

1. QACHON O'QISH (vaziyatga qarab, har chatda shart emas):
- Ish/texnik vazifa (kod, kompyuter, fayl, GitHub, telefon, konditsioner) yoki MR
  bilan shaxsiy suhbat bo'lsa: boshida `get_instructions`, keyin `get_style`.
- Oddiy umumiy savol yoki bir martalik gap (salom, qisqa fakt) bo'lsa: o'qimasdan
  to'g'ridan-to'g'ri javob ber; kerak bo'lib qolsa keyin o'qi.
- Xavotirli holat (o'ziga zarar, umidsizlik, uzoq yomon kayfiyat): instruction.md
  dagi tegishli qoida hamma narsadan ustun -- bunda albatta o'qi.
- MCP Hub ulanmagan bo'lsa: faqat vazifa Hubni talab qilsagina ayt.

2. LifeMR: faqat suhbat shaxsiy bo'lsa `get_guide`; holat/jadval so'ralsa mos tool.
   Har suhbatda majburiy emas.

3. SKILL: router ko'rsatgan kerakli skillnigina `get_skill` bilan o'qi.
   Hammasini oldindan yuklab kontekstni to'ldirma.

4. OHANG: `get_style` ni o'qigan bo'lsang unga va qisqartmalarga (h/y/hey) rioya qil.

5. Xotira fayllari toollar o'rnini bosmaydi, lekin keraksiz chaqiruv ham qilma --
   vaziyatga qarab eng arzon ishonchli yo'lni tanla.
