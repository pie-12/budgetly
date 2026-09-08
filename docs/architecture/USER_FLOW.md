# Luồng người dùng (User Flow)

Dưới đây là luồng người dùng cốt lõi tập trung vào tính năng AI nhập liệu tự động.

## 1. Luồng nhập giao dịch bằng AI (NLP / OCR)

```mermaid
graph TD
    A[Trang chủ (Dashboard)] --> B{Chọn phương thức nhập liệu}
    B -->|Nhập text tự nhiên| C[Gõ câu mô tả: VD "ăn trưa 50k"]
    B -->|Chụp hóa đơn| D[Upload ảnh hóa đơn]
    
    C --> E[AI NLP Service phân tích]
    D --> F[AI OCR Service bóc tách text]
    
    E --> G{Độ tự tin > 80%?}
    F --> G
    
    G -->|Yes| H[Tự động điền Form (Số tiền, Danh mục, Ngày)]
    G -->|No / Ảnh mờ| I[Hiển thị cảnh báo & Yêu cầu nhập tay]
    
    I --> H
    H --> J[Người dùng xác nhận lưu]
    J --> K[Cập nhật Database]
    K --> A
```
