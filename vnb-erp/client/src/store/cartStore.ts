import { create } from 'zustand';
import { Product, CartItem } from '../types';

interface CartState {
  items: CartItem[];
  discount: number;
  cashGiven: number;
  customerName: string;
  customerPhone: string;
  paymentMethod: 'cash' | 'vietqr' | 'debt';

  // Actions
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  updateUnitPrice: (productId: string, unitPrice: number) => void;
  resetUnitPrice: (productId: string) => void;
  clearCart: () => void;
  setDiscount: (amount: number) => void;
  applyDiscountPercent: (percent: number) => void;
  setTargetTotal: (targetAmount: number) => void;
  roundDownThousands: () => void;
  roundDownTenThousands: () => void;
  setCashGiven: (amount: number) => void;
  addCashPreset: (amount: number) => void;
  setCustomerName: (name: string) => void;
  setCustomerPhone: (phone: string) => void;
  setPaymentMethod: (method: 'cash' | 'vietqr' | 'debt') => void;

  // Computed Helpers
  getSubtotal: () => number;
  getTotalAmount: () => number;
  getChangeReturned: () => number;
  getItemCount: () => number;
  getOriginalSubtotal: () => number;
  getTotalSavings: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  discount: 0,
  cashGiven: 0,
  customerName: 'Khách lẻ',
  customerPhone: '',
  paymentMethod: 'cash',

  addItem: (product: Product, quantity = 1) => {
    const { items } = get();
    const existingIndex = items.findIndex((i) => i.product._id === product._id);

    if (existingIndex > -1) {
      const updated = [...items];
      const newQty = updated[existingIndex].quantity + quantity;
      updated[existingIndex] = {
        ...updated[existingIndex],
        quantity: newQty,
        subtotal: newQty * updated[existingIndex].unitPrice,
      };
      set({ items: updated });
    } else {
      const newItem: CartItem = {
        product,
        quantity,
        unitPrice: product.sellingPrice,
        subtotal: product.sellingPrice * quantity,
      };
      set({ items: [newItem, ...items] });
    }
  },

  removeItem: (productId: string) => {
    set({ items: get().items.filter((i) => i.product._id !== productId) });
  },

  updateQuantity: (productId: string, quantity: number) => {
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }
    const updated = get().items.map((item) => {
      if (item.product._id === productId) {
        return {
          ...item,
          quantity,
          subtotal: quantity * item.unitPrice,
        };
      }
      return item;
    });
    set({ items: updated });
  },

  updateUnitPrice: (productId: string, unitPrice: number) => {
    const safePrice = Math.max(0, unitPrice);
    const updated = get().items.map((item) => {
      if (item.product._id === productId) {
        return {
          ...item,
          unitPrice: safePrice,
          subtotal: item.quantity * safePrice,
        };
      }
      return item;
    });
    set({ items: updated });
  },

  resetUnitPrice: (productId: string) => {
    const updated = get().items.map((item) => {
      if (item.product._id === productId) {
        return {
          ...item,
          unitPrice: item.product.sellingPrice,
          subtotal: item.quantity * item.product.sellingPrice,
        };
      }
      return item;
    });
    set({ items: updated });
  },

  clearCart: () => {
    set({
      items: [],
      discount: 0,
      cashGiven: 0,
      customerName: 'Khách lẻ',
      customerPhone: '',
      paymentMethod: 'cash',
    });
  },

  setDiscount: (amount: number) => set({ discount: Math.max(0, amount) }),

  applyDiscountPercent: (percent: number) => {
    const subtotal = get().getSubtotal();
    const discountAmount = Math.round((subtotal * percent) / 100);
    set({ discount: discountAmount });
  },

  setTargetTotal: (targetAmount: number) => {
    const subtotal = get().getSubtotal();
    const safeTarget = Math.max(0, targetAmount);
    if (safeTarget < subtotal) {
      set({ discount: subtotal - safeTarget });
    } else {
      set({ discount: 0 });
    }
  },

  roundDownThousands: () => {
    // E.g. 108,500 -> 108,000 (bớt 500đ)
    const currentTotal = get().getTotalAmount();
    const target = Math.floor(currentTotal / 1000) * 1000;
    const diff = currentTotal - target;
    if (diff > 0) {
      set({ discount: get().discount + diff });
    }
  },

  roundDownTenThousands: () => {
    // E.g. 108,000 -> 100,000 (bớt 8,000đ)
    const currentTotal = get().getTotalAmount();
    const target = Math.floor(currentTotal / 10000) * 10000;
    const diff = currentTotal - target;
    if (diff > 0 && target > 0) {
      set({ discount: get().discount + diff });
    }
  },

  setCashGiven: (amount: number) => set({ cashGiven: Math.max(0, amount) }),
  addCashPreset: (amount: number) => set((state) => ({ cashGiven: state.cashGiven + amount })),
  setCustomerName: (name: string) => set({ customerName: name }),
  setCustomerPhone: (phone: string) => set({ customerPhone: phone }),
  setPaymentMethod: (method: 'cash' | 'vietqr' | 'debt') => set({ paymentMethod: method }),

  getSubtotal: () => get().items.reduce((sum, item) => sum + item.subtotal, 0),
  getTotalAmount: () => Math.max(0, get().getSubtotal() - get().discount),
  getChangeReturned: () => {
    const total = get().getTotalAmount();
    const given = get().cashGiven;
    return get().paymentMethod === 'cash' ? Math.max(0, given - total) : 0;
  },
  getItemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
  getOriginalSubtotal: () =>
    get().items.reduce((sum, item) => sum + item.quantity * item.product.sellingPrice, 0),
  getTotalSavings: () => {
    const original = get().getOriginalSubtotal();
    const finalTotal = get().getTotalAmount();
    return Math.max(0, original - finalTotal);
  },
}));
