import { AnalysisResponse, PaymentData } from '../types/guardian';

// Production n8n webhook URL
export const PRODUCTION_WEBHOOK_URL = 'https://bhagya4478.app.n8n.cloud/webhook/upi-guardian-analyze';

const DEFAULT_WEBHOOK_URL =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_N8N_WEBHOOK_URL)
    ? import.meta.env.VITE_N8N_WEBHOOK_URL
    : PRODUCTION_WEBHOOK_URL;

export function getWebhookUrl(): string {
  if (typeof window !== 'undefined') {
    const custom = localStorage.getItem('upi_guardian_webhook_url');
    if (custom && custom.trim() !== '' && !custom.includes('xxxx.up.railway.app')) {
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
 * Strips markdown asterisks, bolding, and extra punctuation for clean UI display
 */
function cleanMarkdown(str: string): string {
  return str
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/^[\*\-\•\d\.]+\s*/, '')
    .trim();
}

/**
 * Parses unstructured or markdown text returned by n8n AI Agent into structured AnalysisResponse
 * strictly adhering to NOT fabricating risk scores or false scan results.
 */
function parseTextResult(text: string): AnalysisResponse {
  const lower = text.toLowerCase();

  // 1. Determine Risk Level & extract exact label from n8n
  let level: 'LOW' | 'MEDIUM' | 'HIGH' = 'HIGH';
  let riskLevelLabel = '';

  const labelMatch = text.match(/\*\*(?:\d+\.\s*)?Risk Level:\*\*\s*([^\n\r]+)/i);
  if (labelMatch) {
    riskLevelLabel = cleanMarkdown(labelMatch[1]);
  }

  if (lower.includes('high risk') || lower.includes('critical risk') || lower.includes('danger')) {
    level = 'HIGH';
    if (!riskLevelLabel) riskLevelLabel = 'High Risk';
  } else if (lower.includes('medium risk') || lower.includes('moderate risk') || lower.includes('caution')) {
    level = 'MEDIUM';
    if (!riskLevelLabel) riskLevelLabel = 'Medium Risk';
  } else if (lower.includes('low risk') || lower.includes('safe') || lower.includes('minimal risk')) {
    level = 'LOW';
    if (!riskLevelLabel) riskLevelLabel = 'Low Risk';
  } else {
    riskLevelLabel = riskLevelLabel || 'Unspecified Risk';
  }

  // 2. Risk Score: ONLY extract if n8n explicitly provided a numeric score. DO NOT fake a score!
  let score: number | null = null;
  const scoreMatch = text.match(/(?:risk score|score)[\s:]*(\d{1,3})(?:\/100|%|\b)/i);
  if (scoreMatch) {
    const parsed = parseInt(scoreMatch[1], 10);
    if (!isNaN(parsed) && parsed >= 0 && parsed <= 100) {
      score = parsed;
    }
  }

  // 3. Scam Type: Extract what n8n AI detected
  let scamType = '';
  const quoteScamMatch = text.match(/"([^"]*?(?:Scam|Fraud|Scheme|Trap|Attack)[^"]*?)"/i);
  if (quoteScamMatch) {
    scamType = quoteScamMatch[1].replace(/[\.\,\;\:]+$/, '').trim();
  } else if (lower.includes('urgency scam')) {
    scamType = 'Urgency Scam';
  } else if (lower.includes('bank impersonation')) {
    scamType = 'Bank Impersonation Scam';
  } else if (lower.includes('electricity') || lower.includes('power')) {
    scamType = 'Utility Disconnection Scam';
  } else if (lower.includes('impersonation scam')) {
    scamType = 'Impersonation Scam';
  } else if (lower.includes('lottery') || lower.includes('cashback')) {
    scamType = 'Cashback / Prize Scam';
  } else if (lower.includes('job') || lower.includes('task')) {
    scamType = 'Task / Employment Scam';
  } else {
    scamType = level === 'HIGH' ? 'Potential Payment Fraud' : level === 'MEDIUM' ? 'Suspicious Request' : 'Standard Payment';
  }

  // 4. Extract Actual Reason & Explanation from n8n
  let explanation = '';
  const reasonMatch = text.match(/\*\*(?:\d+\.\s*)?Reason:\*\*\s*([\s\S]*?)(?=\n\n\*\*|$)/i);
  if (reasonMatch) {
    explanation = reasonMatch[1].trim().replace(/\*\*(.*?)\*\*/g, '$1');
  } else {
    // Take text before safety advice
    const parts = text.split(/\*\*(?:\d+\.\s*)?Safety Advice:\*\*/i);
    explanation = cleanMarkdown(parts[0]).replace(/\*\*(?:\d+\.\s*)?Risk Level:\*\*.*?\n+/i, '').trim();
  }

  // 5. Why is this risky? (Break actual n8n reason into distinct points)
  let whyRisky: string[] = [];
  if (explanation) {
    const sentences = explanation
      .split(/(?<=[.!?])\s+/)
      .map(s => cleanMarkdown(s))
      .filter(s => s.length > 15 && !s.toLowerCase().startsWith('reason'));
    if (sentences.length > 0) {
      whyRisky = sentences;
    }
  }

  // 6. Recommended Action: derived directly from n8n advice
  let action: 'PROCEED' | 'VERIFY' | 'DONT_PAY' = 'VERIFY';
  if (lower.includes('do not pay') || lower.includes("don't pay") || lower.includes('not pay any money')) {
    action = 'DONT_PAY';
  } else if (lower.includes('verify') || lower.includes('requires verification') || lower.includes('call and verify')) {
    action = 'VERIFY';
  } else if (level === 'LOW' && !lower.includes('caution')) {
    action = 'PROCEED';
  }

  // 7. Safety Advice / Tips: Extract lines directly from n8n
  let safetyTips: string[] = [];
  const adviceMatch = text.match(/\*\*(?:\d+\.\s*)?Safety Advice:\*\*\s*([\s\S]*?)$/i);
  if (adviceMatch) {
    const rawLines = adviceMatch[1].split(/\n+/);
    safetyTips = rawLines
      .map(l => cleanMarkdown(l))
      .filter(l => l.length > 8 && !l.toLowerCase().includes('safety advice'));
  }

  return {
    overall_risk_level: level,
    risk_level_label: riskLevelLabel,
    risk_score: score, // null if n8n did not return a number
    scam_type: scamType,
    why_risky: whyRisky,
    explanation,
    recommended_action: action,
    safety_tips: safetyTips,
    raw_response: text,
  };
}

/**
 * Validates and normalizes the backend JSON or Text response into AnalysisResponse
 */
export function normalizeResponse(data: unknown): AnalysisResponse {
  let raw: any = data;
  if (Array.isArray(data) && data.length > 0) {
    raw = data[0];
  }

  if (raw && typeof raw === 'object') {
    if (raw.body && typeof raw.body === 'object') {
      raw = raw.body;
    } else if (raw.json && typeof raw.json === 'object') {
      raw = raw.json;
    }
  }

  // Check if raw has a text/result/output string field (common in n8n AI Agent nodes)
  const textContent =
    (raw && typeof raw === 'object' && (raw.result || raw.output || raw.text || raw.response || raw.message)) ||
    (typeof raw === 'string' ? raw : null);

  if (typeof textContent === 'string') {
    const trimmed = textContent.trim();

    // Check if the textContent is serialized JSON
    if (trimmed.startsWith('{') || trimmed.startsWith('```json') || trimmed.startsWith('```')) {
      try {
        const cleaned = trimmed.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim();
        const parsed = JSON.parse(cleaned);
        if (parsed && typeof parsed === 'object') {
          return normalizeResponse(parsed);
        }
      } catch {
        // Not valid JSON, proceed to text parser
      }
    }

    // Parse the actual text response from n8n AI Agent
    return parseTextResult(trimmed);
  }

  if (!raw || typeof raw !== 'object') {
    throw new Error('Invalid response structure received from n8n');
  }

  // If n8n returned structured JSON directly
  let level = String(raw.overall_risk_level || raw.risk_level || raw.risk || 'HIGH').toUpperCase();
  if (level !== 'LOW' && level !== 'MEDIUM' && level !== 'HIGH') {
    level = raw.risk_score && raw.risk_score > 70 ? 'HIGH' : raw.risk_score && raw.risk_score > 35 ? 'MEDIUM' : 'LOW';
  }

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

  const score = typeof raw.risk_score === 'number' ? Math.min(100, Math.max(0, raw.risk_score)) : null;
  const scamType = raw.scam_type || (level === 'HIGH' ? 'Potential Payment Fraud' : 'Payment Request');
  const whyRisky = Array.isArray(raw.why_risky) ? raw.why_risky.map((s: unknown) => cleanMarkdown(String(s))) : [];
  const explanation = raw.explanation || '';
  const safetyTips = Array.isArray(raw.safety_tips) ? raw.safety_tips.map((s: unknown) => cleanMarkdown(String(s))) : [];
  const scamSteps = Array.isArray(raw.scam_steps) ? raw.scam_steps.map((s: unknown) => cleanMarkdown(String(s))) : undefined;

  return {
    overall_risk_level: level as AnalysisResponse['overall_risk_level'],
    risk_level_label: raw.risk_level_label || `${level} RISK`,
    risk_score: score,
    scam_type: scamType,
    why_risky: whyRisky,
    explanation,
    recommended_action: action as AnalysisResponse['recommended_action'],
    safety_tips: safetyTips,
    scam_steps: scamSteps,
    raw_response: JSON.stringify(raw, null, 2),
  };
}

/**
 * Primary analyzePayment service function.
 * Sends POST request to n8n Webhook URL with body: { "input": "the user's message" }
 * Sets header Content-Type: application/json
 */
export async function analyzePayment(data: PaymentData): Promise<AnalysisResponse> {
  const webhookUrl = getWebhookUrl();

  if (!webhookUrl) {
    throw new Error('Guardian AI webhook URL is not configured. Please check backend settings.');
  }

  // Construct the "input" message text required by n8n AI Agent: {"input": "the message entered by the user"}
  let inputMessage = '';
  if (data.raw_message && data.raw_message.trim()) {
    inputMessage = data.raw_message.trim();
  } else if (data.payment_message && data.payment_message.trim()) {
    inputMessage = data.payment_message.trim();
  } else if (data.receiver_upi_id) {
    inputMessage = `Payment request: ₹${data.amount || '0'} to UPI ID ${data.receiver_upi_id}${data.receiver_name ? ` (Name: ${data.receiver_name})` : ''}. Note: ${data.payment_message || 'None'}.`;
  } else if (data.payment_link) {
    inputMessage = `Payment link for verification: ${data.payment_link}`;
  } else {
    inputMessage = 'Suspicious payment request inspection';
  }

  // Send JSON: {"input": "the message entered by the user"}
  const payload = {
    input: inputMessage,
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000); // 25s timeout for AI Agent processing

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`n8n webhook error (HTTP ${response.status})`);
    }

    const json = await response.json();
    return normalizeResponse(json);
  } catch (err: any) {
    console.error('Error contacting n8n AI Agent webhook:', err);
    if (err.name === 'AbortError') {
      throw new Error('Request timed out. The n8n AI Agent took too long to respond. Please try again.');
    }
    throw new Error(err.message || 'Guardian AI is currently unavailable. Please try again.');
  }
}
