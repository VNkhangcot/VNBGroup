import React, { useState, useEffect, useRef } from 'react';
import {
  Settings,
  Store,
  QrCode,
  Layers,
  Check,
  ToggleLeft,
  ToggleRight,
  Shield,
  Sparkles,
  Upload,
  Trash2,
  Image as ImageIcon,
} from 'lucide-react';
import { useModuleStore } from '../../store/moduleStore';

export const SettingsScreen: React.FC = () => {
  const { tenant, updateTenant, setMode, toggleModule } = useModuleStore();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [receiptFooterNote, setReceiptFooterNote] = useState('');

  // VietQR configs
  const [bankId, setBankId] = useState('970422');
  const [bankName, setBankName] = useState('MBBank (Quân Đội)');
  const [accountNo, setAccountNo] = useState('');
  const [accountName, setAccountName] = useState('');
  const [customQrUrl, setCustomQrUrl] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (tenant) {
      setName(tenant.name || '');
      setPhone(tenant.phone || '');
      setAddress(tenant.address || '');
      setReceiptFooterNote(tenant.receiptFooterNote || '');
      setBankId(tenant.vietqrConfig?.bankId || '970422');
      setBankName(tenant.vietqrConfig?.bankName || 'MBBank');
      setAccountNo(tenant.vietqrConfig?.accountNo || '');
      setAccountName(tenant.vietqrConfig?.accountName || '');
      setCustomQrUrl(tenant.vietqrConfig?.customQrUrl || '');
    }
  }, [tenant]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Vui lòng chọn đúng định dạng hình ảnh (.png, .jpg, .jpeg, .webp)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Kích thước ảnh tối đa là 5MB. Vui lòng chọn ảnh nhỏ hơn.');
      return;
    }

    setUploadError('');
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setCustomQrUrl(result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setCustomQrUrl('');
    setUploadError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateTenant({
      name,
      phone,
      address,
      receiptFooterNote,
      vietqrConfig: {
        bankId,
        bankName,
        accountNo,
        accountName,
        customQrUrl,
      },
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const availableModules = [
    { key: 'pos', name: 'Bán Hàng POS 1-Chạm', desc: 'Bắt buộc cho mọi cửa hàng' },
    { key: 'products', name: 'Danh Mục Sản Phẩm', desc: 'Quản lý giá, barcode, tồn kho' },
    { key: 'debts', name: 'Sổ Ghi Nợ Khách Quen', desc: 'Cực kỳ hữu ích cho tiệm tạp hóa' },
    { key: 'inventory', name: 'Nhập Hàng & Kiểm Kho', desc: 'Phiếu nhập kho, cảnh báo hết date' },
    { key: 'analytics', name: 'Báo Cáo Doanh Thu', desc: 'Lợi nhuận, tiền trong két' },
    { key: 'crm', name: 'Khách Hàng VIP & Điểm Thưởng', desc: 'Dành cho doanh nghiệp vừa' },
    { key: 'multiBranch', name: 'Quản Lý Đa Chi Nhánh', desc: 'Doanh nghiệp chuỗi' },
  ];

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-6 pb-24 md:pb-6 overflow-y-auto bg-[#07070A]">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-[#FF5500]" />
          <span>Cấu Hình Hệ Thống & Module Linh Hoạt</span>
        </h2>
        <p className="text-xs text-white/50 font-mono mt-1">
          Chuyển đổi quy mô từ tiệm tạp hóa gia đình đến doanh nghiệp vừa và nhỏ chỉ với 1 cú click
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl">
        {/* COL 1 & 2: Store Info & Mode Switcher */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Business Mode Selector */}
          <div className="liquid-glass-card rounded-3xl p-5 border border-white/10 shadow-2xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2 font-mono">
              <Sparkles className="w-4 h-4 text-[#E5A823]" />
              <span>Chế Độ Hoạt Động Của Hệ Thống</span>
            </h3>
            <p className="text-xs text-white/50 mb-4">
              Hệ thống tự động tinh gọn hoặc mở rộng giao diện phù hợp với trình độ sử dụng và quy mô:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Option 1: Grocery Lite */}
              <div
                onClick={() => setMode('grocery_lite')}
                className={`rounded-2xl p-4 border transition-all cursor-pointer flex flex-col justify-between ${
                  tenant?.mode === 'grocery_lite'
                    ? 'bg-[#FF5500]/15 border-[#FF5500] shadow-[0_0_20px_rgba(255,85,0,0.3)]'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-xs text-white">Tạp Hóa / Cửa Hàng Nhỏ</span>
                    {tenant?.mode === 'grocery_lite' && (
                      <Check className="w-4 h-4 text-[#FF5500]" />
                    )}
                  </div>
                  <p className="text-[11px] text-white/50 leading-relaxed">
                    Siêu tối giản. Phím bấm to, bán hàng 1-chạm, sổ ghi nợ khách quen. Cô bán tạp hóa dùng ngay không cần học.
                  </p>
                </div>
                <span className="text-[10px] font-mono text-[#FF5500] font-bold mt-3 block">
                  Chế độ Khuyên dùng
                </span>
              </div>

              {/* Option 2: Retail Standard */}
              <div
                onClick={() => setMode('retail_standard')}
                className={`rounded-2xl p-4 border transition-all cursor-pointer flex flex-col justify-between ${
                  tenant?.mode === 'retail_standard'
                    ? 'bg-emerald-500/15 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-xs text-white">Bán Lẻ Tiêu Chuẩn</span>
                    {tenant?.mode === 'retail_standard' && (
                      <Check className="w-4 h-4 text-emerald-400" />
                    )}
                  </div>
                  <p className="text-[11px] text-white/50 leading-relaxed">
                    Đầy đủ POS, quản lý tồn kho, phiếu nhập hàng, cảnh báo hết hạn dùng cho mini mart, shop thời trang.
                  </p>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold mt-3 block">
                  Tiêu chuẩn bán lẻ
                </span>
              </div>

              {/* Option 3: SME Pro */}
              <div
                onClick={() => setMode('sme_pro')}
                className={`rounded-2xl p-4 border transition-all cursor-pointer flex flex-col justify-between ${
                  tenant?.mode === 'sme_pro'
                    ? 'bg-[#E5A823]/15 border-[#E5A823] shadow-[0_0_20px_rgba(229,168,35,0.3)]'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-xs text-white">Doanh Nghiệp Vừa & Nhỏ</span>
                    {tenant?.mode === 'sme_pro' && (
                      <Check className="w-4 h-4 text-[#E5A823]" />
                    )}
                  </div>
                  <p className="text-[11px] text-white/50 leading-relaxed">
                    Mở khóa tất cả tính năng: Khách VIP, chương trình điểm thưởng, phân quyền nhân sự, và đa chi nhánh.
                  </p>
                </div>
                <span className="text-[10px] font-mono text-[#E5A823] font-bold mt-3 block">
                  Doanh nghiệp Pro
                </span>
              </div>
            </div>
          </div>

          {/* Module Switcher List */}
          <div className="liquid-glass-card rounded-3xl p-5 border border-white/10 shadow-2xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2 font-mono">
              <Layers className="w-4 h-4 text-[#FF5500]" />
              <span>Bật / Tắt Từng Module Riêng Biệt</span>
            </h3>
            <p className="text-xs text-white/50 mb-4">
              Bạn có thể tự do bật thêm hoặc tắt bớt chức năng bất kỳ lúc nào để menu luôn gọn gàng:
            </p>

            <div className="flex flex-col divide-y divide-white/5">
              {availableModules.map((m) => {
                const isActive = tenant?.activeModules.includes(m.key);
                return (
                  <div
                    key={m.key}
                    onClick={() => m.key !== 'pos' && toggleModule(m.key)}
                    className={`py-3 flex items-center justify-between gap-3 ${
                      m.key === 'pos' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-white/[0.02]'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <span>{m.name}</span>
                        {m.key === 'pos' && (
                          <span className="text-[9px] font-mono text-white/40 uppercase bg-white/10 px-1.5 py-0.5 rounded">
                            Bắt buộc
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-white/40">{m.desc}</span>
                    </div>

                    <div className="shrink-0">
                      {isActive ? (
                        <div className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          <span>Đang Bật</span>
                        </div>
                      ) : (
                        <div className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/40 text-[10px] font-mono">
                          <span>Đã Tắt</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* COL 3: Store Details & VietQR Settings Form */}
        <div className="flex flex-col gap-6">
          <form
            onSubmit={handleSaveSettings}
            className="liquid-glass-card rounded-3xl p-5 border border-white/10 shadow-2xl flex flex-col gap-4 text-xs"
          >
            <h3 className="text-sm font-bold text-white uppercase tracking-wider pb-2 border-b border-white/10 flex items-center gap-2 font-mono">
              <Store className="w-4 h-4 text-[#FF5500]" />
              <span>Thông Tin Cửa Hàng</span>
            </h3>

            <div className="flex flex-col gap-1">
              <label className="text-white/70 font-semibold">Tên Tiệm / Doanh Nghiệp *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="px-3 py-2 rounded-xl liquid-glass-input text-white text-xs"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-white/70 font-semibold">Số điện thoại hotline</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="px-3 py-2 rounded-xl liquid-glass-input text-white text-xs font-mono"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-white/70 font-semibold">Địa chỉ cửa hàng</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="px-3 py-2 rounded-xl liquid-glass-input text-white text-xs"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-white/70 font-semibold">Lời chúc in dưới hóa đơn</label>
              <input
                type="text"
                value={receiptFooterNote}
                onChange={(e) => setReceiptFooterNote(e.target.value)}
                className="px-3 py-2 rounded-xl liquid-glass-input text-white text-xs italic"
              />
            </div>

            {/* VietQR Bank Info */}
            <h3 className="text-sm font-bold text-white uppercase tracking-wider pt-3 pb-2 border-b border-white/10 flex items-center gap-2 font-mono mt-2">
              <QrCode className="w-4 h-4 text-emerald-400" />
              <span>Tài Khoản Nhận Tiền & Mã QR</span>
            </h3>

            {/* Custom QR Image Upload Section */}
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <label className="text-white/80 font-semibold text-xs flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-[#FF5500]" />
                  <span>Ảnh Mã QR Thanh Toán (Tùy chọn)</span>
                </label>
                {customQrUrl && (
                  <span className="text-[10px] text-emerald-400 font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    Đã tải ảnh lên
                  </span>
                )}
              </div>
              <p className="text-[11px] text-white/50 leading-relaxed">
                Tải lên ảnh mã QR nhận tiền của bạn (VietQR, MoMo, ZaloPay, v.v.). Khi thanh toán qua QR ở POS, mã này sẽ được hiển thị cho khách quét.
              </p>

              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              {customQrUrl ? (
                <div className="flex items-center gap-3 pt-1">
                  <div className="w-28 h-28 rounded-xl bg-white p-1.5 border border-white/20 shadow-md flex items-center justify-center overflow-hidden shrink-0">
                    <img
                      src={customQrUrl}
                      alt="Ảnh QR tài khoản"
                      className="w-full h-full object-contain rounded-lg"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5 text-[#FF5500]" />
                      <span>Đổi ảnh QR khác</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="px-3 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 text-xs font-medium flex items-center gap-1.5 transition-colors border border-rose-500/20 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Xóa ảnh QR</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-4 border-2 border-dashed border-white/20 hover:border-[#FF5500]/60 rounded-xl bg-white/[0.02] hover:bg-[#FF5500]/5 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all group"
                >
                  <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-[#FF5500]/20 flex items-center justify-center text-white/60 group-hover:text-[#FF5500] transition-colors">
                    <Upload className="w-4 h-4" />
                  </div>
                  <span className="text-xs text-white/80 font-medium group-hover:text-white">
                    Nhấp để tải lên ảnh mã QR
                  </span>
                  <span className="text-[10px] text-white/40">
                    PNG, JPG, WEBP (tối đa 5MB)
                  </span>
                </div>
              )}

              {uploadError && (
                <p className="text-[11px] text-rose-400 font-medium">{uploadError}</p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-white/70 font-semibold">Tên ngân hàng</label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="VD: MBBank, Vietcombank, Techcombank..."
                className="px-3 py-2 rounded-xl liquid-glass-input text-white text-xs"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-white/70 font-semibold">Số tài khoản ngân hàng</label>
              <input
                type="text"
                value={accountNo}
                onChange={(e) => setAccountNo(e.target.value)}
                placeholder="VD: 0988888888"
                className="px-3 py-2 rounded-xl liquid-glass-input text-[#FF5500] font-bold text-xs font-mono"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-white/70 font-semibold">Tên chủ tài khoản</label>
              <input
                type="text"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value.toUpperCase())}
                placeholder="VD: NGUYEN THI HOA"
                className="px-3 py-2 rounded-xl liquid-glass-input text-white font-bold text-xs uppercase"
              />
            </div>

            <button
              type="submit"
              className="mt-3 w-full py-3 rounded-xl bg-[#FF5500] hover:bg-[#FF6611] text-black font-bold flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(255,85,0,0.3)] transition-all cursor-pointer"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-black" />
                  <span>Đã Lưu Cài Đặt Thành Công!</span>
                </>
              ) : (
                <span>Lưu Tất Cả Cài Đặt</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
