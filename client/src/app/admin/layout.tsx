'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  TicketPercent,
  Users,
  Store,
  LogOut,
  ShieldCheck,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isLoading, checkAuth } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (mounted && !isLoading) {
      if (!user) {
        router.push('/login?redirect=/admin');
      } else if (user.role !== 'ADMIN' && user.role !== 'STAFF') {
        router.push('/');
      }
    }
  }, [user, isLoading, mounted, router]);

  if (!mounted || isLoading || !user || (user.role !== 'ADMIN' && user.role !== 'STAFF')) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xs text-slate-400 font-medium">Kiểm tra quyền quản trị hệ thống...</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { label: 'Tổng quan', href: '/admin', icon: LayoutDashboard },
    { label: 'Quản lý sản phẩm', href: '/admin/products', icon: Package },
    { label: 'Quản lý đơn hàng', href: '/admin/orders', icon: ShoppingBag },
    { label: 'Mã khuyến mãi', href: '/admin/vouchers', icon: TicketPercent },
    { label: 'Khách hàng', href: '/admin/users', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row text-slate-100 font-sans">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center font-black text-white text-sm">
            A
          </div>
          <span className="font-extrabold text-sm tracking-tight text-white">Akiba Admin</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-slate-400 hover:text-white"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 z-40 h-screen w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-5">
          {/* Logo */}
          <div className="flex items-center gap-3 pb-6 border-b border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-red-500/20">
              A
            </div>
            <div>
              <h2 className="font-black text-sm tracking-tight text-white">AKIBA STORE</h2>
              <p className="text-[10px] text-red-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Quản trị hệ thống
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-red-400 uppercase">
              {user.fullName ? user.fullName[0] : 'A'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">{user.fullName}</p>
              <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/"
              className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-bold transition-colors"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Xem Web</span>
            </Link>
            <button
              onClick={() => logout()}
              className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg bg-red-950/40 hover:bg-red-900/50 text-red-400 hover:text-red-300 text-[11px] font-bold transition-colors border border-red-900/30"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Thoát</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 overflow-y-auto bg-slate-950 p-4 sm:p-8">
        {children}
      </main>
    </div>
  );
}

