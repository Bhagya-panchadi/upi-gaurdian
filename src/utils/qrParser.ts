import jsQR from 'jsqr';

export interface ParsedUpiData {
  receiver_upi_id: string;
  receiver_name: string;
  amount: string;
  payment_message: string;
  raw_qr_string: string;
}

/**
 * Parses UPI URI schema e.g. upi://pay?pa=user@okhdfcbank&pn=John%20Doe&am=500&tn=Dinner
 */
export function parseUpiString(qrString: string): ParsedUpiData {
  const result: ParsedUpiData = {
    receiver_upi_id: '',
    receiver_name: '',
    amount: '',
    payment_message: '',
    raw_qr_string: qrString,
  };

  try {
    let clean = qrString.trim();
    if (clean.toLowerCase().startsWith('upi://pay')) {
      const url = new URL(clean);
      const params = url.searchParams;
      result.receiver_upi_id = params.get('pa') || '';
      result.receiver_name = params.get('pn') ? decodeURIComponent(params.get('pn')!) : '';
      result.amount = params.get('am') || '';
      result.payment_message = params.get('tn') ? decodeURIComponent(params.get('tn')!) : '';
    } else if (clean.includes('@')) {
      // Direct UPI ID
      result.receiver_upi_id = clean;
    }
  } catch {
    // If not standard URL format, try regex matching
    const paMatch = qrString.match(/[?&]pa=([^&]+)/i);
    const pnMatch = qrString.match(/[?&]pn=([^&]+)/i);
    const amMatch = qrString.match(/[?&]am=([^&]+)/i);
    const tnMatch = qrString.match(/[?&]tn=([^&]+)/i);

    if (paMatch) result.receiver_upi_id = decodeURIComponent(paMatch[1]);
    if (pnMatch) result.receiver_name = decodeURIComponent(pnMatch[1]);
    if (amMatch) result.amount = decodeURIComponent(amMatch[1]);
    if (tnMatch) result.payment_message = decodeURIComponent(tnMatch[1]);
  }

  return result;
}

/**
 * Scans an Image element or Canvas using jsQR
 */
export function decodeQrFromImage(imgElement: HTMLImageElement): string | null {
  const canvas = document.createElement('canvas');
  canvas.width = imgElement.naturalWidth || imgElement.width;
  canvas.height = imgElement.naturalHeight || imgElement.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.drawImage(imgElement, 0, 0, canvas.width, canvas.height);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const code = jsQR(imageData.data, imageData.width, imageData.height, {
    inversionAttempts: 'dontInvert',
  });

  return code ? code.data : null;
}
