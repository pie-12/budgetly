# User Stories & Acceptance Criteria (AC) - Budgetly

Tài liệu liệt kê danh sách các câu chuyện người dùng (User Stories) cùng tiêu chí nghiệm thu (Acceptance Criteria - AC) chi tiết cho ứng dụng Budgetly, phân chia theo các Epic chính.

---

## 📌 Epic 1: Đăng nhập & Xác thực Nguời dùng (Authentication & User Profile)

### User Story 1.1: Đăng ký tài khoản mới
- **Là** một người dùng mới,
- **Tôi muốn** đăng ký tài khoản ứng dụng bằng Email và Mật khẩu,
- **Để** tạo không gian lưu trữ và bảo mật dữ liệu chi tiêu cá nhân của tôi.

**Acceptance Criteria (AC):**
1. Hệ thống hiển thị form Đăng ký gồm: Email, Mật khẩu, Nhập lại mật khẩu.
2. Kiểm tra tính hợp lệ của Email và mật khẩu (Mật khẩu phải từ 8 ký tự trở lên).
3. Nếu email đã tồn tại trong hệ thống, trả về thông báo lỗi *"Email này đã được sử dụng"*.
4. Sau khi đăng ký thành công, tự động khởi tạo cho người dùng 1 Ví mặc định (*"Ví Tiền mặt"*) và danh sách các Danh mục chi tiêu chuẩn (*Ăn uống, Di chuyển, Mua sắm, v.v.*).

### User Story 1.2: Đăng nhập hệ thống
- **Là** một người dùng đã có tài khoản,
- **Tôi muốn** đăng nhập vào ứng dụng bằng Email và Mật khẩu,
- **Để** truy cập vào Bảng điều khiển (Dashboard) và quản lý tài chính.

**Acceptance Criteria (AC):**
1. Người dùng nhập đúng Email và Mật khẩu -> Hệ thống trả về JWT Token và chuyển hướng đến trang Dashboard.
2. Nhập sai Email hoặc Mật khẩu -> Hiển thị cảnh báo *"Email hoặc mật khẩu không chính xác"*.
3. JWT Token được lưu an toàn tại Client và tự động đính kèm vào HTTP Header `Authorization: Bearer <token>` cho mọi request tiếp theo.

---

## 📌 Epic 2: Quản lý Ví & Danh mục Tài chính (Wallets & Categories)

### User Story 2.1: Tạo và quản lý nhiều Ví tài chính
- **Là** một người dùng có nhiều nguồn tiền,
- **Tôi muốn** tạo các ví tài chính riêng biệt (Tiền mặt, Ngân hàng, Ví điện tử),
- **Để** theo dõi số dư chính xác của từng tài khoản.

**Acceptance Criteria (AC):**
1. Người dùng có thể tạo Ví mới bằng việc nhập Tên ví và Số dư ban đầu.
2. Giao dịch Thu sẽ tự động cộng số dư ví tương ứng; giao dịch Chi sẽ tự động trừ số dư ví.
3. Người dùng có thể chỉnh sửa tên ví hoặc xóa ví (chỉ được xóa khi ví không còn giao dịch liên kết).

### User Story 2.2: Tùy chỉnh Danh mục thu chi
- **Là** một người dùng có nhu cầu quản lý chi tiết,
- **Tôi muốn** thêm hoặc tùy chỉnh các danh mục chi tiêu cá nhân,
- **Để** phân loại các khoản tiền phù hợp với thói quen sinh hoạt của tôi.

**Acceptance Criteria (AC):**
1. Hệ thống cho phép hiển thị danh sách Danh mục Hệ thống (mặc định) và Danh mục Tùy chỉnh (do user tạo).
2. Người dùng có thể tạo thêm Danh mục mới, chỉ định loại danh mục là `INCOME` (Thu nhập) hoặc `EXPENSE` (Chi tiêu).

---

## 📌 Epic 3: Ghi nhận Giao dịch Thủ công (Manual Transaction Management)

### User Story 3.1: Thêm mới giao dịch thủ công
- **Là** một người dùng,
- **Tôi muốn** nhập thủ công thông tin một giao dịch thu hoặc chi,
- **Để** lưu vết khoản tiền vừa phát sinh.

**Acceptance Criteria (AC):**
1. Form thêm giao dịch bao gồm: Số tiền, Loại giao dịch (Thu/Chi), Danh mục, Ví tài chính, Ngày giao dịch, Ghi chú/Mô tả.
2. Khi ấn *"Lưu"*, hệ thống cập nhật giao dịch vào cơ sở dữ liệu và tự động tính toán lại số dư Ví.
3. Nếu không chọn Ngày giao dịch, hệ thống tự động lấy Ngày hiện tại làm mặc định.

### User Story 3.2: Danh sách & Lọc giao dịch
- **Là** một người dùng,
- **Tôi muốn** xem danh sách lịch sử giao dịch và lọc theo ngày/danh mục,
- **Để** kiểm tra các khoản tiền đã tiêu trong tháng.

**Acceptance Criteria (AC):**
1. Giao diện danh sách hiển thị phân trang hoặc cuộn vô tận, sắp xếp theo thời gian mới nhất lên đầu.
2. Bộ lọc cho phép lọc theo khoảng thời gian (Hôm nay, Tuần này, Tháng này, Tùy chỉnh).
3. Cho phép tìm kiếm giao dịch theo từ khóa mô tả.

---

## 📌 Epic 4: Nhập liệu Thông minh bằng AI (AI-Powered Smart Entry)

### User Story 4.1: Nhập liệu câu thoại tự nhiên (NLP Text Input)
- **Là** một người dùng bận rộn,
- **Tôi muốn** gõ một câu văn bản tự nhiên mô tả khoản chi (ví dụ: *"vừa ăn trưa 45k"*),
- **Để** AI tự động phân tích ra Số tiền (45,000đ), Danh mục (*Ăn uống*) mà tôi không cần thao tác qua từng ô chọn.

**Acceptance Criteria (AC):**
1. UI cung cấp 1 ô nhập liệu thông minh "Smart AI Input" tại Dashboard.
2. Người dùng gõ chuỗi văn bản và ấn Enter -> Client gửi request đến API `/api/v1/ai/categorize`.
3. AI Engine trích xuất dữ liệu: `amount`, `category`, `description`, `confidence`.
4. **Nếu Confidence >= 75%:** Hệ thống tự động điền form và lưu giao dịch, hiển thị thông báo toast thành công kèm nút *"Hoàn tác"*.
5. **Nếu Confidence < 75%:** Mở popup xác nhận để người dùng kiểm tra, chỉnh sửa thông tin trước khi nhấn lưu.

### User Story 4.2: Nhận diện hóa đơn qua ảnh chụp (OCR Receipt Scan)
- **Là** một người dùng hay giữ hóa đơn mua hàng,
- **Tôi muốn** chụp ảnh hóa đơn siêu thị/cửa hàng và tải lên ứng dụng,
- **Để** AI tự động đọc bill và bóc tách Số tiền tổng, Ngày mua, Tên cửa hàng.

**Acceptance Criteria (AC):**
1. Giao diện cung cấp nút *"Quét Hóa Đơn"* cho phép tải lên tệp ảnh (PNG, JPG) hoặc chụp trực tiếp từ camera di động.
2. Ảnh được gửi đến API `/api/v1/ai/scan-receipt`. AI Engine thực hiện OCR và bóc tách thông tin cấu trúc JSON.
3. Hiển thị màn hình Xử lý (Loading indicator) không quá 3 giây.
4. Thông tin bóc tách được đổ vào Form Giao dịch để người dùng xem lại ảnh gốc bên cạnh form trước khi xác nhận lưu.
5. Nếu ảnh bị mờ hoặc không đọc được số tiền, hiển thị thông báo lỗi rõ ràng: *"Không thể đọc thông tin hóa đơn. Vui lòng thử lại với ảnh rõ nét hơn"*.

---

## 📌 Epic 5: Hạn mức Ngân sách & Cảnh báo (Budgeting & Alerts)

### User Story 5.1: Cài đặt Hạn mức Ngân sách tháng
- **Là** một người dùng muốn quản lý chi tiêu kỷ luật,
- **Tôi muốn** đặt giới hạn số tiền tối đa được tiêu cho từng danh mục trong tháng (ví dụ: *Ăn uống tối đa 3,000,000đ/tháng*),
- **Để** hệ thống theo dõi mức chi tiêu của tôi.

**Acceptance Criteria (AC):**
1. Người dùng chọn Danh mục, nhập Hạn mức tiền (Amount Limit) và Tháng áp dụng (YYYY-MM).
2. Trang Quản lý Ngân sách hiển thị thanh tiến trình (Progress Bar) thể hiện: `% đã chi tiêu = (Tổng chi tiêu danh mục / Hạn mức) * 100%`.
3. Màu thanh tiến trình thay đổi theo mức độ: Xanh xanh (<70%), Vàng (70-90%), Đỏ (>90% hoặc vượt mức).

---

## 📌 Epic 6: Báo cáo & Dự báo AI (Analytics & AI Insights)

### User Story 6.1: Báo cáo Thống kê Tài chính
- **Là** một người dùng,
- **Tôi muốn** xem biểu đồ tổng hợp thu chi theo tháng,
- **Để** hiểu rõ thói quen tiêu dùng của bản thân.

**Acceptance Criteria (AC):**
1. Hiển thị Biểu đồ tròn phân bổ chi tiêu theo Danh mục.
2. Hiển thị Biểu đồ cột so sánh tổng Thu vs Tổng Chi giữa các tháng.
3. Cho phép xuất báo cáo thống kê dạng bảng tóm tắt.

### User Story 6.2: AI Dự báo Chi tiêu & Cảnh báo Vượt hạn mức (Predictive Insights)
- **Là** một người dùng muốn tránh bị thâm hụt tài chính giữa tháng,
- **Tôi muốn** AI phân tích tốc độ tiêu tiền của tôi và đưa ra cảnh báo sớm,
- **Để** tôi kịp thời điều chỉnh thói quen sinh hoạt trước khi hết tiền.

**Acceptance Criteria (AC):**
1. Hệ thống tự động chạy phân tích dự báo (AI Forecast) dựa trên lịch sử 3 tháng gần nhất và tốc độ chi tiêu của các ngày đã qua trong tháng hiện tại.
2. AI tính toán số tiền chi tiêu dự kiến vào cuối tháng (`projected_month_end_expense`).
3. Nếu `projected_month_end_expense > budget_limit * 0.9`, ứng dụng hiển thị một Thẻ Cảnh Báo Cực Tím (AI Insight Card) trên Dashboard:
   > *"⚠️ Cảnh báo từ AI: Với tốc độ chi tiêu hiện tại (~150k/ngày), dự kiến cuối tháng bạn sẽ chi 4,500,000đ cho danh mục Ăn uống (vượt 15% ngân sách 4,000,000đ)."*
4. Đưa ra gợi ý thông minh từ AI giúp người dùng cắt giảm chi tiêu hợp lý.
