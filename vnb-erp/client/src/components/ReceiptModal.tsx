import React from 'react';
import { Printer, Check, X, Store } from 'lucide-react';
import { Order, TenantConfig } from '../types';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  tenant: TenantConfig | null;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  isOpen,
  onClose,
  order,
  tenant,
}) => {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const storeName = tenant?.name || 'Tiệm Tạp Hóa Cô Hoa';
  const storePhone = tenant?.phone || '0988 888 888';
  const storeAddress = tenant?.address || '123 Đường Số 5, P. Tân Quy, Q. 7, TP. HCM';
  const footerNote = tenant?.receiptFooterNote || 'Cảm ơn Quý khách & Hẹn gặp lại!';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-sm liquid-glass-card rounded-3xl p-6 border border-white/20 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Controls */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 print:hidden">
          <span className="text-xs font-mono uppercase text-white/50 tracking-wider">Xem Lại Hóa Đơn</span>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Printable Receipt Paper Container */}
        <div
          id="printable-receipt"
          className="flex-1 overflow-y-auto p-4 bg-white text-black font-mono text-xs rounded-xl shadow-inner leading-relaxed"
        >
          {/* Header */}
          <div className="text-center pb-3 border-b border-dashed border-gray-400">
            <h2 className="font-bold text-sm uppercase tracking-wide">{storeName}</h2>
            <p className="text-[10px] text-gray-600 mt-0.5">{storeAddress}</p>
            <p className="text-[10px] text-gray-600">Hotline: {storePhone}</p>
            <h3 className="font-bold text-xs uppercase mt-2">HÓA ĐƠN BÁN LẺ</h3>
            <p className="text-[10px] text-gray-500">Mã đơn: #{order.orderCode}</p>
            <p className="text-[10px] text-gray-500">
              {new Date(order.createdAt).toLocaleString('vi-VN')}
            </p>
            <p className="text-[10px] text-gray-500">Thu ngân: {order.cashierName}</p>
            {order.customerName && order.customerName !== 'Khách lẻ' && (
              <p className="text-[10px] font-bold text-gray-800">Khách: {order.customerName}</p>
            )}
          </div>

          {/* Items List */}
          <div className="py-2.5 border-b border-dashed border-gray-400">
            <div className="flex justify-between font-bold text-[11px] pb-1">
              <span>Mặt hàng</span>
              <span>T.Tiền</span>
            </div>
            {order.items.map((item, idx) => (
              <div key={idx} className="py-1 border-b border-gray-100 last:border-none">
                <div className="font-semibold text-[11px]">{item.name}</div>
                <div className="flex justify-between text-[10px] text-gray-600">
                  <span>
                    {item.quantity} {item.unit} x {item.price.toLocaleString('vi-VN')}đ
                  </span>
                  <span className="font-bold text-gray-900">
                    {item.subtotal.toLocaleString('vi-VN')}đ
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="py-2.5 border-b border-dashed border-gray-400 flex flex-col gap-1">
            <div className="flex justify-between text-[11px]">
              <span>Tiền hàng:</span>
              <span>{order.subtotal.toLocaleString('vi-VN')}đ</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-[11px] text-red-600">
                <span>Giảm giá:</span>
                <span>-{order.discount.toLocaleString('vi-VN')}đ</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-sm pt-1 text-black">
              <span>TỔNG CỘNG:</span>
              <span>{order.totalAmount.toLocaleString('vi-VN')}đ</span>
            </div>
            <div className="flex justify-between text-[10px] text-gray-600 pt-1">
              <span>Hình thức:</span>
              <span className="font-semibold uppercase">
                {order.paymentMethod === 'cash'
                  ? 'Tiền mặt'
                  : order.paymentMethod === 'vietqr'
                  ? 'Chuyển khoản VietQR'
                  : 'Ghi nợ'}
              </span>
            </div>
            {order.paymentMethod === 'cash' && (
              <>
                <div className="flex justify-between text-[10px] text-gray-600">
                  <span>Khách đưa:</span>
                  <span>{order.cashGiven.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="flex justify-between text-[10px] text-gray-700 font-bold">
                  <span>Tiền thối:</span>
                  <span>{order.changeReturned.toLocaleString('vi-VN')}đ</span>
                </div>
              </>
            )}
          </div>

          {/* Footer note */}
          <div className="text-center pt-3 text-[10px] text-gray-500 italic">
            <p>{footerNote}</p>
            <p className="text-[8px] text-gray-400 mt-1">Powered by VNB Business OS</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2.5 pt-4 print:hidden">
          <button
            onClick={handlePrint}
            className="flex-1 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>In Hóa Đơn</span>
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl bg-[#FF5500] hover:bg-[#FF6611] text-black font-bold text-xs flex items-center justify-center gap-1.5 shadow-[0_4px_20px_rgba(255,85,0,0.3)] transition-all cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Hoàn Tất</span>
          </button>
        </div>
      </div>
    </div>
  );
};
