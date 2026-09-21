import { create } from 'zustand';
import { TenantConfig } from '../types';
import { api } from '../api/client';

interface ModuleState {
  tenant: TenantConfig | null;
  isLoading: boolean;
  error: string | null;
  setTenant: (tenant: TenantConfig) => void;
  loadTenant: () => Promise<void>;
  updateTenant: (data: Partial<TenantConfig>) => Promise<void>;
  isModuleActive: (moduleKey: string) => boolean;
  toggleModule: (moduleKey: string) => Promise<void>;
  setMode: (mode: 'grocery_lite' | 'retail_standard' | 'sme_pro') => Promise<void>;
}

export const useModuleStore = create<ModuleState>((set, get) => ({
  tenant: null,
  isLoading: false,
  error: null,

  setTenant: (tenant) => set({ tenant }),

  loadTenant: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await api.getTenantConfig();
      set({ tenant: data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  updateTenant: async (data: Partial<TenantConfig>) => {
    try {
      const updated = await api.updateTenantConfig(data);
      set({ tenant: updated });
    } catch (err: any) {
      console.error('Failed to update tenant config:', err);
    }
  },

  isModuleActive: (moduleKey: string) => {
    const { tenant } = get();
    if (!tenant) return true; // Default show all during initial load
    return tenant.activeModules.includes(moduleKey);
  },

  toggleModule: async (moduleKey: string) => {
    const { tenant, updateTenant } = get();
    if (!tenant) return;

    let newModules = [...tenant.activeModules];
    if (newModules.includes(moduleKey)) {
      newModules = newModules.filter((m) => m !== moduleKey);
    } else {
      newModules.push(moduleKey);
    }

    await updateTenant({ activeModules: newModules });
  },

  setMode: async (mode) => {
    const { updateTenant } = get();
    let modules: string[] = ['pos', 'products'];

    if (mode === 'grocery_lite') {
      modules = ['pos', 'products', 'debts', 'analytics'];
    } else if (mode === 'retail_standard') {
      modules = ['pos', 'products', 'inventory', 'debts', 'analytics'];
    } else if (mode === 'sme_pro') {
      modules = ['pos', 'products', 'inventory', 'debts', 'crm', 'hrm', 'analytics', 'multiBranch'];
    }

    await updateTenant({ mode, activeModules: modules });
  },
}));
