import React, { useState, useEffect, useMemo } from 'react';
import {
  TrendingUp,
  DollarSign,
  Receipt,
  AlertTriangle,
  BookOpen,
  Calendar,
  Clock,
  CheckCircle2,
  Package,
  ShoppingBag,
  Banknote,
  QrCode,
  Search,
  Download,
  Eye,
  RefreshCw,
  BarChart3,
  PieChart,
  Award,
  ArrowUpRight,
  Filter,
  Sparkles,
  ChevronRight,
  Layers,
} from 'lucide-react';
import { AnalyticsSummary, Order, Product, TenantConfig } from '../../types';
import { api } from '../../api/client';
import { ReceiptModal } from '../../components/ReceiptModal';

type TimeHorizon = 'today' | '7days' | '30days' | 'all';
type PaymentFilter = 'all' | 'cash' | 'vietqr' | 'debt';
type ChartViewMode = 'hourly' | 'daily';

export const AnalyticsScreen: React.FC = () => {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [tenant, setTenant] = useState<TenantConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filters & Controls
  const [timeRange, setTimeRange] = useState<TimeHorizon>('7days');
  const [chartMode, setChartMode] = useState<ChartViewMode>('daily');
  const [searchOrder, setSearchOrder] = useState('');
  const [paymentFilter, setPaymentFilter] = useState<PaymentFilter>('all');
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'amount_desc'>('date_desc');

  // Modal View Order
  const [selectedOrderForReceipt, setSelectedOrderForReceipt] = useState<Order | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  // Hovered bar state for chart tooltips
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);

  const fetchData = async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) setIsRefreshing(true);
      else setLoading(true);

      const [sumData, ordData, prodData, tenantData] = await Promise.all([
        api.getAnalyticsSummary().catch(() => null),
        api.getOrders().catch(() => []),
        api.getProducts().catch(() => []),
        api.getTenantConfig().catch(() => null),
      ]);

      if (sumData) setSummary(sumData);
      setOrders(ordData || []);
      setProducts(prodData || []);
      if (tenantData) setTenant(tenantData);
    } catch (err) {
      console.error('Failed to load analytics data:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter orders by time horizon
  const filteredOrders = useMemo(() => {
    if (!orders || orders.length === 0) return [];
    const now = new Date();

    return orders.filter((ord) => {
      const ordDate = new Date(ord.createdAt);
      if (isNaN(ordDate.getTime())) return true;

      if (timeRange === 'today') {
        return (
          ordDate.getDate() === now.getDate() &&
          ordDate.getMonth() === now.getMonth() &&
          ordDate.getFullYear() === now.getFullYear()
        );
      }
      if (timeRange === '7days') {
        const diffMs = now.getTime() - ordDate.getTime();
        return diffMs <= 7 * 24 * 60 * 60 * 1000;
      }
      if (timeRange === '30days') {
        const diffMs = now.getTime() - ordDate.getTime();
        return diffMs <= 30 * 24 * 60 * 60 * 1000;
      }
      return true; // 'all'
    });
  }, [orders, timeRange]);

  // Financial aggregates based on filtered time range
  const metrics = useMemo(() => {
    const totalRev = filteredOrders.reduce((s, o) => s + (o.totalAmount || 0), 0);
    const totalCost = filteredOrders.reduce((s, o) => s + (o.costTotal || 0), 0);
    const totalProf = filteredOrders.reduce((s, o) => s + (o.profit || 0), 0);
    const count = filteredOrders.length;
    const aov = count > 0 ? Math.round(totalRev / count) : 0;
    const profitMargin = totalRev > 0 ? ((totalProf / totalRev) * 100).toFixed(1) : '0';
    const totalItems = filteredOrders.reduce(
      (s, o) => s + (o.items ? o.items.reduce((acc, it) => acc + (it.quantity || 0), 0) : 0),
      0
    );

    // Payment distribution
    const cashTotal = filteredOrders
      .filter((o) => o.paymentMethod === 'cash')
      .reduce((s, o) => s + (o.totalAmount || 0), 0);
    const vietqrTotal = filteredOrders
      .filter((o) => o.paymentMethod === 'vietqr')
      .reduce((s, o) => s + (o.totalAmount || 0), 0);
    const debtTotal = filteredOrders
      .filter((o) => o.paymentMethod === 'debt')
      .reduce((s, o) => s + (o.totalAmount || 0), 0);

    const cashPercent = totalRev > 0 ? Math.round((cashTotal / totalRev) * 100) : 0;
    const vietqrPercent = totalRev > 0 ? Math.round((vietqrTotal / totalRev) * 100) : 0;
    const debtPercent = totalRev > 0 ? Math.max(0, 100 - cashPercent - vietqrPercent) : 0;

    return {
      totalRev,
      totalCost,
      totalProf,
      count,
      aov,
      profitMargin,
      totalItems,
      cashTotal,
      vietqrTotal,
      debtTotal,
      cashPercent,
      vietqrPercent,
      debtPercent,
    };
  }, [filteredOrders]);

  // Top 5 Best Sellers
  const topProducts = useMemo(() => {
    const map = new Map<
      string,
      {
        name: string;
        barcode: string;
        unit: string;
        quantity: number;
        revenue: number;
        profit: number;
        imageUrl?: string;
      }
    >();

    filteredOrders.forEach((ord) => {
      (ord.items || []).forEach((item) => {
        const existing = map.get(item.productId) || {
          name: item.name,
          barcode: item.barcode,
          unit: item.unit || 'Cái',
          quantity: 0,
          revenue: 0,
          profit: 0,
        };

        const prodInStock = products.find((p) => p._id === item.productId);
        if (prodInStock?.imageUrl && !existing.imageUrl) {
          existing.imageUrl = prodInStock.imageUrl;
        }

        existing.quantity += item.quantity || 0;
        existing.revenue += item.subtotal || item.price * item.quantity;
        existing.profit += (item.price - (item.costPrice || 0)) * item.quantity;
        map.set(item.productId, existing);
      });
    });

    const arr = Array.from(map.values());
    arr.sort((a, b) => b.revenue - a.revenue);
    return arr.slice(0, 5);
  }, [filteredOrders, products]);

  // Low stock items from catalog
  const lowStockAlerts = useMemo(() => {
    return products.filter((p) => p.isActive && p.stock <= p.minStockAlert).slice(0, 4);
  }, [products]);

  // Visual Bar Chart Data generator (Daily or Hourly)
  const chartData = useMemo(() => {
    if (timeRange === 'today' || chartMode === 'hourly') {
      // 8 time buckets throughout the day
      const buckets = [
        { label: '06h-08h', startH: 6, endH: 8, rev: 0, prof: 0, orders: 0 },
        { label: '08h-10h', startH: 8, endH: 10, rev: 0, prof: 0, orders: 0 },
        { label: '10h-12h', startH: 10, endH: 12, rev: 0, prof: 0, orders: 0 },
        { label: '12h-14h', startH: 12, endH: 14, rev: 0, prof: 0, orders: 0 },
        { label: '14h-16h', startH: 14, endH: 16, rev: 0, prof: 0, orders: 0 },
        { label: '16h-18h', startH: 16, endH: 18, rev: 0, prof: 0, orders: 0 },
        { label: '18h-20h', startH: 18, endH: 20, rev: 0, prof: 0, orders: 0 },
        { label: '20h-22h', startH: 20, endH: 22, rev: 0, prof: 0, orders: 0 },
      ];

      filteredOrders.forEach((o) => {
        const h = new Date(o.createdAt).getHours();
        const b = buckets.find((bucket) => h >= bucket.startH && h < bucket.endH);
        if (b) {
          b.rev += o.totalAmount || 0;
          b.prof += o.profit || 0;
          b.orders += 1;
        }
      });

      const maxVal = Math.max(...buckets.map((b) => b.rev), 100000);
      return buckets.map((b) => ({
        label: b.label,
        revenue: b.rev,
        profit: b.prof,
        orders: b.orders,
        revPercent: Math.round((b.rev / maxVal) * 100),
        profPercent: Math.round((b.prof / maxVal) * 100),
      }));
    } else {
      // Past 7 days (or 7 latest days)
      const daysCount = 7;
      const dayBuckets: Array<{
        dateKey: string;
        label: string;
        revenue: number;
        profit: number;
        orders: number;
      }> = [];

      const now = new Date();
      for (let i = daysCount - 1; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const dateKey = d.toISOString().slice(0, 10);
        const dayOfWeek = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][d.getDay()];
        const label = `${dayOfWeek} ${d.getDate()}/${d.getMonth() + 1}`;
        dayBuckets.push({ dateKey, label, revenue: 0, profit: 0, orders: 0 });
      }

      filteredOrders.forEach((o) => {
        const ordKey = new Date(o.createdAt).toISOString().slice(0, 10);
        const b = dayBuckets.find((item) => item.dateKey === ordKey);
        if (b) {
          b.revenue += o.totalAmount || 0;
          b.profit += o.profit || 0;
          b.orders += 1;
        }
      });

      const maxVal = Math.max(...dayBuckets.map((b) => b.revenue), 100000);
      return dayBuckets.map((b) => ({
        label: b.label,
        revenue: b.revenue,
        profit: b.profit,
        orders: b.orders,
        revPercent: Math.round((b.revenue / maxVal) * 100),
        profPercent: Math.round((b.profit / maxVal) * 100),
      }));
    }
  }, [filteredOrders, timeRange, chartMode]);

  // Order table search & sorting
  const displayedOrders = useMemo(() => {
    let list = [...filteredOrders];

    if (searchOrder.trim()) {
      const q = searchOrder.toLowerCase().trim();
      list = list.filter(
        (o) =>
          o.orderCode.toLowerCase().includes(q) ||
          (o.customerName && o.customerName.toLowerCase().includes(q)) ||
          (o.customerPhone && o.customerPhone.includes(q))
      );
    }

    if (paymentFilter !== 'all') {
      list = list.filter((o) => o.paymentMethod === paymentFilter);
    }

    list.sort((a, b) => {
      if (sortBy === 'amount_desc') return b.totalAmount - a.totalAmount;
      if (sortBy === 'date_asc')
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return list;
  }, [filteredOrders, searchOrder, paymentFilter, sortBy]);

  // CSV Export utility with UTF-8 BOM
  const exportToCSV = () => {
    if (displayedOrders.length === 0) return;

    const headers = [
      'Mã Đơn',
      'Thời Gian',
      'Khách Hàng',
      'Số Điện Thoại',
      'Thu Ngân',
      'Hình Thức',
      'Số Món',
      'Tổng Tiền (VNĐ)',
      'Lợi Nhuận (VNĐ)',
      'Trạng Thái',
    ];

    const rows = displayedOrders.map((o) => [
      `"${o.orderCode}"`,
      `"${new Date(o.createdAt).toLocaleString('vi-VN')}"`,
      `"${o.customerName || 'Khách lẻ'}"`,
      `"${o.customerPhone || ''}"`,
      `"${o.cashierName || 'Cô Hoa'}"`,
      `"${
        o.paymentMethod === 'vietqr'
          ? 'VietQR'
          : o.paymentMethod === 'debt'
          ? 'Ghi nợ'
          : 'Tiền mặt'
      }"`,
      o.items ? o.items.reduce((s, i) => s + i.quantity, 0) : 0,
      o.totalAmount,
      o.profit,
      `"Hoàn tất"`,
    ]);

    const csvContent =
      '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `Bao_Cao_Doanh_Thu_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenReceipt = (ord: Order) => {
    setSelectedOrderForReceipt(ord);
    setIsReceiptOpen(true);
  };

  return (
    <div className="flex-1 flex flex-col p-3 sm:p-6 pb-28 md:pb-8 overflow-y-auto bg-[#07070A] text-white">
      {/* Top Header & Range Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-black tracking-wider bg-[#FF5500]/15 text-[#FF5500] border border-[#FF5500]/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Executive Analytics
            </span>
            <span className="text-xs text-white/40 font-mono">
              • Cập nhật theo thời gian thực
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
            <TrendingUp className="w-7 h-7 text-[#FF5500]" />
            <span>Báo Cáo Doanh Thu & Hiệu Quả</span>
          </h1>
          <p className="text-xs sm:text-sm text-white/60 font-sans mt-0.5">
            Phân tích số liệu kinh doanh, dòng tiền thanh toán và biên lợi nhuận ròng
          </p>
        </div>

        {/* Time Filters & Quick Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Horizon Selector */}
          <div className="flex items-center bg-white/5 p-1 rounded-xl border border-white/10 text-xs font-mono">
            <button
              onClick={() => setTimeRange('today')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                timeRange === 'today'
                  ? 'bg-[#FF5500] text-white font-bold shadow-lg shadow-[#FF5500]/25'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              Hôm nay
            </button>
            <button
              onClick={() => setTimeRange('7days')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                timeRange === '7days'
                  ? 'bg-[#FF5500] text-white font-bold shadow-lg shadow-[#FF5500]/25'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              7 ngày qua
            </button>
            <button
              onClick={() => setTimeRange('30days')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                timeRange === '30days'
                  ? 'bg-[#FF5500] text-white font-bold shadow-lg shadow-[#FF5500]/25'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              30 ngày
            </button>
            <button
              onClick={() => setTimeRange('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                timeRange === 'all'
                  ? 'bg-[#FF5500] text-white font-bold shadow-lg shadow-[#FF5500]/25'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              Tất cả
            </button>
          </div>

          {/* Refresh Button */}
          <button
            onClick={() => fetchData(true)}
            disabled={isRefreshing}
            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white/70 hover:text-white transition-all flex items-center justify-center disabled:opacity-50"
            title="Làm mới dữ liệu"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#FF5500]' : ''}`} />
          </button>

          {/* Export CSV */}
          <button
            onClick={exportToCSV}
            disabled={displayedOrders.length === 0}
            className="px-3.5 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 hover:bg-emerald-500/25 text-emerald-400 text-xs font-mono font-bold transition-all flex items-center gap-1.5 disabled:opacity-40"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Xuất Excel/CSV</span>
          </button>
        </div>
      </div>

      {/* 4 Executive KPI Bento Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 mb-6">
        {/* Card 1: Doanh Thu */}
        <div className="liquid-glass-card rounded-2xl p-4 sm:p-5 border border-white/10 hover:border-emerald-500/40 transition-all group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none -mr-6 -mt-6"></div>
          <div className="flex items-center justify-between text-xs text-white/60 mb-2 font-mono">
            <span className="uppercase tracking-wider font-semibold">TỔNG DOANH THU</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
            {metrics.totalRev.toLocaleString('vi-VN')}
            <span className="text-sm font-normal text-white/50 ml-1.5">đ</span>
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5 text-[11px] font-mono">
            <span className="text-emerald-400 flex items-center gap-1 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {metrics.count} đơn hoàn tất
            </span>
            <span className="text-white/40">{metrics.totalItems} món đã bán</span>
          </div>
        </div>

        {/* Card 2: Lợi Nhuận Gộp & Margin */}
        <div className="liquid-glass-card rounded-2xl p-4 sm:p-5 border border-[#FF5500]/30 bg-gradient-to-b from-[#FF5500]/10 via-[#FF5500]/5 to-transparent hover:border-[#FF5500]/50 transition-all group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF5500]/15 rounded-full blur-2xl pointer-events-none -mr-6 -mt-6"></div>
          <div className="flex items-center justify-between text-xs text-white/60 mb-2 font-mono">
            <span className="uppercase tracking-wider font-semibold text-[#FF5500]">LỢI NHUẬN THỰC TẾ</span>
            <div className="w-8 h-8 rounded-xl bg-[#FF5500]/15 text-[#FF5500] flex items-center justify-center border border-[#FF5500]/30">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#FF5500] font-mono tracking-tight">
            {metrics.totalProf.toLocaleString('vi-VN')}
            <span className="text-sm font-normal text-white/50 ml-1.5">đ</span>
          </div>
          {/* Margin progress bar */}
          <div className="mt-3 pt-3 border-t border-[#FF5500]/15 text-[11px] font-mono">
            <div className="flex items-center justify-between mb-1 text-white/70">
              <span>Tỷ suất lợi nhuận</span>
              <span className="font-bold text-[#FF5500]">{metrics.profitMargin}%</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#FF5500] to-amber-400 rounded-full transition-all duration-700"
                style={{ width: `${Math.min(100, Math.max(5, parseFloat(metrics.profitMargin)))}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Card 3: Giá Trị Đơn Trung Bình (AOV) */}
        <div className="liquid-glass-card rounded-2xl p-4 sm:p-5 border border-white/10 hover:border-cyan-500/40 transition-all group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none -mr-6 -mt-6"></div>
          <div className="flex items-center justify-between text-xs text-white/60 mb-2 font-mono">
            <span className="uppercase tracking-wider font-semibold">GIÁ TRỊ ĐƠN TB (AOV)</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-cyan-300 font-mono tracking-tight">
            {metrics.aov.toLocaleString('vi-VN')}
            <span className="text-sm font-normal text-white/50 ml-1.5">đ</span>
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5 text-[11px] font-mono text-white/50">
            <span>Sức mua mỗi lượt</span>
            <span className="text-cyan-400/80">
              ~{(metrics.count > 0 ? (metrics.totalItems / metrics.count).toFixed(1) : 0)} món/đơn
            </span>
          </div>
        </div>

        {/* Card 4: Sổ Nợ Khách Hàng */}
        <div className="liquid-glass-card rounded-2xl p-4 sm:p-5 border border-[#E5A823]/30 bg-gradient-to-b from-[#E5A823]/10 via-[#E5A823]/5 to-transparent hover:border-[#E5A823]/50 transition-all group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#E5A823]/15 rounded-full blur-2xl pointer-events-none -mr-6 -mt-6"></div>
          <div className="flex items-center justify-between text-xs text-white/60 mb-2 font-mono">
            <span className="uppercase tracking-wider font-semibold text-[#E5A823]">SỔ NỢ CÒN THIẾU</span>
            <div className="w-8 h-8 rounded-xl bg-[#E5A823]/15 text-[#E5A823] flex items-center justify-center border border-[#E5A823]/30">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#E5A823] font-mono tracking-tight">
            {(summary?.totalOutstandingDebt || 0).toLocaleString('vi-VN')}
            <span className="text-sm font-normal text-white/50 ml-1.5">đ</span>
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#E5A823]/15 text-[11px] font-mono">
            <span className="text-[#E5A823]/90">Chưa thu hồi</span>
            <span className="text-white/40">Ghi sổ uy tín</span>
          </div>
        </div>
      </div>

      {/* Main Analytics Row: Interactive Visual Bar Chart & Payment Method Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Left 2 Cols: Revenue & Profit Bar Chart */}
        <div className="lg:col-span-2 liquid-glass-card rounded-3xl p-5 border border-white/10 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 font-mono">
                  <BarChart3 className="w-4 h-4 text-[#FF5500]" />
                  <span>Phân Bổ Doanh Thu & Lợi Nhuận</span>
                </h3>
                <p className="text-xs text-white/50 font-sans mt-0.5">
                  Theo dõi xung nhịp bán hàng theo {timeRange === 'today' ? 'giờ' : 'ngày'}
                </p>
              </div>

              {/* Chart Mode Toggle */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-3 text-xs font-mono text-white/70 mr-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-t from-emerald-500 to-emerald-300"></span>
                    <span>Doanh thu</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF5500]"></span>
                    <span>Lợi nhuận</span>
                  </div>
                </div>

                {timeRange !== 'today' && (
                  <div className="flex items-center bg-white/5 rounded-lg p-0.5 border border-white/10 text-[11px] font-mono">
                    <button
                      onClick={() => setChartMode('daily')}
                      className={`px-2 py-1 rounded ${
                        chartMode === 'daily' ? 'bg-white/15 text-white font-bold' : 'text-white/50'
                      }`}
                    >
                      Theo Ngày
                    </button>
                    <button
                      onClick={() => setChartMode('hourly')}
                      className={`px-2 py-1 rounded ${
                        chartMode === 'hourly' ? 'bg-white/15 text-white font-bold' : 'text-white/50'
                      }`}
                    >
                      Theo Giờ
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Visual SVG / Tailwind Responsive Bar Chart */}
            <div className="relative pt-6 pb-2">
              {chartData.length === 0 || chartData.every((d) => d.revenue === 0) ? (
                <div className="h-52 flex flex-col items-center justify-center text-white/40 text-xs font-sans">
                  <BarChart3 className="w-8 h-8 text-white/20 mb-2" />
                  <span>Chưa có dữ liệu giao dịch trong khoảng thời gian này</span>
                </div>
              ) : (
                <div className="h-52 flex items-end justify-between gap-2 sm:gap-4 px-2">
                  {chartData.map((d, index) => {
                    const isHovered = hoveredBarIndex === index;
                    return (
                      <div
                        key={index}
                        className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
                        onMouseEnter={() => setHoveredBarIndex(index)}
                        onMouseLeave={() => setHoveredBarIndex(null)}
                      >
                        {/* Hover Tooltip Popup */}
                        {isHovered && (
                          <div className="absolute bottom-full mb-2 z-30 bg-[#16161D] border border-white/20 rounded-xl p-2.5 shadow-2xl text-[11px] font-mono pointer-events-none min-w-[140px] animate-in fade-in zoom-in-95 duration-150">
                            <div className="font-bold text-white mb-1 pb-1 border-b border-white/10 flex items-center justify-between">
                              <span>{d.label}</span>
                              <span className="text-white/40 font-normal">{d.orders} đơn</span>
                            </div>
                            <div className="flex items-center justify-between text-emerald-400 py-0.5">
                              <span>Doanh thu:</span>
                              <span className="font-bold">{d.revenue.toLocaleString('vi-VN')}đ</span>
                            </div>
                            <div className="flex items-center justify-between text-[#FF5500] py-0.5">
                              <span>Lợi nhuận:</span>
                              <span className="font-bold">{d.profit.toLocaleString('vi-VN')}đ</span>
                            </div>
                          </div>
                        )}

                        {/* Bar Container */}
                        <div className="w-full max-w-[42px] flex items-end justify-center gap-1 h-[82%] relative">
                          {/* Revenue Bar */}
                          <div
                            className={`w-full rounded-t-lg transition-all duration-300 relative ${
                              isHovered
                                ? 'bg-gradient-to-t from-emerald-600 to-emerald-300 shadow-lg shadow-emerald-500/30'
                                : 'bg-gradient-to-t from-emerald-600/70 to-emerald-400/80 hover:brightness-110'
                            }`}
                            style={{ height: `${Math.max(6, d.revPercent)}%` }}
                          >
                            {/* Inner Profit Overlay Indicator */}
                            {d.profit > 0 && (
                              <div
                                className="w-full absolute bottom-0 left-0 bg-gradient-to-t from-[#FF5500] to-amber-500 rounded-t-sm transition-all"
                                style={{
                                  height: `${Math.min(100, (d.profit / Math.max(1, d.revenue)) * 100)}%`,
                                }}
                              ></div>
                            )}
                          </div>
                        </div>

                        {/* X-Axis Label */}
                        <span
                          className={`text-[10px] font-mono mt-2 transition-colors truncate max-w-full text-center ${
                            isHovered ? 'text-white font-bold' : 'text-white/40'
                          }`}
                        >
                          {d.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-white/50 font-mono">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#FF5500]" />
              Cột màu cam thể hiện tỷ trọng lợi nhuận thực trong doanh thu
            </span>
            <span className="hidden sm:inline-block">Rê chuột vào cột để xem chi tiết</span>
          </div>
        </div>

        {/* Right 1 Col: Payment Method Distribution & Cash Flow */}
        <div className="liquid-glass-card rounded-3xl p-5 border border-white/10 shadow-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 font-mono mb-1">
              <PieChart className="w-4 h-4 text-[#FF5500]" />
              <span>Cơ Cấu Dòng Tiền Thu</span>
            </h3>
            <p className="text-xs text-white/50 font-sans mb-5">
              Tỷ trọng phương thức thanh toán của khách
            </p>

            {/* Segmented Multi-Color Progress Bar */}
            <div className="w-full h-4 bg-white/5 rounded-full overflow-hidden flex p-0.5 border border-white/10 mb-5">
              {metrics.cashPercent > 0 && (
                <div
                  className="h-full bg-emerald-500 rounded-l-full transition-all duration-700 relative group"
                  style={{ width: `${metrics.cashPercent}%` }}
                  title={`Tiền mặt: ${metrics.cashPercent}%`}
                ></div>
              )}
              {metrics.vietqrPercent > 0 && (
                <div
                  className="h-full bg-cyan-400 transition-all duration-700 relative group"
                  style={{ width: `${metrics.vietqrPercent}%` }}
                  title={`VietQR: ${metrics.vietqrPercent}%`}
                ></div>
              )}
              {metrics.debtPercent > 0 && (
                <div
                  className="h-full bg-[#E5A823] rounded-r-full transition-all duration-700 relative group"
                  style={{ width: `${metrics.debtPercent}%` }}
                  title={`Ghi nợ: ${metrics.debtPercent}%`}
                ></div>
              )}
            </div>

            {/* 3 Detail Breakdown Items */}
            <div className="space-y-3 font-mono text-xs">
              {/* Tiền mặt */}
              <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                    <Banknote className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-white block">Tiền Mặt</span>
                    <span className="text-[10px] text-emerald-400 font-bold">{metrics.cashPercent}% tổng doanh số</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-white text-sm block">
                    {metrics.cashTotal.toLocaleString('vi-VN')}đ
                  </span>
                  <span className="text-[10px] text-white/40">Cầm tay trực tiếp</span>
                </div>
              </div>

              {/* Chuyển khoản VietQR */}
              <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/15 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-white block">VietQR Ngân Hàng</span>
                    <span className="text-[10px] text-cyan-400 font-bold">{metrics.vietqrPercent}% tổng doanh số</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-white text-sm block">
                    {metrics.vietqrTotal.toLocaleString('vi-VN')}đ
                  </span>
                  <span className="text-[10px] text-white/40">Tài khoản MBBank</span>
                </div>
              </div>

              {/* Khách ghi nợ */}
              <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#E5A823]/15 text-[#E5A823] flex items-center justify-center border border-[#E5A823]/20">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-white block">Ghi Nợ Sổ Tay</span>
                    <span className="text-[10px] text-[#E5A823] font-bold">{metrics.debtPercent}% tổng doanh số</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-[#E5A823] text-sm block">
                    {metrics.debtTotal.toLocaleString('vi-VN')}đ
                  </span>
                  <span className="text-[10px] text-white/40">Cần thu hồi sau</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-white/50 font-mono">
            <span>Dòng tiền vào két</span>
            <span className="text-emerald-400 font-bold">
              {(metrics.cashTotal + metrics.vietqrTotal).toLocaleString('vi-VN')}đ đã thu
            </span>
          </div>
        </div>
      </div>

      {/* Row: Top 5 Best Sellers & Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Top 5 Products Leaderboard (2 Cols) */}
        <div className="lg:col-span-2 liquid-glass-card rounded-3xl p-5 border border-white/10 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 font-mono">
                <Award className="w-4 h-4 text-[#E5A823]" />
                <span>Top 5 Sản Phẩm Bán Chạy Nhất</span>
              </h3>
              <p className="text-xs text-white/50 font-sans mt-0.5">
                Các mặt hàng đem lại doanh số và lợi nhuận cao nhất trong kỳ
              </p>
            </div>
            <span className="text-[11px] font-mono text-white/40">Xếp hạng theo Doanh thu</span>
          </div>

          {topProducts.length === 0 ? (
            <div className="py-8 text-center text-white/40 text-xs font-sans">
              Chưa có đơn hàng phát sinh trong khoảng thời gian đã chọn.
            </div>
          ) : (
            <div className="space-y-3">
              {topProducts.map((p, idx) => {
                const medals = ['🥇', '🥈', '🥉', '#4', '#5'];
                const rankColor =
                  idx === 0
                    ? 'text-amber-300'
                    : idx === 1
                    ? 'text-gray-300'
                    : idx === 2
                    ? 'text-amber-600'
                    : 'text-white/40';
                const sharePercent =
                  metrics.totalRev > 0 ? Math.round((p.revenue / metrics.totalRev) * 100) : 0;

                return (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/15 transition-all flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={`font-mono font-bold text-sm w-6 text-center ${rankColor}`}>
                        {medals[idx]}
                      </span>

                      {/* Product Thumbnail */}
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 overflow-hidden flex-shrink-0 flex items-center justify-center text-lg">
                        {p.imageUrl ? (
                          <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                          '📦'
                        )}
                      </div>

                      <div className="min-w-0">
                        <span className="font-bold text-white text-xs sm:text-sm truncate block font-sans">
                          {p.name}
                        </span>
                        <div className="flex items-center gap-2 text-[11px] font-mono text-white/40 mt-0.5">
                          <span>Đã bán: <strong className="text-white">{p.quantity}</strong> {p.unit}</span>
                          <span>•</span>
                          <span className="text-emerald-400 font-semibold">+{p.profit.toLocaleString('vi-VN')}đ lãi</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0 font-mono">
                      <span className="text-xs sm:text-sm font-bold text-white block">
                        {p.revenue.toLocaleString('vi-VN')}đ
                      </span>
                      <span className="text-[10px] text-[#FF5500] font-semibold">
                        {sharePercent}% tổng doanh thu
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Low Stock & Inventory Health (1 Col) */}
        <div className="liquid-glass-card rounded-3xl p-5 border border-white/10 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 font-mono">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Cảnh Báo Tồn Kho</span>
                </h3>
                <p className="text-xs text-white/50 font-sans mt-0.5">
                  Mặt hàng sắp hết cần nhập gấp
                </p>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-amber-400/15 text-amber-400 border border-amber-400/30 text-[10px] font-mono font-bold">
                {lowStockAlerts.length} cần lưu ý
              </span>
            </div>

            {lowStockAlerts.length === 0 ? (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center text-xs font-mono text-emerald-400">
                <CheckCircle2 className="w-8 h-8 mx-auto mb-2 opacity-80" />
                <span>Tất cả sản phẩm trong kho đang ở mức an toàn!</span>
              </div>
            ) : (
              <div className="space-y-2.5 font-mono text-xs">
                {lowStockAlerts.map((prod) => (
                  <div
                    key={prod._id}
                    className="p-3 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex items-center justify-between"
                  >
                    <div className="min-w-0 pr-2">
                      <span className="font-bold text-white block truncate font-sans">
                        {prod.name}
                      </span>
                      <span className="text-[10px] text-white/40">
                        Định mức an toàn: {prod.minStockAlert} {prod.unit}
                      </span>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="text-amber-400 font-bold text-sm block">
                        Còn {prod.stock} {prod.unit}
                      </span>
                      <span className="text-[10px] text-amber-500/80 uppercase font-bold">
                        Sắp hết hàng
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 text-[11px] font-mono text-white/40 flex items-center justify-between">
            <span>Tổng sản phẩm: {products.length} mã hàng</span>
            <span className="text-[#FF5500]">Quản lý kho</span>
          </div>
        </div>
      </div>

      {/* Advanced Order Transaction History & Audit Table */}
      <div className="liquid-glass-card rounded-3xl p-5 border border-white/10 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 font-mono">
              <Receipt className="w-4 h-4 text-[#FF5500]" />
              <span>Sổ Nhật Ký Bán Hàng & Hóa Đơn ({displayedOrders.length} đơn)</span>
            </h3>
            <p className="text-xs text-white/50 font-sans mt-0.5">
              Chi tiết từng đơn hàng, người mua, hình thức thanh toán và xem lại hóa đơn in
            </p>
          </div>

          {/* Search & Method Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                value={searchOrder}
                onChange={(e) => setSearchOrder(e.target.value)}
                placeholder="Tìm mã đơn, tên khách..."
                className="pl-8 pr-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white placeholder-white/40 focus:outline-none focus:border-[#FF5500] w-48 sm:w-56"
              />
            </div>

            {/* Payment Filter Pills */}
            <div className="flex items-center bg-white/5 rounded-xl p-1 border border-white/10 text-[11px] font-mono">
              <button
                onClick={() => setPaymentFilter('all')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  paymentFilter === 'all'
                    ? 'bg-white/15 text-white font-bold'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => setPaymentFilter('cash')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  paymentFilter === 'cash'
                    ? 'bg-emerald-500/20 text-emerald-400 font-bold'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                Tiền mặt
              </button>
              <button
                onClick={() => setPaymentFilter('vietqr')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  paymentFilter === 'vietqr'
                    ? 'bg-cyan-500/20 text-cyan-400 font-bold'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                VietQR
              </button>
              <button
                onClick={() => setPaymentFilter('debt')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  paymentFilter === 'debt'
                    ? 'bg-[#E5A823]/20 text-[#E5A823] font-bold'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                Ghi nợ
              </button>
            </div>
          </div>
        </div>

        {displayedOrders.length === 0 ? (
          <div className="px-4 py-12 text-center text-white/40 font-sans">
            Không tìm thấy hóa đơn nào phù hợp với điều kiện tìm kiếm.
          </div>
        ) : (
          <>
            {/* Mobile Cards for Orders */}
            <div className="block sm:hidden divide-y divide-white/5">
              {displayedOrders.map((ord) => (
                <div key={ord._id} className="py-3.5 space-y-2 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => handleOpenReceipt(ord)}
                      className="font-bold text-[#FF5500] hover:underline flex items-center gap-1"
                    >
                      #{ord.orderCode}
                      <Eye className="w-3 h-3 text-white/40" />
                    </button>
                    <span className="text-white/50 text-[11px]">
                      {new Date(ord.createdAt).toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}{' '}
                      • {new Date(ord.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between font-sans">
                    <div>
                      <span className="text-white font-semibold block">{ord.customerName}</span>
                      {ord.customerPhone && (
                        <span className="text-white/40 text-[10px] font-mono">{ord.customerPhone}</span>
                      )}
                    </div>
                    <span className="text-white/60 text-xs font-mono">
                      {(ord.items || []).reduce((s, i) => s + i.quantity, 0)} món
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-white/5">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                        ord.paymentMethod === 'vietqr'
                          ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                          : ord.paymentMethod === 'debt'
                          ? 'bg-[#E5A823]/15 text-[#E5A823] border border-[#E5A823]/30'
                          : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {ord.paymentMethod === 'vietqr'
                        ? 'VietQR'
                        : ord.paymentMethod === 'debt'
                        ? 'Ghi nợ'
                        : 'Tiền mặt'}
                    </span>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="font-bold text-white text-sm">
                          {ord.totalAmount.toLocaleString('vi-VN')}đ
                        </div>
                        <div className="text-[10px] text-emerald-400 font-bold">
                          +{ord.profit.toLocaleString('vi-VN')}đ lãi
                        </div>
                      </div>

                      <button
                        onClick={() => handleOpenReceipt(ord)}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white"
                        title="Xem lại hóa đơn"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-xs text-white font-mono min-w-[700px]">
                <thead className="bg-white/5 text-white/50 uppercase text-[10px] border-b border-white/10">
                  <tr>
                    <th className="px-4 py-3">Mã Đơn</th>
                    <th className="px-4 py-3">Thời Gian</th>
                    <th className="px-4 py-3">Khách Hàng</th>
                    <th className="px-4 py-3">Thu Ngân</th>
                    <th className="px-4 py-3">Chi Tiết Món</th>
                    <th className="px-4 py-3">Hình Thức</th>
                    <th className="px-4 py-3 text-right">Tổng Tiền</th>
                    <th className="px-4 py-3 text-right">Lợi Nhuận</th>
                    <th className="px-4 py-3 text-center">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {displayedOrders.map((ord) => (
                    <tr key={ord._id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-4 py-3.5 font-bold text-[#FF5500]">
                        <button
                          onClick={() => handleOpenReceipt(ord)}
                          className="hover:underline flex items-center gap-1 text-left"
                        >
                          #{ord.orderCode}
                        </button>
                      </td>
                      <td className="px-4 py-3.5 text-white/50">
                        {new Date(ord.createdAt).toLocaleTimeString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}{' '}
                        <span className="text-[10px] text-white/30 block">
                          {new Date(ord.createdAt).toLocaleDateString('vi-VN')}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-white font-sans">
                        <span className="font-semibold block">{ord.customerName}</span>
                        {ord.customerPhone && (
                          <span className="text-[10px] text-white/40 font-mono">
                            {ord.customerPhone}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-white/50 font-sans text-[11px]">
                        {ord.cashierName || 'Cô Hoa'}
                      </td>
                      <td className="px-4 py-3.5 text-white/70">
                        <span className="font-bold text-white">
                          {(ord.items || []).reduce((s, i) => s + i.quantity, 0)}
                        </span>{' '}
                        mặt hàng
                        <span className="text-[10px] text-white/40 block truncate max-w-[160px]">
                          {(ord.items || []).map((i) => i.name).join(', ')}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold ${
                            ord.paymentMethod === 'vietqr'
                              ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                              : ord.paymentMethod === 'debt'
                              ? 'bg-[#E5A823]/15 text-[#E5A823] border border-[#E5A823]/30'
                              : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          }`}
                        >
                          {ord.paymentMethod === 'vietqr'
                            ? 'VietQR'
                            : ord.paymentMethod === 'debt'
                            ? 'Ghi nợ'
                            : 'Tiền mặt'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right font-bold text-white text-sm">
                        {ord.totalAmount.toLocaleString('vi-VN')}đ
                      </td>
                      <td className="px-4 py-3.5 text-right font-bold text-emerald-400">
                        +{ord.profit.toLocaleString('vi-VN')}đ
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <button
                          onClick={() => handleOpenReceipt(ord)}
                          className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-white/60 hover:text-white text-[11px] transition-all inline-flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3 text-[#FF5500]" />
                          <span>Hóa đơn</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Reusable Receipt Print Modal */}
      <ReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        order={selectedOrderForReceipt}
        tenant={tenant}
      />
    </div>
  );
};
