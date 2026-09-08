# User Stories & Acceptance Criteria

## Epic 1: Quản lý Giao dịch Thông minh (Smart Transaction Management)

### User Story 1.1: Nhập liệu bằng văn bản tự nhiên (NLP)
**As a** người dùng bận rộn,
**I want** to nhập một câu mô tả chi tiêu (ví dụ: "đổ xăng 50k"),
**So that** hệ thống tự động lưu giao dịch 50,000 VND vào danh mục "Đi lại" mà tôi không cần bấm chọn nhiều bước.

**Acceptance Criteria (Tiêu chí chấp nhận):**
1. Giao diện có một thanh input cho phép nhập text tự do.
2. Khi submit, AI service phải trả về được `amount` (50000) và `category` ("Đi lại").
3. Nếu AI không tự tin (<70%), hiển thị popup yêu cầu người dùng xác nhận lại trước khi lưu.

### User Story 1.2: Quét hóa đơn bằng hình ảnh (OCR)
**As a** người dùng thích giữ hóa đơn,
**I want** to chụp ảnh tờ hóa đơn siêu thị,
**So that** ứng dụng tự động điền số tiền tổng và ngày tháng vào form thêm giao dịch.

**Acceptance Criteria:**
1. Có nút "Chụp/Tải hóa đơn".
2. Hệ thống bóc tách được đúng "Tổng tiền" (Total) trên hóa đơn.
3. Nếu ảnh mờ, hệ thống trả về thông báo lỗi yêu cầu chụp lại.

## Epic 2: Kiểm soát Ngân sách (Budget Control)

### User Story 2.1: Cảnh báo chi tiêu (AI Alert)
**As a** người dùng muốn tiết kiệm,
**I want** to nhận được cảnh báo nếu tốc độ tiêu tiền của tôi trong tuần đầu tiên quá cao,
**So that** tôi có thể điều chỉnh lại hành vi mua sắm cho những tuần tiếp theo.

**Acceptance Criteria:**
1. AI model dựa vào dữ liệu chi tiêu 3 tháng gần nhất để dự báo tháng hiện tại.
2. Nếu số tiền dự báo vượt quá 90% ngân sách đã đặt, hiển thị cảnh báo (UI Warning) trên Dashboard.
