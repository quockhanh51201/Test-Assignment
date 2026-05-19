# SaaS Credits & Features Management System

Dự án Web Application quản lý số dư Credits và phân quyền mở khóa tính năng (Features) của người dùng SaaS, tích hợp hệ thống kiểm tra quyền hạn và lịch sử giao dịch.

## Công nghệ sử dụng

- **Backend:** NestJS, TypeORM, PostgreSQL, class-validator, Passport JWT
- **Frontend:** React, Vite, Tailwind CSS, Axios, React Router
- **Môi trường:** Docker, Docker Compose

---

## Cấu trúc Database

Hệ thống bao gồm các bảng cơ sở dữ liệu chính:

- `users`: Lưu trữ thông tin tài khoản người dùng bao gồm username, email, mật khẩu đã mã hóa và vai trò (user/admin).
- `features`: Danh mục các tính năng hệ thống (ví dụ: AI Image Generator, Auto Social Post, Premium Templates).
- `packages`: Các gói tín dụng (Basic, Pro) chứa giá tiền, số credits tương ứng và danh sách tính năng đi kèm.
- `package_features`: Bảng trung gian quản lý liên kết tính năng đi kèm của từng gói credits.
- `user_credits`: Lưu trữ số dư credits hiện tại của mỗi người dùng.
- `user_features`: Danh sách các tính năng người dùng đã mở khóa sau khi mua gói.
- `transactions`: Nhật ký giao dịch mua gói credits của người dùng (số tiền, trạng thái thành công/thất bại).

---

## Hướng dẫn chạy dự án từng bước

### Bước 1: Khởi động dự án với Docker Compose

Mở Terminal tại thư mục chứa dự án và chạy lệnh sau để khởi chạy tự động cơ sở dữ liệu Postgres, NestJS Backend và React Frontend:

```bash
docker-compose up -d
```

*(Lưu ý: Hệ thống đã được tích hợp cơ chế tự động chạy Database Migrations và tự động nạp (seed) dữ liệu mẫu cho các gói credits và tính năng ngay khi khởi động).*

### Bước 2: Tạo tài khoản và Đăng nhập

Sau khi các dịch vụ đã khởi động, bạn có thể thực hiện đăng ký và trải nghiệm hệ thống theo các cách sau:

1. Truy cập tài liệu API tự động tại địa chỉ: http://localhost:3000/api-docs#/Auth/AuthController_register
2. Click vào nút "Try it out" để thử nghiệm API
3. Click vào nút "Execute" để chạy API
4. Click vào nút "Response body" để xem kết quả
6. Truy cập http://localhost:5173/login để đăng nhập
