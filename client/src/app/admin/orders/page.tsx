'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Search,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import api from '@/lib/api';

interface Order {
  id: number;
  orderCode: string;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
  user: {
    id: number;
    fullName: string;
    email: string;
    phone?: string;
  };
  address: {
    recipientName: string;
    phone: string;
    province: string;
    district: string;
    streetAddress: string;
  };
  items: Array<{
    id: number;
    quantity: number;
    unitPrice: number;
    product: {
      name: string;
      slug: string;
    };
  }>;
}

const ORDER_STATUSES = [
  { value: 'PENDING', label: 'Chờ xử lý (PENDING)' },
  { value: 'CONFIRMED', label: 'Đã xác nhận (CONFIRMED)' },
  { value: 'PROCESSING', label: 'Đang đóng gói (PROCESSING)' },
  { value: 'SHIPPING', label: 'Đang vận chuyển (SHIPPING)' },
  { value: 'DELIVERED', label: 'Đã giao hàng (DELIVERED)' },
  { value: 'COMPLETED', label: 'Hoàn thành (COMPLETED)' },
  { value: 'CANCELLED', label: 'Đã hủy (CANCELLED)' },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      const params: Record<string, string | number> = { page, limit: 12 };
      if (search) params.search = search;
      if (selectedStatus) params.status = selectedStatus;

      const res = await api.get('/admin/orders', { params });
      setOrders(res.data.data.orders || []);
      setTotalPages(res.data.data.pagination.totalPages || 1);
    } catch (err) {
      console.error('Error loading orders:', err);
    } finally {
      setLoading(false);
    }
  }, [page, search, selectedStatus]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    setUpdatingId(orderId);
    setNotification(null);
    try {
      await api.patch(`/admin/orders/${orderId}/status`, { status: newStatus });
      setNotification({
        type: 'success',
        message: `Đã cập nhật trạng thái đơn hàng #${orderId} sang ${newStatus}!`,
      });
      loadOrders();
      setTimeout(() => setNotification(null), 3000);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setNotification({
        type: 'error',
        message: error.response?.data?.message || 'Cập nhật trạng thái thất bại',
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'CONFIRMED':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'PROCESSING':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      case 'SHIPPING':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'DELIVERED':
      case 'COMPLETED':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'CANCELLED':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-red-500" />
            Quản Lý Đơn Hàng
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Theo dõi, xử lý và cập nhật trạng thái các đơn hàng từ khách hàng
          </p>
        </div>
      </div>

      {notification && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-2 text-xs font-semibold ${
            notification.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
              : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
          )}
          {notification.message}
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo mã đơn, khách hàng, số điện thoại..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-red-500"
          >
            <option value="">Tất cả trạng thái</option>
            {ORDER_STATUSES.map((st) => (
              <option key={st.value} value={st.value}>
                {st.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Mã đơn & Ngày tạo</th>
                <th className="py-3.5 px-3">Người nhận / Khách hàng</th>
                <th className="py-3.5 px-3">Sản phẩm</th>
                <th className="py-3.5 px-3">Tổng thanh toán</th>
                <th className="py-3.5 px-3">Phương thức</th>
                <th className="py-3.5 px-3">Trạng thái đơn hàng</th>
                <th className="py-3.5 px-4 text-right">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    Đang tải danh sách đơn hàng...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    Không tìm thấy đơn hàng nào
                  </td>
                </tr>
              ) : (
                orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-white">#{ord.orderCode}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {new Date(ord.createdAt).toLocaleDateString('vi-VN', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="font-bold text-slate-200">
                        {ord.address?.recipientName || ord.user?.fullName}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {ord.address?.phone || ord.user?.phone || 'Chưa có SĐT'}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate max-w-xs">
                        {ord.address?.streetAddress}, {ord.address?.district}
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="text-slate-300 font-medium line-clamp-1 max-w-xs">
                        {ord.items[0]?.product?.name || 'Sản phẩm Anime'}
                      </div>
                      {ord.items.length > 1 && (
                        <span className="text-[10px] text-slate-500">
                          + {ord.items.length - 1} sản phẩm khác
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-3 font-bold text-red-400">
                      {Number(ord.totalAmount).toLocaleString('vi-VN')} đ
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="font-semibold text-slate-300 block">
                        {ord.paymentMethod === 'VNPAY' ? 'VNPAY' : 'COD'}
                      </span>
                      <span
                        className={`text-[10px] font-semibold ${
                          ord.paymentStatus === 'FULLY_PAID'
                            ? 'text-emerald-400'
                            : 'text-amber-400'
                        }`}
                      >
                        {ord.paymentStatus === 'FULLY_PAID' ? 'Đã trả' : 'Chưa trả'}
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      <select
                        disabled={updatingId === ord.id}
                        value={ord.orderStatus}
                        onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                        className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border focus:outline-none cursor-pointer bg-slate-950 ${getStatusColor(
                          ord.orderStatus
                        )} disabled:opacity-50`}
                      >
                        {ORDER_STATUSES.map((st) => (
                          <option key={st.value} value={st.value} className="bg-slate-900 text-white">
                            {st.value}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/orders/${ord.orderCode}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 text-slate-400 hover:text-white underline text-[11px]"
                      >
                        Hóa đơn
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>
              Trang {page} / {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg disabled:opacity-40 hover:bg-slate-800 text-white"
              >
                Trước
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg disabled:opacity-40 hover:bg-slate-800 text-white"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

