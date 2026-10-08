import React, { useState } from 'react';
import { CreditCard, AlertCircle, ArrowLeft, Loader2, Sparkles, Check, HelpCircle } from 'lucide-react';
import { PaymentData, AnalysisResponse } from '../types/guardian';

interface PaymentCheckFormProps {
  onAnalyze: (data: PaymentData) => Promise<void>;
  isLoading: boolean;
  errorMessage: string | null;
  onBack: () => void;
  initialData?: Partial<PaymentData>;
}

export const PaymentCheckForm: React.FC<PaymentCheckFormProps> = ({
  onAnalyze,
  isLoading,
  errorMessage,
  onBack,
  initialData,
}) => {
  const [amount, setAmount] = useState(initialData?.amount?.toString() || '');
  const [receiverUpiId, setReceiverUpiId] = useState(initialData?.receiver_upi_id || '');
  const [receiverName, setReceiverName] = useState(initialData?.receiver_name || '');
  const [paymentMessage, setPaymentMessage] = useState(initialData?.payment_message || '');
  const [paymentLink, setPaymentLink] = useState(initialData?.payment_link || '');
  
  // Additional demo fields
  const [isNewReceiver, setIsNewReceiver] = useState<boolean>(
    initialData?.is_new_receiver !== undefined ? initialData.is_new_receiver : true
  );
  const [userAvgAmount, setUserAvgAmount] = useState<string>(
    initialData?.user_avg_transaction_amount?.toString() || '850'
  );
  const [transactionsToday, setTransactionsToday] = useState<string>(
    initialData?.transactions_today?.toString() || '3'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !receiverUpiId) {
      return;
    }

    const payload: PaymentData = {
      amount: parseFloat(amount) || amount,
      receiver_upi_id: receiverUpiId.trim(),
      receiver_name: receiverName.trim() || undefined,
      payment_message: paymentMessage.trim() || undefined,
      payment_link: paymentLink.trim() || undefined,
      is_new_receiver: isNewReceiver,
      user_avg_transaction_amount: parseFloat(userAvgAmount) || 850,
      transactions_today: parseInt(transactionsToday, 10) || 1,
      source_type: 'payment_form',
    };

    onAnalyze(payload);
  };

  const loadPreset = (type: 'bank_threat' | 'electricity' | 'grocery' | 'freelance') => {
    if (type === 'bank_threat') {
      setAmount('25000');
      setReceiverUpiId('sbi.kyc.verification91@okhdfcbank');
      setReceiverName('SBI Nodal Officer (Urgent KYC)');
      setPaymentMessage('Immediate account unfreeze charge refundable');
      setPaymentLink('');
      setIsNewReceiver(true);
      setUserAvgAmount('650');
      setTransactionsToday('1');
    } else if (type === 'electricity') {
      setAmount('14250');
      setReceiverUpiId('bses.delhi.powerbilling@paytm');
      setReceiverName('BSES Power Disconnection Desk');
      setPaymentMessage('Immediate bill clearance to avoid 9 PM cutoff');
      setPaymentLink('upi://pay?pa=bses.delhi.powerbilling@paytm&am=14250');
      setIsNewReceiver(true);
      setUserAvgAmount('1200');
      setTransactionsToday('2');
    } else if (type === 'grocery') {
      setAmount('480');
      setReceiverUpiId('freshmart.store@okicici');
      setReceiverName('FreshMart Daily Groceries');
      setPaymentMessage('Vegetables and groceries');
      setPaymentLink('');
      setIsNewReceiver(false);
      setUserAvgAmount('600');
      setTransactionsToday('4');
    } else if (type === 'freelance') {
      setAmount('7500');
      setReceiverUpiId('rahul.designs@paytm');
      setReceiverName('Rahul Verma');
      setPaymentMessage('Logo concept milestone 1 payment');
      setPaymentLink('');
      setIsNewReceiver(true);
      setUserAvgAmount('1500');
      setTransactionsToday('1');
    }
  };

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
        <span className="text-xs text-slate-400">Step 1 of 2: Transaction Details</span>
      </div>

      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-5 mb-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-cyan-400" />
              Payment Safety Check
            </h2>
            <p className="text-xs text-slate-400">
              Input the payment request details. Guardian AI will analyze risk before you transfer.
            </p>
          </div>
        </div>

        {/* Quick Presets for Hackathon Testing */}
        <div className="mb-6 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Quick Fill Hackathon Presets:
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => loadPreset('bank_threat')}
              className="px-2.5 py-1 text-xs rounded-md bg-red-950/50 hover:bg-red-900/60 border border-red-800/50 text-red-200 transition-colors"
            >
              ⚠️ Bank Account Block Threat (₹25k)
            </button>
            <button
              type="button"
              onClick={() => loadPreset('electricity')}
              className="px-2.5 py-1 text-xs rounded-md bg-amber-950/50 hover:bg-amber-900/60 border border-amber-800/50 text-amber-200 transition-colors"
            >
              ⚠️ Electricity Cutoff (₹14.2k)
            </button>
            <button
              type="button"
              onClick={() => loadPreset('grocery')}
              className="px-2.5 py-1 text-xs rounded-md bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-800/50 text-emerald-200 transition-colors"
            >
              ✅ Regular Grocery Shop (₹480)
            </button>
            <button
              type="button"
              onClick={() => loadPreset('freelance')}
              className="px-2.5 py-1 text-xs rounded-md bg-cyan-950/50 hover:bg-cyan-900/60 border border-cyan-800/50 text-cyan-200 transition-colors"
            >
              🔍 Freelancer Milestone (₹7.5k)
            </button>
          </div>
        </div>

        {/* Error message banner */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-800/80 text-red-200 flex items-start gap-3 text-xs leading-relaxed">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-100">{errorMessage}</p>
              <p className="text-red-300 mt-1">
                Please verify your n8n webhook connection via the Backend settings button in the top navigation bar.
              </p>
            </div>
          </div>
        )}

        {/* The Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Amount */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Amount (₹) <span className="text-cyan-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">
                  ₹
                </span>
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="e.g. 25000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-8 pr-3.5 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono tabular-nums"
                />
              </div>
            </div>

            {/* Receiver UPI ID */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Receiver UPI ID (VPA) <span className="text-cyan-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. user@okhdfcbank or merchant@paytm"
                value={receiverUpiId}
                onChange={(e) => setReceiverUpiId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono"
              />
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Receiver Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Receiver Name / Display Name
              </label>
              <input
                type="text"
                placeholder="e.g. SBI KYC Department / John Doe"
                value={receiverName}
                onChange={(e) => setReceiverName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
              />
            </div>

            {/* Optional Payment Link */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Payment Link (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. upi://pay?pa=... or tinyurl.com/..."
                value={paymentLink}
                onChange={(e) => setPaymentLink(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono text-xs"
              />
            </div>

          </div>

          {/* Payment Message */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Payment Message / Note / Reason for Transfer
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Urgent KYC verification fee, Electricity bill settlement, or Grocery payment"
              value={paymentMessage}
              onChange={(e) => setPaymentMessage(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 resize-none"
            />
          </div>

          {/* Demo fields section */}
          <div className="pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                Demo Profile Context
                <span className="text-[10px] text-cyan-400 px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/60">
                  Behavioral Baselines
                </span>
              </span>
              <span className="text-[11px] text-slate-500">Helps AI detect abnormal payment spikes</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              {/* New Receiver Toggle */}
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <label className="block text-[11px] font-semibold text-slate-300 mb-2">
                  New Receiver?
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsNewReceiver(true)}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                      isNewReceiver
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                        : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    Yes (First Time)
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsNewReceiver(false)}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                      !isNewReceiver
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                        : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    No (Known)
                  </button>
                </div>
              </div>

              {/* User Average Transaction Amount */}
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  User Avg. Amount (₹)
                </label>
                <input
                  type="number"
                  value={userAvgAmount}
                  onChange={(e) => setUserAvgAmount(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs font-mono tabular-nums focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Transactions Today */}
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Transactions Today
                </label>
                <input
                  type="number"
                  value={transactionsToday}
                  onChange={(e) => setTransactionsToday(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs font-mono tabular-nums focus:outline-none focus:border-cyan-400"
                />
              </div>

            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading || !amount || !receiverUpiId}
              className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-300 hover:from-cyan-300 hover:to-teal-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-950/50 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  Analyzing Payment with Guardian AI...
                </>
              ) : (
                <>
                  Analyze Payment
                  <Sparkles className="w-4 h-4 text-slate-950" />
                </>
              )}
            </button>
            <p className="text-center text-[11px] text-slate-500 mt-2">
              Advisory analysis via n8n backend. Does not block or initiate actual bank transfers.
            </p>
          </div>

        </form>
      </div>

    </div>
  );
};
