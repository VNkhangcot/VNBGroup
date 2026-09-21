import React, { useState, useEffect } from 'react';
import {
  Lock,
  User as UserIcon,
  Store,
  Phone,
  KeyRound,
  ShieldCheck,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  Zap,
  CheckCircle2,
  AlertCircle,
  Hash,
  Delete,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { api } from '../../api/client';
import { StaffMember } from '../../types';

export const AuthScreen: React.FC = () => {
  const [tab, setTab] = useState<'login' | 'pin' | 'register'>('login');

  // Form states - Login
  const [identifier, setIdentifier] = useState('admin');
  const [password, setPassword] = useState('vnb123');
  const [showPassword, setShowPassword] = useState(false);

  // Form states - Register
  const [storeName, setStoreName] = useState('');
  const [storePhone, setStorePhone] = useState('');
  const [regFullName, setRegFullName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPin, setRegPin] = useState('8888');

  // Form states - PIN Switcher
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [pinDigits, setPinDigits] = useState<string>('');

  const { login, register, pinLogin, isLoading, error, clearError } = useAuthStore();

  // Load staff list for PIN tab
  useEffect(() => {
    api
      .getStaffList()
      .then((list) => {
        setStaffList(list);
        if (list.length > 0) {
          // Select cashier by default if available
          const cashier = list.find((s) => s.role === 'cashier') || list[0];
          setSelectedStaff(cashier);
        }
      })
      .catch((err) => console.error('Failed to load staff list:', err));
  }, []);

  const handleStandardLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    await login(identifier, password);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    if (!storeName || !regFullName || !regUsername || !regPassword) {
      alert('Vui lòng điền đầy đủ các thông tin bắt buộc');
      return;
    }
    await register({
      storeName,
      storePhone,
      fullName: regFullName,
      username: regUsername,
      password: regPassword,
      pinCode: regPin,
    });
  };

  // Numpad input for PIN
  const handlePinPress = (val: string) => {
    if (pinDigits.length < 4) {
      const next = pinDigits + val;
      setPinDigits(next);
      if (next.length === 4 && selectedStaff) {
        // Auto submit when 4 digits reached
        pinLogin(selectedStaff.id, next).then((success) => {
          if (!success) {
            setPinDigits('');
          }
        });
      }
    }
  };

  const handlePinClear = () => {
    setPinDigits('');
  };

  const handlePinBackspace = () => {
    setPinDigits((prev) => prev.slice(0, -1));
  };

  // Quick Demo Logins
  const handleDemoSuperAdmin = () => {
    setIdentifier('superadmin');
    setPassword('vnb123');
    login('superadmin', 'vnb123');
  };

  const handleDemoOwner = () => {
    setIdentifier('admin');
    setPassword('vnb123');
    login('admin', 'vnb123');
  };

  const handleDemoCashier = () => {
    setIdentifier('cohoa');
    setPassword('vnb123');
    login('cohoa', 'vnb123');
  };

  return (
    <div className="min-h-screen w-full bg-[#07070A] text-white flex flex-col lg:flex-row relative overflow-hidden font-sans selection:bg-[#FF5500]/30 selection:text-[#FF5500]">
      {/* Background ambient light effects */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#FF5500]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#E5A823]/10 rounded-full blur-3xl pointer-events-none" />

      {/* LEFT COLUMN: BRAND HERO SHOWCASE (Desktop only) */}
      <div className="hidden lg:flex lg:w-[48%] p-8 sm:p-12 lg:p-16 flex-col justify-between relative border-r border-white/10 z-10 bg-gradient-to-b from-[#0A0A0E] to-[#07070A]">
        <div>
          {/* VNB Monogram Brand Header */}
          <div className="flex items-center gap-3.5 mb-10">
            <img
              src="/vnb-emblem.svg"
              alt="VNB Emblem"
              className="w-11 h-11 rounded-2xl shadow-[0_0_20px_rgba(255,85,0,0.2)] object-contain shrink-0"
            />
            <div>
              <div className="text-lg font-black tracking-wider uppercase font-mono bg-gradient-to-r from-white via-white/90 to-[#E5A823] bg-clip-text text-transparent">
                VNB Business OS
              </div>
              <div className="text-[10px] text-white/50 tracking-widest uppercase font-mono">
                Enterprise & POS Suite // 2026
              </div>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#E5A823] mb-6">
            <Sparkles className="w-3.5 h-3.5 text-[#FF5500]" />
            <span>Hệ Thống Xác Thực & Phân Quyền Bảo Mật Đa Cấp</span>
          </div>

          <h1 className="text-3xl sm:text-4xl xl:text-5xl font-black leading-tight tracking-tight mb-4">
            Quản trị thông minh,{' '}
            <span className="bg-gradient-to-r from-[#FF5500] via-[#FFAA00] to-[#E5A823] bg-clip-text text-transparent">
              bán lẻ 1-chạm
            </span>{' '}
            cho mọi quy mô.
          </h1>

          <p className="text-sm sm:text-base text-white/60 leading-relaxed max-w-lg mb-8">
            Từ tiệm tạp hóa gia đình nhỏ cho đến chuỗi bán lẻ doanh nghiệp. Đăng nhập linh hoạt với
            mật khẩu mã hóa Bcrypt hoặc mở ca trực nhanh 1 giây bằng mã PIN cảm ứng.
          </p>

          {/* Value props badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg">
            <div className="liquid-glass rounded-2xl p-3.5 border border-white/10 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Bảo Mật JWT 7 Ngày</h4>
                <p className="text-[11px] text-white/50 mt-0.5">Không lo bị ngắt phiên giữa giờ cao điểm bán hàng.</p>
              </div>
            </div>

            <div className="liquid-glass rounded-2xl p-3.5 border border-white/10 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#FF5500]/10 border border-[#FF5500]/30 flex items-center justify-center text-[#FF5500] shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Chuyển Ca Siêu Tốc (PIN)</h4>
                <p className="text-[11px] text-white/50 mt-0.5">Mã PIN 4 số thuận tiện cho cô chú thu ngân.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-white/40 font-mono">
          <span>VNB Technologies © 2026</span>
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Máy Chủ Trực Tuyến
          </span>
        </div>
      </div>

      {/* RIGHT COLUMN: INTERACTIVE AUTH TABS & FORMS (Mobile First & Centered) */}
      <div className="w-full lg:w-[52%] min-h-screen p-5 sm:p-8 lg:p-14 flex flex-col justify-center relative z-10 overflow-y-auto">
        <div className="max-w-md w-full mx-auto my-auto">
          {/* Mobile-Only Compact Brand Header */}
          <div className="flex flex-col items-center text-center mb-6 lg:hidden">
            <div className="relative mb-2.5">
              <div className="absolute inset-0 bg-[#FF5500]/25 rounded-2xl blur-xl" />
              <img
                src="/vnb-emblem.svg"
                alt="VNB Emblem"
                className="w-13 h-13 rounded-2xl shadow-[0_0_20px_rgba(255,85,0,0.35)] object-contain relative z-10 border border-white/10"
              />
            </div>
            <h1 className="text-xl font-black tracking-wider uppercase font-mono bg-gradient-to-r from-white via-white/90 to-[#E5A823] bg-clip-text text-transparent">
              VNB Business OS
            </h1>
            <p className="text-[11px] text-white/50 font-mono mt-0.5">
              Quản Trị Doanh Nghiệp & Bán Lẻ 1-Chạm
            </p>
          </div>
          {/* Tab Switcher Pills */}
          <div className="liquid-glass rounded-2xl p-1.5 border border-white/10 flex mb-6">
            <button
              onClick={() => {
                setTab('login');
                clearError();
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                tab === 'login'
                  ? 'bg-gradient-to-r from-[#FF5500] to-[#E5A823] text-black shadow-lg'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Đăng Nhập</span>
            </button>

            <button
              onClick={() => {
                setTab('pin');
                clearError();
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                tab === 'pin'
                  ? 'bg-gradient-to-r from-[#FF5500] to-[#E5A823] text-black shadow-lg'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Đổi Ca (PIN)</span>
            </button>

            <button
              onClick={() => {
                setTab('register');
                clearError();
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                tab === 'register'
                  ? 'bg-gradient-to-r from-[#FF5500] to-[#E5A823] text-black shadow-lg'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Mở Cửa Hàng</span>
            </button>
          </div>

          {/* Error Message Toast */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2.5 text-red-400 text-xs animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 1: STANDARD USERNAME & PASSWORD LOGIN */}
          {/* ========================================================================= */}
          {tab === 'login' && (
            <div>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white">Đăng Nhập Doanh Nghiệp</h3>
                <p className="text-xs text-white/50 mt-1">
                  Dành cho Chủ tiệm và Quản lý để truy cập đầy đủ báo cáo & quản trị
                </p>
              </div>

              <form onSubmit={handleStandardLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-white/70 uppercase tracking-wider mb-1.5">
                    Tên Đăng Nhập / Email
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="admin hoặc email..."
                      className="w-full pl-10 pr-4 py-3 rounded-xl liquid-glass-input text-sm text-white placeholder-white/30 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-white/70 uppercase tracking-wider mb-1.5">
                    Mật Khẩu
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Nhập mật khẩu..."
                      className="w-full pl-10 pr-11 py-3 rounded-xl liquid-glass-input text-sm text-white placeholder-white/30 font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-white/60">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded border-white/20 bg-white/5 text-[#FF5500] focus:ring-0"
                    />
                    <span>Ghi nhớ phiên đăng nhập</span>
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      alert('Vui lòng liên hệ Admin VNB Group hoặc đăng nhập bằng tài khoản mẫu bên dưới!')
                    }
                    className="text-[#FF5500] hover:underline"
                  >
                    Quên mật khẩu?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FF5500] to-[#E5A823] hover:from-[#FF6611] hover:to-[#F5C042] text-black font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_4px_25px_rgba(255,85,0,0.35)] cursor-pointer transition-all active:scale-[0.98]"
                >
                  {isLoading ? (
                    <span>Đang xác thực...</span>
                  ) : (
                    <>
                      <span>Đăng Nhập Vào Hệ Thống</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* DEMO 1-CLICK ACCESS BUTTONS */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <div className="text-[11px] font-mono text-white/50 uppercase tracking-wider mb-3 text-center">
                  ⚡ Kiểm thử nhanh với tài khoản Demo 1-Chạm:
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={handleDemoSuperAdmin}
                    className="p-2 sm:p-2.5 rounded-xl liquid-glass border border-purple-500/40 hover:border-purple-400 bg-purple-950/20 text-center sm:text-left cursor-pointer transition-all group active:scale-95"
                  >
                    <div className="flex flex-col sm:flex-row items-center sm:gap-1.5 mb-0.5">
                      <span className="text-base">🏛️</span>
                      <span className="text-[11px] sm:text-xs font-bold text-white group-hover:text-purple-300 truncate">
                        Admin HQ
                      </span>
                    </div>
                    <div className="text-[9px] sm:text-[10px] text-white/40 font-mono truncate">superadmin</div>
                  </button>

                  <button
                    type="button"
                    onClick={handleDemoOwner}
                    className="p-2 sm:p-2.5 rounded-xl liquid-glass border border-[#E5A823]/40 hover:border-[#E5A823] text-center sm:text-left cursor-pointer transition-all group active:scale-95"
                  >
                    <div className="flex flex-col sm:flex-row items-center sm:gap-1.5 mb-0.5">
                      <span className="text-base">👑</span>
                      <span className="text-[11px] sm:text-xs font-bold text-white group-hover:text-[#E5A823] truncate">
                        Chủ Tiệm
                      </span>
                    </div>
                    <div className="text-[9px] sm:text-[10px] text-white/40 font-mono truncate">admin</div>
                  </button>

                  <button
                    type="button"
                    onClick={handleDemoCashier}
                    className="p-2 sm:p-2.5 rounded-xl liquid-glass border border-emerald-500/40 hover:border-emerald-500 text-center sm:text-left cursor-pointer transition-all group active:scale-95"
                  >
                    <div className="flex flex-col sm:flex-row items-center sm:gap-1.5 mb-0.5">
                      <span className="text-base">💼</span>
                      <span className="text-[11px] sm:text-xs font-bold text-white group-hover:text-emerald-400 truncate">
                        Thu Ngân
                      </span>
                    </div>
                    <div className="text-[9px] sm:text-[10px] text-white/40 font-mono truncate">cohoa</div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: RAPID POS CASHIER SWITCH (4-DIGIT PIN PAD) */}
          {/* ========================================================================= */}
          {tab === 'pin' && (
            <div className="flex flex-col items-center">
              <div className="text-center mb-5">
                <h3 className="text-xl font-bold text-white">Chuyển Ca Thu Ngân Siêu Tốc</h3>
                <p className="text-xs text-white/50 mt-1">
                  Chọn nhân viên ca trực và nhập mã PIN 4 số
                </p>
              </div>

              {/* Staff Avatar Carousel / Selector */}
              <div className="flex items-center gap-2.5 mb-5 overflow-x-auto max-w-full pb-1">
                {staffList.map((staff) => {
                  const isSelected = selectedStaff?.id === staff.id;
                  return (
                    <button
                      key={staff.id}
                      type="button"
                      onClick={() => {
                        setSelectedStaff(staff);
                        setPinDigits('');
                        clearError();
                      }}
                      className={`px-3 py-2 rounded-2xl border transition-all flex items-center gap-2 cursor-pointer ${
                        isSelected
                          ? 'bg-[#FF5500]/20 border-[#FF5500] shadow-[0_0_15px_rgba(255,85,0,0.3)]'
                          : 'bg-white/5 border-white/10 hover:bg-white/10 text-white/70'
                      }`}
                    >
                      <span className="text-lg">{staff.avatar || '🧑‍💼'}</span>
                      <div className="text-left">
                        <div className="text-xs font-bold text-white line-clamp-1">{staff.fullName}</div>
                        <div className="text-[10px] text-white/40 uppercase font-mono">
                          {staff.role === 'superadmin' ? 'Admin Tổng' : staff.role === 'owner' ? 'Chủ tiệm' : 'Thu ngân'}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* PIN Code Dots Display (••••) */}
              <div className="flex items-center justify-center gap-3.5 mb-6">
                {[0, 1, 2, 3].map((idx) => {
                  const isFilled = pinDigits.length > idx;
                  return (
                    <div
                      key={idx}
                      className={`w-4 h-4 rounded-full transition-all duration-200 ${
                        isFilled
                          ? 'bg-[#FF5500] scale-125 shadow-[0_0_12px_#FF5500]'
                          : 'border-2 border-white/20 bg-white/5'
                      }`}
                    />
                  );
                })}
              </div>

              <div className="text-[11px] text-white/50 font-mono mb-4 text-center">
                Mẹo: Mã PIN mẫu Cô Hoa: <strong className="text-emerald-400">1234</strong> • Anh Nam: <strong className="text-emerald-400">5678</strong> • Chủ tiệm: <strong className="text-[#E5A823]">8888</strong> • Super Admin: <strong className="text-purple-400">9999</strong>
              </div>

              {/* Luxury Virtual Touch NumPad */}
              <div className="grid grid-cols-3 gap-2.5 w-full max-w-[280px]">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handlePinPress(num)}
                    className="h-14 rounded-2xl liquid-glass border border-white/10 hover:border-[#FF5500]/60 hover:bg-white/10 active:scale-95 transition-all text-xl font-mono font-black text-white flex items-center justify-center cursor-pointer shadow-md"
                  >
                    {num}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={handlePinClear}
                  className="h-14 rounded-2xl bg-white/5 hover:bg-white/10 active:scale-95 transition-all text-xs font-mono font-bold text-white/60 flex items-center justify-center cursor-pointer"
                >
                  Xóa Hết
                </button>

                <button
                  type="button"
                  onClick={() => handlePinPress('0')}
                  className="h-14 rounded-2xl liquid-glass border border-white/10 hover:border-[#FF5500]/60 hover:bg-white/10 active:scale-95 transition-all text-xl font-mono font-black text-white flex items-center justify-center cursor-pointer shadow-md"
                >
                  0
                </button>

                <button
                  type="button"
                  onClick={handlePinBackspace}
                  className="h-14 rounded-2xl bg-white/5 hover:bg-white/10 active:scale-95 transition-all text-xs font-mono font-bold text-white/60 flex items-center justify-center cursor-pointer"
                >
                  <Delete className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: REGISTER NEW STORE / TENANT */}
          {/* ========================================================================= */}
          {tab === 'register' && (
            <div>
              <div className="mb-5">
                <h3 className="text-xl font-bold text-white">Khởi Tạo Cửa Hàng Mới</h3>
                <p className="text-xs text-white/50 mt-1">
                  Đăng ký tài khoản Chủ tiệm & kích hoạt hệ thống bán hàng riêng biệt
                </p>
              </div>

              <form onSubmit={handleRegister} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-white/70 uppercase tracking-wider mb-1">
                      Tên Cửa Hàng / Tiệm *
                    </label>
                    <input
                      type="text"
                      required
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      placeholder="VD: Tạp Hóa An Lộc"
                      className="w-full px-3 py-2.5 rounded-xl liquid-glass-input text-xs text-white placeholder-white/30"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-white/70 uppercase tracking-wider mb-1">
                      Số Điện Thoại
                    </label>
                    <input
                      type="text"
                      value={storePhone}
                      onChange={(e) => setStorePhone(e.target.value)}
                      placeholder="0988 888 888"
                      className="w-full px-3 py-2.5 rounded-xl liquid-glass-input text-xs text-white placeholder-white/30 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-white/70 uppercase tracking-wider mb-1">
                    Họ Và Tên Chủ Tiệm *
                  </label>
                  <input
                    type="text"
                    required
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    placeholder="VD: Nguyễn Văn Hưng"
                    className="w-full px-3 py-2.5 rounded-xl liquid-glass-input text-xs text-white placeholder-white/30"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-white/70 uppercase tracking-wider mb-1">
                      Tên Đăng Nhập *
                    </label>
                    <input
                      type="text"
                      required
                      value={regUsername}
                      onChange={(e) => setRegUsername(e.target.value)}
                      placeholder="chutiem2026"
                      className="w-full px-3 py-2.5 rounded-xl liquid-glass-input text-xs text-white placeholder-white/30"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-white/70 uppercase tracking-wider mb-1">
                      Mật Khẩu *
                    </label>
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Tối thiểu 6 ký tự"
                      className="w-full px-3 py-2.5 rounded-xl liquid-glass-input text-xs text-white placeholder-white/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-white/70 uppercase tracking-wider mb-1">
                    Mã PIN Mở Ca Trực (4 số)
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    value={regPin}
                    onChange={(e) => setRegPin(e.target.value)}
                    placeholder="8888"
                    className="w-full px-3 py-2.5 rounded-xl liquid-glass-input text-xs text-[#E5A823] font-mono font-bold tracking-widest"
                  />
                  <span className="text-[10px] text-white/40 mt-0.5 block">
                    Dùng để đăng nhập nhanh tại quầy thu ngân không cần gõ mật khẩu dài.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FF5500] to-[#E5A823] hover:from-[#FF6611] hover:to-[#F5C042] text-black font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl cursor-pointer transition-all active:scale-[0.98] mt-2"
                >
                  {isLoading ? (
                    <span>Đang khởi tạo hệ thống...</span>
                  ) : (
                    <>
                      <span>Khởi Tạo Cửa Hàng & Bắt Đầu Bán Hàng</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Mobile Footer */}
          <div className="mt-8 pt-4 border-t border-white/10 flex lg:hidden items-center justify-between text-[11px] text-white/40 font-mono">
            <span>VNB Technologies © 2026</span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Máy Chủ Trực Tuyến
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
