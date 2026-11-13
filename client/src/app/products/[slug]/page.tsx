'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import {
  Star,
  ShieldCheck,
  Package,
  Truck,
  RotateCcw,
  ShoppingCart,
  Zap,
  Check,
  ChevronRight,
  Clock,
} from 'lucide-react';
import api from '@/lib/api';
import { useCartStore } from '@/stores/cartStore';

interface ProductDetail {
  id: number;
  name: string;
  slug: string;
  sku: string;
  description?: string | null;
  price: number | string;
  originalPrice?: number | string | null;
  stockQuantity: number;
  condition: string;
  scale?: string | null;
  material?: string | null;
  heightCm?: number | string | null;
  status: string; // 'IN_STOCK' | 'PRE_ORDER'
  avgRating?: number | string;
  reviewCount: number;
  images: { id: number; imageUrl: string; isPrimary: boolean }[];
  category?: { name: string; slug: string };
  series?: { name: string; slug: string };
  character?: { name: string; slug: string };
  manufacturer?: { name: string; slug: string };
  preorderBatches?: { estimatedArrival?: string; closeDate?: string }[];
}

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [addedToast, setAddedToast] = useState<boolean>(false);

  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await api.get(`/products/${slug}`);
        const data = res.data.data;
        setProduct(data);
        if (data.images && data.images.length > 0) {
          setSelectedImage(data.images[0].imageUrl);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    }
    if (slug) fetchProduct();
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem(
      {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: Number(product.price),
        originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
        image: selectedImage || product.images?.[0]?.imageUrl || '',
        scale: product.scale,
        status: product.status,
        seriesName: product.series?.name,
      },
      quantity
    );
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2500);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/cart');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-xs text-gray-500">
        Đang tải thông tin sản phẩm...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Không tìm thấy sản phẩm</h2>
        <Link
          href="/products"
          className="inline-block px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-semibold"
        >
          Quay lại danh sách sản phẩm
        </Link>
      </div>
    );
  }

  const isPreorder = product.status === 'PRE_ORDER';
  const discountPercent =
    product.originalPrice && Number(product.originalPrice) > Number(product.price)
      ? Math.round(
          ((Number(product.originalPrice) - Number(product.price)) /
            Number(product.originalPrice)) *
            100
        )
      : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-500 overflow-x-auto whitespace-nowrap">
        <Link href="/" className="hover:text-red-600">
          Trang chủ
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <Link href="/products" className="hover:text-red-600">
          Sản phẩm
        </Link>
        {product.category && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <Link
              href={`/products?category=${product.category.slug}`}
              className="hover:text-red-600"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-gray-900 font-medium truncate max-w-xs">
          {product.name}
        </span>
      </nav>

      {/* Main Product Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Gallery (5 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm">
            <Image
              src={selectedImage || 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800'}
              alt={product.name}
              fill
              priority
              className="object-cover"
            />
            {isPreorder ? (
              <span className="absolute top-4 left-4 px-3 py-1 bg-amber-500 text-white text-xs font-black rounded-lg uppercase tracking-wider shadow-lg">
                Pre-order
              </span>
            ) : (
              <span className="absolute top-4 left-4 px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded-lg uppercase tracking-wider shadow-lg">
                Có sẵn
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
              {product.images.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(img.imageUrl)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                    selectedImage === img.imageUrl
                      ? 'border-red-600 ring-2 ring-red-100'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <Image
                    src={img.imageUrl}
                    alt="thumbnail"
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Details (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Series & Title */}
          <div className="space-y-2">
            {product.series && (
              <Link
                href={`/products?series=${product.series.slug}`}
                className="inline-block px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-bold hover:bg-red-100 transition-colors"
              >
                {product.series.name}
              </Link>
            )}
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 leading-snug">
              {product.name}
            </h1>
            <div className="flex items-center gap-4 text-xs text-gray-500 pt-1">
              <span className="font-mono">Mã: {product.sku}</span>
              <span>•</span>
              <div className="flex items-center gap-1 text-amber-500 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{product.avgRating || '5.0'}</span>
                <span className="text-gray-400 font-normal">
                  ({product.reviewCount} đánh giá)
                </span>
              </div>
            </div>
          </div>

          {/* Pre-order Banner Notice */}
          {isPreorder && (
            <div className="p-4 bg-amber-50/90 border border-amber-200 rounded-xl space-y-1 text-amber-900">
              <div className="flex items-center gap-2 font-bold text-xs text-amber-800">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>SẢN PHẨM ĐẶT TRƯỚC (PRE-ORDER)</span>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed">
                Mô hình đang trong giai đoạn nhận đặt trước chính hãng. Dự kiến trả hàng vào{' '}
                <strong>Quý 1/2027</strong>.
              </p>
            </div>
          )}

          {/* Pricing Box */}
          <div className="p-5 bg-gray-50/80 rounded-2xl border border-gray-100 space-y-2">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-red-600">
                {Number(product.price).toLocaleString('vi-VN')} đ
              </span>
              {product.originalPrice &&
                Number(product.originalPrice) > Number(product.price) && (
                  <span className="text-base text-gray-400 line-through">
                    {Number(product.originalPrice).toLocaleString('vi-VN')} đ
                  </span>
                )}
              {discountPercent && (
                <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded">
                  -{discountPercent}%
                </span>
              )}
            </div>
            <p className="text-[11px] text-gray-500">
              Giá đã bao gồm thuế VAT và cam kết đóng gói bọc xốp chống sốc tiêu chuẩn.
            </p>
          </div>

          {/* Specifications Table */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Thông số sản phẩm
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-white border border-gray-100 rounded-xl">
                <span className="text-gray-400 block text-[11px]">Hãng sản xuất</span>
                <span className="font-semibold text-gray-800">
                  {product.manufacturer?.name || 'Nhật Bản'}
                </span>
              </div>
              <div className="p-2.5 bg-white border border-gray-100 rounded-xl">
                <span className="text-gray-400 block text-[11px]">Nhân vật</span>
                <span className="font-semibold text-gray-800">
                  {product.character?.name || 'Anime'}
                </span>
              </div>
              <div className="p-2.5 bg-white border border-gray-100 rounded-xl">
                <span className="text-gray-400 block text-[11px]">Tỉ lệ / Kích thước</span>
                <span className="font-semibold text-gray-800">
                  {product.scale || 'Tiêu chuẩn'} {product.heightCm && `(~${product.heightCm} cm)`}
                </span>
              </div>
              <div className="p-2.5 bg-white border border-gray-100 rounded-xl">
                <span className="text-gray-400 block text-[11px]">Chất liệu</span>
                <span className="font-semibold text-gray-800">
                  {product.material || 'PVC, ABS cao cấp'}
                </span>
              </div>
              <div className="p-2.5 bg-white border border-gray-100 rounded-xl col-span-2">
                <span className="text-gray-400 block text-[11px]">Tình trạng đóng gói</span>
                <span className="font-semibold text-emerald-600">
                  Mới 100% Nguyên Seal Chính Hãng (New Sealed)
                </span>
              </div>
            </div>
          </div>

          {/* Actions: Quantity + Add to Cart + Buy Now */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold text-gray-700">Số lượng:</span>
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1.5 hover:bg-gray-100 text-sm font-bold text-gray-600"
                >
                  -
                </button>
                <span className="px-4 py-1.5 text-xs font-semibold text-gray-900 border-x border-gray-200">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-1.5 hover:bg-gray-100 text-sm font-bold text-gray-600"
                >
                  +
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                className="py-3 px-4 bg-white border-2 border-red-600 text-red-600 hover:bg-red-50 text-xs font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Thêm vào giỏ</span>
              </button>

              <button
                onClick={handleBuyNow}
                className="py-3 px-4 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" />
                <span>{isPreorder ? 'Đặt trước ngay' : 'Mua ngay'}</span>
              </button>
            </div>

            {/* Added Toast Notification */}
            {addedToast && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800 animate-fade-in">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Đã thêm sản phẩm vào giỏ hàng thành công!</span>
              </div>
            )}
          </div>

          {/* Guarantees */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100 text-[11px] text-gray-600">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span>100% Chính hãng Nhật Bản</span>
            </div>
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span>Đóng gói 3 lớp chống va đập</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span>Giao hàng toàn quốc</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span>Đổi mới nếu gãy vỡ vận chuyển</span>
            </div>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="bg-white rounded-2xl border border-gray-100 p-8 space-y-4 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
          Mô tả chi tiết sản phẩm
        </h2>
        <div className="prose prose-sm max-w-none text-gray-700 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
          {product.description ||
            'Sản phẩm mô hình nhân vật chính hãng xuất xứ từ Nhật Bản, hoàn thiện tỉ mỉ với chất liệu PVC cao cấp, nguyên seal từ nhà sản xuất.'}
        </div>
      </div>
    </div>
  );
}
