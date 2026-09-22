import React, { useState } from 'react';
import {
  Lock,
  User as UserIcon,
  ShieldCheck,
  Eye,
  EyeOff,
  ArrowRight,
  Zap,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export const AuthScreen: React.FC = () => {
  // Form states - Login
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { login, isLoading, error, clearError } = useAuthStore();

  const handleStandardLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    await login(identifier, password);
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
            Từ tiệm tạp hóa gia đình nhỏ cho đến chuỗi bán lẻ doanh nghiệp. Đăng nhập bảo mật với
            mật khẩu mã hóa Bcrypt và chuẩn xác thực tài khoản đa cấp.
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
                <h4 className="text-xs font-bold text-white">Tối Ưu Vận Hành Bán Lẻ</h4>
                <p className="text-[11px] text-white/50 mt-0.5">Giao diện trực quan, tốc độ xử lý tức thì.</p>
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
          {/* Error Message Toast */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2.5 text-red-400 text-xs animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* STANDARD USERNAME & PASSWORD LOGIN */}
          <div>
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white">Đăng Nhập Quản Trị</h3>
              <p className="text-xs text-white/50 mt-1">
                Đăng nhập với tài khoản Super Admin hoặc Quản lý hệ thống
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
                    placeholder="Nhập tên đăng nhập hoặc email..."
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
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
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
          </div>

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
