import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import { setPreviewMode } from '../store/chatSlice';

const ToggleButtonGroup: React.FC = () => {
  const dispatch = useDispatch();
  const previewMode = useSelector((state: RootState) => state.chat.previewMode);

  return (
    <div className="flex border-b border-gray-200 dark:border-gray-700">
      <button
        className={`flex-1 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
          previewMode === 'code' 
            ? 'text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20' 
            : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'
        }`}
        onClick={() => dispatch(setPreviewMode('code'))}
      >
        <div className="flex items-center justify-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          Code
        </div>
      </button>
      <button
        className={`flex-1 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
          previewMode === 'preview' 
            ? 'text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20' 
            : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'
        }`}
        onClick={() => dispatch(setPreviewMode('preview'))}
      >
        <div className="flex items-center justify-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Preview
        </div>
      </button>
    </div>
  );
};

export default ToggleButtonGroup;
