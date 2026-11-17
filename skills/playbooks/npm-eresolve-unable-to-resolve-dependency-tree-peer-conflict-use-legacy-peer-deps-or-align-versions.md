---
name: npm-eresolve-unable-to-resolve-dependency-tree-peer-conflict-use-legacy-peer-deps-or-align-versions
description: npm install da "ERESOLVE unable to resolve dependency tree" / peer dependency conflict. --legacy-peer-deps yoki version align. Triggers on exact error.
id: npm-eresolve-unable-to-resolve-dependency-tree-peer-conflict-use-legacy-peer-deps-or-align-versions
type: playbook
stack: npm 10.8.2 + Node.js v20.20.2
confirmed_on: 2026-11-17
confidence: high (reproduced in sandbox + official docs)
triggers:
  - npm error code ERESOLVE
  - ERESOLVE unable to resolve dependency tree
  - Could not resolve dependency peer
  - npm install peer dependency conflict
  - Fix the upstream dependency conflict or retry with --force or --legacy-peer-deps
  - npm ERR! ERESOLVE
  - peerDependencies conflict npm install fails
  - react peer dependency mismatch
  - npm legacy-peer-deps
  - dependency tree cannot be resolved
related:
  - playbooks/node-esm-cjs-mismatch-import-outside-module-or-require-not-defined.md
---

# npm ERESOLVE: peer dependency conflict, dependency tree resolve bo'lmaydi

## TL;DR
Simptom: `npm install` da `npm error code ERESOLVE` / `unable to resolve dependency tree` + `Could not resolve dependency: peer X@"^a || ^b" from Y`.
Sabab: npm 7+ strict peerDeps; bir package boshqa versiyani talab qiladi (masalan react@19 vs react@"^16 || ^17 || ^18").
Birinchi buyruq: xato matnini o'qi — "Found:" va "peer" qatorlarini top.
Done: `npm install` (yoki --legacy-peer-deps) exit 0, `ls node_modules/<pkg>` mavjud.

## Qachon ishlatish / ishlatmaslik
Ishlat: `npm install` / `npm ci` ERESOLVE bilan to'xtasa, peerDeps nomi aniq yozilgan.
Ishlatma: oddiy "module not found", network xato, yoki version range sintaksis xatosi. Yoki yarn/pnpm ishlatilsa (ular boshqa).

## Mental model (nima uchun)
[SRC:https://docs.npmjs.com/cli/v10/configuring-npm/package-json#peerdependencies @ v10, 2026-11] peerDependencies — host/plugin mosligini bildiradi. npm 3-6 da warning, 7+ da default install qilinadi va conflict error. [SRC:https://docs.npmjs.com/cli/v11/using-npm/config#legacy-peer-deps @ v11, 2026-11] `--legacy-peer-deps` peerlarni butunlay e'tiborsiz qoldiradi (npm 6 kabi). [SANDBOX] react@^19 + react-quill@^2.0.0 → ERESOLVE.

## Diagnosis tree (arzonidan qimmatiga)
1. Xato matnini to'liq o'qi (bash tool truncate bo'lsa logni o'qi):  
   `npm install 2>&1 | cat` yoki `/root/.npm/_logs/*eresolve-report.txt`  
   EXPECTED: "Found: react@19.x" va "peer react@\"^16 || ^17 || ^18\" from react-quill@2.0.0".  
   Agar boshqa xato (ENOENT, 404) → bu skill emas.

2. Conflicting package'ni tekshir:  
   `npm view react-quill peerDependencies`  
   EXPECTED: {"react":"^16 || ^17 || ^18"}.  
   Agar yangi versiya bor: `npm view react-quill versions --json | tail`.

3. Hozirgi tree:  
   `npm ls react 2>/dev/null || true`  
   EXPECTED: conflict ko'rsatadi yoki bo'sh.

4. Yangi versiya sinab:  
   `npm install react-quill@latest --dry-run`  
   EXPECTED: agar resolve bo'lsa, upgrade qil.

## Fix har bir sabab uchun
Sabab 1 (eng ko'p): peer range mos emas.  
Fix tez (vaqtinchalik):  
```bash
npm install --legacy-peer-deps
```
Tekshir: exit 0, `ls node_modules/react node_modules/react-quill`.

Doimiy:  
```bash
echo "legacy-peer-deps=true" > .npmrc
npm install
```

Yaxshiroq (align):  
package.json da conflicting package'ni yangila yoki overrides qo'sh:  
```json
"overrides": {
  "react-quill": {
    "react": "$react"
  }
}
```
Keyin `rm -rf node_modules package-lock.json && npm install`.

## Agentlar qayerda xato qiladi
1. `--force` ni birinchi ishlatadi — xavfliroq, node_modules buzilishi mumkin.
2. Xato matnini o'qimay, umumiy "npm cache clean" qiladi — bu peer conflictni yechmaydi.
3. package.json ni o'zgartirmay, faqat flag bilan ishlaydi, keyin CI da `npm ci` muvaffaqiyatsiz.
4. Yangi versiya borligini `npm view` bilan tekshirmaydi.

## Edge cases
1. `npm ci` ishlatilsa --legacy-peer-deps kerak, lockfile eski bo'lsa. [SANDBOX]
2. Workspaces yoki monorepo da overrides rootda bo'lishi kerak.
3. `--strict-peer-deps` yoqilgan bo'lsa flag ishlamaydi. [not verified sandbox]
4. Yarn classic/berry yoki pnpm — bu skill emas, ularning o'z peer logikasi bor.

## Done criteria
```bash
npm install --legacy-peer-deps
echo $?   # 0
ls node_modules/react node_modules/react-quill >/dev/null && echo OK
npm ls --depth=0 2>&1 | grep -E 'UNMET|invalid' || echo "no unmet"
```
Agar overrides ishlatilsa, `npm ls` da deduped yoki to'g'ri versiya.

## If still failing
- `rm -rf node_modules package-lock.json && npm cache clean --force && npm install --legacy-peer-deps`
- Conflicting package'ni o'chirib, alternative qidir.
- Rasmiy docs: https://docs.npmjs.com/cli/v10/using-npm/config#legacy-peer-deps

## Sources + confidence
- [SRC:https://docs.npmjs.com/cli/v10/configuring-npm/package-json#peerdependencies @ npm docs v10, 2026-11]
- [SRC:https://docs.npmjs.com/cli/v11/using-npm/config#legacy-peer-deps @ 2026-11]
- [SANDBOX] react@19 + react-quill@2.0.0 → ERESOLVE, --legacy-peer-deps muvaffaqiyatli (npm 10.8.2)
- Confidence: high
