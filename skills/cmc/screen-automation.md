# screen-automation — Ekran bilan ishlash (umumiy workflow)

## Muhit o'zgaruvchilar (har buyruqdan oldin set qil)
```bash
export YDOTOOL_SOCKET=/tmp/.ydotool_socket
export XDG_RUNTIME_DIR=/run/user/1001
export WAYLAND_DISPLAY=wayland-1
```

## Asosiy qurollar
| Qurol | Nima qiladi | Misol |
|---|---|---|
| `ydotool key` | Klaviatura shortcut yuboradi | `ydotool key 125:1 49:1 49:0 125:0` |
| `ydotool type` | Matn yozadi | `ydotool type "salom"` |
| `bash ~/Claude/click-at.sh X Y click` | Koordinataga bosadi | `bash ~/Claude/click-at.sh 960 50 click` |
| `grim -c /tmp/shot.png` | Screenshot oladi (kursor bilan) | — |
| `sleep N` | N soniya kutadi | `sleep 1` |

---

## WORKFLOW — har qanday UI vazifasi uchun

### 1. ILOVNI OCH (eng qisqa yo'l)
**Avval tekshir:** to'g'ridan-to'g'ri buyruq bor bo'lsa — shortcut/koordinata kerak emas.

```bash
# To'g'ridan-to'g'ri ishga tushirish (ENG TEZKOR)
Telegram &
firefox &
kitty &

# Yoki shortcut bilan (shortcuts.md dan qarab)
ydotool key 125:1 49:1 49:0 125:0   # Mod+N = Telegram
ydotool key 125:1 20:1 20:0 125:0   # Mod+T = kitty terminal
ydotool key 125:1 48:1 48:0 125:0   # Mod+B = Firefox
```
Keyin `sleep 1.5` — ilova ochilguncha kut.

### 2. EKRANNI KO'R
```bash
grim -c /tmp/shot.png
```
Screenshot ni Claude ga yuborish uchun:
```bash
# Faylni chat ga chiqar (present_files bilan)
# yoki quyidagicha o'lchami/holatini tekshir:
file /tmp/shot.png
```
**Screenshot dan nima o'qi:** qaysi ilova ochiq, qayerda input bor,
qayerda tugma bor, koordinatani taxmin qil.

### 3. KOORDINATA TOPISH
Ekran o'lchami: **1920x1080** (HDMI-A-1).

Tez taxmin qilish:
- Markaziy search input odatda: `X=960, Y=50..100` (yuqori qism)
- Pastki navigation bar: `Y=1050..1080`
- Chap panel (sidebar): `X=50..300`
- Asosiy kontent maydoni: `X=300..1600, Y=100..900`

Aniqroq koordinata kerak bo'lsa — screenshot ol, tahlil qil.

### 4. KOORDINATAGA BOS
```bash
bash ~/Claude/click-at.sh X Y          # faqat ko'chirish
bash ~/Claude/click-at.sh X Y click    # ko'chirib bosish
sleep 0.3                               # bosishdan keyin kut
```

### 5. MATN YOZ
```bash
ydotool type "yozmoqchi bo'lgan matn"
sleep 0.2
# Enter bosish uchun:
ydotool key 28:1 28:0
```

### 6. NATIJANI TEKSHIR
```bash
sleep 1   # UI yangilanguncha kut
grim -c /tmp/shot2.png
# Yangi screenshotni ko'r — maqsadga yetilganmi?
```

---

## ANIQ MISOLLAR

### Ilova ichida search qilish
```bash
# 1. Ilovani och
Telegram &
sleep 2

# 2. Search shortcut (ko'p ilovada Ctrl+F yoki Ctrl+K)
export YDOTOOL_SOCKET=/tmp/.ydotool_socket XDG_RUNTIME_DIR=/run/user/1001 WAYLAND_DISPLAY=wayland-1
ydotool key 29:1 33:1 33:0 29:0   # Ctrl+F
sleep 0.5

# 3. Matn yoz
ydotool type "qidirayotgan narsa"
sleep 0.5

# 4. Ko'r
grim -c /tmp/result.png
```

### Input maydoniga bosib yozish
```bash
# 1. Screenshot ol, input koordinatasini topib ol
grim -c /tmp/shot.png
# Tahlil qil: input X=800 Y=60 ekan deylik

# 2. Bos
bash ~/Claude/click-at.sh 800 60 click
sleep 0.3

# 3. Yoz
ydotool type "yozmoqchi narsam"
ydotool key 28:1 28:0   # Enter
```

### Oyna o'rtasida o'tish
```bash
ydotool key 56:1 15:1 15:0 56:0   # Alt+Tab
sleep 0.3
```

### Nusxa olish / Yapıştırish
```bash
ydotool key 29:1 46:1 46:0 29:0   # Ctrl+C (nusxa)
ydotool key 29:1 47:1 47:0 29:0   # Ctrl+V (yapıştır)
```

---

## QAROR DARAXTI — qaysi yo'l?

```
Maqsad: ilovani och / UI da nimadir qil
│
├── To'g'ridan-to'g'ri buyruq bor? (Telegram &, firefox &)
│   └── HA → shu buyruqni ishlat, tugadi.
│
├── Shortcut bor? (shortcuts.md dan qarab)
│   └── HA → ydotool key bilan yubor.
│
├── UI elementni bosish kerakmi?
│   ├── Screenshot ol → koordinatani taxmin qil
│   └── click-at.sh X Y click
│
└── Matn kiritish kerakmi?
    ├── Avval input ga bos (click-at.sh)
    └── ydotool type "matn"
```

---

## MUHIM QOIDALAR
- **Avval eng qisqa yo'l:** to'g'ridan-to'g'ri buyruq > shortcut > koordinata
- **Har amaldan keyin sleep:** `sleep 0.3..2` — UI ga vaqt ber
- **Tekshir:** muhim amaldan keyin screenshot ol, ko'r
- **ydotool -a flag ISHLATMA** — crash beradi (koordinataga-bosish.md ga qarang)
- **Shortcutlar:** `shortcuts.md` dan qarab ishlat
