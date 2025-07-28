import React, { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import { setSidebarOpen, setSidebarWidth } from '../store/chatSlice';
import ToggleButtonGroup from './ToggleButtonGroup';
import CodeEditor from './CodeEditor';
import PreviewSandbox from './PreviewSandbox';

function detectLanguage(code: string): string {
  if (/^\s*<\/?[a-z]/i.test(code)) return 'html';
  if (/\bdef |import |print\(/.test(code)) return 'python';
  if (/function |const |let |var /.test(code)) return 'javascript';
  if (/^\s*#include |int main\(/.test(code)) return 'cpp';
  return 'javascript';
}

const Sidebar: React.FC = () => {
  const dispatch = useDispatch();
  const sidebarOpen = useSelector((state: RootState) => state.chat.sidebarOpen);
  const codeArtifact = useSelector((state: RootState) => state.chat.codeArtifact);
  const previewMode = useSelector((state: RootState) => state.chat.previewMode);
  const sidebarWidth = useSelector((state: RootState) => state.chat.sidebarWidth);
  
  const resizeRef = useRef<HTMLDivElement>(null);
  const isResizing = useRef(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing.current) return;
      
      const newWidth = window.innerWidth - e.clientX;
      dispatch(setSidebarWidth(newWidth));
    };

    const handleMouseUp = () => {
      isResizing.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    // Always add event listeners, but only respond when isResizing is true
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [dispatch]);

  const handleMouseDown = () => {
    isResizing.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  if (!sidebarOpen) return null;

  const language = codeArtifact ? detectLanguage(codeArtifact) : 'javascript';

  // Responsive: overlay on mobile, fixed on desktop
  return (
    <>
      {/* Backdrop for mobile overlay */}
      <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => dispatch(setSidebarOpen(false))} />
      <div
        className={`fixed right-0 top-0 h-full z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg flex flex-col border-l border-gray-200 dark:border-gray-700 transition-all duration-300
          ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}
          md:relative md:translate-x-0
          w-[70vw] max-w-[100vw] md:w-[${sidebarWidth}px] md:min-w-[300px] md:max-w-[800px]'
        `}
        style={{ width: window.innerWidth >= 768 ? `${sidebarWidth}px` : undefined }}
      >
      {/* Resize Handle */}
      <div
        ref={resizeRef}
        className="absolute left-0 top-0 w-3 h-full bg-gray-300 dark:bg-gray-600 hover:bg-blue-500 dark:hover:bg-blue-400 cursor-col-resize transition-colors duration-200 z-10 group"
        onMouseDown={handleMouseDown}
        style={{ transform: 'translateX(-1px)' }}
        title="Drag to resize sidebar"
      >
        {/* Resize indicator dots */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="flex flex-col gap-1">
            <div className="w-1 h-1 bg-white dark:bg-gray-300 rounded-full"></div>
            <div className="w-1 h-1 bg-white dark:bg-gray-300 rounded-full"></div>
            <div className="w-1 h-1 bg-white dark:bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span className="font-medium text-gray-900 dark:text-gray-100 text-sm">Generated Artifact</span>
        </div>
        <button 
          onClick={() => dispatch(setSidebarOpen(false))} 
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 p-1.5 rounded transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <ToggleButtonGroup />
      <div className="flex-1 overflow-auto">
        {previewMode === 'code' ? (
          codeArtifact ? (
            <div className="flex flex-col h-full">
              <div className="flex gap-2 p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <button
                  className="px-3 py-1.5 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 rounded text-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center gap-1.5"
                  onClick={() => navigator.clipboard.writeText(codeArtifact)}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy
                </button>
                <button
                  className="px-3 py-1.5 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 rounded text-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center gap-1.5"
                  onClick={() => {
                    const ext = language === 'html' ? 'html' : language === 'python' ? 'py' : language === 'cpp' ? 'cpp' : 'js';
                    const blob = new Blob([codeArtifact], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `artifact.${ext}`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download
                </button>
              </div>
              <div className="flex-1 p-4">
                <div className="h-full rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <CodeEditor value={codeArtifact} language={language} onChange={val => dispatch({ type: 'chat/setCodeArtifact', payload: val ?? '' })} />
                </div>
              </div>
            </div>
          ) : (
            <div className="text-gray-400 dark:text-gray-500 text-center py-8">No code artifact found.</div>
          )
        ) : (
          <div className="h-full p-4">
            <div className="h-full rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <PreviewSandbox code={codeArtifact} />
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default Sidebar;
