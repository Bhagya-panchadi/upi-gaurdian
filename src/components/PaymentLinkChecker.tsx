import React, { useState } from 'react';
import { Link2, AlertCircle, ArrowLeft, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import { PaymentData } from '../types/guardian';
import { parseUpiString } from '../utils/qrParser';

interface PaymentLinkCheckerProps {
  onAnalyze: (data: PaymentData) => Promise<void>;
  isLoading: boolean;
  errorMessage: string | null;
  onBack: () => void;
}

export const PaymentLinkChecker: React.FC<PaymentLinkCheckerProps> = ({
  onAnalyze,
  isLoading,
  errorMessage,
  onBack,
}) => {
  const [linkInput, setLinkInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkInput.trim()) return;

    let upiId = 'unknown.gateway@upi';
    let amount = 15000;
    let note = 'Payment Link Verification';
    let receiverName = 'Payment Gateway';

    // If it's a UPI deep link upi://pay?...
    if (linkInput.startsWith('upi://')) {
      const parsed = parseUpiString(linkInput);
      upiId = parsed.receiver_upi_id || upiId;
      amount = parseFloat(parsed.amount) || amount;
      note = parsed.payment_message || note;
      receiverName = parsed.receiver_name || receiverName;
    }

    const payload: PaymentData = {
      input: linkInput.trim(),
      payment_link: linkInput.trim(),
      amount,
      receiver_upi_id: upiId,
      receiver_name: receiverName,
      payment_message: note,
      is_new_receiver: true,
      source_type: 'payment_link',
    };

    onAnalyze(payload);
  };

  const sampleLinks = [
    {
      label: 'Deep Link: Bank Block Threat',
      url: 'upi://pay?pa=sbi.support91@okhdfcbank&pn=SBI%20KYC%20Helpdesk&am=25000&tn=KYC%20Verification%20Fee',
    },
    {
      label: 'Shortened Suspicious URL',
      url: 'https://bit.ly/sbi-urgent-kyc-reactivate',
    },
    {
      label: 'Spoofed Utility Payment Link',
      url: 'upi://pay?pa=electricity.discom.urgent@paytm&pn=Power%20Clearance&am=14250&tn=Urgent%20Clearance',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto py-4 sm:py-6 space-y-6">
      
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
        <span className="text-xs text-slate-400">Payment Link & URL Security</span>
      </div>

      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-5 mb-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Link2 className="w-5 h-5 text-indigo-400" />
              Check Payment Link
            </h2>
            <p className="text-xs text-slate-400">
              Inspect raw `upi://` deep links, shortened bit.ly URLs, or third-party collect links.
            </p>
          </div>
        </div>

        {/* Quick sample chips */}
        <div className="mb-6 space-y-2">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Quick Test Sample Links:
          </span>
          <div className="flex flex-wrap gap-2">
            {sampleLinks.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setLinkInput(sample.url)}
                className="px-2.5 py-1 text-xs rounded-lg bg-slate-950 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/60 text-slate-300 transition-colors"
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>

        {/* Error banner */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-800/80 text-red-200 flex items-start gap-3 text-xs leading-relaxed">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-100">{errorMessage}</p>
              <p className="text-red-300 mt-1">
                Please verify your n8n webhook connection via the Backend settings button in the navigation bar.
              </p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Paste the payment link or URL <span className="text-indigo-400">*</span>
            </label>
            <input
              type="text"
              required
              value={linkInput}
              onChange={(e) => setLinkInput(e.target.value)}
              placeholder="e.g. upi://pay?pa=scammer@okhdfcbank&pn=SBI&am=25000 or https://bit.ly/..."
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 font-mono text-xs"
            />
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800 text-xs text-slate-400 space-y-1">
            <p className="font-medium text-slate-300">Why links are risky:</p>
            <p className="text-slate-400">
              Scammers often shorten links to disguise personal UPI IDs or trick your phone into triggering an instant debit authorization without showing the real payee name.
            </p>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading || !linkInput.trim()}
              className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-slate-950 bg-gradient-to-r from-indigo-400 to-cyan-300 hover:from-indigo-300 hover:to-cyan-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-950/50 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  Analyzing Link with Guardian AI...
                </>
              ) : (
                <>
                  Analyze Payment Link
                  <Sparkles className="w-4 h-4 text-slate-950" />
                </>
              )}
            </button>
            <p className="text-center text-[11px] text-slate-500 mt-2">
              Inspects query parameters, payee masquerading, and redirection traps.
            </p>
          </div>
        </form>

      </div>

    </div>
  );
};
