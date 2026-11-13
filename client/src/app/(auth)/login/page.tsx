'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';

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

export default function LoginPage() {
  const router = useRouter();
  const { login, googleLogin } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
                setError(message || 'Đăng nhập bằng tài khoản Google thất bại');
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
            text: 'signin_with',
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
      await login(email, password);
      router.push('/');
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { error?: string } } }).response?.data?.error
          : undefined;
      setError(message || 'Đăng nhập không thành công, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 font-bold mx-auto flex items-center justify-center text-2xl">
            日
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Đăng nhập</h2>
          <p className="text-xs text-gray-500">
            Chào mừng trở lại với thế giới Anime & Pop Culture Nhật Bản
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
            Đang xác thực tài khoản Google của bạn...
          </div>
        )}

        {/* Demo Account Box */}
        <div className="bg-amber-50/80 border border-amber-200/80 rounded-lg p-3 text-[11px] text-amber-800 space-y-1">
          <p className="font-semibold text-amber-900">Tài khoản demo sẵn có:</p>
          <p>• Admin: <code className="bg-amber-100 px-1 py-0.5 rounded">admin@nihonex.vn</code> / <code className="bg-amber-100 px-1 py-0.5 rounded">AdminPassword123@</code></p>
          <p>• Khách hàng: <code className="bg-amber-100 px-1 py-0.5 rounded">otaku@nihonex.vn</code> / <code className="bg-amber-100 px-1 py-0.5 rounded">UserPassword123@</code></p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-gray-700">
                Mật khẩu
              </label>
              <a href="#" className="text-xs text-red-600 hover:underline">
                Quên mật khẩu?
              </a>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-sm transition-all shadow-md shadow-red-200 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
          >
            {loading ? (
              <span>Đang xử lý...</span>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Đăng nhập</span>
              </>
            )}
          </button>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-3 text-gray-500 font-medium">Hoặc đăng nhập nhanh với</span>
          </div>
        </div>

        {/* Direct Google Sign-In Button */}
        <div className="flex justify-center min-h-[44px]">
          <div ref={googleBtnRef} className="w-full flex justify-center" />
        </div>

        <div className="text-center text-xs text-gray-500 pt-2 border-t border-gray-100">
          Chưa có tài khoản?{' '}
          <Link href="/register" className="text-red-600 font-semibold hover:underline">
            Đăng ký ngay
          </Link>
        </div>
      </div>
    </div>
  );
}
