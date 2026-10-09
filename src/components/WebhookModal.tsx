import React, { useState, useEffect } from 'react';
import { X, Check, Globe, RefreshCw, AlertCircle, Copy, Code, ArrowRight } from 'lucide-react';
import { getWebhookUrl, setWebhookUrl } from '../services/api';

interface WebhookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUrlUpdated: (url: string) => void;
}

export const WebhookModal: React.FC<WebhookModalProps> = ({
  isOpen,
  onClose,
  onUrlUpdated,
}) => {
  const [url, setUrl] = useState('');
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'failed'>('idle');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setUrl(getWebhookUrl());
      setTestStatus('idle');
    }
  }, [isOpen]);

  const handleSave = () => {
    setWebhookUrl(url);
    onUrlUpdated(url);
    onClose();
  };

  const handleTestPing = async () => {
    if (!url.trim()) {
      setTestStatus('failed');
      return;
    }
    setTestStatus('testing');
    try {
      const res = await fetch(url.trim(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: 'Test verification message: Your bank account will be blocked today. Pay ₹25,000 immediately.',
        }),
      });

      if (res.ok) {
        setTestStatus('success');
      } else {
        setTestStatus('failed');
      }
    } catch {
      setTestStatus('failed');
    }
  };

  const sampleJson = `{
  "result": "**Risk Level:** High Risk\\n\\n**Reason:** This is a classic \\"Urgency Scam.\\" Banks never ask you to pay money to \\"verify\\" your account or prevent it from being blocked...\\n\\n**Safety Advice:**\\n* **Do NOT pay any money.**\\n* **Do NOT click on any links**...\\n* **Verify independently:**..."
}`;


  const copySample = () => {
    navigator.clipboard.writeText(sampleJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">n8n Backend Webhook Settings</h3>
            <p className="text-xs text-slate-400">Connect UPI Guardian to your live n8n workflow</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Webhook Endpoint URL (`VITE_N8N_WEBHOOK_URL`)
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://bhagya4478.app.n8n.cloud/webhook/upi-guardian-analyze"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-mono placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Requests are posted directly using <span className="font-mono text-cyan-300">analyzePayment(data)</span>.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleTestPing}
              disabled={testStatus === 'testing' || !url.trim()}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testStatus === 'testing' ? 'animate-spin' : ''}`} />
              Test Connection
            </button>

            {testStatus === 'success' && (
              <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                <Check className="w-4 h-4" /> Connected to n8n Webhook
              </span>
            )}
            {testStatus === 'failed' && (
              <span className="text-xs text-amber-400 font-medium flex items-center gap-1">
                <AlertCircle className="w-4 h-4" /> Backend unreachable or CORS blocked
              </span>
            )}
          </div>

          {/* Expected Response Specification */}
          <div className="border-t border-slate-800 pt-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-cyan-400" />
                Expected n8n Webhook JSON Response:
              </span>
              <button
                type="button"
                onClick={copySample}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <Copy className="w-3 h-3" />
                {copied ? 'Copied!' : 'Copy Sample'}
              </button>
            </div>

            <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto max-h-48 leading-relaxed">
              {sampleJson}
            </pre>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors"
            >
              Save Endpoint
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
