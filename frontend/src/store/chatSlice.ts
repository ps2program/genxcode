import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type Message = {
  role: 'user' | 'model';
  content: string;
};

interface ChatState {
  messages: Message[];
  conversations: Message[][];
  currentConversationIdx: number;
  sessionIds: string[];
  sidebarOpen: boolean;
  codeArtifact: string;
  previewMode: 'code' | 'preview';
  sidebarWidth: number; // Add this for resizable sidebar
  leftSidebarOpen: boolean;
}

const initialState: ChatState = {
  messages: [],
  conversations: [[]],
  currentConversationIdx: 0,
  sessionIds: ['default'],
  sidebarOpen: false,
  codeArtifact: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sample Web Page</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
            text-align: center;
        }
        .feature {
            margin: 20px 0;
            padding: 15px;
            border-left: 4px solid #007bff;
            background: #f8f9fa;
        }
        .button {
            background: #007bff;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            margin: 5px;
        }
        .button:hover {
            background: #0056b3;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Welcome to Our Sample Page</h1>
        
        <div class="feature">
            <h3>Feature 1: Responsive Design</h3>
            <p>This page is fully responsive and works on all devices.</p>
        </div>
        
        <div class="feature">
            <h3>Feature 2: Modern Styling</h3>
            <p>Clean, modern design with smooth animations and hover effects.</p>
        </div>
        
        <div class="feature">
            <h3>Feature 3: Interactive Elements</h3>
            <p>Click the buttons below to see some interactive functionality:</p>
            <button class="button" onclick="alert('Hello! This is a sample alert.')">Click Me!</button>
            <button class="button" onclick="document.body.style.backgroundColor = '#e8f4fd'">Change Background</button>
            <button class="button" onclick="location.reload()">Reload Page</button>
        </div>
        
        <div class="feature">
            <h3>Feature 4: Code Example</h3>
            <p>Here's a simple JavaScript function:</p>
            <pre style="background: #f4f4f4; padding: 10px; border-radius: 5px;">
function greetUser(name) {
    return "Hello, " + name + "! Welcome to our website.";
}

console.log(greetUser("User"));
            </pre>
        </div>
    </div>
</body>
</html>`,
  previewMode: 'code',
  sidebarWidth: 400, // Default width in pixels
  leftSidebarOpen: false,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setMessages(state, action: PayloadAction<Message[]>) {
      state.messages = action.payload;
      state.conversations[state.currentConversationIdx] = action.payload;
    },
    addMessage(state, action: PayloadAction<Message>) {
      state.messages.push(action.payload);
      state.conversations[state.currentConversationIdx].push(action.payload);
    },
    addConversation(state) {
      state.conversations.push([]);
      state.currentConversationIdx = state.conversations.length - 1;
      state.messages = [];
      state.sessionIds.push('default'); // Will be updated when backend responds
    },
    switchConversation(state, action: PayloadAction<number>) {
      state.currentConversationIdx = action.payload;
      state.messages = state.conversations[action.payload];
    },
    setSessionId(state, action: PayloadAction<{ conversationIdx: number; sessionId: string }>) {
      state.sessionIds[action.payload.conversationIdx] = action.payload.sessionId;
    },
    setSidebarOpen(state, action: PayloadAction<boolean>) {
      state.sidebarOpen = action.payload;
    },
    setCodeArtifact(state, action: PayloadAction<string>) {
      state.codeArtifact = action.payload;
    },
    setPreviewMode(state, action: PayloadAction<'code' | 'preview'>) {
      state.previewMode = action.payload;
    },
    setSidebarWidth: (state, action: PayloadAction<number>) => {
      state.sidebarWidth = Math.max(300, Math.min(800, action.payload)); // Min 300px, Max 800px
    },
    setLeftSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.leftSidebarOpen = action.payload;
    },
  },
});

export const { setMessages, addMessage, setSidebarOpen, setCodeArtifact, setPreviewMode, setSidebarWidth, setLeftSidebarOpen, addConversation, switchConversation, setSessionId } = chatSlice.actions;
export default chatSlice.reducer; 