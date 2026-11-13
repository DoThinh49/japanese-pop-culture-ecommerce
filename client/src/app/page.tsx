import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, ShieldCheck, Truck, Clock, ArrowRight, Star } from 'lucide-react';

interface ProductItem {
  id: number;
  name: string;
  slug: string;
  price: string | number;
  originalPrice?: string | number | null;
  status: string;
  scale?: string | null;
  avgRating?: string | number;
  images?: { imageUrl: string }[];
  category?: { name: string };
  series?: { name: string };
}

async function getFeaturedProducts(): Promise<ProductItem[]> {
  try {
    const res = await fetch('http://localhost:5000/api/products/featured', {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch {
    return [
      {
        id: 1,
        name: 'Mô hình Gojo Satoru 1/7 Shibuya Incident Ver. - SHIBUYA SCRAMBLE',
        slug: 'mo-hinh-gojo-satoru-1-7-shibuya-incident',
        price: '7850000',
        originalPrice: '8500000',
        status: 'PRE_ORDER',
        scale: '1/7',
        avgRating: '5.0',
        images: [
          { imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800' },
        ],
        category: { name: 'Mô hình & Figure' },
        series: { name: 'Jujutsu Kaisen' },
      },
      {
        id: 2,
        name: 'Nendoroid 1902 Anya Forger - SPY x FAMILY',
        slug: 'nendoroid-1902-anya-forger',
        price: '1350000',
        originalPrice: '1450000',
        status: 'IN_STOCK',
        scale: 'Nendoroid (~10cm)',
        avgRating: '4.9',
        images: [
          { imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800' },
        ],
        category: { name: 'Mô hình & Figure' },
        series: { name: 'Spy x Family' },
      },
      {
        id: 3,
        name: 'Mô hình One Piece - Monkey D. Luffy Gear 5 Sun God Nika King of Artist',
        slug: 'mo-hinh-luffy-gear-5-king-of-artist',
        price: '650000',
        originalPrice: '720000',
        status: 'IN_STOCK',
        scale: 'Prize (~16cm)',
        avgRating: '4.8',
        images: [
          { imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800' },
        ],
        category: { name: 'Mô hình & Figure' },
        series: { name: 'One Piece' },
      },
      {
        id: 4,
        name: 'Mô hình lắp ráp Gunpla RG 1/144 Hi-Nu Gundam - Bandai',
        slug: 'gunpla-rg-1-144-hi-nu-gundam',
        price: '1250000',
        originalPrice: '1350000',
        status: 'IN_STOCK',
        scale: 'RG 1/144',
        avgRating: '5.0',
        images: [
          { imageUrl: 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=800' },
        ],
        category: { name: 'Gunpla & Model Kit' },
        series: { name: 'Mobile Suit Gundam' },
      },
    ];
  }
}

export default async function HomePage() {
  const products = await getFeaturedProducts();

  const categories = [
    {
      name: 'Mô hình & Figure',
      slug: 'mo-hinh-figure',
      count: 'Scale, Nendoroid, Pop Up',
      image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600',
    },
    {
      name: 'Manga & Light Novel',
      slug: 'manga-light-novel',
      count: 'Bản quyền & Artbook',
      image: 'https://images.unsplash.com/photo-1618365908648-e71bd5716cba?w=600',
    },
    {
      name: 'Phụ kiện & Standee',
      slug: 'phu-kien-suu-tam',
      count: 'Acrylic, Huy hiệu, Shikishi',
      image: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=600',
    },
    {
      name: 'Gunpla & Model Kit',
      slug: 'gunpla-model-kit',
      count: 'HG, RG, MG chính hãng Bandai',
      image: 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=600',
    },
  ];

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-r from-gray-950 via-slate-900 to-red-950 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-600/30 border border-red-500/40 text-red-300 text-xs font-semibold backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-red-400" />
              <span>Chính hãng Nhật Bản • Đặt trước Figure giới hạn</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              Thế Giới Sản Phẩm <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-400">
                Văn Hóa Đại Chúng
              </span>{' '}
              Nhật Bản
            </h1>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              Khám phá hàng ngàn mô hình Figure chính hãng Good Smile, Bandai, Kotobukiya cùng manga, standee anime từ One Piece, Jujutsu Kaisen, Spy x Family.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/products?status=PRE_ORDER"
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-red-600/30 transition-all flex items-center gap-2"
              >
                <span>Xem hàng Pre-order</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/products"
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold rounded-xl backdrop-blur-sm border border-white/20 transition-all"
              >
                Khám phá danh mục
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Badges */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900">100% Chính Hãng</h4>
              <p className="text-[11px] text-gray-500">Nguyên seal từ Nhật Bản</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900">Đặt Trước Dễ Dàng</h4>
              <p className="text-[11px] text-gray-500">Chỉ cọc từ 30% - 40%</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900">Freeship Đơn Lớn</h4>
              <p className="text-[11px] text-gray-500">Miễn phí ship từ 1 triệu</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900">Otaku Points</h4>
              <p className="text-[11px] text-gray-500">Tích điểm đổi voucher</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Danh Mục Nổi Bật</h2>
            <p className="text-xs text-gray-500">Lựa chọn các dòng sản phẩm sưu tầm yêu thích của bạn</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className="group relative h-48 rounded-2xl overflow-hidden shadow-sm border border-gray-100 block"
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent p-4 flex flex-col justify-end text-white">
                <h3 className="font-bold text-sm group-hover:text-red-400 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-gray-300">{cat.count}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <div className="inline-block text-[11px] font-bold text-red-600 tracking-wider uppercase mb-1">
              Top Picks
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Sản Phẩm Đang Hot</h2>
          </div>
          <Link
            href="/products"
            className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1"
          >
            <span>Xem tất cả</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((item: ProductItem) => (
            <div
              key={item.id}
              className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
            >
              {/* Product Image */}
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

                {/* Status Badge */}
                <div className="absolute top-3 left-3 flex flex-col gap-1">
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
                      {item.originalPrice && Number(item.originalPrice) > Number(item.price) && (
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
      </section>
    </div>
  );
}
