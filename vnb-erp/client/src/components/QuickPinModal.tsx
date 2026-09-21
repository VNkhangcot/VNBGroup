import React, { useState, useEffect } from 'react';
import { KeyRound, X, Delete, AlertCircle, CheckCircle2, Shield } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { api } from '../api/client';
import { StaffMember } from '../types';

interface QuickPinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickPinModal: React.FC<QuickPinModalProps> = ({ isOpen, onClose }) => {
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [pinDigits, setPinDigits] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { pinLogin, user } = useAuthStore();

  useEffect(() => {
    if (isOpen) {
      setPinDigits('');
      setErrorMsg('');
      setSuccessMsg('');
      api
        .getStaffList()
        .then((list) => {
          setStaffList(list);
          // Set to a different staff member or first cashier
          const other = list.find((s) => s.id !== user?.id) || list[0];
          setSelectedStaff(other || null);
        })
        .catch((err) => console.error('Failed to load staff:', err));
    }
  }, [isOpen, user?.id]);

  if (!isOpen) return null;

  const handlePinPress = async (val: string) => {
    if (pinDigits.length < 4) {
      const next = pinDigits + val;
      setPinDigits(next);
      setErrorMsg('');

      if (next.length === 4 && selectedStaff) {
        setLoading(true);
        const success = await pinLogin(selectedStaff.id, next);
        setLoading(false);
        if (success) {
          setSuccessMsg(`Đã đổi ca thành công: ${selectedStaff.fullName}`);
          setTimeout(() => {
            onClose();
          }, 800);
        } else {
          setErrorMsg('Mã PIN không đúng. Vui lòng thử lại!');
          setPinDigits('');
        }
      }
    }
  };

  const handlePinClear = () => {
    setPinDigits('');
    setErrorMsg('');
  };

  const handlePinBackspace = () => {
    setPinDigits((prev) => prev.slice(0, -1));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-black/80 backdrop-blur-sm animate-fadeIn" />

      {/* Dialog Box */}
      <div className="relative w-full max-w-sm rounded-3xl bg-[#0E0E16] border border-white/15 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.8)] z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-[#FF5500]" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Đổi Ca Thu Ngân Nhanh
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/15 text-white/60 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Success or Error Alerts */}
        {errorMsg && (
          <div className="mb-3 p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-3 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Staff Selection Carousel */}
        <div className="mb-4">
          <label className="block text-[10px] font-mono uppercase text-white/50 mb-1.5">
            Chọn nhân sự nhận ca:
          </label>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {staffList.map((staff) => {
              const isSelected = selectedStaff?.id === staff.id;
              return (
                <button
                  key={staff.id}
                  onClick={() => {
                    setSelectedStaff(staff);
                    setPinDigits('');
                    setErrorMsg('');
                  }}
                  className={`px-3 py-2 rounded-xl border flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#FF5500]/20 border-[#FF5500] shadow-[0_0_12px_rgba(255,85,0,0.3)]'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <span className="text-base">{staff.avatar || '🧑‍💼'}</span>
                  <div className="text-left">
                    <span className="text-xs font-bold text-white block line-clamp-1">
                      {staff.fullName}
                    </span>
                    <span className="text-[9px] font-mono text-white/40 uppercase">
                      {staff.role === 'owner' ? 'Chủ tiệm' : 'Thu ngân'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* PIN Code Dots (••••) */}
        <div className="flex items-center justify-center gap-3.5 my-4">
          {[0, 1, 2, 3].map((idx) => {
            const isFilled = pinDigits.length > idx;
            return (
              <div
                key={idx}
                className={`w-4 h-4 rounded-full transition-all duration-150 ${
                  isFilled
                    ? 'bg-[#FF5500] scale-125 shadow-[0_0_12px_#FF5500]'
                    : 'border-2 border-white/20 bg-white/5'
                }`}
              />
            );
          })}
        </div>

        <div className="text-[11px] text-white/40 font-mono text-center mb-4">
          Nhập mã PIN 4 số của nhân viên (Mẫu: Cô Hoa <span className="text-emerald-400 font-bold">1234</span>)
        </div>

        {/* Virtual NumPad */}
        <div className="grid grid-cols-3 gap-2 w-full max-w-[260px] mx-auto">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
            <button
              key={num}
              disabled={loading}
              onClick={() => handlePinPress(num)}
              className="h-12 rounded-xl liquid-glass border border-white/10 hover:border-[#FF5500]/60 hover:bg-white/10 active:scale-95 transition-all text-lg font-mono font-black text-white flex items-center justify-center cursor-pointer shadow-sm"
            >
              {num}
            </button>
          ))}

          <button
            onClick={handlePinClear}
            disabled={loading}
            className="h-12 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 transition-all text-[11px] font-mono font-bold text-white/50 flex items-center justify-center cursor-pointer"
          >
            Xóa
          </button>

          <button
            disabled={loading}
            onClick={() => handlePinPress('0')}
            className="h-12 rounded-xl liquid-glass border border-white/10 hover:border-[#FF5500]/60 hover:bg-white/10 active:scale-95 transition-all text-lg font-mono font-black text-white flex items-center justify-center cursor-pointer shadow-sm"
          >
            0
          </button>

          <button
            onClick={handlePinBackspace}
            disabled={loading}
            className="h-12 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 transition-all text-xs font-mono font-bold text-white/60 flex items-center justify-center cursor-pointer"
          >
            <Delete className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
