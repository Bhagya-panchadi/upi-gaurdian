import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { PaymentCheckForm } from './components/PaymentCheckForm';
import { MessageAnalyzer } from './components/MessageAnalyzer';
import { QrScanner } from './components/QrScanner';
import { PaymentLinkChecker } from './components/PaymentLinkChecker';
import { ResultView } from './components/ResultView';
import { GuardianChatDrawer } from './components/GuardianChatDrawer';
import { WebhookModal } from './components/WebhookModal';
import { PaymentData, AnalysisResponse } from './types/guardian';
import { analyzePayment, getWebhookUrl } from './services/api';
import { AlertCircle, RefreshCw, Sliders, Shield } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'payment' | 'message' | 'qr' | 'link'>('dashboard');
  const [isViewingResult, setIsViewingResult] = useState(false);
  const [currentResult, setCurrentResult] = useState<AnalysisResponse | null>(null);
  const [lastPaymentData, setLastPaymentData] = useState<PaymentData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [webhookUrl, setWebhookUrlState] = useState('');

  // Pre-fill state for cross-component preset navigation
  const [prefilledPayment, setPrefilledPayment] = useState<Partial<PaymentData> | undefined>(undefined);
  const [prefilledMessage, setPrefilledMessage] = useState<string>('');

  useEffect(() => {
    setWebhookUrlState(getWebhookUrl());
  }, []);

  const handleAnalyze = async (data: PaymentData) => {
    setIsLoading(true);
    setErrorMessage(null);
    setLastPaymentData(data);

    try {
      const response = await analyzePayment(data);
      setCurrentResult(response);
      setIsViewingResult(true);
    } catch (err: any) {
      console.error('Analysis failed:', err);
      // Strictly follow prompt requirement: "Guardian AI is currently unavailable. Please try again."
      setErrorMessage(err.message || 'Guardian AI is currently unavailable. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPreset = (preset: 'bank_block' | 'electricity' | 'olx_qr' | 'safe_grocery') => {
    if (preset === 'bank_block') {
      setPrefilledPayment({
        amount: 25000,
        receiver_upi_id: 'sbi.kyc.verification91@okhdfcbank',
        receiver_name: 'SBI Nodal Officer (Urgent KYC)',
        payment_message: 'Pay ₹25,000 immediately to unfreeze SBI bank account',
        is_new_receiver: true,
        user_avg_transaction_amount: 650,
        transactions_today: 1,
      });
      setIsViewingResult(false);
      setActiveTab('payment');
    } else if (preset === 'electricity') {
      setPrefilledMessage(
        'URGENT: Your electricity connection will be disconnected tonight at 9:30 PM due to unpaid bill of ₹14,250. Immediately pay to our officer at bses.delhi.powerbilling@paytm to prevent disconnection.'
      );
      setIsViewingResult(false);
      setActiveTab('message');
    } else if (preset === 'olx_qr') {
      setIsViewingResult(false);
      setActiveTab('qr');
    } else if (preset === 'safe_grocery') {
      setPrefilledPayment({
        amount: 450,
        receiver_upi_id: 'freshmart.store@okicici',
        receiver_name: 'FreshMart Daily Groceries',
        payment_message: 'Vegetables & milk supplies',
        is_new_receiver: false,
        user_avg_transaction_amount: 600,
        transactions_today: 3,
      });
      setIsViewingResult(false);
      setActiveTab('payment');
    }
  };

  const handleResetAnalysis = () => {
    setIsViewingResult(false);
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 flex flex-col font-sans">
      
      {/* Navigation Top Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setIsViewingResult(false);
          setActiveTab(tab);
          setErrorMessage(null);
        }}
        onOpenChat={() => setIsChatOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isWebhookSet={Boolean(webhookUrl)}
        hasActiveResult={Boolean(currentResult)}
        onViewResult={() => setIsViewingResult(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 px-4 sm:px-8 py-6 max-w-7xl w-full mx-auto">
        
        {/* Global Error Banner when n8n backend is unavailable */}
        {errorMessage && !isViewingResult && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/70 border border-red-800/80 text-red-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm text-red-100">{errorMessage}</p>
                <p className="text-xs text-red-300 mt-0.5">
                  The n8n webhook backend ({webhookUrl || 'no URL configured'}) did not respond with analysis data.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-900/60 hover:bg-red-800 text-red-100 border border-red-700/60 flex items-center gap-1.5 transition-colors"
              >
                <Sliders className="w-3.5 h-3.5" />
                Configure Webhook URL
              </button>
            </div>
          </div>
        )}

        {/* View Switcher */}
        {isViewingResult && currentResult ? (
          <ResultView
            result={currentResult}
            paymentData={lastPaymentData}
            onReset={handleResetAnalysis}
            onOpenChat={() => setIsChatOpen(true)}
          />
        ) : activeTab === 'dashboard' ? (
          <Dashboard
            onNavigate={(tab) => {
              setIsViewingResult(false);
              setActiveTab(tab);
              setErrorMessage(null);
            }}
            onSelectQuickPreset={handleQuickPreset}
            hasActiveResult={Boolean(currentResult)}
            onViewResult={() => setIsViewingResult(true)}
          />
        ) : activeTab === 'payment' ? (
          <PaymentCheckForm
            onAnalyze={handleAnalyze}
            isLoading={isLoading}
            errorMessage={errorMessage}
            onBack={() => setActiveTab('dashboard')}
            initialData={prefilledPayment}
          />
        ) : activeTab === 'message' ? (
          <MessageAnalyzer
            onAnalyze={handleAnalyze}
            isLoading={isLoading}
            errorMessage={errorMessage}
            onBack={() => setActiveTab('dashboard')}
            initialMessage={prefilledMessage}
          />
        ) : activeTab === 'qr' ? (
          <QrScanner
            onAnalyze={handleAnalyze}
            isLoading={isLoading}
            errorMessage={errorMessage}
            onBack={() => setActiveTab('dashboard')}
          />
        ) : (
          <PaymentLinkChecker
            onAnalyze={handleAnalyze}
            isLoading={isLoading}
            errorMessage={errorMessage}
            onBack={() => setActiveTab('dashboard')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 px-4 sm:px-8 py-5 mt-12 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">UPI Guardian</span>
            <span>—</span>
            <span className="text-slate-400">Understand the scam. Protect your payment.</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Prototype for Hackathon</span>
            <span>·</span>
            <span>Advisory AI Layer</span>
            <span>·</span>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="text-cyan-400 hover:text-cyan-300"
            >
              Backend Webhook Status
            </button>
          </div>
        </div>
      </footer>

      {/* Floating Guardian AI Chat Drawer */}
      <GuardianChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        currentAnalysis={currentResult}
      />

      {/* Webhook Configuration Modal */}
      <WebhookModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onUrlUpdated={(newUrl) => setWebhookUrlState(newUrl)}
      />

    </div>
  );
}
