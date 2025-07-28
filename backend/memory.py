class MemoryStore:
    def __init__(self):
        self.sessions = {}

    def get_history(self, session_id):
        return self.sessions.get(session_id, []).copy()

    def set_history(self, session_id, history):
        self.sessions[session_id] = history[-20:]  # Keep only last 20 messages
