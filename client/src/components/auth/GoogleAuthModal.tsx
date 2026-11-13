'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { X, Mail, User, Sparkles, AlertCircle, Key, CheckCircle } from 'lucide-react';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'login' | 'register';
}

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
            options: { theme?: string; size?: string; width?: string; text?: string; shape?: string }
          ) => void;
          prompt: () => void;
        };
      };
    };
  }
}

export default function GoogleAuthModal({ isOpen, onClose, mode = 'login' }: GoogleAuthModalProps) {
  const router = useRouter();
  const { googleLogin } = useAuthStore();
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [clientId, setClientId] = useState('');
  const [showConfig, setShowConfig] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const googleBtnContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const envClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || localStorage.getItem('google_client_id') || '';
    if (envClientId) {
      setClientId(envClientId);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const currentClientId = clientId || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || localStorage.getItem('google_client_id');
    if (currentClientId && window.google?.accounts?.id && googleBtnContainerRef.current) {
      try {
        window.google.accounts.id.initialize({
          client_id: currentClientId,
          callback: async (response: { credential: string }) => {
            try {
              setLoading(true);
              setError('');
              await googleLogin({ credential: response.credential });
              onClose();
              router.push('/');
            } catch (err: unknown) {
              const msg =
                err && typeof err === 'object' && 'response' in err
                  ? (err as { response?: { data?: { error?: string } } }).response?.data?.error
                  : undefined;
              setError(msg || 'Xác thực Google thất bại');
            } finally {
              setLoading(false);
            }
          },
        });

        googleBtnContainerRef.current.innerHTML = '';
        window.google.accounts.id.renderButton(googleBtnContainerRef.current, {
          theme: 'outline',
          size: 'large',
          width: '100%',
          text: mode === 'register' ? 'signup_with' : 'signin_with',
          shape: 'pill',
        });
      } catch (err) {
        console.error('Failed to init Google Button:', err);
      }
    }
  }, [isOpen, clientId, mode, googleLogin, onClose, router]);

  if (!isOpen) return null;

  const handleCustomEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Vui lòng nhập địa chỉ email hợp lệ');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await googleLogin({
        email: email.trim().toLowerCase(),
        fullName: fullName.trim() || email.split('@')[0],
        avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`,
      });
      onClose();
      router.push('/');
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { error?: string } } }).response?.data?.error
          : undefined;
      setError(msg || 'Đăng nhập Google thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveClientId = (e: React.FormEvent) => {
    e.preventDefault();
    if (clientId.trim()) {
      localStorage.setItem('google_client_id', clientId.trim());
      setSuccessMsg('Đã lưu Google Client ID! Popup Google đã sẵn sàng.');
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-gray-100 overflow-hidden relative">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-rose-500 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">
                {mode === 'register' ? 'Đăng ký tài khoản Google' : 'Đăng nhập với Google'}
              </h3>
              <p className="text-xs text-red-100 flex items-center gap-1 mt-0.5">
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" /> Nhận ngay 50 Otaku Points
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Real Google Button if client ID exists and GIS loaded */}
          {clientId && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">
                Popup Google chính thức
              </p>
              <div ref={googleBtnContainerRef} className="flex justify-center min-h-[44px]" />
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink mx-3 text-gray-400 text-xs uppercase font-medium">Hoặc nhập email của bạn</span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>
            </div>
          )}

          {/* Custom Google Email Input Form */}
          <form onSubmit={handleCustomEmailSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Email Google của bạn
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="Ví dụ: dothinh49@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                />
              </div>
              <p className="text-[11px] text-gray-500 mt-1">
                Nhập chính xác email bạn muốn sử dụng để hệ thống liên kết tài khoản Google cá nhân của bạn.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Họ và tên hiển thị (Tùy chọn)
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Ví dụ: Đỗ Thịnh"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold py-3 px-4 rounded-xl text-sm shadow-md shadow-red-200 hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Đang xử lý...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Xác nhận đăng nhập với Email của tôi</span>
                </>
              )}
            </button>
          </form>

          {/* Toggle Real Google Cloud Client ID Config */}
          <div className="border-t border-gray-100 pt-3">
            <button
              type="button"
              onClick={() => setShowConfig(!showConfig)}
              className="text-xs text-gray-500 hover:text-gray-800 flex items-center justify-between w-full py-1 transition"
            >
              <span className="flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-gray-400" />
                Muốn bật popup Google chính thức (Google Cloud)?
              </span>
              <span className="text-[11px] font-semibold text-red-600">
                {showConfig ? 'Ẩn' : 'Xem hướng dẫn'}
              </span>
            </button>

            {showConfig && (
              <div className="mt-3 p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs space-y-2.5 animate-fade-in text-gray-600">
                <p className="leading-relaxed">
                  Để Google tự động mở cửa sổ chọn tài khoản (`accounts.google.com`), ứng dụng cần một{' '}
                  <strong className="text-gray-800">Google OAuth Client ID</strong> được tạo tại{' '}
                  <a
                    href="https://console.cloud.google.com/apis/credentials"
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline font-medium"
                  >
                    Google Cloud Console
                  </a>{' '}
                  (với Authorized JavaScript origins: <code className="bg-gray-200 px-1 py-0.5 rounded text-[11px]">http://localhost:3000</code>).
                </p>

                <form onSubmit={handleSaveClientId} className="space-y-2 pt-1">
                  <input
                    type="text"
                    placeholder="Dán Client ID (ví dụ: xxx.apps.googleusercontent.com)"
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:ring-1 focus:ring-red-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="w-full bg-gray-800 hover:bg-gray-900 text-white font-medium py-1.5 rounded-lg text-xs transition"
                  >
                    Lưu Client ID & Kích hoạt Popup
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
