'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Trash2, ShoppingBag, ArrowRight, Tag, ShieldCheck, Truck } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';

export default function CartPage() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, getTotalPrice, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<{
    code: string;
    discount: number;
  } | null>(null);
  const [voucherError, setVoucherError] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-xs text-gray-500">
        Đang tải giỏ hàng...
      </div>
    );
  }

  const subtotal = getTotalPrice();
  const shippingFee = subtotal >= 1000000 || subtotal === 0 ? 0 : 35000;
  const discountAmount = appliedVoucher ? appliedVoucher.discount : 0;
  const totalAmount = Math.max(0, subtotal + shippingFee - discountAmount);

  const handleApplyVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    setVoucherError('');
    const code = voucherCode.trim().toUpperCase();

    if (!code) return;

    if (code === 'WELCOMEOTAKU') {
      if (subtotal < 500000) {
        setVoucherError('Mã WELCOMEOTAKU chỉ áp dụng cho đơn từ 500.000 đ');
        return;
      }
      const calcDiscount = Math.min((subtotal * 10) / 100, 100000);
      setAppliedVoucher({ code, discount: calcDiscount });
    } else if (code === 'FREESHIP50K') {
      if (subtotal < 1000000) {
        setVoucherError('Mã FREESHIP50K chỉ áp dụng cho đơn từ 1.000.000 đ');
        return;
      }
      setAppliedVoucher({ code, discount: 50000 });
    } else {
      setVoucherError('Mã giảm giá không hợp lệ hoặc đã hết hạn');
    }
  };

  const handleProceedToCheckout = () => {
    if (appliedVoucher) {
      sessionStorage.setItem('checkout_voucher', JSON.stringify(appliedVoucher));
    } else {
      sessionStorage.removeItem('checkout_voucher');
    }
    router.push('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Giỏ hàng của bạn đang trống</h2>
        <p className="text-xs text-gray-500 max-w-sm mx-auto">
          Hãy khám phá các mô hình Figure, Manga và Phụ kiện anime chính hãng tại Akiba Store nhé!
        </p>
        <Link
          href="/products"
          className="inline-block px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-md"
        >
          Khám phá sản phẩm ngay
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
          Giỏ Hàng Của Bạn
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Bạn đang có {items.length} món sản phẩm trong giỏ
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Items List (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-100">
            {items.map((item) => (
              <div
                key={item.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                {/* Thumbnail & Info */}
                <div className="flex items-center gap-4 flex-1">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
                    <Image
                      src={item.image || 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400'}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="space-y-1">
                    {item.seriesName && (
                      <span className="text-[10px] font-bold text-red-600 uppercase">
                        {item.seriesName}
                      </span>
                    )}
                    <Link
                      href={`/products/${item.slug}`}
                      className="text-xs font-bold text-gray-900 hover:text-red-600 line-clamp-2 transition-colors"
                    >
                      {item.name}
                    </Link>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-900">
                        {item.price.toLocaleString('vi-VN')} đ
                      </span>
                      {item.status === 'PRE_ORDER' ? (
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded">
                          Pre-order
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                          Có sẵn
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quantity & Actions */}
                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                  {/* Quantity selector */}
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-2.5 py-1 hover:bg-gray-200 text-xs font-bold text-gray-600"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-xs font-bold text-gray-900 bg-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-2.5 py-1 hover:bg-gray-200 text-xs font-bold text-gray-600"
                    >
                      +
                    </button>
                  </div>

                  {/* Item Subtotal */}
                  <span className="text-sm font-black text-red-600 w-28 text-right hidden sm:block">
                    {(item.price * item.quantity).toLocaleString('vi-VN')} đ
                  </span>

                  {/* Remove button */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Xóa sản phẩm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-2">
            <Link
              href="/products"
              className="text-xs font-semibold text-red-600 hover:underline"
            >
              ← Tiếp tục mua sắm
            </Link>
            <button
              onClick={() => clearCart()}
              className="text-xs text-gray-400 hover:text-red-600 transition-colors"
            >
              Xóa sạch giỏ hàng
            </button>
          </div>
        </div>

        {/* Order Summary (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-3">
              Tóm Tắt Đơn Hàng
            </h2>

            {/* Voucher Section */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-700">
                Mã giảm giá / Voucher
              </label>
              <form onSubmit={handleApplyVoucher} className="flex gap-2">
                <input
                  type="text"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                  placeholder="Nhập mã (VD: WELCOMEOTAKU)"
                  className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs uppercase font-mono focus:outline-none focus:border-red-500"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-gray-900 hover:bg-red-600 text-white rounded-lg text-xs font-bold transition-colors"
                >
                  Áp dụng
                </button>
              </form>

              {appliedVoucher && (
                <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Tag className="w-3.5 h-3.5" />
                    <span>{appliedVoucher.code}</span>
                  </div>
                  <span>-{appliedVoucher.discount.toLocaleString('vi-VN')} đ</span>
                </div>
              )}

              {voucherError && (
                <p className="text-[11px] text-red-600 font-medium">
                  {voucherError}
                </p>
              )}

              {/* Suggestions */}
              <div className="text-[10px] text-gray-400 space-y-0.5 pt-1">
                <p>• Mã <code className="text-red-600 font-bold">WELCOMEOTAKU</code>: Giảm 10% (tối đa 100k, đơn từ 500k)</p>
                <p>• Mã <code className="text-red-600 font-bold">FREESHIP50K</code>: Giảm 50k (đơn từ 1 triệu)</p>
              </div>
            </div>

            {/* Calculations */}
            <div className="space-y-2.5 text-xs text-gray-600 pt-2 border-t border-gray-100">
              <div className="flex justify-between">
                <span>Tạm tính</span>
                <span className="font-semibold text-gray-900">
                  {subtotal.toLocaleString('vi-VN')} đ
                </span>
              </div>

              {appliedVoucher && (
                <div className="flex justify-between text-emerald-600">
                  <span>Giảm giá Voucher</span>
                  <span className="font-semibold">
                    -{discountAmount.toLocaleString('vi-VN')} đ
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span>Phí vận chuyển</span>
                <span className="font-semibold text-gray-900">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-600 font-bold">MIỄN PHÍ</span>
                  ) : (
                    `${shippingFee.toLocaleString('vi-VN')} đ`
                  )}
                </span>
              </div>
              {subtotal < 1000000 && (
                <p className="text-[10px] text-gray-400">
                  (Mua thêm {(1000000 - subtotal).toLocaleString('vi-VN')} đ để được Freeship)
                </p>
              )}

              <div className="flex justify-between items-baseline pt-3 border-t border-gray-100 text-sm font-black text-gray-900">
                <span>Tổng cộng</span>
                <span className="text-xl text-red-600">
                  {totalAmount.toLocaleString('vi-VN')} đ
                </span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleProceedToCheckout}
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-2 text-sm"
            >
              <span>Tiến hành đặt hàng</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Guarantees */}
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-2 text-[11px] text-gray-600">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Bảo mật thanh toán & bảo vệ người mua</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span>Giao hàng toàn quốc bảo hiểm vỡ hộp</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
