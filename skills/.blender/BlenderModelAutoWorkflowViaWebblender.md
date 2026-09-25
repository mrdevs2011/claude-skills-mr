# blender-webblender-auto

# Blender modeli so'ralsa: Webblender orqali kompyuterda avtomatik yasash va ko'rsatish

## Nima uchun bu skill kerak
MR "menga mashina yasab ber" yoki "Blender'da X yarat" desa, Claude uni
kompyuterdagi Webblender orqali o'zi bajaradi: server yoqadi, brauzerni ochadi,
kodni yuboradi, natijani o'qiydi. MR dan "serverni yoq", "kodni ko'chirib qo'y"
kabi hech narsa so'ralmaydi.

Webblender (Blender Script Previewer) nima: brauzerdagi sahifa. bpy kod editor'ga
tushadi, `server.py` uni `blender --background` bilan headless ishga tushirib
`model.glb` chiqaradi va Three.js viewer'da ko'rsatadi (Ctrl+P bilan bir xil preview).

## Talab
- `cmc` `run_command` ishlayotgan bo'lishi. Ishlamasa — `instruction.md` dagi
  "Connectorlar: MR zimmasida" bo'limi. cmc dan qanday foydalanish: skill
  `cmc/cmc-ishlatish`.
- Kompyuterda `~/.blender/` papkasi (yashirin papka, oldin `~/blender/` edi) va
  `/usr/bin/blender` bor.
- Fayllar: `server.py`, `index.html`, `push.py`, `SKILL.md` (bpy qoidalari),
  `tmp/` (skriptlar), `output/model.glb`.

## Tartib (aynan shu)
1. **Qoidalarni o'qi:** `cat ~/.blender/SKILL.md`. Headless bpy skript qoidalari shu
   yerda (sahnani tozalash, export'ni o'zing yozmaslik, versiya farqlari, 120
   soniya limit). Uni o'qimasdan skript yozma.
2. **Skriptni yoz:** `~/.blender/tmp/NOM.py` ga (heredoc, terminator `PYEOF`).
   Heredoc ichida `<< 'EOF'` matni va backtick yozma (cmc xato berishi mumkin:
   `search_skills("cmc")`).
3. **Yubor:** `python3 ~/.blender/push.py ~/.blender/tmp/NOM.py`
   `push.py` o'zi: server o'chiq bo'lsa yoqadi (tasodifiy port), sahifa yopiq
   bo'lsa brauzerda ochadi, kodni yuboradi (editor'ga tushadi, preview o'zi ochiladi)
   va build natijasini kutadi (24 soniyagacha).
4. **Natijani o'qi** (matn + chiqish kodi). **MUHIM:** `push.py` chiqish kodi
   0 dan boshqa bo'lsa ham (`exitCode: 3` yoki `ok: false`), bu HAR DOIM
   haqiqiy xato degani emas — quyidagi ikkita holat ham xuddi shu kod (3) bilan
   qaytadi va ikkalasi ham normal, kutilgan oraliq holat, "Failed" deb
   ko'rsatilishiga qaramasdan:
   - `BUILD OK: N obyekt, M vertex, o'lcham x,y,z` (0): raqamlar mantiqiymi
     tekshir. Kutilganidan ortiq obyekt yoki katta o'lcham chiqsa, standart Cube
     o'chirilmagan bo'lishi mumkin (`--factory-startup` sahnada Cube bilan boshlanadi).
   - `BUILD XATO: tur - xabar | qator: N` (2): haqiqiy xato. Xato matni, qator
     va maslahatga qarab skriptni tuzat, qayta yubor. Ko'pi bilan 3 urinish,
     keyin xatoni MR ga ayt.
   - `build hali tugamadi` (3, `sahifa ochiq bo'lsa`): haqiqiy xato EMAS —
     Blender hali render qilyapti. O'zing 10-15 soniya kutib (masalan `sleep 12`),
     keyin `python3 ~/.blender/push.py --result` ni qayta chaqir. MR ga xato
     sifatida ko'rsatma, oddiy "hali tugamadi" deb ich-ichingda hisobla.
   - `sahifa hali ochilmagan. Qo'lda och: URL` (3, `push` chiqishida): haqiqiy
     xato EMAS — kod yuborildi, faqat sahifa ochiq emas. **`push.py` brauzerni
     avtomatik ochmaydi** (bu eski hujjatda va kodning o'zida `open_browser()`
     funksiyasi bor-u, lekin `main()` uni chaqirmaydi — bilib qo'y, taxmin qilib
     "o'zi ochadi" deb kutma). Shuning uchun bu holatda MR dan so'ramasdan,
     xato deb ham hisoblamasdan, ketma-ket o'zing bajar:
     ```bash
     DISPLAY=:0 xdg-open http://localhost:PORT >/dev/null 2>&1 &
     sleep 1
     ```
     keyin `push.py --status` bilan `sahifa ochiq: True` bo'lganini tasdiqla.
     Shundan keyingina natijani (`BUILD OK/XATO`) tekshir. Bularning bari bitta
     vazifa ichidagi ketma-ket qadamlar — MR ga alohida "ochib qo'yaymi?" deb
     so'rash shart emas, avtomatik ish tartibining bir qismi.
5. **MR ga qisqa javob:** tayyor, nima yasaldi (raqamlar), brauzerda ko'rsin.
   Chiroyliligini ko'ra olmaysan. MR "g'ildirak kichik" desa, skriptni o'zgartirib
   qayta yubor: editor'ga yangi kod o'zi tushadi.

## Yordamchi buyruqlar
- `push.py --status` — server va sahifa holati.
- `push.py --result` — oxirgi build natijasi.
- `push.py --stop` — serverni o'chirish.
- Win+Shift+Comma (`toggle-webblender.sh`) xuddi shu serverni yoqadi/o'chiradi
  (ikkalasi `/tmp/webblender.pid` ni ishlatadi, bir-biriga xalaqit bermaydi).

## Tuzoqlar
- Eski server (`/status` yo'q) topilsa, `push.py` uni qayta yoqadi. Ochiq sahifa
  yo'qoladi, yangi tab ochiladi.
- Server qayta yoqilsa (masalan `--stop` dan keyin yoki papka ko'chirilgach) editor
  bo'sh qoladi, chunki kod brauzer xotirasida turadi. Oxirgi skriptni `push.py` bilan
  qayta yubor: `python3 ~/.blender/push.py ~/.blender/tmp/NOM.py`.
- Sahifa fon tabda bo'lsa ham kod keladi (sahifa serverni doim tinglab turadi).
- Server ko'tarilmasa: `push.py` "server ko'tarilmadi, log: /tmp/webblender.log"
  deydi. Logni o'qi (port band yoki `flask` yo'q bo'lishi mumkin).
- BUILD OK, lekin model bo'sh yoki buzuq ko'rinsa: `SKILL.md` §7 (geometriya
  validligi) va §8 (yorug'lik/kamera).
- `server.py` `0.0.0.0` da ishlaydi, `/run` parolsiz: shu tarmoqdagi istalgan
  qurilma Blender kodini ishga tushira oladi (`/push` va `/status` faqat localhost).
- Papka yo'li o'zgargan bo'lsa (`~/.blender`), `push.py` dagi `DIR` va
  `toggle-webblender.sh` dagi `cd $HOME/.blender` ham shunga mos bo'lishi shart.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Blender so'ralsa: `SKILL.md` ni o'qi, skriptni `~/.blender/tmp/` ga yoz,
  `push.py` bilan yubor. Server va brauzerni qo'lda boshqarma.
- Natija `BUILD OK` (raqamlar bilan) yoki `BUILD XATO` (qator raqami bilan) bo'lib
  qaytadi. Xatoda o'zing tuzat, 3 urinishgacha.
- Chiroyliligini faqat MR ko'radi. Uning izohi bo'yicha tuzat va qayta yubor.
