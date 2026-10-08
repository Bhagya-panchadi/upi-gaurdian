import { AnalysisResponse, PaymentData } from '../types/guardian';

// Configurable n8n webhook URL from environment or localStorage override
const DEFAULT_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || '';

export function getWebhookUrl(): string {
  if (typeof window !== 'undefined') {
    const custom = localStorage.getItem('upi_guardian_webhook_url');
    if (custom && custom.trim() !== '') {
      return custom.trim();
    }
  }
  return DEFAULT_WEBHOOK_URL;
}

export function setWebhookUrl(url: string): void {
  if (typeof window !== 'undefined') {
    if (url.trim()) {
      localStorage.setItem('upi_guardian_webhook_url', url.trim());
    } else {
      localStorage.removeItem('upi_guardian_webhook_url');
    }
  }
}

/**
 * Validates and normalizes the backend JSON response into AnalysisResponse
 */
function normalizeResponse(data: unknown): AnalysisResponse {
  // If n8n returns an array of objects [ { ... } ]
  let raw: any = data;
  if (Array.isArray(data) && data.length > 0) {
    raw = data[0];
  }
  // Sometimes n8n webhook wrappers wrap response in body or json
  if (raw && typeof raw === 'object') {
    if (raw.body && typeof raw.body === 'object') {
      raw = raw.body;
    } else if (raw.json && typeof raw.json === 'object') {
      raw = raw.json;
    }
  }

  if (!raw || typeof raw !== 'object') {
    throw new Error('Invalid response structure from backend');
  }

  // Normalize risk level
  let level = String(raw.overall_risk_level || raw.risk_level || raw.risk || 'HIGH').toUpperCase();
  if (level !== 'LOW' && level !== 'MEDIUM' && level !== 'HIGH') {
    level = raw.risk_score > 70 ? 'HIGH' : raw.risk_score > 35 ? 'MEDIUM' : 'LOW';
  }

  // Normalize recommended action
  let action = String(raw.recommended_action || raw.action || 'VERIFY').toUpperCase().replace(/[\s-]/g, '_');
  if (action !== 'PROCEED' && action !== 'VERIFY' && action !== 'DONT_PAY') {
    if (level === 'HIGH' || action.includes('DONT') || action.includes('NOT') || action.includes('STOP')) {
      action = 'DONT_PAY';
    } else if (level === 'LOW' || action.includes('PROCEED') || action.includes('ALLOW') || action.includes('SAFE')) {
      action = 'PROCEED';
    } else {
      action = 'VERIFY';
    }
  }

  const score = typeof raw.risk_score === 'number' ? Math.min(100, Math.max(0, raw.risk_score)) : (level === 'HIGH' ? 88 : level === 'MEDIUM' ? 52 : 15);

  const scamType = raw.scam_type || (level === 'HIGH' ? 'Potential Payment Fraud' : level === 'MEDIUM' ? 'Unverified Payee Risk' : 'Standard Payment');

  const whyRisky = Array.isArray(raw.why_risky) && raw.why_risky.length > 0
    ? raw.why_risky.map((s: unknown) => String(s))
    : (level === 'HIGH' ? ['Suspicious payee indicators detected', 'High urgency request pattern'] : ['Standard payee profile check advised']);

  const explanation = raw.explanation || `UPI Guardian detected ${level.toLowerCase()} risk indicators based on receiver metadata and transaction context.`;

  const safetyTips = Array.isArray(raw.safety_tips) && raw.safety_tips.length > 0
    ? raw.safety_tips.map((s: unknown) => String(s))
    : [
        'Never share your 4 or 6 digit UPI PIN to receive money',
        'Official banks never ask for payment to unfreeze accounts',
        'Verify unknown payee identity via direct voice call before approving'
      ];

  const scamSteps = Array.isArray(raw.scam_steps) && raw.scam_steps.length > 0
    ? raw.scam_steps.map((s: unknown) => String(s))
    : [
        'Scammer sends an urgent or threatening payment alert',
        'Victim is directed to scan a QR code or approve a collect request',
        'Funds are deducted instantly once UPI PIN is entered'
      ];

  return {
    overall_risk_level: level as AnalysisResponse['overall_risk_level'],
    risk_score: score,
    scam_type: scamType,
    why_risky: whyRisky,
    explanation,
    recommended_action: action as AnalysisResponse['recommended_action'],
    safety_tips: safetyTips,
    scam_steps: scamSteps,
  };
}

/**
 * Primary analyzePayment service function required by specification.
 * Sends POST request to N8N_WEBHOOK_URL.
 * If n8n backend is unavailable, throws an error with the exact message:
 * "Guardian AI is currently unavailable. Please try again."
 */
export async function analyzePayment(data: PaymentData): Promise<AnalysisResponse> {
  const webhookUrl = getWebhookUrl();

  if (!webhookUrl) {
    throw new Error('Guardian AI is currently unavailable. Please try again.');
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 18000); // 18s timeout

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const json = await response.json();
    return normalizeResponse(json);
  } catch (err: unknown) {
    console.error('Error contacting n8n webhook backend:', err);
    // Explicit requirement: If the n8n backend is unavailable, show: "Guardian AI is currently unavailable. Please try again."
    throw new Error('Guardian AI is currently unavailable. Please try again.');
  }
}
