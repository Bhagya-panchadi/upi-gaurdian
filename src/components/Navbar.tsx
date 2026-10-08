import React from 'react';
import { Shield, Sparkles, Sliders, MessageSquare, AlertCircle } from 'lucide-react';
import shieldEmblem from '../assets/images/guardian_shield_emblem_1791471485913.jpg';

interface NavbarProps {
  activeTab: 'dashboard' | 'payment' | 'message' | 'qr' | 'link';
  setActiveTab: (tab: 'dashboard' | 'payment' | 'message' | 'qr' | 'link') => void;
  onOpenChat: () => void;
  onOpenSettings: () => void;
  isWebhookSet: boolean;
  hasActiveResult: boolean;
  onViewResult: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenChat,
  onOpenSettings,
  isWebhookSet,
  hasActiveResult,
  onViewResult,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0B1120]/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-3.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Zone 1: Single text element wordmark / Brand Zone */}
        <button
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-2.5 text-left focus:outline-none group"
        >
          <div className="w-8 h-8 rounded-lg overflow-hidden border border-cyan-500/30 shadow-sm shadow-cyan-950 flex items-center justify-center bg-slate-900 shrink-0">
            <img
              src={shieldEmblem}
              alt="UPI Guardian Shield"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
              UPI Guardian
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            </span>
          </div>
        </button>

        {/* Zone 2: 4-5 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-800/40'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('payment')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'payment'
                ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-800/40'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            Check Payment
          </button>
          <button
            onClick={() => setActiveTab('qr')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'qr'
                ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-800/40'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            Scan QR
          </button>
          <button
            onClick={() => setActiveTab('message')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'message'
                ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-800/40'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            Analyze Message
          </button>
          <button
            onClick={() => setActiveTab('link')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'link'
                ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-800/40'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            Check Link
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {hasActiveResult && (
            <button
              onClick={onViewResult}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-amber-300 bg-amber-950/40 border border-amber-800/50 rounded-lg hover:bg-amber-900/40 transition-colors whitespace-nowrap"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              Latest Scan Result
            </button>
          )}

          <button
            onClick={onOpenSettings}
            title="Configure Backend Webhook"
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-300 bg-slate-900/90 border border-slate-800 rounded-lg hover:bg-slate-800 hover:text-white transition-colors whitespace-nowrap"
          >
            <Sliders className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Backend</span>
            <span
              className={`w-2 h-2 rounded-full ${
                isWebhookSet ? 'bg-emerald-400 shadow-sm shadow-emerald-400' : 'bg-amber-400'
              }`}
            />
          </button>

          <button
            onClick={onOpenChat}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-900 bg-gradient-to-r from-cyan-400 to-teal-300 hover:from-cyan-300 hover:to-teal-200 rounded-lg shadow-sm shadow-cyan-500/20 transition-all whitespace-nowrap"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Guardian AI</span>
          </button>
        </div>
      </div>
    </header>
  );
};
