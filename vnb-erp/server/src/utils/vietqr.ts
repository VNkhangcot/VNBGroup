export interface VietQRParams {
  bankId?: string;
  accountNo?: string;
  accountName?: string;
  amount: number;
  orderCode: string;
  note?: string;
}

export const generateVietQRUrl = (params: VietQRParams): string => {
  const bankId = params.bankId || process.env.VIETQR_BANK_ID || '970422'; // Default MBBank
  const accountNo = params.accountNo || process.env.VIETQR_ACCOUNT_NO || '0988888888';
  const accountName = encodeURIComponent(params.accountName || process.env.VIETQR_ACCOUNT_NAME || 'TIEM TAP HOA CO HOA');
  const amount = Math.max(0, Math.round(params.amount));
  const addInfo = encodeURIComponent(params.note || `HD ${params.orderCode}`);

  return `https://img.vietqr.io/image/${bankId}-${accountNo}-compact2.png?amount=${amount}&addInfo=${addInfo}&accountName=${accountName}`;
};
