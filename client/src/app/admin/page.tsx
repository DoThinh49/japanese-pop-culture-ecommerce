'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  DollarSign,
  ShoppingBag,
  Package,
  Users,
  Clock,
  CheckCircle,
  Truck,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';
import api from '@/lib/api';

interface Stats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  ordersByStatus: Record<string, number>;
  recentOrders: Array<{
    id: number;
    orderCode: string;
    totalAmount: number;
    paymentStatus: string;
    orderStatus: string;
    createdAt: string;
    user: { fullName: string; email: string };
    items: Array<{ product: { name: string } }>;
  }>;
  topProducts: Array<{
    id: number;
    name: string;
    slug: string;
    price: number;
    soldCount: number;
    stockQuantity: number;
    images: Array<{ imageUrl: string }>;
  }>;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await api.get('/admin/stats');
        setStats(res.data.data);
      } catch (err) {
        console.error('Error loading admin stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            Tổng quan hệ thống
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Báo cáo doanh thu, đơn hàng và các hoạt động kinh doanh tại Akiba Store
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-red-600/20"
          >
            + Quản lý sản phẩm
          </Link>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Revenue */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Doanh thu thực tế</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-white">
            {Number(stats.totalRevenue).toLocaleString('vi-VN')} đ
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 mt-2 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Đơn đã hoàn thành & thanh toán</span>
          </div>
        </div>

        {/* Orders */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Tổng số đơn hàng</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-white">{stats.totalOrders}</div>
          <div className="text-[11px] text-slate-400 mt-2">
            Đang chờ xử lý: {stats.ordersByStatus.PENDING || 0} đơn
          </div>
        </div>

        {/* Products */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Sản phẩm trong kho</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-white">{stats.totalProducts}</div>
          <div className="text-[11px] text-slate-400 mt-2">Figure, Manga, Gunpla & Phụ kiện</div>
        </div>

        {/* Customers */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Khách hàng Otaku</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-white">{stats.totalCustomers}</div>
          <div className="text-[11px] text-slate-400 mt-2">Tài khoản thành viên đã đăng ký</div>
        </div>
      </div>

      {/* Order Status Breakdown */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-sm font-bold text-white mb-4">Trạng thái xử lý đơn hàng</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 text-center">
            <span className="text-amber-400 flex items-center justify-center gap-1 text-xs font-bold mb-1">
              <Clock className="w-3.5 h-3.5" /> Chờ xử lý
            </span>
            <span className="text-xl font-black text-white">
              {stats.ordersByStatus.PENDING || 0}
            </span>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 text-center">
            <span className="text-blue-400 flex items-center justify-center gap-1 text-xs font-bold mb-1">
              <CheckCircle className="w-3.5 h-3.5" /> Đã xác nhận
            </span>
            <span className="text-xl font-black text-white">
              {stats.ordersByStatus.CONFIRMED || 0}
            </span>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 text-center">
            <span className="text-indigo-400 flex items-center justify-center gap-1 text-xs font-bold mb-1">
              <Package className="w-3.5 h-3.5" /> Đang đóng gói
            </span>
            <span className="text-xl font-black text-white">
              {stats.ordersByStatus.PROCESSING || 0}
            </span>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 text-center">
            <span className="text-purple-400 flex items-center justify-center gap-1 text-xs font-bold mb-1">
              <Truck className="w-3.5 h-3.5" /> Đang giao
            </span>
            <span className="text-xl font-black text-white">
              {stats.ordersByStatus.SHIPPING || 0}
            </span>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 text-center">
            <span className="text-emerald-400 flex items-center justify-center gap-1 text-xs font-bold mb-1">
              <CheckCircle className="w-3.5 h-3.5" /> Hoàn thành
            </span>
            <span className="text-xl font-black text-white">
              {(stats.ordersByStatus.COMPLETED || 0) + (stats.ordersByStatus.DELIVERED || 0)}
            </span>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 text-center">
            <span className="text-rose-400 flex items-center justify-center gap-1 text-xs font-bold mb-1">
              Đã hủy
            </span>
            <span className="text-xl font-black text-white">
              {stats.ordersByStatus.CANCELLED || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Two Column Section: Recent Orders & Top Selling Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders (2 cols) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-bold text-white">Đơn hàng mới nhất</h2>
            <Link
              href="/admin/orders"
              className="text-xs font-bold text-red-400 hover:text-red-300 flex items-center gap-1"
            >
              Xem tất cả <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-3">Mã đơn</th>
                  <th className="py-3 px-3">Khách hàng</th>
                  <th className="py-3 px-3">Tổng tiền</th>
                  <th className="py-3 px-3">Thanh toán</th>
                  <th className="py-3 px-3">Trạng thái</th>
                  <th className="py-3 px-3 text-right">Chi tiết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {stats.recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-white">
                      #{ord.orderCode}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-200">{ord.user?.fullName}</div>
                      <div className="text-[10px] text-slate-500">{ord.user?.email}</div>
                    </td>
                    <td className="py-3 px-3 font-bold text-red-400">
                      {Number(ord.totalAmount).toLocaleString('vi-VN')} đ
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          ord.paymentStatus === 'FULLY_PAID'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        {ord.paymentStatus === 'FULLY_PAID' ? 'Đã trả' : 'Chưa trả'}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-300">
                        {ord.orderStatus}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Link
                        href={`/orders/${ord.orderCode}`}
                        className="text-slate-400 hover:text-white underline text-[11px]"
                      >
                        Xem
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Selling Products (1 col) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-bold text-white">Sản phẩm bán chạy</h2>
            <Link
              href="/admin/products"
              className="text-xs font-bold text-red-400 hover:text-red-300 flex items-center gap-1"
            >
              Kho hàng <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {stats.topProducts.map((p) => (
              <div key={p.id} className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden relative flex-shrink-0">
                  {p.images?.[0]?.imageUrl ? (
                    <Image
                      src={p.images[0].imageUrl}
                      alt={p.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500">
                      <Package className="w-4 h-4" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-slate-200 truncate">{p.name}</h4>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                    <span className="text-red-400 font-bold">
                      {Number(p.price).toLocaleString('vi-VN')} đ
                    </span>
                    <span>Đã bán: {p.soldCount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

