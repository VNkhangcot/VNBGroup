import React, { useEffect, useState, useRef } from 'react';
import { Camera, X, Search, Barcode } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';

interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (barcode: string) => void;
}

export const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({
  isOpen,
  onClose,
  onScanSuccess,
}) => {
  const [manualCode, setManualCode] = useState('');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const html5QrCode = new Html5Qrcode('barcode-reader-box');
    scannerRef.current = html5QrCode;

    const config = {
      fps: 10,
      qrbox: { width: 250, height: 180 },
    };

    html5QrCode
      .start(
        { facingMode: 'environment' },
        config,
        (decodedText) => {
          onScanSuccess(decodedText);
          handleClose();
        },
        () => {
          // ignore scan frame misses
        }
      )
      .catch((err) => {
        setCameraError('Không thể mở camera. Vui lòng nhập mã vạch bằng tay bên dưới.');
      });

    return () => {
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, [isOpen]);

  const handleClose = () => {
    if (scannerRef.current?.isScanning) {
      scannerRef.current.stop().catch(() => {});
    }
    onClose();
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.trim()) {
      onScanSuccess(manualCode.trim());
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-md liquid-glass-card rounded-3xl p-6 border border-white/20 shadow-2xl flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-[#FF5500]" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Quét Mã Vạch Bằng Camera
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Video Box */}
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black flex items-center justify-center border border-white/15">
          <div id="barcode-reader-box" className="w-full h-full" />
          {cameraError && (
            <div className="absolute inset-0 bg-black/90 p-4 flex flex-col items-center justify-center text-center text-xs text-amber-400">
              <Barcode className="w-8 h-8 mb-2 opacity-60" />
              <p>{cameraError}</p>
            </div>
          )}
        </div>

        {/* Manual Barcode Input Fallback */}
        <form onSubmit={handleManualSubmit} className="flex gap-2">
          <input
            type="text"
            placeholder="Hoặc gõ mã vạch vào đây (VD: 893456...)"
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            className="flex-1 px-3.5 py-2.5 rounded-xl liquid-glass-input text-xs text-white placeholder-white/40 font-mono"
            autoFocus
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-[#FF5500] hover:bg-[#FF6611] text-black font-bold text-xs flex items-center gap-1 shrink-0"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Tìm</span>
          </button>
        </form>
      </div>
    </div>
  );
};
