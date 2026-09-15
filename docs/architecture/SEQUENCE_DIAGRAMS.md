# Sequence Diagrams Specification - Budgetly

Tài liệu thiết kế các Sơ đồ Tuần tự (Sequence Diagrams) mô tả chi tiết tương tác theo thời gian giữa các thành phần trong hệ thống **Budgetly** cho các kịch bản cốt lõi.

---

## 1. Kịch bản 1: Đăng nhập & Xác thực JWT (Authentication Flow)

Sơ đồ mô tả quy trình người dùng gửi thông tin đăng nhập, Core Backend kiểm tra mật khẩu đã băm và phát hành JWT Token.

```mermaid
sequenceDiagram
    autonumber
    actor User as Người dùng
    participant Client as Client (Next.js)
    participant Server as Core Server (FastAPI)
    participant DB as PostgreSQL DB

    User->>Client: 1. Nhập Email & Mật khẩu -> Bấm "Đăng nhập"
    Client->>Server: 2. POST /api/v1/auth/login {email, password}
    Server->>DB: 3. SELECT * FROM users WHERE email = :email
    DB-->>Server: 4. Trả về thông tin user & password_hash
    
    alt Sai Mật khẩu hoặc Không tìm thấy User
        Server-->>Client: 5a. HTTP 401 Unauthorized {message: "Sai email hoặc mật khẩu"}
        Client-->>User: 6a. Hiển thị thông báo lỗi trên UI
    else Đăng nhập Thành công
        Server->>Server: 5b. Verify bcrypt hash & Tạo JWT Token (expiry 24h)
        Server-->>Client: 6b. HTTP 200 OK {access_token, user_info}
        Client->>Client: 7. Lưu access_token vào localStorage / Cookies
        Client-->>User: 8. Chuyển hướng đến màn hình Dashboard
    end
```

---

## 2. Kịch bản 2: Nhập Giao dịch Tự động qua NLP Smart Input (NLP Flow)

Sơ đồ mô tả quy trình người dùng gõ văn bản tự nhiên, AI Engine phân tích ngữ nghĩa và trích xuất dữ liệu giao dịch cấu trúc.

```mermaid
sequenceDiagram
    autonumber
    actor User as Người dùng
    participant Client as Client (Next.js)
    participant AI as AI Engine (FastAPI :8001)
    participant LLM as External LLM / LangChain
    participant Core as Core Backend (:8000)
    participant DB as PostgreSQL DB

    User->>Client: 1. Gõ chuỗi: "Đổ xăng 50k xe máy" -> Bấm Enter
    Client->>AI: 2. POST /api/v1/ai/categorize {description}
    AI->>LLM: 3. Gửi Prompt trích xuất Entity & Categorize
    LLM-->>AI: 4. Trả về JSON: {amount: 50000, category: "Di chuyển", confidence: 0.92}
    
    AI-->>Client: 5. HTTP 200 OK Parsed Result Data
    
    alt Confidence Score >= 75%
        Client->>Client: 6a. Tự động điền dữ liệu vào state
        Client->>Core: 7a. POST /api/v1/transactions (Tự động lưu)
        Core->>DB: 8a. INSERT INTO transactions & UPDATE wallet balance
        DB-->>Core: 9a. Success
        Core-->>Client: 10a. HTTP 201 Created
        Client-->>User: 11a. Hiển thị Toast thành công + Nút Hoàn tác
    else Confidence Score < 75%
        Client-->>User: 6b. Mở Popup hiển thị dữ liệu gợi ý để User xác nhận
        User->>Client: 7b. Điều chỉnh ô mờ & Bấm "Xác nhận Lưu"
        Client->>Core: 8b. POST /api/v1/transactions
        Core->>DB: 9b. INSERT transaction & UPDATE wallet balance
        DB-->>Core: 10b. Success
        Core-->>Client: 11b. HTTP 201 Created
        Client-->>User: 12b. Hiển thị Toast thành công
    end
```

---

## 3. Kịch bản 3: Quét Hóa đơn qua OCR (OCR Receipt Scan Flow)

Sơ đồ mô tả luồng tải ảnh bill, OCR trích xuất chuỗi thô và LLM chuyển hóa dữ liệu thành giao dịch tài chính.

```mermaid
sequenceDiagram
    autonumber
    actor User as Người dùng
    participant Client as Client (Next.js)
    participant AI as AI Engine (FastAPI :8001)
    participant OCR as Tesseract OCR Engine
    participant LLM as External LLM
    participant Core as Core Backend (:8000)
    participant DB as PostgreSQL DB

    User->>Client: 1. Chọn ảnh hóa đơn -> Bấm "Quét Hóa Đơn"
    Client->>AI: 2. POST /api/v1/ai/scan-receipt (multipart/form-data)
    AI->>OCR: 3. Tiền xử lý ảnh & Bóc tách văn bản thô (Raw OCR Text)
    OCR-->>AI: 4. Trả về chuỗi Text thô từ ảnh
    
    AI->>LLM: 5. Gửi Raw Text qua LLM đính kèm JSON Schema
    LLM-->>AI: 6. Trả về JSON: {merchant: "WinMart", total: 185000, date: "2026-09-15", category: "Mua sắm"}
    
    AI-->>Client: 7. HTTP 200 OK Structured Data
    Client-->>User: 8. Hiển thị ảnh bill song song cùng Form Giao dịch được điền sẵn
    
    User->>Client: 9. Kiểm tra & Bấm "Lưu Giao dịch"
    Client->>Core: 10. POST /api/v1/transactions
    Core->>DB: 11. INSERT transaction & UPDATE wallet balance
    DB-->>Core: 12. Success
    Core-->>Client: 13. HTTP 201 Created
    Client-->>User: 14. Thông báo Lưu thành công & Cập nhật Dashboard
```

---

## 4. Kịch bản 4: Phân tích Dự báo Chi tiêu AI (AI Forecasting & Insight Flow)

Sơ đồ mô tả quy trình AI Engine truy vấn dữ liệu chi tiêu lịch sử để tính toán tốc độ tiêu tiền và đưa ra cảnh báo sớm.

```mermaid
sequenceDiagram
    autonumber
    actor User as Người dùng
    participant Client as Client (Next.js)
    participant AI as AI Engine (FastAPI :8001)
    participant Core as Core Backend (:8000)
    participant DB as PostgreSQL DB

    User->>Client: 1. Mở trang Dashboard
    Client->>AI: 2. GET /api/v1/ai/insights
    AI->>Core: 3. Internal Query: Lấy lịch sử giao dịch 90 ngày & Ngân sách tháng
    Core->>DB: 4. SELECT sum(amount) FROM transactions GROUP BY category, month
    DB-->>Core: 5. Trả về tập dữ liệu chuỗi thời gian
    Core-->>AI: 6. Trả về tập dữ liệu lịch sử
    
    AI->>AI: 7. Tính Z-Score & Dự báo chi tiêu cuối tháng (Projected Month End)
    
    alt Projected Spent > Budget Limit * 0.9
        AI->>Core: 8a. Ghi nhận log cảnh báo vào bảng ai_insights_log
        Core->>DB: 9a. INSERT INTO ai_insights_log
        AI-->>Client: 10a. HTTP 200 {has_overspend_risk: true, insights: [Warning Card Data]}
        Client-->>User: 11a. Render Thẻ Cảnh báo Nổi bật màu tím/đỏ trên Dashboard
    else Chi tiêu trong tầm kiểm soát
        AI-->>Client: 10b. HTTP 200 {has_overspend_risk: false}
        Client-->>User: 11b. Render chỉ số Ngân sách an toàn bình thường
    end
```
