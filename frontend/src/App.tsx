import React from 'react';
import Chat from './components/Chat';
import Sidebar from './components/Sidebar';
import LeftSidebar from './components/LeftSidebar';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from './store';
import { setSidebarOpen } from './store/chatSlice';

const App: React.FC = () => {
  const dispatch = useDispatch();
  const sidebarOpen = useSelector((state: RootState) => state.chat.sidebarOpen);
  const codeArtifact = useSelector((state: RootState) => state.chat.codeArtifact);
  const leftSidebarOpen = useSelector((state: RootState) => state.chat.leftSidebarOpen);
  const [isDarkMode, setIsDarkMode] = React.useState(() => {
    // Check if user prefers dark mode or has it saved
    return localStorage.getItem('darkMode') === 'true' || 
           window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Apply dark mode to document
  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [isDarkMode]);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <LeftSidebar />
      {/* Dark Mode Toggle */}
      <button
        className="fixed top-4 right-4 z-50 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-colors"
        onClick={() => setIsDarkMode(!isDarkMode)}
        title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDarkMode ? (
          <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        )}
      </button>
      
      {/* Chat area */}
      <div className={`flex-1 transition-all duration-300 ${leftSidebarOpen ? 'ml-16' : 'ml-0'} w-full min-w-0`}> 
        <div className="max-w-2xl mx-auto h-full flex flex-col px-2 sm:px-4 lg:px-0">
          <div className="flex-1">
            <Chat />
          </div>
          {/* Show button only if codeArtifact exists */}
          {codeArtifact && !sidebarOpen && (
            <button
              className="fixed z-50 flex items-center gap-2 px-4 py-3 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400
                bottom-20 right-4 sm:bottom-6 sm:right-6"
              onClick={() => dispatch(setSidebarOpen(true))}
              aria-label="Show Artifact"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12H8m0 0l4-4m-4 4l4 4" /></svg>
              Artifact
            </button>
          )}
        </div>
      </div>
      {/* Responsive Sidebar */}
      <Sidebar />
    </div>
  );
};

export default App;
