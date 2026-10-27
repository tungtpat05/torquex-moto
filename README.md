# 🏍️ TorqueX Moto (torquex-moto)

Hệ thống thương mại điện tử chuyên kinh doanh xe mô tô phân khối lớn và phụ kiện cao cấp, được xây dựng theo kiến trúc **Full-Stack Separated** (Spring Boot 3 REST API + React 19 TypeScript Frontend).

---

## 🚀 Công Nghệ Sử Dụng (Tech Stack)

### 🔹 Backend
* **Language & Framework**: Java 21, Spring Boot 3.2.3
* **Database**: Microsoft SQL Server
* **Database Migration**: Flyway
* **Security & Auth**: Spring Security, JWT (JSON Web Token), Google OAuth2 Client
* **Cloud Storage**: Cloudinary Java SDK (Quản lý và tải lên hình ảnh mô tô, biến thể xe)
* **API Documentation**: Springdoc OpenAPI / Swagger UI
* **Build Tool**: Maven

### 🔹 Frontend
* **Core & Framework**: React 19, TypeScript, Vite
* **UI Library**: Material UI (MUI v7), Emotion, React Icons
* **State & Routing**: React Router v7, Axios (kết nối API backend)

---

## ✨ Tính Năng Chính

### 🛍️ Khách hàng (Client Portal)
* **Trang chủ & Showroom**: Khám phá các mẫu mô tô nổi bật, lọc theo thương hiệu (Ducati, Yamaha, Honda, Kawasaki...), dòng xe (Sportbike, Naked, Cruiser...), khoảng giá.
* **Chi tiết xe**: Xem thông số kỹ thuật chi tiết (động cơ, mã lực, mô-men xoắn, dung tích xi-lanh), thư viện hình ảnh, các biến thể màu sắc, đánh giá thực tế từ biker.
* **Giỏ hàng & Đặt mua**: Quản lý giỏ hàng, chọn biến thể xe/phụ kiện, đặt cọc/thanh toán và theo dõi tiến trình đơn hàng.
* **Xác thực người dùng**: Đăng ký, Đăng nhập bảo mật với JWT, hỗ trợ Đăng nhập nhanh 1-chạm qua Google OAuth2.
* **Tài khoản cá nhân**: Quản lý hồ sơ biker, danh sách địa chỉ giao nhận, lịch sử mua hàng và trạng thái vận chuyển.

### 🛡️ Quản trị viên (Admin Portal)
* **Dashboard Thống kê**: Báo cáo tổng quan doanh thu, số lượng đơn xe và người dùng mới.
* **Quản lý sản phẩm**: Thêm mới, chỉnh sửa thông tin xe, thông số kỹ thuật động cơ, tải ảnh trực tiếp lên Cloudinary.
* **Quản lý danh mục & thương hiệu**: Quản trị danh mục xe và các hãng mô tô liên kết.
* **Quản lý đơn hàng & khuyến mãi**: Tiếp nhận xử lý đơn hàng, quản lý mã voucher/coupon giảm giá.

---

## 📁 Cấu Trúc Dự Án (Project Structure)

```text
torquex-moto/
├── backend/                  # Spring Boot REST API
│   ├── src/main/java/        # Mã nguồn Java (Controller, Service, Entity, Security, DTO...)
│   ├── src/main/resources/   # Application config & Flyway migration scripts
│   ├── .env                  # Cấu hình biến môi trường Backend
│   └── pom.xml               # Maven configuration
│
├── frontend/                 # React TypeScript Single Page Application
│   ├── src/                  # Components, Pages, Routes, Services, Assets
│   ├── package.json          # Node dependencies & npm scripts
│   └── vite.config.ts        # Vite configuration & proxy settings (Port 3000 -> 8081)
│
└── README.md                 # Tài liệu hướng dẫn dự án
```

---

## 🛠️ Hướng Dẫn Cài Đặt & Chạy Dự Án

### 📋 Yêu cầu hệ thống
* **Java**: JDK 21+
* **Node.js**: Node.js LTS (v18 trở lên)
* **Database**: Microsoft SQL Server 2019+

---

### 1️⃣ Cấu hình Backend

1. Di chuyển vào thư mục `backend`:
   ```bash
   cd backend
   ```

2. Tạo hoặc cấu hình file `.env` tại thư mục `backend/` với các thông số phù hợp:
   ```env
   SPRING_APPLICATION_NAME=torquex-moto
   SPRING_DATASOURCE_URL=jdbc:sqlserver://localhost:1433;databaseName=TorqueXMotoDB;encrypt=false;trustServerCertificate=true
   SPRING_DATASOURCE_USERNAME=sa
   SPRING_DATASOURCE_PASSWORD=your_password
   SERVER_PORT=8081

   # OAuth2 Google
   OAUTH2_GOOGLE_CLIENT_ID=your_google_client_id
   OAUTH2_GOOGLE_CLIENT_SECRET=your_google_client_secret
   OAUTH2_SUCCESS_REDIRECT_URL=http://localhost:3000

   # JWT
   JWT_SECRET_KEY=your_64_character_hex_secret_key

   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

3. Khởi chạy Backend (Spring Boot sẽ tự động chạy Flyway migration để khởi tạo bảng dữ liệu):
   ```bash
   ./mvnw spring-boot:run
   ```
   Backend sẽ lắng nghe tại: `http://localhost:8081`

---

### 2️⃣ Cấu hình Frontend

1. Di chuyển vào thư mục `frontend`:
   ```bash
   cd frontend
   ```

2. Cài đặt các gói phụ thuộc (dependencies):
   ```bash
   npm install
   ```

3. Chạy ứng dụng Frontend ở chế độ Development:
   ```bash
   npm run dev
   ```
   Frontend sẽ khởi chạy tại: `http://localhost:3000`

---

## 📚 Tài Liệu API (Swagger UI)

Khi Backend đang chạy, truy cập đường dẫn sau để xem toàn bộ tài liệu API RESTful:
👉 **[http://localhost:8081/swagger-ui/index.html](http://localhost:8081/swagger-ui/index.html)**