export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';
export type RecommendedAction = 'PROCEED' | 'VERIFY' | 'DONT_PAY';

export interface AnalysisResponse {
  overall_risk_level: RiskLevel;
  risk_score: number;
  scam_type: string;
  why_risky: string[];
  explanation: string;
  recommended_action: RecommendedAction;
  safety_tips: string[];
  scam_steps: string[];
}

export interface PaymentData {
  amount?: number | string;
  receiver_upi_id?: string;
  receiver_name?: string;
  payment_message?: string;
  payment_link?: string;
  is_new_receiver?: boolean;
  user_avg_transaction_amount?: number | string;
  transactions_today?: number | string;
  source_type?: 'payment_form' | 'qr_scan' | 'message_analyzer' | 'payment_link';
  raw_message?: string;
  qr_raw_data?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}
