from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from memory import MemoryStore
from groq import stream_groq_response
import asyncio
import uuid

app = FastAPI()

# Allow CORS for local frontend dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

memory = MemoryStore()

@app.post("/new-chat")
async def new_chat():
    """Create a new chat session and return a unique session ID"""
    session_id = str(uuid.uuid4())
    # Initialize empty history for new session
    memory.set_history(session_id, [])
    return {"session_id": session_id}

@app.post("/chat")
async def chat(request: Request):
    data = await request.json()
    user_message = data.get("message", "")
    session_id = data.get("session_id")
    
    if not session_id:
        return {"error": "session_id is required"}

    # Retrieve short-term memory for this session
    history = memory.get_history(session_id)
    # Add user message to history
    history.append({"role": "user", "content": user_message})
    memory.set_history(session_id, history)

    async def event_stream():
        async for chunk in stream_groq_response(history):
            yield chunk

    return StreamingResponse(event_stream(), media_type="text/event-stream")
