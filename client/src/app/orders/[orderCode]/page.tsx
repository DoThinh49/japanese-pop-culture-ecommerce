'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { CheckCircle2, Clock, PackageCheck, MapPin, ArrowRight } from 'lucide-react';
import api from '@/lib/api';

interface OrderDetail {
  id: number;
  orderCode: string;
  type: string;
  subtotal: number | string;
  shippingFee: number | string;
  discountAmount: number | string;
  totalAmount: number | string;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
  address?: {
    recipientName: string;
    phone: string;
    streetAddress: string;
    ward: string;
    district: string;
    province: string;
  };
  items: {
    id: number;
    quantity: number;
    unitPrice: number | string;
    subtotal: number | string;
    product: {
      name: string;
      slug: string;
      scale?: string | null;
      images: { imageUrl: string }[];
    };
  }[];
}

export default function OrderDetailPage() {
  const params = useParams();
  const orderCode = params?.orderCode as string;

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await api.get(`/orders/${orderCode}`);
        setOrder(res.data.data);
      } catch (err) {
        console.error('Error fetching order:', err);
      } finally {
        setLoading(false);
      }
    }
    if (orderCode) fetchOrder();
  }, [orderCode]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-xs text-gray-500">
        Đang tải thông tin đơn hàng...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Không tìm thấy đơn hàng</h2>
        <Link
          href="/"
          className="inline-block px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-semibold"
        >
          Về trang chủ
        </Link>
      </div>
    );
  }

  const isPaid = order.paymentStatus === 'FULLY_PAID';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Success Hero Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-gray-900">Đặt Hàng Thành Công!</h1>
          <p className="text-xs text-gray-500 mt-1">
            Cảm ơn bạn đã mua sắm tại <strong>Akiba Store</strong>. Đơn hàng của bạn đã được tiếp nhận.
          </p>
        </div>

        <div className="inline-flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-xl text-xs font-mono border border-gray-200">
          <span className="text-gray-500">Mã đơn hàng:</span>
          <span className="font-bold text-red-600">{order.orderCode}</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs">
          <span
            className={`px-3 py-1 rounded-full font-bold ${
              isPaid
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            {isPaid ? 'Đã thanh toán (VNPay)' : 'Chưa thanh toán (COD)'}
          </span>
          <span className="px-3 py-1 rounded-full font-bold bg-blue-100 text-blue-800">
            {order.type === 'PREORDER'
              ? 'Đang xử lý (Đơn Pre-order)'
              : 'Đang chuẩn bị hàng'}
          </span>
        </div>
      </div>

      {/* Order Details & Items */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left: Items (7 cols) */}
        <div className="md:col-span-7 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-3 flex items-center gap-2">
            <PackageCheck className="w-4 h-4 text-red-600" />
            <span>Chi tiết các sản phẩm</span>
          </h2>

          <div className="divide-y divide-gray-100">
            {order.items.map((item) => (
              <div key={item.id} className="py-3 flex items-center gap-3">
                <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
                  <Image
                    src={
                      item.product.images?.[0]?.imageUrl ||
                      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400'
                    }
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/products/${item.product.slug}`}
                    className="text-xs font-bold text-gray-900 hover:text-red-600 line-clamp-2 transition-colors"
                  >
                    {item.product.name}
                  </Link>
                  <p className="text-[11px] text-gray-500">
                    {item.quantity} x {Number(item.unitPrice).toLocaleString('vi-VN')} đ
                  </p>
                </div>
                <span className="text-xs font-black text-gray-900">
                  {Number(item.subtotal).toLocaleString('vi-VN')} đ
                </span>
              </div>
            ))}
          </div>

          {/* Pricing Calculation */}
          <div className="space-y-1.5 text-xs text-gray-600 pt-3 border-t border-gray-100">
            <div className="flex justify-between">
              <span>Tạm tính</span>
              <span className="font-semibold text-gray-900">
                {Number(order.subtotal).toLocaleString('vi-VN')} đ
              </span>
            </div>
            {Number(order.discountAmount) > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Giảm giá Voucher</span>
                <span className="font-semibold">
                  -{Number(order.discountAmount).toLocaleString('vi-VN')} đ
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Phí vận chuyển</span>
              <span className="font-semibold text-gray-900">
                {Number(order.shippingFee) === 0
                  ? 'Miễn phí'
                  : `${Number(order.shippingFee).toLocaleString('vi-VN')} đ`}
              </span>
            </div>
            <div className="flex justify-between items-baseline pt-2 border-t border-gray-100 text-sm font-black text-gray-900">
              <span>Tổng cộng thanh toán</span>
              <span className="text-xl text-red-600">
                {Number(order.totalAmount).toLocaleString('vi-VN')} đ
              </span>
            </div>
          </div>
        </div>

        {/* Right: Shipping Address & Summary (5 cols) */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-600" />
              <span>Địa chỉ nhận hàng</span>
            </h2>

            {order.address && (
              <div className="text-xs text-gray-700 space-y-1 leading-relaxed">
                <p className="font-bold text-gray-900">{order.address.recipientName}</p>
                <p className="text-gray-500">{order.address.phone}</p>
                <p>
                  {order.address.streetAddress}, {order.address.ward},{' '}
                  {order.address.district}, {order.address.province}
                </p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-3">
            <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-red-600" />
              <span>Thông tin đơn hàng</span>
            </h2>
            <div className="text-xs space-y-2 text-gray-600">
              <div className="flex justify-between">
                <span>Ngày đặt hàng:</span>
                <span className="font-semibold text-gray-800">
                  {new Date(order.createdAt).toLocaleString('vi-VN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Hình thức:</span>
                <span className="font-semibold text-gray-800">
                  {order.paymentMethod === 'VNPAY' ? 'Cổng VNPay' : 'Thanh toán COD'}
                </span>
              </div>
            </div>
          </div>

          <Link
            href="/"
            className="w-full py-3 bg-gray-900 hover:bg-red-600 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-xs"
          >
            <span>Tiếp tục mua sắm</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

