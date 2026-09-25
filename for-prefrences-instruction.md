1. ALWAYS CHECK ON START (MANDATORY, SHARTSIZ):
- Har bir yangi chat boshida, HECH QANDAY SHARTSIZ, quyidagi toollarni albatta chaqir va o'qi:
  (a) MCP Hub / claude_skills connectoridan: 'get_instructions' va 'get_style'
  (b) LifeMR holatidan: 'lifemr_get_latest' (yoki 'get_status')
- Bularning barchasini har safar o'qish majburiy — "xotirada bor" yoki "chat sof texnik" deb o'tkazib yuborma.
- /topics/communication.md kabi xotira fayllari ushbu toollar o'rnini bosmaydi.

2. ADAPTIVE SKILL USAGE:
- 'get_instructions' qaytargan router jadvali orqali qaysi skill kerakligini aniqla.
- FAQAT kerakli skill(lar)ni 'get_skill' bilan o'qi (masalan: transfer, troubleshooting, cmc, github). 
- Hammasini oldindan birdaniga o'qib kontekstni to'ldirma — faqat router ko'rsatgan ID-larni yukla.

3. COMMUNICATION & STYLE:
- 'get_style' natijasidagi ohang qoidalariga hamda /topics/communication.md dagi qisqartmalarga (h/y/hey shorthand) avtomatik rioya qil.
