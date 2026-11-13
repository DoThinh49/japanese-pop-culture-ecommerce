'use client';

import React, { useEffect, useState } from 'react';
import { Users, Shield, Sparkles } from 'lucide-react';
import api from '@/lib/api';

interface User {
  id: number;
  email: string;
  fullName: string;
  phone?: string;
  role: string;
  otakuPoints: number;
  isActive: boolean;
  createdAt: string;
  _count?: {
    orders: number;
  };
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUsers() {
      try {
        setLoading(true);
        const res = await api.get('/admin/users');
        setUsers(res.data.data || []);
      } catch (err) {
        console.error('Error loading users:', err);
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-red-500" />
            Khách Hàng & Thành Viên Otaku
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Danh sách tài khoản khách hàng, điểm tích lũy Otaku và phân quyền hệ thống
          </p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Thành viên</th>
                <th className="py-3.5 px-3">Email</th>
                <th className="py-3.5 px-3">Số điện thoại</th>
                <th className="py-3.5 px-3">Vai trò</th>
                <th className="py-3.5 px-3">Điểm Otaku</th>
                <th className="py-3.5 px-3">Đơn đã đặt</th>
                <th className="py-3.5 px-4 text-right">Ngày gia nhập</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    Đang tải danh sách người dùng...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    Chưa có người dùng nào
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-red-400 text-xs uppercase">
                          {u.fullName ? u.fullName[0] : 'U'}
                        </div>
                        <span className="font-bold text-white">{u.fullName}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-slate-300 font-mono text-[11px]">{u.email}</td>
                    <td className="py-3.5 px-3 text-slate-400">{u.phone || 'Chưa cập nhật'}</td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          u.role === 'ADMIN'
                            ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                            : u.role === 'STAFF'
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {u.role === 'ADMIN' && <Shield className="w-3 h-3" />}
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="inline-flex items-center gap-1 font-bold text-amber-400">
                        <Sparkles className="w-3 h-3" />
                        {u.otakuPoints || 0} điểm
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-slate-300">
                      {u._count?.orders || 0} đơn
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-500 text-[11px]">
                      {new Date(u.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

