import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400 text-xs border-t border-gray-900 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded bg-red-600 text-white font-bold flex items-center justify-center text-lg">
                日
              </span>
              <span className="font-bold text-lg text-white">
                Akiba<span className="text-red-500">Commerce</span>
              </span>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed">
              Nền tảng thương mại điện tử chuyên biệt các sản phẩm văn hóa đại chúng Nhật Bản: Figure, Manga, Standee, Gunpla và Phụ kiện chính hãng.
            </p>
            <p className="text-[11px] text-gray-500">
              Đề tài Khóa luận tốt nghiệp ngành Công nghệ kỹ thuật phần mềm.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Danh mục sản phẩm</h4>
            <ul className="space-y-2">
              <li><Link href="/products?category=mo-hinh-figure" className="hover:text-white transition-colors">Mô hình Scale 1/7, 1/8</Link></li>
              <li><Link href="/products?category=mo-hinh-figure" className="hover:text-white transition-colors">Nendoroid chính hãng</Link></li>
              <li><Link href="/products?category=gunpla-model-kit" className="hover:text-white transition-colors">Gunpla Bandai Nhật Bản</Link></li>
              <li><Link href="/products?category=manga-light-novel" className="hover:text-white transition-colors">Manga & Light Novel</Link></li>
              <li><Link href="/pre-order" className="hover:text-white transition-colors">Lịch phát hành Pre-order</Link></li>
            </ul>
          </div>

          {/* Franchise */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Vũ trụ Anime hot</h4>
            <ul className="space-y-2">
              <li><Link href="/series/jujutsu-kaisen" className="hover:text-white transition-colors">Jujutsu Kaisen</Link></li>
              <li><Link href="/series/one-piece" className="hover:text-white transition-colors">One Piece</Link></li>
              <li><Link href="/series/spy-x-family" className="hover:text-white transition-colors">Spy x Family</Link></li>
              <li><Link href="/series/mobile-suit-gundam" className="hover:text-white transition-colors">Mobile Suit Gundam</Link></li>
            </ul>
          </div>

          {/* Payment & Cloud Tech */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Công nghệ & Thanh toán</h4>
            <p className="mb-2 text-gray-400">
              Hỗ trợ thanh toán an toàn qua <strong>VNPay</strong> và COD.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="px-2 py-1 bg-gray-900 border border-gray-800 rounded text-[11px] text-gray-300">Next.js 14</span>
              <span className="px-2 py-1 bg-gray-900 border border-gray-800 rounded text-[11px] text-gray-300">Express.js</span>
              <span className="px-2 py-1 bg-gray-900 border border-gray-800 rounded text-[11px] text-gray-300">Supabase Cloud</span>
              <span className="px-2 py-1 bg-gray-900 border border-gray-800 rounded text-[11px] text-gray-300">Prisma ORM</span>
              <span className="px-2 py-1 bg-gray-900 border border-gray-800 rounded text-[11px] text-gray-300">VNPay Sandbox</span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-900 mt-10 pt-6 text-center text-gray-500 text-[11px]">
          © {new Date().getFullYear()} AkibaCommerce - Japanese Pop Culture E-Commerce Platform. Khóa luận tốt nghiệp.
        </div>
      </div>
    </footer>
  );
}
