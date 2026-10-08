import React from 'react';
import {
  ShieldCheck,
  CreditCard,
  QrCode,
  MessageSquareWarning,
  Link2,
  ArrowRight,
  ShieldAlert,
  Lock,
  PhoneCall,
  CheckCircle2,
  Sparkles,
  Zap,
} from 'lucide-react';
import shieldEmblem from '../assets/images/guardian_shield_emblem_1791471485913.jpg';

interface DashboardProps {
  onNavigate: (tab: 'payment' | 'message' | 'qr' | 'link') => void;
  onSelectQuickPreset: (preset: 'bank_block' | 'electricity' | 'olx_qr' | 'safe_grocery') => void;
  hasActiveResult: boolean;
  onViewResult: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onNavigate,
  onSelectQuickPreset,
  hasActiveResult,
  onViewResult,
}) => {
  return (
    <div className="space-y-10 py-2 sm:py-6 max-w-7xl mx-auto">
      
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-950/80 border border-slate-800 p-6 sm:p-10">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-8 space-y-5">
            <div className="flex items-center gap-2.5 text-xs font-semibold text-cyan-400">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-cyan-950/60 border border-cyan-800/60">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                AI-Powered User-Side Payment Defense
              </span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-400">Hackathon Prototype</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight text-balance">
              Your AI Payment Safety Assistant
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              Check a payment request before you pay. Understand the scam mechanics, verify unusual UPI IDs, and protect your hard-earned money.
            </p>

            {/* Quick action buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('payment')}
                className="px-5 py-2.5 text-sm font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-300 hover:from-cyan-300 hover:to-teal-200 rounded-xl shadow-lg shadow-cyan-950/40 transition-all flex items-center gap-2"
              >
                <CreditCard className="w-4 h-4 text-slate-950" />
                Check Payment
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>

              <button
                onClick={() => onNavigate('qr')}
                className="px-4 py-2.5 text-sm font-medium text-slate-200 bg-slate-800/80 hover:bg-slate-800 hover:text-white border border-slate-700/80 rounded-xl transition-colors flex items-center gap-2"
              >
                <QrCode className="w-4 h-4 text-cyan-400" />
                Scan QR Code
              </button>

              <button
                onClick={() => onNavigate('message')}
                className="px-4 py-2.5 text-sm font-medium text-slate-200 bg-slate-800/80 hover:bg-slate-800 hover:text-white border border-slate-700/80 rounded-xl transition-colors flex items-center gap-2"
              >
                <MessageSquareWarning className="w-4 h-4 text-amber-400" />
                Analyze Message
              </button>

              {hasActiveResult && (
                <button
                  onClick={onViewResult}
                  className="px-4 py-2.5 text-sm font-medium text-amber-300 bg-amber-950/40 hover:bg-amber-900/50 border border-amber-800/60 rounded-xl transition-colors flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  View Latest Scan
                </button>
              )}
            </div>
          </div>

          {/* Safety Status Card (Right Column) */}
          <div className="lg:col-span-4">
            <div className="rounded-xl bg-slate-950/90 border border-slate-800/90 p-5 shadow-xl relative overflow-hidden">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl overflow-hidden border border-emerald-500/30 bg-slate-900 shrink-0">
                  <img
                    src={shieldEmblem}
                    alt="Guardian Shield"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950/70 border border-emerald-800/60 text-xs font-semibold text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  Active Shield
                </div>
              </div>

              <div className="space-y-1.5 mb-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  Your payment safety is active
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Real-time cognitive analysis for UPI VPAs, urgency triggers, QR collect traps, and suspicious bank impersonation.
                </p>
              </div>

              <div className="space-y-2 border-t border-slate-800/80 pt-3 text-xs text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Analysis Mode</span>
                  <span className="font-medium text-cyan-300">n8n Cognitive Webhook</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Advisory Layer</span>
                  <span className="font-medium text-emerald-400">Pre-Transaction Intercept</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Coverage</span>
                  <span className="font-medium text-slate-200">GPay, PhonePe, Paytm, BHIM</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Main 4 Feature Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Payment Verification Tools</h2>
            <p className="text-xs text-slate-400">Select an inspection vector to evaluate for scam patterns</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Check Payment */}
          <div
            onClick={() => onNavigate('payment')}
            className="group cursor-pointer rounded-xl bg-slate-900/70 hover:bg-slate-900 border border-slate-800/80 hover:border-cyan-500/50 p-5 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-950/60 border border-cyan-800/50 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
                <CreditCard className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white group-hover:text-cyan-300 transition-colors">
                Check Payment
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Analyze receiver UPI ID, amount, payee name, and historical transaction deviation.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs font-medium text-cyan-400">
              <span>Open Form</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Scan QR */}
          <div
            onClick={() => onNavigate('qr')}
            className="group cursor-pointer rounded-xl bg-slate-900/70 hover:bg-slate-900 border border-slate-800/80 hover:border-teal-500/50 p-5 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-teal-950/60 border border-teal-800/50 flex items-center justify-center text-teal-400 group-hover:scale-105 transition-transform">
                <QrCode className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white group-hover:text-teal-300 transition-colors">
                Scan QR Code
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Upload or scan printed/digital QR codes. Detect hidden debit requests disguised as incoming credits.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs font-medium text-teal-400">
              <span>Inspect QR</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Analyze Message */}
          <div
            onClick={() => onNavigate('message')}
            className="group cursor-pointer rounded-xl bg-slate-900/70 hover:bg-slate-900 border border-slate-800/80 hover:border-amber-500/50 p-5 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-amber-950/60 border border-amber-800/50 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                <MessageSquareWarning className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white group-hover:text-amber-300 transition-colors">
                Analyze Message
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Paste suspicious SMS, WhatsApp message, or email demanding immediate UPI transfers.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs font-medium text-amber-400">
              <span>Paste Message</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Check Payment Link */}
          <div
            onClick={() => onNavigate('link')}
            className="group cursor-pointer rounded-xl bg-slate-900/70 hover:bg-slate-900 border border-slate-800/80 hover:border-indigo-500/50 p-5 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-950/60 border border-indigo-800/50 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
                <Link2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white group-hover:text-indigo-300 transition-colors">
                Check Payment Link
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Inspect raw `upi://pay` links, shortened bit.ly URLs, or spoofed banking gateways.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs font-medium text-indigo-400">
              <span>Verify Link</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>
      </div>

      {/* Fast Demo Presets for Hackathon Evaluation */}
      <div className="rounded-xl bg-slate-900/50 border border-slate-800/80 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Hackathon Quick Test Presets</h3>
            <span className="text-xs text-slate-400">· Click any scenario to test instant evaluation</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={() => onSelectQuickPreset('bank_block')}
            className="text-left p-3.5 rounded-lg bg-slate-950/70 hover:bg-slate-800/80 border border-red-900/40 hover:border-red-700/60 transition-colors group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-red-400">High Risk Threat</span>
              <span className="text-[11px] text-slate-500 font-mono">₹25,000</span>
            </div>
            <p className="text-xs font-medium text-slate-200 group-hover:text-white">
              Bank Account Block KYC Urgent Scam
            </p>
            <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
              "Pay ₹25,000 immediately to unfreeze SBI account"
            </p>
          </button>

          <button
            onClick={() => onSelectQuickPreset('electricity')}
            className="text-left p-3.5 rounded-lg bg-slate-950/70 hover:bg-slate-800/80 border border-red-900/40 hover:border-red-700/60 transition-colors group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-red-400">High Risk Spoof</span>
              <span className="text-[11px] text-slate-500 font-mono">₹14,250</span>
            </div>
            <p className="text-xs font-medium text-slate-200 group-hover:text-white">
              Electricity Bill Power Cutoff Alert
            </p>
            <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
              "Power will be disconnected tonight at 9:30 PM"
            </p>
          </button>

          <button
            onClick={() => onSelectQuickPreset('olx_qr')}
            className="text-left p-3.5 rounded-lg bg-slate-950/70 hover:bg-slate-800/80 border border-amber-900/40 hover:border-amber-700/60 transition-colors group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-amber-400">Medium Risk Traps</span>
              <span className="text-[11px] text-slate-500 font-mono">₹8,000</span>
            </div>
            <p className="text-xs font-medium text-slate-200 group-hover:text-white">
              Marketplace QR "Receive Money" Trap
            </p>
            <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
              Buyer asks seller to scan QR to "receive payment"
            </p>
          </button>

          <button
            onClick={() => onSelectQuickPreset('safe_grocery')}
            className="text-left p-3.5 rounded-lg bg-slate-950/70 hover:bg-slate-800/80 border border-emerald-900/40 hover:border-emerald-700/60 transition-colors group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-emerald-400">Low Risk Legitimate</span>
              <span className="text-[11px] text-slate-500 font-mono">₹450</span>
            </div>
            <p className="text-xs font-medium text-slate-200 group-hover:text-white">
              Known Grocery Store Daily Purchase
            </p>
            <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
              Verified merchant VPA, standard daily amount
            </p>
          </button>
        </div>
      </div>

      {/* Educational: How UPI Scams Work */}
      <div className="border-t border-slate-800/80 pt-6">
        <h3 className="text-base font-bold text-white mb-1">
          How UPI Scammers Target Indian Users
        </h3>
        <p className="text-xs text-slate-400 mb-6">
          Understanding the psychological pattern is your first line of defense
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
            <div className="flex items-center gap-2 mb-2 text-red-400 text-sm font-semibold">
              <ShieldAlert className="w-4 h-4" />
              1. The QR Code Inversion Trap
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Scammers tell victims: "Scan this QR code and enter your PIN to claim your prize or refund." Remember: Entering a UPI PIN <strong className="text-white">always debits money</strong>, never credits it.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
            <div className="flex items-center gap-2 mb-2 text-amber-400 text-sm font-semibold">
              <Lock className="w-4 h-4" />
              2. Fear & Artificial Urgency
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Threats like "Your SIM will be blocked", "Account frozen by RBI", or "Electricity cut in 2 hours" are engineered to panic you so you pay without verifying the payee VPA.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
            <div className="flex items-center gap-2 mb-2 text-cyan-400 text-sm font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              3. Impersonated Bank VPAs
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Fraudsters register personal handles like <span className="font-mono text-cyan-300">sbi.kyc.desk@okaxis</span> to appear official. UPI Guardian inspects handle legitimacy and payee registration flags.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
