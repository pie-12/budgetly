# Product Requirements Document (PRD) - Budgetly

| Information | Details |
| :--- | :--- |
| **Project name** | Budgetly - Smart Personal Financial Management Platform |
| **Version** | 1.0.0 (Academic Course Project) |
| **Date created** | 15/09/2026 |
| **Author(s)** | Nguyen Tung Lam (23IT138), Le Huu Anh Tu (23IT294) |
| **Status** | Approved |

---

## 1. Product Overview

### 1.1. Vision
Budgetly is a next-generation personal finance management app that applies Artificial Intelligence (AI) to remove the biggest barrier users face when managing their spending: **manual data entry is time-consuming and easily becomes a chore**.

### 1.2. Solution Summary
The product combines a standard relational finance management app (CRUD, Wallets, Budgets, Reports) with smart AI microservices:
- **Automatic entry via Text/Voice (NLP):** Understands natural language to extract amounts and purposes, and automatically assigns categories.
- **Automatic Receipt Extraction (OCR):** Reads sales receipt photos and extracts the total amount, purchase date, and store name.
- **Spending Forecast & Smart Alerts:** Analyzes historical data to forecast month-end total spending and provides early warnings to help prevent budget overruns.

---

## 2. Problem Statement & Project Goals

### 2.1. Real-World Problem
1. **High input friction:** Users must go through 4-5 manual steps (select wallet, enter amount, choose date, choose category, type a description) for every expense incurred.
2. **Passive tracking:** Most current apps only report spending that has already happened, without warning about the risk of running out of money / exceeding the budget before the month ends.
3. **Inaccurate classification:** Users often forget or mistype spending categories, making financial reports unreliable.

### 2.2. Product Goals & KPIs
- **Entry speed:** Reduce the time to record a transaction from ~25 seconds (manual) to under 3 seconds (via voice/NLP text or OCR photo).
- **AI accuracy (NLP Categorization):** Achieve over **85%** accuracy in automatically assigning the correct category for text input.
- **OCR accuracy:** Successfully extract the amount and transaction date with over **90%** accuracy on a set of clear receipt images.
- **System performance:** Core API response time < 200ms, AI processing API < 2.5s.

---

## 3. Target Audience & Personas

### Persona 1: Student / Young professional (Minh - 21 years old)
- **Characteristics:** Frequently transacts via bank transfer/cash, wants to save money but is too lazy to open the app and enter data manually every day.
- **Needs:** Record expenses quickly via a single message line or a receipt photo; wants to know whether their current spending pace means they will run short of money by the end of the month.

### Persona 2: Small household finance manager (Lan - 28 years old)
- **Characteristics:** Needs detailed budget control per item (Food & Dining, Shopping, Children, Housing).
- **Needs:** Set monthly budget limits; receive automatic alerts when about to exceed the allowed amount.

---

## 4. Detailed Functional Requirements

### 4.1. Authentication & User Management Module
- **FR-01:** Allow users to register a new account with Email and Password.
- **FR-02:** Allow login and return an encrypted JWT authentication token.
- **FR-03:** Logout and manage the user profile (User Profile).

### 4.2. Wallets & Categories Management Module
- **FR-04 (Financial Wallets):** Allow creating, editing, and deleting multiple financial Wallets (e.g., Cash, Vietcombank ATM, MoMo Wallet, Credit Card). Balances update automatically with transactions.
- **FR-05 (Spending Categories):** The system comes with default categories (Food & Dining, Transportation, Shopping, Entertainment, Salary & Income, etc.) and allows users to customize their own categories.

### 4.3. Transaction Management Module
- **FR-06 (Manual Actions):** Create, edit, and delete Income and Expense transactions.
- **FR-07 (Filter & Search):** Search transactions by keyword, filter by date range (day/frequency/month), and filter by wallet or category.

### 4.4. AI-Powered Module (Core Requirement)
- **FR-08 (NLP Smart Input):**
  - Provide a natural-language text input field (e.g., *"refueled 50k"*, *"bought milk tea 45,000₫ yesterday"*).
  - The AI Engine analyzes the input and returns a structured JSON: `{ amount: 50000, category: "Transportation", transaction_date: "2026-09-14", description: "refueled", confidence: 0.92 }`.
  - If `confidence < 0.75`, the app opens a dialog showing the suggested data so the user can confirm/adjust it before saving.
- **FR-09 (OCR Receipt Scanning):**
  - Allow users to upload / photograph sales receipts (JPG/PNG format).
  - The AI Engine runs OCR to extract the text and pulls out: Total amount, Purchase date, Store/Merchant name.
  - Automatically fill the extracted data into the transaction confirmation form.
- **FR-10 (AI Predictive Analytics & Alerts):**
  - Periodically, or when the Dashboard is viewed, the AI Engine analyzes the spending pace of the last 3 months and the current month.
  - Use forecasting algorithms (Z-Score / Time Series) to calculate the projected total spending through the end of the month.
  - Display a visual warning on the Dashboard if the projected spending exceeds **90%** of the configured budget limit.

### 4.5. Analytics & Reporting Module (Analytics & Visualization)
- **FR-11:** Pie chart showing the proportion of spending per category.
- **FR-12:** Bar/Line chart showing Income/Expense trends over time.
- **FR-13:** Financial metrics overview table (Total Income, Total Expense, Net Balance, Remaining Budget).

---

## 5. Non-Functional Requirements

### 5.1. Performance & Timing Constraints (Performance)
- Response time of regular APIs (CRUD): **< 200ms**.
- NLP natural-language processing time: **< 1.5s**.
- OCR receipt extraction time: **< 3.0s**.

### 5.2. Security & Privacy (Security)
- Hash passwords with a secure algorithm (`bcrypt` with salt).
- Authenticate APIs via the JWT Bearer Token protocol in the Header.
- Apply the user-level data isolation principle (User-level Isolation): each user can only access the wallets and transactions they own.

### 5.3. Reliability & Fallback (Reliability & Fallback)
- In case the AI service fails (timeout / LLM API error), the app automatically falls back to the traditional manual entry form without interrupting the application experience.

### 5.4. Usability & Design (Usability & Design)
- The interface works well on both Desktop and Mobile Web.
- Modern design using Tailwind CSS, with intuitive feedback (loading indicator, toast notification).

---

## 6. Technical Constraints & Assumptions (Constraints & Assumptions)

- **AI Processing Language:** Prioritize accurate support for natural-language input (including common financial shorthands such as *k, ₫, thousand, million*).
- **Packaging Infrastructure:** The system must be packageable into Docker containers and launched together via `docker-compose`.
