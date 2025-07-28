import os
import httpx
import asyncio
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

GROQ_API_KEY = os.getenv("GROQ")
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL = "llama3-70b-8192"  # You can change to another Groq-supported model if needed

async def stream_groq_response(history):
    if not GROQ_API_KEY:
        yield "[Error: GROQ_API_KEY environment variable not set. Please create a .env file in the backend directory with your API key.]"
        return

    # Prepare messages for OpenAI-compatible Groq API
    messages = []
    for msg in history:
        if msg["role"] == "user":
            messages.append({"role": "user", "content": msg["content"]})
        else:
            messages.append({"role": "assistant", "content": msg["content"]})

    payload = {
        "model": GROQ_MODEL,
        "messages": messages,
        "stream": True
    }

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    async with httpx.AsyncClient(timeout=60.0) as client:
        try:
            async with client.stream("POST", GROQ_API_URL, headers=headers, json=payload) as response:
                async for line in response.aiter_lines():
                    if line.strip().startswith("data: "):
                        data = line.removeprefix("data: ").strip()
                        if data == "[DONE]":
                            break
                        try:
                            import json
                            chunk = json.loads(data)
                            delta = chunk["choices"][0]["delta"].get("content", "")
                            if delta:
                                yield delta
                        except Exception:
                            continue
        except Exception as e:
            yield f"[Error: {str(e)}]"