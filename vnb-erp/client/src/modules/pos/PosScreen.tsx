import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search,
  Camera,
  Plus,
  Minus,
  Trash2,
  QrCode,
  Banknote,
  BookOpen,
  Check,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  Receipt,
  Layers,
  ArrowRight,
  ChevronLeft,
  ShoppingBag,
  Package,
  Tag,
  SlidersHorizontal,
} from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useModuleStore } from '../../store/moduleStore';
import { useAuthStore } from '../../store/authStore';
import { Product, Order } from '../../types';
import { api } from '../../api/client';
import { VietQRModal } from '../../components/VietQRModal';
import { ReceiptModal } from '../../components/ReceiptModal';
import { BarcodeScannerModal } from '../../components/BarcodeScannerModal';

export const PosScreen: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [mobileCartOpen, setMobileCartOpen] = useState(false);
  const [editingPriceItemId, setEditingPriceItemId] = useState<string | null>(null);

  // Modals
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cart store
  const {
    items,
    addItem,
    removeItem,
    updateQuantity,
    updateUnitPrice,
    resetUnitPrice,
    clearCart,
    discount,
    setDiscount,
    applyDiscountPercent,
    setTargetTotal,
    roundDownThousands,
    roundDownTenThousands,
    cashGiven,
    setCashGiven,
    addCashPreset,
    customerName,
    setCustomerName,
    customerPhone,
    setCustomerPhone,
    paymentMethod,
    setPaymentMethod,
    getSubtotal,
    getTotalAmount,
    getChangeReturned,
    getItemCount,
    getOriginalSubtotal,
    getTotalSavings,
  } = useCartStore();

  const { tenant } = useModuleStore();
  const { user } = useAuthStore();
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Load products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await api.getProducts(search, selectedCategory);
      setProducts(data);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.category && set.add(p.category));
    return ['all', ...Array.from(set)];
  }, [products]);

  // Barcode scanned
  const handleBarcodeScanned = async (barcode: string) => {
    try {
      const prod = await api.getProductByBarcode(barcode);
      if (prod) {
        addItem(prod);
      }
    } catch {
      // If not exact match, search for it
      setSearch(barcode);
      fetchProducts();
    }
  };

  // Keyboard shortcuts (F1-F12)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Hotkeys F1 - F6 for quick products
      if (e.key.startsWith('F') && !isNaN(Number(e.key.slice(1)))) {
        const num = Number(e.key.slice(1));
        if (num >= 1 && num <= 6) {
          const matched = products.find((p) => p.quickSaleHotKey === e.key);
          if (matched) {
            e.preventDefault();
            addItem(matched);
          }
        }
      }

      // F9: Cash
      if (e.key === 'F9') {
        e.preventDefault();
        setPaymentMethod('cash');
      }
      // F10: VietQR
      if (e.key === 'F10') {
        e.preventDefault();
        setPaymentMethod('vietqr');
      }
      // F11: Debt
      if (e.key === 'F11') {
        e.preventDefault();
        setPaymentMethod('debt');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [products, addItem, setPaymentMethod]);

  // Checkout Handler
  const handleCheckout = async () => {
    if (items.length === 0) return;

    if (paymentMethod === 'vietqr' && !qrModalOpen) {
      setQrModalOpen(true);
      return;
    }

    if (paymentMethod === 'debt' && (!customerName || customerName === 'Khách lẻ')) {
      alert('Vui lòng nhập tên người nợ vào ô Khách hàng!');
      return;
    }

    try {
      setIsSubmitting(true);
      const order = await api.createOrder({
        items: items.map((i) => ({
          productId: i.product._id,
          name: i.product.name,
          barcode: i.product.barcode,
          unit: i.product.unit,
          quantity: i.quantity,
          price: i.unitPrice,
          costPrice: i.product.costPrice,
        })),
        discount,
        paymentMethod,
        cashGiven: paymentMethod === 'cash' ? cashGiven : getTotalAmount(),
        customerName,
        customerPhone,
        cashierName: user?.fullName || 'Thu ngân',
      });

      setCompletedOrder(order);
      setQrModalOpen(false);
      clearCart();
      setMobileCartOpen(false);
      setReceiptModalOpen(true);
      fetchProducts(); // Refresh stock
    } catch (err: any) {
      alert(err.message || 'Lỗi khi tạo đơn hàng');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalAmount = getTotalAmount();
  const changeReturned = getChangeReturned();

  return (
    <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden bg-[#07070A]">
      {/* LEFT: Product Catalog & Fast Search */}
      <div className="flex-1 flex flex-col min-w-0 border-r border-white/10 p-4 sm:p-5 overflow-hidden">
        {/* Search Bar & Barcode Scanner */}
        <div className="flex items-center gap-2 mb-4">
          <form onSubmit={handleSearchSubmit} className="flex-1 relative">
            <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Tìm tên hàng, mã vạch (hoặc bấm F1-F6)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl liquid-glass-input text-xs sm:text-sm text-white placeholder-white/40 font-medium"
            />
          </form>
          <button
            onClick={() => setScannerOpen(true)}
            className="px-3.5 sm:px-4 py-3 rounded-2xl bg-white/10 hover:bg-[#FF5500] hover:text-black text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 border border-white/15"
            title="Quét mã vạch qua Camera"
          >
            <Camera className="w-4 h-4" />
            <span className="hidden sm:inline">Quét Mã</span>
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-2 shrink-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all touch-press cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#FF5500] text-black font-bold shadow-[0_0_15px_rgba(255,85,0,0.4)]'
                  : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/10 border border-white/10'
              }`}
            >
              {cat === 'all' ? 'Tất cả mặt hàng' : cat}
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        <div className="flex-1 overflow-y-auto pr-1 pb-32 lg:pb-4">
          {loading ? (
            <div className="flex items-center justify-center h-48 text-white/40 text-sm font-mono">
              Đang tải danh mục hàng hóa...
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center text-white/40">
              <Layers className="w-10 h-10 mb-2 opacity-40 text-[#FF5500]" />
              <p className="text-sm">Không tìm thấy sản phẩm nào phù hợp</p>
              <button
                onClick={() => {
                  setSearch('');
                  setSelectedCategory('all');
                  fetchProducts();
                }}
                className="mt-3 text-xs text-[#FF5500] hover:underline"
              >
                Xem tất cả
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
              {products.map((p) => {
                const isLowStock = p.stock <= p.minStockAlert;
                return (
                  <div
                    key={p._id}
                    onClick={() => addItem(p)}
                    className="liquid-glass-card rounded-2xl p-3 flex flex-col justify-between border border-white/10 hover:border-[#FF5500]/60 transition-all duration-200 group cursor-pointer touch-press relative overflow-hidden"
                  >
                    {/* Top Thumbnail Image */}
                    <div className="relative w-full h-24 sm:h-28 rounded-xl overflow-hidden bg-white/5 border border-white/10 mb-2 flex items-center justify-center group-hover:border-[#FF5500]/30 transition-colors">
                      {p.imageUrl ? (
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-white/20">
                          <Package className="w-8 h-8" />
                        </div>
                      )}
                      {/* Hotkey Tag if any */}
                      {p.quickSaleHotKey && (
                        <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[10px] font-mono text-[#E5A823] font-bold border border-white/15">
                          {p.quickSaleHotKey}
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-[#FF5500] transition-colors line-clamp-2 leading-tight mb-1">
                        {p.name}
                      </h4>
                      <span className="text-[11px] text-white/40 font-mono block mb-2">
                        {p.unit} • {p.category}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-baseline justify-between mb-1.5">
                        <span className="text-sm sm:text-base font-black text-[#E5A823] font-mono">
                          {p.sellingPrice.toLocaleString('vi-VN')}
                          <span className="text-[11px] font-normal text-white/60 ml-0.5">đ</span>
                        </span>
                      </div>

                      {/* Stock indicator badge */}
                      <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[10px] font-mono">
                        <span
                          className={`flex items-center gap-1 ${
                            isLowStock ? 'text-amber-400 font-bold' : 'text-emerald-400'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isLowStock ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'
                            }`}
                          />
                          Còn: {p.stock} {p.unit}
                        </span>
                        <span className="text-white/40 group-hover:text-white text-xs font-bold">+ Thêm</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: POS Cashier Drawer & Checkout */}
      <div
        className={`fixed inset-0 z-50 lg:static lg:z-auto w-full lg:w-[420px] xl:w-[460px] flex flex-col bg-[#0C0C12] p-4 sm:p-5 shrink-0 overflow-y-auto lg:border-l border-white/10 ${
          mobileCartOpen ? 'flex' : 'hidden lg:flex'
        }`}
      >
        {/* Mobile Header (Back to product selection) */}
        <div className="lg:hidden flex items-center justify-between pb-3 mb-2 border-b border-white/10 shrink-0 sticky top-0 bg-[#0C0C12]/95 backdrop-blur-md z-20">
          <button
            onClick={() => setMobileCartOpen(false)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold cursor-pointer active:scale-95 transition-transform"
          >
            <ChevronLeft className="w-4 h-4 text-[#FF5500]" />
            <span>Tiếp tục chọn hàng</span>
          </button>
          <span className="text-xs text-white/50 font-mono">
            {getItemCount()} món • <span className="text-[#FF5500] font-bold">{totalAmount.toLocaleString('vi-VN')}đ</span>
          </span>
        </div>

        {/* Cart Header */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-[#FF5500]" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Đơn Hàng ({getItemCount()})
            </h3>
          </div>
          {items.length > 0 && (
            <button
              onClick={() => {
                clearCart();
                setMobileCartOpen(false);
              }}
              className="text-xs text-red-400/70 hover:text-red-400 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Xóa giỏ</span>
            </button>
          )}
        </div>

        {/* Customer Input (Cho khách lẻ hoặc ghi nợ) */}
        <div className="mb-3 flex gap-2 shrink-0">
          <input
            type="text"
            placeholder="Tên khách (VD: Chị Lan, Anh Ba...)"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="flex-1 px-3 py-2 rounded-xl liquid-glass-input text-xs text-white placeholder-white/40 font-medium"
          />
          <input
            type="text"
            placeholder="SĐT"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            className="w-24 sm:w-28 px-2.5 py-2 rounded-xl liquid-glass-input text-xs text-white placeholder-white/40 font-mono"
          />
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2 min-h-[140px]">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-white/30 py-8">
              <Sparkles className="w-8 h-8 mb-2 opacity-30 text-[#FF5500]" />
              <p className="text-xs">Chưa có món nào trong giỏ hàng</p>
              <p className="text-[11px] text-white/20 mt-0.5">Bấm vào món bên trái hoặc quét mã vạch</p>
            </div>
          ) : (
            items.map((item) => {
              const isPriceChanged = item.unitPrice !== item.product.sellingPrice;
              const isBelowCost = item.unitPrice < item.product.costPrice;
              const isEditingThis = editingPriceItemId === item.product._id;
              const diffPerItem = item.product.sellingPrice - item.unitPrice;

              return (
                <div
                  key={item.product._id}
                  className={`liquid-glass rounded-2xl p-2.5 flex flex-col gap-2 border transition-all ${
                    isPriceChanged
                      ? 'border-[#E5A823]/40 bg-[#E5A823]/[0.03]'
                      : 'border-white/5 hover:border-white/15'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h5 className="text-xs font-bold text-white truncate max-w-[170px] sm:max-w-[210px]">
                          {item.product.name}
                        </h5>
                        {isPriceChanged && (
                          <span className="px-1.5 py-0.2 text-[9px] rounded bg-amber-500/20 text-amber-300 font-mono font-bold">
                            {diffPerItem > 0
                              ? `Bớt ${diffPerItem.toLocaleString('vi-VN')}đ`
                              : `Tăng ${Math.abs(diffPerItem).toLocaleString('vi-VN')}đ`}
                          </span>
                        )}
                        {isBelowCost && (
                          <span
                            className="px-1.5 py-0.2 text-[9px] rounded bg-red-500/20 text-red-400 font-mono font-bold flex items-center gap-0.5"
                            title="Giá bán đang thấp hơn giá vốn nhập!"
                          >
                            ⚠️ Dưới vốn
                          </span>
                        )}
                      </div>

                      {/* Price display & inline trigger */}
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        {isPriceChanged ? (
                          <div className="flex items-center gap-1 text-[11px] font-mono">
                            <span className="line-through text-white/30 text-[10px]">
                              {item.product.sellingPrice.toLocaleString('vi-VN')}đ
                            </span>
                            <span className="text-[#E5A823] font-bold">
                              {item.unitPrice.toLocaleString('vi-VN')}đ
                            </span>
                            <span className="text-white/40 text-[10px]">/{item.product.unit}</span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-white/50 font-mono">
                            {item.unitPrice.toLocaleString('vi-VN')}đ / {item.product.unit}
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            setEditingPriceItemId(isEditingThis ? null : item.product._id)
                          }
                          className={`px-1.5 py-0.5 rounded text-[10px] font-sans font-medium flex items-center gap-1 transition-colors cursor-pointer ${
                            isEditingThis
                              ? 'bg-[#FF5500] text-black font-bold'
                              : 'bg-white/5 hover:bg-white/15 text-white/60 hover:text-white border border-white/10'
                          }`}
                          title="Thay đổi giá bán khi khách trả giá"
                        >
                          <Tag className="w-2.5 h-2.5" />
                          <span>{isEditingThis ? 'Đóng' : 'Đổi giá'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Quantity adjuster */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                        className="w-6 h-6 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer touch-press"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center font-mono font-bold text-xs text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                        className="w-6 h-6 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer touch-press"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Item Subtotal */}
                    <div className="text-right min-w-[70px] shrink-0 font-mono">
                      <div className="text-xs font-bold text-white">
                        {item.subtotal.toLocaleString('vi-VN')}đ
                      </div>
                    </div>

                    <button
                      onClick={() => removeItem(item.product._id)}
                      className="p-1 text-white/30 hover:text-red-400 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Expanded Quick Price Override Panel for this product */}
                  {isEditingThis && (
                    <div className="pt-2 border-t border-white/10 flex flex-col gap-2 bg-black/40 -mx-1 px-2.5 py-2 rounded-xl border border-white/10">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] text-white/80 font-semibold flex items-center gap-1">
                          <Tag className="w-3 h-3 text-[#FF5500]" /> Giá bán thương lượng:
                        </span>
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={item.unitPrice || ''}
                            onChange={(e) =>
                              updateUnitPrice(item.product._id, Number(e.target.value) || 0)
                            }
                            placeholder={item.product.sellingPrice.toString()}
                            className="w-24 px-2 py-1 rounded-lg liquid-glass-input text-right text-xs text-[#E5A823] font-bold font-mono"
                            autoFocus
                          />
                          <span className="text-[10px] text-white/60 font-mono">đ</span>
                        </div>
                      </div>

                      {/* Quick Discount chips for this item */}
                      <div className="flex items-center gap-1 flex-wrap">
                        <span className="text-[10px] text-white/40">Bớt nhanh:</span>
                        <button
                          type="button"
                          onClick={() =>
                            updateUnitPrice(
                              item.product._id,
                              Math.max(0, item.product.sellingPrice - 1000)
                            )
                          }
                          className="px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/15 text-[10px] font-mono text-white/80 hover:text-white border border-white/10 cursor-pointer"
                        >
                          -1k
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            updateUnitPrice(
                              item.product._id,
                              Math.max(0, item.product.sellingPrice - 2000)
                            )
                          }
                          className="px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/15 text-[10px] font-mono text-white/80 hover:text-white border border-white/10 cursor-pointer"
                        >
                          -2k
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            updateUnitPrice(
                              item.product._id,
                              Math.max(0, item.product.sellingPrice - 5000)
                            )
                          }
                          className="px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/15 text-[10px] font-mono text-white/80 hover:text-white border border-white/10 cursor-pointer"
                        >
                          -5k
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            updateUnitPrice(
                              item.product._id,
                              Math.round(item.product.sellingPrice * 0.9)
                            )
                          }
                          className="px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/15 text-[10px] font-mono text-white/80 hover:text-white border border-white/10 cursor-pointer"
                        >
                          -10%
                        </button>
                        <button
                          type="button"
                          onClick={() => resetUnitPrice(item.product._id)}
                          className="px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/15 text-[10px] font-mono text-white/40 hover:text-white border border-white/10 cursor-pointer"
                        >
                          Giá gốc
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingPriceItemId(null)}
                          className="ml-auto px-2.5 py-0.5 rounded-lg bg-[#FF5500]/20 hover:bg-[#FF5500] text-[#FF5500] hover:text-black text-[10px] font-bold cursor-pointer transition-colors"
                        >
                          Xong ✓
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Calculation & Whole-Order Bargain Box */}
        <div className="mt-3 pt-3 border-t border-white/10 shrink-0 flex flex-col gap-2.5">
          {/* Subtotal */}
          <div className="flex items-center justify-between text-xs text-white/70 font-mono">
            <span>Tạm tính ({getItemCount()} món):</span>
            <span className="text-white font-bold text-sm">
              {getSubtotal().toLocaleString('vi-VN')}đ
            </span>
          </div>

          {/* Whole-order bargain / discount panel */}
          <div className="p-2.5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5 font-sans">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#FF5500]" />
                <span>Bớt giá & Trả giá cả đơn</span>
              </span>
              {discount > 0 && (
                <button
                  type="button"
                  onClick={() => setDiscount(0)}
                  className="text-[10px] text-red-400 hover:text-red-300 font-mono flex items-center gap-0.5 cursor-pointer"
                >
                  <RotateCcw className="w-2.5 h-2.5" /> Bỏ bớt
                </button>
              )}
            </div>

            {/* Dual input: Bớt tiền OR Khách chốt trả chẵn */}
            <div className="grid grid-cols-2 gap-2">
              {/* Input 1: Số tiền bớt */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-white/50 font-mono">Số tiền bớt (đ):</label>
                <div className="relative">
                  <input
                    type="number"
                    value={discount || ''}
                    onChange={(e) => setDiscount(Number(e.target.value) || 0)}
                    placeholder="0"
                    className="w-full px-2.5 py-1.5 rounded-xl liquid-glass-input text-right text-xs text-[#E5A823] font-bold font-mono"
                  />
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] text-white/40">
                    -
                  </span>
                </div>
              </div>

              {/* Input 2: Khách trả chẵn (Target Total) */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-white/50 font-mono">Hoặc khách trả chẵn:</label>
                <input
                  type="number"
                  value={totalAmount || ''}
                  onChange={(e) => setTargetTotal(Number(e.target.value) || 0)}
                  placeholder={getSubtotal().toString()}
                  className="w-full px-2.5 py-1.5 rounded-xl liquid-glass-input text-right text-xs text-emerald-400 font-bold font-mono"
                />
              </div>
            </div>

            {/* Quick whole-order chips */}
            <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
              <button
                type="button"
                onClick={() => setDiscount(discount + 5000)}
                className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-[10px] font-mono text-white/80 hover:text-white border border-white/10 cursor-pointer"
              >
                -5k
              </button>
              <button
                type="button"
                onClick={() => setDiscount(discount + 10000)}
                className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-[10px] font-mono text-white/80 hover:text-white border border-white/10 cursor-pointer"
              >
                -10k
              </button>
              <button
                type="button"
                onClick={() => setDiscount(discount + 20000)}
                className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-[10px] font-mono text-white/80 hover:text-white border border-white/10 cursor-pointer"
              >
                -20k
              </button>
              <button
                type="button"
                onClick={() => applyDiscountPercent(5)}
                className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-[10px] font-mono text-white/80 hover:text-white border border-white/10 cursor-pointer"
              >
                -5%
              </button>
              <button
                type="button"
                onClick={() => applyDiscountPercent(10)}
                className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-[10px] font-mono text-white/80 hover:text-white border border-white/10 cursor-pointer"
              >
                -10%
              </button>
              <button
                type="button"
                onClick={roundDownThousands}
                className="px-2 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-[#E5A823] text-[10px] font-mono font-bold border border-amber-500/20 cursor-pointer"
                title="Bớt tiền lẻ dưới 1.000đ"
              >
                ⚡ Tròn nghìn
              </button>
              <button
                type="button"
                onClick={roundDownTenThousands}
                className="px-2 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-[#E5A823] text-[10px] font-mono font-bold border border-amber-500/20 cursor-pointer"
                title="Bớt về mốc chục nghìn chẵn (VD: 108k -> 100k)"
              >
                ⚡ Chẵn 10k
              </button>
            </div>
          </div>

          {/* Total Savings Banner if any discount applied */}
          {getTotalSavings() > 0 && (
            <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-[11px]">
              <span className="flex items-center gap-1 font-bold">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Tổng bớt cho khách:</span>
              </span>
              <span className="font-black">
                -{getTotalSavings().toLocaleString('vi-VN')}đ
              </span>
            </div>
          )}

          {/* TOTAL TO PAY */}
          <div className="rounded-2xl p-3 bg-gradient-to-r from-[#FF5500]/20 via-[#FF5500]/10 to-transparent border border-[#FF5500]/40 flex items-baseline justify-between">
            <span className="text-xs font-bold text-white/90 uppercase tracking-wider font-mono">
              KHÁCH PHẢI TRẢ:
            </span>
            <div className="text-xl sm:text-2xl font-black text-[#FF5500] font-mono tracking-tight">
              {totalAmount.toLocaleString('vi-VN')} <span className="text-sm font-normal">đ</span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="grid grid-cols-3 gap-2 mt-1">
            <button
              onClick={() => setPaymentMethod('cash')}
              className={`py-2 px-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 border transition-all cursor-pointer ${
                paymentMethod === 'cash'
                  ? 'bg-[#FF5500] text-black border-[#FF5500] shadow-[0_0_12px_rgba(255,85,0,0.4)]'
                  : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'
              }`}
            >
              <Banknote className="w-4 h-4" />
              <span>Tiền Mặt (F9)</span>
            </button>

            <button
              onClick={() => setPaymentMethod('vietqr')}
              className={`py-2 px-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 border transition-all cursor-pointer ${
                paymentMethod === 'vietqr'
                  ? 'bg-emerald-500 text-black border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                  : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>VietQR (F10)</span>
            </button>

            <button
              onClick={() => setPaymentMethod('debt')}
              className={`py-2 px-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 border transition-all cursor-pointer ${
                paymentMethod === 'debt'
                  ? 'bg-[#E5A823] text-black border-[#E5A823] shadow-[0_0_12px_rgba(229,168,35,0.4)]'
                  : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Ghi Nợ (F11)</span>
            </button>
          </div>

          {/* Cash details if Cash selected */}
          {paymentMethod === 'cash' && (
            <div className="rounded-xl p-2.5 bg-white/5 border border-white/10 flex flex-col gap-2 mt-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-white/60">Tiền khách đưa:</span>
                <input
                  type="number"
                  value={cashGiven || ''}
                  onChange={(e) => setCashGiven(Number(e.target.value) || 0)}
                  placeholder="0"
                  className="w-28 px-2 py-1 rounded-lg liquid-glass-input text-right text-xs text-emerald-400 font-bold"
                />
              </div>

              {/* Quick Cash Presets */}
              <div className="grid grid-cols-4 gap-1.5">
                <button
                  onClick={() => setCashGiven(totalAmount)}
                  className="py-1 rounded bg-white/10 hover:bg-white/20 text-[10px] font-mono text-white/90 font-bold"
                >
                  Đủ tiền
                </button>
                <button
                  onClick={() => setCashGiven(50000)}
                  className="py-1 rounded bg-white/10 hover:bg-white/20 text-[10px] font-mono text-white/90 font-bold"
                >
                  50k
                </button>
                <button
                  onClick={() => setCashGiven(100000)}
                  className="py-1 rounded bg-white/10 hover:bg-white/20 text-[10px] font-mono text-white/90 font-bold"
                >
                  100k
                </button>
                <button
                  onClick={() => setCashGiven(500000)}
                  className="py-1 rounded bg-white/10 hover:bg-white/20 text-[10px] font-mono text-white/90 font-bold"
                >
                  500k
                </button>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-white/10 text-xs font-mono">
                <span className="text-white/70">Tiền thối lại:</span>
                <span
                  className={`font-black text-sm ${
                    changeReturned > 0 ? 'text-amber-400 font-bold' : 'text-white/40'
                  }`}
                >
                  {changeReturned.toLocaleString('vi-VN')}đ
                </span>
              </div>
            </div>
          )}

          {/* STICKY BOTTOM CHECKOUT ACTION BUTTON */}
          <div className="sticky bottom-0 bg-[#0C0C12]/95 backdrop-blur-md pt-3 pb-4 sm:pb-2 -mx-4 px-4 sm:-mx-5 sm:px-5 border-t border-white/15 z-30 mt-3 shadow-[0_-10px_30px_rgba(0,0,0,0.85)]">
            <button
              disabled={items.length === 0 || isSubmitting}
              onClick={handleCheckout}
              className={`w-full py-3.5 sm:py-4 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-2xl transition-all cursor-pointer active:scale-[0.98] ${
                items.length === 0
                  ? 'bg-white/10 text-white/30 cursor-not-allowed'
                  : paymentMethod === 'vietqr'
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_4px_25px_rgba(16,185,129,0.4)]'
                  : paymentMethod === 'debt'
                  ? 'bg-[#E5A823] hover:bg-[#F5C042] text-black shadow-[0_4px_25px_rgba(229,168,35,0.4)]'
                  : 'bg-[#FF5500] hover:bg-[#FF6611] text-black shadow-[0_4px_25px_rgba(255,85,0,0.4)]'
              }`}
            >
              {isSubmitting ? (
                <span>Đang xử lý đơn...</span>
              ) : paymentMethod === 'vietqr' ? (
                <>
                  <QrCode className="w-5 h-5" />
                  <span>Mở Mã VietQR ({totalAmount.toLocaleString('vi-VN')}đ)</span>
                </>
              ) : paymentMethod === 'debt' ? (
                <>
                  <BookOpen className="w-5 h-5" />
                  <span>Ghi Nợ Vào Sổ ({totalAmount.toLocaleString('vi-VN')}đ)</span>
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  <span>Hoàn Tất Thanh Toán ({totalAmount.toLocaleString('vi-VN')}đ)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE FLOATING CART BAR (Hiện khi có món trong giỏ và chưa mở giỏ) */}
      {items.length > 0 && !mobileCartOpen && (
        <div className="fixed bottom-20 left-3 right-3 z-30 lg:hidden animate-in fade-in slide-in-from-bottom-3 duration-200">
          <button
            onClick={() => setMobileCartOpen(true)}
            className="w-full liquid-glass rounded-2xl p-3 px-4 border border-[#FF5500]/60 shadow-[0_8px_30px_rgba(255,85,0,0.35)] flex items-center justify-between bg-gradient-to-r from-[#FF5500]/20 via-[#0C0C12] to-[#FF5500]/20 cursor-pointer active:scale-[0.98] transition-transform"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FF5500] text-black flex items-center justify-center font-bold relative shadow-md">
                <ShoppingBag className="w-5 h-5" />
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-white text-black font-black text-[10px] flex items-center justify-center border-2 border-[#0A0A0E]">
                  {getItemCount()}
                </span>
              </div>
              <div className="text-left">
                <div className="text-[11px] text-white/60 font-medium">Giỏ hàng ({getItemCount()} món)</div>
                <div className="text-base font-black text-[#FF5500] font-mono leading-tight">
                  {totalAmount.toLocaleString('vi-VN')} <span className="text-xs font-normal">đ</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FF5500] text-black font-bold text-xs shadow-md">
              <span>Xem Đơn Hàng</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      )}

      {/* MODALS */}
      <VietQRModal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        onConfirmPayment={handleCheckout}
        amount={totalAmount}
        orderCode={completedOrder?.orderCode || `HD${Date.now().toString().slice(-4)}`}
        tenant={tenant}
      />

      <ReceiptModal
        isOpen={receiptModalOpen}
        onClose={() => setReceiptModalOpen(false)}
        order={completedOrder}
        tenant={tenant}
      />

      <BarcodeScannerModal
        isOpen={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onScanSuccess={handleBarcodeScanned}
      />
    </div>
  );
};
