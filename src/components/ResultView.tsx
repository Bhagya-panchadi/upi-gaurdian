import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  ArrowLeft,
  PhoneCall,
  XCircle,
  CheckCircle,
  HelpCircle,
  Info,
  Sparkles,
  ArrowRight,
  RefreshCw,
  MessageSquare,
  Lock,
} from 'lucide-react';
import { AnalysisResponse, PaymentData } from '../types/guardian';
import { DontPayModal, VerifyModal, ReportModal } from './ActionModals';

interface ResultViewProps {
  result: AnalysisResponse;
  paymentData?: PaymentData | null;
  onReset: () => void;
  onOpenChat: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({
  result,
  paymentData,
  onReset,
  onOpenChat,
}) => {
  const [showDontPayModal, setShowDontPayModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const isHighRisk = result.overall_risk_level === 'HIGH';
  const isMediumRisk = result.overall_risk_level === 'MEDIUM';
  const isLowRisk = result.overall_risk_level === 'LOW';

  // Badge and thematic color setup
  const themeColors = isHighRisk
    ? {
        border: 'border-red-600/70',
        bgGlow: 'bg-red-950/40',
        text: 'text-red-400',
        badgeBg: 'bg-red-500/10 text-red-400 border-red-500/30',
        scoreColor: 'text-red-400',
        progressStroke: '#EF4444',
      }
    : isMediumRisk
    ? {
        border: 'border-amber-600/70',
        bgGlow: 'bg-amber-950/40',
        text: 'text-amber-400',
        badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
        scoreColor: 'text-amber-400',
        progressStroke: '#F59E0B',
      }
    : {
        border: 'border-emerald-600/70',
        bgGlow: 'bg-emerald-950/40',
        text: 'text-emerald-400',
        badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        scoreColor: 'text-emerald-400',
        progressStroke: '#10B981',
      };

  return (
    <div className="max-w-4xl mx-auto py-4 sm:py-6 space-y-6">
      
      {/* Top Header bar with navigation back */}
      <div className="flex items-center justify-between">
        <button
          onClick={onReset}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Analyze Another Payment
        </button>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>Scan ID:</span>
          <span className="font-mono text-slate-300">
            UG-{Math.abs(result.risk_score * 317).toString(16).toUpperCase()}
          </span>
        </div>
      </div>

      {/* Main Risk Result Card */}
      <div className={`rounded-2xl bg-slate-900/90 border ${themeColors.border} p-6 sm:p-8 shadow-2xl relative overflow-hidden`}>
        <div className={`absolute top-0 right-0 w-80 h-80 ${themeColors.bgGlow} rounded-full blur-3xl pointer-events-none -mr-20 -mt-20`} />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center border-b border-slate-800/90 pb-6 mb-6">
          
          {/* Status & Scam title */}
          <div className="md:col-span-8 space-y-2">
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-extrabold border ${themeColors.badgeBg}`}>
                {isHighRisk && <ShieldAlert className="w-3.5 h-3.5" />}
                {isMediumRisk && <AlertTriangle className="w-3.5 h-3.5" />}
                {isLowRisk && <ShieldCheck className="w-3.5 h-3.5" />}
                {result.overall_risk_level} RISK
              </span>
              <span className="text-xs text-slate-500">·</span>
              <span className="text-xs text-slate-400">Cognitive Risk Assessment</span>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-slate-400 font-medium">Possible Scam Type</p>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {result.scam_type}
              </h1>
            </div>

            {paymentData?.receiver_upi_id && (
              <p className="text-xs text-slate-400 font-mono">
                Flagged Payee: <span className="text-slate-200 font-semibold">{paymentData.receiver_upi_id}</span>
                {paymentData.amount && <span> · Requested: ₹{Number(paymentData.amount).toLocaleString('en-IN')}</span>}
              </p>
            )}
          </div>

          {/* Risk Score Circle Display */}
          <div className="md:col-span-4 flex items-center justify-start md:justify-end">
            <div className="flex items-center gap-4 bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
              <div className="relative w-20 h-20 flex items-center justify-center">
                <svg className="w-20 h-20 -rotate-90 transform" viewBox="0 0 36 36">
                  {/* Background track */}
                  <path
                    className="text-slate-800"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Progress stroke */}
                  <path
                    stroke={themeColors.progressStroke}
                    strokeWidth="3.5"
                    strokeDasharray={`${result.risk_score}, 100`}
                    strokeLinecap="round"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-xl font-extrabold font-mono tabular-nums ${themeColors.scoreColor}`}>
                    {result.risk_score}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium -mt-1">/ 100</span>
                </div>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 font-medium block">Assessment</span>
                <span className={`text-sm font-bold ${themeColors.text}`}>
                  {result.risk_score >= 75 ? 'Critical Danger' : result.risk_score >= 40 ? 'Suspicious' : 'Safe Profile'}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Why is this risky? Section */}
        <div className="space-y-3 mb-6">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <AlertTriangle className={`w-4 h-4 ${themeColors.text}`} />
            Why is this risky?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {result.why_risky.map((reason, index) => (
              <div
                key={index}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-200"
              >
                <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${isHighRisk ? 'bg-red-400' : isMediumRisk ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                <span>{reason}</span>
              </div>
            ))}
          </div>
        </div>

        {/* What should you do? (Recommended Action) */}
        <div className="p-4 sm:p-5 rounded-xl bg-slate-950/90 border border-slate-800 space-y-3 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
            <div>
              <span className="text-xs font-semibold text-slate-400">What should you do?</span>
              <h3 className="text-base font-extrabold text-white">Recommended Action</h3>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Advised Next Step:</span>
              <span
                className={`px-3 py-1 rounded-lg text-xs font-extrabold tracking-wide ${
                  result.recommended_action === 'DONT_PAY'
                    ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                    : result.recommended_action === 'VERIFY'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}
              >
                {result.recommended_action === 'DONT_PAY' ? "DON'T PAY" : result.recommended_action}
              </span>
            </div>
          </div>

          {/* Action safety recommendations */}
          <div className="space-y-2">
            {isHighRisk ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-red-950/40 border border-red-900/50 text-red-200 font-semibold">
                  <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>Don't pay this request</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-red-950/40 border border-red-900/50 text-red-200 font-semibold">
                  <Lock className="w-4 h-4 text-red-400 shrink-0" />
                  <span>Don't share OTP or UPI PIN</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200">
                  <PhoneCall className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Verify through official channels</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200">
                  <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Report suspicious request</span>
                </div>
              </div>
            ) : (
              <div className="space-y-1.5 text-xs text-slate-300">
                {result.safety_tips.map((tip, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons Section */}
        <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowDontPayModal(true)}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-500 shadow-md shadow-red-950/50 transition-all flex items-center gap-1.5"
          >
            <XCircle className="w-4 h-4" />
            Don't Pay
          </button>

          <button
            onClick={() => setShowVerifyModal(true)}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 transition-colors flex items-center gap-1.5"
          >
            <PhoneCall className="w-4 h-4 text-cyan-400" />
            Verify Receiver
          </button>

          <button
            onClick={() => setShowReportModal(true)}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 transition-colors flex items-center gap-1.5"
          >
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            Report Scam
          </button>

          <button
            onClick={onReset}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors ml-auto flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Analyze Another Payment
          </button>
        </div>

      </div>

      {/* Feature 6: SCAM STORY SECTION ("How the scam works") */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 space-y-4">
        <div>
          <span className="text-xs font-bold text-cyan-400">Scam Mechanics</span>
          <h2 className="text-lg font-bold text-white mt-0.5">How the scam works</h2>
          <p className="text-xs text-slate-400">
            Fraudsters follow predictable social-engineering sequences. Here is the blueprint of this detected threat:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2">
          {result.scam_steps.map((step, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800/90 relative flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="w-7 h-7 rounded-lg bg-cyan-950/80 border border-cyan-800/80 text-cyan-300 flex items-center justify-center font-bold text-xs font-mono">
                  {idx + 1}
                </div>
                <p className="text-xs font-medium text-slate-200 leading-relaxed">
                  {step}
                </p>
              </div>
              <div className="mt-3 text-[10px] text-slate-500 font-mono">
                Step {idx + 1} of {result.scam_steps.length}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature 7: AI EXPLANATION ("Why did UPI Guardian flag this?") */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-emerald-400">Plain-English Breakdown</span>
            <h2 className="text-lg font-bold text-white mt-0.5">
              Why did UPI Guardian flag this?
            </h2>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/80 p-4 rounded-xl border border-slate-800">
          {result.explanation}
        </p>

        {/* Chat prompt preview */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <span className="text-slate-400">
            Have questions about this request?
          </span>
          <button
            onClick={onOpenChat}
            className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1.5 transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Ask Guardian AI
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Mandatory Hackathon Disclaimer */}
      <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-slate-400 shrink-0" />
          <span>
            <strong>Hackathon Prototype Disclaimer:</strong> UPI Guardian is an advisory AI safety assistant. It does not directly block or execute real UPI banking transactions. Always confirm independently before paying.
          </span>
        </div>
      </div>

      {/* Action Modals */}
      <DontPayModal
        isOpen={showDontPayModal}
        onClose={() => setShowDontPayModal(false)}
        scamType={result.scam_type}
      />
      <VerifyModal
        isOpen={showVerifyModal}
        onClose={() => setShowVerifyModal(false)}
        receiverUpi={paymentData?.receiver_upi_id}
      />
      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        scamType={result.scam_type}
      />

    </div>
  );
};
