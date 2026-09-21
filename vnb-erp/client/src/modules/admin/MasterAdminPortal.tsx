import React, { useState, useEffect } from 'react';
import {
  Building2,
  Package,
  Users,
  CreditCard,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Lock,
  Unlock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Zap,
  Calendar,
  Layers,
  ChevronRight,
  ChevronLeft,
  Menu,
  LogOut,
  Trash2,
  X,
  Store,
} from 'lucide-react';
import { api } from '../../api/client';
import {
  HqDashboardData,
  SubscriptionPackage,
  TenantAdminView,
  RenewalRecord,
} from '../../types';
import { useAuthStore } from '../../store/authStore';

interface MasterAdminPortalProps {
  onSwitchToStoreView?: () => void;
}

export const MasterAdminPortal: React.FC<MasterAdminPortalProps> = ({
  onSwitchToStoreView,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'packages' | 'tenants' | 'onboard'>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);

  // Data states
  const [dashboardData, setDashboardData] = useState<HqDashboardData | null>(null);
  const [packages, setPackages] = useState<SubscriptionPackage[]>([]);
  const [tenants, setTenants] = useState<TenantAdminView[]>([]);
  const [searchTenant, setSearchTenant] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'trial' | 'expired' | 'suspended'>('all');

  // Modal states
  const [renewModalOpen, setRenewModalOpen] = useState(false);
  const [selectedTenantForRenew, setSelectedTenantForRenew] = useState<TenantAdminView | null>(null);
  const [renewMonths, setRenewMonths] = useState<number>(12);
  const [renewPlanCode, setRenewPlanCode] = useState<string>('standard_retail');
  const [renewAmount, setRenewAmount] = useState<number>(1490000);
  const [renewMethod, setRenewMethod] = useState<'vietqr' | 'bank_transfer' | 'cash' | 'contract'>('vietqr');
  const [renewNotes, setRenewNotes] = useState<string>('');
  const [isRenewing, setIsRenewing] = useState(false);

  // Delete Customer (Tenant) Modal
  const [deleteConfirmModalOpen, setDeleteConfirmModalOpen] = useState(false);
  const [tenantToDelete, setTenantToDelete] = useState<TenantAdminView | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // New Package Modal
  const [createPkgModalOpen, setCreatePkgModalOpen] = useState(false);
  const [pkgName, setPkgName] = useState('');
  const [pkgCode, setPkgCode] = useState('');
  const [pkgDesc, setPkgDesc] = useState('');
  const [pkgMonthly, setPkgMonthly] = useState(199000);
  const [pkgYearly, setPkgYearly] = useState(1990000);
  const [pkgModules, setPkgModules] = useState<string[]>(['pos', 'products', 'debts', 'analytics']);
  const [pkgMaxProducts, setPkgMaxProducts] = useState(10000);
  const [pkgMaxUsers, setPkgMaxUsers] = useState(5);
  const [pkgBadge, setPkgBadge] = useState('');

  // Direct Onboard Form
  const [obStoreName, setObStoreName] = useState('');
  const [obPhone, setObPhone] = useState('');
  const [obAddress, setObAddress] = useState('');
  const [obOwnerName, setObOwnerName] = useState('');
  const [obUsername, setObUsername] = useState('');
  const [obPassword, setObPassword] = useState('123456');
  const [obPlanCode, setObPlanCode] = useState('standard_retail');
  const [obDuration, setObDuration] = useState(12);
  const [isOnboarding, setIsOnboarding] = useState(false);

  const { user, logout } = useAuthStore();

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [dash, pkgs, tnts] = await Promise.all([
        api.getHqDashboard(),
        api.getPackages(),
        api.getAllTenants(),
      ]);
      setDashboardData(dash);
      setPackages(pkgs);
      setTenants(tnts);
    } catch (err) {
      console.error('Failed to load Master Admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Open Renew Modal
  const handleOpenRenew = (tenant: TenantAdminView) => {
    setSelectedTenantForRenew(tenant);
    setRenewPlanCode(tenant.subscription?.planCode || 'standard_retail');
    setRenewMonths(12);
    const targetPkg = packages.find((p) => p.code === (tenant.subscription?.planCode || 'standard_retail'));
    setRenewAmount(targetPkg ? targetPkg.priceYearly : 1490000);
    setRenewModalOpen(true);
  };

  // Submit Renewal
  const handleSubmitRenew = async () => {
    if (!selectedTenantForRenew) return;
    try {
      setIsRenewing(true);
      await api.renewTenant({
        tenantId: selectedTenantForRenew._id,
        durationMonths: renewMonths,
        planCode: renewPlanCode,
        amount: renewAmount,
        paymentMethod: renewMethod,
        notes: renewNotes,
      });
      alert(`Đã gia hạn thành công cho ${selectedTenantForRenew.name}!`);
      setRenewModalOpen(false);
      loadAllData();
    } catch (err: any) {
      alert(err.message || 'Lỗi khi gia hạn bản quyền');
    } finally {
      setIsRenewing(false);
    }
  };

  // Toggle Suspend Status
  const handleToggleStatus = async (tenant: TenantAdminView) => {
    const isSuspending = tenant.subscription?.status !== 'suspended';
    if (confirm(`Bạn có chắc muốn ${isSuspending ? 'TẠM KHÓA' : 'MỞ KHÓA HOẠT ĐỘNG'} cửa hàng "${tenant.name}"?`)) {
      try {
        await api.toggleTenantStatus(tenant._id);
        loadAllData();
      } catch (err: any) {
        alert(err.message || 'Lỗi khi cập nhật trạng thái');
      }
    }
  };

  // Delete Customer (Tenant)
  const handleDeleteTenant = (tenant: TenantAdminView) => {
    setTenantToDelete(tenant);
    setDeleteConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!tenantToDelete) return;
    try {
      setIsDeleting(true);
      const res = await api.deleteTenant(tenantToDelete._id);
      alert(res.message || `Đã xóa vĩnh viễn khách hàng "${tenantToDelete.name}" thành công!`);
      setDeleteConfirmModalOpen(false);
      setTenantToDelete(null);
      await loadAllData();
    } catch (err: any) {
      alert(`Lỗi khi xóa khách hàng: ${err.message || err}`);
    } finally {
      setIsDeleting(false);
    }
  };

  // Submit Create Package
  const handleCreatePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createPackage({
        name: pkgName,
        code: pkgCode,
        description: pkgDesc,
        priceMonthly: pkgMonthly,
        priceYearly: pkgYearly,
        activeModules: pkgModules,
        limits: {
          maxProducts: pkgMaxProducts,
          maxUsers: pkgMaxUsers,
          maxBranches: 2,
        },
        badgeText: pkgBadge,
        isPopular: false,
      });
      alert('Tạo gói cước mới thành công!');
      setCreatePkgModalOpen(false);
      loadAllData();
    } catch (err: any) {
      alert(err.message || 'Lỗi khi tạo gói cước');
    }
  };

  // Submit Direct Onboarding
  const handleDirectOnboard = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsOnboarding(true);
      await api.createTenantDirect({
        storeName: obStoreName,
        storePhone: obPhone,
        address: obAddress,
        ownerFullName: obOwnerName,
        username: obUsername,
        password: obPassword,
        planCode: obPlanCode,
        durationMonths: obDuration,
      });
      alert(`Khởi tạo thành công cửa hàng "${obStoreName}" và tài khoản chủ tiệm "${obUsername}"!`);
      // Reset form
      setObStoreName('');
      setObPhone('');
      setObAddress('');
      setObOwnerName('');
      setObUsername('');
      setActiveTab('tenants');
      loadAllData();
    } catch (err: any) {
      alert(err.message || 'Lỗi khi khởi tạo doanh nghiệp');
    } finally {
      setIsOnboarding(false);
    }
  };

  // Filtered tenants list
  const filteredTenants = tenants.filter((t) => {
    const matchSearch =
      t.name.toLowerCase().includes(searchTenant.toLowerCase()) ||
      t.phone.includes(searchTenant) ||
      t.owner?.fullName?.toLowerCase().includes(searchTenant.toLowerCase());

    if (!matchSearch) return false;
    if (statusFilter === 'all') return true;
    return t.subscription?.status === statusFilter;
  });

  const navItems: Array<{
    id: 'overview' | 'tenants' | 'packages' | 'onboard';
    label: string;
    sublabel: string;
    icon: React.ElementType;
    badge?: number;
  }> = [
    {
      id: 'overview',
      label: 'Tổng Quan HQ',
      sublabel: 'Chỉ số MRR & Cảnh báo',
      icon: TrendingUp,
    },
    {
      id: 'tenants',
      label: 'Quản Lý Doanh Nghiệp',
      sublabel: 'Danh sách tiệm & gia hạn',
      icon: Building2,
      badge: tenants.length,
    },
    {
      id: 'packages',
      label: 'Gói Cước SaaS',
      sublabel: 'Bảng giá & Phân hệ',
      icon: Package,
      badge: packages.length,
    },
    {
      id: 'onboard',
      label: 'Cấp Cửa Hàng & User',
      sublabel: 'Khởi tạo tài khoản trực tiếp',
      icon: Plus,
    },
  ];

  return (
    <div className="flex h-screen w-screen bg-[#07070A] text-white overflow-hidden select-none font-sans">
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
            <img
              src="/vnb-emblem.svg"
              alt="VNB Emblem"
              className="w-9 h-9 rounded-xl shadow-[0_0_15px_rgba(229,168,35,0.3)] shrink-0 object-contain"
            />
            {!sidebarCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="font-black text-sm uppercase tracking-wider bg-gradient-to-r from-white via-white/90 to-[#E5A823] bg-clip-text text-transparent truncate font-mono">
                  VNB Group HQ
                </span>
                <span className="text-[10px] font-mono text-[#E5A823] font-semibold truncate flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                  Master Admin Portal
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-white/50 hover:text-white transition-colors cursor-pointer shrink-0"
            title={sidebarCollapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Quick Switch to POS Store mode if available */}
        {onSwitchToStoreView && (
          <div className="p-3 border-b border-white/10 bg-white/5">
            <button
              onClick={onSwitchToStoreView}
              className={`w-full flex items-center rounded-2xl bg-white/5 border border-white/10 hover:border-[#FF5500]/50 hover:bg-[#FF5500]/10 text-white/80 hover:text-white transition-all p-2.5 cursor-pointer group ${
                sidebarCollapsed ? 'justify-center' : 'gap-2.5'
              }`}
              title="Vào Quầy Bán Lẻ POS để kiểm tra trực tiếp"
            >
              <Store className="w-5 h-5 text-[#FF5500] group-hover:scale-110 transition-transform shrink-0" />
              {!sidebarCollapsed && (
                <div className="text-left min-w-0">
                  <div className="text-xs font-bold text-white flex items-center gap-1">
                    <span>Quầy Bán Lẻ POS</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#FF5500]/20 text-[#FF5500] font-mono">
                      STORE
                    </span>
                  </div>
                  <div className="text-[10px] text-white/40 font-mono truncate">
                    Xem góc nhìn điểm bán
                  </div>
                </div>
              )}
            </button>
          </div>
        )}

        {/* Sidebar Nav Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 scrollbar-none">
          {!sidebarCollapsed && (
            <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-widest text-white/40">
              Trung Tâm Quản Trị Tập Đoàn
            </div>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                title={sidebarCollapsed ? item.label : undefined}
                className={`w-full flex items-center rounded-2xl transition-all duration-200 group relative cursor-pointer ${
                  sidebarCollapsed ? 'justify-center p-3' : 'px-3.5 py-3 gap-3'
                } ${
                  isActive
                    ? 'bg-gradient-to-r from-[#FF5500] to-[#E5A823] text-black font-bold shadow-[0_4px_20px_rgba(255,85,0,0.35)]'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-white rounded-r-full shadow-[0_0_8px_white]" />
                )}

                <div className="relative shrink-0">
                  <Icon
                    className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-black' : 'text-white/80'
                    }`}
                  />
                  {item.badge !== undefined && item.badge > 0 && sidebarCollapsed && (
                    <span className="absolute -top-1.5 -right-2 px-1.5 py-0.2 rounded-full bg-[#E5A823] text-black text-[9px] font-mono font-black shadow-md">
                      {item.badge}
                    </span>
                  )}
                </div>

                {!sidebarCollapsed && (
                  <div className="flex-1 flex items-center justify-between min-w-0 text-left">
                    <div className="min-w-0">
                      <div className="text-xs font-bold truncate leading-tight flex items-center gap-1.5">
                        <span>{item.label}</span>
                      </div>
                      <div
                        className={`text-[10px] font-mono truncate mt-0.5 ${
                          isActive ? 'text-black/75 font-medium' : 'text-white/40'
                        }`}
                      >
                        {item.sublabel}
                      </div>
                    </div>

                    {item.badge !== undefined && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold shrink-0 ml-1.5 ${
                          isActive ? 'bg-black text-white' : 'bg-white/10 text-white/80'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer: Super Admin Profile, Sync & Logout */}
        <div className="p-3 border-t border-white/10 shrink-0 bg-black/40">
          {!sidebarCollapsed ? (
            <div className="rounded-2xl p-3 bg-white/5 border border-white/10 flex flex-col gap-2.5">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-500/10 border border-purple-500/30 flex items-center justify-center text-base shrink-0 shadow-sm">
                  {user?.avatar || '🏛️'}
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-white block truncate leading-tight">
                    {user?.fullName || 'Super Admin'}
                  </span>
                  <span className="text-[9px] font-mono font-semibold uppercase tracking-wider px-1.5 py-0.2 rounded inline-block mt-0.5 bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    SUPER ADMIN HQ
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={loadAllData}
                  className="py-1.5 px-2 rounded-xl bg-white/10 hover:bg-white/15 text-[11px] font-medium text-white flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  title="Đồng bộ dữ liệu"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#FF5500]' : 'text-emerald-400'}`} />
                  <span>Đồng bộ</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Bạn có muốn đăng xuất khỏi Cổng Admin Tổng?')) logout();
                  }}
                  className="py-1.5 px-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-[11px] font-medium text-red-400 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  title="Đăng xuất"
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
                onClick={loadAllData}
                title="Đồng bộ dữ liệu"
                className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#FF5500]' : ''}`} />
              </button>

              <button
                type="button"
                onClick={() => {
                  if (confirm('Đăng xuất khỏi Cổng Admin Tổng?')) logout();
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
      {/* 2. MAIN CONTENT AREA + MOBILE HEADER                      */}
      {/* ========================================================= */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
        {/* Mobile Header Bar (Clean, no hamburger needed because of Bottom Float Bar!) */}
        <header className="md:hidden h-14 px-4 bg-[#0A0A0E]/95 backdrop-blur-md border-b border-white/10 flex items-center justify-between gap-2 shrink-0 z-30">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative">
              <div className="absolute inset-0 bg-[#FF5500]/25 rounded-xl blur-sm" />
              <img
                src="/vnb-emblem.svg"
                alt="VNB"
                className="w-8 h-8 rounded-xl shrink-0 object-contain relative z-10 border border-white/15"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-extrabold text-xs text-white truncate tracking-wide">VNB Group HQ</span>
              <span className="text-[9px] font-mono text-[#E5A823] font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Master Admin
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {onSwitchToStoreView && (
              <button
                onClick={onSwitchToStoreView}
                className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-[#FF5500]/15 to-[#E5A823]/15 border border-[#FF5500]/30 text-white text-[11px] font-mono flex items-center gap-1 cursor-pointer active:scale-95 transition-all"
                title="Vào xem quầy POS"
              >
                <Store className="w-3.5 h-3.5 text-[#FF5500]" />
                <span className="text-[10px] font-bold text-[#FF5500]">POS</span>
              </button>
            )}

            <button
              onClick={loadAllData}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white cursor-pointer active:scale-95 transition-all"
              title="Đồng bộ"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#FF5500]' : ''}`} />
            </button>

            <button
              onClick={() => {
                if (confirm('Đăng xuất khỏi Cổng Quản Trị Tập Đoàn?')) logout();
              }}
              className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 cursor-pointer active:scale-95 transition-all"
              title="Đăng xuất"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        {/* Top Breadcrumb & Status Bar for Desktop */}
        <div className="hidden md:flex h-14 px-8 bg-[#0A0A0E]/80 backdrop-blur-md border-b border-white/10 items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-white/40">VNB Group HQ</span>
            <span className="text-white/20">/</span>
            <span className="text-white font-bold">
              {activeTab === 'overview'
                ? 'Tổng Quan Tập Đoàn (HQ Dashboard)'
                : activeTab === 'tenants'
                ? 'Quản Lý Doanh Nghiệp & Khách Hàng'
                : activeTab === 'packages'
                ? 'Danh Mục Gói Cước SaaS'
                : 'Cấp Doanh Nghiệp & Khách Hàng Mới'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Hệ Thống Trực Tuyến 99.99%</span>
            </div>

            <button
              onClick={loadAllData}
              className="px-3 py-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-white/80 hover:text-white flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin text-[#FF5500]' : ''}`} />
              <span>Làm Mới</span>
            </button>
          </div>
        </div>

        {/* Scrollable Viewport Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 max-w-7xl w-full mx-auto pb-32 sm:pb-24 scrollbar-thin">
        {/* ========================================================================= */}
        {/* TAB 1: OVERVIEW DASHBOARD                                                 */}
        {/* ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* 4 Corporate KPI Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Total Tenants */}
              <div className="liquid-glass-card rounded-2xl p-4 border border-white/10">
                <div className="flex items-center justify-between text-xs text-white/50 mb-2 font-mono">
                  <span>DOANH NGHIỆP / TIỆM</span>
                  <Building2 className="w-4 h-4 text-[#FF5500]" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white font-mono">
                  {dashboardData?.metrics.totalTenants || 0}
                </div>
                <div className="text-[11px] text-emerald-400 font-mono mt-1 flex items-center gap-1.5">
                  <span>✔ {dashboardData?.metrics.activeTenants || 0} đang hoạt động</span>
                  <span className="text-white/30">•</span>
                  <span className="text-amber-400">{dashboardData?.metrics.trialTenants || 0} dùng thử</span>
                </div>
              </div>

              {/* Card 2: MRR */}
              <div className="liquid-glass-card rounded-2xl p-4 border border-[#E5A823]/30 bg-gradient-to-b from-[#E5A823]/10 to-transparent">
                <div className="flex items-center justify-between text-xs text-white/50 mb-2 font-mono">
                  <span>DOANH THU THUÊ BAO (MRR)</span>
                  <CreditCard className="w-4 h-4 text-[#E5A823]" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-[#E5A823] font-mono">
                  {(dashboardData?.metrics.mrr || 0).toLocaleString('vi-VN')}
                  <span className="text-sm font-normal text-white/60 ml-1">đ/tháng</span>
                </div>
                <div className="text-[11px] text-white/50 font-mono mt-1">
                  Ước tính ARR: {((dashboardData?.metrics.arr || 0) / 1000000).toFixed(1)} triệu đ/năm
                </div>
              </div>

              {/* Card 3: SaaS Packages */}
              <div className="liquid-glass-card rounded-2xl p-4 border border-white/10">
                <div className="flex items-center justify-between text-xs text-white/50 mb-2 font-mono">
                  <span>GÓI CƯỚC HOẠT ĐỘNG</span>
                  <Package className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white font-mono">
                  {dashboardData?.packagesCount || 0}
                  <span className="text-sm font-normal text-white/60 ml-1">gói</span>
                </div>
                <div className="text-[11px] text-blue-400 font-mono mt-1">
                  Hỗ trợ Tạp hóa 0đ đến Chuỗi Enterprise
                </div>
              </div>

              {/* Card 4: Total Ecosystem Users */}
              <div className="liquid-glass-card rounded-2xl p-4 border border-white/10">
                <div className="flex items-center justify-between text-xs text-white/50 mb-2 font-mono">
                  <span>TỔNG USER & THU NGÂN</span>
                  <Users className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white font-mono">
                  {dashboardData?.metrics.totalUsers || 0}
                </div>
                <div className="text-[11px] text-purple-400 font-mono mt-1">
                  Đang vận hành trên nền tảng VNB Cloud
                </div>
              </div>
            </div>

            {/* EXPIRING SOON BANNER (Within 7 days) */}
            {dashboardData?.expiringSoonTenants && dashboardData.expiringSoonTenants.length > 0 && (
              <div className="rounded-2xl p-4 bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent border border-amber-500/40 animate-pulse">
                <div className="flex items-center gap-2 mb-2 text-amber-400 font-bold text-sm">
                  <AlertTriangle className="w-5 h-5" />
                  <span>CẢNH BÁO: CÓ {dashboardData.expiringSoonTenants.length} DOANH NGHIỆP SẮP HẾT HẠN TRONG 7 NGÀY TỚI</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                  {dashboardData.expiringSoonTenants.map((item) => (
                    <div
                      key={item.id}
                      className="liquid-glass rounded-xl p-3 border border-amber-500/30 flex items-center justify-between"
                    >
                      <div>
                        <div className="text-xs font-bold text-white">{item.name}</div>
                        <div className="text-[10px] text-white/60 font-mono">
                          {item.phone} • Gói: {item.planName}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-xs font-bold">
                          Còn {item.daysLeft} ngày
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* RECENT RENEWAL TRANSACTIONS */}
            <div className="liquid-glass-card rounded-2xl p-5 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#FF5500]" />
                  <span>Nhật Ký Gia Hạn Thuê Bao Bản Quyền</span>
                </h3>
                <span className="text-xs font-mono text-white/40">Giao dịch tự động ghi nhận</span>
              </div>

              {(!dashboardData?.recentRenewals || dashboardData.recentRenewals.length === 0) ? (
                <div className="text-center py-8 text-white/40 text-xs font-mono">
                  Chưa có giao dịch gia hạn nào được ghi nhận. Hãy thử gia hạn một cửa hàng ở tab "Danh Sách Doanh Nghiệp"!
                </div>
              ) : (
                <>
                  {/* Mobile Cards for Renewals */}
                  <div className="block sm:hidden space-y-2.5">
                    {dashboardData.recentRenewals.map((r) => (
                      <div key={r._id} className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-2 font-mono text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#E5A823]">{r.receiptNo}</span>
                          <span className="text-emerald-400 font-bold">{r.amount.toLocaleString('vi-VN')}đ</span>
                        </div>
                        <div className="font-bold text-white font-sans">{r.tenantName}</div>
                        <div className="flex items-center justify-between text-[10px] text-white/50">
                          <span>{r.planName} (+{r.durationMonths}th)</span>
                          <span>Hạn: {new Date(r.newExpiryDate).toLocaleDateString('vi-VN')}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop Table */}
                  <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full text-left text-xs text-white min-w-[650px]">
                      <thead className="bg-white/5 text-white/50 uppercase font-mono text-[10px] border-b border-white/10">
                        <tr>
                          <th className="px-3 py-2.5">Mã Hóa Đơn</th>
                          <th className="px-3 py-2.5">Cửa Hàng</th>
                          <th className="px-3 py-2.5">Gói Dịch Vụ</th>
                          <th className="px-3 py-2.5">Thời Gian</th>
                          <th className="px-3 py-2.5">Số Tiền</th>
                          <th className="px-3 py-2.5">Hình Thức</th>
                          <th className="px-3 py-2.5">Hạn Mới</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {dashboardData.recentRenewals.map((r) => (
                          <tr key={r._id} className="hover:bg-white/5">
                            <td className="px-3 py-3 font-mono text-[#E5A823] font-bold">{r.receiptNo}</td>
                            <td className="px-3 py-3 font-bold text-white">{r.tenantName}</td>
                            <td className="px-3 py-3 text-white/80">{r.planName}</td>
                            <td className="px-3 py-3 font-mono">+{r.durationMonths} Tháng</td>
                            <td className="px-3 py-3 font-mono font-bold text-emerald-400">
                              {r.amount.toLocaleString('vi-VN')}đ
                            </td>
                            <td className="px-3 py-3 font-mono uppercase text-[10px] text-white/60">
                              {r.paymentMethod}
                            </td>
                            <td className="px-3 py-3 font-mono text-white/80">
                              {new Date(r.newExpiryDate).toLocaleDateString('vi-VN')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: PACKAGES & PRICING PLANS                                           */}
        {/* ========================================================================= */}
        {activeTab === 'packages' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                  <Package className="w-6 h-6 text-[#FF5500]" />
                  <span>Danh Mục Gói Cước Dịch Vụ Tập Đoàn VNB</span>
                </h2>
                <p className="text-xs text-white/50 font-mono mt-1">
                  Định giá SaaS, cấu hình module tính năng và giới hạn kỹ thuật
                </p>
              </div>

              <button
                onClick={() => setCreatePkgModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FF5500] to-[#E5A823] hover:from-[#FF6611] hover:to-[#F5C042] text-black font-bold text-xs flex items-center gap-1.5 shadow-lg cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>+ Tạo Gói Dịch Vụ Mới</span>
              </button>
            </div>

            {/* Packages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {packages.map((pkg) => (
                <div
                  key={pkg._id}
                  className={`liquid-glass-card rounded-3xl p-6 border flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:scale-[1.01] ${
                    pkg.isPopular
                      ? 'border-[#E5A823] shadow-[0_0_30px_rgba(229,168,35,0.2)] bg-gradient-to-b from-[#E5A823]/10 to-transparent'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  {pkg.badgeText && (
                    <span className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full bg-[#E5A823] text-black font-black text-[10px] uppercase font-mono shadow-md">
                      {pkg.badgeText}
                    </span>
                  )}

                  <div>
                    <div className="text-xs font-mono text-white/50 uppercase tracking-widest mb-1">
                      MÃ GÓI: {pkg.code}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{pkg.name}</h3>
                    <p className="text-xs text-white/60 mb-6 leading-relaxed min-h-[36px]">
                      {pkg.description}
                    </p>

                    {/* Price Block */}
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-6">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-white font-mono">
                          {pkg.priceMonthly === 0 ? '0' : pkg.priceMonthly.toLocaleString('vi-VN')}
                        </span>
                        <span className="text-xs text-white/60 font-mono">đ / tháng</span>
                      </div>
                      {pkg.priceYearly > 0 && (
                        <div className="text-[11px] font-mono text-[#E5A823] mt-1">
                          Hoặc {pkg.priceYearly.toLocaleString('vi-VN')}đ / năm (Tiết kiệm 2 tháng)
                        </div>
                      )}
                    </div>

                    {/* Feature Modules Included */}
                    <div className="space-y-2 mb-6">
                      <div className="text-[11px] font-mono uppercase text-white/50 font-bold">
                        Phân hệ kích hoạt:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {pkg.activeModules.map((m) => (
                          <span
                            key={m}
                            className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] font-mono text-white/80"
                          >
                            ✔ {m}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Limits */}
                    <div className="pt-4 border-t border-white/10 text-xs font-mono text-white/50 space-y-1">
                      <div>Tối đa: <span className="text-white font-bold">{pkg.limits?.maxProducts || 500}</span> sản phẩm</div>
                      <div>Tối đa: <span className="text-white font-bold">{pkg.limits?.maxUsers || 2}</span> tài khoản thu ngân</div>
                      <div>Tối đa: <span className="text-white font-bold">{pkg.limits?.maxBranches || 1}</span> chi nhánh</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: TENANTS DIRECTORY                                                  */}
        {/* ========================================================================= */}
        {activeTab === 'tenants' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                  <Building2 className="w-6 h-6 text-[#FF5500]" />
                  <span>Danh Sách Cửa Hàng & Khách Hàng Doanh Nghiệp</span>
                </h2>
                <p className="text-xs text-white/50 font-mono mt-1">
                  Quản lý giấy phép, kiểm tra thời hạn bản quyền và gia hạn thuê bao
                </p>
              </div>

              {/* Search & Status Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchTenant}
                    onChange={(e) => setSearchTenant(e.target.value)}
                    placeholder="Tìm tên tiệm, SĐT, chủ tiệm..."
                    className="pl-9 pr-4 py-2 rounded-xl liquid-glass-input text-xs text-white placeholder-white/40 w-52 sm:w-64"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e: any) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl liquid-glass-input text-xs text-white font-mono bg-[#0C0C12]"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="active">Đang hoạt động</option>
                  <option value="trial">Dùng thử</option>
                  <option value="expired">Đã hết hạn</option>
                  <option value="suspended">Tạm khóa</option>
                </select>
              </div>
            </div>

            {/* Tenants Data Container: Responsive Cards on Mobile + Table on Desktop */}
            {filteredTenants.length === 0 ? (
              <div className="liquid-glass-card rounded-3xl p-12 text-center text-white/40 border border-white/10 font-mono">
                Không tìm thấy cửa hàng nào phù hợp với điều kiện tìm kiếm.
              </div>
            ) : (
              <>
                {/* Mobile Cards for Tenants */}
                <div className="block lg:hidden space-y-3">
                  {filteredTenants.map((tenant) => {
                    const sub = tenant.subscription;
                    const expiresAt = sub?.expiresAt ? new Date(sub.expiresAt) : null;
                    const isExpired = expiresAt ? expiresAt < new Date() : false;
                    const isSuspended = sub?.status === 'suspended';

                    return (
                      <div
                        key={tenant._id}
                        className="liquid-glass-card rounded-2xl p-4 border border-white/10 space-y-3"
                      >
                        {/* Store Name & Status */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-white text-base leading-snug break-words">
                              {tenant.name}
                            </h3>
                            <div className="text-xs text-white/40 font-mono mt-0.5">{tenant.address}</div>
                          </div>
                          <div>
                            {isSuspended ? (
                              <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 text-[10px] font-mono font-bold">
                                ĐÃ TẠM KHÓA
                              </span>
                            ) : isExpired ? (
                              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-[10px] font-mono font-bold">
                                HẾT HẠN
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                HOẠT ĐỘNG
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Owner & Plan Details Grid */}
                        <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-xs font-mono">
                          <div>
                            <span className="text-[10px] text-white/40 block">Chủ Tiệm & SĐT</span>
                            <span className="text-white font-sans font-semibold truncate block">
                              {tenant.owner?.fullName || 'Chưa gán'}
                            </span>
                            <span className="text-[#FF5500] text-[11px] block">{tenant.phone}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-white/40 block">Gói & Thời Hạn</span>
                            <span className="text-white/80 font-medium block truncate">
                              {sub?.planName || 'Gói Cửa Hàng'}
                            </span>
                            <span className={isExpired ? 'text-red-400 font-bold' : 'text-white/60'}>
                              {expiresAt ? expiresAt.toLocaleDateString('vi-VN') : 'Vô thời hạn'}
                            </span>
                          </div>
                        </div>

                        {/* Actions Row */}
                        <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/5">
                          <button
                            onClick={() => handleOpenRenew(tenant)}
                            className="flex-1 py-2 rounded-xl bg-gradient-to-r from-[#FF5500] to-[#E5A823] text-black font-bold text-xs flex items-center justify-center gap-1 shadow-sm active:scale-95 transition-all"
                          >
                            <Zap className="w-3.5 h-3.5" />
                            <span>Gia Hạn</span>
                          </button>

                          <button
                            onClick={() => handleToggleStatus(tenant)}
                            className={`flex-1 py-2 rounded-xl border text-xs font-medium flex items-center justify-center gap-1 active:scale-95 transition-all ${
                              isSuspended
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                            }`}
                          >
                            {isSuspended ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                            <span>{isSuspended ? 'Mở Khóa' : 'Tạm Khóa'}</span>
                          </button>

                          <button
                            onClick={() => handleDeleteTenant(tenant)}
                            className="p-2 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 active:scale-95 transition-all"
                            title="Xóa khách hàng"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Desktop Table */}
                <div className="hidden lg:block liquid-glass-card rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-white min-w-[850px]">
                      <thead className="bg-white/5 text-white/50 uppercase font-mono text-[11px] border-b border-white/10">
                        <tr>
                          <th className="px-5 py-3.5">Cửa Hàng / Tiệm</th>
                          <th className="px-5 py-3.5">Chủ Tiệm & SĐT</th>
                          <th className="px-5 py-3.5">Gói Cước Đang Dùng</th>
                          <th className="px-5 py-3.5">Hạn Dùng Bản Quyền</th>
                          <th className="px-5 py-3.5">Trạng Thái</th>
                          <th className="px-5 py-3.5 text-right">Thao Tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 font-sans">
                        {filteredTenants.map((tenant) => {
                          const sub = tenant.subscription;
                          const expiresAt = sub?.expiresAt ? new Date(sub.expiresAt) : null;
                          const isExpired = expiresAt ? expiresAt < new Date() : false;
                          const isSuspended = sub?.status === 'suspended';

                          return (
                            <tr key={tenant._id} className="hover:bg-white/5 transition-colors">
                              <td className="px-5 py-4">
                                <div className="font-bold text-white text-sm">{tenant.name}</div>
                                <div className="text-[11px] text-white/40 font-mono mt-0.5">{tenant.address}</div>
                              </td>

                              <td className="px-5 py-4">
                                <div className="font-semibold text-white/90">{tenant.owner?.fullName || 'Chưa gán'}</div>
                                <div className="text-[11px] text-[#FF5500] font-mono mt-0.5">{tenant.phone}</div>
                              </td>

                              <td className="px-5 py-4">
                                <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-white/80">
                                  {sub?.planName || 'Gói Cửa Hàng'}
                                </span>
                              </td>

                              <td className="px-5 py-4 font-mono text-xs">
                                {expiresAt ? (
                                  <div>
                                    <div className={isExpired ? 'text-red-400 font-bold' : 'text-white'}>
                                      {expiresAt.toLocaleDateString('vi-VN')}
                                    </div>
                                    <div className="text-[10px] text-white/40">
                                      {isExpired ? 'Đã quá hạn' : `Còn ~${Math.ceil((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} ngày`}
                                    </div>
                                  </div>
                                ) : (
                                  <span className="text-white/40">Vô thời hạn</span>
                                )}
                              </td>

                              <td className="px-5 py-4">
                                {isSuspended ? (
                                  <span className="px-2.5 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 text-[10px] font-mono font-bold">
                                    ĐÃ TẠM KHÓA
                                  </span>
                                ) : isExpired ? (
                                  <span className="px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-[10px] font-mono font-bold">
                                    HẾT HẠN
                                  </span>
                                ) : (
                                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold flex items-center gap-1 w-fit">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    HOẠT ĐỘNG
                                  </span>
                                )}
                              </td>

                              <td className="px-5 py-4 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => handleOpenRenew(tenant)}
                                    className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-[#FF5500] to-[#E5A823] text-black font-bold text-xs flex items-center gap-1 shadow-sm cursor-pointer hover:opacity-90"
                                    title="Gia hạn thời gian sử dụng"
                                  >
                                    <Zap className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">Gia Hạn</span>
                                  </button>

                                  <button
                                    onClick={() => handleToggleStatus(tenant)}
                                    className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
                                      isSuspended
                                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                                        : 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
                                    }`}
                                    title={isSuspended ? 'Mở khóa cửa hàng' : 'Tạm khóa cửa hàng'}
                                  >
                                    {isSuspended ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                                  </button>

                                  <button
                                    onClick={() => handleDeleteTenant(tenant)}
                                    className="p-1.5 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                                    title={`Xóa vĩnh viễn khách hàng "${tenant.name}"`}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: DIRECT ONBOARDING                                                  */}
        {/* ========================================================================= */}
        {activeTab === 'onboard' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <Plus className="w-6 h-6 text-[#FF5500]" />
                <span>Cấp Mới Cửa Hàng & Tài Khoản Doanh Nghiệp</span>
              </h2>
              <p className="text-xs text-white/50 font-mono mt-1">
                Khởi tạo ngay tenant độc lập và bàn giao tài khoản Chủ tiệm cho đối tác
              </p>
            </div>

            <form onSubmit={handleDirectOnboard} className="liquid-glass-card rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-white/70 mb-1.5">
                    Tên Cửa Hàng / Tiệm *
                  </label>
                  <input
                    type="text"
                    required
                    value={obStoreName}
                    onChange={(e) => setObStoreName(e.target.value)}
                    placeholder="VD: Siêu Thị Mini Hoàng Phát"
                    className="w-full px-3.5 py-2.5 rounded-xl liquid-glass-input text-xs text-white placeholder-white/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-white/70 mb-1.5">
                    Số Điện Thoại *
                  </label>
                  <input
                    type="text"
                    required
                    value={obPhone}
                    onChange={(e) => setObPhone(e.target.value)}
                    placeholder="0988 888 888"
                    className="w-full px-3.5 py-2.5 rounded-xl liquid-glass-input text-xs text-white placeholder-white/30 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-white/70 mb-1.5">
                  Địa Chỉ Cửa Hàng
                </label>
                <input
                  type="text"
                  value={obAddress}
                  onChange={(e) => setObAddress(e.target.value)}
                  placeholder="Quận / Huyện, Tỉnh / TP..."
                  className="w-full px-3.5 py-2.5 rounded-xl liquid-glass-input text-xs text-white placeholder-white/30"
                />
              </div>

              <div className="pt-2 border-t border-white/10">
                <h4 className="text-xs font-mono uppercase text-[#E5A823] font-bold mb-3">
                  Thông tin tài khoản Chủ Tiệm (Owner)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-white/60 mb-1">
                      Họ Và Tên *
                    </label>
                    <input
                      type="text"
                      required
                      value={obOwnerName}
                      onChange={(e) => setObOwnerName(e.target.value)}
                      placeholder="Nguyễn Văn A"
                      className="w-full px-3 py-2 rounded-xl liquid-glass-input text-xs text-white placeholder-white/30"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-white/60 mb-1">
                      Username Đăng Nhập *
                    </label>
                    <input
                      type="text"
                      required
                      value={obUsername}
                      onChange={(e) => setObUsername(e.target.value)}
                      placeholder="tiemhoangphat"
                      className="w-full px-3 py-2 rounded-xl liquid-glass-input text-xs text-white placeholder-white/30 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-white/60 mb-1">
                      Mật Khẩu Khởi Tạo *
                    </label>
                    <input
                      type="text"
                      required
                      value={obPassword}
                      onChange={(e) => setObPassword(e.target.value)}
                      placeholder="123456"
                      className="w-full px-3 py-2 rounded-xl liquid-glass-input text-xs text-white placeholder-white/30 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10">
                <h4 className="text-xs font-mono uppercase text-[#E5A823] font-bold mb-3">
                  Gói cước & Bản quyền cấp phát
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-white/60 mb-1">
                      Chọn Gói Dịch Vụ
                    </label>
                    <select
                      value={obPlanCode}
                      onChange={(e) => setObPlanCode(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl liquid-glass-input text-xs text-white bg-[#0C0C12] font-mono"
                    >
                      {packages.map((p) => (
                        <option key={p.code} value={p.code}>
                          {p.name} ({p.priceMonthly === 0 ? '0đ' : `${p.priceMonthly.toLocaleString('vi-VN')}đ/tháng`})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-white/60 mb-1">
                      Thời Gian Cấp Phép Ban Đầu
                    </label>
                    <select
                      value={obDuration}
                      onChange={(e) => setObDuration(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl liquid-glass-input text-xs text-white bg-[#0C0C12] font-mono"
                    >
                      <option value={1}>1 Tháng (Dùng thử nghiệm)</option>
                      <option value={3}>3 Tháng</option>
                      <option value={6}>6 Tháng</option>
                      <option value={12}>1 Năm (Chuẩn)</option>
                      <option value={24}>2 Năm</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isOnboarding}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#FF5500] to-[#E5A823] hover:from-[#FF6611] hover:to-[#F5C042] text-black font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl cursor-pointer transition-all active:scale-[0.98] mt-4"
              >
                {isOnboarding ? (
                  <span>Đang khởi tạo doanh nghiệp...</span>
                ) : (
                  <>
                    <span>Khởi Tạo Cửa Hàng & Bàn Giao Bản Quyền</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </main>
      </div>

      {/* ========================================================= */}
      {/* 4. MODAL: GIA HẠN THUÊ BAO BẢN QUYỀN (RENEWAL MODAL)      */}
      {/* ========================================================= */}
      {renewModalOpen && selectedTenantForRenew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setRenewModalOpen(false)} className="fixed inset-0 bg-black/80 backdrop-blur-sm" />

          <div className="relative w-full max-w-lg rounded-3xl bg-[#0E0E16] border border-white/15 p-6 shadow-2xl z-10 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#FF5500]" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Gia Hạn Bản Quyền Thuê Bao
                </h3>
              </div>
              <button
                onClick={() => setRenewModalOpen(false)}
                className="p-1 rounded-full text-white/50 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 mb-4">
              <div className="text-xs text-white/50 font-mono">Đang gia hạn cho:</div>
              <div className="text-base font-bold text-white">{selectedTenantForRenew.name}</div>
              <div className="text-[11px] text-[#FF5500] font-mono">
                SĐT: {selectedTenantForRenew.phone} • Hạn hiện tại: {selectedTenantForRenew.subscription?.expiresAt ? new Date(selectedTenantForRenew.subscription.expiresAt).toLocaleDateString('vi-VN') : 'Chưa có'}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-white/60 mb-1">
                  Chọn Gói Thuê Bao
                </label>
                <select
                  value={renewPlanCode}
                  onChange={(e) => {
                    setRenewPlanCode(e.target.value);
                    const p = packages.find((pkg) => pkg.code === e.target.value);
                    if (p) {
                      setRenewAmount(renewMonths >= 12 ? p.priceYearly : p.priceMonthly * renewMonths);
                    }
                  }}
                  className="w-full px-3 py-2.5 rounded-xl liquid-glass-input text-xs text-white bg-[#0C0C12] font-mono"
                >
                  {packages.map((p) => (
                    <option key={p.code} value={p.code}>
                      {p.name} ({p.priceMonthly.toLocaleString('vi-VN')}đ/tháng)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-white/60 mb-1.5">
                  Thời Gian Gia Hạn Thêm
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: '+1 Tháng', val: 1 },
                    { label: '+3 Tháng', val: 3 },
                    { label: '+1 Năm', val: 12 },
                    { label: 'Vĩnh Viễn', val: 999 },
                  ].map((btn) => (
                    <button
                      key={btn.val}
                      type="button"
                      onClick={() => {
                        setRenewMonths(btn.val);
                        const p = packages.find((pkg) => pkg.code === renewPlanCode);
                        if (p) {
                          if (btn.val === 999) setRenewAmount(p.priceYearly * 3);
                          else if (btn.val >= 12) setRenewAmount(p.priceYearly * (btn.val / 12));
                          else setRenewAmount(p.priceMonthly * btn.val);
                        }
                      }}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        renewMonths === btn.val
                          ? 'bg-[#FF5500] text-black border-[#FF5500] shadow-md'
                          : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-white/60 mb-1">
                    Số Tiền Thanh Toán
                  </label>
                  <input
                    type="number"
                    value={renewAmount}
                    onChange={(e) => setRenewAmount(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl liquid-glass-input text-xs text-emerald-400 font-mono font-bold text-right"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-white/60 mb-1">
                    Phương Thức
                  </label>
                  <select
                    value={renewMethod}
                    onChange={(e: any) => setRenewMethod(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl liquid-glass-input text-xs text-white bg-[#0C0C12] font-mono"
                  >
                    <option value="vietqr">VietQR Chuyển Khoản</option>
                    <option value="bank_transfer">Chuyển Khoản Doanh Nghiệp</option>
                    <option value="cash">Tiền Mặt</option>
                    <option value="contract">Hợp Đồng B2B</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-white/60 mb-1">
                  Ghi Chú Hóa Đơn
                </label>
                <input
                  type="text"
                  value={renewNotes}
                  onChange={(e) => setRenewNotes(e.target.value)}
                  placeholder="VD: Hợp đồng số 2026/VNB-HD..."
                  className="w-full px-3 py-2 rounded-xl liquid-glass-input text-xs text-white placeholder-white/30"
                />
              </div>

              <button
                type="button"
                disabled={isRenewing}
                onClick={handleSubmitRenew}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#FF5500] to-[#E5A823] text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg cursor-pointer mt-2"
              >
                {isRenewing ? (
                  <span>Đang xử lý gia hạn...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Xác Nhận Gia Hạn & Cấp Phép Bản Quyền</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. MODAL: TẠO GÓI CƯỚC MỚI (CREATE PACKAGE MODAL)         */}
      {/* ========================================================= */}
      {createPkgModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setCreatePkgModalOpen(false)} className="fixed inset-0 bg-black/80 backdrop-blur-sm" />

          <div className="relative w-full max-w-md rounded-3xl bg-[#0E0E16] border border-white/15 p-6 shadow-2xl z-10">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-[#FF5500]" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Tạo Gói Cước Mới
                </h3>
              </div>
              <button
                onClick={() => setCreatePkgModalOpen(false)}
                className="p-1 rounded-full text-white/50 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePackage} className="space-y-3">
              <div>
                <label className="block text-xs font-mono uppercase text-white/60 mb-1">Tên Gói Cước *</label>
                <input
                  type="text"
                  required
                  value={pkgName}
                  onChange={(e) => setPkgName(e.target.value)}
                  placeholder="VD: Gói Chuỗi Siêu Thị Mini"
                  className="w-full px-3 py-2 rounded-xl liquid-glass-input text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-white/60 mb-1">Mã Gói (Code) *</label>
                <input
                  type="text"
                  required
                  value={pkgCode}
                  onChange={(e) => setPkgCode(e.target.value)}
                  placeholder="chain_mart_pro"
                  className="w-full px-3 py-2 rounded-xl liquid-glass-input text-xs text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-white/60 mb-1">Giá Tháng (VNĐ)</label>
                  <input
                    type="number"
                    value={pkgMonthly}
                    onChange={(e) => setPkgMonthly(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl liquid-glass-input text-xs text-white font-mono text-right"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-white/60 mb-1">Giá Năm (VNĐ)</label>
                  <input
                    type="number"
                    value={pkgYearly}
                    onChange={(e) => setPkgYearly(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl liquid-glass-input text-xs text-white font-mono text-right"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-white/60 mb-1">Mô tả ngắn</label>
                <textarea
                  value={pkgDesc}
                  onChange={(e) => setPkgDesc(e.target.value)}
                  rows={2}
                  placeholder="Mô tả ưu đãi của gói..."
                  className="w-full px-3 py-2 rounded-xl liquid-glass-input text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-white/60 mb-1">Badge Nổi Bật (Tag)</label>
                <input
                  type="text"
                  value={pkgBadge}
                  onChange={(e) => setPkgBadge(e.target.value)}
                  placeholder="Khuyên Dùng / VIP"
                  className="w-full px-3 py-2 rounded-xl liquid-glass-input text-xs text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FF5500] to-[#E5A823] text-black font-bold text-xs uppercase tracking-wider shadow-lg cursor-pointer mt-2"
              >
                Tạo Gói & Xuất Bản
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5B. MODAL: XÁC NHẬN XÓA KHÁCH HÀNG (DELETE TENANT MODAL)  */}
      {/* ========================================================= */}
      {deleteConfirmModalOpen && tenantToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => !isDeleting && setDeleteConfirmModalOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-md rounded-3xl bg-[#0E0E16] border border-red-500/30 p-6 shadow-[0_0_50px_rgba(239,68,68,0.2)] z-10 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
              <div className="flex items-center gap-2 text-red-400">
                <AlertTriangle className="w-5 h-5 text-red-400 animate-pulse" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                  Xác Nhận Xóa Khách Hàng
                </h3>
              </div>
              <button
                onClick={() => !isDeleting && setDeleteConfirmModalOpen(false)}
                className="p-1 rounded-full text-white/50 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-red-950/20 border border-red-500/20">
                <div className="text-xs text-white/50 font-mono mb-1">Khách hàng / Doanh nghiệp:</div>
                <div className="text-base font-black text-white">{tenantToDelete.name}</div>
                <div className="text-[11px] text-white/60 font-mono mt-1 space-y-0.5">
                  <div>Hotline: <span className="text-[#FF5500] font-bold">{tenantToDelete.phone}</span></div>
                  <div>Địa chỉ: {tenantToDelete.address}</div>
                  <div>Chủ tiệm: <span className="text-white">{tenantToDelete.owner?.fullName || 'Chưa gán'}</span> ({tenantToDelete.owner?.username})</div>
                  <div>Gói cước: <span className="text-[#E5A823]">{tenantToDelete.subscription?.planName || 'Gói Cửa Hàng'}</span></div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong>Cảnh báo quan trọng:</strong> Hành động này sẽ xóa vĩnh viễn dữ liệu doanh nghiệp, lịch sử thuê bao và tất cả các tài khoản nhân viên/thu ngân trực thuộc cửa hàng này. Dữ liệu đã xóa không thể phục hồi!
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-2">
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => setDeleteConfirmModalOpen(false)}
                  className="py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs transition-colors cursor-pointer"
                >
                  Hủy Bỏ
                </button>

                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={handleConfirmDelete}
                  className="py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-red-900/30 cursor-pointer transition-all"
                >
                  {isDeleting ? (
                    <span>Đang xóa...</span>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      <span>Xác Nhận Xóa</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 6. MOBILE BOTTOM FLOAT BAR (Floating Dock Navigation)     */}
      {/* ========================================================= */}
      <nav className="md:hidden fixed bottom-3 left-3 right-3 max-w-md mx-auto z-40">
        <div className="bg-[#0C0C14]/90 backdrop-blur-2xl border border-white/15 rounded-2xl p-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.85)] ring-1 ring-white/10 grid grid-cols-4 gap-1 items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all relative cursor-pointer active:scale-95 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#FF5500] to-[#E5A823] text-black shadow-[0_4px_20px_rgba(255,85,0,0.4)]'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-4 h-4 ${isActive ? 'scale-110' : ''}`} />
                  {item.badge !== undefined && (
                    <span
                      className={`absolute -top-1.5 -right-3 px-1.5 py-0.2 rounded-full text-[8px] font-mono font-black ${
                        isActive
                          ? 'bg-black text-[#FF5500]'
                          : 'bg-[#FF5500] text-black'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
                <span
                  className={`text-[9px] tracking-tight mt-1 truncate max-w-[70px] ${
                    isActive ? 'font-black' : 'font-medium'
                  }`}
                >
                  {item.id === 'overview'
                    ? 'Tổng Quan'
                    : item.id === 'tenants'
                    ? 'Cửa Hàng'
                    : item.id === 'packages'
                    ? 'Gói SaaS'
                    : 'Cấp Mới'}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
