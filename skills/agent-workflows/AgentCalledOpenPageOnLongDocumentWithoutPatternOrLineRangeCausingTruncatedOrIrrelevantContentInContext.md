---
name: agent-called-open-page-on-long-document-without-pattern-or-line-range
description: When using open_page on a long webpage or document and receiving truncated or mostly irrelevant content because pattern or start_line was not used to target specific sections.
---

# AgentCalledOpenPageOnLongDocumentWithoutPatternOrLineRangeCausingTruncatedOrIrrelevantContentInContext

## Nima uchun bu skill kerak
Long pages return truncated content by default. Without using pattern or start_line, the agent gets irrelevant or incomplete text, leading to wrong conclusions or wasted context.

## Simptom (aynan shu)
Tool result from open_page shows truncated content (e.g. "truncated: showing first/last X KB") or mostly unrelated text when specific info was needed, and the call did not include pattern or start_line parameters.

## Sabab (100%)
The open_page call was made with only the URL (or minimal params), without pattern for regex search or start_line for targeted reading. The tool returns limited content by default on long pages.

## Tasdiqlash
Check the previous open_page tool call arguments: if url is present but pattern is null/absent and start_line is null/absent or 1 without need, and result is truncated or off-topic, this is the cause.

## Tuzatish (aynan shu)
Re-call open_page with pattern for the specific text/section, or start_line if known, and appropriate max_matches/context_lines.

Example:
```
open_page(
  url="https://example.com/long-doc",
  pattern="specific keyword or section heading",
  max_matches=10,
  context_lines=5
)
```
Or:
```
open_page(
  url="https://example.com/long-doc",
  start_line=150
)
```
This extracts only the relevant lines instead of truncated full page.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Always use pattern or start_line (and related params) when calling open_page on potentially long pages to get precise, non-truncated relevant content and save context.
