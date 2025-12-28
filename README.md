# Hệ thống quản lý sinh viên & giảng viên – Bach Nghe Student Management

Website hỗ trợ đăng nhập đa vai trò (Admin/Giảng viên/Sinh viên), tra cứu điểm, quản lý hồ sơ và thao tác nghiệp vụ đào tạo. Backend sử dụng Node.js + Express, kết nối MySQL qua Knex; frontend là HTML/CSS/JS thuần với Bootstrap, SweetAlert2, Chart.js và SheetJS (XLSX) cho nhập điểm từ Excel.

## Công nghệ chính
- 🚀 **Node.js + Express 5**: RESTful API, CORS, session và phân nhóm router theo chức năng.
- 🗄️ **MySQL + Knex**: Truy vấn, join nhiều bảng để lấy điểm, thống kê, và cập nhật hồ sơ.
- 🔐 **JWT + express-session**: Xác thực đăng nhập, lưu thông tin người dùng và token.
- 🎨 **HTML/CSS/JS + Bootstrap 5**: Giao diện thuần web, dùng SweetAlert2/Toastify cho thông báo.
- 📊 **Chart.js & SheetJS (XLSX)**: Trực quan hóa dashboard và nhập điểm hàng loạt từ file Excel.
- 📁 **SQL schema**: File `database/bach_nghe.sql` kèm mô hình MySQL Workbench `database/so_do.mwb`.

## Chức năng nổi bật
- **Xác thực & định tuyến theo vai trò**: Đăng nhập, lưu token, tự động chuyển đến trang Admin/Student/Teacher.
- **Sinh viên**: Xem toàn bộ điểm hoặc theo học kỳ, xem/cập nhật thông tin cá nhân, tra cứu chứng chỉ đã được cấp.
- **Giảng viên**: Xem các lớp được phân công, danh sách sinh viên theo lớp, nhập/cập nhật điểm (đơn lẻ hoặc từ Excel), xem thống kê tỷ lệ đạt môn, điểm trung bình, tiến độ nhập điểm và lần cập nhật gần nhất.
- **Quản trị viên**: Quản lý tài khoản người dùng, hồ sơ sinh viên/giảng viên, tạo lớp và xếp sinh viên, cấu hình module, cấp chứng chỉ, theo dõi dashboard (số lớp, chứng chỉ theo môn, v.v.).
- **API REST nhóm rõ ràng**: `/api/v1/auth`, `/api/v1/student`, `/api/v1/teacher`, `/api/v1/admin` với phản hồi chuẩn JSend.

## Yêu cầu môi trường
- Node.js >= 18 và npm.
- MySQL 8.x (hoặc tương thích).
- Trình duyệt hiện đại để mở giao diện frontend (có thể dùng VS Code Live Server hoặc bất kỳ static server nào).

## Thiết lập & chạy ứng dụng
```bash
# 1) Backend: cài đặt phụ thuộc
cd backend
npm install

# 2) Khởi tạo cơ sở dữ liệu (sửa thông tin kết nối cho phù hợp)
mysql -u <user> -p -h <host> -P <port> <database> < ../database/bach_nghe.sql

# 3) Tạo file .env (xem mẫu bên dưới) rồi chạy API
npm start

# 4) Frontend: mở các file HTML trong thư mục frontend/ bằng một static server
#    (ví dụ VS Code Live Server). API backend mặc định chạy tại http://localhost:3000.
```

## Cấu hình biến môi trường
Tạo file `backend/.env`:
```bash
# Server
PORT=3000
SESSION_SECRET=your_session_secret
JWT_SECRET=your_jwt_secret

# Database
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASS=your_password
DB_NAME=bach_nghe
```

## Cấu trúc thư mục chính
```
backend/
├─ server.js                 # Điểm vào, khởi động Express
├─ src/
│  ├─ app.js                 # Cấu hình middleware, CORS, session, router
│  ├─ routes/                # auth/student/teacher/admin routers
│  ├─ controllers/           # Xử lý yêu cầu & validate đầu vào
│  ├─ models/                # Knex query đến MySQL
│  ├─ database/knex.js       # Cấu hình kết nối MySQL
│  ├─ middlewares/           # (định nghĩa middleware xác thực, nếu cần)
│  └─ jsend.js, api-error.js # Chuẩn hóa response & lỗi
frontend/
├─ login/                    # Trang đăng nhập
├─ admin/                    # Trang dashboard và các màn CRUD/nhập liệu
├─ teacher/                  # Trang thống kê, danh sách lớp, nhập điểm
├─ student/                  # Trang điểm, thông tin, chứng chỉ
├─ js/                       # Logic gọi API, lưu token, hiển thị biểu đồ
├─ css/ | images/            # Tài nguyên tĩnh
database/
├─ bach_nghe.sql             # Schema & dữ liệu mẫu
└─ so_do.mwb                 # Sơ đồ MySQL Workbench
```

## Quy ước & best practices
- Tách biệt tầng API (Express + Knex) và giao diện (HTML/JS); không truy vấn DB từ frontend.
- Giữ API base URL thống nhất (`http://localhost:3000`) trong các file JS frontend; cập nhật nếu đổi port/host backend.
- Sử dụng phản hồi JSend (`status: success/fail/error`) cho tất cả endpoint; kiểm tra `status` trước khi hiển thị dữ liệu.
- Khi nhập điểm từ Excel (SheetJS), đảm bảo tiêu đề cột khớp (`MÃ HS`, `HỌ ĐỆM`, `TÊN`, `Tổng điểm`) để tránh bị bỏ qua.
- Tránh bọc `import` trong `try/catch`; tuân thủ chuẩn mã hiện có.

## Kiểm thử & chất lượng mã
- Backend chưa có bộ test tự động; dùng `npm start` để chạy thử API và kiểm tra log.
- Frontend kiểm thử thủ công qua trình duyệt; xác thực các luồng chính (đăng nhập, xem điểm, nhập điểm, dashboard).

## Đóng góp
1) Tạo branch feature hoặc fork repo.
2) Thực hiện thay đổi và cập nhật tài liệu/cấu hình liên quan (ví dụ cập nhật hướng dẫn khi thêm biến môi trường).
3) Chạy lại ứng dụng để kiểm tra; mở Pull Request mô tả rõ thay đổi và kèm ảnh chụp UI nếu có chỉnh giao diện.
