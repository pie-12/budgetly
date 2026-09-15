# Master Test Plan & Quality Assurance Specification - Budgetly

Tài liệu Kế hoạch Kiểm thử & Đảm bảo Chất lượng Phần mềm (Test Plan & QA Specification) cho đồ án **Budgetly**.

---

## 1. Mục tiêu & Chiến lược Kiểm thử (Testing Strategy)

Chiến lược kiểm thử cho hệ thống Budgetly áp dụng mô hình **Tháp Kiểm thử (Testing Pyramid)** với 4 cấp độ:

```
        / \
       / UAT \          -> User Acceptance Testing (Manual Test Cases)
      /-------\
     / Integration \    -> API Endpoint & DB Integration Testing (Pytest + HTTPX)
    /---------------\
   /   AI Benchmark  \  -> Evaluation Test-set for NLP & OCR Accuracy
  /---------------------\
 /       Unit Test       \ -> Core Logic, Model Validation & Utilities
/-------------------------\
```

---

## 2. Môi trường & Công cụ Kiểm thử (Test Environment & Tools)

| Cấp độ Test | Phân hệ | Công cụ / Library sử dụng |
| :--- | :--- | :--- |
| **Unit Test** | Core Server (`/server`) | `pytest`, `pytest-asyncio`, `SQLAlchemy Test Database (SQLite in-memory)` |
| **Unit Test** | AI Engine (`/ai_engine`) | `pytest`, `unittest.mock` |
| **Frontend Test** | Client (`/client`) | `Jest`, `@testing-library/react` |
| **API Integration** | Core Backend API | `HTTPX AsyncClient`, `Postman / Bruno` |
| **AI Evaluation** | AI Subsystem | Custom Benchmark Script (`evaluate_ai.py`) |
| **UAT (Chấp nhận)** | Toàn hệ thống | Kiểm thử thủ công trên trình duyệt web theo kịch bản UAT |

---

## 3. Ma trận Test Case Tự động API Integration (API Integration Test Matrix)

Các test case tự động được viết trong thư mục `server/tests/` và `ai_engine/tests/`:

| Mã Test Case | Phân hệ | Tên Kịch bản Kiểm thử | Đầu vào (Input) | Kết quả Mong đợi (Expected Output) |
| :--- | :--- | :--- | :--- | :--- |
| **TC-AUTH-01** | Auth | Đăng ký thành công | Email hợp lệ, Mật khẩu >= 8 ký tự | HTTP 201 Created, Trả về User ID & tạo Ví mặc định |
| **TC-AUTH-02** | Auth | Đăng ký trùng Email | Email đã tồn tại trong DB | HTTP 400 Bad Request, Thống báo lỗi *"Email đã được sử dụng"* |
| **TC-AUTH-03** | Auth | Đăng nhập đúng thông tin | Email & Password chính xác | HTTP 200 OK, Trả về JWT Access Token hợp lệ |
| **TC-AUTH-04** | Auth | Đăng nhập sai Mật khẩu | Mật khẩu không chính xác | HTTP 401 Unauthorized |
| **TC-WAL-01** | Wallet | Tạo Ví tài chính mới | Tên: "Ví MoMo", Balance: 500,000đ | HTTP 201 Created, Ví lưu vào DB đúng user_id |
| **TC-TX-01** | Transaction | Thêm Giao dịch Chi tiêu | Wallet ID, Amount: 50k, Category: "Ăn uống" | HTTP 201 Created, Số dư Ví giảm 50,000đ |
| **TC-AI-01** | AI Engine | Phân tích NLP văn bản chuẩn | `"Vừa đổ xăng 50k"` | HTTP 200 OK, `{amount: 50000, category: "Di chuyển", confidence > 0.85}` |
| **TC-AI-02** | AI Engine | Phân tích OCR ảnh hóa đơn | File ảnh `sample_receipt.jpg` | HTTP 200 OK, Trích xuất đúng số tiền tổng |

---

## 4. Bộ Test-set Đánh giá Độ chính xác AI (AI Accuracy Benchmark Test Suite)

Dưới đây là mẫu kịch bản kiểm thử đánh giá độ chính xác của mạch xử lý NLP trên tập dữ liệu tiếng Việt:

```python
# ai_engine/tests/test_nlp_accuracy.py
import pytest
from src.main import categorize_transaction

BENCHMARK_DATA = [
    ("Ăn phở bò sáng 45k", 45000, "Ăn uống"),
    ("Đổ xăng xe máy 50000đ", 50000, "Di chuyển"),
    ("Mua sắm quần áo ở Zara 1.2tr", 1200000, "Mua sắm"),
    ("Tiền điện tháng 9 850k", 850000, "Tiền nhà / Điện nước"),
    ("Nhận lương tháng 9 15 triệu", 15000000, "Thu nhập / Lương"),
]

@pytest.mark.parametrize("input_text, expected_amount, expected_category", BENCHMARK_DATA)
def test_nlp_categorization_accuracy(input_text, expected_amount, expected_category):
    result = categorize_transaction({"description": input_text})
    assert result["amount"] == expected_amount
    assert result["category"] == expected_category
    assert result["confidence"] >= 0.75
```

---

## 5. Ma trận Kiểm thử Nghiệm thu Người dùng (Manual UAT Test Matrix)

Phục vụ việc demo và đánh giá thực tế đồ án môn học trước hội đồng:

### Kịch bản UAT-01: Luồng Đăng ký & Khởi tạo Tài chính
1. **Thao tác:** Người dùng mở Web App -> Bấm "Đăng ký" -> Nhập email `student@example.com` và mật khẩu -> Bấm "Tạo tài khoản".
2. **Kỳ vọng:** Đăng ký thành công, chuyển hướng thẳng vào Dashboard. Trong danh sách Ví hiển thị sẵn *"Ví Tiền mặt"* với số dư 0đ.

### Kịch bản UAT-02: Luồng Nhập liệu Tự động bằng AI NLP
1. **Thao tác:** Tại ô "Smart AI Input" trên Dashboard, gõ *"mua trà sữa 50k ngày hôm qua"*, ấn Enter.
2. **Kỳ vọng:** 
   - Màn hình hiển thị trạng thái xử lý trong ~1 giây.
   - Hiển thị Toast thông báo *"Đã lưu giao dịch: 50,000đ - Danh mục: Ăn uống"*.
   - Kiểm tra số dư ví tự động giảm 50,000đ.
   - Biểu đồ hình tròn chi tiêu cập nhật thêm mảng *"Ăn uống"*.

### Kịch bản UAT-03: Luồng Cảnh báo Vượt Ngân sách
1. **Thao tác:** Người dùng cài đặt Ngân sách Ăn uống = 1,000,000đ/tháng. Nhập chuỗi giao dịch ăn uống với tổng chi hiện tại = 950,000đ khi mới ở tuần thứ 2 của tháng.
2. **Kỳ vọng:** Dashboard xuất hiện Thẻ Cảnh Báo AI Nổi Bật (Màu Đỏ/Tím) kèm nội dung cảnh báo tốc độ chi tiêu quá nhanh có nguy cơ vượt hạn mức.
