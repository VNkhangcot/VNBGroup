import React, { useState, useEffect } from 'react';
import { QrCode, CheckCircle2, X, Copy, ShieldCheck, ArrowRight, Image as ImageIcon } from 'lucide-react';
import { TenantConfig } from '../types';

interface VietQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmPayment: () => void;
  amount: number;
  orderCode: string;
  tenant: TenantConfig | null;
}

export const VietQRModal: React.FC<VietQRModalProps> = ({
  isOpen,
  onClose,
  onConfirmPayment,
  amount,
  orderCode,
  tenant,
}) => {
  const [copied, setCopied] = useState(false);
  const customQrUrl = tenant?.vietqrConfig?.customQrUrl;
  const [mode, setMode] = useState<'custom' | 'dynamic'>(customQrUrl ? 'custom' : 'dynamic');

  useEffect(() => {
    if (customQrUrl) {
      setMode('custom');
    } else {
      setMode('dynamic');
    }
  }, [customQrUrl, isOpen]);

  if (!isOpen) return null;

  const bankId = tenant?.vietqrConfig?.bankId || '970422';
  const bankName = tenant?.vietqrConfig?.bankName || 'MBBank (Ngân Hàng Quân Đội)';
  const accountNo = tenant?.vietqrConfig?.accountNo || '0988888888';
  const accountName = tenant?.vietqrConfig?.accountName || 'NGUYEN THI HOA';
  const addInfo = `HD ${orderCode}`;

  const qrImageUrl = `https://img.vietqr.io/image/${bankId}-${accountNo}-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(
    addInfo
  )}&accountName=${encodeURIComponent(accountName)}`;

  const currentQrImage = mode === 'custom' && customQrUrl ? customQrUrl : qrImageUrl;

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(accountNo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md liquid-glass-card rounded-3xl p-6 border border-[#FF5500]/30 shadow-[0_10px_50px_rgba(255,85,0,0.2)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FF5500]/15 border border-[#FF5500]/40 flex items-center justify-center text-[#FF5500]">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">Thanh Toán VietQR 24/7</h3>
              <p className="text-xs text-white/50 font-mono">Đơn hàng: #{orderCode}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-white/70 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Amount display */}
        <div className="text-center py-3 px-4 rounded-2xl bg-gradient-to-r from-[#FF5500]/15 via-[#FF5500]/5 to-transparent border border-[#FF5500]/25 mb-3">
          <span className="text-xs text-white/60 font-medium">Số tiền cần thanh toán</span>
          <div className="text-2xl sm:text-3xl font-black text-[#FF5500] font-mono tracking-tight">
            {amount.toLocaleString('vi-VN')} <span className="text-base font-normal">đ</span>
          </div>
        </div>

        {/* Tab selector if custom QR is available */}
        {customQrUrl && (
          <div className="flex rounded-xl bg-white/5 border border-white/10 p-1 mb-3 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setMode('custom')}
              className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                mode === 'custom'
                  ? 'bg-[#FF5500] text-black font-bold shadow-[0_2px_10px_rgba(255,85,0,0.3)]'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Ảnh QR Cửa Hàng</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('dynamic')}
              className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                mode === 'dynamic'
                  ? 'bg-[#FF5500] text-black font-bold shadow-[0_2px_10px_rgba(255,85,0,0.3)]'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>VietQR Tự Động</span>
            </button>
          </div>
        )}

        {/* QR Code Frame */}
        <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white shadow-inner mb-4 min-h-[220px]">
          <img
            src={currentQrImage}
            alt={mode === 'custom' ? 'Mã QR Cửa Hàng' : 'Mã VietQR'}
            className="max-h-60 max-w-[240px] w-auto h-auto object-contain rounded-lg transition-transform duration-200"
          />
          <span className="text-[11px] text-neutral-600 font-medium mt-2 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            {mode === 'custom'
              ? 'Quét bằng bất kỳ App Ngân Hàng hoặc Ví điện tử'
              : 'Quét bằng bất kỳ App Ngân Hàng hoặc MoMo'}
          </span>
        </div>

        {/* Bank info box */}
        <div className="rounded-xl p-3 bg-white/5 border border-white/10 text-xs flex flex-col gap-1.5 mb-5 font-mono">
          <div className="flex justify-between text-white/60">
            <span>Ngân hàng:</span>
            <span className="text-white font-semibold">{bankName}</span>
          </div>
          <div className="flex justify-between items-center text-white/60">
            <span>Số tài khoản:</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[#FF5500] font-bold text-sm tracking-wider">{accountNo}</span>
              <button
                onClick={handleCopyAccount}
                className="p-1 rounded bg-white/10 hover:bg-white/20 text-white/80"
                title="Sao chép STK"
              >
                <Copy className="w-3 h-3" />
              </button>
              {copied && <span className="text-[10px] text-emerald-400">Đã chép!</span>}
            </div>
          </div>
          <div className="flex justify-between text-white/60">
            <span>Chủ tài khoản:</span>
            <span className="text-white uppercase font-semibold">{accountName}</span>
          </div>
          <div className="flex justify-between text-white/60">
            <span>Nội dung CK:</span>
            <span className="text-white font-semibold text-[#E5A823]">{addInfo}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2.5">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl border border-white/15 text-white/70 hover:text-white hover:bg-white/5 font-semibold text-xs transition-all"
          >
            Hủy Bỏ
          </button>
          <button
            onClick={onConfirmPayment}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-black font-bold text-xs flex items-center justify-center gap-1.5 shadow-[0_4px_20px_rgba(16,185,129,0.35)] transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Đã Nhận Tiền</span>
          </button>
        </div>
      </div>
    </div>
  );
};
