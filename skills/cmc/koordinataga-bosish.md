# koordinataga-bosish

# Ekranga aniq koordinataga sichqoncha bilan bosish (ydotool + niri)

## Nima uchun bu skill kerak
MR "manabu tugmani bos", "shu joyga bos", "koordinataga qo'y" kabi so'rasa --
ekrandagi X,Y piksel pozitsiyasiga sichqonchani aniq olib borish va/yoki
bosish kerak. Bu oddiy `ydotool mousemove -a` bilan ISHLAMAYDI -- sababi
va to'g'ri usul shu yerda.

## AVVAL TEKSHIR: koordinata umuman kerakmi?
Bu skillga o'tishdan oldin: natijani **to'g'ridan-to'g'ri buyruq/URL** bilan
olib bo'ladimi? Bo'lsa -- shuni qil, koordinata/skrinshot zanjiriga umuman
BORMA (token va vaqtni behuda sarflaydi):
- "youtube'dan X qo'y" -> web_search bilan video top -> `run_command`:
  `brave "https://youtube.com/watch?v=..."` -- bitta buyruq.
- "shu saytni och" -> `brave URL`.
- "shu faylni och" -> `xdg-open FAYL`.
Koordinataga bosish **faqat** haqiqiy UI ichida (forma, tugma, drag) buyruq/
URL bilan almashtirib bo'lmaydigan holatda kerak -- shundagina pastdagisini ishlat.

## MUHIM: nega absolute mode emas
`ydotool mousemove -a -x -y` (absolute/EV_ABS) MR ning kompyuterida
`ydotoold --touch-on` ishga tushirilganda DARHOL CRASH beradi. Shuning
uchun bu tizimda **hech qachon** `-a` flag ishlatilmaydi -- faqat
**relative harakat + corner-snap** usuli ishlaydi (pastda).

## Tayyor skript -- shuni ishlat, qayta yozma
`~/Claude/click-at.sh` allaqachon yozilgan va sinovdan o'tgan:

```bash
bash ~/Claude/click-at.sh X Y          # kursorni (X,Y)ga olib boradi
bash ~/Claude/click-at.sh X Y click    # olib borib, chap tugma bilan bosadi
```

X,Y -- ekran piksel koordinatasi, chap-yuqori burchak (0,0), o'ng-pastga
qarab o'sadi. Ekran o'lchami: **1440x900** (niri msg outputs bilan
tasdiqlangan, LG E1948 monitor, scale=1 -- o'zgarsa qayta tekshir:
`NIRI_SOCKET=$(find /run/user -name 'niri.wayland-*.sock' | head -1) niri msg outputs`).

## Usul qanday ishlaydi (ichida)
1. **Corner-snap:** kursor avval bottom-left burchakka "qisib qo'yiladi"
   (`mousemove -x -50000 -y 50000` -- ekrandan tashqariga chiqarib
   yuborish orqali known-state hosil qilinadi). **Top-left EMAS** --
   niri'da chap-yuqori burchak "hot corner" bo'lib, tegsa Overview
   rejimi ochilib ketadi (bu allaqachon o'chirilgan bo'lsa ham,
   ehtiyot uchun bottom-left ishlatiladi).
2. Shu known-state'dan **relative harakat** bilan target (X,Y)ga boriladi.
3. **Kalibrovka:** doimiy (-2,-2)px sistematik xato topilgan (detect_cursor.py
   bilan o'lchangan) -- skript ichida avtomatik +2,+2 kompensatsiya bor,
   qo'lda qo'shma.
4. `ydotoold` daemon o'lik bo'lsa, skript o'zi qayta ko'taradi
   (`setsid -f ydotoold ...` -- oddiy `&` emas, chunki cmc har chaqiruvda
   yangi shell ochadi va oddiy background jarayon o'sha shell bilan o'ladi).

## Aniqlik va qachon precise2 kerak
- `click-at.sh` o'zi ~2-5px aniqlikda ishlaydi -- oddiy tugma bosish uchun YETARLI.
- Fon juda "band" (video, animatsiya) bo'lgan holatda va **juda aniq** (masalan
  kichik ikonka, 10px dan kichik nishon) bosish kerak bo'lsa --
  `~/Claude/click-at-precise2.sh X Y [click]` ishlat: bir marta screenshot olib,
  `detect_cursor.py` orqali haqiqiy kursor pozitsiyasini tekshiradi va xato
  katta bo'lsa **bitta marta** o'z-o'zini tuzatadi. Ishonchsiz holatda (skor past
  yoki xato juda katta) tuzatishni qo'llamaydi -- corner-snap natijasida qoladi
  (noto'g'ri "tuzatish"dan ko'ra tuzatmaslik afzal).
- **Ishlatma:** `click-at-precise.sh` (eski, bright/dark border evristikasi
  ishonchsiz -- o'chirilmagan, lekin yangi versiyaga almashtirilgan).

## Target koordinatani qanday topish
MR "manabu joyga bos" desa va aniq X,Y aytmasa:
1. Avval ekranni ko'rish kerak bo'lsa: `grim -c /tmp/shot.png` bilan screenshot
   ol (`-c` kursorni ham suratga oladi).
2. Rasmni tahlil qilib (yoki MR yuborgan skrinshotdan) nishonning piksel
   pozitsiyasini top -- rasm o'lchami 1440x900 bilan mos kelishi kerak
   (kelmasa masshtablash kerak, `grim` odatda logical size'da suratga oladi).
3. Topilgan X,Y bilan `click-at.sh` ni chaqir.

## Muhit o'zgaruvchilar (skript ichida avtomatik o'rnatilgan, qo'lda kerak emas)
```
YDOTOOL_SOCKET=/tmp/.ydotool_socket
XDG_RUNTIME_DIR=/run/user/1001
WAYLAND_DISPLAY=wayland-1
```
Agar boshqa joyda xuddi shu ishni qo'lda (skriptsiz) qilishga to'g'ri kelsa --
shu uchtasini avval export qil, aks holda `ydotool`/`grim` "XDG_RUNTIME_DIR
is invalid or not set" xatosi beradi.

## niri konfiguratsiyasi (o'chirilmasligi kerak)
`mouse { accel-speed 0; accel-profile "flat" }` -- config.kdl'da bo'lishi
shart, aks holda mouse acceleration relative harakatni nomutanosib qilib
qo'yadi va corner-snap noto'g'ri joyga tushadi. Buni o'zgartirmasdan tur.

## Bog'liq fayllar (kompyuterda)
- `~/Claude/click-at.sh` -- asosiy, ishlatiladigan skript.
- `~/Claude/click-at-precise2.sh` -- ixtiyoriy self-correction (band fon uchun).
- `~/Claude/detect_cursor.py` -- kursor detektori (lokal kontrast, Adwaita shablon).
- `~/Claude/cursor_template.png` -- kursor shabloni (16x24, hotspot=(0,0)).
- `~/Claude/.ai-context/cursor-calibration.md` -- to'liq tarix/kalibrovka jurnali,
  yangi muammo chiqsa avval shuni o'qi va yangilab qo'y.

## Xulosa
- Koordinataga bosish so'ralsa: `bash ~/Claude/click-at.sh X Y click`.
- Absolute mode (`-a`) ishlatma -- crash beradi.
- Juda aniq nishon + band fon bo'lsa `click-at-precise2.sh`.
- Yangi narsa o'rgansang yoki xato topsang -- `.ai-context/cursor-calibration.md`
  ni yangilab qo'y (keyingi AI/sessiya foydalansin).
