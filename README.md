# Japanese Pop Culture E-Commerce Platform (`japanese-pop-culture-ecommerce`)

Đề tài Khóa luận tốt nghiệp: **Thiết kế và xây dựng website kinh doanh sản phẩm văn hóa đại chúng Nhật Bản**

## 🏗️ Kiến trúc & Công nghệ

- **Frontend:** Next.js 14+ (App Router), React, TypeScript, CSS Modules, Axios, Zustand, Recharts
- **Backend:** Node.js, Express.js, TypeScript, RESTful API, JWT, bcryptjs, Prisma ORM
- **Database:** PostgreSQL trên **Supabase Cloud** (Cơ sở dữ liệu đám mây bên ngoài)
- **File Storage:** Supabase Storage (Lưu trữ ảnh trên đám mây)
- **Tích hợp:** VNPay Sandbox (Thanh toán trực tuyến), Google OAuth 2.0
- **Triển khai:** Render (Frontend + Backend), Supabase Cloud

---

## 📁 Cấu trúc thư mục

```text
japanese-pop-culture-ecommerce/
├── client/                     # Ứng dụng Frontend (Next.js 14)
├── server/                     # API Backend (Express.js + TypeScript)
│   ├── prisma/
│   │   ├── schema.prisma       # Toàn bộ 21 bảng CSDL
│   │   └── seed.ts             # Dữ liệu khởi tạo Anime/Figure/Manga
│   ├── src/
│   │   ├── config/             # Cấu hình môi trường, Prisma Client
│   │   ├── controllers/        # Xử lý logic nghiệp vụ
│   │   ├── middlewares/        # Auth, role guard, validate
│   │   ├── routes/             # Định tuyến API
│   │   ├── services/           # Nghiệp vụ core
│   │   ├── utils/              # Helper functions
│   │   ├── app.ts              # Express App setup
│   │   └── server.ts           # Server entry point
│   ├── .env.example            # Mẫu biến môi trường
│   ├── package.json
│   └── tsconfig.json
└── README.md
```
