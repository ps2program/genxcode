import { create } from 'zustand';

export type Message = {
  role: 'user' | 'model';
  content: string;
};

interface ChatStore {
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  addMessage: (msg: Message) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  codeArtifact: string;
  setCodeArtifact: (code: string) => void;
  previewMode: 'code' | 'preview';
  setPreviewMode: (mode: 'code' | 'preview') => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  setMessages: (messages) => set({ messages }),
  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  codeArtifact: '',
  setCodeArtifact: (code) => set({ codeArtifact: code }),
  previewMode: 'code',
  setPreviewMode: (mode) => set({ previewMode: mode }),
}));
