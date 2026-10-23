---
name: agent-called-connected-tool-without-schema-search
description: Call to call_connected_tool fails or uses wrong arguments because the agent guessed the tool name or schema instead of first calling search_connected_tools to discover the exact tool and its input schema.
---

# AgentCalledCallConnectedToolWithGuessedArgumentsInsteadOfUsingSearchConnectedToolsForSchema

## Nima uchun bu skill kerak
Connected tools (MCP Hub, Excalidraw, Voice va boshqalar) dinamik. Ularning aniq nomlari va argument sxemalari `search_connected_tools` orqali olinadi. Taxmin qilib `call_connected_tool` chaqirish argument xatosi yoki noto'g'ri tool nomiga olib keladi.

## Simptom (aynan shu)
- `call_connected_tool` chaqirilganda "unknown tool", "missing required argument", "invalid arguments" yoki schema mismatch xatosi chiqadi.
- Agent tool nomini yoki argumentlarni yoddan yoki oldingi suhbatdan taxmin qilib yozgan.
- `search_connected_tools` umuman chaqirilmagan yoki natijasi ishlatilmagan.

## Sabab (100%)
Agent `search_connected_tools` bilan aniq tool nomi va uning `input_schema` sini oldindan o'qimasdan `call_connected_tool` ni chaqirgan. Connected tools ro'yxati va sxemasi har safar o'zgarishi mumkin, shuning uchun taxmin ishlamaydi.

## Tasdiqlash
1. Oldingi tool chaqiruvlarini tekshir: `search_connected_tools` bor-yo'qligini ko'r.
2. `call_connected_tool` argumentlarini schema bilan solishtir — agar schema olinmagan bo'lsa, sabab shu.
3. Xato matnida "schema", "required", "unknown tool" so'zlari bo'lsa, tasdiqlanadi.

## Tuzatish (aynan shu)
Har doim avval qidiruv:

```javascript
// 1. Qidiruv
const searchResult = await search_connected_tools({
  query: "create issue",  // yoki kerakli harakat
  limit: 5
});

// 2. Natijadan aniq tool_name va schema ni ol
const tool = searchResult.tools.find(t => t.name.includes("create"));
// tool.input_schema dan required maydonlarni o'qi

// 3. Faqat shundan keyin chaqir
await call_connected_tool({
  tool_name: tool.name,  // aniq nom, taxmin emas
  arguments: {
    // schema ga 100% mos argumentlar
    title: "Bug report",
    body: "..."
  }
});
```

Hech qachon tool nomini yoki argumentlarni taxmin qilma. Agar `search_connected_tools` bo'sh qaytarsa — connector ulanmagan, foydalanuvchiga ayt.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
`call_connected_tool` dan oldin har doim `search_connected_tools` chaqirib, aniq tool nomi va `input_schema` ni olish kerak. Taxmin qilish argument xatosiga olib keladi.
