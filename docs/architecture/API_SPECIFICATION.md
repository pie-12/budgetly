# REST API Specification - Budgetly

Đặc tả chi tiết các điểm cuối (Endpoints) RESTful API cho hệ thống **Budgetly**.

---

## 1. Quy chuẩn API Chung (Global Conventions)

- **Base URL:** `http://localhost:8000/api/v1` (Core API) | `http://localhost:8001/api/v1` (AI Microservice API)
- **Content-Type:** `application/json` (Ngoại trừ API upload ảnh sử dụng `multipart/form-data`)
- **Xác thực Authentication:** Chuẩn HTTP Bearer Token trong Header:
  ```http
  Authorization: Bearer <your_jwt_token>
  ```

### Struct Cấu trúc Phản hồi Chuẩn (Standard Response Format)
#### Phản hồi Thành công (Success 200/201):
```json
{
  "success": true,
  "data": { ... },
  "message": "Thao tác thành công"
}
```

#### Phản hồi Lỗi (Error 4xx/5xx):
```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Email hoặc mật khẩu không chính xác",
    "details": null
  }
}
```

---

## 2. Phân hệ Xác thực & Người dùng (Authentication)

### 2.1. Đăng ký tài khoản (Register)
- **Endpoint:** `POST /auth/register`
- **Auth required:** Không

#### Request Body:
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "full_name": "Nguyễn Văn A"
}
```

#### Response (201 Created):
```json
{
  "success": true,
  "data": {
    "user_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
    "email": "user@example.com",
    "full_name": "Nguyễn Văn A",
    "created_at": "2026-09-15T10:00:00Z"
  },
  "message": "Tạo tài khoản thành công"
}
```

---

### 2.2. Đăng nhập (Login)
- **Endpoint:** `POST /auth/login`
- **Auth required:** Không

#### Request Body:
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

#### Response (200 OK):
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer",
    "expires_in": 86400,
    "user": {
      "id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
      "email": "user@example.com",
      "full_name": "Nguyễn Văn A"
    }
  }
}
```

---

## 3. Phân hệ Quản lý Ví Tài chính (Wallets)

### 3.1. Lấy danh sách Ví
- **Endpoint:** `GET /wallets`
- **Auth required:** Có (Bearer Token)

#### Response (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": "11111111-1111-1111-1111-111111111111",
      "name": "Ví Tiền mặt",
      "balance": 1500000.00,
      "currency": "VND",
      "updated_at": "2026-09-15T08:30:00Z"
    },
    {
      "id": "22222222-2222-2222-2222-222222222222",
      "name": "Thẻ Vietcombank",
      "balance": 12500000.00,
      "currency": "VND",
      "updated_at": "2026-09-14T19:20:00Z"
    }
  ]
}
```

### 3.2. Tạo Ví mới
- **Endpoint:** `POST /wallets`
- **Auth required:** Có

#### Request Body:
```json
{
  "name": "Ví MoMo",
  "initial_balance": 500000.00,
  "currency": "VND"
}
```

---

## 4. Phân hệ Quản lý Giao dịch (Transactions)

### 4.1. Lấy danh sách Giao dịch (Có lọc & Phân trang)
- **Endpoint:** `GET /transactions`
- **Auth required:** Có
- **Query Parameters:**
  - `wallet_id` (optional): Filter by wallet UUID.
  - `category_id` (optional): Filter by category UUID.
  - `from_date` (optional): YYYY-MM-DD.
  - `to_date` (optional): YYYY-MM-DD.
  - `page` (default: 1): Page number.
  - `limit` (default: 20): Items per page.

#### Response (200 OK):
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
        "wallet_name": "Ví Tiền mặt",
        "category_name": "Ăn uống",
        "amount": 45000.00,
        "transaction_type": "EXPENSE",
        "transaction_date": "2026-09-15T07:30:00Z",
        "description": "Ăn phở bò sáng",
        "input_method": "NLP",
        "ai_confidence_score": 0.95
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total_items": 45,
      "total_pages": 3
    }
  }
}
```

### 4.2. Thêm mới Giao dịch
- **Endpoint:** `POST /transactions`
- **Auth required:** Có

#### Request Body:
```json
{
  "wallet_id": "11111111-1111-1111-1111-111111111111",
  "category_id": "33333333-3333-3333-3333-333333333333",
  "amount": 45000.00,
  "transaction_type": "EXPENSE",
  "transaction_date": "2026-09-15T07:30:00Z",
  "description": "Ăn phở bò sáng",
  "input_method": "NLP",
  "ai_confidence_score": 0.95
}
```

---

## 5. Phân hệ Vi dịch vụ AI (AI Microservice Endpoints)

### 5.1. Phân tích Văn bản Tự nhiên (NLP Smart Categorize)
- **Endpoint:** `POST /ai/categorize` *(AI Engine :8001)*
- **Auth required:** Có

#### Request Body:
```json
{
  "description": "vừa đổ xăng 50k xe máy ngày hôm qua"
}
```

#### Response (200 OK):
```json
{
  "success": true,
  "data": {
    "parsed_amount": 50000.00,
    "suggested_category": "Di chuyển",
    "suggested_category_id": "44444444-4444-4444-4444-444444444444",
    "transaction_type": "EXPENSE",
    "parsed_date": "2026-09-14",
    "cleaned_description": "Đổ xăng xe máy",
    "confidence": 0.92
  }
}
```

---

### 5.2. Quét Hóa đơn OCR (Scan Receipt)
- **Endpoint:** `POST /ai/scan-receipt` *(AI Engine :8001)*
- **Content-Type:** `multipart/form-data`
- **Auth required:** Có

#### Request Form Data:
- `file`: File ảnh hóa đơn (PNG, JPG, max 5MB)

#### Response (200 OK):
```json
{
  "success": true,
  "data": {
    "merchant_name": "Siêu thị WinMart",
    "total_amount": 185000.00,
    "parsed_date": "2026-09-15",
    "suggested_category": "Mua sắm / Nhu yếu phẩm",
    "extracted_text_raw": "WINMART... TONG CONG: 185,000 VND...",
    "confidence": 0.88
  }
}
```

---

### 5.3. Dự báo Chi tiêu & Cảnh báo AI (AI Spending Insights)
- **Endpoint:** `GET /ai/insights` *(AI Engine :8001)*
- **Auth required:** Có

#### Response (200 OK):
```json
{
  "success": true,
  "data": {
    "current_month": "2026-09",
    "total_spent_so_far": 2450000.00,
    "projected_month_end_total": 4900000.00,
    "total_budget_limit": 4500000.00,
    "has_overspend_risk": true,
    "insights": [
      {
        "type": "OVERSPEND_WARNING",
        "severity": "HIGH",
        "category": "Ăn uống",
        "message": "⚠️ Với tốc độ chi tiêu hiện tại (~160k/ngày), bạn dự kiến sẽ tiêu 4,900,000đ cuối tháng này (vượt 400,000đ so với ngân sách 4,500,000đ).",
        "recommendation": "Nên giảm các khoản chi tiêu ăn tiệm vào 2 tuần cuối tháng."
      }
    ]
  }
}
```
