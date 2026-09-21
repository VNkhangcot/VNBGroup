import React, { useEffect, useState } from 'react';
import {
  ShoppingBag,
  Package,
  BookOpen,
  TrendingUp,
  Settings,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Store,
  Sparkles,
  QrCode,
  ShieldCheck,
  User,
  KeyRound,
  LogOut,
  Lock,
  Crown,
} from 'lucide-react';
import { useModuleStore } from '../store/moduleStore';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { PosScreen } from '../modules/pos/PosScreen';
import { ProductListScreen } from '../modules/products/ProductListScreen';
import { DebtBookScreen } from '../modules/debts/DebtBookScreen';
import { AnalyticsScreen } from '../modules/reports/AnalyticsScreen';
import { SettingsScreen } from '../modules/settings/SettingsScreen';
import { QuickPinModal } from '../components/QuickPinModal';

export type ActiveTab = 'pos' | 'products' | 'debts' | 'analytics' | 'settings';

interface PosLayoutProps {
  onSwitchToAdminView?: () => void;
}

export const PosLayout: React.FC<PosLayoutProps> = ({ onSwitchToAdminView }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('pos');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [quickPinOpen, setQuickPinOpen] = useState(false);

  const { tenant, loadTenant, isModuleActive } = useModuleStore();
  const { getItemCount, getTotalAmount } = useCartStore();
  const { user, logout, isOwner, canAccessSettings, canAccessAnalytics } = useAuthStore();

  useEffect(() => {
    loadTenant();
  }, []);

  const navItems: Array<{
    id: ActiveTab;
    label: string;
    sublabel?: string;
    icon: React.ElementType;
    moduleKey?: string;
    requiresOwnerOrManager?: boolean;
  }> = [
    { id: 'pos', label: 'Bán Hàng POS', sublabel: '1-Chạm siêu tốc', icon: ShoppingBag, moduleKey: 'pos' },
    { id: 'products', label: 'Hàng Hóa & Kho', sublabel: 'Mã vạch & Tồn kho', icon: Package, moduleKey: 'products' },
    { id: 'debts', label: 'Sổ Ghi Nợ', sublabel: 'Khách quen ghi nợ', icon: BookOpen, moduleKey: 'debts' },
    {
      id: 'analytics',
      label: 'Báo Cáo',
      sublabel: 'Doanh thu & Lợi nhuận',
      icon: TrendingUp,
      moduleKey: 'analytics',
      requiresOwnerOrManager: true,
    },
    {
      id: 'settings',
      label: 'Cài Đặt',
      sublabel: 'Module & VietQR',
      icon: Settings,
      requiresOwnerOrManager: true,
    },
  ];

  // Filter tabs by activeModules
  const visibleTabs = navItems.filter((item) => !item.moduleKey || isModuleActive(item.moduleKey));

  const handleTabSelect = (tab: (typeof navItems)[0]) => {
    if (tab.requiresOwnerOrManager && user?.role === 'cashier') {
      alert(`Phân hệ "${tab.label}" chỉ dành cho Chủ tiệm hoặc Quản lý ca trực!`);
      return;
    }
    setActiveTab(tab.id);
  };

  const storeName = tenant?.name || 'Tiệm Tạp Hóa Cô Hoa';
  const modeLabel =
    tenant?.mode === 'sme_pro'
      ? 'Doanh Nghiệp SME'
      : tenant?.mode === 'retail_standard'
      ? 'Bán Lẻ Chuẩn'
      : 'Tạp Hóa Thông Minh';

  const cartCount = getItemCount();
  const cartTotal = getTotalAmount();

  const roleLabel =
    user?.role === 'superadmin'
      ? 'Admin Tổng (HQ)'
      : user?.role === 'owner'
      ? 'Chủ Tiệm (Owner)'
      : user?.role === 'manager'
      ? 'Quản Lý (Manager)'
      : 'Thu Ngân (Cashier)';

  return (
    <div className="flex h-screen w-screen bg-[#07070A] text-white overflow-hidden select-none">
      {/* ========================================================= */}
      {/* 1. DESKTOP / TABLET LEFT SIDEBAR                          */}
      {/* ========================================================= */}
      <aside
        className={`hidden md:flex flex-col shrink-0 border-r border-white/10 bg-[#0C0C12]/95 backdrop-blur-2xl transition-all duration-300 relative z-30 ${
          sidebarCollapsed ? 'w-20' : 'w-64 xl:w-72'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            {/* Monogram Diamond Emblem */}
            <img
              src="/vnb-emblem.svg"
              alt="VNB"
              className="w-9 h-9 rounded-xl shadow-lg shrink-0 object-contain"
            />

            {!sidebarCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="font-extrabold text-sm text-white truncate leading-tight">
                  {storeName}
                </span>
                <span className="text-[10px] font-mono text-[#FF5500] font-semibold truncate flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500] animate-pulse shrink-0" />
                  {modeLabel}
                </span>
              </div>
            )}
          </div>

          {/* Collapse toggle button */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-white/50 hover:text-white transition-colors cursor-pointer shrink-0"
            title={sidebarCollapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Superadmin HQ Portal Switcher if applicable */}
        {user?.role === 'superadmin' && onSwitchToAdminView && (
          <div className="p-3 border-b border-white/10 bg-purple-950/20">
            <button
              onClick={onSwitchToAdminView}
              className={`w-full flex items-center rounded-2xl bg-gradient-to-r from-purple-900/50 to-indigo-900/50 border border-purple-500/40 hover:border-purple-400 text-purple-200 transition-all p-2.5 cursor-pointer shadow-lg group ${
                sidebarCollapsed ? 'justify-center' : 'gap-2.5'
              }`}
              title="Quay lại Cổng Admin Tổng VNB HQ"
            >
              <span className="text-lg group-hover:scale-110 transition-transform">🏛️</span>
              {!sidebarCollapsed && (
                <div className="text-left min-w-0">
                  <div className="text-xs font-black text-white flex items-center gap-1">
                    <span>Admin Tổng HQ</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-500/30 text-purple-300 font-mono">
                      PORTAL
                    </span>
                  </div>
                  <div className="text-[10px] text-purple-300/70 font-mono truncate">
                    Quản trị SaaS & Cửa Hàng
                  </div>
                </div>
              )}
            </button>
          </div>
        )}

        {/* Sidebar Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 scrollbar-none">
          {!sidebarCollapsed && (
            <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-widest text-white/40">
              Phân Hệ Cửa Hàng
            </div>
          )}

          {visibleTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const isRestricted = tab.requiresOwnerOrManager && user?.role === 'cashier';

            return (
              <button
                key={tab.id}
                onClick={() => handleTabSelect(tab)}
                title={sidebarCollapsed ? tab.label : undefined}
                className={`w-full flex items-center rounded-2xl transition-all duration-200 group relative cursor-pointer ${
                  sidebarCollapsed ? 'justify-center p-3' : 'px-3.5 py-3 gap-3'
                } ${
                  isActive
                    ? 'bg-gradient-to-r from-[#FF5500] to-[#E5A823] text-black font-bold shadow-[0_4px_20px_rgba(255,85,0,0.35)]'
                    : isRestricted
                    ? 'text-white/30 hover:text-white/50 hover:bg-white/5'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                {/* Active Glowing Indicator pill on the left */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-white rounded-r-full shadow-[0_0_8px_white]" />
                )}

                <div className="relative shrink-0">
                  <Icon
                    className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-black' : isRestricted ? 'text-white/30' : 'text-white/80'
                    }`}
                  />
                  {tab.id === 'pos' && cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 px-1.5 py-0.2 rounded-full bg-white text-black text-[9px] font-mono font-black shadow-md">
                      {cartCount}
                    </span>
                  )}
                </div>

                {!sidebarCollapsed && (
                  <div className="flex-1 flex items-center justify-between min-w-0 text-left">
                    <div className="min-w-0">
                      <div className="text-xs font-bold truncate leading-tight flex items-center gap-1.5">
                        <span>{tab.label}</span>
                        {isRestricted && <Lock className="w-3 h-3 text-white/30" />}
                      </div>
                      <div
                        className={`text-[10px] font-mono truncate mt-0.5 ${
                          isActive ? 'text-black/75 font-medium' : 'text-white/40'
                        }`}
                      >
                        {tab.sublabel}
                      </div>
                    </div>

                    {/* Cart counter badge if any */}
                    {tab.id === 'pos' && cartCount > 0 && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold shrink-0 ml-1 ${
                          isActive ? 'bg-black text-white' : 'bg-[#FF5500] text-black'
                        }`}
                      >
                        {cartCount} món
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer: USER PROFILE CARD & QUICK SHIFT SWITCHER */}
        <div className="p-3 border-t border-white/10 shrink-0 bg-black/40">
          {!sidebarCollapsed ? (
            <div className="rounded-2xl p-3 bg-white/5 border border-white/10 flex flex-col gap-2.5">
              {/* User Identity Info */}
              <div className="flex items-center justify-between gap-2 min-w-0">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-white/15 to-white/5 border border-white/15 flex items-center justify-center text-base shrink-0 shadow-sm">
                    {user?.avatar || (user?.role === 'owner' ? '👑' : '💼')}
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-white block truncate leading-tight">
                      {user?.fullName || 'Người Dùng'}
                    </span>
                    <span
                      className={`text-[9px] font-mono font-semibold uppercase tracking-wider px-1.5 py-0.2 rounded inline-block mt-0.5 ${
                        user?.role === 'superadmin'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : user?.role === 'owner'
                          ? 'bg-[#E5A823]/20 text-[#E5A823] border border-[#E5A823]/30'
                          : user?.role === 'manager'
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {roleLabel}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons (Đổi ca PIN & Đăng xuất) */}
              <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setQuickPinOpen(true)}
                  className="py-1.5 px-2 rounded-xl bg-white/10 hover:bg-white/15 text-[11px] font-medium text-white flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  title="Chuyển ca nhanh bằng mã PIN 4 số"
                >
                  <KeyRound className="w-3.5 h-3.5 text-[#FF5500]" />
                  <span>Đổi Ca</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?')) {
                      logout();
                    }
                  }}
                  className="py-1.5 px-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-[11px] font-medium text-red-400 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  title="Đăng xuất khỏi thiết bị"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Đăng Xuất</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={() => setQuickPinOpen(true)}
                title={`Đổi ca (${user?.fullName || 'Thu ngân'})`}
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-lg cursor-pointer transition-all"
              >
                {user?.avatar || (user?.role === 'owner' ? '👑' : '💼')}
              </button>

              <button
                type="button"
                onClick={() => {
                  if (confirm('Đăng xuất khỏi hệ thống?')) logout();
                }}
                title="Đăng xuất"
                className="p-2 rounded-xl text-white/40 hover:text-red-400 hover:bg-white/5 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ========================================================= */}
      {/* 2. MAIN CONTENT AREA + MOBILE CHROME                      */}
      {/* ========================================================= */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
        {/* Top Mobile Header Bar (Only visible on mobile screens < md) */}
        <header className="md:hidden h-14 px-4 bg-[#0A0A0E]/95 backdrop-blur-md border-b border-white/10 flex items-center justify-between gap-2 shrink-0 z-30">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white"
              aria-label="Mở menu quản lý"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex flex-col min-w-0">
              <span className="font-bold text-xs text-white truncate">{storeName}</span>
              <span className="text-[9px] font-mono text-[#FF5500] font-medium">{modeLabel}</span>
            </div>
          </div>

          {/* Quick Cashier Pill on Mobile (Tap to switch cashier) */}
          <button
            onClick={() => setQuickPinOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white text-[11px] font-mono shrink-0 cursor-pointer active:scale-95 transition-transform"
          >
            <span>{user?.avatar || (user?.role === 'owner' ? '👑' : '💼')}</span>
            <span className="truncate max-w-[80px]">{user?.fullName?.split(' - ')[0] || 'Thu ngân'}</span>
            <KeyRound className="w-3 h-3 text-[#FF5500]" />
          </button>
        </header>

        {/* Screen Viewport Content */}
        <main className="flex-1 flex flex-col overflow-hidden pb-16 md:pb-0 relative">
          {activeTab === 'pos' && <PosScreen />}
          {activeTab === 'products' && <ProductListScreen />}
          {activeTab === 'debts' && <DebtBookScreen />}
          {activeTab === 'analytics' && <AnalyticsScreen />}
          {activeTab === 'settings' && <SettingsScreen />}
        </main>

        {/* ========================================================= */}
        {/* 3. MOBILE BOTTOM FLOAT BAR (Floating Dock Navigation)     */}
        {/* ========================================================= */}
        <nav className="md:hidden fixed bottom-3 left-3 right-3 max-w-lg mx-auto z-40">
          <div className="bg-[#0C0C14]/90 backdrop-blur-2xl border border-white/15 rounded-2xl p-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.85)] ring-1 ring-white/10 grid grid-cols-5 gap-1 items-center">
            {visibleTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabSelect(tab)}
                  className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all relative cursor-pointer active:scale-95 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#FF5500] to-[#E5A823] text-black shadow-[0_4px_20px_rgba(255,85,0,0.4)]'
                      : 'text-white/50 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="relative">
                    <Icon className={`w-4 h-4 ${isActive ? 'scale-110' : ''}`} />
                    {tab.id === 'pos' && cartCount > 0 && (
                      <span
                        className={`absolute -top-1.5 -right-3 px-1.5 py-0.2 rounded-full text-[8px] font-mono font-black ${
                          isActive
                            ? 'bg-black text-[#FF5500]'
                            : 'bg-[#FF5500] text-black'
                        }`}
                      >
                        {cartCount}
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-[9px] tracking-tight mt-1 truncate max-w-[60px] ${
                      isActive ? 'font-black' : 'font-medium'
                    }`}
                  >
                    {tab.id === 'pos'
                      ? 'Bán Hàng'
                      : tab.id === 'products'
                      ? 'Hàng Hóa'
                      : tab.id === 'debts'
                      ? 'Sổ Nợ'
                      : tab.id === 'analytics'
                      ? 'Báo Cáo'
                      : 'Cài Đặt'}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* ========================================================= */}
        {/* 4. MOBILE SLIDE-OVER DRAWER (Off-canvas full menu)         */}
        {/* ========================================================= */}
        {mobileDrawerOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <div
              onClick={() => setMobileDrawerOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm animate-fadeIn"
            />

            {/* Slide-out Panel */}
            <div className="relative w-4/5 max-w-xs h-full bg-[#0E0E14] border-r border-white/15 p-5 flex flex-col justify-between shadow-2xl z-10 animate-slideInLeft">
              <div>
                {/* Header in Drawer */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <img
                      src="/vnb-emblem.svg"
                      alt="VNB"
                      className="w-8 h-8 rounded-xl shrink-0 object-contain shadow-md"
                    />
                    <div>
                      <h3 className="text-xs font-bold text-white">{storeName}</h3>
                      <p className="text-[10px] text-[#FF5500] font-mono">{modeLabel}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setMobileDrawerOpen(false)}
                    className="p-1.5 rounded-full bg-white/10 text-white/70 hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Superadmin Quick Access in Mobile Drawer */}
                {user?.role === 'superadmin' && onSwitchToAdminView && (
                  <button
                    onClick={() => {
                      setMobileDrawerOpen(false);
                      onSwitchToAdminView();
                    }}
                    className="w-full mb-3 p-3 rounded-2xl bg-gradient-to-r from-purple-900/60 to-indigo-900/60 border border-purple-500/40 text-purple-200 flex items-center justify-between shadow-lg cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">🏛️</span>
                      <div className="text-left">
                        <div className="text-xs font-bold text-white">Admin Tổng HQ</div>
                        <div className="text-[10px] text-purple-300 font-mono">Quản trị toàn hệ sinh thái</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-purple-400" />
                  </button>
                )}

                {/* Navigation Items in Drawer */}
                <div className="flex flex-col gap-1.5">
                  {visibleTabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          handleTabSelect(tab);
                          setMobileDrawerOpen(false);
                        }}
                        className={`w-full py-3 px-3.5 rounded-xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                          isActive
                            ? 'bg-[#FF5500] text-black font-bold shadow-md'
                            : 'bg-white/5 text-white/80 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-4 h-4" />
                          <span>{tab.label}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 opacity-50" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Drawer Footer with User & Logout */}
              <div className="pt-4 border-t border-white/10 flex flex-col gap-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{user?.avatar || '👑'}</span>
                  <div>
                    <span className="text-xs font-bold text-white block">{user?.fullName}</span>
                    <span className="text-[10px] text-white/50 font-mono">{roleLabel}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-1">
                  <button
                    onClick={() => {
                      setMobileDrawerOpen(false);
                      setQuickPinOpen(true);
                    }}
                    className="py-2 rounded-xl bg-white/10 text-xs font-semibold text-white flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-[#FF5500]" />
                    <span>Đổi Ca</span>
                  </button>
                  <button
                    onClick={() => {
                      setMobileDrawerOpen(false);
                      if (confirm('Đăng xuất?')) logout();
                    }}
                    className="py-2 rounded-xl bg-red-500/10 text-xs font-semibold text-red-400 flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Đăng Xuất</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* QUICK PIN SWITCH MODAL */}
      <QuickPinModal isOpen={quickPinOpen} onClose={() => setQuickPinOpen(false)} />
    </div>
  );
};
