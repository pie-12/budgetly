# Product Requirements Document (PRD) - Budgetly

## 1. Product Overview
**Product Name:** Budgetly
**Tagline:** Nền tảng quản lý thu chi cá nhân thông minh.
**Target Audience:** Sinh viên, người đi làm trẻ tuổi có nhu cầu kiểm soát tài chính cá nhân nhưng lười nhập liệu thủ công.

## 2. Problem Statement
Việc quản lý tài chính cá nhân thường tốn thời gian và dễ gây nản chí do người dùng phải tự nhập tay từng khoản chi tiêu. Các ứng dụng hiện tại thiếu sự thông minh trong việc phân tích thói quen tiêu dùng và dự báo ngân sách, khiến người dùng thụ động trong việc kiểm soát tài chính.

## 3. Solution
Budgetly giải quyết vấn đề trên bằng cách tích hợp Trí tuệ Nhân tạo (AI) vào quá trình quản lý:
- **Tự động hóa nhập liệu:** Quét hóa đơn (OCR) hoặc nhập bằng văn bản tự nhiên (NLP).
- **Phân loại thông minh:** AI tự động gắn thẻ (tag) danh mục cho giao dịch.
- **Dự báo ngân sách:** Phân tích dữ liệu lịch sử để đưa ra cảnh báo sớm nếu người dùng có nguy cơ tiêu lạm vào ngân sách cuối tháng.

## 4. Key Features (MVP)
### 4.1. Core Features (Non-AI)
- **Quản lý Tài khoản (User Management):** Đăng ký, đăng nhập.
- **Quản lý Giao dịch (Transaction Management):** Thêm, sửa, xóa, xem giao dịch.
- **Quản lý Ngân sách (Budgeting):** Đặt giới hạn chi tiêu cho từng danh mục.
- **Thống kê (Analytics):** Biểu đồ thể hiện trực quan các khoản thu/chi.

### 4.2. AI-Powered Features
- **Smart Text Input (NLP):** Nhận diện số tiền và danh mục từ câu văn (VD: "Mua trà sữa 50k" -> -50,000, Danh mục: Ăn uống).
- **Receipt Scanner (OCR):** Trích xuất thông tin hóa đơn (Ngày, Số tiền, Người bán) từ hình ảnh.
- **Spending Alerts (Predictive Analytics):** Dự báo chi tiêu dựa trên lịch sử để cảnh báo vượt hạn mức.
