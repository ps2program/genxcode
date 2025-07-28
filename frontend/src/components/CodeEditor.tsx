import React from 'react';
import MonacoEditor from '@monaco-editor/react';

interface CodeEditorProps {
  value: string;
  language?: string;
  readOnly?: boolean;
  onChange?: (value: string | undefined) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ value, language = 'javascript', readOnly = true, onChange }) => {
  return (
    <MonacoEditor
      height="100%"
      language={language}
      value={value}
      theme="vs-dark"
      options={{ readOnly, minimap: { enabled: false } }}
      onChange={onChange}
    />
  );
};

export default CodeEditor;
