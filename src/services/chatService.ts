import { AnalysisResponse } from '../types/guardian';

export interface ChatResponse {
  reply: string;
}

export function generateGuardianChatReply(
  prompt: string,
  currentAnalysis?: AnalysisResponse | null
): string {
  const p = prompt.toLowerCase();

  // If user asks about current payment risk
  if (p.includes('why') && (p.includes('risky') || p.includes('flagged') || p.includes('danger'))) {
    if (currentAnalysis) {
      const scoreText = currentAnalysis.risk_score ? `with a ${currentAnalysis.risk_score}/100 score ` : '';
      const reasons = currentAnalysis.why_risky && currentAnalysis.why_risky.length > 0 ? `Key reasons: ${currentAnalysis.why_risky.join(', ')}.` : '';
      return `Based on our n8n AI Agent scan, this request was flagged ${scoreText}as ${currentAnalysis.risk_level_label || currentAnalysis.overall_risk_level + ' RISK'}. ${reasons} Scammers often use these patterns to bypass personal verification.`;
    }
    return `Payment requests are usually flagged as risky due to mismatched UPI VPAs (Virtual Payment Addresses), urgent coercive language, unusual payment amounts deviating from normal patterns, or requests requiring you to enter a PIN to "receive" funds.`;
  }

  // If user asks "Should I pay this person?"
  if (p.includes('should i pay') || p.includes('can i pay') || p.includes('is it safe to pay')) {
    if (currentAnalysis) {
      if (currentAnalysis.recommended_action === 'DONT_PAY') {
        return `⚠️ Strongly advised: DO NOT PAY. The scam type detected is "${currentAnalysis.scam_type}". Official organizations never threaten immediate account suspension or ask for verification fees over UPI.`;
      } else if (currentAnalysis.recommended_action === 'VERIFY') {
        return `⚠️ Caution: Please VERIFY before paying. Contact the receiver through an independent known phone number or official app first. Do not approve collect requests without double-checking.`;
      } else {
        return `✅ The analysis indicates ${currentAnalysis.risk_level_label || 'LOW RISK'}. However, always double-check the recipient name on your UPI app before entering your PIN.`;
      }
    }

    return `Before paying anyone unfamiliar: 1) Verify their identity via an independent channel, 2) Remember you NEVER need to enter your UPI PIN or scan a QR code to receive money, 3) If there is urgency or threats of disconnection/penalties, it is almost certainly a scam.`;
  }

  // If user asks "What is a refund scam?"
  if (p.includes('refund') || p.includes('cashback')) {
    return `In a UPI Refund or Cashback scam, fraudsters claim you have received a refund or won a prize. They send a UPI "Collect Request" or QR code and trick you into entering your UPI PIN by claiming it is required to "claim" the money. Rule to remember: Entering your UPI PIN ALWAYS DEDUCTS money from your bank account; it never credits money.`;
  }

  // If user asks "What should I do now?"
  if (p.includes('what should i do') || p.includes('how to report') || p.includes('next step')) {
    if (currentAnalysis?.recommended_action === 'DONT_PAY') {
      return `Here is your immediate action plan:\n1. 🛑 Do NOT approve the transaction or scan the QR code.\n2. 🔒 Do NOT share your UPI PIN or any SMS OTP.\n3. 📞 Call the National Cyber Crime Helpline at 1930 immediately if any money was transferred.\n4. 🛡️ Report the suspicious UPI ID on the National Cybercrime Portal (cybercrime.gov.in) and within your banking app.`;
    }
    return `If you suspect fraud: Stop communication immediately, do not enter your UPI PIN, block the sender in your UPI app, and report suspicious VPAs to NPCI or call the 1930 Cyber Fraud Helpline.`;
  }

  // If user asks about QR codes
  if (p.includes('qr') || p.includes('qr code') || p.includes('scan')) {
    return `Golden Rule of UPI QR Codes: Scanning a QR code is ONLY used to SEND (pay) money. You NEVER need to scan a QR code to receive payment, receive refunds, or claim marketplace sale proceeds. If a buyer sends you a QR code to "send you money", it is 100% a scam.`;
  }

  // If user asks about bank impersonation
  if (p.includes('bank') || p.includes('kyc') || p.includes('electricity') || p.includes('bill')) {
    return `Utility and Bank scams rely on fear and urgency. Legitimate Indian banks and power distribution companies will NEVER demand immediate UPI transfers to personal VPAs (e.g., @oksbi, @paytm) or send APK app links to prevent disconnections. Always pay bills through official utility portals or trusted biller BBPS systems.`;
  }

  // Default helpful response
  return `I am Guardian AI, your payment safety assistant. I can help evaluate suspicious UPI requests, explain scam patterns (like QR collect fraud, KYC threats, or OLX buyer scams), and advise whether it is safe to proceed. ${currentAnalysis ? `Currently reviewing the payment flagged as "${currentAnalysis.scam_type}".` : 'Paste a message or transaction above to run an analysis!'}`;
}
