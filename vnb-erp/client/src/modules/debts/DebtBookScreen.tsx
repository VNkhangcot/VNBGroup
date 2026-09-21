import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Plus,
  CheckCircle2,
  Clock,
  Phone,
  MapPin,
  X,
  CreditCard,
  Banknote,
  AlertCircle,
} from 'lucide-react';
import { CustomerDebt } from '../../types';
import { api } from '../../api/client';

export const DebtBookScreen: React.FC = () => {
  const [debts, setDebts] = useState<CustomerDebt[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modals
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [repayModalOpen, setRepayModalOpen] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState<CustomerDebt | null>(null);

  // Add Debt Form
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [note, setNote] = useState('');

  // Repay Form
  const [repayAmount, setRepayAmount] = useState<number>(0);
  const [repayNote, setRepayNote] = useState('');

  const fetchDebts = async () => {
    try {
      setLoading(true);
      const data = await api.getDebts(search);
      setDebts(data);
    } catch (err) {
      console.error('Failed to load debts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDebts();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDebts();
  };

  const totalOutstanding = debts.reduce((sum, d) => sum + d.totalDebt, 0);

  const handleAddDebt = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createDebt({ customerName, phone, address, amount, note });
      setAddModalOpen(false);
      setCustomerName('');
      setPhone('');
      setAddress('');
      setAmount(0);
      setNote('');
      fetchDebts();
    } catch (err: any) {
      alert(err.message || 'Lỗi khi ghi nợ');
    }
  };

  const openRepayModal = (debt: CustomerDebt) => {
    setSelectedDebt(debt);
    setRepayAmount(debt.totalDebt); // Default to full amount
    setRepayNote('Khách trả tiền mặt');
    setRepayModalOpen(true);
  };

  const handleRepay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDebt) return;
    try {
      await api.repayDebt(selectedDebt._id, repayAmount, repayNote);
      setRepayModalOpen(false);
      fetchDebts();
    } catch (err: any) {
      alert(err.message || 'Lỗi khi trả nợ');
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-6 pb-24 md:pb-6 overflow-y-auto bg-[#07070A]">
      {/* Top Header & Metrics Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-[#E5A823]" />
            <span>Sổ Ghi Nợ Khách Quen</span>
          </h2>
          <p className="text-xs text-white/50 font-mono mt-1">
            Ghi chép và quản lý nợ tiền mua hàng đơn giản như cuốn sổ tay
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm tên người nợ, SĐT..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2.5 rounded-xl liquid-glass-input text-xs text-white placeholder-white/40 w-52 sm:w-60"
            />
          </form>

          <button
            onClick={() => setAddModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-[#E5A823] hover:bg-[#F5C042] text-black font-bold text-xs flex items-center gap-1.5 shadow-[0_4px_20px_rgba(229,168,35,0.3)] cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>+ Ghi Nợ Mới</span>
          </button>
        </div>
      </div>

      {/* Overview Stat Card */}
      <div className="rounded-2xl p-4 bg-gradient-to-r from-[#E5A823]/15 via-[#E5A823]/5 to-transparent border border-[#E5A823]/30 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#E5A823]/20 border border-[#E5A823]/40 flex items-center justify-center text-[#E5A823]">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-mono text-white/60 uppercase tracking-wider block">
              Tổng số nợ khách còn thiếu:
            </span>
            <div className="text-2xl sm:text-3xl font-black text-[#E5A823] font-mono">
              {totalOutstanding.toLocaleString('vi-VN')} <span className="text-base font-normal">đ</span>
            </div>
          </div>
        </div>
        <span className="text-xs text-white/40 font-mono hidden sm:inline">
          {debts.filter((d) => d.totalDebt > 0).length} người chưa thanh toán
        </span>
      </div>

      {/* Debtors List Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-48 text-white/40 text-sm font-mono">
          Đang tải sổ nợ...
        </div>
      ) : debts.length === 0 ? (
        <div className="liquid-glass-card rounded-3xl p-12 text-center text-white/40 flex flex-col items-center justify-center">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-3 opacity-60" />
          <p className="text-base font-bold text-white mb-1">Không ai nợ tiền quán cả!</p>
          <p className="text-xs text-white/40">Tất cả khách hàng đã thanh toán đầy đủ và sòng phẳng.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {debts.map((d) => {
            const isSettled = d.totalDebt === 0;
            return (
              <div
                key={d._id}
                className={`liquid-glass-card rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                  isSettled
                    ? 'border-white/5 opacity-60'
                    : 'border-[#E5A823]/30 hover:border-[#E5A823]/60 shadow-[0_4px_20px_rgba(0,0,0,0.5)]'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <h3 className="font-bold text-base text-white">{d.customerName}</h3>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-white/50 font-mono mt-1">
                        {d.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-[#FF5500]" /> {d.phone}
                          </span>
                        )}
                        {d.address && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-white/40" /> {d.address}
                          </span>
                        )}
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold font-mono uppercase shrink-0 ${
                        isSettled
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-[#E5A823]/20 text-[#E5A823] border border-[#E5A823]/40'
                      }`}
                    >
                      {isSettled ? 'Đã trả hết' : 'Còn thiếu'}
                    </span>
                  </div>

                  {/* Debt Amount Display */}
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 mb-3 flex items-baseline justify-between font-mono">
                    <span className="text-[11px] text-white/50">Số tiền còn nợ:</span>
                    <span
                      className={`text-xl font-black ${
                        isSettled ? 'text-emerald-400' : 'text-[#E5A823]'
                      }`}
                    >
                      {d.totalDebt.toLocaleString('vi-VN')}đ
                    </span>
                  </div>

                  {/* Recent History Snippet */}
                  <div className="text-[11px] text-white/50 font-mono mb-4 flex flex-col gap-1">
                    <span className="text-white/30 uppercase text-[9px] tracking-wider">Lịch sử gần nhất:</span>
                    {d.history && d.history.length > 0 ? (
                      <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-between">
                        <span className="truncate pr-2">
                          {d.history[0].type === 'charge' ? 'Nợ thêm: ' : 'Trả bớt: '}
                          {d.history[0].note || 'Giao dịch'}
                        </span>
                        <span
                          className={`font-bold shrink-0 ${
                            d.history[0].type === 'charge' ? 'text-amber-400' : 'text-emerald-400'
                          }`}
                        >
                          {d.history[0].type === 'charge' ? '+' : '-'}
                          {d.history[0].amount.toLocaleString('vi-VN')}đ
                        </span>
                      </div>
                    ) : (
                      <span>Chưa có giao dịch</span>
                    )}
                  </div>
                </div>

                {/* Bottom Action */}
                {!isSettled && (
                  <button
                    onClick={() => openRepayModal(d)}
                    className="w-full py-2.5 rounded-xl bg-[#E5A823] hover:bg-[#F5C042] text-black font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
                  >
                    <Banknote className="w-4 h-4" />
                    <span>Khách Trả Tiền</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ADD DEBT MODAL */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md liquid-glass-card rounded-3xl p-6 border border-white/20 shadow-2xl">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#E5A823]" />
                <span>Ghi Nợ Khách Mới</span>
              </h3>
              <button
                onClick={() => setAddModalOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddDebt} className="flex flex-col gap-3 text-xs">
              <div className="flex flex-col gap-1">
                <label className="text-white/70 font-semibold">Tên người nợ *</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Anh Ba Thợ Hồ, Chị Lan Bán Chè..."
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl liquid-glass-input text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-white/70 font-semibold">Số điện thoại</label>
                  <input
                    type="text"
                    placeholder="09xx..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="px-3.5 py-2.5 rounded-xl liquid-glass-input text-white text-xs font-mono"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-white/70 font-semibold">Địa chỉ / Vị trí</label>
                  <input
                    type="text"
                    placeholder="VD: Đầu hẻm 45"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="px-3.5 py-2.5 rounded-xl liquid-glass-input text-white text-xs"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-white/70 font-semibold">Số tiền nợ (đ) *</label>
                <input
                  type="number"
                  required
                  value={amount || ''}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  placeholder="0"
                  className="px-3.5 py-2.5 rounded-xl liquid-glass-input text-[#E5A823] font-bold text-sm font-mono"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-white/70 font-semibold">Ghi chú mặt hàng mua nợ</label>
                <input
                  type="text"
                  placeholder="VD: 1 thùng bia Heineken + 2 gói mì"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl liquid-glass-input text-white text-xs"
                />
              </div>

              <div className="flex justify-end gap-2.5 mt-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-white/15 text-white/70 hover:text-white"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#E5A823] hover:bg-[#F5C042] text-black font-bold flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Lưu Sổ Nợ</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REPAY MODAL */}
      {repayModalOpen && selectedDebt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-sm liquid-glass-card rounded-3xl p-6 border border-white/20 shadow-2xl">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
              <h3 className="text-sm font-bold text-white">Thu Nợ: {selectedDebt.customerName}</h3>
              <button
                onClick={() => setRepayModalOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRepay} className="flex flex-col gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex justify-between">
                <span className="text-white/60">Tổng nợ hiện tại:</span>
                <span className="font-bold text-[#E5A823]">
                  {selectedDebt.totalDebt.toLocaleString('vi-VN')}đ
                </span>
              </div>

              <div className="flex flex-col gap-1 font-sans">
                <label className="text-white/70 font-semibold text-xs">Số tiền khách trả (đ):</label>
                <input
                  type="number"
                  required
                  value={repayAmount || ''}
                  onChange={(e) => setRepayAmount(Number(e.target.value))}
                  className="px-3.5 py-2.5 rounded-xl liquid-glass-input text-emerald-400 font-black text-base font-mono"
                />
              </div>

              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setRepayAmount(selectedDebt.totalDebt)}
                  className="flex-1 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-[11px]"
                >
                  Trả hết toàn bộ
                </button>
                <button
                  type="button"
                  onClick={() => setRepayAmount(Math.round(selectedDebt.totalDebt / 2))}
                  className="flex-1 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-[11px]"
                >
                  Trả 50%
                </button>
              </div>

              <div className="flex flex-col gap-1 font-sans">
                <label className="text-white/70 font-semibold text-xs">Ghi chú thu nợ:</label>
                <input
                  type="text"
                  value={repayNote}
                  onChange={(e) => setRepayNote(e.target.value)}
                  className="px-3.5 py-2 rounded-xl liquid-glass-input text-white text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 mt-3 pt-3 border-t border-white/10 font-sans">
                <button
                  type="button"
                  onClick={() => setRepayModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-white/15 text-white/70"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Xác Nhận Đã Thu</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
