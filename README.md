# Budgetly - Smart Personal Financial Management Platform

> **Đồ án Môn học:** Phát triển Sản phẩm AI / Công nghệ Phần mềm  
> **Tên dự án:** Budgetly - Nền tảng Quản lý Tài chính Cá nhân Thông minh  
> **Thành viên thực hiện:**
> - Nguyễn Tùng Lâm (MSSV: 23IT138)
> - Lê Hữu Anh Tú (MSSV: 23IT294)

---

## 🌟 1. Giới thiệu Tổng quan (Overview)

**Budgetly** là ứng dụng quản lý tài chính cá nhân thông minh giúp người dùng (đặc biệt là sinh viên và người đi làm trẻ) chủ động kiểm soát chi tiêu mà không gặp rào cản từ việc nhập liệu thủ công phức tạp.

Bằng việc tích hợp các công nghệ **Trí tuệ Nhân tạo (AI)** như **Nhận diện Giọng nói / Văn bản Tự nhiên (NLP)**, **Quét Hóa đơn Tự động (OCR)** và **Dự báo Chi tiêu (Predictive Analytics)**, Budgetly biến quy trình theo dõi tài chính trở nên nhanh chóng, chính xác và tự động.

---

## 🚀 2. Tính năng Cốt lõi (Key Features)

### 🔹 Tính năng Quản lý Tài chính (Non-AI)
- **Quản lý Tài khoản & Ví:** Hỗ trợ nhiều loại ví (Tiền mặt, Tài khoản ngân hàng, Thẻ tín dụng).
- **Quản lý Giao dịch:** Thêm, sửa, xóa, gắn nhãn danh mục thu/chi.
- **Hạn mức Ngân sách:** Thiết lập hạn mức chi tiêu theo tháng cho từng danh mục.
- **Báo cáo & Thống kê:** Biểu đồ trực quan hóa doanh thu, chi tiêu, xu hướng tài chính.

### 🤖 Tính năng Trí tuệ Nhân tạo (AI Features - Core Highlight)
1. **Smart Text Input (NLP):** Phân tích câu thoại/văn bản tự nhiên (ví dụ: *"Vừa trả 50k tiền ăn trưa"*) để tự động trích xuất số tiền, ngày giờ và tự động phân loại danh mục (*Ăn uống*).
2. **Receipt Scanner (OCR):** Tải lên ảnh hóa đơn/biên lai, hệ thống tự động trích xuất Tên cửa hàng, Tổng tiền, Ngày giao dịch và điền biểu mẫu tự động.
3. **AI Spending Forecast & Alerts:** Phân tích chuỗi thời gian chi tiêu quá khứ để dự báo tổng chi tiêu cuối tháng và đưa ra cảnh báo sớm trước khi người dùng bị quá hạn mức ngân sách.

---

## 🛠️ 3. Kiến trúc & Công nghệ (Tech Stack)

| Phân hệ | Công nghệ sử dụng | Vai trò |
| :--- | :--- | :--- |
| **Frontend** | Next.js 14, TypeScript, Tailwind CSS, React Query | Giao diện người dùng web tương tác cao, responsive |
| **Core Backend** | Python, FastAPI, SQLAlchemy, Pydantic | Xử lý logic nghiệp vụ, quản lý dữ liệu CRUD, xác thực JWT |
| **AI Engine** | FastAPI, LangChain, Tesseract OCR / Vision API, scikit-learn | Vi dịch vụ độc lập chuyên trách các tác vụ AI/ML |
| **Database** | PostgreSQL, Alembic | Cơ sở dữ liệu quan hệ, quản lý migration schema |
| **DevOps** | Docker, Docker Compose | Đóng gói container và điều phối hạ tầng |

---

## 📁 4. Cấu trúc Tài liệu Dự án (Documentation Structure)

Hệ thống tài liệu hoàn chỉnh của đồ án được tổ chức tại thư mục [`docs/`](./docs/):

```
docs/
├── requirements/                      # Yêu cầu Phần mềm
│   ├── PRD.md                         # Tài liệu Đặc tả Yêu cầu Sản phẩm (PRD / SRS)
│   └── USER_STORIES.md                # Danh sách User Stories & Acceptance Criteria (AC)
├── architecture/                      # Thiết kế & Kiến trúc
│   ├── SYSTEM_ARCHITECTURE.md         # Kiến trúc Hệ thống & Sơ đồ Tổng quan
│   ├── DATABASE_SCHEMA.md             # Thiết kế Cơ sở Dữ liệu & ERD Diagram
│   ├── USER_FLOW.md                   # Sơ đồ Luồng Người dùng (User Flow)
│   ├── API_SPECIFICATION.md           # Đặc tả RESTful API Chi tiết
│   └── SEQUENCE_DIAGRAMS.md           # Sơ đồ Tuần tự cho các Luồng Cốt lõi
├── ai/                                # Tài liệu Thành phần AI
│   └── AI_SPECIFICATIONS.md           # Mạch Xử lý NLP, OCR, Model Dự báo & Metrics
├── testing/                           # Kế hoạch Kiểm thử
│   └── TEST_PLAN.md                   # Unit Test, API Integration Test & UAT Test Cases
├── deployment/                        # Triển khai & Cài đặt
│   └── DEPLOYMENT_GUIDE.md            # Hướng dẫn Môi trường, Biến Môi trường & Docker
└── user_guide/                        # Hướng dẫn Sử dụng
    └── USER_GUIDE.md                  # Hướng dẫn Thao tác cho Người dùng & Đánh giá
```

---

## ⚙️ 5. Hướng dẫn Khởi chạy Nhanh (Quick Start)

### Cấu hình Yêu cầu
- Node.js >= 18.x
- Python >= 3.11
- Docker & Docker Compose (Khuyên dùng)
- PostgreSQL >= 15

### Khởi chạy bằng Docker Compose (Cách nhanh nhất)
```bash
# 1. Clone repository
git clone https://github.com/your-repo/budgetly.git
cd budgetly

# 2. Tạo file cấu hình môi trường (.env)
cp .env.example .env

# 3. Khởi chạy toàn bộ hệ thống (Database, Core Backend, AI Engine, Client)
docker compose up --build -d

# 4. Truy cập ứng dụng:
# Frontend Web App: http://localhost:3000
# Core Backend Swagger Docs: http://localhost:8000/docs
# AI Engine Swagger Docs: http://localhost:8001/docs
```

Để xem chi tiết cài đặt thủ công (Local Development), vui lòng đọc bài [Hướng dẫn Triển khai](./docs/deployment/DEPLOYMENT_GUIDE.md).

---

## 📄 6. Giấy phép & Bản quyền (License)
Dự án được phát triển phục vụ mục đích nghiên cứu và hoàn thành đồ án môn học.
