import React, { useState, useEffect } from 'react';
import {
  Package,
  Plus,
  Search,
  AlertTriangle,
  Barcode,
  Edit2,
  Trash2,
  Check,
  X,
  Camera,
  Upload,
  RefreshCw,
  Image as ImageIcon,
} from 'lucide-react';
import { Product } from '../../types';
import { api } from '../../api/client';
import { BarcodeScannerModal } from '../../components/BarcodeScannerModal';

const PRODUCT_IMAGE_PRESETS = [
  {
    name: 'Hảo Hảo',
    url: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Coca-Cola',
    url: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Vinamilk',
    url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Dầu Simply',
    url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Heineken',
    url: 'https://images.unsplash.com/photo-1608270172550-b49871627403?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Nước suối',
    url: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Bánh kẹo',
    url: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Trứng gà',
    url: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&auto=format&fit=crop&q=80',
  },
];

export const ProductListScreen: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [scannerOpen, setScannerOpen] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [barcode, setBarcode] = useState('');
  const [category, setCategory] = useState('Hàng tạp hóa');
  const [unit, setUnit] = useState('Cái');
  const [costPrice, setCostPrice] = useState<number>(0);
  const [sellingPrice, setSellingPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(10);
  const [minStockAlert, setMinStockAlert] = useState<number>(5);
  const [quickSaleHotKey, setQuickSaleHotKey] = useState('');
  const [imageUrl, setImageUrl] = useState<string>('');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await api.getProducts(search);
      setProducts(data);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  const generateRandomBarcode = () => {
    const prefix = '893'; // Vietnam GS1 prefix
    const randomDigits = Math.floor(100000000 + Math.random() * 900000000).toString();
    setBarcode(prefix + randomDigits);
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const maxDim = 600;
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, w, h);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
          setImageUrl(dataUrl);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setName('');
    setBarcode(Date.now().toString().slice(-8)); // auto generate default barcode
    setCategory('Hàng tạp hóa');
    setUnit('Cái');
    setCostPrice(0);
    setSellingPrice(0);
    setStock(10);
    setMinStockAlert(5);
    setQuickSaleHotKey('');
    setImageUrl('');
    setModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setBarcode(p.barcode);
    setCategory(p.category);
    setUnit(p.unit);
    setCostPrice(p.costPrice);
    setSellingPrice(p.sellingPrice);
    setStock(p.stock);
    setMinStockAlert(p.minStockAlert);
    setQuickSaleHotKey(p.quickSaleHotKey || '');
    setImageUrl(p.imageUrl || '');
    setModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await api.updateProduct(editingProduct._id, {
          name,
          barcode,
          category,
          unit,
          costPrice,
          sellingPrice,
          stock,
          minStockAlert,
          quickSaleHotKey,
          imageUrl,
        });
      } else {
        await api.createProduct({
          name,
          barcode,
          category,
          unit,
          costPrice,
          sellingPrice,
          stock,
          minStockAlert,
          quickSaleHotKey,
          imageUrl,
        });
      }
      setModalOpen(false);
      fetchProducts();
    } catch (err: any) {
      alert(err.message || 'Lỗi khi lưu sản phẩm');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa mặt hàng này?')) return;
    try {
      await api.deleteProduct(id);
      fetchProducts();
    } catch (err: any) {
      alert(err.message || 'Lỗi khi xóa sản phẩm');
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-6 pb-24 md:pb-6 overflow-y-auto bg-[#07070A]">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Package className="w-6 h-6 text-[#FF5500]" />
            <span>Danh Mục Hàng Hóa & Tồn Kho</span>
          </h2>
          <p className="text-xs text-white/50 font-mono mt-1">
            Tổng cộng {products.length} mặt hàng đang quản lý
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <form onSubmit={handleSearchSubmit} className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm tên hoặc mã vạch..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl liquid-glass-input text-xs text-white placeholder-white/40"
            />
          </form>

          <button
            onClick={openAddModal}
            className="px-3.5 sm:px-4 py-2.5 rounded-xl bg-[#FF5500] hover:bg-[#FF6611] text-black font-bold text-xs flex items-center gap-1.5 shadow-[0_4px_20px_rgba(255,85,0,0.3)] cursor-pointer shrink-0 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Hàng</span>
          </button>
        </div>
      </div>

      {/* Data Container: Responsive Cards on Mobile + Table on Desktop */}
      {loading ? (
        <div className="liquid-glass-card rounded-3xl p-12 text-center text-white/40 border border-white/10 flex flex-col items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#FF5500] border-t-transparent animate-spin mb-3" />
          <span className="text-xs font-mono">Đang tải danh sách hàng hóa...</span>
        </div>
      ) : products.length === 0 ? (
        <div className="liquid-glass-card rounded-3xl p-12 text-center text-white/40 border border-white/10 flex flex-col items-center justify-center">
          <Package className="w-12 h-12 text-white/20 mb-3" />
          <p className="text-sm font-semibold text-white/70">Chưa có mặt hàng nào</p>
          <p className="text-xs text-white/40 mt-1">Bấm "Thêm Hàng Mới" để tạo sản phẩm đầu tiên cho cửa hàng!</p>
        </div>
      ) : (
        <>
          {/* ======================================================== */}
          {/* MOBILE VIEW (CARDS): Optimized for touch, clear & luxury */}
          {/* ======================================================== */}
          <div className="block md:hidden space-y-3">
            {products.map((p) => {
              const isLowStock = p.stock <= p.minStockAlert;
              const profitPerItem = p.sellingPrice - p.costPrice;
              const marginPercent = p.costPrice > 0 ? Math.round((profitPerItem / p.costPrice) * 100) : 0;

              return (
                <div
                  key={p._id}
                  className="liquid-glass-card rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-all space-y-3"
                >
                  {/* Top: Product Image + Name + Hotkey & Unit */}
                  <div className="flex items-start gap-3">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-white/5 border border-white/10 shrink-0 flex items-center justify-center">
                      {p.imageUrl ? (
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <Package className="w-6 h-6 text-white/25" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1.5">
                        <h3 className="text-sm font-bold text-white leading-snug break-words font-sans">
                          {p.name}
                        </h3>
                        {p.quickSaleHotKey && (
                          <span className="px-1.5 py-0.5 rounded bg-white/10 border border-white/15 text-[#E5A823] font-mono font-bold text-[10px] shrink-0">
                            {p.quickSaleHotKey}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-[11px] text-white/50 flex items-center gap-1 font-mono">
                          <Barcode className="w-3.5 h-3.5 text-[#FF5500] shrink-0" />
                          <span>{p.barcode}</span>
                        </span>
                        <span className="text-white/20">•</span>
                        <span className="text-[11px] text-white/60 font-sans">{p.category}</span>
                        <span className="text-white/20">•</span>
                        <span className="text-[10px] font-mono text-white/60 bg-white/5 px-1.5 py-0.5 rounded border border-white/10">
                          ĐV: {p.unit}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Middle: Financial & Inventory Grid */}
                  <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-center font-mono">
                    <div className="text-left pl-1">
                      <div className="text-[10px] text-white/40 uppercase tracking-wider">Giá Vốn</div>
                      <div className="text-xs font-semibold text-white/70 mt-0.5">
                        {p.costPrice.toLocaleString('vi-VN')}đ
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] text-[#E5A823]/80 uppercase tracking-wider font-bold">Giá Bán</div>
                      <div className="text-sm font-black text-[#E5A823] mt-0.5">
                        {p.sellingPrice.toLocaleString('vi-VN')}đ
                      </div>
                    </div>

                    <div className="text-right pr-1">
                      <div className="text-[10px] text-white/40 uppercase tracking-wider">Tồn Kho</div>
                      <div className="mt-0.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isLowStock
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          }`}
                        >
                          {isLowStock && <AlertTriangle className="w-2.5 h-2.5" />}
                          {p.stock} {p.unit}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom: Profit Info + Large Touch Action Buttons */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <div className="text-[11px] font-mono flex items-center gap-1 text-emerald-400">
                      <span className="text-white/40">Lãi:</span>
                      <span className="font-bold">+{profitPerItem.toLocaleString('vi-VN')}đ</span>
                      {p.costPrice > 0 && (
                        <span className="text-[10px] text-emerald-400/70">({marginPercent}%)</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(p)}
                        className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 active:scale-95 border border-white/10 text-white/90 text-xs flex items-center gap-1.5 font-sans font-medium transition-all"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-sky-400" />
                        <span>Sửa</span>
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-red-500/20 active:scale-95 border border-white/10 hover:border-red-500/30 text-white/50 hover:text-red-400 text-xs flex items-center gap-1.5 font-sans font-medium transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-400" />
                        <span>Xóa</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ======================================================== */}
          {/* DESKTOP VIEW (TABLE): Full width with min-width safety  */}
          {/* ======================================================== */}
          <div className="hidden md:block liquid-glass-card rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-white min-w-[760px]">
                <thead className="bg-white/5 text-white/50 uppercase font-mono text-[11px] border-b border-white/10">
                  <tr>
                    <th className="px-5 py-3.5">Mặt Hàng & Mã Vạch</th>
                    <th className="px-4 py-3.5">Nhóm Hàng</th>
                    <th className="px-4 py-3.5">Đơn Vị</th>
                    <th className="px-4 py-3.5 text-right">Giá Vốn</th>
                    <th className="px-4 py-3.5 text-right">Giá Bán Lẻ</th>
                    <th className="px-4 py-3.5 text-center">Tồn Kho</th>
                    <th className="px-4 py-3.5 text-center">Phím Tắt</th>
                    <th className="px-5 py-3.5 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono">
                  {products.map((p) => {
                    const isLowStock = p.stock <= p.minStockAlert;
                    return (
                      <tr key={p._id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl overflow-hidden bg-white/5 border border-white/10 shrink-0 flex items-center justify-center">
                              {p.imageUrl ? (
                                <img
                                  src={p.imageUrl}
                                  alt={p.name}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                />
                              ) : (
                                <Package className="w-4 h-4 text-white/30" />
                              )}
                            </div>
                            <div>
                              <div className="font-bold text-sm text-white font-sans">{p.name}</div>
                              <div className="text-[11px] text-white/40 flex items-center gap-1 font-mono">
                                <Barcode className="w-3 h-3 text-[#FF5500]" /> {p.barcode}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-white/70 font-sans">{p.category}</td>
                        <td className="px-4 py-3.5 text-white/70 font-sans">{p.unit}</td>
                        <td className="px-4 py-3.5 text-right text-white/60">
                          {p.costPrice.toLocaleString('vi-VN')}đ
                        </td>
                        <td className="px-4 py-3.5 text-right font-bold text-[#E5A823]">
                          {p.sellingPrice.toLocaleString('vi-VN')}đ
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                              isLowStock
                                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                                : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            }`}
                          >
                            {isLowStock && <AlertTriangle className="w-3 h-3" />}
                            {p.stock} {p.unit}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          {p.quickSaleHotKey ? (
                            <span className="px-2 py-0.5 rounded bg-white/10 text-white/80 font-bold text-[10px]">
                              {p.quickSaleHotKey}
                            </span>
                          ) : (
                            <span className="text-white/20">—</span>
                          )}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => openEditModal(p)}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-white/80 hover:text-white transition-colors"
                              title="Chỉnh sửa"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(p._id)}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-colors"
                              title="Xóa"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
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

      {/* CREATE / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto liquid-glass-card rounded-3xl p-5 sm:p-6 border border-white/20 shadow-2xl">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10 sticky top-0 bg-[#0A0A0F]/80 backdrop-blur-md z-10">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-[#FF5500]" />
                <span>{editingProduct ? 'Chỉnh Sửa Mặt Hàng' : 'Thêm Mặt Hàng Mới'}</span>
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="flex flex-col gap-3.5 text-xs">
              {/* Product Image Section */}
              <div className="flex flex-col gap-2 p-3 rounded-2xl bg-white/[0.03] border border-white/10">
                <div className="flex items-center justify-between">
                  <label className="text-white/80 font-semibold flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-[#FF5500]" />
                    <span>Hình ảnh sản phẩm</span>
                  </label>
                  {imageUrl && (
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
                      className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-3 h-3" /> Gỡ ảnh
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {/* Image Preview Box */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-white/15 bg-black/40 flex items-center justify-center shrink-0">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-white/25">
                        <ImageIcon className="w-6 h-6 mb-1" />
                        <span className="text-[9px] font-mono">Chưa có</span>
                      </div>
                    )}
                  </div>

                  {/* Actions & File upload */}
                  <div className="flex-1 flex flex-col gap-2 min-w-0">
                    <div className="flex items-center gap-2">
                      <label className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all border border-white/15">
                        <Upload className="w-3.5 h-3.5 text-[#E5A823]" />
                        <span>Tải ảnh / Chụp ảnh</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageFileChange}
                        />
                      </label>
                    </div>

                    {/* Presets */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                      <span className="text-[10px] text-white/40 shrink-0">Ảnh mẫu:</span>
                      {PRODUCT_IMAGE_PRESETS.map((preset) => (
                        <button
                          type="button"
                          key={preset.name}
                          onClick={() => setImageUrl(preset.url)}
                          className="px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/15 text-[10px] text-white/70 hover:text-white border border-white/10 shrink-0 transition-colors cursor-pointer"
                        >
                          {preset.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Name */}
              <div className="flex flex-col gap-1">
                <label className="text-white/70 font-semibold">Tên sản phẩm / mặt hàng *</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Mì Hảo Hảo Tôm Chua Cay"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl liquid-glass-input text-white text-xs"
                />
              </div>

              {/* Barcode with Camera Scan and Auto-generate buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <label className="text-white/70 font-semibold">Mã vạch (Barcode) *</label>
                    <button
                      type="button"
                      onClick={generateRandomBarcode}
                      className="text-[10px] text-[#E5A823]/80 hover:text-[#E5A823] flex items-center gap-1 transition-colors cursor-pointer"
                      title="Sinh mã vạch ngẫu nhiên"
                    >
                      <RefreshCw className="w-2.5 h-2.5" /> Tạo mã
                    </button>
                  </div>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      required
                      placeholder="VD: 893456789..."
                      value={barcode}
                      onChange={(e) => setBarcode(e.target.value)}
                      className="flex-1 px-3.5 py-2.5 rounded-xl liquid-glass-input text-white text-xs font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setScannerOpen(true)}
                      className="px-3 py-2 rounded-xl bg-[#FF5500]/20 hover:bg-[#FF5500] text-[#FF5500] hover:text-black border border-[#FF5500]/40 text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
                      title="Mở camera quét mã vạch"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Quét</span>
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-white/70 font-semibold">Nhóm danh mục</label>
                  <input
                    type="text"
                    placeholder="VD: Nước giải khát"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="px-3.5 py-2.5 rounded-xl liquid-glass-input text-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-white/70 font-semibold">Đơn vị tính</label>
                  <input
                    type="text"
                    placeholder="Gói, Lon, Chai..."
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="px-3.5 py-2.5 rounded-xl liquid-glass-input text-white text-xs"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-white/70 font-semibold">Giá vốn nhập (đ)</label>
                  <input
                    type="number"
                    value={costPrice || ''}
                    onChange={(e) => setCostPrice(Number(e.target.value))}
                    className="px-3.5 py-2.5 rounded-xl liquid-glass-input text-white text-xs font-mono"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-white/70 font-semibold">Giá bán lẻ (đ) *</label>
                  <input
                    type="number"
                    required
                    value={sellingPrice || ''}
                    onChange={(e) => setSellingPrice(Number(e.target.value))}
                    className="px-3.5 py-2.5 rounded-xl liquid-glass-input text-[#E5A823] font-bold text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-white/70 font-semibold">Tồn kho ban đầu</label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="px-3.5 py-2.5 rounded-xl liquid-glass-input text-white text-xs font-mono"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-white/70 font-semibold">Báo khi còn dưới</label>
                  <input
                    type="number"
                    value={minStockAlert}
                    onChange={(e) => setMinStockAlert(Number(e.target.value))}
                    className="px-3.5 py-2.5 rounded-xl liquid-glass-input text-white text-xs font-mono"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-white/70 font-semibold">Phím tắt nhanh</label>
                  <input
                    type="text"
                    placeholder="VD: F1, F2"
                    value={quickSaleHotKey}
                    onChange={(e) => setQuickSaleHotKey(e.target.value.toUpperCase())}
                    className="px-3.5 py-2.5 rounded-xl liquid-glass-input text-white text-xs font-mono uppercase"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 mt-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-white/15 text-white/70 hover:text-white"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#FF5500] hover:bg-[#FF6611] text-black font-bold flex items-center gap-1.5 shadow-[0_4px_15px_rgba(255,85,0,0.3)] cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Lưu Mặt Hàng</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Barcode Camera Scanner Modal */}
      <BarcodeScannerModal
        isOpen={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onScanSuccess={(code) => {
          setBarcode(code);
          setScannerOpen(false);
        }}
      />
    </div>
  );
};
