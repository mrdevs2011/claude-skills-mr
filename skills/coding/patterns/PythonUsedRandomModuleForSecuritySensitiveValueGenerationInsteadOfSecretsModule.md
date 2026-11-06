---
name: python-used-random-module-for-security-sensitive-value-generation-instead-of-secrets-module
description: Xavfsizlik uchun token, parol yoki tasodifiy qiymat yaratishda random moduli ishlatilganda bashorat qilinadigan natija chiqadi; secrets moduli ishlatish kerak.
---

# Xavfsiz tasodifiy qiymatlar uchun random o'rniga secrets

## Nima uchun bu skill kerak
Pythonning `random` moduli kriptografik jihatdan xavfsiz emas. U bashorat qilinadigan PRNG ishlatadi, shuning uchun token, session ID, parol, nonce yoki boshqa xavfsizlikka tegishli tasodifiy qiymatlar uchun ishlatilsa, hujumchi uni taxmin qilishi yoki oldindan bilishi mumkin.

## Simptom (aynan shu)
Kodda `import random` dan keyin `random.choice`, `random.randint`, `random.token_urlsafe` o'rniga oddiy random funksiyalari bilan token yoki parol generatsiya qilingan. Masalan, API kaliti yoki reset tokeni `random` bilan yaratilgan va xavfsizlik auditida yoki hujumda zaif deb topilgan.

## Sabab (100%)
`random` moduli Mersenne Twister algoritmini ishlatadi, bu kriptografik xavfsiz emas. Seed ni bilsa yoki etarli output ni ko'rsa, keyingi qiymatlarni bashorat qilish mumkin. `secrets` moduli esa OS darajasidagi kriptografik PRNG (os.urandom) ni ishlatadi.

## Tasdiqlash
Kodni qidir: `import random` va keyin token/parol/session generatsiya joylari. Quyidagi test bilan farqni ko'r:

```python
import random
import secrets

# random — bashorat qilinadi (seed bilan)
random.seed(42)
print(random.randrange(10**6))  # har doim bir xil

# secrets — xavfsiz
print(secrets.randbelow(10**6))  # har safar boshqacha, bashorat qilib bo'lmaydi
```

Agar `random.choice` yoki shunga o'xshash xavfsizlik uchun ishlatilgan bo'lsa — bu skill mos.

## Tuzatish (aynan shu)
Xavfsizlikka tegishli barcha tasodifiy generatsiyani `secrets` ga o'tkaz:

```python
# Noto'g'ri
import random
import string

def generate_token(length=32):
    chars = string.ascii_letters + string.digits
    return ''.join(random.choice(chars) for _ in range(length))

# To'g'ri
import secrets
import string

def generate_token(length=32):
    chars = string.ascii_letters + string.digits
    return ''.join(secrets.choice(chars) for _ in range(length))

# Yoki soddaroq
token = secrets.token_urlsafe(32)
password = secrets.token_hex(16)
```

Oddiy simulyatsiya yoki test uchun `random` qolishi mumkin, lekin production xavfsizlik qiymatlari uchun faqat `secrets`.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Xavfsizlik uchun tasodifiy qiymat (token, parol, nonce) generatsiya qilishda `random` emas, doim `secrets` modulini ishlat. `random` bashorat qilinadi, `secrets` kriptografik xavfsiz.
