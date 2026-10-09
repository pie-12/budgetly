# REST API Specification - Budgetly

Detailed specification of the RESTful API endpoints for the **Budgetly** system.

---

## 1. Global API Conventions

- **Base URL:** `http://localhost:8000/api/v1` (Core API) | `http://localhost:8001/api/v1` (AI Microservice API)
- **Content-Type:** `application/json` (except the image upload API, which uses `multipart/form-data`)
- **Authentication:** HTTP Bearer Token standard in the Header:
  ```http
  Authorization: Bearer <your_jwt_token>
  ```

### Standard Response Format
#### Success Response (200/201):
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

#### Error Response (4xx/5xx):
```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Incorrect email or password",
    "details": null
  }
}
```

---

## 2. Authentication & User Module

### 2.1. Register an Account
- **Endpoint:** `POST /auth/register`
- **Auth required:** No

#### Request Body:
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "full_name": "John Doe"
}
```

#### Response (201 Created):
```json
{
  "success": true,
  "data": {
    "user_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
    "email": "user@example.com",
    "full_name": "John Doe",
    "created_at": "2026-09-15T10:00:00Z"
  },
  "message": "Account created successfully"
}
```

---

### 2.2. Login
- **Endpoint:** `POST /auth/login`
- **Auth required:** No

#### Request Body:
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

#### Response (200 OK):
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer",
    "expires_in": 86400,
    "user": {
      "id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
      "email": "user@example.com",
      "full_name": "John Doe"
    }
  }
}
```

---

## 3. Wallets Module

### 3.1. List Wallets
- **Endpoint:** `GET /wallets`
- **Auth required:** Yes (Bearer Token)

#### Response (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": "11111111-1111-1111-1111-111111111111",
      "name": "Cash Wallet",
      "balance": 1500000.00,
      "currency": "VND",
      "updated_at": "2026-09-15T08:30:00Z"
    },
    {
      "id": "22222222-2222-2222-2222-222222222222",
      "name": "Vietcombank Card",
      "balance": 12500000.00,
      "currency": "VND",
      "updated_at": "2026-09-14T19:20:00Z"
    }
  ]
}
```

### 3.2. Create a New Wallet
- **Endpoint:** `POST /wallets`
- **Auth required:** Yes

#### Request Body:
```json
{
  "name": "MoMo Wallet",
  "initial_balance": 500000.00,
  "currency": "VND"
}
```

---

## 4. Transactions Module

### 4.1. List Transactions (with Filtering & Pagination)
- **Endpoint:** `GET /transactions`
- **Auth required:** Yes
- **Query Parameters:**
  - `wallet_id` (optional): Filter by wallet UUID.
  - `category_id` (optional): Filter by category UUID.
  - `from_date` (optional): YYYY-MM-DD.
  - `to_date` (optional): YYYY-MM-DD.
  - `page` (default: 1): Page number.
  - `limit` (default: 20): Items per page.

#### Response (200 OK):
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
        "wallet_name": "Cash Wallet",
        "category_name": "Food & Dining",
        "amount": 45000.00,
        "transaction_type": "EXPENSE",
        "transaction_date": "2026-09-15T07:30:00Z",
        "description": "Beef pho for breakfast",
        "input_method": "NLP",
        "ai_confidence_score": 0.95
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total_items": 45,
      "total_pages": 3
    }
  }
}
```

### 4.2. Create a Transaction
- **Endpoint:** `POST /transactions`
- **Auth required:** Yes

#### Request Body:
```json
{
  "wallet_id": "11111111-1111-1111-1111-111111111111",
  "category_id": "33333333-3333-3333-3333-333333333333",
  "amount": 45000.00,
  "transaction_type": "EXPENSE",
  "transaction_date": "2026-09-15T07:30:00Z",
  "description": "Beef pho for breakfast",
  "input_method": "NLP",
  "ai_confidence_score": 0.95
}
```

---

## 5. AI Microservice Module (AI Microservice Endpoints)

### 5.1. Natural Language Parsing (NLP Smart Categorize)
- **Endpoint:** `POST /ai/categorize` *(AI Engine :8001)*
- **Auth required:** Yes

#### Request Body:
```json
{
  "description": "just refueled the motorbike 50k yesterday"
}
```

#### Response (200 OK):
```json
{
  "success": true,
  "data": {
    "parsed_amount": 50000.00,
    "suggested_category": "Transportation",
    "suggested_category_id": "44444444-4444-4444-4444-444444444444",
    "transaction_type": "EXPENSE",
    "parsed_date": "2026-09-14",
    "cleaned_description": "Motorbike refuel",
    "confidence": 0.92
  }
}
```

---

### 5.2. OCR Receipt Scanning (Scan Receipt)
- **Endpoint:** `POST /ai/scan-receipt` *(AI Engine :8001)*
- **Content-Type:** `multipart/form-data`
- **Auth required:** Yes

#### Request Form Data:
- `file`: Receipt image file (PNG, JPG, max 5MB)

#### Response (200 OK):
```json
{
  "success": true,
  "data": {
    "merchant_name": "WinMart Supermarket",
    "total_amount": 185000.00,
    "parsed_date": "2026-09-15",
    "suggested_category": "Shopping / Groceries",
    "extracted_text_raw": "WINMART... TOTAL: 185,000 VND...",
    "confidence": 0.88
  }
}
```

---

### 5.3. Spending Forecast & AI Alerts (AI Spending Insights)
- **Endpoint:** `GET /ai/insights` *(AI Engine :8001)*
- **Auth required:** Yes

#### Response (200 OK):
```json
{
  "success": true,
  "data": {
    "current_month": "2026-09",
    "total_spent_so_far": 2450000.00,
    "projected_month_end_total": 4900000.00,
    "total_budget_limit": 4500000.00,
    "has_overspend_risk": true,
    "insights": [
      {
        "type": "OVERSPEND_WARNING",
        "severity": "HIGH",
        "category": "Food & Dining",
        "message": "⚠️ At the current spending pace (~160k/day), you are projected to spend 4,900,000₫ by the end of this month (400,000₫ over the 4,500,000₫ budget).",
        "recommendation": "Consider cutting back on dining out during the last 2 weeks of the month."
      }
    ]
  }
}
```
