import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, Sparkles, AlertTriangle, ShieldCheck } from 'lucide-react';
import { AnalysisResponse, ChatMessage } from '../types/guardian';
import { generateGuardianChatReply } from '../services/chatService';

interface GuardianChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentAnalysis?: AnalysisResponse | null;
}

export const GuardianChatDrawer: React.FC<GuardianChatDrawerProps> = ({
  isOpen,
  onClose,
  currentAnalysis,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: 'Hello! I am Guardian AI, your payment safety assistant. How can I help protect your UPI transaction today?',
      timestamp: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');

    // Generate response using contextual payment assistant
    setTimeout(() => {
      const replyText = generateGuardianChatReply(text, currentAnalysis);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 300);
  };

  const samplePrompts = [
    'Why is this payment risky?',
    'What is a refund scam?',
    'Should I pay this person?',
    'What should I do now?',
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-teal-400 flex items-center justify-center text-slate-950">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  Guardian AI
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </h3>
                <p className="text-[11px] text-slate-400">Contextual Payment Safety Assistant</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Current Active Analysis Context Pill (if any) */}
          {currentAnalysis && (
            <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 truncate">
                <AlertTriangle className={`w-3.5 h-3.5 shrink-0 ${
                  currentAnalysis.overall_risk_level === 'HIGH' ? 'text-red-400' : 'text-amber-400'
                }`} />
                <span className="text-slate-300 font-medium truncate">
                  Context: {currentAnalysis.scam_type}
                </span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                currentAnalysis.overall_risk_level === 'HIGH'
                  ? 'bg-red-950 text-red-300 border border-red-800'
                  : 'bg-amber-950 text-amber-300 border border-amber-800'
              }`}>
                {currentAnalysis.risk_score !== null && currentAnalysis.risk_score !== undefined
                  ? `${currentAnalysis.risk_score}/100`
                  : currentAnalysis.risk_level_label}
              </span>

            </div>
          )}

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'assistant' && (
                  <div className="w-6 h-6 rounded-md bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400 shrink-0 mt-1">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                
                <div
                  className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed whitespace-pre-line ${
                    m.sender === 'user'
                      ? 'bg-cyan-500 text-slate-950 font-medium rounded-tr-none'
                      : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none'
                  }`}
                >
                  {m.text}
                  <div
                    className={`text-[9px] mt-1 text-right ${
                      m.sender === 'user' ? 'text-slate-800' : 'text-slate-500'
                    }`}
                  >
                    {m.timestamp}
                  </div>
                </div>

                {m.sender === 'user' && (
                  <div className="w-6 h-6 rounded-md bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-1">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Prompt suggestions */}
          <div className="p-3 border-t border-slate-800 bg-slate-950/60 space-y-1.5">
            <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              Suggested questions:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {samplePrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(p)}
                  className="px-2 py-1 text-[11px] rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors text-left"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Text Input */}
          <div className="p-3 border-t border-slate-800 bg-slate-950">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask about this payment, scams, or rules..."
                className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-40 text-slate-950 rounded-xl transition-colors shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};
