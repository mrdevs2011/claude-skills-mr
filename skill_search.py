"""
mragent uchun skill discovery moduli.

G'oya: barcha SKILL.md fayllarini har safar to'liq context'ga
tashlash o'rniga, faqat kerakli skill'ni qidirib topish.

Tuzilma taxmin qilindi (o'zgartirish oson):
    /skills/<skill-nomi>/SKILL.md
    SKILL.md ichida frontmatter: name, description

Agar sening tuzilishing boshqacha bo'lsa (masalan JSON registry),
faqat load_skill_index() funksiyasini o'zgartirsang yetadi —
qolgani ishlayveradi.
"""

import glob
import os
import re

SKILLS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "skills")


def load_skill_index(skills_dir: str = SKILLS_DIR) -> list[dict]:
    """Har bir skill uchun {name, description, path} qaytaradi.
    Ham eski skills/*/SKILL.md, ham hozirgi flat *.md (skills/<kategoriya>/*.md) ni qo'llab-quvvatlaydi.
    """
    index = []
    # Eski tuzilma: skills/skill-name/SKILL.md
    for md_path in glob.glob(os.path.join(skills_dir, "*", "SKILL.md")):
        text = open(md_path, encoding="utf-8").read()
        name_m = re.search(r"^name:\s*(.+)$", text, re.MULTILINE)
        desc_m = re.search(r"^description:\s*(.+)$", text, re.MULTILINE)
        index.append({
            "name": (name_m.group(1).strip() if name_m
                     else os.path.basename(os.path.dirname(md_path))),
            "description": desc_m.group(1).strip() if desc_m else "",
            "path": md_path,
        })
    # Hozirgi tuzilma: skills/<category>/*.md (yoki to'g'ridan-to'g'ri)
    for md_path in glob.glob(os.path.join(skills_dir, "**", "*.md"), recursive=True):
        if os.path.basename(md_path) == "SKILL.md":
            continue  # allaqachon qo'shilgan
        text = open(md_path, encoding="utf-8").read()
        name_m = re.search(r"^name:\s*(.+)$", text, re.MULTILINE)
        desc_m = re.search(r"^description:\s*(.+)$", text, re.MULTILINE)
        if name_m or desc_m:  # frontmatter bor bo'lsa skill deb hisobla
            index.append({
                "name": (name_m.group(1).strip() if name_m
                         else os.path.splitext(os.path.basename(md_path))[0]),
                "description": desc_m.group(1).strip() if desc_m else "",
                "path": md_path,
            })
    return index


def _score(query_words: list[str], skill: dict) -> int:
    haystack = f"{skill['name']} {skill['description']}".lower()
    return sum(1 for w in query_words if w in haystack)


def search_skills(query: str, skills_dir: str = SKILLS_DIR,
                   index: list[dict] | None = None) -> list[dict]:
    """Bitta so'rov bo'yicha mos skill'larni topadi, mosligi bo'yicha saralab."""
    index = index or load_skill_index(skills_dir)
    words = [w for w in query.lower().split() if len(w) > 2]
    scored = [(s, _score(words, s)) for s in index]
    return [s for s, sc in sorted(scored, key=lambda t: -t[1]) if sc > 0]


# Query topilmasa sinaladigan kengaytirilgan variantlar.
# Ehtiyojga qarab to'ldirib boraver — bu oddiy qo'lda lug'at,
# LLM chaqirmasdan ishlaydi, tez va bepul.
SYNONYMS = {
    "pdf": ["pdf", "hujjat", "document", "fayl"],
    "excel": ["excel", "xlsx", "spreadsheet", "jadval"],
    "word": ["word", "docx", "hujjat", "document"],
    "slide": ["slide", "pptx", "prezentatsiya", "taqdimot"],
    "rasm": ["rasm", "image", "photo", "surat"],
    "kod": ["kod", "code", "script", "dastur"],
}


def _expand(query: str) -> list[str]:
    words = query.lower().split()
    variants = []
    for w in words:
        if w in SYNONYMS:
            variants.extend(SYNONYMS[w])
    # asl so'rovni ham variant sifatida qo'shamiz, lekin oxiriga
    variants = list(dict.fromkeys(variants))  # tartib bilan unique
    return variants[:5] if variants else []


def search_skills_with_fallback(query: str,
                                 skills_dir: str = SKILLS_DIR) -> list[dict]:
    """
    1) to'g'ridan-to'g'ri qidiradi
    2) hech narsa topilmasa, 4-5 ta kengaytirilgan variant bilan qayta urinadi
    3) baribir topilmasa, bo'sh ro'yxat qaytaradi (list_all emas)
    """
    index = load_skill_index(skills_dir)

    result = search_skills(query, index=index)
    if result:
        return result

    for variant in _expand(query):
        result = search_skills(variant, index=index)
        if result:
            return result

    return []


# --- tool-calling schema (OpenAI/Groq/Anthropic uslubida) ---
SEARCH_SKILLS_TOOL_SCHEMA = {
    "type": "function",
    "function": {
        "name": "search_skills",
        "description": (
            "Kerakli ishni bajarish uchun mos skill'ni qidiradi. "
            "Har doim shu tool orqali qidir, hamma skill'larni "
            "birdan ko'rmaysan — faqat mos kelganini yuklaysan."
        ),
        "parameters": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "Vazifaga oid kalit so'zlar (masalan: 'pdf yaratish')",
                }
            },
            "required": ["query"],
        },
    },
}


def handle_search_skills_call(query: str) -> str:
    """Flask route yoki tool-router ichida chaqiriladigan handler."""
    matches = search_skills_with_fallback(query)
    if not matches:
        return "Mos skill topilmadi."
    lines = [f"- {s['name']}: {s['description']}" for s in matches[:5]]
    return "Topilgan skill'lar:\n" + "\n".join(lines)


if __name__ == "__main__":
    # tezkor tekshirish uchun
    import sys
    q = " ".join(sys.argv[1:]) or "pdf"
    print(handle_search_skills_call(q))
