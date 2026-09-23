"""
mragent Flask backend ichiga search_skills tool'ini qanday ulash
mumkinligi haqida qisqa misol.

Bu fayl ishga tushirish uchun emas — namuna sifatida.
O'zingning tool-router kodingga shu ulanish qismini ko'chirasan.
"""

from flask import Flask, request, jsonify

from skill_search import (
    SEARCH_SKILLS_TOOL_SCHEMA,
    handle_search_skills_call,
)

app = Flask(__name__)

# LLM'ga beriladigan tool ro'yxatiga qo'shiladi
AVAILABLE_TOOLS = [
    SEARCH_SKILLS_TOOL_SCHEMA,
    # ... boshqa tool schema'laring
]

# Tool nomi -> handler funksiya
TOOL_HANDLERS = {
    "search_skills": lambda args: handle_search_skills_call(args["query"]),
    # ... boshqa handler'lar
}


@app.route("/tool-call", methods=["POST"])
def tool_call():
    """LLM tool_use qaytarganda, mragent shu endpoint orqali bajaradi."""
    data = request.json
    name = data["tool_name"]
    args = data.get("arguments", {})

    handler = TOOL_HANDLERS.get(name)
    if handler is None:
        return jsonify({"error": f"noma'lum tool: {name}"}), 400

    result = handler(args)
    return jsonify({"result": result})


if __name__ == "__main__":
    # tezkor sinov: python app_example.py so'ng
    # curl -X POST localhost:5000/tool-call -d '{"tool_name":"search_skills","arguments":{"query":"pdf"}}'
    app.run(port=5000)
