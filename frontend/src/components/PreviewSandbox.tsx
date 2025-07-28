import React, { useEffect, useRef, useState } from 'react';

interface PreviewSandboxProps {
  code: string;
}

const PreviewSandbox: React.FC<PreviewSandboxProps> = ({ code }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (code) {
      // Create a data URL for the HTML content
      const htmlContent = code.includes('<!DOCTYPE html>') 
        ? code 
        : `<html><head><title>Preview</title><meta charset="utf-8"></head><body>${code}</body></html>`;
      
      const dataUrl = `data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`;
      setPreviewUrl(dataUrl);
    }
  }, [code]);

  const handleOpenInNewTab = () => {
    if (!code) return;
    const htmlContent = code.includes('<!DOCTYPE html>') 
      ? code 
      : `<html><head><title>Preview</title><meta charset="utf-8"></head><body>${code}</body></html>`;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    setTimeout(() => URL.revokeObjectURL(url), 10000); // Revoke after 10s
  };

  if (!previewUrl) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <span className="text-sm font-medium text-gray-700">Live Preview</span>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center bg-white">
          <p className="text-gray-500">No preview available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm font-medium text-gray-700">Live Preview</span>
        </div>
        <button 
          className="text-xs bg-white text-gray-700 border border-gray-200 px-3 py-1.5 rounded hover:bg-gray-50 transition-colors flex items-center gap-1.5"
          onClick={handleOpenInNewTab}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          Open
        </button>
      </div>
      <div className="flex-1 relative bg-white">
        <iframe
          ref={iframeRef}
          src={previewUrl}
          className="w-full h-full border-0"
          title="Code Preview"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
      </div>
    </div>
  );
};

export default PreviewSandbox;
