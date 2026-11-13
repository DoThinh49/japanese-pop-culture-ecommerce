'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Heart,
  ShoppingCart,
  Trash2,
  Package,
  ArrowRight,
  Check,
} from 'lucide-react';
import { useWishlistStore } from '@/stores/wishlistStore';
import { useCartStore } from '@/stores/cartStore';

export default function WishlistPage() {
  const { items, removeItem, fetchWishlist } = useWishlistStore();
  const addItem = useCartStore((state) => state.addItem);
  const [mounted, setMounted] = useState(false);
  const [addedId, setAddedId] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
    fetchWishlist();
  }, [fetchWishlist]);

  const handleAddToCart = (product: (typeof items)[0]) => {
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: Number(product.price),
      originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
      image: product.images?.[0]?.imageUrl || '',
      scale: product.scale,
      status: product.status,
      seriesName: product.series?.name,
    });
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 2000);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-200 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2">
              <Heart className="w-7 h-7 text-rose-500 fill-rose-500" />
              Sản Phẩm Yêu Thích (Wishlist)
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Bộ sưu tập các món Figure, Manga và phụ kiện bạn đang quan tâm theo dõi
            </p>
          </div>
          {items.length > 0 && (
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-xl transition-colors self-start"
            >
              Tiếp tục tìm kiếm
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {/* Empty State */}
        {items.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center max-w-lg mx-auto shadow-xs">
            <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-100">
              <Heart className="w-10 h-10 stroke-1" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1.5">
              Danh sách yêu thích trống
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed mb-6">
              Bạn chưa lưu sản phẩm nào vào mục yêu thích. Hãy khám phá và thả tim cho các mô hình bạn mê mẩn nhé!
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-red-200"
            >
              Khám phá sản phẩm ngay
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {items.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs hover:shadow-md hover:border-gray-200 transition-all flex flex-col group"
              >
                {/* Image & Badges */}
                <div className="relative aspect-square bg-gray-50 overflow-hidden">
                  {product.images?.[0]?.imageUrl ? (
                    <Image
                      src={product.images[0].imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <Package className="w-12 h-12" />
                    </div>
                  )}

                  {/* Status Badge */}
                  {product.status === 'PRE_ORDER' && (
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white shadow-xs">
                      Pre-order
                    </span>
                  )}

                  {/* Remove Wishlist Button */}
                  <button
                    onClick={() => removeItem(product.id)}
                    className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 hover:bg-white text-rose-500 hover:text-rose-600 shadow-sm transition-all"
                    title="Xóa khỏi yêu thích"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    {product.series && (
                      <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider block mb-1">
                        {product.series.name}
                      </span>
                    )}
                    <Link
                      href={`/products/${product.slug}`}
                      className="text-xs font-bold text-gray-900 hover:text-red-600 line-clamp-2 transition-colors leading-snug"
                    >
                      {product.name}
                    </Link>
                  </div>

                  <div className="pt-3 mt-3 border-t border-gray-50">
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-sm sm:text-base font-black text-red-600">
                        {Number(product.price).toLocaleString('vi-VN')} đ
                      </span>
                      {product.originalPrice && (
                        <span className="text-[11px] text-gray-400 line-through">
                          {Number(product.originalPrice).toLocaleString('vi-VN')} đ
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleAddToCart(product)}
                      className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs ${
                        addedId === product.id
                          ? 'bg-emerald-600 text-white'
                          : 'bg-red-600 hover:bg-red-700 text-white shadow-red-200'
                      }`}
                    >
                      {addedId === product.id ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Đã thêm vào giỏ</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>Thêm vào giỏ</span>
                        </>
                      )}
                    </button>
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

