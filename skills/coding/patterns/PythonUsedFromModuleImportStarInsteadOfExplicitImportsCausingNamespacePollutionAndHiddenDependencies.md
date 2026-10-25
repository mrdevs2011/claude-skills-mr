---
name: python-import-star-namespace-pollution
description: Python'da `from module import *` ishlatilganda namespace ifloslanadi, yashirin dependensiyalar paydo bo'ladi va xatolar qiyinlashadi.
---

# Python'da from module import * namespace ifloslanishi va yashirin dependensiya

## Nima uchun bu skill kerak
Agentlar ba'zan "qisqa" deb `from math import *` yoki `from os.path import *` yozishadi. Bu nomlarni global scope'ga olib kiradi, nima import qilinganini ko'rinmas qiladi va keyinroq nom to'qnashuvi yoki "bu qayerdan keldi" muammolarini keltirib chiqaradi. Aniq importlar o'qish va refaktor qilishni osonlashtiradi.

## Simptom (aynan shu)
- Kodda `from some_module import *` yoki `from package.sub import *` bor.
- Funksiya yoki o'zgaruvchi ishlatilgan, lekin u qayerdan import qilingani aniq emas (import qatori yo'q yoki * bilan yashiringan).
- Ikki moduldan bir xil nom kelib, birini boshqasi ustidan yozib qo'ygan (silent overwrite).
- IDE yoki linter "undefined" deb ko'rsatadi, chunki * static tahlil uchun yomon.
- Keyinroq modul o'zgarganda, qaysi nomlar endi mavjudligini bilish qiyin.

## Sabab (100%)
`from module import *` modulning `__all__` (yoki barcha public nomlarini) joriy namespace'ga to'g'ridan-to'g'ri kiritadi. Bu:
- Namespace'ni ifloslaydi.
- Explicit dependensiyani yashiradi (kodni o'qiyotgan kishi nima ishlatilayotganini import qatoridan ko'ra olmaydi).
- Nom to'qnashuvi xavfini oshiradi.
- Static analysis, auto-completion va refactoring tool'larini buzadi.

## Tasdiqlash
1. Faylda `import *` qatorini top.
2. Shundan keyin ishlatilgan nomlarning aniq importi bormi, yoki * orqali kelganmi?
3. `dir()` yoki `globals()` bilan qancha nom kiritilganini ko'r.
4. Agar `from module import specific_name` qilib o'zgartirsang, kod ishlaydimi va aniqroq bo'ladimi?

## Tuzatish (aynan shu)
Hech qachon `import *` ishlatma. Faqat kerakli nomlarni aniq import qil:

```python
# Noto'g'ri (namespace pollution, yashirin):
from math import *
from os.path import *

result = sqrt(x)          # qayerdan? math
path = join(base, name)   # qayerdan? os.path

# To'g'ri (aniq, o'qiladigan):
from math import sqrt
from os.path import join

result = sqrt(x)
path = join(base, name)

# Yoki modul sifatida:
import math
import os.path as osp

result = math.sqrt(x)
path = osp.join(base, name)
```

Agar ko'p nom kerak bo'lsa, modulni import qilib prefiks bilan ishlat. `__all__` bo'lsa ham * dan qoch.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- `from module import *` namespace'ni ifloslaydi va dependensiyalarni yashiradi.
- Har doim aniq nomlarni import qil yoki modulni prefiks bilan ishlat.
- Bu o'qish, xatolarni topish va tool'lar bilan ishlashni yaxshilaydi.
