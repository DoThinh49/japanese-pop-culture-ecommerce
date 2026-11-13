'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  CreditCard,
  QrCode,
  ShieldCheck,
  Building2,
  Clock,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  HelpCircle,
} from 'lucide-react';

const BANKS = [
  { id: 'NCB', name: 'NCB (Test Bank)', code: 'NCB', color: 'bg-blue-600 text-white', recommended: true },
  { id: 'VCB', name: 'Vietcombank', code: 'VCB', color: 'bg-emerald-700 text-white' },
  { id: 'TCB', name: 'Techcombank', code: 'TCB', color: 'bg-red-600 text-white' },
  { id: 'BIDV', name: 'BIDV', code: 'BIDV', color: 'bg-teal-700 text-white' },
  { id: 'MB', name: 'MBBank', code: 'MB', color: 'bg-blue-700 text-white' },
  { id: 'ACB', name: 'ACB', code: 'ACB', color: 'bg-blue-500 text-white' },
  { id: 'VPB', name: 'VPBank', code: 'VPB', color: 'bg-green-600 text-white' },
  { id: 'TPB', name: 'TPBank', code: 'TPB', color: 'bg-purple-600 text-white' },
];

function VNPaySimulatorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderCode = searchParams.get('orderCode') || 'ORD-DEMO';
  const amount = Number(searchParams.get('amount')) || 100000;
  const orderInfo = searchParams.get('orderInfo') || `Thanh toan don hang ${orderCode}`;

  const [activeTab, setActiveTab] = useState<'qr' | 'atm' | 'intl'>('atm');
  const [selectedBank, setSelectedBank] = useState('NCB');
  const [cardNumber, setCardNumber] = useState('9704198526191432198');
  const [cardHolder, setCardHolder] = useState('NGUYEN VAN A');
  const [issueDate, setIssueDate] = useState('07/15');
  const [otp, setOtp] = useState('123456');
  const [timeLeft, setTimeLeft] = useState(899); // 14:59
  const [isProcessing, setIsProcessing] = useState(false);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatMinutes = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleConfirmPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const txnNo = `VNP${Date.now()}`;
      const params = new URLSearchParams({
        vnp_ResponseCode: '00',
        vnp_TxnRef: orderCode,
        vnp_Amount: String(amount * 100),
        vnp_TransactionNo: txnNo,
        vnp_BankCode: selectedBank,
        vnp_PayDate: new Date().toISOString().replace(/\D/g, '').slice(0, 14),
        vnp_OrderInfo: orderInfo,
        vnp_Simulated: 'true',
      });
      router.push(`/orders/vnpay-return?${params.toString()}`);
    }, 1000);
  };

  const handleCancelPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const params = new URLSearchParams({
        vnp_ResponseCode: '24', // User cancelled
        vnp_TxnRef: orderCode,
        vnp_Amount: String(amount * 100),
        vnp_Simulated: 'true',
      });
      router.push(`/orders/vnpay-return?${params.toString()}`);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Bar */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-black tracking-tight text-blue-700">VN</span>
              <span className="text-2xl font-black tracking-tight text-red-600">PAY</span>
              <span className="text-xs bg-red-100 text-red-700 font-bold px-1.5 py-0.5 rounded">QR</span>
            </div>
            <div className="h-6 w-px bg-gray-200" />
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Cổng thanh toán điện tử
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200 font-medium">
              <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin" />
              <span>Giao dịch hết hạn trong: <strong className="font-mono font-bold text-red-600">{formatMinutes(timeLeft)}</strong></span>
            </div>
            <span className="text-xs font-bold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full border border-blue-200">
              Môi trường Thử nghiệm
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Info Column */}
          <div className="lg:col-span-1 bg-white rounded-2xl p-6 shadow-sm border border-gray-200 space-y-5 h-fit">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-3 flex items-center justify-between">
              <span>Chi tiết đơn hàng</span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </h2>

            <div className="space-y-3.5 text-xs">
              <div>
                <span className="text-gray-400 block text-[11px]">Đơn vị bán hàng</span>
                <strong className="text-gray-800 text-sm font-bold">Akiba Store</strong>
                <p className="text-[11px] text-gray-500">Mô hình & Pop Culture Nhật Bản</p>
              </div>

              <div>
                <span className="text-gray-400 block text-[11px]">Mã đơn hàng</span>
                <strong className="font-mono font-bold text-gray-900">{orderCode}</strong>
              </div>

              <div>
                <span className="text-gray-400 block text-[11px]">Nội dung thanh toán</span>
                <p className="text-gray-700 font-medium">{orderInfo}</p>
              </div>

              <div className="pt-3 border-t border-dashed border-gray-200">
                <span className="text-gray-500 block text-[11px]">Tổng số tiền thanh toán</span>
                <div className="text-2xl font-black text-red-600 mt-0.5">
                  {amount.toLocaleString('vi-VN')} <span className="text-sm font-semibold">VND</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-100 text-[11px] text-blue-800 space-y-1">
              <p className="font-bold flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5" /> Thẻ Sandbox dùng thử:
              </p>
              <p>• Ngân hàng: <strong>NCB</strong></p>
              <p>• Số thẻ: <strong>9704198526191432198</strong></p>
              <p>• Tên: <strong>NGUYEN VAN A</strong> (OTP: <strong>123456</strong>)</p>
            </div>
          </div>

          {/* Payment Selection Column */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
            {/* Tabs */}
            <div className="flex border-b border-gray-200 bg-gray-50/70">
              <button
                type="button"
                onClick={() => setActiveTab('atm')}
                className={`flex-1 py-3.5 px-4 text-xs font-bold transition flex items-center justify-center gap-2 border-b-2 ${
                  activeTab === 'atm'
                    ? 'border-blue-600 text-blue-700 bg-white'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Thẻ ATM / Tài khoản</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('qr')}
                className={`flex-1 py-3.5 px-4 text-xs font-bold transition flex items-center justify-center gap-2 border-b-2 ${
                  activeTab === 'qr'
                    ? 'border-blue-600 text-blue-700 bg-white'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                <QrCode className="w-4 h-4" />
                <span>VNPAY-QR</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('intl')}
                className={`flex-1 py-3.5 px-4 text-xs font-bold transition flex items-center justify-center gap-2 border-b-2 ${
                  activeTab === 'intl'
                    ? 'border-blue-600 text-blue-700 bg-white'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Thẻ quốc tế</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="p-6 flex-1 space-y-6">
              {activeTab === 'atm' && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">
                      1. Chọn ngân hàng phát hành thẻ
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {BANKS.map((b) => (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => setSelectedBank(b.id)}
                          className={`p-3 rounded-xl border text-left transition relative flex flex-col justify-between h-18 ${
                            selectedBank === b.id
                              ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20 shadow-xs'
                              : 'border-gray-200 hover:border-gray-300 bg-white'
                          }`}
                        >
                          <span className={`text-[10px] font-black px-1.5 py-0.5 rounded w-fit ${b.color}`}>
                            {b.code}
                          </span>
                          <span className="text-[11px] font-semibold text-gray-800 truncate">
                            {b.name}
                          </span>
                          {b.recommended && (
                            <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full shadow-xs">
                              Test
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 space-y-3.5">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                      2. Thông tin thẻ ({selectedBank})
                    </label>

                    <div>
                      <span className="text-[11px] text-gray-600 block mb-1 font-medium">Số thẻ thanh toán</span>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="9704..."
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-mono text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-[11px] text-gray-600 block mb-1 font-medium">Tên chủ thẻ</span>
                        <input
                          type="text"
                          value={cardHolder}
                          onChange={(e) => setCardHolder(e.target.value)}
                          placeholder="NGUYEN VAN A"
                          className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold uppercase"
                        />
                      </div>
                      <div>
                        <span className="text-[11px] text-gray-600 block mb-1 font-medium">Ngày phát hành</span>
                        <input
                          type="text"
                          value={issueDate}
                          onChange={(e) => setIssueDate(e.target.value)}
                          placeholder="MM/YY"
                          className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-mono text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                        />
                      </div>
                    </div>

                    <div>
                      <span className="text-[11px] text-gray-600 block mb-1 font-medium">Mã OTP xác thực</span>
                      <input
                        type="password"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="123456"
                        maxLength={6}
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-mono text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-center tracking-widest font-black"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'qr' && (
                <div className="text-center py-6 space-y-4">
                  <div className="w-56 h-56 mx-auto bg-white p-3 rounded-2xl border-2 border-blue-600 shadow-md flex flex-col items-center justify-center">
                    {/* Simulated QR Pattern */}
                    <div className="w-full h-full bg-gray-900 rounded-xl p-3 flex flex-col justify-between text-white text-[10px] font-mono">
                      <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                        <span className="font-bold text-red-400">VNPAY-QR</span>
                        <span>{orderCode}</span>
                      </div>
                      <div className="py-4 text-center">
                        <QrCode className="w-24 h-24 mx-auto text-white animate-pulse" />
                      </div>
                      <div className="text-center text-gray-400 text-[9px]">
                        Quét bằng App Mobile Banking
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 max-w-sm mx-auto">
                    Mở ứng dụng Mobile Banking của bạn (Vietcombank, Techcombank, MB, BIDV, VPBank...) và chọn quét mã <strong>VNPAY-QR</strong>.
                  </p>
                </div>
              )}

              {activeTab === 'intl' && (
                <div className="space-y-4 py-4 text-center text-gray-500 text-xs">
                  <div className="flex justify-center gap-3">
                    <span className="px-3 py-1.5 bg-blue-100 text-blue-800 font-bold rounded-lg text-sm">VISA</span>
                    <span className="px-3 py-1.5 bg-red-100 text-red-800 font-bold rounded-lg text-sm">MasterCard</span>
                    <span className="px-3 py-1.5 bg-green-100 text-green-800 font-bold rounded-lg text-sm">JCB</span>
                  </div>
                  <p>Hỗ trợ thanh toán bảo mật 3D-Secure qua thẻ quốc tế.</p>
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className="p-6 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleCancelPayment}
                disabled={isProcessing}
                className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <XCircle className="w-4 h-4 text-gray-400" />
                <span>Hủy giao dịch</span>
              </button>

              <button
                type="button"
                onClick={handleConfirmPayment}
                disabled={isProcessing}
                className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl text-xs shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <span>Đang xử lý giao dịch...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>Xác Nhận Thanh Toán ({amount.toLocaleString('vi-VN')} đ)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Security Footer */}
        <div className="text-center text-[11px] text-gray-400 space-y-1">
          <p className="flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            Hệ thống thanh toán bảo mật theo chuẩn PCI-DSS & mã hóa SSL 256-bit
          </p>
          <p>© 2026 Akiba Store Pop Culture. Tích hợp giải pháp thanh toán điện tử VNPay.</p>
        </div>
      </div>
    </div>
  );
}

export default function VNPaySimulatorPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-gray-500">Đang khởi tạo cổng VNPay...</div>}>
      <VNPaySimulatorContent />
    </Suspense>
  );
}
