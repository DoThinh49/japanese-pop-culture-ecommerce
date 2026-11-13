'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Heart, Search, LogOut, ShieldCheck, User as UserIcon, Package, ChevronDown } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useCartStore } from '@/stores/cartStore';

export default function Header() {
  const { user, logout, checkAuth } = useAuthStore();
  const totalCartItems = useCartStore((state) => state.getTotalItems());
  const [mounted, setMounted] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    checkAuth();
  }, [checkAuth]);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      {/* Top Banner */}
      <div className="bg-red-600 text-white text-xs font-medium py-1.5 px-4 text-center">
        <span>🇯🇵 Website Kinh Doanh Sản Phẩm Văn Hóa Đại Chúng Nhật Bản Chính Hãng | Giao hàng toàn quốc</span>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
            <span className="w-9 h-9 rounded-lg bg-red-600 text-white font-black flex items-center justify-center text-xl shadow-md group-hover:scale-105 transition-transform">
              日
            </span>
            <div className="flex flex-col">
              <span className="font-bold text-xl tracking-tight text-gray-900 group-hover:text-red-600 transition-colors">
                Akiba <span className="text-red-600">Store</span>
              </span>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest -mt-1 font-semibold">
                Japan Pop Store
              </span>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl mx-4 hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm Figure, Manga, Nendoroid, One Piece, Jujutsu Kaisen..."
                className="w-full bg-gray-50 text-sm text-gray-900 pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-3">
            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="p-2 text-gray-600 hover:text-red-600 rounded-full hover:bg-gray-50 transition-colors relative"
              title="Yêu thích"
            >
              <Heart className="w-5 h-5" />
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="p-2 text-gray-600 hover:text-red-600 rounded-full hover:bg-gray-50 transition-colors relative"
              title="Giỏ hàng"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center">
                {mounted ? totalCartItems : 0}
              </span>
            </Link>

            {/* User Account */}
            {mounted && user ? (
              <div className="relative pl-2 border-l border-gray-200">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-xs uppercase border border-red-200">
                    {user.fullName ? user.fullName[0] : 'U'}
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-semibold text-gray-800 leading-tight">
                      {user.fullName}
                    </p>
                    <p className="text-[10px] text-red-600 font-medium">
                      {user.role === 'ADMIN' ? '👑 Quản trị viên' : `⭐ ${user.otakuPoints} Điểm`}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>

                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-xs font-bold text-gray-900 truncate">{user.fullName}</p>
                        <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                      </div>

                      {user.role === 'ADMIN' && (
                        <Link
                          href="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          Trang quản trị (Admin)
                        </Link>
                      )}

                      <Link
                        href="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <UserIcon className="w-4 h-4 text-gray-400" />
                        Tài khoản của tôi
                      </Link>

                      <Link
                        href="/orders"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Package className="w-4 h-4 text-gray-400" />
                        Đơn mua của tôi
                      </Link>

                      <div className="border-t border-gray-100 my-1"></div>

                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4 text-red-500" />
                        Đăng xuất
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 pl-2">
                <Link
                  href="/login"
                  className="text-xs font-semibold text-gray-700 hover:text-red-600 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  className="text-xs font-semibold text-white bg-red-600 hover:bg-red-700 px-3.5 py-1.5 rounded-full shadow-sm transition-colors"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Categories Bar */}
        <nav className="flex items-center gap-6 py-2.5 overflow-x-auto text-xs font-medium text-gray-600 border-t border-gray-50 scrollbar-none">
          <Link href="/" className="text-red-600 font-bold whitespace-nowrap">
            Trang chủ
          </Link>
          <Link href="/products?category=mo-hinh-figure" className="hover:text-red-600 whitespace-nowrap transition-colors">
            Mô hình & Figure
          </Link>
          <Link href="/products?category=manga-light-novel" className="hover:text-red-600 whitespace-nowrap transition-colors">
            Manga & Light Novel
          </Link>
          <Link href="/products?category=phu-kien-suu-tam" className="hover:text-red-600 whitespace-nowrap transition-colors">
            Phụ kiện & Standee
          </Link>
          <Link href="/products?category=gunpla-model-kit" className="hover:text-red-600 whitespace-nowrap transition-colors">
            Gunpla & Model Kit
          </Link>
          <Link href="/products?category=thoi-trang" className="hover:text-red-600 whitespace-nowrap transition-colors">
            Thời trang
          </Link>
        </nav>
      </div>
    </header>
  );
}
