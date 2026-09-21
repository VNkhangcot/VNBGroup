import {
  Product,
  Order,
  CustomerDebt,
  TenantConfig,
  AnalyticsSummary,
  User,
  StaffMember,
  AuthResponse,
  SubscriptionPackage,
  RenewalRecord,
  HqDashboardData,
  TenantAdminView,
} from '../types';

const API_BASE = '/api';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('vnb_auth_token');
  const authHeaders: Record<string, string> = {};

  if (token) {
    authHeaders['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...options?.headers,
    },
    ...options,
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'API request failed');
  }
  return json.data;
}

export const api = {
  // Authentication & Staff
  login: (identifier: string, password: string) =>
    fetchJson<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier, password }),
    }),

  register: (data: {
    storeName: string;
    storePhone?: string;
    fullName: string;
    username: string;
    email?: string;
    password: string;
    pinCode?: string;
  }) =>
    fetchJson<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  pinLogin: (userId: string, pinCode: string) =>
    fetchJson<AuthResponse>('/auth/pin-login', {
      method: 'POST',
      body: JSON.stringify({ userId, pinCode }),
    }),

  getMe: () =>
    fetchJson<{
      user: User;
      tenant: TenantConfig;
    }>('/auth/me'),

  getStaffList: (tenantId?: string) => {
    const params = tenantId ? `?tenantId=${encodeURIComponent(tenantId)}` : '';
    return fetchJson<StaffMember[]>(`/auth/staff${params}`);
  },

  createStaff: (data: {
    fullName: string;
    username: string;
    password: string;
    role?: string;
    pinCode?: string;
    avatar?: string;
  }) =>
    fetchJson<StaffMember>('/auth/staff', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Master Admin & Corporate Headquarters (HQ)
  getHqDashboard: () => fetchJson<HqDashboardData>('/admin/dashboard'),

  getPackages: () => fetchJson<SubscriptionPackage[]>('/admin/packages'),
  createPackage: (data: Partial<SubscriptionPackage>) =>
    fetchJson<SubscriptionPackage>('/admin/packages', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updatePackage: (id: string, data: Partial<SubscriptionPackage>) =>
    fetchJson<SubscriptionPackage>(`/admin/packages/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deletePackage: (id: string) =>
    fetchJson<{ message: string }>(`/admin/packages/${id}`, {
      method: 'DELETE',
    }),

  getAllTenants: () => fetchJson<TenantAdminView[]>('/admin/tenants'),

  renewTenant: (data: {
    tenantId: string;
    durationMonths: number;
    planCode?: string;
    amount?: number;
    paymentMethod?: string;
    notes?: string;
  }) =>
    fetchJson<{ tenant: TenantConfig; renewalRecord: RenewalRecord }>(
      '/admin/tenants/renew',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    ),

  toggleTenantStatus: (id: string) =>
    fetchJson<{ status: string }>(`/admin/tenants/${id}/toggle-status`, {
      method: 'PATCH',
    }),

  deleteTenant: (id: string) =>
    fetchJson<{ message: string }>(`/admin/tenants/${id}`, {
      method: 'DELETE',
    }),

  createTenantDirect: (data: {
    storeName: string;
    storePhone?: string;
    address?: string;
    ownerFullName: string;
    username: string;
    password: string;
    planCode: string;
    durationMonths: number;
  }) =>
    fetchJson<{ tenant: TenantConfig; owner: any }>('/admin/tenants/onboard', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Tenant & Modular Settings
  getTenantConfig: () => fetchJson<TenantConfig>('/tenant'),
  updateTenantConfig: (data: Partial<TenantConfig>) =>
    fetchJson<TenantConfig>('/tenant', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Products
  getProducts: (search = '', category = 'all') => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category) params.append('category', category);
    return fetchJson<Product[]>(`/products?${params.toString()}`);
  },
  getProductByBarcode: (barcode: string) =>
    fetchJson<Product>(`/products/barcode/${encodeURIComponent(barcode)}`),
  createProduct: (data: Partial<Product>) =>
    fetchJson<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateProduct: (id: string, data: Partial<Product>) =>
    fetchJson<Product>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteProduct: (id: string) =>
    fetchJson<{ message: string }>(`/products/${id}`, {
      method: 'DELETE',
    }),

  // POS & Orders
  createOrder: (data: {
    items: Array<{
      productId: string;
      name: string;
      barcode?: string;
      unit?: string;
      quantity: number;
      price: number;
      costPrice?: number;
    }>;
    discount?: number;
    paymentMethod: 'cash' | 'vietqr' | 'debt';
    cashGiven?: number;
    customerName?: string;
    customerPhone?: string;
    cashierName?: string;
  }) =>
    fetchJson<Order>('/pos/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getOrders: () => fetchJson<Order[]>('/pos/orders'),

  getVietQrCode: (amount: number, orderCode: string, note?: string) => {
    const params = new URLSearchParams({
      amount: amount.toString(),
      orderCode,
    });
    if (note) params.append('note', note);
    return fetchJson<{ qrDataUrl: string; emvString: string }>(
      `/pos/vietqr?${params.toString()}`
    );
  },

  // Customer Debts
  getDebts: (search = '') => {
    const params = search ? `?search=${encodeURIComponent(search)}` : '';
    return fetchJson<CustomerDebt[]>(`/debts${params}`);
  },
  createDebt: (data: {
    customerName: string;
    phone?: string;
    address?: string;
    amount: number;
    note?: string;
  }) =>
    fetchJson<CustomerDebt>('/debts', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  repayDebt: (id: string, amount: number, note?: string) =>
    fetchJson<CustomerDebt>(`/debts/${id}/repay`, {
      method: 'POST',
      body: JSON.stringify({ amount, note }),
    }),

  // Analytics
  getAnalyticsSummary: () => fetchJson<AnalyticsSummary>('/analytics/summary'),
};
