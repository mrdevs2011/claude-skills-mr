---
name: supabase-select-returns-empty-array-despite-data-because-rls-enabled-no-policy
description: Supabase client select returns empty array with error null even though table has rows. Cause: RLS enabled with no matching SELECT policy (default deny). Use when dashboard/SQL editor shows data but app gets [].
id: supabase-select-returns-empty-array-despite-data-because-rls-enabled-no-policy
type: playbook
stack: Supabase (Postgres RLS + PostgREST Data API), client JS/Python, any version with RLS
confirmed_on: 2026-11-11
confidence: high (official docs + local simulation of client response)
triggers:
  - supabase select returns empty array but data exists
  - supabase from().select() data [] error null
  - RLS enabled query returns nothing no error
  - table has rows in SQL editor but client gets []
  - supabase empty array no policy
  - "data": [] "error": null supabase
  - select returns empty despite data in table supabase
  - RLS on no SELECT policy empty result
  - supabase query works in dashboard not in app
  - bo'sh array qaytaryapti lekin data bor supabase
related:
  - none close
---

# Supabase select bo'sh array qaytaradi (data bor, xato yo'q) — RLS yoqilgan, policy yo'q

## TL;DR
Simptom: client `supabase.from('posts').select()` → `{ data: [], error: null }`, lekin SQL editor yoki dashboard'da qatorlar bor.
Sabab: RLS yoqilgan va mos SELECT policy yo'q (default deny). PostgREST xato bermaydi, faqat filtrlaydi.
Birinchi buyruq (SQL editor): `SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname='public' AND tablename='posts';`
Done: client select qatorlarni qaytaradi, error null yoki yo'q.

## Qachon ishlatish / ishlatmaslik
Ishlat: client (anon/authenticated key) orqali select bo'sh, lekin data aniq bor, xato yo'q.
Ishlatma: haqiqiy filter (eq, like) tufayli bo'sh; yoki error 42501 (grant yo'q); yoki service_role key ishlatilgan (u RLS bypass qiladi).

## Mental model (nima uchun)
[SRC:https://supabase.com/docs/guides/database/postgres/row-level-security @ current 2026-11] "Once RLS is enabled, no data is accessible through the API when using a publishable key, until you create policies."
RLS — default deny. Policy yo'q bo'lsa yoki mos kelmasa, qatorlar "ko'rinmaydi". PostgREST bu holatda HTTP 200 + bo'sh array qaytaradi, xato emas — mavjudlikni yashirish uchun. SQL editor `postgres` role bilan ishlaydi, RLS bypass. [SANDBOX simulation]

## Diagnosis tree (arzonidan qimmatiga)
1. Client javobini to'liq ko'r: `console.log(JSON.stringify(result))` yoki Python print.
   EXPECTED if this bug: `{"data": [], "error": null}`. Agar error bor → boshqa sabab (grant, auth).
   Agar data bor → bu skill emas.

2. SQL editor'da (postgres): `SELECT count(*) FROM posts;` 
   EXPECTED: >0. Agar 0 → data yo'q, policy emas. [SRC]

3. RLS holati: `SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname='public' AND tablename='posts';`
   EXPECTED: rowsecurity = t (true). Agar f → RLS o'chiq, boshqa muammo.

4. Policy'lar: `SELECT polname, polcmd FROM pg_policy WHERE polrelid = 'public.posts'::regclass;`
   EXPECTED: 0 rows yoki SELECT uchun mos policy yo'q. Agar bor lekin using shart mos kelmasa → policy tuzat.

5. Auth tekshir (agar authenticated policy): client'da session borligini, yoki SQL: `select auth.uid();` yoki test function. Agar null → login yo'q.

## Fix har bir sabab uchun
Sabab 1 (eng ko'p): RLS on + SELECT policy yo'q.
Fix (SQL editor yoki migration):
```sql
create policy "anyone can read posts"
on public.posts
for select
to anon, authenticated
using (true);
```
Tekshir: client select qayta chaqir → data qaytishi kerak.

Sabab 2: policy bor lekin `using (auth.uid() = user_id)` va session yo'q.
Fix: to'g'ri login qil, yoki vaqtincha `using (true)` bilan sinab, keyin qaytar.

Sabab 3: grant yo'q (kamdan-kam, 42501 xato beradi).
`grant select on table public.posts to anon, authenticated;`

## Agentlar qayerda xato qiladi
1. Bo'sh array'ni "data yo'q" deb o'ylab, insert qilishga urinish yoki filter o'zgartirish.
2. SQL editor ishlasa "client xato" deb o'ylash, RLS ni tekshirmaslik.
3. Service role key'ni client'da ishlatib "ishladi" deb o'ylash (xavfsizlik buziladi).
4. Policy yaratish o'rniga RLS o'chirish (xavfli).

## Edge cases
1. Realtime: SELECT policy bo'lmasa events ham kelmaydi. [SRC]
2. Views: view'da RLS alohida.
3. Filter + RLS: ikkalasi ham bo'sh qilishi mumkin — avval policy'siz sinab.
4. Sandbox'da to'liq Supabase yo'q — faqat simulation. [not verified full instance]

## Done criteria
```js
// Client'da
const { data, error } = await supabase.from('posts').select('*').limit(1);
console.log(data.length > 0, error);  // true, null
```
Yoki Python: print(len(response.data) > 0)
SQL: `SELECT polname FROM pg_policy WHERE polrelid = 'public.posts'::regclass AND polcmd = 'r';` — kamida 1 qator.

## Agar hali ham ishlamasa
- Dashboard → Authentication → Policies → Enable RLS va New Policy.
- `select auth.jwt();` orqali role tekshir.
- Docs: https://supabase.com/docs/guides/troubleshooting/why-is-my-select-returning-an-empty-data-array-and-i-have-data-in-the-table-xvOPgx
- Grant vs policy: 42501 = grant, [] = policy filter.

## Sources + confidence
- [SRC:https://supabase.com/docs/guides/database/postgres/row-level-security] "Once RLS is enabled, no data is accessible... until you create policies." 2026-11 o'qildi.
- [SRC:https://supabase.com/docs/guides/troubleshooting/why-is-my-select-returning-an-empty-data-array...] 
- [SANDBOX] 2026-11-11: simulation mock_select(rls=True, policy=False) → {"data": [], "error": null}; policy=True → data returned.
- Confidence: 95% (docs aniq, simulation mos). To'liq live Supabase instance bu sandboxda yo'q.
