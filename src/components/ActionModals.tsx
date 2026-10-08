import React from 'react';
import { ShieldCheck, PhoneCall, Globe, AlertTriangle, X, CheckCircle, ExternalLink } from 'lucide-react';

interface DontPayModalProps {
  isOpen: boolean;
  onClose: () => void;
  scamType: string;
}

export const DontPayModal: React.FC<DontPayModalProps> = ({ isOpen, onClose, scamType }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-xl bg-emerald-950/60 border border-emerald-800/80 flex items-center justify-center text-emerald-400 mb-4">
          <ShieldCheck className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-white mb-2">
          Payment Safely Aborted
        </h3>
        
        <p className="text-sm text-slate-300 leading-relaxed mb-4">
          Great decision! You chose not to proceed with this payment request. By stopping before entering your UPI PIN, you protected your money from potential fraud ({scamType}).
        </p>

        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-1.5 mb-6">
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <CheckCircle className="w-4 h-4" />
            Zero Funds Deducted
          </div>
          <p>
            No money has left your account. You can safely block or delete the sender's message.
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors"
        >
          Return to Analysis
        </button>
      </div>
    </div>
  );
};

interface VerifyModalProps {
  isOpen: boolean;
  onClose: () => void;
  receiverUpi?: string;
}

export const VerifyModal: React.FC<VerifyModalProps> = ({ isOpen, onClose, receiverUpi }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-800/80 flex items-center justify-center text-cyan-400 mb-4">
          <PhoneCall className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-white mb-1">
          Receiver Verification Guide
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Never rely on phone numbers or links provided inside suspicious messages.
        </p>

        {receiverUpi && (
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono mb-4">
            Target VPA: <span className="text-cyan-300">{receiverUpi}</span>
          </div>
        )}

        <div className="space-y-3 text-xs text-slate-300 mb-6">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="font-semibold text-white block mb-1">1. Independent Contact Method</span>
            Call the company or individual directly through a verified number from their official website or invoice—never the number sent in the message.
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="font-semibold text-white block mb-1">2. Official Banking Helplines (24x7)</span>
            <div className="grid grid-cols-2 gap-2 mt-2 font-mono text-[11px] text-slate-400">
              <div>State Bank of India: <span className="text-white">1800 1234</span></div>
              <div>HDFC Bank: <span className="text-white">1800 202 6161</span></div>
              <div>ICICI Bank: <span className="text-white">1800 1080</span></div>
              <div>Axis Bank: <span className="text-white">1860 419 5555</span></div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="font-semibold text-white block mb-1">3. Check Payee Name in UPI App</span>
            When initiating a payment, your UPI app resolves the legal bank account holder name. If the resolved name does not match the company, STOP.
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors"
        >
          Got it, Close
        </button>
      </div>
    </div>
  );
};

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  scamType: string;
}

export const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, scamType }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-xl bg-red-950/60 border border-red-800/80 flex items-center justify-center text-red-400 mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-white mb-1">
          Report Suspected UPI Scam
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Help protect other citizens by reporting fraudulent UPI handles and scam numbers.
        </p>

        <div className="space-y-3 text-xs mb-6">
          <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-900/60 text-red-200">
            <div className="flex items-center gap-2 font-bold text-sm text-red-300 mb-1">
              <PhoneCall className="w-4 h-4" />
              National Cyber Crime Helpline: 1930
            </div>
            <p>
              Toll-free immediate reporting helpline operated by the Ministry of Home Affairs (MHA), Government of India.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
            <div className="flex items-center justify-between font-semibold text-white mb-1">
              <span>National Cyber Crime Reporting Portal</span>
              <span className="text-cyan-400 text-[11px]">cybercrime.gov.in</span>
            </div>
            <p className="text-slate-400">
              Submit digital evidence (screenshots, transaction IDs, scammer VPA) directly to law enforcement.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
            <span className="font-semibold text-white block mb-1">In-App UPI Reporting:</span>
            <p className="text-slate-400">
              Open Google Pay, PhonePe, or Paytm &rarr; Navigate to Transaction/Profile &rarr; Select "Report Fraud / Spam".
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            Dismiss
          </button>
          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-950 bg-red-400 hover:bg-red-300 transition-colors flex items-center justify-center gap-1.5"
          >
            Visit Portal
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
