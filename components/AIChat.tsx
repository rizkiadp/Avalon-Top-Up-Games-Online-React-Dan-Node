
import React, { useState, useRef, useEffect } from 'react';
import { geminiService } from '../services/geminiService';
import { ChatMessage } from '../types';

export const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user' as const, parts: [{ text: input }] };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const botResponse = await geminiService.getChatResponse(messages, input);
    const botMsg = { role: 'model' as const, parts: [{ text: botResponse }] };
    
    setIsTyping(false);
    setMessages(prev => [...prev, botMsg]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-primary hover:bg-primary-dark text-background-dark p-4 rounded-full shadow-neon transition-all hover:scale-110 flex items-center justify-center"
        >
          <span className="material-symbols-outlined text-3xl">smart_toy</span>
        </button>
      )}

      {isOpen && (
        <div className="w-[350px] sm:w-[400px] h-[500px] glass-panel rounded-2xl flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4">
          <div className="p-4 bg-surface-dark border-b border-white/10 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-primary border border-primary/30">
                <span className="material-symbols-outlined text-xl">token</span>
              </div>
              <div>
                <p className="text-sm font-bold tracking-wider">AV-L0N SUPPORT</p>
                <p className="text-[10px] text-green-400 flex items-center gap-1 uppercase tracking-widest">
                  <span className="size-1.5 rounded-full bg-green-400 animate-pulse"></span> Online
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 font-body">
            {messages.length === 0 && (
              <div className="text-center py-10">
                <span className="material-symbols-outlined text-4xl text-slate-600 mb-2">forum</span>
                <p className="text-slate-400 text-sm px-10">Initializing secure link... How can I assist you in the grid today?</p>
              </div>
            )}
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-lg text-sm ${
                  msg.role === 'user' 
                    ? 'bg-primary/20 text-white border border-primary/30 rounded-tr-none' 
                    : 'bg-surface-accent text-slate-200 border border-white/5 rounded-tl-none'
                }`}>
                  {msg.parts[0].text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-surface-accent p-3 rounded-lg rounded-tl-none border border-white/5">
                  <div className="flex gap-1">
                    <div className="size-1.5 bg-primary/50 rounded-full animate-bounce"></div>
                    <div className="size-1.5 bg-primary/50 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="size-1.5 bg-primary/50 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-surface-dark border-t border-white/10 flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Send a transmission..."
              className="flex-1 bg-[#0b1215] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-primary transition-all font-mono"
            />
            <button 
              onClick={handleSend}
              className="bg-primary hover:bg-primary-dark text-background-dark p-2 rounded-lg shadow-neon transition-all"
            >
              <span className="material-symbols-outlined">send</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
