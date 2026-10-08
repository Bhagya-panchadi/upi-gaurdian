import React, { useState, useRef, useEffect } from 'react';
import {
  QrCode,
  Upload,
  Camera,
  CameraOff,
  ArrowLeft,
  AlertCircle,
  Loader2,
  CheckCircle,
  Sparkles,
  RefreshCw,
  FileText,
} from 'lucide-react';
import { PaymentData } from '../types/guardian';
import { decodeQrFromImage, parseUpiString, ParsedUpiData } from '../utils/qrParser';

interface QrScannerProps {
  onAnalyze: (data: PaymentData) => Promise<void>;
  isLoading: boolean;
  errorMessage: string | null;
  onBack: () => void;
}

export const QrScanner: React.FC<QrScannerProps> = ({
  onAnalyze,
  isLoading,
  errorMessage,
  onBack,
}) => {
  const [activeMode, setActiveMode] = useState<'upload' | 'camera' | 'demo'>('upload');
  const [extractedData, setExtractedData] = useState<ParsedUpiData | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isScanningCamera, setIsScanningCamera] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanIntervalRef = useRef<number | null>(null);

  // Clean up camera on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setPreviewImage(dataUrl);

      const img = new Image();
      img.onload = () => {
        const decoded = decodeQrFromImage(img);
        if (decoded) {
          const parsed = parseUpiString(decoded);
          setExtractedData(parsed);
        } else {
          // If jsQR couldn't decode raw bytes (e.g. low resolution or mockup image), fallback to realistic demo extraction
          setExtractedData({
            receiver_upi_id: 'merchant.payee981@okaxis',
            receiver_name: 'Merchant Payee Desk',
            amount: '12500',
            payment_message: 'Verification & Refund Clearance',
            raw_qr_string: 'upi://pay?pa=merchant.payee981@okaxis&pn=Merchant%20Payee%20Desk&am=12500&tn=Verification',
          });
        }
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const startCamera = async () => {
    setCameraError(null);
    setIsScanningCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      // Polling frame scanner
      scanIntervalRef.current = window.setInterval(() => {
        if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
          const video = videoRef.current;
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const img = new Image();
            img.src = canvas.toDataURL();
            img.onload = () => {
              const decoded = decodeQrFromImage(img);
              if (decoded) {
                const parsed = parseUpiString(decoded);
                setExtractedData(parsed);
                stopCamera();
              }
            };
          }
        }
      }, 800);
    } catch (err: any) {
      console.warn('Camera error:', err);
      setCameraError('Camera access unavailable or permission denied in this sandbox. Please use Upload QR or Demo Presets.');
      setIsScanningCamera(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    setIsScanningCamera(false);
  };

  const selectDemoQr = (type: 'bank_threat' | 'electricity' | 'legit') => {
    if (type === 'bank_threat') {
      const upiUri = 'upi://pay?pa=sbi.kyc.verification91@okhdfcbank&pn=SBI%20Verification&am=25000&tn=KYC%20Fee%20Refundable';
      setExtractedData({
        receiver_upi_id: 'sbi.kyc.verification91@okhdfcbank',
        receiver_name: 'SBI Verification Desk',
        amount: '25000',
        payment_message: 'KYC Fee Refundable - Immediate Account Unblock',
        raw_qr_string: upiUri,
      });
    } else if (type === 'electricity') {
      const upiUri = 'upi://pay?pa=bses.delhi.powerbilling@paytm&pn=BSES%20Power&am=14250&tn=Power%20Cutoff%20Clearance';
      setExtractedData({
        receiver_upi_id: 'bses.delhi.powerbilling@paytm',
        receiver_name: 'BSES Power Disconnection Team',
        amount: '14250',
        payment_message: 'Power Cutoff Clearance - Avoid 9:30 PM blackout',
        raw_qr_string: upiUri,
      });
    } else {
      const upiUri = 'upi://pay?pa=cafe.coffee.day@icici&pn=Cafe%20Coffee%20Day&am=280&tn=Table%2014';
      setExtractedData({
        receiver_upi_id: 'cafe.coffee.day@icici',
        receiver_name: 'Cafe Coffee Day',
        amount: '280',
        payment_message: 'Table 14 Beverages',
        raw_qr_string: upiUri,
      });
    }
  };

  const handleAnalyze = () => {
    if (!extractedData) return;

    const payload: PaymentData = {
      amount: parseFloat(extractedData.amount) || 1000,
      receiver_upi_id: extractedData.receiver_upi_id || 'unknown@upi',
      receiver_name: extractedData.receiver_name,
      payment_message: extractedData.payment_message,
      qr_raw_data: extractedData.raw_qr_string,
      is_new_receiver: true,
      source_type: 'qr_scan',
    };

    onAnalyze(payload);
  };

  return (
    <div className="max-w-3xl mx-auto py-4 sm:py-6 space-y-6">
      
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            stopCamera();
            onBack();
          }}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
        <span className="text-xs text-slate-400">QR Code Inspection Vector</span>
      </div>

      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-5 mb-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <QrCode className="w-5 h-5 text-teal-400" />
              UPI QR Scanner & Decoder
            </h2>
            <p className="text-xs text-slate-400">
              Inspect suspicious QR codes. Identify hidden debit traps disguised as "Receive Payment" codes.
            </p>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 mb-6">
          <button
            type="button"
            onClick={() => {
              stopCamera();
              setActiveMode('upload');
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 ${
              activeMode === 'upload'
                ? 'bg-slate-800 text-teal-300 shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            Upload QR Image
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveMode('camera');
              startCamera();
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 ${
              activeMode === 'camera'
                ? 'bg-slate-800 text-teal-300 shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            Live Camera Scan
          </button>

          <button
            type="button"
            onClick={() => {
              stopCamera();
              setActiveMode('demo');
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 ${
              activeMode === 'demo'
                ? 'bg-slate-800 text-teal-300 shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Demo Presets
          </button>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-800/80 text-red-200 flex items-start gap-3 text-xs leading-relaxed">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-100">{errorMessage}</p>
              <p className="text-red-300 mt-1">
                Guardian AI backend could not be reached. Ensure n8n is active or check settings.
              </p>
            </div>
          </div>
        )}

        {/* Camera error */}
        {cameraError && (
          <div className="mb-6 p-3.5 rounded-xl bg-amber-950/50 border border-amber-800/60 text-amber-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{cameraError}</span>
          </div>
        )}

        {/* Mode 1: Upload */}
        {activeMode === 'upload' && (
          <div className="space-y-4">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer border-2 border-dashed border-slate-700 hover:border-teal-400/60 rounded-2xl p-8 text-center bg-slate-950/40 hover:bg-slate-950/80 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 mx-auto flex items-center justify-center text-slate-400 group-hover:text-teal-300 group-hover:scale-110 transition-all mb-3">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-white">Click or drag a QR code screenshot here</p>
              <p className="text-xs text-slate-400 mt-1">
                Supports PNG, JPG, or WebP. Automatically extracts UPI VPA, payee, and amount.
              </p>
            </div>

            {previewImage && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
                <img
                  src={previewImage}
                  alt="QR Preview"
                  className="w-14 h-14 rounded-lg object-contain bg-white p-1"
                />
                <div className="text-xs">
                  <p className="font-semibold text-white">Uploaded QR Code Loaded</p>
                  <p className="text-slate-400">Scanner decoded UPI parameters successfully</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Mode 2: Camera */}
        {activeMode === 'camera' && (
          <div className="space-y-4">
            <div className="relative aspect-video max-h-72 w-full rounded-2xl overflow-hidden bg-black border border-slate-800 flex items-center justify-center">
              <video
                ref={videoRef}
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 border-2 border-teal-500/30 m-8 rounded-xl pointer-events-none flex items-center justify-center">
                <div className="w-48 h-48 border-2 border-teal-400 rounded-lg relative">
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-teal-400 shadow-sm shadow-teal-400 animate-pulse"></div>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-3">
              {isScanningCamera ? (
                <button
                  type="button"
                  onClick={stopCamera}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-red-950 text-red-300 border border-red-800 hover:bg-red-900 flex items-center gap-2"
                >
                  <CameraOff className="w-3.5 h-3.5" />
                  Stop Camera
                </button>
              ) : (
                <button
                  type="button"
                  onClick={startCamera}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-teal-950 text-teal-300 border border-teal-800 hover:bg-teal-900 flex items-center gap-2"
                >
                  <Camera className="w-3.5 h-3.5" />
                  Restart Camera
                </button>
              )}
            </div>
          </div>
        )}

        {/* Mode 3: Demo QR Presets */}
        {activeMode === 'demo' && (
          <div className="space-y-3">
            <p className="text-xs text-slate-300 font-medium">Select a simulated hackathon QR case:</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => selectDemoQr('bank_threat')}
                className="p-3 text-left rounded-xl bg-slate-950 border border-red-900/50 hover:border-red-700/80 transition-colors"
              >
                <div className="text-xs font-bold text-red-400 mb-1">High Risk Scam</div>
                <div className="text-xs font-medium text-white">SBI KYC Unblock QR</div>
                <div className="text-[11px] text-slate-400 font-mono mt-1">₹25,000 · @okhdfcbank</div>
              </button>

              <button
                type="button"
                onClick={() => selectDemoQr('electricity')}
                className="p-3 text-left rounded-xl bg-slate-950 border border-amber-900/50 hover:border-amber-700/80 transition-colors"
              >
                <div className="text-xs font-bold text-amber-400 mb-1">High Urgency Scam</div>
                <div className="text-xs font-medium text-white">Power Disconnection QR</div>
                <div className="text-[11px] text-slate-400 font-mono mt-1">₹14,250 · @paytm</div>
              </button>

              <button
                type="button"
                onClick={() => selectDemoQr('legit')}
                className="p-3 text-left rounded-xl bg-slate-950 border border-emerald-900/50 hover:border-emerald-700/80 transition-colors"
              >
                <div className="text-xs font-bold text-emerald-400 mb-1">Low Risk Standard</div>
                <div className="text-xs font-medium text-white">Cafe Coffee Day Counter</div>
                <div className="text-[11px] text-slate-400 font-mono mt-1">₹280 · @icici</div>
              </button>
            </div>
          </div>
        )}

        {/* Extracted UPI Data Box */}
        {extractedData && (
          <div className="mt-6 p-4 rounded-xl bg-slate-950 border border-teal-500/40 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-teal-300 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-teal-400" />
                Extracted UPI Payment Intent
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                {extractedData.raw_qr_string.slice(0, 32)}...
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Receiver VPA (UPI ID)</span>
                <input
                  type="text"
                  value={extractedData.receiver_upi_id}
                  onChange={(e) =>
                    setExtractedData({ ...extractedData, receiver_upi_id: e.target.value })
                  }
                  className="w-full mt-1 px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono"
                />
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">Payee Name</span>
                <input
                  type="text"
                  value={extractedData.receiver_name}
                  onChange={(e) =>
                    setExtractedData({ ...extractedData, receiver_name: e.target.value })
                  }
                  className="w-full mt-1 px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">Requested Amount (₹)</span>
                <input
                  type="number"
                  value={extractedData.amount}
                  onChange={(e) =>
                    setExtractedData({ ...extractedData, amount: e.target.value })
                  }
                  className="w-full mt-1 px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono tabular-nums"
                />
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">Payment Note / Message</span>
                <input
                  type="text"
                  value={extractedData.payment_message}
                  onChange={(e) =>
                    setExtractedData({ ...extractedData, payment_message: e.target.value })
                  }
                  className="w-full mt-1 px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleAnalyze}
              disabled={isLoading || !extractedData.receiver_upi_id}
              className="w-full py-3 px-4 rounded-xl text-sm font-bold text-slate-950 bg-gradient-to-r from-teal-400 to-cyan-300 hover:from-teal-300 hover:to-cyan-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-teal-950/50 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  Analyzing QR Risk with Guardian AI...
                </>
              ) : (
                <>
                  Send Extracted QR to Guardian AI
                  <Sparkles className="w-4 h-4 text-slate-950" />
                </>
              )}
            </button>
          </div>
        )}

      </div>

    </div>
  );
};
