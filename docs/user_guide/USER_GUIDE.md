# User Guide - Hướng Dẫn Sử Dụng Budgetly

> **Tài liệu Hướng dẫn Sử dụng Chi tiết dành cho Người dùng cuối & Hội đồng Đánh giá Đồ án**  
> **Ứng dụng:** Budgetly - Smart Personal Financial Management Platform  

---

## 1. Hướng dẫn Đăng ký & Đăng nhập (Getting Started)

### Bước 1: Mở ứng dụng
Truy cập đường dẫn ứng dụng tại trình duyệt web: `http://localhost:3000`.

### Bước 2: Đăng ký Tài khoản
1. Tại màn hình Đăng nhập, bấm vào liên kết **"Chưa có tài khoản? Đăng ký ngay"**.
2. Nhập **Họ và tên**, **Email** và **Mật khẩu** (tối thiểu 8 ký tự).
3. Bấm **"Đăng ký"**. Hệ thống sẽ tự động tạo tài khoản và tạo sẵn cho bạn một **"Ví Tiền mặt"** khởi tạo.

### Bước 3: Đăng nhập
1. Nhập Email và Mật khẩu vừa đăng ký.
2. Bấm **"Đăng nhập"** để truy cập vào **Bảng điều khiển (Dashboard)**.

---

## 2. Quản lý Ví Tài chính & Danh mục (Wallets & Categories)

### 2.1. Thêm Ví tài chính mới
1. Trên thanh điều hướng trái, chọn mục **"Ví tài chính"**.
2. Bấm nút **"+ Thêm Ví Mới"**.
3. Nhập **Tên ví** (Ví dụ: *ATM Vietcombank*, *Ví MoMo*), chọn đơn vị tiền tệ và nhập **Số dư ban đầu**.
4. Bấm **"Lưu"**.

### 2.2. Quản lý Danh mục Chi tiêu
1. Vào mục **"Danh mục"**.
2. Xem danh sách danh mục mặc định (*Ăn uống, Di chuyển, Mua sắm, v.v.*).
3. Bạn có thể bấm **"+ Tạo Danh mục Tùy chỉnh"** để tạo thêm các mục phù hợp với cá nhân (Ví dụ: *Tiền nuôi mèo*).

---

## 3. Thao tác Thêm Giao dịch Chi tiêu (Transaction Entry)

Budgetly cung cấp **3 phương thức nhập liệu linh hoạt**:

### 🔹 Cách 1: Nhập liệu Thông minh bằng AI NLP (Khuyên dùng - Nhanh nhất)
1. Tại màn hình Dashboard, tìm ô nhập liệu **"Smart AI Input"** (Có biểu tượng ngôi sao AI 🪄).
2. Gõ một câu mô tả tự nhiên tiếng Việt bằng giọng nói hoặc bàn phím.  
   *Ví dụ mẫu:*
   - `"Vừa đổ xăng 50k"`
   - `"Ăn bún chả trưa 45.000đ"`
   - `"Mua quần áo ở Shopee 250k ngày hôm qua"`
3. Ấn **Enter** hoặc bấm biểu tượng gửi.
4. AI sẽ tự động phân tích và hiển thị thông báo Toast thành công với dữ liệu đã được tự động gắn danh mục chuẩn xác!

### 🔹 Cách 2: Quét Hóa đơn bằng AI OCR (Tải lên ảnh Bill)
1. Bấm nút **"📷 Quét Hóa Đơn"**.
2. Chọn tệp ảnh hóa đơn mua hàng từ máy tính hoặc chụp ảnh từ điện thoại.
3. Chờ AI xử lý trong 1-2 giây.
4. Hệ thống hiển thị Form giao dịch được điền sẵn thông tin (Tên cửa hàng, Số tiền tổng, Ngày mua) bên cạnh ảnh bill gốc để bạn đối soát.
5. Bấm **"Xác nhận & Lưu"**.

### 🔹 Cách 3: Nhập thủ công truyền thống
1. Bấm nút **"+ Thêm Giao dịch Thủ công"**.
2. Nhập Số tiền, chọn Loại (Thu nhập / Chi tiêu), chọn Danh mục, Ví tài chính và Ngày.
3. Bấm **"Lưu"**.

---

## 4. Quản lý Ngân sách & Xem Cảnh báo AI (Budgets & AI Insights)

### 4.1. Đặt Ngân sách Tháng
1. Truy cập mục **"Ngân sách"**.
2. Chọn danh mục cần giới hạn (Ví dụ: *Ăn uống*) và nhập **Số tiền hạn mức tối đa** trong tháng (Ví dụ: *3,000,000đ*).
3. Bấm **"Thiết lập Ngân sách"**.

### 4.2. Theo dõi Cảnh báo Chi tiêu từ AI
- Khi mở Dashboard, hãy chú ý đến thẻ **"AI Financial Insight"**.
- Nếu bạn chi tiêu quá nhanh ở đầu tháng, AI sẽ tự động tính toán và đưa ra cảnh báo màu đỏ:
  > *"⚠️ Cảnh báo: Với tốc độ chi tiêu hiện tại (~150k/ngày), dự kiến cuối tháng bạn sẽ vượt ngân sách Ăn uống 400,000đ. Hãy chú ý tiết kiệm trong 2 tuần tới!"*

---

## 5. Xem Báo cáo & Thống kê Tài chính (Analytics)

1. Mở mục **"Báo cáo & Thống kê"**.
2. Xem **Biểu đồ hình tròn** thể hiện tỷ trọng chi tiêu (Giúp bạn biết tiền của mình đang tiêu tốn nhiều nhất vào đâu).
3. Xem **Biểu đồ thu chi theo thời gian** để đánh giá tổng tiền tích lũy qua các tháng.
