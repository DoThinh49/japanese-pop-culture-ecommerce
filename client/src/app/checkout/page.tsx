'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { CreditCard, Truck, AlertCircle, Lock, ShieldCheck, QrCode } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import api from '@/lib/api';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { user, token } = useAuthStore();

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Shipping Form State
  const [formData, setFormData] = useState({
    recipientName: '',
    phone: '',
    province: 'Thành phố Hồ Chí Minh',
    district: 'Quận 1',
    ward: 'Phường Bến Nghé',
    streetAddress: '',
    note: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'VNPAY'>('VNPAY');
  const [appliedVoucher, setAppliedVoucher] = useState<{
    code: string;
    discount: number;
  } | null>(null);

  useEffect(() => {
    setMounted(true);
    // Read voucher if saved from cart
    const saved = sessionStorage.getItem('checkout_voucher');
    if (saved) {
      try {
        setAppliedVoucher(JSON.parse(saved));
      } catch {
        // ignore
      }
    }

    // Auto-fill user name and phone if available
    if (user) {
      setFormData((prev) => ({
        ...prev,
        recipientName: user.fullName || '',
        phone: user.phone || '',
      }));
    }
  }, [user]);

  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-xs text-gray-500">
        Đang tải thông tin thanh toán...
      </div>
    );
  }

  // If cart is empty, redirect to cart
  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Giỏ hàng của bạn đang trống</h2>
        <Link
          href="/products"
          className="inline-block px-5 py-2.5 bg-red-600 text-white rounded-xl text-xs font-bold"
        >
          Khám phá sản phẩm
        </Link>
      </div>
    );
  }

  const subtotal = getTotalPrice();
  const shippingFee = subtotal >= 1000000 ? 0 : 35000;
  const discountAmount = appliedVoucher ? appliedVoucher.discount : 0;
  const totalAmount = Math.max(0, subtotal + shippingFee - discountAmount);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Vui lòng đăng nhập tài khoản để tiến hành đặt hàng');
      return;
    }

    setLoading(true);

    try {
      const orderPayload = {
        recipientName: formData.recipientName,
        phone: formData.phone,
        province: formData.province,
        district: formData.district,
        ward: formData.ward,
        streetAddress: formData.streetAddress,
        note: formData.note,
        paymentMethod,
        voucherCode: appliedVoucher?.code,
        items: items.map((i) => ({
          productId: i.id,
          quantity: i.quantity,
        })),
      };

      const res = await api.post('/orders', orderPayload);
      const { order, paymentUrl } = res.data.data;

      // Clear cart
      clearCart();
      sessionStorage.removeItem('checkout_voucher');

      if (paymentMethod === 'VNPAY' && paymentUrl) {
        // Redirect to VNPay Gateway
        window.location.href = paymentUrl;
      } else {
        // Redirect to Order Success Page
        router.push(`/orders/${order.orderCode}`);
      }
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { error?: string } } }).response?.data?.error
          : undefined;
      setError(msg || 'Không thể tạo đơn hàng, vui lòng thử lại');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
          Xác Nhận & Thanh Toán
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Hoàn tất đơn hàng với cổng thanh toán bảo mật VNPay hoặc thanh toán khi nhận hàng
        </p>
      </div>

      {!token && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs text-amber-800">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>Bạn chưa đăng nhập. Hãy đăng nhập để lưu lịch sử đơn hàng và tích điểm Otaku.</span>
          </div>
          <Link
            href="/login"
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition-colors whitespace-nowrap"
          >
            Đăng nhập ngay
          </Link>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Shipping & Payment Info (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Shipping Address */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-3 flex items-center gap-2">
              <Truck className="w-4 h-4 text-red-600" />
              <span>1. Thông tin giao hàng</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Họ tên người nhận *
                </label>
                <input
                  type="text"
                  required
                  value={formData.recipientName}
                  onChange={(e) =>
                    setFormData({ ...formData, recipientName: e.target.value })
                  }
                  placeholder="Nguyễn Văn A"
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-red-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Số điện thoại *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="0912345678"
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-red-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Tỉnh / Thành phố *
                </label>
                <input
                  type="text"
                  required
                  value={formData.province}
                  onChange={(e) =>
                    setFormData({ ...formData, province: e.target.value })
                  }
                  placeholder="TP. Hồ Chí Minh"
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-red-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Quận / Huyện *
                </label>
                <input
                  type="text"
                  required
                  value={formData.district}
                  onChange={(e) =>
                    setFormData({ ...formData, district: e.target.value })
                  }
                  placeholder="Quận 1"
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-red-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Phường / Xã *
                </label>
                <input
                  type="text"
                  required
                  value={formData.ward}
                  onChange={(e) =>
                    setFormData({ ...formData, ward: e.target.value })
                  }
                  placeholder="Phường Bến Nghé"
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-red-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Địa chỉ số nhà, tên đường *
                </label>
                <input
                  type="text"
                  required
                  value={formData.streetAddress}
                  onChange={(e) =>
                    setFormData({ ...formData, streetAddress: e.target.value })
                  }
                  placeholder="123 Đường Lê Lợi"
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-red-500 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Ghi chú giao hàng (Tùy chọn)
              </label>
              <textarea
                rows={2}
                value={formData.note}
                onChange={(e) =>
                  setFormData({ ...formData, note: e.target.value })
                }
                placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi đến..."
                className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-red-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-3 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-red-600" />
              <span>2. Phương thức thanh toán</span>
            </h2>

            <div className="space-y-3">
              {/* VNPay Option */}
              <label
                className={`p-4 rounded-xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                  paymentMethod === 'VNPAY'
                    ? 'border-red-600 bg-red-50/40 ring-2 ring-red-100'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="VNPAY"
                  checked={paymentMethod === 'VNPAY'}
                  onChange={() => setPaymentMethod('VNPAY')}
                  className="mt-1 text-red-600 focus:ring-red-500"
                />
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                      <QrCode className="w-4 h-4 text-red-600" />
                      Cổng thanh toán VNPay (Quét mã QR / Thẻ ATM / Visa)
                    </span>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 font-bold text-[10px] rounded">
                      Khuyên dùng
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500">
                    Chuyển hướng an toàn tới VNPay Sandbox để thanh toán trực tuyến bảo mật.
                  </p>
                </div>
              </label>

              {/* COD Option */}
              <label
                className={`p-4 rounded-xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                  paymentMethod === 'COD'
                    ? 'border-red-600 bg-red-50/40 ring-2 ring-red-100'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={paymentMethod === 'COD'}
                  onChange={() => setPaymentMethod('COD')}
                  className="mt-1 text-red-600 focus:ring-red-500"
                />
                <div className="space-y-1">
                  <span className="text-xs font-bold text-gray-900">
                    Thanh toán khi nhận hàng (COD)
                  </span>
                  <p className="text-[11px] text-gray-500">
                    Kiểm tra hàng và thanh toán tiền mặt cho nhân viên giao vận tại nhà.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right: Order Summary Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-3">
              Đơn hàng của bạn ({items.length} món)
            </h2>

            {/* Items mini list */}
            <div className="max-h-64 overflow-y-auto divide-y divide-gray-100 pr-1 space-y-3">
              {items.map((i) => (
                <div key={i.id} className="pt-2 flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
                    <Image
                      src={i.image || 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400'}
                      alt={i.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-900 truncate">
                      {i.name}
                    </p>
                    <p className="text-[11px] text-gray-500">
                      {i.quantity} x {i.price.toLocaleString('vi-VN')} đ
                    </p>
                  </div>
                  <span className="text-xs font-bold text-gray-900">
                    {(i.price * i.quantity).toLocaleString('vi-VN')} đ
                  </span>
                </div>
              ))}
            </div>

            {/* Cost breakdown */}
            <div className="space-y-2 text-xs text-gray-600 pt-3 border-t border-gray-100">
              <div className="flex justify-between">
                <span>Tạm tính</span>
                <span className="font-semibold text-gray-900">
                  {subtotal.toLocaleString('vi-VN')} đ
                </span>
              </div>

              {appliedVoucher && (
                <div className="flex justify-between text-emerald-600">
                  <span>Voucher ({appliedVoucher.code})</span>
                  <span className="font-semibold">
                    -{discountAmount.toLocaleString('vi-VN')} đ
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Phí vận chuyển</span>
                <span className="font-semibold text-gray-900">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-600 font-bold">MIỄN PHÍ</span>
                  ) : (
                    `${shippingFee.toLocaleString('vi-VN')} đ`
                  )}
                </span>
              </div>

              <div className="flex justify-between items-baseline pt-3 border-t border-gray-100 text-sm font-black text-gray-900">
                <span>Tổng thanh toán</span>
                <span className="text-2xl text-red-600">
                  {totalAmount.toLocaleString('vi-VN')} đ
                </span>
              </div>
            </div>

            {/* Confirm button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-60"
            >
              <Lock className="w-4 h-4" />
              <span>
                {loading
                  ? 'Đang xử lý...'
                  : paymentMethod === 'VNPAY'
                  ? 'Thanh toán qua VNPay'
                  : 'Xác nhận đặt hàng COD'}
              </span>
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-gray-400 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Giao dịch an toàn được bảo mật 256-bit SSL</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

