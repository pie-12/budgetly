# Database Schema (Preliminary)

This is the core Database Schema design for Budgetly.

## 1. Table: Users
- `id` (PK, UUID)
- `email` (Varchar, Unique)
- `password_hash` (Varchar)
- `created_at` (Timestamp)

## 2. Table: Wallets
- `id` (PK, UUID)
- `user_id` (FK -> Users.id)
- `name` (Varchar) - e.g., Cash, Credit Card
- `balance` (Decimal)

## 3. Table: Categories
- `id` (PK, UUID)
- `user_id` (FK -> Users.id, Nullable) - If null, it represents a global system default category
- `name` (Varchar) - e.g., Dining, Transportation
- `type` (Enum: INCOME, EXPENSE)

## 4. Table: Transactions
- `id` (PK, UUID)
- `wallet_id` (FK -> Wallets.id)
- `category_id` (FK -> Categories.id)
- `amount` (Decimal)
- `transaction_date` (Date)
- `description` (Text)
- `ai_confidence_score` (Float, Nullable) - The confidence level of the AI when automatically categorizing the transaction

## 5. Table: Budgets
- `id` (PK, UUID)
- `user_id` (FK -> Users.id)
- `category_id` (FK -> Categories.id)
- `amount_limit` (Decimal)
- `month_year` (String, format YYYY-MM)
