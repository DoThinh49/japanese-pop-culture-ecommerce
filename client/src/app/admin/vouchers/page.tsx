'use client';

import React, { useEffect, useState } from 'react';
import {
  TicketPercent,
  Plus,
  CheckCircle2,
  AlertCircle,
  X,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import api from '@/lib/api';

interface Voucher {
  id: number;
  code: string;
  type: string;
  value: number;
  minOrderAmount: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export default function AdminVouchersPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [formData, setFormData] = useState({
    code: '',
    type: 'FIXED_AMOUNT',
    value: '',
    minOrderAmount: '0',
    maxDiscount: '',
    usageLimit: '100',
  });

  const loadVouchers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/vouchers');
      setVouchers(res.data.data || []);
    } catch (err) {
      console.error('Error loading vouchers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVouchers();
  }, []);

  const handleCreateVoucher = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setNotification(null);

    try {
      await api.post('/admin/vouchers', {
        code: formData.code.toUpperCase().trim(),
        type: formData.type,
        value: Number(formData.value),
        minOrderAmount: Number(formData.minOrderAmount) || 0,
        maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : undefined,
        usageLimit: formData.usageLimit ? Number(formData.usageLimit) : undefined,
      });

      setNotification({
        type: 'success',
        message: `Đã tạo thành công voucher ${formData.code.toUpperCase()}!`,
      });
      setShowModal(false);
      setFormData({
        code: '',
        type: 'FIXED_AMOUNT',
        value: '',
        minOrderAmount: '0',
        maxDiscount: '',
        usageLimit: '100',
      });
      loadVouchers();
      setTimeout(() => setNotification(null), 3000);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setNotification({
        type: 'error',
        message: error.response?.data?.message || 'Không thể tạo mã voucher',
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleToggle = async (id: number) => {
    try {
      await api.patch(`/admin/vouchers/${id}/toggle`);
      loadVouchers();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      alert(error.response?.data?.message || 'Lỗi thao tác');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <TicketPercent className="w-6 h-6 text-red-500" />
            Mã Khuyến Mãi & Giảm Giá
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Thiết lập các mã voucher khuyến mãi cho các sự kiện Otaku và người dùng mới
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-red-600/20"
        >
          <Plus className="w-4 h-4" />
          Tạo mã voucher mới
        </button>
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

      {/* Vouchers Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Mã Voucher</th>
                <th className="py-3.5 px-3">Loại giảm</th>
                <th className="py-3.5 px-3">Giá trị giảm</th>
                <th className="py-3.5 px-3">Đơn tối thiểu</th>
                <th className="py-3.5 px-3">Lượt đã dùng</th>
                <th className="py-3.5 px-3">Thời hạn</th>
                <th className="py-3.5 px-4 text-right">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    Đang tải danh sách voucher...
                  </td>
                </tr>
              ) : vouchers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    Chưa có mã khuyến mãi nào
                  </td>
                </tr>
              ) : (
                vouchers.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 bg-red-600/10 border border-red-600/30 text-red-400 font-mono font-black rounded-lg text-xs tracking-wider">
                        {v.code}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-slate-300">
                      {v.type === 'PERCENTAGE' ? 'Theo tỷ lệ %' : 'Số tiền cố định'}
                    </td>
                    <td className="py-3.5 px-3 font-bold text-white">
                      {v.type === 'PERCENTAGE'
                        ? `${v.value}%`
                        : `${Number(v.value).toLocaleString('vi-VN')} đ`}
                    </td>
                    <td className="py-3.5 px-3 text-slate-400">
                      {Number(v.minOrderAmount).toLocaleString('vi-VN')} đ
                    </td>
                    <td className="py-3.5 px-3 text-slate-300">
                      <span className="font-semibold text-white">{v.usedCount}</span>
                      {v.usageLimit ? ` / ${v.usageLimit}` : ' / Vô hạn'}
                    </td>
                    <td className="py-3.5 px-3 text-[11px] text-slate-400">
                      {new Date(v.endDate).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleToggle(v.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[11px] font-bold transition-colors ${
                          v.isActive
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20'
                        }`}
                      >
                        {v.isActive ? (
                          <>
                            <ToggleRight className="w-4 h-4" /> Kích hoạt
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="w-4 h-4" /> Đã tắt
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create Voucher */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 text-xs shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <h3 className="text-base font-black text-white">Tạo Mã Voucher Khuyến Mãi</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateVoucher} className="space-y-4">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Mã Voucher (Code) *</label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="VD: OTAKU2027"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white uppercase font-mono focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Loại giảm giá</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="FIXED_AMOUNT">Số tiền (VNĐ)</option>
                    <option value="PERCENTAGE">Phần trăm (%)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Giá trị giảm *</label>
                  <input
                    type="number"
                    required
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    placeholder={formData.type === 'PERCENTAGE' ? 'VD: 10' : 'VD: 50000'}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Giá trị đơn hàng tối thiểu (VNĐ)
                </label>
                <input
                  type="number"
                  value={formData.minOrderAmount}
                  onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                  placeholder="VD: 500000 (0 nếu không yêu cầu)"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    Giảm tối đa (nếu chọn %)
                  </label>
                  <input
                    type="number"
                    value={formData.maxDiscount}
                    onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                    placeholder="VD: 100000"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Số lượt dùng tối đa</label>
                  <input
                    type="number"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                    placeholder="VD: 100"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 border border-slate-800 hover:bg-slate-800 rounded-xl text-slate-300 font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-md shadow-red-600/20 disabled:opacity-50"
                >
                  {formLoading ? 'Đang tạo...' : 'Tạo voucher'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

