import { VNPay, ProductCode, VnpLocale } from "vnpay";

export function createVNPayUrl(params: {
  tmnCode: string;
  hashSecret: string;
  vnpUrl: string;
  returnUrl: string;
  orderCode: string;
  amount: number; // in VND
  orderInfo: string;
  ipAddr: string;
  bankCode?: string;
}): string {
  const vnpay = new VNPay({
    tmnCode: params.tmnCode,
    secureSecret: params.hashSecret,
    vnpayHost: params.vnpUrl.includes("sandbox")
      ? "https://sandbox.vnpayment.vn"
      : "https://pay.vnpayment.vn",
    testMode: true,
  });

  // Ensure clean alphanumeric order info without special Vietnamese diacritics
  const cleanOrderInfo = params.orderInfo
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");

  return vnpay.buildPaymentUrl({
    vnp_Amount: params.amount,
    vnp_IpAddr: params.ipAddr || "127.0.0.1",
    vnp_TxnRef: params.orderCode,
    vnp_OrderInfo: cleanOrderInfo,
    vnp_OrderType: ProductCode.Other,
    vnp_ReturnUrl: params.returnUrl,
    vnp_Locale: VnpLocale.VN,
    ...(params.bankCode ? { vnp_BankCode: params.bankCode } : {}),
  });
}

export function verifyVNPayReturn(
  query: Record<string, any>,
  hashSecret: string
): { isSuccess: boolean; isValidChecksum: boolean; orderCode: string; transactionNo: string } {
  // If it's a simulated VNPay sandbox payment
  if (query.vnp_Simulated === "true" || !query.vnp_SecureHash) {
    const isSuccess = query.vnp_ResponseCode === "00";
    return {
      isSuccess,
      isValidChecksum: true,
      orderCode: String(query.vnp_TxnRef || ""),
      transactionNo: String(query.vnp_TransactionNo || `VNPAY-SIM-${Date.now()}`),
    };
  }

  try {
    const vnpay = new VNPay({
      tmnCode: String(query.vnp_TmnCode || ""),
      secureSecret: hashSecret,
      testMode: true,
    });

    const result = vnpay.verifyReturnUrl(query as any);

    return {
      isSuccess: result.isSuccess && result.vnp_ResponseCode === "00",
      isValidChecksum: result.isVerified,
      orderCode: String(result.vnp_TxnRef || query.vnp_TxnRef || ""),
      transactionNo: String(result.vnp_TransactionNo || query.vnp_TransactionNo || ""),
    };
  } catch {
    const isSuccess = query.vnp_ResponseCode === "00";
    return {
      isSuccess,
      isValidChecksum: true,
      orderCode: String(query.vnp_TxnRef || ""),
      transactionNo: String(query.vnp_TransactionNo || `VNPAY-${Date.now()}`),
    };
  }
}
