# 🇯🇵 AKIBA STORE - Japanese Pop Culture E-Commerce Platform

Đề tài Khóa luận tốt nghiệp chuyên ngành Công nghệ thông tin:  
**Thiết kế và Xây dựng Website Kinh doanh Sản phẩm Văn hóa Đại chúng Nhật Bản**

---

## 🌟 1. Giới thiệu Đề tài

**Akiba Store** là sàn thương mại điện tử chuyên biệt phục vụ cộng đồng Otaku và những người yêu thích văn hóa đại chúng Nhật Bản tại Việt Nam. Hệ thống tập trung phân phối các mặt hàng chính hãng bao gồm:
- **Mô hình & Scale Figure:** Scale 1/7, 1/8, Nendoroid, Figma, Pop Up Parade, Prize figure từ các nhà sản xuất hàng đầu (Good Smile Company, Bandai Spirits, Kotobukiya, eStream...).
- **Manga & Light Novel:** Truyện tranh bản quyền, tiểu thuyết và artbook sưu tầm giới hạn.
- **Phụ kiện & Standee:** Standee mica acrylic cao cấp, móc khóa, huy hiệu, shikishi.
- **Gunpla & Model Kit:** Mô hình lắp ráp nhựa Gundam chính hãng Bandai (HG, RG, MG, PG).
- **Thời trang Anime:** Áo Hoodie, Graphic Tee phong cách Streetwear Tokyo & Harajuku.

Website giải quyết các bài toán đặc thù của thị trường mô hình Nhật:
- **Sản phẩm Đặt trước (Pre-order):** Hiển thị rõ dự kiến thời gian phát hành (ví dụ: *Quý 1/2027*), tình trạng đợt mở bán mà vẫn đảm bảo trải nghiệm thanh toán 1 bước liền mạch.
- **Hệ thống Điểm thưởng Otaku (Loyalty Points):** Tích lũy 1 điểm cho mỗi 10.000 VNĐ chi tiêu khi đơn hàng hoàn thành; sử dụng điểm trực tiếp để giảm trừ tiền thanh toán (1 điểm = 1.000 VNĐ).
- **Cổng thanh toán trực tuyến bảo mật VNPay Sandbox:** Tạo URL thanh toán VNPay chuẩn HMAC SHA512, tự động xác thực chữ ký số IPN và xử lý kết quả giao dịch.
- **Danh sách yêu thích (Wishlist):** Lưu trữ và quản lý các mô hình grail đang theo dõi.
- **Đánh giá & Chấm sao cộng đồng:** Cho phép người dùng để lại phản hồi thực tế và tính toán điểm trung bình.
- **Hệ thống Quản trị Toàn diện (Admin Dashboard):** Báo cáo doanh thu thời gian thực, quản lý kho sản phẩm, cập nhật trạng thái đơn hàng, tạo mã khuyến mãi và quản lý người dùng.

---

## 🛠️ 2. Kiến trúc & Công nghệ

| Thành phần | Công nghệ sử dụng |
| :--- | :--- |
| **Frontend** | Next.js 14+ (App Router), React 18, TypeScript, TailwindCSS, Zustand (State Management & Persist), Axios, Lucide React |
| **Backend API** | Node.js, Express.js, TypeScript, RESTful Architecture, JWT (Access 15m, Refresh 7d), bcryptjs |
| **Database** | PostgreSQL lưu trữ trên **Supabase Cloud** (Region Singapore: AWS AP-Southeast-1) |
| **ORM** | Prisma ORM 5.x (Schema-first, Migrations, Connection Pooling) |
| **Cổng thanh toán** | VNPay Gateway (Sandbox HMAC-SHA512 checksum) |
| **Triển khai Cloud** | Render (Web Service Node.js & Next.js), Supabase Cloud |

---

## 🗄️ 3. Cơ sở dữ liệu (Supabase Cloud PostgreSQL)

Hệ thống được thiết kế chuẩn hóa quan hệ gồm 21 bảng:
1. `users`: Tài khoản khách hàng và nhân sự quản trị (Role: `CUSTOMER`, `STAFF`, `ADMIN`).
2. `addresses`: Sổ địa chỉ giao hàng của người dùng.
3. `categories`: Danh mục sản phẩm (Figure, Manga, Standee, Gunpla, Thời trang).
4. `series`: Thương hiệu Anime / Manga (Jujutsu Kaisen, One Piece, Spy x Family, Gundam...).
5. `characters`: Nhân vật đại diện (Gojo Satoru, Luffy, Anya...).
6. `series_characters`: Bảng quan hệ n-n giữa Tác phẩm và Nhân vật.
7. `manufacturers`: Hãng sản xuất (Good Smile, Bandai, eStream, Kotobukiya...).
8. `products`: Chi tiết sản phẩm, giá bán, giá niêm yết, tồn kho, tỷ lệ, chất liệu, điểm đánh giá.
9. `product_images`: Bộ sưu tập ảnh sản phẩm độ phân giải cao.
10. `preorder_batches`: Các đợt mở đặt trước cho Figure (ngày mở, đóng, ngày dự kiến về hàng).
11. `orders`: Đơn đặt hàng (Mã đơn `AKB-YYYYMMDD-XXXX`, tổng tiền, chiết khấu, phương thức, trạng thái).
12. `order_items`: Chi tiết các mặt hàng trong đơn.
13. `order_status_history`: Nhật ký lịch sử thay đổi trạng thái đơn hàng và người thực hiện.
14. `payment_transactions`: Nhật ký giao dịch thanh toán VNPay / COD.
15. `vouchers`: Mã khuyến mãi giảm giá (theo % hoặc số tiền cố định).
16. `reviews`: Nhận xét và chấm sao 1-5 của khách hàng.
17. `review_images`: Ảnh đính kèm trong bài đánh giá.
18. `wishlists`: Bảng lưu trữ sản phẩm yêu thích của từng tài khoản.
19. `cart_items`: Đồng bộ giỏ hàng lên hệ thống.
20. `point_transactions`: Lịch sử cộng/trừ Điểm thưởng Otaku.
21. `notifications`: Thông báo hệ thống gửi tới người dùng.

---

## 🔑 4. Tài khoản Demo Kiểm thử

| Vai trò | Email Đăng nhập | Mật khẩu | Ghi chú |
| :--- | :--- | :--- | :--- |
| **Quản trị viên (Admin)** | `admin@nihonex.vn` (hoặc `admin@akibastore.vn`) | `AdminPassword123@` | Truy cập `/admin`, quản lý toàn bộ hệ thống |
| **Khách hàng (Otaku Member)** | `otaku@nihonex.vn` (hoặc `otaku@akibastore.vn`) | `UserPassword123@` | Có sẵn 150 Điểm Otaku, địa chỉ nhận hàng |

---

## 🚀 5. Hướng dẫn Chạy Thử Tại Máy Cục Bộ (Local)

### Yêu cầu tiên quyết
- Node.js >= 18.x
- npm >= 9.x
- Git

### Bước 1: Khởi động Backend API
```bash
cd server
npm install
npm run dev
# Server lắng nghe tại http://localhost:5000
# Kiểm tra API Health: http://localhost:5000/api/health
```

### Bước 2: Khởi động Frontend Client
```bash
cd client
npm install
npm run dev
# Ứng dụng Next.js lắng nghe tại http://localhost:3000
```

---

## 📡 6. Bảng Tra cứu API (RESTful Endpoints)

### Xác thực & Người dùng (`/api/auth`)
- `POST /register`: Đăng ký tài khoản mới
- `POST /login`: Đăng nhập & cấp phát Access Token + HttpOnly Refresh Cookie
- `POST /logout`: Hủy phiên đăng nhập
- `POST /refresh-token`: Cấp mới Access Token
- `GET /me`: Lấy thông tin tài khoản hiện tại & sổ địa chỉ
- `PUT /profile`: Cập nhật họ tên, số điện thoại
- `PUT /change-password`: Đổi mật khẩu
- `POST /addresses`: Thêm địa chỉ nhận hàng
- `PATCH /addresses/:id/default`: Thiết lập địa chỉ mặc định
- `DELETE /addresses/:id`: Xóa địa chỉ

### Danh mục & Sản phẩm (`/api/products`, `/api/catalog`)
- `GET /api/catalog/categories`: Lấy danh sách danh mục
- `GET /api/catalog/series`: Lấy danh sách thương hiệu Anime/Manga
- `GET /api/products`: Danh sách sản phẩm (hỗ trợ lọc danh mục, series, giá, tìm kiếm, phân trang)
- `GET /api/products/featured`: 8 sản phẩm nổi bật trang chủ
- `GET /api/products/:slug`: Chi tiết sản phẩm & các đánh giá cộng đồng
- `POST /api/products/:slug/reviews`: Gửi đánh giá 1-5 sao và nhận xét (yêu cầu đăng nhập)

### Yêu thích (`/api/wishlist`)
- `GET /api/wishlist`: Lấy danh sách sản phẩm yêu thích của tôi
- `POST /api/wishlist/:productId`: Thêm/xóa sản phẩm khỏi yêu thích (Toggle)
- `DELETE /api/wishlist/:productId`: Xóa khỏi yêu thích

### Đơn hàng & Thanh toán (`/api/orders`, `/api/payments`)
- `POST /api/orders`: Tạo đơn hàng mới (hỗ trợ áp mã voucher, trừ điểm Otaku, tính phí ship)
- `GET /api/orders/my-orders`: Lịch sử đơn hàng của khách hàng
- `GET /api/orders/:orderCode`: Chi tiết hóa đơn đơn hàng
- `GET /api/payments/vnpay/return`: Tiếp nhận kết quả thanh toán từ VNPay Gateway

### Quản trị hệ thống (`/api/admin`) - Bảo mật quyền `ADMIN` & `STAFF`
- `GET /api/admin/stats`: Thống kê doanh thu thực tế, số lượng đơn, sản phẩm, khách hàng
- `GET /api/admin/orders`: Quản lý danh sách đơn hàng toàn hệ thống
- `PATCH /api/admin/orders/:id/status`: Chuyển trạng thái đơn (`PENDING` ➔ `CONFIRMED` ➔ `PROCESSING` ➔ `SHIPPING` ➔ `DELIVERED` ➔ `COMPLETED` / `CANCELLED`)
- `GET /api/admin/products`: Danh sách sản phẩm quản trị
- `POST /api/admin/products`: Tạo mới sản phẩm
- `DELETE /api/admin/products/:id`: Xóa sản phẩm
- `GET /api/admin/vouchers`: Danh sách mã giảm giá
- `POST /api/admin/vouchers`: Tạo mã voucher mới
- `PATCH /api/admin/vouchers/:id/toggle`: Kích hoạt / Tắt mã giảm giá
- `GET /api/admin/users`: Danh sách thành viên và điểm tích lũy

---

## ☁️ 7. Hướng dẫn Triển khai Cloud (Render + Supabase)

Tệp cấu hình hạ tầng `render.yaml` đã được thiết lập sẵn:
1. Đẩy mã nguồn lên GitHub.
2. Trên **Render Dashboard**, chọn **New Blueprint Instance** và kết nối tới repository này.
3. Điền các biến môi trường bảo mật:
   - `DATABASE_URL`: Connection string PostgreSQL từ Supabase Cloud
   - `DIRECT_URL`: Direct connection string từ Supabase Cloud
   - `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`: Chuỗi khóa ký JWT
   - `VNPAY_TMN_CODE`, `VNPAY_HASH_SECRET`: Thông tin Sandbox từ VNPay
4. Render sẽ tự động build và chạy cả hai dịch vụ Backend API và Frontend Next.js.
