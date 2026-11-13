'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { UserPlus, AlertCircle } from 'lucide-react';

const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
  '130212100943-d89a23v00064rs42327ef3qoq56gslr7.apps.googleusercontent.com';

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (config: {
            client_id: string;
            callback: (res: { credential: string }) => void;
          }) => void;
          renderButton: (
            element: HTMLElement,
            options: {
              theme?: string;
              size?: string;
              width?: string | number;
              text?: string;
              shape?: string;
              logo_alignment?: string;
            }
          ) => void;
          prompt: () => void;
        };
      };
    };
  }
}

export default function RegisterPage() {
  const router = useRouter();
  const { register, googleLogin } = useAuthStore();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const googleBtnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initGoogle = () => {
      if (typeof window !== 'undefined' && window.google?.accounts?.id && googleBtnRef.current) {
        try {
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: async (response: { credential: string }) => {
              try {
                setGoogleLoading(true);
                setError('');
                await googleLogin({ credential: response.credential });
                router.push('/');
              } catch (err: unknown) {
                const message =
                  err && typeof err === 'object' && 'response' in err
                    ? (err as { response?: { data?: { error?: string } } }).response?.data?.error
                    : undefined;
                setError(message || 'Đăng ký bằng tài khoản Google thất bại');
              } finally {
                setGoogleLoading(false);
              }
            },
          });

          googleBtnRef.current.innerHTML = '';
          window.google.accounts.id.renderButton(googleBtnRef.current, {
            theme: 'outline',
            size: 'large',
            width: 380,
            text: 'signup_with',
            shape: 'rectangular',
            logo_alignment: 'left',
          });
        } catch (e) {
          console.error('Google button init error:', e);
        }
      }
    };

    if (window.google?.accounts?.id) {
      initGoogle();
    } else {
      const timer = setInterval(() => {
        if (window.google?.accounts?.id) {
          initGoogle();
          clearInterval(timer);
        }
      }, 150);
      return () => clearInterval(timer);
    }
  }, [googleLogin, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(formData);
      router.push('/');
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { error?: string } } }).response?.data?.error
          : undefined;
      setError(message || 'Đăng ký không thành công, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 font-bold mx-auto flex items-center justify-center text-2xl">
            日
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Tạo tài khoản Akiba</h2>
          <p className="text-xs text-gray-500">
            Gia nhập cộng đồng Otaku & nhận ngay 50 điểm thưởng chào mừng
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {googleLoading && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-700 text-center font-medium animate-pulse">
            Đang liên kết tài khoản Google & cấp điểm Otaku...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              placeholder="Ví dụ: Nguyễn Văn A"
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Địa chỉ Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="name@example.com"
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Số điện thoại
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder="0912345678"
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Mật khẩu <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-4 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-60 cursor-pointer"
          >
            {loading ? (
              <span>Đang đăng ký...</span>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Đăng ký tài khoản</span>
              </>
            )}
          </button>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-3 text-gray-500 font-medium">Hoặc đăng ký nhanh với</span>
          </div>
        </div>

        {/* Direct Google Sign-In / Sign-Up Button */}
        <div className="flex justify-center min-h-[44px]">
          <div ref={googleBtnRef} className="w-full flex justify-center" />
        </div>

        <div className="text-center text-xs text-gray-500 pt-2 border-t border-gray-100">
          Đã có tài khoản?{' '}
          <Link href="/login" className="text-red-600 font-semibold hover:underline">
            Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
}
