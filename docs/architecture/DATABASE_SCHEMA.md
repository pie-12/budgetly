# Database Schema (Sơ bộ)

Đây là bản thiết kế Cơ sở dữ liệu cốt lõi cho Budgetly.

## 1. Table: Users
- `id` (PK, UUID)
- `email` (Varchar, Unique)
- `password_hash` (Varchar)
- `created_at` (Timestamp)

## 2. Table: Wallets
- `id` (PK, UUID)
- `user_id` (FK -> Users.id)
- `name` (Varchar) - Ví dụ: Tiền mặt, Thẻ tín dụng
- `balance` (Decimal)

## 3. Table: Categories
- `id` (PK, UUID)
- `user_id` (FK -> Users.id, Nullable) - Nếu null thì là category mặc định của hệ thống
- `name` (Varchar) - Ví dụ: Ăn uống, Đi lại
- `type` (Enum: INCOME, EXPENSE)

## 4. Table: Transactions
- `id` (PK, UUID)
- `wallet_id` (FK -> Wallets.id)
- `category_id` (FK -> Categories.id)
- `amount` (Decimal)
- `transaction_date` (Date)
- `description` (Text)
- `ai_confidence_score` (Float, Nullable) - Độ tự tin của AI khi tự động phân loại

## 5. Table: Budgets
- `id` (PK, UUID)
- `user_id` (FK -> Users.id)
- `category_id` (FK -> Categories.id)
- `amount_limit` (Decimal)
- `month_year` (String, format YYYY-MM)
