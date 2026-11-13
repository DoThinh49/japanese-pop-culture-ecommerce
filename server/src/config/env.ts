import dotenv from "dotenv";

dotenv.config();

export const env = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:3000",
  DATABASE_URL: process.env.DATABASE_URL || "",
  DIRECT_URL: process.env.DIRECT_URL || "",
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || "default_access_secret",
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "default_refresh_secret",
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  VNPAY: {
    TMN_CODE: process.env.VNPAY_TMN_CODE || "CGXZLS0Z",
    HASH_SECRET: process.env.VNPAY_HASH_SECRET || "XNBCJFAKAZQSGTARRLKHYWGIYMUZUKJN",
    URL: process.env.VNPAY_URL || "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
    RETURN_URL: process.env.VNPAY_RETURN_URL || "http://localhost:3000/orders/vnpay-return",
  },
  GOOGLE: {
    CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
    CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "",
    CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:5000/api/auth/google/callback",
  },
  EMAIL: {
    HOST: process.env.EMAIL_HOST || "smtp.gmail.com",
    PORT: Number(process.env.EMAIL_PORT) || 587,
    USER: process.env.EMAIL_USER || "",
    PASS: process.env.EMAIL_PASS || "",
  },
  SUPABASE: {
    URL: process.env.SUPABASE_URL || "",
    ANON_KEY: process.env.SUPABASE_ANON_KEY || "",
  },
};

