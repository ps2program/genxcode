import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store';
import { setLeftSidebarOpen, switchConversation, addConversation, setSessionId } from '../store/chatSlice';

const menu = [
  { section: null, items: [
    { icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="10" rx="2" strokeWidth={2} /></svg>, label: 'Recents', active: false, color: '' },
    { icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth={2} /><path d="M12 16v-4" strokeWidth={2} /><circle cx="12" cy="8" r="1" strokeWidth={2} /></svg>, label: 'API Keys', active: false, color: '' },
    { icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2" strokeWidth={2} /></svg>, label: 'Billing', active: false, color: '' },
    { icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3" strokeWidth={2} /><circle cx="12" cy="12" r="10" strokeWidth={2} /></svg>, label: 'Budget', active: false, color: '' },
  ]},
];

const bottomLinks = [
  { icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 01-9.33 5" strokeWidth={2} /><path d="M2 12a10 10 0 1020 0A10 10 0 002 12z" strokeWidth={2} /></svg>, label: 'GitHub' },
  { icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2" strokeWidth={2} /></svg>, label: 'Documentation' },
];

const menuIcons = menu.flatMap(section => section.items.map(item => ({icon: item.icon, label: item.label})));

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

const LeftSidebar: React.FC = () => {
  const dispatch = useDispatch();
  const open = useSelector((state: RootState) => state.chat.leftSidebarOpen);
  const conversations = useSelector((state: RootState) => state.chat.conversations);
  const currentConversationIdx = useSelector((state: RootState) => state.chat.currentConversationIdx);
  const [searchTerm, setSearchTerm] = useState('');

  // Create new conversation with backend session
  const handleNewConversation = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/new-chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      const newSessionId = data.session_id;
      
      // Add new conversation to Redux
      dispatch(addConversation());
      
      // Set the session ID for the new conversation
      const newConversationIdx = conversations.length;
      dispatch(setSessionId({ conversationIdx: newConversationIdx, sessionId: newSessionId }));
    } catch (error) {
      console.error('Failed to create new conversation:', error);
      // Fallback: just add conversation without backend session
      dispatch(addConversation());
    }
  };

  // Filter conversations based on search term
  const filteredConversations = conversations.filter((conv) => {
    if (!searchTerm.trim()) return true;
    return conv.some(msg => 
      msg.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Responsive: overlay on mobile, fixed on desktop
  return (
    <>
      {/* Backdrop for mobile overlay */}
      {open && (
        <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => dispatch(setLeftSidebarOpen(false))} />
      )}
      <div
        className={`fixed left-0 top-0 h-full z-50 bg-black/95 border-r border-gray-800 transition-all duration-300 flex flex-col items-center
          ${open ? 'w-64' : 'w-14'}
          ${open ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
        style={{minWidth: open ? '16rem' : '3.5rem'}}
      >
      {/* Collapse/expand button always at the top, visually consistent */}
      <div className="w-full flex justify-center items-center pt-4 pb-2">
        <button
          className="p-2 rounded hover:bg-gray-800 text-gray-300 focus:outline-none"
          onClick={() => dispatch(setLeftSidebarOpen(!open))}
          title={open ? 'Collapse' : 'Expand'}
        >
          {open ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          )}
        </button>
      </div>
      {open ? (
        <div className="flex flex-col w-full h-full px-4 pt-2 pb-4">
          {/* Logo and collapse button row */}
          <div className="flex items-center gap-2 mb-6">
            <span className="text-2xl font-bold text-white tracking-tight">✴ GenXCode</span>
          </div>
          {/* New Conversation button */}
          <button
            className="w-full mb-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm"
            onClick={handleNewConversation}
          >
            + New Conversation
          </button>
          {/* Team selector */}
          <div className="flex items-center gap-2 mb-4 p-2 rounded-lg bg-gray-900 border border-gray-800">
            <div className="w-8 h-8 rounded bg-gray-800 flex items-center justify-center text-lg font-bold text-white">P</div>
            <div className="flex-1">
              <div className="text-xs text-gray-400 font-semibold">TEAM</div>
              <div className="text-sm text-white font-medium truncate">Ps2programming's Team</div>
            </div>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </div>
          {/* Jump to search */}
          <div className="mb-6">
            <div className="flex items-center bg-gray-900 border border-gray-800 rounded-lg px-2 py-1">
              <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19l-7-7 7-7" /></svg>
              <input 
                className="bg-transparent outline-none text-sm text-gray-200 flex-1" 
                placeholder="Search conversations..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button 
                  className="ml-2 text-xs text-gray-400 hover:text-gray-200" 
                  onClick={() => setSearchTerm('')}
                >
                  ✕
                </button>
              )}
            </div>
          </div>
          {/* Menu sections */}
          <div className="flex-1 overflow-y-auto">
            {/* Recents/History section */}
            <div className="mb-6">
              <div className="text-xs text-gray-500 font-semibold mb-2 mt-4 tracking-widest">
                {searchTerm ? `Search Results (${filteredConversations.length})` : 'Recents'}
              </div>
              <div className="flex flex-col gap-1">
                {filteredConversations.map((conv) => {
                  const originalIdx = conversations.indexOf(conv);
                  return (
                    <button
                      key={originalIdx}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${originalIdx === currentConversationIdx ? 'bg-gray-900 text-orange-500' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
                      title={`Conversation ${originalIdx + 1}`}
                      aria-label={`Conversation ${originalIdx + 1}`}
                      onClick={() => dispatch(switchConversation(originalIdx))}
                    >
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="10" rx="2" strokeWidth={2} /></svg>
                      <span className="truncate">
                        {conv.find(m => m.role === 'user')?.content?.slice(0, 30) || 'New Conversation'}
                      </span>
                    </button>
                  );
                })}
                {filteredConversations.length === 0 && searchTerm && (
                  <div className="text-xs text-gray-500 px-3 py-2">
                    No conversations found for "{searchTerm}"
                  </div>
                )}
              </div>
            </div>
            {/* Other menu sections (if any) */}
            {menu.map((section, idx) => (
              <div key={idx} className="mb-6">
                {section.section && <div className="text-xs text-gray-500 font-semibold mb-2 mt-4 tracking-widest">{section.section}</div>}
                <div className="flex flex-col gap-1">
                  {section.items.map((item, i) => (
                    <button key={i} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${item.active ? 'bg-gray-900 text-orange-500' : 'text-gray-300 hover:bg-gray-800 hover:text-white'} ${item.color || ''}`} title={item.label} aria-label={item.label}>
                      {item.icon}
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {/* Bottom links */}
          <div className="mt-auto flex flex-col gap-1 border-t border-gray-800 pt-4">
            {bottomLinks.map((item, i) => (
              <button key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-colors" title={item.label} aria-label={item.label}>
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 flex-1 mt-8">
          {menuIcons.map(({icon, label}, i) => (
            <button key={i} className="p-2 rounded hover:bg-gray-800 text-gray-300 focus:outline-none" title={label} aria-label={label}>
              {icon}
            </button>
          ))}
        </div>
      )}
    </div>
    </>
  );
};

export default LeftSidebar; 