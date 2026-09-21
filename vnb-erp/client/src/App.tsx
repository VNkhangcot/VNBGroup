import React, { useEffect, useState } from 'react';
import { PosLayout } from './layouts/PosLayout';
import { AuthScreen } from './modules/auth/AuthScreen';
import { MasterAdminPortal } from './modules/admin/MasterAdminPortal';
import { useAuthStore } from './store/authStore';

export const App: React.FC = () => {
  const { isAuthenticated, isLoading, user, checkAuth } = useAuthStore();
  const [adminView, setAdminView] = useState<boolean>(true);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // When user changes, sync adminView mode
  useEffect(() => {
    if (user?.role === 'superadmin') {
      setAdminView(true);
    }
  }, [user?.role]);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-[#07070A] flex flex-col items-center justify-center text-white">
        <img
          src="/vnb-emblem.svg"
          alt="VNB Logo"
          className="w-14 h-14 object-contain mb-4 shadow-[0_0_30px_rgba(255,85,0,0.3)] animate-pulse"
        />
        <div className="text-sm font-mono text-white/60 tracking-wider">
          Đang khởi động VNB Business OS...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  // Super Admin default view is Master Admin Portal
  if (user?.role === 'superadmin' && adminView) {
    return <MasterAdminPortal onSwitchToStoreView={() => setAdminView(false)} />;
  }

  return <PosLayout onSwitchToAdminView={() => setAdminView(true)} />;
};

export default App;
