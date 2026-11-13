# 🎌 MASTER PLAN — Khóa Luận Tốt Nghiệp
## Thiết kế và Xây dựng Website Kinh Doanh Sản Phẩm Văn Hóa Đại Chúng Nhật Bản

> **Thời gian ước tính:** 14–16 tuần · **Độ khó:** ★★★★☆ · **Mục tiêu điểm:** 8.5–10.0

---

## Mục lục

1. [Tầm nhìn & Giá trị khác biệt](#1-tầm-nhìn--giá-trị-khác-biệt)
2. [Phạm vi chức năng (Scope)](#2-phạm-vi-chức-năng-scope)
3. [Kiến trúc & Công nghệ](#3-kiến-trúc--công-nghệ)
4. [Thiết kế Cơ sở dữ liệu (ERD)](#4-thiết-kế-cơ-sở-dữ-liệu-erd)
5. [Wireframe & UI/UX Design System](#5-wireframe--uiux-design-system)
6. [Lộ trình Sprint (16 tuần)](#6-lộ-trình-sprint-16-tuần)
7. [Cấu trúc Báo cáo Khóa luận (5 chương)](#7-cấu-trúc-báo-cáo-khóa-luận-5-chương)
8. [Checklist bảo vệ & Câu hỏi phản biện](#8-checklist-bảo-vệ--câu-hỏi-phản-biện)
9. [Rủi ro & Phương án dự phòng](#9-rủi-ro--phương-án-dự-phòng)

---

## 1. Tầm nhìn & Giá trị khác biệt

### 1.1. Bối cảnh thị trường

Thị trường văn hóa đại chúng Nhật Bản (J-Culture / Pop Culture) tại Việt Nam đang tăng trưởng mạnh mẽ:
- **Anime/Manga:** Việt Nam nằm trong Top 10 quốc gia xem anime nhiều nhất thế giới (theo Crunchyroll 2024).
- **Figure/Merchandise:** Nhu cầu sưu tầm mô hình (Nendoroid, Scale Figure, Gunpla, Ichiban Kuji) tăng đều 15–20%/năm.
- **Doanh thu dự kiến ngành Pop Culture toàn cầu:** $42 tỷ USD (2025) → Cơ hội thị trường ngách tại VN rất lớn.

### 1.2. Vấn đề hiện tại

| # | Vấn đề | Mô tả |
|---|--------|-------|
| 1 | **Mua hàng rời rạc** | Người mua phải tìm kiếm trên Facebook Group, Shopee lẫn lộn với hàng fake/rep. |
| 2 | **Không có hệ thống Pre-order chuyên nghiệp** | Đặt cọc qua tin nhắn Zalo, không có luồng tự động. |
| 3 | **Khó tìm theo fandom** | Shopee/Tiki không phân loại theo Anime → Nhân vật → Hãng sản xuất. |
| 4 | **Không xác minh được tình trạng hàng sưu tầm** | Không phân biệt New Sealed / Opened / No Box. |

### 1.3. Giải pháp đề xuất

Xây dựng **NihoNex** (tên gợi ý) — một nền tảng thương mại điện tử chuyên biệt cho sản phẩm văn hóa đại chúng Nhật Bản, với các tính năng nghiệp vụ đặc thù:

- ✅ **Fandom Navigation:** Duyệt sản phẩm theo Series → Nhân vật → Hãng sản xuất.
- ✅ **Pre-order & Deposit Flow:** Đặt cọc trước, nhận thông báo khi hàng về, thanh toán phần còn lại.
- ✅ **Condition Grading:** Phân loại tình trạng sản phẩm sưu tầm (New Sealed / Like New / No Box).
- ✅ **Otaku Points:** Tích điểm thưởng qua mỗi đơn hàng, đổi voucher giảm giá.
- ✅ **Release Calendar:** Lịch phát hành sản phẩm mới theo tháng (tham khảo AmiAmi).

> [!IMPORTANT]
> Đây chính là điểm bạn trả lời câu hỏi **"Web này khác gì Shopee?"** khi bảo vệ Khóa luận. Hội đồng sẽ hỏi câu này 100%.

---

## 2. Phạm vi chức năng (Scope)

### 2.1. Sơ đồ Actors

```mermaid
graph LR
    subgraph Actors
        A[Khách vãng lai]
        B[Khách hàng đã đăng ký]
        C[Nhân viên kho / Staff]
        D[Quản trị viên / Admin]
    end
```

### 2.2. Phân hệ chức năng chi tiết

#### 🟢 PHÂN HỆ KHÁCH HÀNG (Client-side)

| # | Module | Chức năng chi tiết | Độ ưu tiên |
|---|--------|--------------------|------------|
| F01 | **Xác thực** | Đăng ký, Đăng nhập (Email/Password + Google OAuth 2.0), Quên mật khẩu, Đổi mật khẩu | 🔴 Cao |
| F02 | **Trang chủ** | Banner slider (sản phẩm Hot / Pre-order mới), Sản phẩm theo danh mục, Sản phẩm bán chạy, Sắp phát hành | 🔴 Cao |
| F03 | **Catalog & Tìm kiếm** | Duyệt theo: Danh mục (Figure, Manga, Artbook, Merch, Gunpla…) → Series (One Piece, JJK…) → Nhân vật. Lọc theo: Giá, Hãng SX, Tình trạng, Năm phát hành. Tìm kiếm Full-text. Sắp xếp (Giá, Mới nhất, Bán chạy) | 🔴 Cao |
| F04 | **Chi tiết sản phẩm** | Gallery ảnh zoom, Thông tin chi tiết (Kích thước, Chất liệu, Hãng SX, Series, Nhân vật), Tình trạng (New/Like New/No Box), Đánh giá & Bình luận, Sản phẩm liên quan cùng Series/Nhân vật | 🔴 Cao |
| F05 | **Giỏ hàng** | Thêm/Xóa/Sửa số lượng, Áp mã giảm giá, Tính phí vận chuyển ước tính | 🔴 Cao |
| F06 | **Đặt hàng thường** | Chọn địa chỉ giao hàng, Chọn phương thức thanh toán (COD / VNPay / MoMo / Chuyển khoản), Xác nhận đơn, Nhận email xác nhận | 🔴 Cao |
| F07 | **Pre-order & Đặt cọc** | Chọn sản phẩm Pre-order → Thanh toán cọc (30–50%) → Nhận thông báo khi hàng về kho → Thanh toán phần còn lại trong 7 ngày → Giao hàng | 🟡 Trung bình |
| F08 | **Quản lý đơn hàng** | Xem danh sách đơn, Chi tiết đơn, Theo dõi trạng thái (Chờ xác nhận → Đang xử lý → Đang giao → Hoàn thành → Đã hủy), Hủy đơn (trước khi giao) | 🔴 Cao |
| F09 | **Wishlist** | Thêm/Xóa sản phẩm yêu thích, Nhận thông báo khi sản phẩm giảm giá hoặc có hàng | 🟡 Trung bình |
| F10 | **Hồ sơ cá nhân** | Cập nhật thông tin, Quản lý sổ địa chỉ, Xem lịch sử mua hàng, Xem điểm Otaku Points | 🔴 Cao |
| F11 | **Otaku Points** | Tích điểm theo giá trị đơn hàng (1.000đ = 1 point), Đổi voucher giảm giá, Xem lịch sử tích/tiêu điểm | 🟡 Trung bình |
| F12 | **Release Calendar** | Xem lịch phát hành sản phẩm mới theo tháng/tuần, Đăng ký nhận thông báo khi sản phẩm phát hành | 🟢 Thấp |
| F13 | **Đánh giá & Bình luận** | Viết đánh giá (1–5 sao) + hình ảnh, Chỉ cho phép đánh giá sau khi mua | 🟡 Trung bình |

#### 🔵 PHÂN HỆ QUẢN TRỊ (Admin-side)

| # | Module | Chức năng chi tiết | Độ ưu tiên |
|---|--------|--------------------|------------|
| A01 | **Dashboard** | Tổng quan doanh thu (ngày/tuần/tháng/năm), Đơn hàng mới, Sản phẩm sắp hết hàng, Biểu đồ (Chart.js / Recharts) | 🔴 Cao |
| A02 | **Quản lý Danh mục** | CRUD danh mục sản phẩm (Figure, Manga, Artbook, Merch, Gunpla, Blind Box…) | 🔴 Cao |
| A03 | **Quản lý Series** | CRUD Series/Franchise (One Piece, Naruto, JJK, Genshin Impact…), Gắn ảnh bìa, Mô tả | 🔴 Cao |
| A04 | **Quản lý Nhân vật** | CRUD nhân vật, Liên kết N–N với Series (1 nhân vật có thể thuộc nhiều series) | 🔴 Cao |
| A05 | **Quản lý Hãng SX** | CRUD hãng sản xuất (Good Smile Company, Bandai, Kotobukiya, MegaHouse, Banpresto…) | 🔴 Cao |
| A06 | **Quản lý Sản phẩm** | CRUD sản phẩm, Upload nhiều ảnh, Gắn tag Series/Nhân vật/Hãng SX, Đặt giá/Giá cọc, Chọn tình trạng, Quản lý tồn kho | 🔴 Cao |
| A07 | **Quản lý Đơn hàng** | Xem/Lọc đơn hàng, Cập nhật trạng thái đơn, Xem chi tiết đơn + lịch sử trạng thái, Quản lý đơn Pre-order riêng | 🔴 Cao |
| A08 | **Quản lý Pre-order** | Tạo đợt Pre-order (ngày mở/đóng, ngày dự kiến về hàng), Gửi thông báo khi hàng về, Theo dõi danh sách cọc | 🟡 Trung bình |
| A09 | **Quản lý Voucher** | CRUD mã giảm giá (% hoặc số tiền cố định), Điều kiện áp dụng (đơn tối thiểu, danh mục cụ thể), Thời hạn | 🟡 Trung bình |
| A10 | **Quản lý Người dùng** | Xem danh sách, Khóa/Mở khóa tài khoản, Xem lịch sử mua hàng của user | 🔴 Cao |
| A11 | **Quản lý Bài viết/Blog** | CRUD bài viết tin tức, review sản phẩm (SEO Content Marketing) | 🟢 Thấp |
| A12 | **Báo cáo & Thống kê** | Doanh thu theo thời gian, Top sản phẩm bán chạy, Top Series/Nhân vật được quan tâm, Báo cáo tồn kho | 🟡 Trung bình |

> [!TIP]
> **Chiến lược MVP:** Làm tất cả mục 🔴 Cao trước (Sprint 1–4), sau đó bổ sung 🟡 Trung bình (Sprint 5–6), cuối cùng là 🟢 Thấp nếu còn thời gian.

---

## 3. Kiến trúc & Công nghệ

### 3.1. Sơ đồ Kiến trúc tổng thể

```mermaid
graph TB
    subgraph "Client Layer"
        FE["Next.js 14+ (App Router)<br/>React 18 · TypeScript"]
    end

    subgraph "API Layer"
        BE["Node.js + Express.js<br/>hoặc NestJS · TypeScript"]
        AUTH["JWT + Refresh Token<br/>+ Google OAuth 2.0"]
    end

    subgraph "☁️ Supabase Cloud (External DB)"
        DB["PostgreSQL 15<br/>(Supabase Free Tier)"]
        STORAGE["Supabase Storage<br/>(Ảnh sản phẩm - 1GB Free)"]
        REALTIME["Supabase Realtime<br/>(Notifications)"]
    end

    subgraph "3rd Party Services"
        VNPAY["VNPay Sandbox"]
        MOMO["MoMo Sandbox"]
        EMAIL["Nodemailer<br/>(Gmail SMTP)"]
        CDN["Cloudinary CDN<br/>(Backup ảnh - 25GB Free)"]
    end

    FE -->|REST API / Axios| BE
    BE --> AUTH
    BE -->|Prisma ORM<br/>Connection String| DB
    BE -->|Supabase JS Client| STORAGE
    BE -->|WebSocket| REALTIME
    BE --> VNPAY
    BE --> MOMO
    BE --> EMAIL
    FE -->|Direct Upload| CDN
```

> [!IMPORTANT]
> **CSDL kết nối từ nguồn bên ngoài (Supabase Cloud)** — Không cần cài đặt PostgreSQL trên máy local hay trên server web. Backend chỉ cần `DATABASE_URL` connection string từ Supabase để kết nối. Đây là kiến trúc **Database-as-a-Service (DBaaS)** — điểm cộng lớn khi bảo vệ Khóa luận.

### 3.2. Chi tiết Tech Stack

| Layer | Công nghệ | Lý do chọn (viết vào Chương 2 Khóa luận) |
|-------|-----------|-------------------------------------------|
| **Frontend** | Next.js 14+ (App Router) + TypeScript | SSR/SSG hỗ trợ SEO tốt cho e-commerce, React ecosystem lớn, Image Optimization built-in |
| **Styling** | Vanilla CSS + CSS Modules (hoặc TailwindCSS nếu muốn nhanh) | Kiểm soát hoàn toàn thiết kế, tạo Design System riêng cho phong cách Nhật Bản |
| **State Management** | Zustand hoặc React Context | Nhẹ, đơn giản, đủ cho e-commerce |
| **Backend** | Node.js + Express.js (hoặc NestJS) + TypeScript | Cùng ngôn ngữ TypeScript với FE, JSON native, ecosystem npm khổng lồ |
| **ORM** | Prisma | Type-safe, auto-generate migration, schema trực quan |
| **☁️ Database** | **Supabase PostgreSQL (Cloud — Free tier)** | **CSDL bên ngoài**, không cài local. ACID compliance, JSON support, Full-text search. Free: 500MB storage, 2 projects, unlimited API requests |
| **☁️ File Storage** | **Supabase Storage (1GB Free)** + Cloudinary (25GB Free backup) | Upload ảnh sản phẩm lên cloud, CDN tự động, không lưu ảnh trên server web |
| **Authentication** | JWT (Access + Refresh Token) + bcrypt | Stateless, scalable, chuẩn industry |
| **OAuth** | Google OAuth 2.0 (Passport.js) | Đăng nhập nhanh, tăng tỉ lệ chuyển đổi |
| **Payment** | VNPay Sandbox + MoMo Test | Cổng thanh toán phổ biến tại VN, có môi trường test miễn phí |
| **Email** | Nodemailer + Gmail SMTP | Gửi email xác nhận đơn hàng, thông báo pre-order |
| **Deployment** | **Render (FE + BE)** + **Supabase (DB + Storage)** | Toàn bộ miễn phí, 1 platform duy nhất cho cả Frontend lẫn Backend, đơn giản quản lý |
| **Version Control** | Git + GitHub | Quản lý source code, CI/CD |

### 3.3. Kiến trúc kết nối CSDL bên ngoài (Supabase Cloud)

> [!NOTE]
> **Tại sao dùng CSDL bên ngoài thay vì chạy local?**
> - Giảng viên có thể truy cập Dashboard Supabase để kiểm tra dữ liệu khi bảo vệ
> - Không phụ thuộc vào máy cá nhân — nhiều người có thể kết nối cùng 1 DB
> - Giống mô hình production thực tế (Database-as-a-Service)
> - Có sẵn backup tự động, monitoring, và GUI quản lý

#### 🔗 Cách kết nối Supabase với Prisma

```
┌─────────────────────────┐     Connection String (DATABASE_URL)     ┌──────────────────────────┐
│                         │ ──────────────────────────────────────▶  │                          │
│   Server (Express.js)   │     postgresql://postgres.[ref]:         │   Supabase Cloud         │
│   chạy trên Render.com  │     [password]@aws-0-ap-southeast-1.     │   PostgreSQL 15          │
│   hoặc Render.com       │     pooler.supabase.com:6543/postgres    │   (Singapore Region)     │
│                         │ ◀──────────────────────────────────────  │                          │
└─────────────────────────┘     Query Results (JSON)                 └──────────────────────────┘
```

#### 📋 Các bước thiết lập Supabase (Miễn phí)

| Bước | Hành động | Chi tiết |
|------|-----------|----------|
| 1 | Đăng ký tài khoản | Truy cập [supabase.com](https://supabase.com), đăng ký bằng GitHub |
| 2 | Tạo Project mới | Chọn tên "nihonex", Region: **Singapore (ap-southeast-1)** để tốc độ nhanh nhất từ VN, đặt Database Password |
| 3 | Lấy Connection String | Vào **Settings → Database → Connection String → URI** → Copy |
| 4 | Cấu hình `.env` | `DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"` |
| 5 | Cấu hình Direct URL | `DIRECT_URL="postgresql://postgres.[ref]:[password]@aws-0-ap-southeast-1.supabase.com:5432/postgres"` (dùng cho Prisma migrate) |
| 6 | Chạy Migration | `npx prisma migrate dev --name init` → Prisma tự tạo 21 bảng trên Supabase |
| 7 | Seed Data | `npx prisma db seed` → Đổ dữ liệu mẫu lên cloud |
| 8 | Kiểm tra | Mở Supabase Dashboard → **Table Editor** → Xem dữ liệu trực tiếp trên trình duyệt |

#### 🔐 Cấu hình Prisma cho Supabase

```prisma
// prisma/schema.prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")       // Connection pooling (PgBouncer)
  directUrl = env("DIRECT_URL")         // Direct connection (for migrations)
}
```

#### 📊 So sánh Supabase Free Tier với các lựa chọn khác

| Tiêu chí | Supabase ✅ | Neon | Railway | PlanetScale |
|----------|-----------|------|---------|-------------|
| **Database** | PostgreSQL 15 | PostgreSQL | PostgreSQL | MySQL |
| **Storage** | 500MB | 512MB | 1GB (5$/mo) | 5GB |
| **File Storage** | 1GB (built-in) | ❌ | ❌ | ❌ |
| **Dashboard GUI** | ✅ Rất đẹp | ✅ Cơ bản | ✅ Cơ bản | ✅ Tốt |
| **Realtime** | ✅ WebSocket | ❌ | ❌ | ❌ |
| **Auth built-in** | ✅ (tùy chọn dùng) | ❌ | ❌ | ❌ |
| **Region gần VN** | ✅ Singapore | ✅ Singapore | ❌ US only | ❌ US only |
| **Giá** | **Miễn phí** | Miễn phí | 5$/tháng | Miễn phí |
| **Phù hợp Khóa luận** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |

> [!TIP]
> **Điểm cộng khi bảo vệ:** Bạn có thể mở Supabase Dashboard trực tiếp trên trình duyệt để cho Hội đồng thấy dữ liệu thực trong database — rất ấn tượng!

### 3.4. Cấu trúc thư mục dự kiến

```
KhoaLuanTotNghiep/
├── client/                          # Frontend (Next.js)
│   ├── public/
│   │   ├── images/
│   │   └── fonts/
│   ├── src/
│   │   ├── app/                     # App Router pages
│   │   │   ├── (auth)/              # Route group: Login, Register
│   │   │   ├── (shop)/              # Route group: Home, Catalog, Product Detail
│   │   │   ├── cart/
│   │   │   ├── checkout/
│   │   │   ├── account/
│   │   │   ├── preorder/
│   │   │   └── admin/               # Admin pages
│   │   │       ├── dashboard/
│   │   │       ├── products/
│   │   │       ├── orders/
│   │   │       ├── series/
│   │   │       ├── characters/
│   │   │       └── users/
│   │   ├── components/              # Reusable components
│   │   │   ├── ui/                  # Button, Input, Modal, Card...
│   │   │   ├── layout/             # Header, Footer, Sidebar, Navbar
│   │   │   ├── product/            # ProductCard, ProductGrid, ProductFilter
│   │   │   ├── cart/               # CartItem, CartSummary
│   │   │   └── admin/              # AdminTable, AdminChart, AdminForm
│   │   ├── hooks/                   # Custom React hooks
│   │   ├── lib/                     # Utilities, API client (Axios), constants
│   │   ├── stores/                  # Zustand stores
│   │   ├── types/                   # TypeScript type definitions
│   │   └── styles/                  # Global CSS, Design tokens
│   ├── next.config.js
│   ├── tsconfig.json
│   └── package.json
│
├── server/                          # Backend (Express/NestJS)
│   ├── prisma/
│   │   ├── schema.prisma           # Database schema
│   │   ├── migrations/
│   │   └── seed.ts                 # Seed data (sản phẩm mẫu)
│   ├── src/
│   │   ├── config/                 # DB config, env, constants
│   │   ├── middleware/             # Auth middleware, error handler, upload
│   │   ├── modules/               # Feature modules
│   │   │   ├── auth/              # Controller, Service, DTO, Route
│   │   │   ├── user/
│   │   │   ├── product/
│   │   │   ├── category/
│   │   │   ├── series/
│   │   │   ├── character/
│   │   │   ├── manufacturer/
│   │   │   ├── order/
│   │   │   ├── preorder/
│   │   │   ├── cart/
│   │   │   ├── payment/           # VNPay, MoMo integration
│   │   │   ├── voucher/
│   │   │   ├── review/
│   │   │   ├── wishlist/
│   │   │   ├── points/            # Otaku Points
│   │   │   ├── upload/            # Cloudinary upload
│   │   │   └── dashboard/         # Admin statistics
│   │   ├── utils/                 # Helpers, validators
│   │   └── app.ts                 # Express app entry
│   ├── tsconfig.json
│   └── package.json
│
├── docs/                           # Tài liệu Khóa luận
│   ├── diagrams/                  # UML, ERD, Architecture diagrams
│   ├── wireframes/                # UI mockups
│   └── thesis/                    # Bản thảo Khóa luận (.docx/.tex)
│
├── .env.example                    # Template biến môi trường
├── .gitignore
└── README.md                       # Hướng dẫn setup + Supabase connection
```

---

## 4. Thiết kế Cơ sở dữ liệu (ERD)

### 4.1. Sơ đồ quan hệ thực thể (Entity Relationship Diagram)

```mermaid
erDiagram
    USERS {
        int id PK
        string email UK
        string password_hash
        string full_name
        string phone
        string avatar_url
        enum role "CUSTOMER | STAFF | ADMIN"
        int otaku_points "DEFAULT 0"
        enum auth_provider "LOCAL | GOOGLE"
        boolean is_active "DEFAULT true"
        datetime created_at
        datetime updated_at
    }

    ADDRESSES {
        int id PK
        int user_id FK
        string recipient_name
        string phone
        string province
        string district
        string ward
        string street_address
        boolean is_default
    }

    CATEGORIES {
        int id PK
        string name "Figure, Manga, Artbook, Merch, Gunpla, Blind Box"
        string slug UK
        string description
        string image_url
        int sort_order
        boolean is_active
    }

    SERIES {
        int id PK
        string name "One Piece, Jujutsu Kaisen..."
        string slug UK
        string description
        string cover_image_url
        string origin "Anime, Manga, Game, Light Novel"
        int release_year
        boolean is_active
    }

    CHARACTERS {
        int id PK
        string name "Gojo Satoru, Luffy..."
        string slug UK
        string description
        string image_url
        boolean is_active
    }

    SERIES_CHARACTERS {
        int series_id FK
        int character_id FK
    }

    MANUFACTURERS {
        int id PK
        string name "Good Smile Company, Bandai..."
        string slug UK
        string logo_url
        string country "DEFAULT Japan"
        string website_url
        boolean is_active
    }

    PRODUCTS {
        int id PK
        string name
        string slug UK
        string sku UK
        text description
        decimal price
        decimal original_price "Giá gốc (để hiển thị giảm giá)"
        decimal deposit_percentage "30-50% cho Pre-order"
        int stock_quantity
        int sold_count "DEFAULT 0"
        enum condition "NEW_SEALED | LIKE_NEW | OPENED | NO_BOX"
        string scale "1/7, 1/8, Nendoroid, Prize..."
        string material "PVC, ABS, Resin..."
        decimal height_cm
        date release_date
        enum status "IN_STOCK | PRE_ORDER | OUT_OF_STOCK | DISCONTINUED"
        boolean is_featured
        boolean is_active
        int category_id FK
        int series_id FK
        int character_id FK
        int manufacturer_id FK
        decimal avg_rating "DEFAULT 0"
        int review_count "DEFAULT 0"
        datetime created_at
        datetime updated_at
    }

    PRODUCT_IMAGES {
        int id PK
        int product_id FK
        string image_url
        int sort_order
        boolean is_primary
    }

    PREORDER_BATCHES {
        int id PK
        int product_id FK
        datetime open_date
        datetime close_date
        date estimated_arrival
        date actual_arrival
        enum status "OPEN | CLOSED | ARRIVED | COMPLETED"
        int max_quantity
        int current_quantity "DEFAULT 0"
    }

    ORDERS {
        int id PK
        string order_code UK "NHX-20260101-XXXX"
        int user_id FK
        int address_id FK
        enum type "NORMAL | PREORDER"
        decimal subtotal
        decimal shipping_fee
        decimal discount_amount
        decimal total_amount
        decimal deposit_paid "Cho pre-order"
        decimal remaining_amount "Cho pre-order"
        enum payment_method "COD | VNPAY | MOMO | BANK_TRANSFER"
        enum payment_status "PENDING | DEPOSIT_PAID | FULLY_PAID | REFUNDED"
        enum order_status "PENDING | CONFIRMED | PROCESSING | SHIPPING | DELIVERED | COMPLETED | CANCELLED"
        int voucher_id FK
        int points_used "DEFAULT 0"
        decimal points_discount
        string note
        datetime created_at
        datetime updated_at
    }

    ORDER_ITEMS {
        int id PK
        int order_id FK
        int product_id FK
        int preorder_batch_id FK "nullable"
        int quantity
        decimal unit_price
        decimal subtotal
    }

    ORDER_STATUS_HISTORY {
        int id PK
        int order_id FK
        enum from_status
        enum to_status
        string note
        int changed_by FK "user_id of staff/admin"
        datetime created_at
    }

    PAYMENT_TRANSACTIONS {
        int id PK
        int order_id FK
        string transaction_code UK
        enum provider "VNPAY | MOMO | BANK_TRANSFER | COD"
        decimal amount
        enum type "DEPOSIT | FULL_PAYMENT | REMAINING_PAYMENT | REFUND"
        enum status "PENDING | SUCCESS | FAILED | CANCELLED"
        text raw_response "JSON from payment gateway"
        datetime created_at
    }

    VOUCHERS {
        int id PK
        string code UK
        enum type "PERCENTAGE | FIXED_AMOUNT"
        decimal value
        decimal min_order_amount
        decimal max_discount "For percentage type"
        int usage_limit
        int used_count "DEFAULT 0"
        datetime start_date
        datetime end_date
        boolean is_active
    }

    REVIEWS {
        int id PK
        int user_id FK
        int product_id FK
        int order_id FK
        int rating "1-5"
        text comment
        boolean is_approved "DEFAULT true"
        datetime created_at
    }

    REVIEW_IMAGES {
        int id PK
        int review_id FK
        string image_url
    }

    WISHLISTS {
        int user_id FK
        int product_id FK
        datetime created_at
    }

    CART_ITEMS {
        int id PK
        int user_id FK
        int product_id FK
        int quantity
        datetime created_at
    }

    POINT_TRANSACTIONS {
        int id PK
        int user_id FK
        int order_id FK "nullable"
        enum type "EARN | SPEND | EXPIRE | ADMIN_ADJUST"
        int points
        string description
        datetime created_at
    }

    NOTIFICATIONS {
        int id PK
        int user_id FK
        string title
        text message
        enum type "ORDER_UPDATE | PREORDER_ARRIVED | PRICE_DROP | SYSTEM"
        boolean is_read "DEFAULT false"
        datetime created_at
    }

    %% Relationships
    USERS ||--o{ ADDRESSES : "has many"
    USERS ||--o{ ORDERS : "places"
    USERS ||--o{ REVIEWS : "writes"
    USERS ||--o{ WISHLISTS : "has"
    USERS ||--o{ CART_ITEMS : "has"
    USERS ||--o{ POINT_TRANSACTIONS : "has"
    USERS ||--o{ NOTIFICATIONS : "receives"

    SERIES ||--o{ SERIES_CHARACTERS : "has"
    CHARACTERS ||--o{ SERIES_CHARACTERS : "belongs to"

    CATEGORIES ||--o{ PRODUCTS : "contains"
    SERIES ||--o{ PRODUCTS : "has"
    CHARACTERS ||--o{ PRODUCTS : "features"
    MANUFACTURERS ||--o{ PRODUCTS : "produces"

    PRODUCTS ||--o{ PRODUCT_IMAGES : "has"
    PRODUCTS ||--o{ PREORDER_BATCHES : "has"
    PRODUCTS ||--o{ ORDER_ITEMS : "in"
    PRODUCTS ||--o{ REVIEWS : "has"
    PRODUCTS ||--o{ WISHLISTS : "in"
    PRODUCTS ||--o{ CART_ITEMS : "in"

    ORDERS ||--o{ ORDER_ITEMS : "contains"
    ORDERS ||--o{ ORDER_STATUS_HISTORY : "has"
    ORDERS ||--o{ PAYMENT_TRANSACTIONS : "has"
    ORDERS }o--|| VOUCHERS : "uses"
    ORDERS }o--|| ADDRESSES : "ships to"

    PREORDER_BATCHES ||--o{ ORDER_ITEMS : "linked"

    REVIEWS ||--o{ REVIEW_IMAGES : "has"
```

### 4.2. Bảng tổng hợp các Entity

| # | Bảng | Mô tả | Số trường ước tính |
|---|------|--------|-------------------|
| 1 | `users` | Người dùng (Khách hàng, Staff, Admin) | 12 |
| 2 | `addresses` | Sổ địa chỉ giao hàng | 9 |
| 3 | `categories` | Danh mục sản phẩm | 6 |
| 4 | `series` | Series/Franchise anime/manga/game | 8 |
| 5 | `characters` | Nhân vật | 6 |
| 6 | `series_characters` | Quan hệ N–N giữa Series và Nhân vật | 2 |
| 7 | `manufacturers` | Hãng sản xuất | 6 |
| 8 | `products` | Sản phẩm (core entity) | 22 |
| 9 | `product_images` | Ảnh sản phẩm (1–N) | 4 |
| 10 | `preorder_batches` | Đợt Pre-order | 8 |
| 11 | `orders` | Đơn hàng | 18 |
| 12 | `order_items` | Chi tiết đơn hàng | 6 |
| 13 | `order_status_history` | Lịch sử trạng thái đơn | 5 |
| 14 | `payment_transactions` | Giao dịch thanh toán | 8 |
| 15 | `vouchers` | Mã giảm giá | 10 |
| 16 | `reviews` | Đánh giá sản phẩm | 7 |
| 17 | `review_images` | Ảnh đánh giá | 3 |
| 18 | `wishlists` | Danh sách yêu thích | 3 |
| 19 | `cart_items` | Giỏ hàng | 4 |
| 20 | `point_transactions` | Lịch sử điểm Otaku Points | 6 |
| 21 | `notifications` | Thông báo | 6 |

**Tổng: 21 bảng** — Đủ quy mô cho Khóa luận tốt nghiệp (thường yêu cầu 12–25 bảng).

---

## 5. Wireframe & UI/UX Design System

### 5.1. Design System — Phong cách "Japanese Pop Culture"

| Token | Giá trị | Mục đích |
|-------|---------|----------|
| **Primary Color** | `#FF4757` (Đỏ Torii) | Nút CTA, giá tiền, badge Hot |
| **Secondary Color** | `#2F3542` (Đen sâu) | Nền Header, Admin sidebar |
| **Accent Color** | `#FFA502` (Cam Vàng) | Sao đánh giá, điểm thưởng, Pre-order badge |
| **Background** | `#FAFAFA` (Trắng ấm) | Nền trang chính |
| **Card Background** | `#FFFFFF` | Card sản phẩm |
| **Text Primary** | `#2F3542` | Tiêu đề, nội dung chính |
| **Text Secondary** | `#747D8C` | Mô tả phụ |
| **Success** | `#2ED573` | Trạng thái thành công, Còn hàng |
| **Warning** | `#FFA502` | Pre-order, Sắp hết |
| **Error** | `#FF4757` | Lỗi, Hết hàng |
| **Font Heading** | `Outfit` (Google Fonts) | Tiêu đề hiện đại, sắc nét |
| **Font Body** | `Inter` (Google Fonts) | Nội dung dễ đọc |
| **Font Japanese** | `Noto Sans JP` (Google Fonts) | Tên sản phẩm tiếng Nhật |
| **Border Radius** | `12px` (Card), `8px` (Button), `50%` (Avatar) | Bo tròn mềm mại |
| **Shadow** | `0 4px 20px rgba(0,0,0,0.08)` | Elevation nhẹ nhàng |
| **Transition** | `all 0.3s cubic-bezier(0.4, 0, 0.2, 1)` | Hiệu ứng mượt |

### 5.2. Các trang cần thiết kế

**Client-side (12 trang):**
1. Trang chủ (Home)
2. Trang danh mục / Catalog (với bộ lọc)
3. Trang chi tiết sản phẩm (Product Detail)
4. Trang Series (tất cả sản phẩm của 1 series)
5. Trang Giỏ hàng
6. Trang Thanh toán (Checkout)
7. Trang Pre-order
8. Trang Tài khoản (Profile + Đơn hàng + Wishlist + Points)
9. Trang Đăng nhập / Đăng ký
10. Trang Release Calendar
11. Trang Kết quả tìm kiếm
12. Trang Blog/Tin tức (nếu có thời gian)

**Admin-side (8 trang):**
1. Dashboard
2. Quản lý Sản phẩm
3. Quản lý Đơn hàng
4. Quản lý Danh mục / Series / Nhân vật / Hãng SX
5. Quản lý Pre-order
6. Quản lý Người dùng
7. Quản lý Voucher
8. Báo cáo & Thống kê

---

## 6. Lộ trình Sprint (16 tuần)

### Tổng quan Timeline

```mermaid
gantt
    title Lộ trình Khóa luận - 16 tuần
    dateFormat  YYYY-MM-DD
    axisFormat  %d/%m

    section Giai đoạn 1: Nền tảng
    Khảo sát & Đặc tả yêu cầu          :a1, 2026-10-01, 7d
    Thiết kế DB & Kiến trúc              :a2, after a1, 7d
    Setup project & Auth                  :a3, after a2, 7d

    section Giai đoạn 2: Backend Core
    API Sản phẩm + Danh mục + Series     :b1, after a3, 7d
    API Giỏ hàng + Đơn hàng             :b2, after b1, 7d
    API Pre-order + Thanh toán           :b3, after b2, 7d

    section Giai đoạn 3: Frontend
    Trang chủ + Catalog + Detail         :c1, after b3, 10d
    Giỏ hàng + Checkout + Pre-order      :c2, after c1, 7d
    Tài khoản + Wishlist + Points        :c3, after c2, 7d

    section Giai đoạn 4: Admin
    Admin Dashboard + CRUD Sản phẩm      :d1, after c3, 7d
    Admin Đơn hàng + Users + Thống kê    :d2, after d1, 7d

    section Giai đoạn 5: Hoàn thiện
    Kiểm thử + Fix bug + Tối ưu         :e1, after d2, 7d
    Viết Khóa luận + Slide               :e2, after d2, 14d
    Chuẩn bị bảo vệ                      :e3, after e2, 7d
```

### Chi tiết từng Sprint

---

#### 🟦 SPRINT 0 — Khảo sát & Chuẩn bị (Tuần 1)

| Task | Mô tả | Output |
|------|--------|--------|
| S0.1 | Khảo sát 3–5 website đối thủ (AmiAmi, Tokyo Otaku Mode, Japan Figure VN, Otaku Store VN) | Bảng so sánh tính năng |
| S0.2 | Xác định danh sách chức năng (Scope) theo MoSCoW (Must/Should/Could/Won't) | Bảng phân loại chức năng |
| S0.3 | Vẽ Use Case Diagram (Visio / Draw.io / PlantUML) | File UML |
| S0.4 | Vẽ Activity Diagram cho 3 luồng chính: Đặt hàng thường, Pre-order, Thanh toán VNPay | File UML |
| S0.5 | Thiết kế ERD chi tiết (dựa trên Section 4 ở trên) | File ERD |
| S0.6 | Thiết kế Wireframe low-fidelity cho 5 trang chính (Figma / Excalidraw) | File Wireframe |

**✅ Milestone:** Hoàn thành tài liệu phân tích & thiết kế → Nộp cho GVHD duyệt.

---

#### 🟦 SPRINT 1 — Setup Project & Authentication (Tuần 2)

| Task | Chi tiết |
|------|----------|
| S1.1 | Khởi tạo monorepo: `client/` (Next.js 14) + `server/` (Express.js + TypeScript) |
| S1.2 | **Tạo project Supabase** (supabase.com → New Project → Region Singapore), lấy `DATABASE_URL` + `DIRECT_URL`, cấu hình `.env` |
| S1.3 | Cấu hình Prisma schema với `datasource` trỏ đến Supabase Cloud, chạy `prisma migrate dev` tạo 21 bảng trên cloud |
| S1.4 | Seed data mẫu: 5 categories, 10 series, 20 characters, 5 manufacturers, 50 products |
| S1.5 | API Auth: Register, Login (JWT Access + Refresh Token), Logout |
| S1.6 | API Auth: Google OAuth 2.0 (Passport.js) |
| S1.7 | API Auth: Forgot Password (send OTP via email), Reset Password |
| S1.8 | Middleware: Auth guard, Role guard (CUSTOMER / STAFF / ADMIN) |
| S1.9 | Frontend: Trang Login / Register với form validation |
| S1.10 | Cấu hình ESLint + Prettier + Husky pre-commit |

**✅ Milestone:** Đăng ký + Đăng nhập + Phân quyền hoạt động end-to-end.

---

#### 🟦 SPRINT 2 — API Backend Core: Sản phẩm & Danh mục (Tuần 3–4)

| Task | Chi tiết |
|------|----------|
| S2.1 | API CRUD Categories (Admin) |
| S2.2 | API CRUD Series + upload cover image lên Cloudinary (Admin) |
| S2.3 | API CRUD Characters + liên kết N–N với Series (Admin) |
| S2.4 | API CRUD Manufacturers (Admin) |
| S2.5 | API CRUD Products: Tạo sản phẩm với nhiều ảnh, gắn Category/Series/Character/Manufacturer (Admin) |
| S2.6 | API GET Products: Phân trang, Lọc (category, series, character, manufacturer, condition, status, price range), Sắp xếp, Full-text search |
| S2.7 | API GET Product Detail: Bao gồm ảnh, reviews, sản phẩm liên quan cùng series/character |
| S2.8 | API Upload ảnh lên Cloudinary (module dùng chung) |
| S2.9 | API CRUD Vouchers (Admin) |
| S2.10 | Viết Unit Test cho Product API (Jest) |

**✅ Milestone:** Toàn bộ API quản lý sản phẩm hoạt động, có dữ liệu mẫu phong phú.

---

#### 🟦 SPRINT 3 — API Backend: Giỏ hàng, Đơn hàng, Thanh toán (Tuần 5–6)

| Task | Chi tiết |
|------|----------|
| S3.1 | API Cart: Thêm/Sửa/Xóa/Xem giỏ hàng (gắn với user_id) |
| S3.2 | API Order: Tạo đơn hàng thường từ giỏ hàng, trừ tồn kho, áp voucher, trừ Otaku Points |
| S3.3 | API Order: Cập nhật trạng thái đơn (Admin/Staff), lưu lịch sử status |
| S3.4 | API Order: Xem danh sách đơn hàng (User), Chi tiết đơn |
| S3.5 | API Order: Hủy đơn (chỉ khi chưa shipping), hoàn lại tồn kho + points |
| S3.6 | API Pre-order: Tạo đợt Pre-order (Admin), Đặt cọc (User), Thanh toán phần còn lại |
| S3.7 | Tích hợp VNPay Sandbox: Tạo URL thanh toán → Xử lý IPN callback → Cập nhật payment_status |
| S3.8 | Tích hợp MoMo Sandbox: Tương tự VNPay |
| S3.9 | API Otaku Points: Tích điểm khi hoàn thành đơn, tiêu điểm khi checkout |
| S3.10 | Gửi email xác nhận đơn hàng (Nodemailer) |
| S3.11 | Viết Unit Test cho Order + Payment API |

**✅ Milestone:** Luồng mua hàng + thanh toán end-to-end hoạt động (cả thường và pre-order).

---

#### 🟦 SPRINT 4 — Frontend: Trang Client chính (Tuần 7–8)

| Task | Chi tiết |
|------|----------|
| S4.1 | Setup Design System: CSS variables, typography, color tokens theo Section 5 |
| S4.2 | Components dùng chung: Button, Input, Select, Modal, Toast, Badge, Skeleton Loading |
| S4.3 | Layout: Header (logo, search bar, nav, cart icon, user menu), Footer, Breadcrumb |
| S4.4 | **Trang chủ:** Hero banner slider, Featured products, Products by category, Pre-order section, Newsletter |
| S4.5 | **Trang Catalog:** Product grid/list view, Sidebar filter (category, series, character, manufacturer, price, condition), Pagination, Sort |
| S4.6 | **Trang Chi tiết sản phẩm:** Image gallery (zoom on hover), Thông tin chi tiết, Add to cart, Pre-order button, Reviews section, Related products carousel |
| S4.7 | **Trang Series:** Banner series, Danh sách sản phẩm thuộc series |
| S4.8 | Responsive design: Mobile-first approach (Breakpoints: 640px, 768px, 1024px, 1280px) |
| S4.9 | Micro-animations: Hover effects, skeleton loading, page transitions, add-to-cart animation |
| S4.10 | SEO: Meta tags, Open Graph, JSON-LD structured data cho sản phẩm |

**✅ Milestone:** Giao diện client trông chuyên nghiệp, đậm phong cách Nhật Bản, responsive hoàn hảo.

---

#### 🟦 SPRINT 5 — Frontend: Giỏ hàng, Checkout, Tài khoản (Tuần 9–10)

| Task | Chi tiết |
|------|----------|
| S5.1 | **Giỏ hàng:** Cart drawer/page, Sửa số lượng, Xóa item, Áp voucher, Tính subtotal |
| S5.2 | **Checkout:** Multi-step form (Địa chỉ → Thanh toán → Xác nhận), Chọn phương thức thanh toán, Redirect VNPay/MoMo |
| S5.3 | **Trang Pre-order:** Danh sách sản phẩm pre-order, Luồng đặt cọc, Trang thanh toán phần còn lại |
| S5.4 | **Trang kết quả thanh toán:** Success / Failed page (sau khi VNPay/MoMo callback) |
| S5.5 | **Tài khoản — Profile:** Cập nhật thông tin cá nhân, Avatar, Đổi mật khẩu |
| S5.6 | **Tài khoản — Đơn hàng:** Danh sách đơn, Chi tiết đơn, Timeline trạng thái, Hủy đơn |
| S5.7 | **Tài khoản — Wishlist:** Danh sách yêu thích, Remove, Add to cart nhanh |
| S5.8 | **Tài khoản — Otaku Points:** Số dư điểm, Lịch sử tích/tiêu, Voucher khả dụng |
| S5.9 | **Tài khoản — Sổ địa chỉ:** CRUD địa chỉ, Đặt mặc định |
| S5.10 | **Review:** Form đánh giá (rating stars + text + upload ảnh), Chỉ hiện nút sau khi mua |

**✅ Milestone:** Toàn bộ luồng mua hàng client hoạt động end-to-end, trải nghiệm mượt mà.

---

#### 🟦 SPRINT 6 — Admin Dashboard (Tuần 11–12)

| Task | Chi tiết |
|------|----------|
| S6.1 | Admin Layout: Sidebar navigation, Top bar, Responsive |
| S6.2 | **Dashboard:** Card thống kê (Doanh thu hôm nay, Đơn mới, Sản phẩm sắp hết, User mới), Biểu đồ doanh thu theo tháng (Recharts/Chart.js), Top 5 sản phẩm bán chạy |
| S6.3 | **CRUD Sản phẩm:** Bảng danh sách (DataTable với search, filter, pagination), Form tạo/sửa (Multi-image upload, Select series/character/manufacturer) |
| S6.4 | **CRUD Danh mục / Series / Nhân vật / Hãng SX:** Tương tự S6.3 |
| S6.5 | **Quản lý Đơn hàng:** Bảng đơn hàng, Lọc theo trạng thái, Chi tiết đơn, Cập nhật trạng thái (dropdown), Xem lịch sử |
| S6.6 | **Quản lý Pre-order:** Tạo đợt pre-order, Xem danh sách cọc, Đánh dấu hàng đã về, Gửi thông báo |
| S6.7 | **Quản lý Users:** Danh sách, Tìm kiếm, Khóa/Mở, Xem lịch sử mua |
| S6.8 | **Quản lý Voucher:** CRUD voucher |
| S6.9 | **Báo cáo:** Doanh thu theo khoảng thời gian, Top series/character, Xuất CSV/PDF |
| S6.10 | **Quản lý Reviews:** Duyệt/Ẩn đánh giá |

**✅ Milestone:** Admin panel đầy đủ chức năng, giao diện chuyên nghiệp với biểu đồ đẹp.

---

#### 🟦 SPRINT 7 — Kiểm thử & Tối ưu (Tuần 13)

| Task | Chi tiết |
|------|----------|
| S7.1 | Viết thêm Unit Test cho các module quan trọng (Auth, Product, Order, Payment) — Coverage ≥ 60% |
| S7.2 | Integration Test: Test luồng đặt hàng end-to-end (Supertest) |
| S7.3 | Frontend Testing: Test component chính bằng React Testing Library |
| S7.4 | Load Testing: k6 hoặc Artillery — Test 100 concurrent users, đo response time |
| S7.5 | Lighthouse Audit: Performance ≥ 85, SEO ≥ 90, Accessibility ≥ 80 |
| S7.6 | Fix tất cả bug còn lại, UI polish |
| S7.7 | Deploy lên cloud: Render (FE + BE) + Supabase (DB), tạo 2 Web Service trên Render |
| S7.8 | Cấu hình domain (nếu có), SSL, environment variables |
| S7.9 | Chụp screenshot tất cả các trang → Đưa vào Chương 4 Khóa luận |

**✅ Milestone:** Hệ thống chạy ổn định trên production, có số liệu test để viết vào báo cáo.

---

#### 🟦 SPRINT 8 — Viết Khóa luận & Bảo vệ (Tuần 14–16)

| Task | Chi tiết |
|------|----------|
| S8.1 | Viết Chương 1: Tổng quan đề tài (5–7 trang) |
| S8.2 | Viết Chương 2: Cơ sở lý thuyết & Công nghệ sử dụng (10–15 trang) |
| S8.3 | Viết Chương 3: Phân tích & Thiết kế hệ thống — Use Case, ERD, Sequence Diagram, Class Diagram (15–20 trang) |
| S8.4 | Viết Chương 4: Hiện thực & Triển khai — Screenshot demo, giải thích code quan trọng (15–20 trang) |
| S8.5 | Viết Chương 5: Đánh giá, Hạn chế, Hướng phát triển (5–7 trang) |
| S8.6 | Viết Mở đầu + Kết luận + Tài liệu tham khảo + Phụ lục |
| S8.7 | Format theo mẫu của trường (font, margin, header/footer, mục lục tự động) |
| S8.8 | Làm Slide PowerPoint bảo vệ (15–20 slides) |
| S8.9 | Tập trình bày 2–3 lần, thời lượng 15–20 phút |
| S8.10 | Review lại toàn bộ với GVHD |

**✅ Milestone:** Nộp bản Khóa luận hoàn chỉnh + Bảo vệ thành công.

---

## 7. Cấu trúc Báo cáo Khóa luận (5 chương)

### Dàn ý chi tiết

```
📄 BÁO CÁO KHÓA LUẬN TỐT NGHIỆP
│
├── Trang bìa
├── Lời cảm ơn
├── Mục lục
├── Danh mục bảng biểu
├── Danh mục hình ảnh
├── Danh mục từ viết tắt
│
├── MỞ ĐẦU
│   ├── Lý do chọn đề tài
│   ├── Mục tiêu đề tài
│   ├── Đối tượng & Phạm vi nghiên cứu
│   ├── Phương pháp nghiên cứu
│   └── Bố cục Khóa luận
│
├── CHƯƠNG 1: TỔNG QUAN (5–7 trang)
│   ├── 1.1. Giới thiệu về văn hóa đại chúng Nhật Bản
│   │   ├── Anime, Manga, Light Novel, Visual Novel
│   │   ├── Figure, Nendoroid, Gunpla, Merchandise
│   │   └── Thị trường tại Việt Nam (số liệu, xu hướng)
│   ├── 1.2. Khảo sát các hệ thống hiện có
│   │   ├── AmiAmi (Nhật Bản)
│   │   ├── Tokyo Otaku Mode (Quốc tế)
│   │   ├── Japan Figure (Việt Nam)
│   │   └── Bảng so sánh ưu/nhược điểm
│   ├── 1.3. Xác định bài toán & Yêu cầu hệ thống
│   └── 1.4. Phạm vi chức năng đề xuất
│
├── CHƯƠNG 2: CƠ SỞ LÝ THUYẾT & CÔNG NGHỆ (10–15 trang)
│   ├── 2.1. Kiến trúc Client-Server & RESTful API
│   ├── 2.2. Next.js & React (Server-Side Rendering)
│   ├── 2.3. Node.js & Express.js
│   ├── 2.4. TypeScript
│   ├── 2.5. PostgreSQL & Prisma ORM
│   ├── 2.6. JWT Authentication & OAuth 2.0
│   ├── 2.7. Tích hợp cổng thanh toán (VNPay, MoMo)
│   ├── 2.8. Cloud Deployment (Render, Supabase)
│   └── 2.9. Các công cụ hỗ trợ (Git, Docker, Postman)
│
├── CHƯƠNG 3: PHÂN TÍCH & THIẾT KẾ HỆ THỐNG (15–20 trang)
│   ├── 3.1. Phân tích yêu cầu
│   │   ├── Yêu cầu chức năng (bảng liệt kê)
│   │   └── Yêu cầu phi chức năng (hiệu năng, bảo mật, UX)
│   ├── 3.2. Biểu đồ Use Case
│   │   ├── Use Case tổng quát
│   │   ├── Use Case phân hệ Khách hàng
│   │   └── Use Case phân hệ Quản trị
│   ├── 3.3. Biểu đồ Activity Diagram
│   │   ├── Luồng Đặt hàng thường
│   │   ├── Luồng Pre-order & Đặt cọc
│   │   └── Luồng Thanh toán VNPay
│   ├── 3.4. Biểu đồ Sequence Diagram
│   │   ├── Đăng nhập (JWT + OAuth)
│   │   ├── Đặt hàng & Thanh toán
│   │   └── Pre-order & Deposit
│   ├── 3.5. Thiết kế Cơ sở dữ liệu
│   │   ├── ERD (Entity Relationship Diagram)
│   │   ├── Mô tả chi tiết từng bảng (21 bảng)
│   │   └── Ràng buộc toàn vẹn dữ liệu
│   ├── 3.6. Thiết kế API (REST endpoints)
│   └── 3.7. Thiết kế giao diện (Wireframe)
│
├── CHƯƠNG 4: HIỆN THỰC & TRIỂN KHAI (15–20 trang)
│   ├── 4.1. Cài đặt môi trường phát triển
│   ├── 4.2. Hiện thực Backend
│   │   ├── Cấu trúc project
│   │   ├── Xử lý Authentication
│   │   ├── API CRUD chính (giải thích code quan trọng)
│   │   └── Tích hợp thanh toán (VNPay callback flow)
│   ├── 4.3. Hiện thực Frontend
│   │   ├── Design System & Component Library
│   │   ├── Các trang chính (screenshot + giải thích)
│   │   └── Responsive & SEO
│   ├── 4.4. Demo chức năng (Screenshot từng luồng)
│   │   ├── Đăng ký / Đăng nhập
│   │   ├── Duyệt sản phẩm / Tìm kiếm / Lọc
│   │   ├── Đặt hàng thường
│   │   ├── Pre-order & Đặt cọc
│   │   ├── Thanh toán VNPay
│   │   ├── Quản lý đơn hàng
│   │   └── Admin Dashboard
│   └── 4.5. Triển khai lên cloud
│       ├── Kiến trúc deployment
│       └── Cấu hình CI/CD (nếu có)
│
├── CHƯƠNG 5: ĐÁNH GIÁ & KẾT LUẬN (5–7 trang)
│   ├── 5.1. Kết quả đạt được
│   │   ├── So sánh với yêu cầu ban đầu (bảng checklist ✅/❌)
│   │   └── Kết quả kiểm thử (Unit test, Load test, Lighthouse)
│   ├── 5.2. Ưu điểm của hệ thống
│   ├── 5.3. Hạn chế & Khó khăn gặp phải
│   └── 5.4. Hướng phát triển trong tương lai
│       ├── App mobile (React Native)
│       ├── Chatbot AI tư vấn sản phẩm
│       ├── Hệ thống gợi ý (Recommendation Engine)
│       ├── Tích hợp Live Auction cho hàng giới hạn
│       └── Multi-vendor marketplace
│
├── KẾT LUẬN
├── TÀI LIỆU THAM KHẢO
└── PHỤ LỤC
    ├── Danh sách API endpoints
    ├── Hướng dẫn cài đặt & chạy project
    └── Source code quan trọng
```

---

## 8. Checklist bảo vệ & Câu hỏi phản biện

### 8.1. Checklist trước ngày bảo vệ

- [ ] Source code chạy được trên localhost (`npm run dev`)
- [ ] Source code deploy thành công trên Render (có link demo)
- [ ] Database có dữ liệu mẫu phong phú (≥ 50 sản phẩm, ≥ 10 series, ≥ 20 nhân vật)
- [ ] Luồng đặt hàng + thanh toán VNPay hoạt động
- [ ] Luồng Pre-order + đặt cọc hoạt động
- [ ] Admin dashboard có biểu đồ thống kê
- [ ] Responsive trên mobile/tablet
- [ ] Có ≥ 1 loại test (Unit test hoặc Integration test)
- [ ] Báo cáo Khóa luận ≥ 60 trang (không tính phụ lục)
- [ ] Slide bảo vệ 15–20 slides
- [ ] Video demo quay màn hình 5–10 phút (backup phòng lỗi live demo)

### 8.2. Câu hỏi phản biện thường gặp & Gợi ý trả lời

| # | Câu hỏi | Gợi ý trả lời |
|---|---------|----------------|
| 1 | **Website này khác gì Shopee/Tiki?** | Fandom Navigation (duyệt theo Series/Nhân vật), Pre-order & Deposit flow, Condition Grading cho hàng sưu tầm, Otaku Points — đây là nghiệp vụ đặc thù mà marketplace tổng hợp không có. |
| 2 | **Tại sao chọn Next.js mà không dùng React thuần?** | SSR/SSG giúp SEO tốt hơn cho e-commerce (Google crawl được nội dung), Image Optimization built-in, API Routes tiện lợi, App Router với React Server Components giảm bundle size. |
| 3 | **Tại sao dùng PostgreSQL mà không dùng MySQL?** | PostgreSQL hỗ trợ JSON/JSONB native (lưu raw_response từ payment gateway), Full-text search tốt hơn, Array type, và miễn phí trên Supabase/Neon. |
| 4 | **JWT có nhược điểm gì? Làm sao khắc phục?** | JWT không thể revoke → Giải pháp: Dùng Access Token ngắn hạn (15 phút) + Refresh Token dài hạn (7 ngày) lưu trong DB, khi logout thì xóa Refresh Token. |
| 5 | **Xử lý race condition khi 2 người cùng mua sản phẩm chỉ còn 1?** | Dùng transaction + `SELECT ... FOR UPDATE` trong PostgreSQL để lock row khi trừ tồn kho, đảm bảo chỉ 1 người mua thành công. |
| 6 | **VNPay callback bị mất thì sao?** | Hệ thống có API query trạng thái thanh toán (VNPay QueryDR), chạy cron job kiểm tra các đơn PENDING sau 15 phút → Tự động query lại VNPay. |
| 7 | **Pre-order: Nếu khách đặt cọc rồi không thanh toán phần còn lại?** | Gửi reminder email/notification. Sau 7 ngày không thanh toán → Tự động hủy đơn, hoàn lại hàng vào kho. Tiền cọc có thể giữ lại theo chính sách (ghi rõ khi đặt). |
| 8 | **Bảo mật hệ thống như thế nào?** | Bcrypt hash password (salt 12 rounds), Helmet.js (HTTP headers), Rate limiting (express-rate-limit), Input validation (Zod/Joi), CORS whitelist, SQL injection prevention (Prisma parameterized queries), XSS prevention (Next.js auto-escape). |
| 9 | **Hướng phát triển trong tương lai?** | (1) App mobile React Native, (2) AI Recommendation Engine gợi ý sản phẩm, (3) Live Auction cho hàng limited, (4) Multi-vendor marketplace, (5) Chatbot AI tư vấn. |
| 10 | **Đề tài có tính mới không?** | Tại VN chưa có platform chuyên biệt cho Pop Culture Japan với đầy đủ Pre-order flow + Fandom navigation. Các shop hiện tại chủ yếu bán trên Facebook/Shopee, chưa có hệ thống riêng. |

---

## 9. Rủi ro & Phương án dự phòng

| # | Rủi ro | Xác suất | Tác động | Phương án dự phòng |
|---|--------|----------|----------|---------------------|
| 1 | **Không kịp deadline** | Trung bình | 🔴 Cao | Cắt giảm scope: Bỏ Otaku Points, Release Calendar, Blog. Tập trung vào core (Catalog + Order + Pre-order + Payment + Admin). |
| 2 | **VNPay/MoMo sandbox lỗi** | Thấp | 🟡 TB | Có sẵn phương thức COD + Bank Transfer. Demo thanh toán bằng COD nếu cổng lỗi. |
| 3 | **Deploy cloud lỗi** | Thấp | 🟡 TB | Chuẩn bị video demo quay sẵn trên localhost làm backup. |
| 4 | **Thiếu dữ liệu mẫu** | Thấp | 🟡 TB | Viết seed script crawl từ AmiAmi/MyFigureCollection để lấy tên + ảnh sản phẩm thật. |
| 5 | **GVHD yêu cầu thay đổi scope** | Trung bình | 🟡 TB | Thiết kế module hóa, dễ thêm/bớt tính năng mà không ảnh hưởng kiến trúc. |

---

> [!IMPORTANT]
> ## Bước tiếp theo
> Sau khi bạn duyệt Plan này, mình sẽ bắt đầu:
> 1. **Khởi tạo project** (Next.js + Express.js + Prisma + PostgreSQL)
> 2. **Tạo Prisma Schema** cho 21 bảng database
> 3. **Viết Seed data** mẫu (sản phẩm Anime/Figure thật)
> 4. **Bắt đầu Sprint 1:** Authentication system
>
> Hãy nhấn **Proceed** nếu bạn đồng ý với plan này, hoặc cho mình biết phần nào cần điều chỉnh!
