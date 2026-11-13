'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, XCircle, ArrowRight, Loader2 } from 'lucide-react';
import api from '@/lib/api';

function VNPayReturnContent() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<{
    isSuccess: boolean;
    message: string;
    orderCode: string;
  } | null>(null);

  useEffect(() => {
    async function verifyPayment() {
      try {
        const queryObj: Record<string, string> = {};
        searchParams.forEach((value, key) => {
          queryObj[key] = value;
        });

        const res = await api.get('/payments/vnpay/return', {
          params: queryObj,
        });

        const data = res.data.data;
        setResult({
          isSuccess: data.isSuccess,
          message: res.data.message || (data.isSuccess ? 'Thanh toán thành công' : 'Thanh toán thất bại'),
          orderCode: data.order?.orderCode || queryObj.vnp_TxnRef || '',
        });
      } catch (err: unknown) {
        const msg =
          err && typeof err === 'object' && 'response' in err
            ? (err as { response?: { data?: { error?: string } } }).response?.data?.error
            : undefined;
        setResult({
          isSuccess: false,
          message: msg || 'Không thể xác thực giao dịch từ VNPay',
          orderCode: searchParams.get('vnp_TxnRef') || '',
        });
      } finally {
        setLoading(false);
      }
    }

    if (searchParams.toString()) {
      verifyPayment();
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
        <h2 className="text-lg font-bold text-gray-900">Đang đối soát giao dịch với VNPay...</h2>
        <p className="text-xs text-gray-500">Vui lòng không đóng trình duyệt trong giây lát.</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Không tìm thấy thông tin giao dịch</h2>
        <Link href="/" className="inline-block px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-semibold">
          Về trang chủ
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-16">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xl p-8 text-center space-y-5">
        {result.isSuccess ? (
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
        ) : (
          <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
            <XCircle className="w-10 h-10" />
          </div>
        )}

        <div className="space-y-1">
          <h1 className="text-2xl font-black text-gray-900">
            {result.isSuccess ? 'Thanh Toán Thành Công!' : 'Giao Dịch Thất Bại'}
          </h1>
          <p className="text-xs text-gray-500">{result.message}</p>
        </div>

        {result.orderCode && (
          <div className="p-3 bg-gray-50 rounded-xl text-xs font-mono text-gray-700 border border-gray-200">
            <span className="text-gray-400">Mã đơn hàng:</span>{' '}
            <strong className="text-red-600">{result.orderCode}</strong>
          </div>
        )}

        <div className="pt-4 flex flex-col gap-2.5">
          {result.orderCode ? (
            <Link
              href={`/orders/${result.orderCode}`}
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-2 text-xs"
            >
              <span>Xem chi tiết hóa đơn</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <Link
              href="/cart"
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs"
            >
              Quay lại giỏ hàng
            </Link>
          )}

          <Link
            href="/"
            className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-xs transition-colors"
          >
            Về trang chủ Akiba Store
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function VNPayReturnPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-gray-500">Đang tải...</div>}>
      <VNPayReturnContent />
    </Suspense>
  );
}

