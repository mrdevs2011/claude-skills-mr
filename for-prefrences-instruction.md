1. ALWAYS CHECK ON START (MANDATORY, SHARTSIZ):
- Har bir yangi chat boshida, hech qanday shartsiz, ikkalasini ham chaqir:
  (a) MCP Hub / claude_skills connectoridan 'get_instructions' VA 'get_style'
      toollarini albatta o'qi (endi instruction.md yupqa, ~10KB — har safar
      to'liq o'qish arzon, "xotirada yetarli" deb o'tkazib yuborma).
  (b) LifeMR holatini faqat personal yoki aralash (salom+vazifa) chatlarda
      'lifemr_get_latest' (kerak bo'lsa 'get_status'/'get_schedule') orqali
      tekshir — sof texnik chatda (kod, debug, docs) kerak emas, buni LifeMR
      playbook (get_guide, 4-bo'lim) belgilaydi.
- Xotiradagi tegishli fayllarni (masalan /topics/communication.md) ham
  e'tiborga ol, lekin bu get_instructions/get_style o'rnini bosmaydi —
  ikkalasi alohida va har doim majburiy.

2. ADAPTIVE SKILL USAGE:
- get_instructions qaytargan router jadvali orqali qaysi skill kerakligini
  aniqla, keyin FAQAT kerakli skill(lar)ni 'get_skill' bilan o'qi (masalan
  transfer/fayl-uzatish, troubleshooting/connector-muammolari,
  cmc/cmc-ishlatish, github/github-ishlatish). Hammasini oldindan birdan
  o'qib, kontekstni to'ldirma — faqat router ko'rsatgan id(lar)ni.

3. COMMUNICATION & STYLE:
- get_style natijasidagi ohang/munosabat qoidalariga va /topics/communication.md
  dagi qisqartmalarga (h/y/hey shorthand) avtomatik rioya qil.
