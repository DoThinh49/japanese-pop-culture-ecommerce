import crypto from "crypto";

export interface VNPayParams {
  vnp_Version: string;
  vnp_Command: string;
  vnp_TmnCode: string;
  vnp_Locale: string;
  vnp_CurrCode: string;
  vnp_TxnRef: string;
  vnp_OrderInfo: string;
  vnp_OrderType: string;
  vnp_Amount: number;
  vnp_ReturnUrl: string;
  vnp_IpAddr: string;
  vnp_CreateDate: string;
  vnp_BankCode?: string;
  [key: string]: any;
}

export function sortObject(obj: Record<string, any>) {
  const sorted: Record<string, string> = {};
  const str: string[] = [];
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (let key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(String(obj[decodeURIComponent(str[key])])).replace(/%20/g, "+");
  }
  return sorted;
}

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
  const date = new Date();
  const formatDigit = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  const createDate = `${date.getFullYear()}${formatDigit(date.getMonth() + 1)}${formatDigit(
    date.getDate()
  )}${formatDigit(date.getHours())}${formatDigit(date.getMinutes())}${formatDigit(
    date.getSeconds()
  )}`;

  const vnp_Params: Record<string, any> = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: params.tmnCode,
    vnp_Locale: "vn",
    vnp_CurrCode: "VND",
    vnp_TxnRef: params.orderCode,
    vnp_OrderInfo: params.orderInfo,
    vnp_OrderType: "other",
    vnp_Amount: Math.round(params.amount * 100), // VNPay requires multiplying by 100
    vnp_ReturnUrl: params.returnUrl,
    vnp_IpAddr: params.ipAddr || "127.0.0.1",
    vnp_CreateDate: createDate,
  };

  if (params.bankCode) {
    vnp_Params.vnp_BankCode = params.bankCode;
  }

  const sortedParams = sortObject(vnp_Params);
  const querystring = new URLSearchParams(sortedParams).toString();

  const hmac = crypto.createHmac("sha512", params.hashSecret);
  const signed = hmac.update(Buffer.from(querystring, "utf-8")).digest("hex");

  return `${params.vnpUrl}?${querystring}&vnp_SecureHash=${signed}`;
}

export function verifyVNPayReturn(
  query: Record<string, any>,
  hashSecret: string
): { isSuccess: boolean; isValidChecksum: boolean; orderCode: string; transactionNo: string } {
  const secureHash = query.vnp_SecureHash;
  const vnp_Params: Record<string, any> = { ...query };
  delete vnp_Params.vnp_SecureHash;
  delete vnp_Params.vnp_SecureHashType;

  const sortedParams = sortObject(vnp_Params);
  const querystring = new URLSearchParams(sortedParams).toString();

  const hmac = crypto.createHmac("sha512", hashSecret);
  const signed = hmac.update(Buffer.from(querystring, "utf-8")).digest("hex");

  const isValidChecksum = secureHash === signed;
  const isSuccess = isValidChecksum && query.vnp_ResponseCode === "00";

  return {
    isSuccess,
    isValidChecksum,
    orderCode: query.vnp_TxnRef,
    transactionNo: query.vnp_TransactionNo || "",
  };
}
