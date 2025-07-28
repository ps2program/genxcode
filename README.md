# GenXCode - AI Coding Assistant

A Claude-style AI coding assistant built with React, FastAPI, and Gemini 2.5 API. Features streaming responses, conversation history, code artifact preview, and mobile-responsive design.

## 🌐 Live Demo

**🚀 [Try GenXCode Live](https://genxcode.onrender.com/)**

Experience the AI coding assistant in action with my deployed application.

## 🚀 Features

- **Claude-style Chat Interface** - Clean, modern chat UI with streaming responses
- **Conversation History** - Multiple conversations with search functionality
- **Code Artifact Sidebar** - Syntax-highlighted code editor and live preview
- **Mobile Responsive** - Works seamlessly on all devices
- **Dark/Light Theme** - Toggle between themes with system preference detection
- **Edit/Resend Messages** - Modify or resend past prompts
- **Session Management** - Isolated conversation histories
- **File Download** - Download generated code artifacts

## 🧠 How I Approached the Problem

### **Design Philosophy**
I approached this project with a focus on creating a **Claude-like experience** that feels intuitive and powerful. The key was balancing simplicity with functionality - making complex AI interactions feel natural and accessible.

### **Architecture Strategy**

#### **1. Component-Driven Design**
- **Modular Architecture**: Built with reusable components (Chat, Sidebar, CodeEditor, etc.)
- **Separation of Concerns**: Clear distinction between UI components and business logic
- **State Management**: Used Redux Toolkit for predictable state management across the app

#### **2. Real-time Streaming Implementation**
- **Server-Sent Events**: Implemented streaming responses using FastAPI's StreamingResponse
- **Progressive UI Updates**: Messages appear in real-time as the AI generates responses
- **Error Handling**: Graceful fallbacks for network issues and API failures

#### **3. Code Artifact Detection & Display**
- **Smart Parsing**: Regex-based code block extraction from AI responses
- **Dynamic Sidebar**: Context-aware sidebar that opens only when code is detected
- **Dual View Modes**: Toggle between syntax-highlighted code editor and live preview

#### **4. Memory Management**
- **Session-Based Storage**: In-memory conversation history per session
- **Context Preservation**: Maintains conversation context for coherent AI responses
- **Scalable Design**: Easy to extend to persistent storage solutions

### **Technical Challenges & Solutions**

#### **Challenge 1: Streaming Response Integration**
**Problem**: Implementing real-time streaming from Groq API to React frontend
**Solution**: 
- Used FastAPI's StreamingResponse for backend streaming
- Implemented ReadableStream API on frontend for chunk-by-chunk processing
- Added loading states and progressive UI updates

#### **Challenge 2: Code Artifact Detection**
**Problem**: Reliably detecting and extracting code blocks from AI responses
**Solution**:
- Implemented regex-based code block detection
- Added language detection for syntax highlighting
- Created fallback mechanisms for edge cases

#### **Challenge 3: Responsive Sidebar Design**
**Problem**: Creating a sidebar that works seamlessly on mobile and desktop
**Solution**:
- Mobile-first responsive design with overlay on small screens
- Resizable sidebar on desktop with drag handles
- Smooth animations and transitions

#### **Challenge 4: State Synchronization**
**Problem**: Keeping UI state synchronized across multiple components
**Solution**:
- Centralized state management with Redux Toolkit
- Immutable state updates for predictable behavior
- Optimistic UI updates for better user experience

### **User Experience Considerations**

#### **Accessibility**
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- Responsive design for all screen sizes

#### **Performance**
- Lazy loading of heavy components (Monaco Editor)
- Efficient re-rendering with React optimization
- Minimal bundle size with tree shaking

#### **Usability**
- Intuitive chat interface similar to Claude
- Clear visual feedback for all interactions
- Helpful error messages and loading states

## 🛠️ Tech Stack

### Frontend
- **React** - UI framework
- **TypeScript** - Type safety
- **TailwindCSS** - Styling
- **Redux Toolkit** - State management
- **Monaco Editor** - Code syntax highlighting
- **Vite** - Build tool

### Backend
- **FastAPI** - Python web framework
- **Groq API** - AI language model (using Llama 3.1 70B)
- **Uvicorn** - ASGI server
- **In-memory Storage** - Session management

## 📦 Installation

### Prerequisites
- Node.js (v16+)
- Python 3.8+
- Groq API key

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
```

### Frontend Setup
```bash
cd frontend
npm install
```

## ⚙️ Configuration

### Backend Environment Variables
Create a `.env` file in the `backend/` directory:
```bash
# Groq API Key - Get from https://console.groq.com/
GROQ=gsk_your_actual_groq_api_key_here
```

### Frontend Environment Variables
Create a `.env` file in the `frontend/` directory:
```bash
# Backend API URL
VITE_BACKEND_URL=http://localhost:5051

# For production, use your deployed backend URL:
# VITE_BACKEND_URL=https://your-backend-domain.com
```

## 🚀 Running the Application

### Start Backend
```bash
cd backend
source ../venv/bin/activate  # Activate virtual environment
python3 -m uvicorn main:app --reload --port 5051
```

### Start Frontend
```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:5173`

## 📱 Usage

1. **Start a Conversation** - Click "+ New Conversation" to begin
2. **Chat with AI** - Type your coding questions or requests
3. **View Code Artifacts** - Generated code appears in the sidebar
4. **Toggle Views** - Switch between code editor and live preview
5. **Download Code** - Save generated code to your local machine
6. **Search History** - Find past conversations using the search bar

## 🏗️ Project Structure

```
zocket/
├── backend/
│   ├── .env                 # Backend environment variables
│   ├── main.py              # FastAPI application
│   ├── groq.py              # Groq API integration
│   ├── memory.py            # Session management
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── .env                 # Frontend environment variables
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── store/           # Redux state management
│   │   └── App.tsx          # Main application
│   ├── package.json         # Node dependencies
│   └── vite.config.ts       # Build configuration
└── README.md
```

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
```

### Backend (Railway/Render)
Deploy the backend to your preferred platform and update the `VITE_BACKEND_URL` environment variable in the frontend.

## 🔑 Getting API Keys

### Groq API Key
1. Go to [Groq Console](https://console.groq.com/)
2. Sign up or log in
3. Create a new API key
4. Add it to your `backend/.env` file

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with Claude-style UX inspiration
- Powered by Groq API (Llama 3.1 70B)
- Icons from Heroicons 