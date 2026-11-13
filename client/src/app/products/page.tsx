'use client';

import React, { useEffect, useState, useCallback, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { Star, SlidersHorizontal, RotateCcw, ArrowUpDown } from 'lucide-react';
import api from '@/lib/api';

interface Category {
  id: number;
  name: string;
  slug: string;
  _count?: { products: number };
}

interface SeriesItem {
  id: number;
  name: string;
  slug: string;
  _count?: { products: number };
}

interface ProductItem {
  id: number;
  name: string;
  slug: string;
  price: number | string;
  originalPrice?: number | string | null;
  status: string;
  scale?: string | null;
  avgRating?: number | string;
  images: { imageUrl: string }[];
  category?: { name: string; slug: string };
  series?: { name: string; slug: string };
}

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [seriesList, setSeriesList] = useState<SeriesItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const currentCategory = searchParams.get('category') || '';
  const currentSeries = searchParams.get('series') || '';
  const currentStatus = searchParams.get('status') || '';
  const currentSort = searchParams.get('sortBy') || 'newest';
  const currentSearch = searchParams.get('search') || '';

  // Update query params helper
  const updateQuery = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`/products?${params.toString()}`);
    },
    [router, searchParams]
  );

  const resetFilters = () => {
    router.push('/products');
  };

  // Load Filters metadata
  useEffect(() => {
    async function loadMetadata() {
      try {
        const [catRes, serRes] = await Promise.all([
          api.get('/catalog/categories'),
          api.get('/catalog/series'),
        ]);
        setCategories(catRes.data.data || []);
        setSeriesList(serRes.data.data || []);
      } catch (e) {
        console.error('Error loading metadata:', e);
      }
    }
    loadMetadata();
  }, []);

  // Fetch Products based on URL params
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const params: Record<string, string> = {};
        if (currentSearch) params.search = currentSearch;
        if (currentStatus) params.status = currentStatus;
        if (currentSort) params.sortBy = currentSort;

        // If category slug is selected, find category ID
        if (currentCategory && categories.length > 0) {
          const match = categories.find((c) => c.slug === currentCategory);
          if (match) params.categoryId = String(match.id);
        }

        // If series slug is selected, find series ID
        if (currentSeries && seriesList.length > 0) {
          const match = seriesList.find((s) => s.slug === currentSeries);
          if (match) params.seriesId = String(match.id);
        }

        const res = await api.get('/products', { params });
        setProducts(res.data.data?.products || []);
      } catch (e) {
        console.error('Error fetching products:', e);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [currentCategory, currentSeries, currentStatus, currentSort, currentSearch, categories, seriesList]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner / Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Sản Phẩm Văn Hóa Nhật Bản
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Hiển thị {products.length} sản phẩm chính hãng
            {currentSearch && <span> cho từ khóa &quot;{currentSearch}&quot;</span>}
          </p>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <ArrowUpDown className="w-4 h-4 text-gray-500" />
          <span className="text-xs text-gray-500 font-medium hidden sm:inline">Sắp xếp:</span>
          <select
            value={currentSort}
            onChange={(e) => updateQuery('sortBy', e.target.value)}
            className="text-xs font-semibold bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:border-red-500"
          >
            <option value="newest">Mới nhất</option>
            <option value="price_asc">Giá: Thấp đến Cao</option>
            <option value="price_desc">Giá: Cao đến Thấp</option>
            <option value="rating">Đánh giá cao nhất</option>
            <option value="popular">Bán chạy nhất</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar Filters */}
        <aside className="space-y-6 lg:col-span-1">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2 font-bold text-sm text-gray-900">
                <SlidersHorizontal className="w-4 h-4 text-red-600" />
                <span>Bộ Lọc</span>
              </div>
              {(currentCategory || currentSeries || currentStatus) && (
                <button
                  onClick={resetFilters}
                  className="text-[11px] text-red-600 hover:text-red-700 font-semibold flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Xóa lọc</span>
                </button>
              )}
            </div>

            {/* Status Filter */}
            <div>
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2.5">
                Tình trạng hàng
              </h3>
              <div className="space-y-1.5">
                {[
                  { label: 'Tất cả', val: '' },
                  { label: 'Hàng có sẵn', val: 'IN_STOCK' },
                  { label: 'Hàng đặt trước (Pre-order)', val: 'PRE_ORDER' },
                ].map((s) => (
                  <button
                    key={s.val}
                    onClick={() => updateQuery('status', s.val)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      currentStatus === s.val
                        ? 'bg-red-50 text-red-600 font-bold'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Categories Filter */}
            <div>
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2.5">
                Danh mục
              </h3>
              <div className="space-y-1.5">
                <button
                  onClick={() => updateQuery('category', '')}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    !currentCategory
                      ? 'bg-red-50 text-red-600 font-bold'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Tất cả danh mục
                </button>
                {categories.map((c) => (
                  <button
                    key={c.slug}
                    onClick={() => updateQuery('category', c.slug)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                      currentCategory === c.slug
                        ? 'bg-red-50 text-red-600 font-bold'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>{c.name}</span>
                    {c._count && (
                      <span className="text-[10px] text-gray-400">
                        {c._count.products}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Series / Fandom Filter */}
            <div>
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2.5">
                Vũ trụ Anime / Series
              </h3>
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                <button
                  onClick={() => updateQuery('series', '')}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    !currentSeries
                      ? 'bg-red-50 text-red-600 font-bold'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Tất cả Series
                </button>
                {seriesList.map((s) => (
                  <button
                    key={s.slug}
                    onClick={() => updateQuery('series', s.slug)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                      currentSeries === s.slug
                        ? 'bg-red-50 text-red-600 font-bold'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="truncate pr-2">{s.name}</span>
                    {s._count && (
                      <span className="text-[10px] text-gray-400">
                        {s._count.products}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Right Products Grid */}
        <main className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="bg-white rounded-2xl h-80 animate-pulse border border-gray-100"
                />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto text-2xl font-bold">
                日
              </div>
              <h3 className="text-base font-bold text-gray-900">
                Không tìm thấy sản phẩm phù hợp
              </h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Hãy thử xóa bớt bộ lọc hoặc tìm kiếm với từ khóa khác nhé.
              </p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition-colors shadow-sm"
              >
                Đặt lại tất cả bộ lọc
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((item) => (
                <div
                  key={item.id}
                  className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
                >
                  {/* Image */}
                  <div className="relative aspect-square bg-gray-50 overflow-hidden">
                    <Image
                      src={
                        item.images?.[0]?.imageUrl ||
                        'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600'
                      }
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Badge */}
                    <div className="absolute top-3 left-3">
                      {item.status === 'PRE_ORDER' ? (
                        <span className="px-2.5 py-1 bg-amber-500 text-white text-[10px] font-black rounded-md tracking-wider uppercase shadow-md">
                          Pre-order
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-emerald-600 text-white text-[10px] font-bold rounded-md tracking-wider uppercase shadow-md">
                          Có sẵn
                        </span>
                      )}
                    </div>

                    {item.scale && (
                      <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 bg-black/60 backdrop-blur-sm text-white text-[10px] rounded">
                        {item.scale}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1">
                      <p className="text-[11px] font-semibold text-red-600">
                        {item.series?.name || item.category?.name}
                      </p>
                      <h3 className="font-semibold text-xs text-gray-900 line-clamp-2 group-hover:text-red-600 transition-colors">
                        {item.name}
                      </h3>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-gray-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-base font-black text-red-600">
                            {Number(item.price).toLocaleString('vi-VN')} đ
                          </p>
                          {item.originalPrice &&
                            Number(item.originalPrice) > Number(item.price) && (
                              <p className="text-[11px] text-gray-400 line-through">
                                {Number(item.originalPrice).toLocaleString('vi-VN')} đ
                              </p>
                            )}
                        </div>
                        <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{item.avgRating || '5.0'}</span>
                        </div>
                      </div>

                      <Link
                        href={`/products/${item.slug}`}
                        className="w-full bg-gray-900 group-hover:bg-red-600 text-white text-xs font-bold py-2 rounded-lg text-center block transition-colors shadow-sm"
                      >
                        {item.status === 'PRE_ORDER' ? 'Đặt trước ngay' : 'Xem chi tiết'}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto p-8 text-center text-xs text-gray-500">Đang tải sản phẩm...</div>}>
      <ProductsContent />
    </Suspense>
  );
}

