import React, { useState } from 'react';
import { MessageSquareWarning, AlertCircle, ArrowLeft, Loader2, Sparkles, Copy, Trash2 } from 'lucide-react';
import { PaymentData } from '../types/guardian';

interface MessageAnalyzerProps {
  onAnalyze: (data: PaymentData) => Promise<void>;
  isLoading: boolean;
  errorMessage: string | null;
  onBack: () => void;
  initialMessage?: string;
}

export const MessageAnalyzer: React.FC<MessageAnalyzerProps> = ({
  onAnalyze,
  isLoading,
  errorMessage,
  onBack,
  initialMessage = '',
}) => {
  const [message, setMessage] = useState(initialMessage);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Try to extract potential amount or UPI ID from the text if present
    const amountMatch = message.match(/(?:rs\.?|inr|₹)\s*([\d,]+)/i);
    const extractedAmount = amountMatch ? parseFloat(amountMatch[1].replace(/,/g, '')) : undefined;

    const upiMatch = message.match(/[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}/);
    const extractedUpi = upiMatch ? upiMatch[0] : 'unknown.sender@upi';

    const payload: PaymentData = {
      input: message.trim(),
      raw_message: message.trim(),
      payment_message: message.trim(),
      amount: extractedAmount || 10000,
      receiver_upi_id: extractedUpi,
      is_new_receiver: true,
      source_type: 'message_analyzer',
    };

    onAnalyze(payload);
  };

  const sampleMessages = [
    {
      label: 'Bank Account Block Threat',
      text: 'Dear Customer, your SBI Bank account will be blocked today due to pending KYC update. Pay ₹25,000 immediately for verification at sbi.kyc.verification91@okhdfcbank or call 9876543210.',
    },
    {
      label: 'Electricity Power Cutout',
      text: 'URGENT: Your electricity connection will be disconnected tonight at 9:30 PM due to unpaid bill of ₹14,250. Immediately pay to our officer at bses.delhi.powerbilling@paytm to prevent disconnection.',
    },
    {
      label: 'YouTube Like / Part-time Job',
      text: 'Congratulations! You are selected for YouTube Video Liking Job. Earn ₹3,500 daily. To activate your VIP Merchant Task Account, deposit refundable registration fee of ₹4,999 to vip.tasks@okaxis.',
    },
    {
      label: 'Lottery / UPI Scratch Card Win',
      text: 'You have won a PhonePe Lucky Cashback of ₹12,500! Open link upi://pay?pa=cashback.rewards@icici&am=12500 and enter your UPI PIN to claim money into your bank instantly.',
    },
    {
      label: 'Safe Family Rent Reminder',
      text: 'Hi Ramesh, this is your landlord Sharma. Please transfer the monthly house rent of ₹15,000 to my regular account sharma.landlord@okaxis when convenient. Thank you.',
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
        <span className="text-xs text-slate-400">Suspicious Communication Analyzer</span>
      </div>

      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 shadow-xl">
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-5 mb-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <MessageSquareWarning className="w-5 h-5 text-amber-400" />
              Scam Message Analyzer
            </h2>
            <p className="text-xs text-slate-400">
              Paste SMS, WhatsApp message, or email demanding UPI transfer or threatening account closure.
            </p>
          </div>
        </div>

        {/* Preset Sample Messages */}
        <div className="mb-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Quick Test Sample Messages:
            </span>
            {message && (
              <button
                type="button"
                onClick={() => setMessage('')}
                className="text-xs text-slate-400 hover:text-red-400 flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                Clear
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {sampleMessages.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setMessage(sample.text)}
                className="px-2.5 py-1 text-xs rounded-lg bg-slate-950 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-800/60 text-slate-300 transition-colors"
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
                Verify that your n8n backend is running and configured properly.
              </p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Paste the suspicious message here <span className="text-amber-400">*</span>
            </label>
            <textarea
              required
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Your bank account will be blocked today. Pay ₹25,000 immediately for verification."
              className="w-full p-4 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 leading-relaxed font-sans"
            />
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800 text-xs text-slate-400 space-y-1.5">
            <p className="font-medium text-slate-300">What Guardian AI looks for in messages:</p>
            <ul className="list-disc pl-4 space-y-0.5 text-slate-400">
              <li>Artificial time pressure (e.g., "within 2 hours", "tonight at 9 PM")</li>
              <li>Impersonation of trusted institutions (RBI, SBI, Electricity Board, Police)</li>
              <li>Deceptive instructions requiring money transfer or PIN entry for "verification"</li>
            </ul>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading || !message.trim()}
              className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-950/50 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  Analyzing Scam Patterns with Guardian AI...
                </>
              ) : (
                <>
                  Analyze Scam
                  <Sparkles className="w-4 h-4 text-slate-950" />
                </>
              )}
            </button>
            <p className="text-center text-[11px] text-slate-500 mt-2">
              Analysis sent directly to the configured n8n AI webhook.
            </p>
          </div>
        </form>

      </div>

    </div>
  );
};
