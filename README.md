# GenXCode - AI Coding Assistant

A Claude-style AI coding assistant built with React, FastAPI, and Gemini 2.5 API. Features streaming responses, conversation history, code artifact preview, and mobile-responsive design.

## 🚀 Features

- **Claude-style Chat Interface** - Clean, modern chat UI with streaming responses
- **Conversation History** - Multiple conversations with search functionality
- **Code Artifact Sidebar** - Syntax-highlighted code editor and live preview
- **Mobile Responsive** - Works seamlessly on all devices
- **Dark/Light Theme** - Toggle between themes with system preference detection
- **Edit/Resend Messages** - Modify or resend past prompts
- **Session Management** - Isolated conversation histories
- **File Download** - Download generated code artifacts

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
- **Gemini 2.5 API** - AI language model
- **Uvicorn** - ASGI server
- **In-memory Storage** - Session management

## 📦 Installation

### Prerequisites
- Node.js (v16+)
- Python 3.8+
- Gemini API key

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

### Environment Variables
Create a `.env` file in the frontend directory:
```bash
VITE_BACKEND_URL=http://localhost:5051
```

### Gemini API Key
Add your Gemini API key to the backend configuration.

## 🚀 Running the Application

### Start Backend
```bash
cd backend
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
│   ├── main.py          # FastAPI application
│   ├── gemini.py        # Gemini API integration
│   ├── memory.py        # Session management
│   └── requirements.txt # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── store/       # Redux state management
│   │   └── App.tsx      # Main application
│   ├── package.json     # Node dependencies
│   └── vite.config.ts   # Build configuration
└── README.md
```

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
```

### Backend (Railway/Render)
Deploy the backend to your preferred platform and update the `VITE_BACKEND_URL` environment variable.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with Claude-style UX inspiration
- Powered by Google Gemini 2.5 API
- Icons from Heroicons 