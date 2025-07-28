import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import { addMessage, setCodeArtifact } from '../store/chatSlice';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5051/chat';

function extractCodeBlock(text: string): string | null {
  // Simple regex to extract first triple-backtick code block
  const match = text.match(/```[\w]*\n([\s\S]*?)```/);
  return match ? match[1].trim() : null;
}

const Chat: React.FC = () => {
  const messages = useSelector((state: RootState) => state.chat.messages);
  const sessionIds = useSelector((state: RootState) => state.chat.sessionIds);
  const currentConversationIdx = useSelector((state: RootState) => state.chat.currentConversationIdx);
  const dispatch = useDispatch();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamed, setStreamed] = useState('');
  const streamedRef = useRef('');
  const chatContainerRef = useRef<HTMLDivElement>(null); // Add ref for chat container
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  // Get current session ID
  const currentSessionId = sessionIds[currentConversationIdx];

  // Main heading with animation and hover
  const headingClass = `
    text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-orange-400
    transition-all duration-300 ease-in-out
    hover:from-orange-400 hover:via-purple-500 hover:to-blue-500
    hover:scale-105
    cursor-pointer
    drop-shadow-lg
    mb-8
    select-none
    animate-pulse
  `;

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    dispatch(addMessage({ role: 'user', content: input }));
    setInput('');
    setIsLoading(true);
    setStreamed('');
    streamedRef.current = '';

    // Prepare chat history for backend
    try {
      const response = await fetch(`${BACKEND_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, session_id: currentSessionId }),
      });
      if (!response.body) throw new Error('No response body');
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunk = decoder.decode(value);
          streamedRef.current += chunk;
          setStreamed(streamedRef.current);
        }
      }
      // Add the full streamed response as a model message
      dispatch(addMessage({ role: 'model', content: streamedRef.current }));
      // If code block found, update codeArtifact and open sidebar
      const code = extractCodeBlock(streamedRef.current);
      if (code) {
        dispatch(setCodeArtifact(code));
        dispatch({ type: 'chat/setSidebarOpen', payload: true });
      }
    } catch (err) {
      dispatch(addMessage({ role: 'model', content: '[Error: failed to connect to backend]' }));
    } finally {
      setIsLoading(false);
    }
  };

  // Resend a past user message
  const handleResend = async (msg: string) => {
    if (!msg.trim() || isLoading) return;
    dispatch(addMessage({ role: 'user', content: msg }));
    setInput('');
    setIsLoading(true);
    setStreamed('');
    streamedRef.current = '';
    try {
      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, session_id: currentSessionId }),
      });
      if (!response.body) throw new Error('No response body');
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunk = decoder.decode(value);
          streamedRef.current += chunk;
          setStreamed(streamedRef.current);
        }
      }
      dispatch(addMessage({ role: 'model', content: streamedRef.current }));
      const code = extractCodeBlock(streamedRef.current);
      if (code) {
        dispatch(setCodeArtifact(code));
        dispatch({ type: 'chat/setSidebarOpen', payload: true });
      }
    } catch (err) {
      dispatch(addMessage({ role: 'model', content: '[Error: failed to connect to backend]' }));
    } finally {
      setIsLoading(false);
    }
  };

  // Edit and resend a past user message
  const handleEditSubmit = async (idx: number) => {
    if (!editValue.trim() || isLoading) return;
    // Replace the old message in the chat
    const newMessages = [...messages];
    newMessages[idx] = { ...newMessages[idx], content: editValue };
    // Remove all messages after the edited one
    const trimmedMessages = newMessages.slice(0, idx + 1);
    // Dispatch trimmed messages
    dispatch({ type: 'chat/setMessages', payload: trimmedMessages });
    setEditingIdx(null);
    setEditValue('');
    // Resend the edited message
    await handleResend(editValue);
  };

  // Auto-scroll to bottom when a new model message or streamed content is added
  React.useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages.length, streamed]);

  return (
    <div className="flex flex-col h-full max-h-screen w-full">
      <div className="flex justify-center items-center">
        <h1 className={headingClass + ' text-2xl sm:text-4xl'} title="GenXCode - Your AI Coding Assistant">GenXCode</h1>
      </div>
      <div
        className="flex-1 min-h-0 overflow-y-auto p-2 sm:p-6"
        ref={chatContainerRef}
        style={{ scrollBehavior: 'smooth' }}
      >
        {messages.map((msg, idx) => {
          const isModelWithCode = msg.role === 'model' && /```[\w]*\n([\s\S]*?)```/.test(msg.content);
          // User message: show edit/resend buttons
          if (msg.role === 'user') {
            return (
              <div key={idx} className="mb-2 sm:mb-4 text-right flex flex-col items-end">
                <span className="inline-block px-3 py-2 sm:px-4 sm:py-3 rounded-2xl max-w-[90vw] sm:max-w-xs lg:max-w-md shadow-sm bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                  {editingIdx === idx ? (
                    <form onSubmit={e => { e.preventDefault(); handleEditSubmit(idx); }} className="flex gap-2">
                      <input
                        className="flex-1 rounded px-2 py-1 text-gray-800"
                        value={editValue}
                        onChange={e => setEditValue(e.target.value)}
                        autoFocus
                      />
                      <button type="submit" className="text-xs px-2 py-1 rounded bg-blue-600 text-white">Save</button>
                      <button type="button" className="text-xs px-2 py-1 rounded bg-gray-300 text-gray-700" onClick={() => setEditingIdx(null)}>Cancel</button>
                    </form>
                  ) : (
                    <>
                      {msg.content}
                      <span className="ml-2 inline-flex gap-1 align-middle">
                        <button
                          className="text-xs px-1 py-0.5 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                          title="Edit"
                          onClick={() => { setEditingIdx(idx); setEditValue(msg.content); }}
                          disabled={isLoading}
                        >✏️</button>
                        <button
                          className="text-xs px-1 py-0.5 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                          title="Resend"
                          onClick={() => handleResend(msg.content)}
                          disabled={isLoading}
                        >⟳</button>
                      </span>
                    </>
                  )}
                </span>
              </div>
            );
          }
          // Model message: code block placeholder logic
          return (
            <div key={idx} className={`mb-2 sm:mb-4 text-left`}>
              <span className={`inline-block px-3 py-2 sm:px-4 sm:py-3 rounded-2xl max-w-[90vw] sm:max-w-xs lg:max-w-md shadow-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700`}>
                {isModelWithCode
                  ? 'Code artifact detected. See the Artifact panel.'
                  : msg.content}
              </span>
            </div>
          );
        })}
        {/* Show streamed response as it's coming in */}
        {isLoading && streamed && (
          <div className="mb-2 sm:mb-4 text-left">
            <span className="inline-block px-3 py-2 sm:px-4 sm:py-3 rounded-2xl max-w-[90vw] sm:max-w-xs lg:max-w-md bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 text-gray-800 dark:text-gray-200 border border-green-100 dark:border-green-800 shadow-sm">
              {streamed}
            </span>
          </div>
        )}
      </div>
      <div className="p-2 sm:p-6 border-t border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm sticky bottom-0 z-10 w-full">
        <div className="flex gap-2 sm:gap-3">
          <input
            className="flex-1 border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2 sm:px-4 sm:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 text-sm sm:text-base"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            disabled={isLoading}
          />
          <button 
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium disabled:opacity-50 text-sm sm:text-base" 
            onClick={handleSend} 
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
