# shortcuts.md — MR Kompyuter Shortcutlari (Niri WM)

## Muhim ma'lumot
- **WM:** Niri (Wayland compositor, tiling)
- **Mod tugmasi:** Super (Windows tugmasi)
- **Klaviatura:** us,ru layout — `Super+Space` bilan almashtirish
- **Ekran:** 1920x1080, HDMI-A-1
- **Keyboard input tool:** `ydotool key <keycode>` (raw keycodes)
- **Shortcut yuborish:** `ydotool key <modifier_code>:1 <key_code>:1 <key_code>:0 <modifier_code>:0`

## ydotool key sintaksis
```bash
# Format: keycode:1 = press, keycode:0 = release
# Modifierlar: Super=125, Ctrl=29, Shift=42, Alt=56

# Misol: Super+T (terminal oching)
ydotool key 125:1 20:1 20:0 125:0

# Misol: Super+N (Telegram)
ydotool key 125:1 49:1 49:0 125:0
```

## Muhim keycodelar (ydotool uchun)
```
Super (Mod) = 125
Ctrl        = 29
Shift       = 42 (left)
Alt         = 56
Enter/Return= 28
Space       = 57
Tab         = 15
Escape      = 1
Backspace   = 14

A=30 B=48 C=46 D=32 E=18 F=33 G=34 H=35 I=23 J=36 K=37 L=38
M=50 N=49 O=24 P=25 Q=16 R=19 S=31 T=20 U=22 V=47 W=17 X=45
Y=21 Z=44

1=2 2=3 3=4 4=5 5=6 6=7 7=8 8=9 9=10 0=11
F1=59 F2=60 F3=61 F4=62 F5=63 F6=64 F7=65 F8=66 F9=67 F10=68 F11=87 F12=88
Minus(-) = 12   Equal(=) = 13   BracketLeft([) = 26   BracketRight(]) = 27
Comma(,) = 51   Period(.) = 52   Semicolon(;) = 39
```

## App ishga tushirish shortcutlari
| Shortcut | Amal | Buyruq ekvivalenti |
|---|---|---|
| Mod+T | Terminal (kitty) oching | `kitty` |
| Mod+Shift+Return | Floating terminal (kitty-floater) | `kitty --class kitty-floater` |
| Mod+D | App launcher (Rofi) | rofi -show drun |
| Mod+B | Firefox | `firefox` |
| Mod+N | **Telegram** | `Telegram` |
| Mod+E | Fayl menejeri (yazi) | `alacritty -e yazi` |
| Mod+A | AI Check-in (floating) | `ai-checkin` |
| Mod+V | Clipboard tarix (cliphist+rofi) | cliphist list \| rofi |
| Mod+G | GitHub repo ro'yxat | gh-list-repos.sh |
| Mod+P | Parollar ro'yxat | passwords-list.fish |
| Mod+Shift+T | Vazifalar ro'yxat | list-tasks.sh |
| Mod+Shift+Period | Emoji picker (rofimoji) | `rofimoji` |
| Mod+Shift+Q | Scope Tarjima | `uz-scope` |
| Mod+Shift+Comma | WebBlender toggle | toggle-webblender.sh |
| Mod+Z | Tasbeh +1 | `counter-tasbeh inc` |
| Mod+Shift+Z | Tasbeh reset | `counter-tasbeh reset` |

## Oyna boshqarish
| Shortcut | Amal |
|---|---|
| Mod+Q | Oynani yopish |
| Mod+F | Ustun kengligini maximize qilish |
| Mod+Shift+F | Fullscreen |
| Mod+Ctrl+F | Ustunni to'liq kenglikka kengaytirish |
| Mod+C | Ustunni markazga olish |
| Mod+Ctrl+C | Barcha ko'rinadigan ustunlarni markazga |
| Mod+R | Oldindan belgilangan kengliklar o'rtasida almashtirish (50%/70%) |
| Mod+Shift+R | Oldindan belgilangan balandliklar o'rtasida almashtirish |
| Mod+Ctrl+R | Oyna balandligini reset |
| Mod+W | Tabbed rejimi toggle |
| Mod+Minus | Ustun kengligini -10% |
| Mod+Equal | Ustun kengligini +10% |
| Mod+Shift+Minus | Oyna balandligini -10% |
| Mod+Shift+Equal | Oyna balandligini +10% |
| Mod+Shift+V | Floating va tiling orasida focus almashtirish |

## Focus (diqqatni ko'chirish)
| Shortcut | Amal |
|---|---|
| Mod+H | Chap ustonga focus |
| Mod+L | O'ng ustonga focus |
| Mod+J | Pastki oynaga focus |
| Mod+K | Yuqori oynaga focus |
| Mod+Home | Birinchi ustonga focus |
| Mod+End | Oxirgi ustonga focus |
| Mod+Tab | Oldingi workspace ga qaytish |
| Mod+O | Overview ko'rsatish/yashirish |

## Oynani ko'chirish
| Shortcut | Amal |
|---|---|
| Mod+Shift+H | Ustunni chapga ko'chirish |
| Mod+Shift+L | Ustunni o'ngga ko'chirish |
| Mod+Shift+J | Oynani pastga ko'chirish |
| Mod+Shift+K | Oynani yuqoriga ko'chirish |
| Mod+Ctrl+Home | Ustunni birinchi pozitsiyaga |
| Mod+Ctrl+End | Ustunni oxirgi pozitsiyaga |
| Mod+BracketLeft | Oynani chap ustonga consume/expel |
| Mod+BracketRight | Oynani o'ng ustonga consume/expel |
| Mod+Comma | Oynani ustun ichiga consume |
| Mod+Period | Oynani ustundan chiqarish |

## Workspace (ish joylari)
| Shortcut | Amal |
|---|---|
| Mod+U | Pastki workspace ga |
| Mod+I | Yuqori workspace ga |
| Mod+1..9 | 1-9 workspace ga o'tish |
| Mod+Shift+U | Ustunni pastki workspace ga ko'chirish |
| Mod+Shift+I | Ustunni yuqori workspace ga ko'chirish |
| Mod+Shift+1..9 | Oynani N workspace ga ko'chirish |
| Mod+Ctrl+U | Workspace ni pastga siljitish |
| Mod+Ctrl+I | Workspace ni yuqoriga siljitish |

## Monitor focus
| Shortcut | Amal |
|---|---|
| Mod+Ctrl+H | Chap monitora focus |
| Mod+Ctrl+L | O'ng monitora focus |
| Mod+Ctrl+J | Pastki monitora focus |
| Mod+Ctrl+K | Yuqori monitora focus |

## Screenshot
| Shortcut | Amal |
|---|---|
| Mod+X | Screenshot (region tanlash) |
| Mod+Shift+X | Butun ekran screenshot |
| Ctrl+Print | Faol oyna screenshot |
| Saqlash joyi | ~/pictures/screenshots/ |

## Ekran yozish (screen recording)
| Shortcut | Amal |
|---|---|
| Mod+S | Ekran + tizim ovozi yozish |
| Mod+Shift+S | Ekran + tizim ovozi + mikrofon yozish |

## Tizim
| Shortcut | Amal |
|---|---|
| Mod+Escape | Ekranni qulflash (swaylock) |
| Mod+Shift+P | Monitorlarni o'chirish |
| Mod+M | Niri dan chiqish (quit) |
| Mod+Shift+B | Waybar ko'rsatish/yashirish |
| Super+Space | Klaviatura tilini almashtirish (us↔ru) |

## Ovoz va yorqinlik (media tugmalar)
| Tugma | Amal |
|---|---|
| XF86AudioRaiseVolume | Ovozni oshirish |
| XF86AudioLowerVolume | Ovozni kamaytirish |
| XF86AudioMute | Ovozni o'chirish/yoqish |
| XF86AudioMicMute | Mikrofonni o'chirish/yoqish |
| XF86AudioPlay | Qo'shiqni play/pause |
| XF86AudioNext | Keyingi qo'shiq |
| XF86AudioPrev | Oldingi qo'shiq |
| XF86MonBrightnessUp | Yorqinlikni oshirish +10% |
| XF86MonBrightnessDown | Yorqinlikni kamaytirish -10% |
| Mod+TouchpadScrollDown | Ovozni oshirish |
| Mod+TouchpadScrollUp | Ovozni kamaytirish |

## Ilovalarni to'g'ridan-to'g'ri ishga tushirish (ydotool kerak emas!)
Agar app ishga tushirish kerak bo'lsa, shortcut yubormasdan to'g'ridan-to'g'ri buyruq ishlat:
```bash
# Telegram
Telegram &

# Firefox
firefox &

# Terminal
kitty &

# Floating terminal
kitty --class kitty-floater &
```

## ydotool bilan shortcut yuborish — tayyor misollar
```bash
export YDOTOOL_SOCKET=/tmp/.ydotool_socket
export XDG_RUNTIME_DIR=/run/user/1001
export WAYLAND_DISPLAY=wayland-1

# Telegram oching (Mod+N)
ydotool key 125:1 49:1 49:0 125:0

# Terminal oching (Mod+T)
ydotool key 125:1 20:1 20:0 125:0

# Firefox oching (Mod+B)
ydotool key 125:1 48:1 48:0 125:0

# App launcher (Mod+D)
ydotool key 125:1 32:1 32:0 125:0

# Oynani yopish (Mod+Q)
ydotool key 125:1 16:1 16:0 125:0

# Screenshot (Mod+X)
ydotool key 125:1 45:1 45:0 125:0

# Kitty'da yangi tab: Ctrl+Shift+T
ydotool key 29:1 42:1 20:1 20:0 42:0 29:0

# Kitty'da yangi oyna: Ctrl+Shift+N (agar kitty config bo'lsa)
ydotool key 29:1 42:1 49:1 49:0 42:0 29:0
```

## Terminalda (kitty ichida) shortcutlar
| Shortcut | Amal |
|---|---|
| Ctrl+Shift+T | Yangi tab ochish |
| Ctrl+Shift+Q | Tabni yopish |
| Ctrl+Shift+Alt+T | Tab nomini o'zgartirish |
| Ctrl+Shift+Right | Keyingi tabga o'tish |
| Ctrl+Shift+Left | Oldingi tabga o'tish |
| Ctrl+Shift+Enter | Yangi oyna (split) |
| Ctrl+Shift+W | Oynani yopish |
| Ctrl+Shift+C | Nusxalash |
| Ctrl+Shift+V | Yapishtirish |
| Ctrl+Shift+Plus | Shrift kattaligini oshirish |
| Ctrl+Minus | Shrift kattaligini kamaytirish |
| Ctrl+Shift+F | Qidirish |
| Ctrl+L | Ekranni tozalash |

## Eslatmalar
- **ydotoold daemon** avtomatik start bo'ladi (`click-at.sh` ichida)
- **Calibration:** kursor har doim ~2px chapga/yuqoriga tushadi (kompensatsiya qo'shilgan)
- **Ekran o'lchami:** 1920x1080 (HDMI-A-1, 100Hz)
- App ishga tushirishda `ydotool` ishlatishdan ko'ra to'g'ridan-to'g'ri buyruq afzal (instruction.md qoidasi)
