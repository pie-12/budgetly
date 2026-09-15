# Installation & Deployment Guide - Budgetly

Tài liệu Hướng dẫn Triển khai & Cài đặt Chi tiết (Deployment & Installation Guide) cho hệ thống **Budgetly**.

---

## 1. Cấu hình Yêu cầu & Tiền đề (Prerequisites)

Để cài đặt và vận hành hệ thống thành công, máy tính phát triển (Local Machine) hoặc Server triển khai cần chuẩn bị môi trường tối thiểu sau:

- **Hệ điều hành:** Windows 10/11 (WSL2 khuyên dùng), macOS, hoặc Linux (Ubuntu 22.04 LTS).
- **Node.js:** Phiên bản `>= 18.17.0` (Đính kèm npm hoặc pnpm).
- **Python:** Phiên bản `>= 3.11.0` (Cùng công cụ venv / pip).
- **PostgreSQL:** Phiên bản `>= 15.0`.
- **Docker & Docker Compose:** Docker Desktop (Phiên bản mới nhất).
- **Tesseract OCR (Nếu chạy không dùng Docker):** Binary Tesseract-OCR cài đặt trên OS.

---

## 2. Cấu hình Biến Môi trường (Environment Variables)

Hệ thống quản lý biến môi trường thông qua các file `.env`. Cần tạo các file cấu hình tương ứng từ các file mẫu `.env.example`:

### 2.1. File `.env` tại thư mục Gốc (`/`):
```env
# Docker Network & Database Configuration
POSTGRES_USER=budgetly_user
POSTGRES_PASSWORD=budgetly_secure_password_2026
POSTGRES_DB=budgetly_db
POSTGRES_HOST=postgres
POSTGRES_PORT=5432

# Ports
CLIENT_PORT=3000
SERVER_PORT=8000
AI_ENGINE_PORT=8001
```

### 2.2. File `.env` tại Core Backend (`/server/.env`):
```env
DATABASE_URL=postgresql://budgetly_user:budgetly_secure_password_2026@localhost:5432/budgetly_db
SECRET_KEY=super_secret_jwt_key_budgetly_2026_change_in_prod
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
AI_ENGINE_URL=http://localhost:8001
```

### 2.3. File `.env` tại AI Engine (`/ai_engine/.env`):
```env
OPENAI_API_KEY=sk-proj-your-openai-api-key-here
TESSERACT_CMD=/usr/bin/tesseract
CORE_SERVER_URL=http://localhost:8000
```

---

## 3. Khởi chạy bằng Docker Compose (Khuyên dùng)

Đây là phương thức nhanh chóng và đồng bộ nhất để chạy toàn bộ stack ứng dụng bao gồm PostgreSQL, Core Backend, AI Engine và Next.js Client.

### 3.1. Các bước thực hiện:
```bash
# Step 1: Clone kho mã nguồn
git clone https://github.com/your-username/budgetly.git
cd budgetly

# Step 2: Tạo file .env từ mẫu
cp .env.example .env

# Step 3: Khởi chạy các container bằng Docker Compose
docker compose up --build -d

# Step 4: Kiểm tra trạng thái các container đang chạy
docker compose ps
```

### 3.2. Kiểm tra Địa chỉ Truy cập:
- **Frontend Web Application:** [http://localhost:3000](http://localhost:3000)
- **Core Backend API Swagger Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **AI Engine Swagger Docs:** [http://localhost:8001/docs](http://localhost:8001/docs)

---

## 4. Khởi chạy Thủ công (Local Development Setup)

Nếu bạn muốn chạy từng dịch vụ trực tiếp trên máy cục bộ để phục vụ phát triển (Development):

### Bước 4.1: Khởi chạy Cơ sở dữ liệu PostgreSQL
Khởi chạy PostgreSQL local trên cổng 5432 và tạo cơ sở dữ liệu `budgetly_db`.

### Bước 4.2: Khởi chạy Core Backend (FastAPI)
```bash
cd server

# Tạo và kích hoạt môi trường ảo Python
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Cài đặt các thư viện phụ thuộc
pip install -r requirements.txt

# Chạy Database Migrations (Alembic)
alembic upgrade head

# Khởi chạy Uvicorn Server
uvicorn main:app --reload --port 8000
```

### Bước 4.3: Khởi chạy AI Engine (FastAPI)
```bash
cd ai_engine

# Tạo môi trường ảo riêng cho AI Engine
python -m venv venv
source venv/bin/activate # Hoặc venv\Scripts\activate

# Cài đặt phụ thuộc AI
pip install -r requirements.txt

# Khởi chạy AI Uvicorn Server
uvicorn src.main:app --reload --port 8001
```

### Bước 4.4: Khởi chạy Client Frontend (Next.js)
```bash
cd client

# Cài đặt gói Node Modules
npm install

# Khởi chạy dev server
npm run dev
```

---

## 5. Xử lý Lỗi Thường gặp (Troubleshooting)

### 1. Lỗi Không kết nối được Database (`ConnectionRefusedError`)
- **Nguyên nhân:** PostgreSQL chưa chạy hoặc sai thông tin đăng nhập trong `.env`.
- **Khắc phục:** Kiểm tra container PostgreSQL bằng `docker compose logs postgres` hoặc thử kết nối qua psql command line.

### 2. Lỗi Không tìm thấy binary Tesseract OCR (`TesseractNotFoundError`)
- **Nguyên nhân:** Chưa cài đặt Tesseract trên máy Host hoặc chưa cấu hình đường dẫn `TESSERACT_CMD`.
- **Khắc phục:** Trên Windows, tải Tesseract từ UB-Mannheim và đặt `TESSERACT_CMD=C:\Program Files\Tesseract-OCR\tesseract.exe`. Trên Linux: `sudo apt-get install tesseract-ocr tesseract-ocr-vie`.

### 3. Lỗi CORS Origin Request Blocked
- **Nguyên nhân:** Client gọi API trực tiếp từ port 3000 nhưng Backend chưa cho phép Origin.
- **Khắc phục:** Thêm `"http://localhost:3000"` vào danh sách `allow_origins` trong file `server/main.py`.
