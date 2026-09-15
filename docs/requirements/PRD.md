# Product Requirements Document (PRD) - Budgetly

| Thông tin | Chi tiết |
| :--- | :--- |
| **Tên dự án** | Budgetly - Smart Personal Financial Management Platform |
| **Phiên bản** | 1.0.0 (Academic Course Project) |
| **Ngày lập** | 15/09/2026 |
| **Tác giả** | Nguyễn Tùng Lâm (23IT138), Lê Hữu Anh Tú (23IT294) |
| **Trạng thái** | Hoàn thiện (Approved) |

---

## 1. Tổng quan Sản phẩm (Product Overview)

### 1.1. Tầm nhìn (Vision)
Budgetly là ứng dụng quản lý tài chính cá nhân thế hệ mới, ứng dụng Trí tuệ Nhân tạo (AI) để xóa bỏ rào cản lớn nhất của người dùng trong việc quản lý chi tiêu: **việc nhập liệu thủ công tốn thời gian và dễ chán nản**. 

### 1.2. Tóm tắt Giải pháp
Sản phẩm kết hợp giữa một ứng dụng quản lý tài chính quan hệ chuẩn (CRUD, Ví, Ngân sách, Báo cáo) với các vi dịch vụ AI thông minh:
- **Tự động nhập liệu qua Văn bản/Giọng nói (NLP):** Đọc hiểu ngôn ngữ tự nhiên tiếng Việt để trích xuất số tiền, mục đích và tự động gắn danh mục.
- **Tự động bóc tách Hóa đơn (OCR):** Đọc ảnh hóa đơn bán hàng, trích xuất dữ liệu tổng tiền, ngày mua, tên cửa hàng.
- **Dự báo Chi tiêu & Cảnh báo Thông minh:** Phân tích dữ liệu lịch sử để dự báo tổng chi tiêu cuối tháng và đưa ra cảnh báo sớm giúp ngăn ngừa nguy cơ vượt ngân sách.

---

## 2. Bài toán & Mục tiêu Dự án (Problem Statement & Goals)

### 2.1. Bài toán thực tế
1. **Rào cản nhập liệu (High friction):** Người dùng phải thao tác qua 4-5 bước thủ công (chọn ví, nhập số tiền, chọn ngày, chọn danh mục, gõ mô tả) cho mỗi lần phát sinh chi tiêu.
2. **Thiếu tính dự báo (Passive tracking):** Hầu hết ứng dụng hiện tại chỉ thống kê chi tiêu đã xảy ra mà không cảnh báo trước nguy cơ hết tiền / vượt ngân sách trước khi tháng kết thúc.
3. **Phân loại thiếu chính xác:** Người dùng thường quên hoặc gõ nhầm danh mục chi tiêu khiến báo cáo tài chính không còn tin cậy.

### 2.2. Mục tiêu Sản phẩm & Chỉ số Đo lường (KPIs)
- **Tốc độ nhập liệu:** Giảm thời gian ghi nhận 1 giao dịch từ ~25 giây (thủ công) xuống dưới 3 giây (bằng giọng nói/văn bản NLP hoặc chụp ảnh OCR).
- **Độ chính xác AI (NLP Categorization):** Đạt trên **85%** độ chính xác tự động gắn danh mục đúng cho văn bản tiếng Việt.
- **Độ chính xác OCR:** Trích xuất thành công số tiền và ngày giao dịch với độ chính xác trên **90%** trên tập ảnh hóa đơn rõ nét.
- **Hiệu năng hệ thống:** Thời gian phản hồi API core < 200ms, API xử lý AI < 2.5s.

---

## 3. Đối tượng Sử dụng (Target Audience & Personas)

### Persona 1: Sinh viên / Người trẻ đi làm (Minh - 21 tuổi)
- **Đặc điểm:** Thường xuyên giao dịch qua chuyển khoản/tiền mặt, muốn tiết kiệm tiền nhưng lười mở app nhập thủ công hàng ngày.
- **Nhu cầu:** Nhập tiền tiêu nhanh chóng qua 1 dòng tin nhắn hoặc chụp ảnh bill; muốn biết liệu với tốc độ tiêu hiện tại thì cuối tháng có bị thiếu tiền hay không.

### Persona 2: Người quản lý tài chính gia đình nhỏ (Lan - 28 tuổi)
- **Đặc điểm:** Cần kiểm soát ngân sách chi tiết từng mục (Ăn uống, Mua sắm, Con cái, Tiền nhà).
- **Nhu cầu:** Cài đặt hạn mức ngân sách tháng; nhận cảnh báo tự động khi sắp tiêu vượt mức cho phép.

---

## 4. Yêu cầu Chức năng Chi tiết (Detailed Functional Requirements)

### 4.1. Phân hệ Quản lý Người dùng & Xác thực (Authentication & User Management)
- **FR-01:** Cho phép người dùng đăng ký tài khoản mới bằng Email và Mật khẩu.
- **FR-02:** Cho phép đăng nhập, trả về mã xác thực JWT token mã hóa.
- **FR-03:** Đăng xuất và quản lý thông tin hồ sơ người dùng (User Profile).

### 4.2. Phân hệ Quản lý Ví & Danh mục (Wallets & Categories Management)
- **FR-04 (Ví tài chính):** Cho phép tạo, sửa, xóa nhiều Ví tài chính (Ví dụ: Tiền mặt, ATM Vietcombank, Ví MoMo, Thẻ tín dụng). Cập nhật số dư tự động theo giao dịch.
- **FR-05 (Danh mục chi tiêu):** Hệ thống có sẵn danh mục mặc định (Ăn uống, Di chuyển, Mua sắm, Giải trí, Lương, v.v.) và cho phép người dùng tùy chỉnh danh mục riêng.

### 4.3. Phân hệ Quản lý Giao dịch (Transaction Management)
- **FR-06 (Thao tác Thủ công):** Thêm mới, chỉnh sửa, xóa giao dịch Thu (Income) và Chi (Expense).
- **FR-07 (Lọc & Tìm kiếm):** Tìm kiếm giao dịch theo từ khóa, lọc theo khoảng thời gian (ngày/tần suất/tháng), lọc theo ví hoặc theo danh mục.

### 4.4. Phân hệ AI Thông minh (AI-Powered Module - Core Requirement)
- **FR-08 (NLP Smart Input):**
  - Cung cấp ô nhập liệu văn bản tự nhiên (ví dụ: *"đổ xăng 50k"*, *"mua trà sữa 45.000đ ngày hôm qua"*).
  - AI Engine phân tích và trả về cấu trúc JSON: `{ amount: 50000, category: "Di chuyển", transaction_date: "2026-09-14", description: "đổ xăng", confidence: 0.92 }`.
  - Nếu `confidence < 0.75`, ứng dụng mở hộp thoại hiển thị dữ liệu gợi ý để người dùng xác nhận/điều chỉnh trước khi lưu.
- **FR-09 (OCR Receipt Scanning):**
  - Cho phép người dùng tải lên / chụp ảnh hóa đơn bán hàng (định dạng JPG/PNG).
  - AI Engine xử lý OCR bóc tách văn bản, trích xuất: Tổng tiền, Ngày mua, Tên cửa hàng/Merchant.
  - Tự động điền dữ liệu bóc tách vào biểu mẫu xác nhận giao dịch.
- **FR-10 (AI Predictive Analytics & Alerts):**
  - Định kỳ hoặc khi xem Dashboard, AI Engine phân tích tốc độ chi tiêu 3 tháng gần nhất và tháng hiện tại.
  - Sử dụng thuật toán dự báo (Z-Score / Time Series) để tính tổng chi tiêu dự kiến đến cuối tháng.
  - Phát thông báo cảnh báo trực quan trên Dashboard nếu mức chi tiêu dự kiến vượt quá **90%** hạn mức ngân sách đã cài đặt.

### 4.5. Phân hệ Báo cáo & Thống kê (Analytics & Visualization)
- **FR-11:** Biểu đồ hình tròn (Pie chart) thể hiện tỷ trọng chi tiêu theo từng danh mục.
- **FR-12:** Biểu đồ cột/đường (Bar/Line chart) thể hiện biến động Thu/Chi theo thời gian.
- **FR-13:** Bảng tổng quan chỉ số tài chính (Tổng thu, Tổng chi, Số dư ròng, Ngân sách còn lại).

---

## 5. Yêu cầu Phi Chức năng (Non-Functional Requirements)

### 5.1. Hiệu năng & Ràng buộc Thời gian (Performance)
- Thời gian phản hồi của các API thông thường (CRUD): **< 200ms**.
- Thời gian xử lý NLP văn bản tự nhiên: **< 1.5s**.
- Thời gian xử lý OCR bóc tách hóa đơn: **< 3.0s**.

### 5.2. Bảo mật & Quyền riêng tư (Security)
- Mã hóa mật khẩu bằng thuật toán an toàn (`bcrypt` với salt).
- Xác thực API qua giao thức JWT Bearer Token trong Header.
- Áp dụng nguyên tắc cô lập dữ liệu người dùng (User-level Isolation): Mỗi người dùng chỉ truy cập được ví và giao dịch thuộc sở hữu của chính mình.

### 5.3. Độ tin cậy & Sẵn sàng (Reliability & Fallback)
- Trong trường hợp dịch vụ AI gặp sự cố (timeout / lỗi API LLM), ứng dụng tự động chuyển về biểu mẫu nhập liệu thủ công truyền thống mà không làm gián đoạn trải nghiệm ứng dụng.

### 5.4. Giao diện & Khả năng Dễ sử dụng (Usability & Design)
- Giao diện đáp ứng tốt trên cả máy tính (Desktop) và thiết bị di động (Mobile Web).
- Thiết kế hiện đại, sử dụng Tailwind CSS, hỗ trợ phản hồi trực quan (loading indicator, toast notification).

---

## 6. Ràng buộc & Giả định Kỹ thuật (Constraints & Assumptions)

- **Ngôn ngữ xử lý AI:** Ưu tiên hỗ trợ chuẩn xác ngôn ngữ Tiếng Việt (bao gồm cả các từ viết tắt tài chính phổ biến như *k, đ, ngàn, tr, củ*).
- **Hạ tầng đóng gói:** Hệ thống bắt buộc phải đóng gói được thành các container Docker và khởi chạy đồng bộ thông qua `docker-compose`.
