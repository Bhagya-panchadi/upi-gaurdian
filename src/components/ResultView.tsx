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
  Code,
  Check,
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
  const [showRawOutput, setShowRawOutput] = useState(false);

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
          Analyze Another Message / Payment
        </button>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-300 font-medium">Live n8n AI Agent Result</span>
        </div>
      </div>

      {/* Main Risk Result Card */}
      <div className={`rounded-2xl bg-slate-900/90 border ${themeColors.border} p-6 sm:p-8 shadow-2xl relative overflow-hidden`}>
        <div className={`absolute top-0 right-0 w-80 h-80 ${themeColors.bgGlow} rounded-full blur-3xl pointer-events-none -mr-20 -mt-20`} />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center border-b border-slate-800/90 pb-6 mb-6">
          
          {/* Status & Scam title */}
          <div className="md:col-span-7 space-y-2">
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-extrabold border ${themeColors.badgeBg}`}>
                {isHighRisk && <ShieldAlert className="w-3.5 h-3.5" />}
                {isMediumRisk && <AlertTriangle className="w-3.5 h-3.5" />}
                {isLowRisk && <ShieldCheck className="w-3.5 h-3.5" />}
                {result.risk_level_label || `${result.overall_risk_level} RISK`}
              </span>
              <span className="text-xs text-slate-500">·</span>
              <span className="text-xs text-slate-400">n8n Security Evaluation</span>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-slate-400 font-medium">Detected Threat Type</p>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {result.scam_type || result.risk_level_label}
              </h1>
            </div>

            {paymentData?.raw_message && (
              <p className="text-xs text-slate-300 bg-slate-950/70 p-3 rounded-xl border border-slate-800 mt-2 leading-relaxed">
                <span className="text-slate-400 font-semibold block mb-0.5">Analyzed Message:</span>
                "{paymentData.raw_message}"
              </p>
            )}

            {paymentData?.receiver_upi_id && (
              <p className="text-xs text-slate-400 font-mono mt-1">
                Target Payee: <span className="text-slate-200 font-semibold">{paymentData.receiver_upi_id}</span>
                {paymentData.amount && <span> · Requested: ₹{Number(paymentData.amount).toLocaleString('en-IN')}</span>}
              </p>
            )}
          </div>

          {/* Risk Level / Score Display (Never fabricated) */}
          <div className="md:col-span-5 flex items-center justify-start md:justify-end">
            {result.risk_score !== null && result.risk_score !== undefined ? (
              <div className="flex items-center gap-4 bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <svg className="w-20 h-20 -rotate-90 transform" viewBox="0 0 36 36">
                    <path
                      className="text-slate-800"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
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
                    {result.risk_level_label}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3.5 bg-slate-950/80 px-4 py-3.5 rounded-2xl border border-slate-800">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${themeColors.badgeBg}`}>
                  {isHighRisk && <ShieldAlert className="w-6 h-6 text-red-400" />}
                  {isMediumRisk && <AlertTriangle className="w-6 h-6 text-amber-400" />}
                  {isLowRisk && <ShieldCheck className="w-6 h-6 text-emerald-400" />}
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 font-medium block">n8n Classification</span>
                  <span className={`text-sm font-extrabold tracking-wide ${themeColors.text}`}>
                    {result.risk_level_label || `${result.overall_risk_level} RISK`}
                  </span>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Why is this risky? Section (from n8n Reason) */}
        {result.why_risky && result.why_risky.length > 0 && (
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
                  <span className="leading-relaxed">{reason}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* What should you do? (Recommended Action from n8n) */}
        <div className="p-4 sm:p-5 rounded-xl bg-slate-950/90 border border-slate-800 space-y-3 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
            <div>
              <span className="text-xs font-semibold text-slate-400">What should you do?</span>
              <h3 className="text-base font-extrabold text-white">Recommended Action</h3>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Advised Action:</span>
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

          {/* Safety advice points returned by n8n */}
          <div className="space-y-2">
            {result.safety_tips && result.safety_tips.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {result.safety_tips.map((tip, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-200"
                  >
                    <CheckCircle className={`w-4 h-4 mt-0.5 shrink-0 ${isHighRisk ? 'text-red-400' : isMediumRisk ? 'text-amber-400' : 'text-emerald-400'}`} />
                    <span className="leading-relaxed">{tip}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-slate-300 p-2">
                {result.recommended_action === 'DONT_PAY' ? "Do not pay or share your UPI PIN." : "Please verify the requester before transferring."}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
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
            Analyze Another
          </button>
        </div>

      </div>

      {/* Feature: AI EXPLANATION / REASON Directly from n8n */}
      {result.explanation && (
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-cyan-400">n8n AI Agent Analysis</span>
              <h2 className="text-lg font-bold text-white mt-0.5">
                Why was this flagged?
              </h2>
            </div>
            <div className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-800/60 text-cyan-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>

          <p className="text-sm text-slate-200 leading-relaxed bg-slate-950/80 p-4 rounded-xl border border-slate-800 whitespace-pre-line">
            {result.explanation}
          </p>

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
      )}

      {/* Feature: Raw Response from n8n AI Agent (for 100% transparency & testing) */}
      {result.raw_response && (
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-bold text-slate-200">Raw n8n Workflow Output</h3>
            </div>
            <button
              onClick={() => setShowRawOutput(!showRawOutput)}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-medium"
            >
              {showRawOutput ? 'Hide Details' : 'View Full Output'}
            </button>
          </div>

          {showRawOutput && (
            <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto">
              {result.raw_response}
            </pre>
          )}
        </div>
      )}

      {/* Prototype Disclaimer */}
      <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-slate-400 shrink-0" />
          <span>
            <strong>Prototype Disclaimer:</strong> UPI Guardian is an advisory AI assistant. It analyzes request content and does not directly block or execute bank transactions.
          </span>
        </div>
      </div>

      {/* Action Modals */}
      <DontPayModal
        isOpen={showDontPayModal}
        onClose={() => setShowDontPayModal(false)}
        scamType={result.scam_type || result.risk_level_label}
      />
      <VerifyModal
        isOpen={showVerifyModal}
        onClose={() => setShowVerifyModal(false)}
        receiverUpi={paymentData?.receiver_upi_id}
      />
      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        scamType={result.scam_type || result.risk_level_label}
      />

    </div>
  );
};
