'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  User as UserIcon,
  MapPin,
  Lock,
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Save,
  Check,
} from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';

interface Address {
  id: number;
  recipientName: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  streetAddress: string;
  isDefault: boolean;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, setUser, isLoading: authLoading } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'password'>('profile');

  // Profile Form state
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // Addresses state
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);
  const [newAddress, setNewAddress] = useState({
    recipientName: '',
    phone: '',
    province: '',
    district: '',
    ward: '',
    streetAddress: '',
    isDefault: false,
  });

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const loadUserData = useCallback(async () => {
    try {
      const res = await api.get('/auth/me');
      const data = res.data.data;
      setUser(data);
      setFullName(data.fullName || '');
      setPhone(data.phone || '');
      setAddresses(data.addresses || []);
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  }, [setUser]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/profile');
      return;
    }
    if (user) {
      setFullName(user.fullName || '');
      setPhone(user.phone || '');
      loadUserData();
    }
  }, [user, authLoading, router, loadUserData]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileSuccess('');
    setProfileError('');

    try {
      const res = await api.put('/auth/profile', { fullName, phone });
      setUser({ ...user!, fullName: res.data.data.fullName, phone: res.data.data.phone });
      setProfileSuccess('Cập nhật hồ sơ thành công!');
      setTimeout(() => setProfileSuccess(''), 3000);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setProfileError(error.response?.data?.message || 'Cập nhật thất bại');
    } finally {
      setProfileSaving(false);
    }
  };

  const handleCreateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddressLoading(true);
    try {
      await api.post('/auth/addresses', newAddress);
      setShowAddressModal(false);
      setNewAddress({
        recipientName: '',
        phone: '',
        province: '',
        district: '',
        ward: '',
        streetAddress: '',
        isDefault: false,
      });
      await loadUserData();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      alert(error.response?.data?.message || 'Thêm địa chỉ thất bại');
    } finally {
      setAddressLoading(false);
    }
  };

  const handleSetDefaultAddress = async (addressId: number) => {
    try {
      await api.patch(`/auth/addresses/${addressId}/default`);
      await loadUserData();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      alert(error.response?.data?.message || 'Lỗi thao tác');
    }
  };

  const handleDeleteAddress = async (addressId: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa địa chỉ nhận hàng này?')) return;
    try {
      await api.delete(`/auth/addresses/${addressId}`);
      await loadUserData();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      alert(error.response?.data?.message || 'Xóa địa chỉ thất bại');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordSuccess('');
    setPasswordError('');

    if (newPassword.length < 6) {
      setPasswordError('Mật khẩu mới phải có ít nhất 6 ký tự');
      setPasswordLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Xác nhận mật khẩu mới không trùng khớp');
      setPasswordLoading(false);
      return;
    }

    try {
      await api.put('/auth/change-password', {
        currentPassword,
        newPassword,
      });
      setPasswordSuccess('Đổi mật khẩu thành công!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(''), 3000);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setPasswordError(error.response?.data?.message || 'Đổi mật khẩu thất bại');
    } finally {
      setPasswordLoading(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header Profile Card */}
        <div className="bg-gradient-to-r from-red-600 to-rose-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-red-200/50 mb-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-3xl font-black uppercase text-white shadow-inner">
              {user.fullName ? user.fullName[0] : 'U'}
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black">{user.fullName}</h1>
              <p className="text-xs text-red-100 mt-0.5">{user.email}</p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-semibold mt-2.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>
                  {user.role === 'ADMIN'
                    ? 'Quản trị viên Cửa hàng'
                    : 'Thành viên Otaku chính thức'}
                </span>
              </div>
            </div>
          </div>

          {/* Otaku Points Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:px-6 text-center w-full sm:w-auto">
            <span className="text-xs text-red-100 font-medium block">Điểm tích lũy Otaku</span>
            <div className="text-2xl sm:text-3xl font-black text-amber-300 mt-1 flex items-center justify-center gap-1">
              ⭐ {user.otakuPoints || 0}
            </div>
            <span className="text-[11px] text-red-200 block mt-1">1 điểm = 1.000 đ giảm giá</span>
          </div>
        </div>

        {/* Profile Tabs Navigation */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-1.5 flex gap-1 mb-8">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'profile'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <UserIcon className="w-4 h-4" />
            Hồ sơ cá nhân
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'addresses'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <MapPin className="w-4 h-4" />
            Sổ địa chỉ ({addresses.length})
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'password'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Lock className="w-4 h-4" />
            Đổi mật khẩu
          </button>
        </div>

        {/* Tab 1: Profile Info */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs">
            <h2 className="text-base font-bold text-gray-900 mb-6 pb-3 border-b border-gray-100">
              Thông Tin Tài Khoản
            </h2>

            {profileSuccess && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                {profileSuccess}
              </div>
            )}

            {profileError && (
              <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {profileError}
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-5 max-w-lg">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Địa chỉ Email (Định danh)
                </label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-100 text-gray-500 text-xs cursor-not-allowed"
                />
                <p className="text-[11px] text-gray-400 mt-1">Email không thể thay đổi sau khi đăng ký</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Họ và tên
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Số điện thoại liên hệ
                </label>
                <input
                  type="tel"
                  placeholder="0912345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent text-xs"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={profileSaving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-md shadow-red-200 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {profileSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 2: Addresses */}
        {activeTab === 'addresses' && (
          <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-900">Sổ Địa Chỉ Nhận Hàng</h2>
              <button
                onClick={() => setShowAddressModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Thêm địa chỉ mới
              </button>
            </div>

            {addresses.length === 0 ? (
              <div className="text-center py-10">
                <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-xs text-gray-500 font-medium">Bạn chưa lưu địa chỉ giao hàng nào</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`p-5 rounded-2xl border transition-all ${
                      addr.isDefault
                        ? 'border-red-600 bg-red-50/20'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-xs text-gray-900">{addr.recipientName}</span>
                      {addr.isDefault && (
                        <span className="text-[10px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
                          Mặc định
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mb-1">{addr.phone}</p>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {addr.streetAddress}, {addr.ward}, {addr.district}, {addr.province}
                    </p>

                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100 text-xs">
                      {!addr.isDefault ? (
                        <button
                          onClick={() => handleSetDefaultAddress(addr.id)}
                          className="text-gray-500 hover:text-red-600 text-[11px] font-medium"
                        >
                          Thiết lập mặc định
                        </button>
                      ) : (
                        <span className="text-emerald-600 flex items-center gap-1 text-[11px] font-semibold">
                          <Check className="w-3.5 h-3.5" /> Địa chỉ giao chính
                        </span>
                      )}
                      <button
                        onClick={() => handleDeleteAddress(addr.id)}
                        className="text-gray-400 hover:text-rose-600 p-1 rounded-md transition-colors"
                        title="Xóa địa chỉ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Change Password */}
        {activeTab === 'password' && (
          <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs">
            <h2 className="text-base font-bold text-gray-900 mb-6 pb-3 border-b border-gray-100">
              Đổi Mật Khẩu
            </h2>

            {passwordSuccess && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                {passwordSuccess}
              </div>
            )}

            {passwordError && (
              <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {passwordError}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4 max-w-lg">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Mật khẩu hiện tại
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Mật khẩu mới (tối thiểu 6 ký tự)
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Nhập lại mật khẩu mới
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent text-xs"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-md shadow-red-200 disabled:opacity-50"
                >
                  <Lock className="w-4 h-4" />
                  {passwordLoading ? 'Đang xử lý...' : 'Cập nhật mật khẩu'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Modal: Add Address */}
        {showAddressModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl">
              <h3 className="text-base font-black text-gray-900 mb-4 pb-2 border-b border-gray-100">
                Thêm Địa Chỉ Nhận Hàng Mới
              </h3>

              <form onSubmit={handleCreateAddress} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Tên người nhận</label>
                  <input
                    type="text"
                    required
                    value={newAddress.recipientName}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, recipientName: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-600 focus:outline-none"
                    placeholder="VD: Nguyễn Văn A"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Số điện thoại</label>
                  <input
                    type="tel"
                    required
                    value={newAddress.phone}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, phone: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-600 focus:outline-none"
                    placeholder="VD: 0912345678"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Tỉnh / Thành phố</label>
                    <input
                      type="text"
                      required
                      value={newAddress.province}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, province: e.target.value })
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-600 focus:outline-none"
                      placeholder="VD: Hà Nội"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Quận / Huyện</label>
                    <input
                      type="text"
                      required
                      value={newAddress.district}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, district: e.target.value })
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-600 focus:outline-none"
                      placeholder="VD: Cầu Giấy"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Phường / Xã</label>
                  <input
                    type="text"
                    required
                    value={newAddress.ward}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, ward: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-600 focus:outline-none"
                    placeholder="VD: Dịch Vọng Hậu"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Địa chỉ chi tiết</label>
                  <input
                    type="text"
                    required
                    value={newAddress.streetAddress}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, streetAddress: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-600 focus:outline-none"
                    placeholder="Số nhà, ngõ, tên đường..."
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="setDefault"
                    checked={newAddress.isDefault}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, isDefault: e.target.checked })
                    }
                    className="rounded text-red-600 focus:ring-red-500 w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="setDefault" className="text-gray-700 text-xs cursor-pointer">
                    Đặt làm địa chỉ giao hàng mặc định
                  </label>
                </div>

                <div className="flex items-center justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddressModal(false)}
                    className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 font-bold hover:bg-gray-100 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={addressLoading}
                    className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition-colors disabled:opacity-50"
                  >
                    {addressLoading ? 'Đang lưu...' : 'Lưu địa chỉ'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

