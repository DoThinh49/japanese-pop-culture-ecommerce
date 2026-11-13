'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Package, Clock, CheckCircle, Truck, XCircle, ArrowRight, ExternalLink } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';

interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  product: {
    id: number;
    name: string;
    slug: string;
    images?: { imageUrl: string }[];
  };
}

interface Order {
  id: number;
  orderCode: string;
  type: string;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
  items: OrderItem[];
  address: {
    recipientName: string;
    phone: string;
    province: string;
    district: string;
    ward: string;
    streetAddress: string;
  };
}

export default function MyOrdersPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('ALL');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/orders');
      return;
    }

    if (user) {
      fetchOrders();
    }
  }, [user, authLoading, router]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/orders/my-orders');
      setOrders(res.data.data || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5" /> Chờ xử lý / Chờ thanh toán
          </span>
        );
      case 'CONFIRMED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <CheckCircle className="w-3.5 h-3.5" /> Đã xác nhận
          </span>
        );
      case 'PROCESSING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Package className="w-3.5 h-3.5" /> Đang đóng gói
          </span>
        );
      case 'SHIPPING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            <Truck className="w-3.5 h-3.5" /> Đang vận chuyển
          </span>
        );
      case 'DELIVERED':
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle className="w-3.5 h-3.5" /> Hoàn thành
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3.5 h-3.5" /> Đã hủy
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
            {status}
          </span>
        );
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'PENDING') return order.orderStatus === 'PENDING';
    if (activeTab === 'PROCESSING')
      return order.orderStatus === 'CONFIRMED' || order.orderStatus === 'PROCESSING';
    if (activeTab === 'SHIPPING') return order.orderStatus === 'SHIPPING';
    if (activeTab === 'COMPLETED')
      return order.orderStatus === 'COMPLETED' || order.orderStatus === 'DELIVERED';
    if (activeTab === 'CANCELLED') return order.orderStatus === 'CANCELLED';
    return true;
  });

  const tabs = [
    { key: 'ALL', label: 'Tất cả' },
    { key: 'PENDING', label: 'Chờ thanh toán / Xử lý' },
    { key: 'PROCESSING', label: 'Đang chuẩn bị' },
    { key: 'SHIPPING', label: 'Đang giao' },
    { key: 'COMPLETED', label: 'Hoàn thành' },
    { key: 'CANCELLED', label: 'Đã hủy' },
  ];

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-gray-500 font-medium">Đang tải lịch sử đơn hàng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-200 mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
              <Package className="w-6 h-6 text-red-600" />
              Đơn Mua Của Tôi
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Quản lý và theo dõi quá trình giao nhận các đơn hàng bạn đã đặt
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-4 py-2.5 rounded-xl transition-colors self-start"
          >
            Tiếp tục mua sắm
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === tab.key
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {tab.label}
              {tab.key === 'ALL' && ` (${orders.length})`}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-10 h-10" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1">Chưa có đơn hàng nào</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto mb-6">
              Bạn chưa có đơn hàng nào trong mục này. Hãy khám phá ngay các sản phẩm Anime & Figure độc đáo tại Akiba Store!
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-red-200"
            >
              Khám phá sản phẩm ngay
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-gray-200 shadow-xs hover:border-gray-300 transition-all overflow-hidden"
              >
                {/* Order Top Bar */}
                <div className="px-5 py-3.5 bg-gray-50/70 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-extrabold text-gray-900 tracking-wide">
                      #{order.orderCode}
                    </span>
                    <span className="text-gray-400">|</span>
                    <span className="text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('vi-VN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <div>{getStatusBadge(order.orderStatus)}</div>
                </div>

                {/* Items */}
                <div className="p-5 divide-y divide-gray-100">
                  {order.items.map((item) => (
                    <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 relative border border-gray-200">
                        {item.product?.images?.[0]?.imageUrl ? (
                          <Image
                            src={item.product.images[0].imageUrl}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Package className="w-6 h-6" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/products/${item.product?.slug}`}
                          className="text-xs sm:text-sm font-bold text-gray-900 hover:text-red-600 line-clamp-1 transition-colors"
                        >
                          {item.product?.name}
                        </Link>
                        <p className="text-[11px] text-gray-500 mt-0.5">Số lượng: x{item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs sm:text-sm font-bold text-red-600">
                          {Number(item.unitPrice).toLocaleString('vi-VN')} đ
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div className="px-5 py-4 bg-gray-50/50 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="text-xs text-gray-600">
                    <span>Phương thức: </span>
                    <span className="font-semibold text-gray-800">
                      {order.paymentMethod === 'VNPAY' ? 'Ví điện tử VNPAY' : 'Thanh toán COD'}
                    </span>
                    <span className="mx-2">•</span>
                    <span>Thanh toán: </span>
                    <span
                      className={`font-semibold ${
                        order.paymentStatus === 'FULLY_PAID' ? 'text-emerald-600' : 'text-amber-600'
                      }`}
                    >
                      {order.paymentStatus === 'FULLY_PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <div className="text-right">
                      <span className="text-xs text-gray-500 block">Tổng thanh toán:</span>
                      <span className="text-base font-black text-red-600">
                        {Number(order.totalAmount).toLocaleString('vi-VN')} đ
                      </span>
                    </div>

                    <Link
                      href={`/orders/${order.orderCode}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-xs font-bold text-gray-800 rounded-xl transition-colors shadow-xs"
                    >
                      Xem chi tiết
                      <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

