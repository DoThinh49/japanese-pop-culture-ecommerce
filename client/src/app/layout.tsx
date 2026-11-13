import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Akiba Store | Website Kinh Doanh Sản Phẩm Văn Hóa Đại Chúng Nhật Bản',
  description:
    'Sàn thương mại điện tử chuyên biệt Figure, Manga, Nendoroid, Gunpla, Standee và phụ kiện anime chính hãng từ Nhật Bản.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${inter.className} min-h-screen flex flex-col bg-gray-50/50 text-gray-900`}>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
