---
name: deferred-tools-require-tool-search-before-call-unknown-tool-or-no-matching
description: Deferred tools (defer_loading true or MCP) not in context until tool_search / ToolSearch / search_connected_tools called. Errors: unknown tool, Tool is deferred Use tool_search first, No matching deferred tools found, All tools have defer_loading set. Fix by searching first then calling the tool.
id: deferred-tools-require-tool-search-before-call-unknown-tool-or-no-matching
type: playbook
stack: Claude API (tool_search_tool_regex_20251119 / tool_search_tool_bm25_20251119, defer_loading), Claude Code ToolSearch (ENABLE_TOOL_SEARCH), OpenAI tool_search, Grok search_connected_tools
confirmed_on: 2026-11-14
confidence: high (official docs + sandbox simulation)
triggers:
  - Tool 'X' is deferred. Use tool_search first
  - unknown tool or tool not found deferred
  - No matching deferred tools found
  - All tools have defer_loading set. At least one tool must be non-deferred
  - Tool reference 'unknown_tool' has no corresponding tool definition
  - deferred tools not loaded need tool_search
  - search_connected_tools before call_connected_tool
  - ToolSearch required for MCP tools
  - defer_loading true tool not in context
  - how to call deferred tool Claude or OpenAI
related:
  - extract-relevant-part-from-huge-tool-output-or-session-log-without-loading-entire-into-context
  - agent-unstuck-protocol-after-two-similar-failures-explain-problem-clearly
---

# Deferred tools tool_search chaqirilguncha yuklanmaydi — unknown tool xatosi

## TL;DR
Simptom: tool chaqiruvi "unknown tool", "Tool 'X' is deferred. Use tool_search first", "No matching deferred tools found" yoki "All tools have defer_loading set" qaytaradi.
Sabab: tool defer_loading=true yoki MCP deferred, context'ga schema yuklanmagan; avval search kerak.
Birinchi buyruq: tool_search / ToolSearch / search_connected_tools(query="relevant keyword") chaqir, keyin tool'ni call qil.
Done: search natija tool_reference yoki loaded, keyin tool_use muvaffaqiyatli, error yo'q.

## Qachon ishlatish / ishlatmaslik
Ishlat: ko'p tool/MCP bo'lganda, tool chaqirishda "not found"/"deferred", Claude Code ToolSearch, Claude API defer_loading, OpenAI tool_search, Grok connected tools search.
Ishlatma: oddiy 1-5 non-deferred tool, yoki tool allaqachon context'da (schema ko'rinadi). ENABLE_TOOL_SEARCH=false bo'lsa barcha yuklangan.

## Mental model (nima uchun)
[SRC:https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-search-tool @ 2026-11] defer_loading:true bo'lgan tool'lar system prompt prefix'iga kirmaydi, faqat tool_search orqali topilganda tool_reference expand qilinadi. Bu context bloat (~55k token) oldini oladi, accuracy saqlaydi. Tool search o'zi non-deferred bo'lishi shart. [SANDBOX] simulatsiyada search qilmasdan call xato, search dan keyin ishlaydi. Claude Code'da default on, ToolSearch chaqirish kerak. [REPO:instruction.md tool katalogi]

## Diagnosis tree (arzonidan qimmatiga)
1. Tool javobini o'qi: "deferred", "unknown tool", "No matching deferred tools found", "All tools have defer_loading" borligini tekshir.
   EXPECTED: xato matni. Agar oddiy schema mismatch — boshqa skill. Agar success — done.

2. Qaysi platforma: Claude API / Claude Code / OpenAI / Grok.
   EXPECTED: agar Claude — ToolSearch yoki tool_search_tool_*. Agar Grok — search_connected_tools. [SRC docs]

3. Search chaqir: tool_search(query="weather" yoki pattern="get_.*") yoki search_connected_tools(query="action").
   EXPECTED: tool_references yoki tool list qaytadi, loaded bo'ladi. Agar bo'sh — query o'zgartir yoki MCP ulanmagan.

4. Endi tool call: get_weather(location=...) yoki call_connected_tool.
   EXPECTED: tool_result success, stop_reason tool_use. Agar yana deferred — search qayta.

5. Agar 400 error "All tools deferred": tool_search'ni defer_loading=false qil, kamida bitta non-deferred saqla.

## Fix per cause
- Deferred not searched: avval search, keyin call. Copy-paste:
```python
# Wrong (sandbox sim)
# call_tool("get_weather") → DeferredToolError: Tool 'get_weather' is deferred. Use tool_search first.
# Right
tool_search("weather")  # loads
call_tool("get_weather", location="SF")  # works
```
- Claude API: tools array'da tool_search_tool_regex_20251119 non-deferred, boshqalar defer_loading=true. Search server_tool_use, keyin tool_use.
- Claude Code: ToolSearch(query="...") chaqir, keyin tool.
- Grok: search_connected_tools(query="search pages" yoki aniq action), keyin call_connected_tool(tool_name=..., arguments=...).
- All deferred 400: kamida tool_search non-deferred qil.

## Where agents go wrong (>=3)
1. Search qilmasdan to'g'ridan-to'g'ri tool nomini chaqirish — "unknown tool" yoki deferred error.
2. Tool search'ni o'zini defer_loading=true qo'yish — "All tools have defer_loading set" 400.
3. Search natijasini e'tiborsiz qoldirib, qayta xuddi shu xato toolni chaqirish.
4. Query juda umumiy yoki noto'g'ri — "No matching deferred tools found", lekin tool bor.
5. MCP server ulanmagan deb o'ylab, search qilmasdan taslim bo'lish.

## Edge cases (>=2)
1. Tool search limit (default 5), ko'p match — limit oshir yoki aniq query. [SRC]
2. ENABLE_TOOL_SEARCH=false yoki auto: barcha upfront yuklanadi, search kerak emas. [SRC Claude Code]
3. Custom tool search: tool_reference qaytarish kerak, expand API qiladi.
4. OpenAI gpt-5.4+ tool_search, client yoki hosted. [not fully verified sandbox]
5. Wayland/Android: MCP specific, CLI'da ishlashi mumkin. [not verified]

## Done criteria (proving commands)
- Search chaqiruvi tool_references yoki loaded list qaytaradi.
- Keyingi tool call exit 0 / tool_result success, "deferred"/"unknown" yo'q.
- Sandbox sim: searchdan keyin call_tool ishlaydi, oldin error.
- Claude: response'da server_tool_use + tool_search_tool_result + tool_use.

## If still failing
- Query/pattern o'zgartir: tool nomini yoki description qismini ishlat.
- MCP status tekshir: server ulanganmi, tool list.
- Docs: https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-search-tool
- ENABLE_TOOL_SEARCH=true yoki false sinab ko'r.
- Agar 400 missing definition: tool definition tools array'da borligini tekshir.

## Sources + confidence
- [SRC:https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-search-tool] 2026-11 o'qildi: defer_loading, tool_reference, errors "All tools have defer_loading set", "Tool reference 'unknown_tool' has no corresponding".
- [SRC:https://code.claude.com/docs/en/agent-sdk/tool-search] ToolSearch default on.
- [SANDBOX] 2026-11-14: Python sim DeferredToolError on direct call, success after tool_search.
- Confidence: 85% (docs aniq, full API call API key yo'qligi sababli not run; sim + error matnlari mos).
