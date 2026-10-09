# User Stories & Acceptance Criteria (AC) - Budgetly

This document lists the User Stories together with detailed Acceptance Criteria (AC) for the Budgetly application, organized by main Epics.

---

## 📌 Epic 1: Login & User Authentication (Authentication & User Profile)

### User Story 1.1: Register a new account
- **As a** new user,
- **I want** to register an application account with Email and Password,
- **So that** I can create a storage space and secure my personal spending data.

**Acceptance Criteria (AC):**
1. The system displays a Registration form with: Email, Password, Confirm password.
2. Validate the Email and password (password must be at least 8 characters).
3. If the email already exists in the system, return the error message *"This email is already in use"*.
4. After successful registration, automatically create for the user 1 default Wallet (*"Cash Wallet"*) and the standard list of spending Categories (*Food & Dining, Transportation, Shopping, etc.*).

### User Story 1.2: Log in to the system
- **As a** user with an existing account,
- **I want** to log in to the application with Email and Password,
- **So that** I can access the Dashboard and manage my finances.

**Acceptance Criteria (AC):**
1. The user enters the correct Email and Password -> the system returns a JWT Token and redirects to the Dashboard page.
2. Wrong Email or Password -> show the warning *"Incorrect email or password"*.
3. The JWT Token is stored securely on the Client and automatically attached to the HTTP Header `Authorization: Bearer <token>` for all subsequent requests.

---

## 📌 Epic 2: Wallets & Financial Categories Management (Wallets & Categories)

### User Story 2.1: Create and manage multiple financial Wallets
- **As a** user with multiple funding sources,
- **I want** to create separate financial wallets (Cash, Bank, E-Wallet),
- **So that** I can track the exact balance of each account.

**Acceptance Criteria (AC):**
1. The user can create a new Wallet by entering the Wallet name and Initial balance.
2. Income transactions automatically add to the corresponding wallet balance; Expense transactions automatically subtract from the wallet balance.
3. The user can rename a wallet or delete a wallet (a wallet can only be deleted when it has no linked transactions).

### User Story 2.2: Customize income/expense Categories
- **As a** user who needs detailed management,
- **I want** to add or customize personal spending categories,
- **So that** I can classify expenses to match my daily lifestyle.

**Acceptance Criteria (AC):**
1. The system displays the list of System Categories (default) and Custom Categories (created by the user).
2. The user can create a new Category and specify the category type as `INCOME` or `EXPENSE`.

---

## 📌 Epic 3: Manual Transaction Management (Manual Transaction Management)

### User Story 3.1: Add a manual transaction
- **As a** user,
- **I want** to manually enter the information of an income or expense transaction,
- **So that** I can record the money that just changed hands.

**Acceptance Criteria (AC):**
1. The add-transaction form includes: Amount, Transaction type (Income/Expense), Category, Wallet, Transaction date, Notes/Description.
2. When *"Save"* is pressed, the system saves the transaction to the database and automatically recalculates the Wallet balance.
3. If no Transaction date is selected, the system defaults to the current date.

### User Story 3.2: Transaction list & filtering
- **As a** user,
- **I want** to view the transaction history list and filter by date/category,
- **So that** I can check the money spent during the month.

**Acceptance Criteria (AC):**
1. The list interface shows pagination or infinite scroll, sorted with the most recent first.
2. The filter allows filtering by date range (Today, This week, This month, Custom).
3. Allow searching transactions by description keyword.

---

## 📌 Epic 4: AI-Powered Smart Entry (AI-Powered Smart Entry)

### User Story 4.1: Natural-language text entry (NLP Text Input)
- **As a** busy user,
- **I want** to type a natural sentence describing an expense (e.g., *"just had lunch 45k"*),
- **So that** AI automatically parses the Amount (45,000₫) and Category (*Food & Dining*) without me having to operate each select field.

**Acceptance Criteria (AC):**
1. The UI provides a "Smart AI Input" field on the Dashboard.
2. The user types the text string and presses Enter -> the Client sends a request to the `/api/v1/ai/categorize` API.
3. The AI Engine extracts: `amount`, `category`, `description`, `confidence`.
4. **If Confidence >= 75%:** the system automatically fills the form and saves the transaction, showing a success toast with an *"Undo"* button.
5. **If Confidence < 75%:** open a confirmation popup so the user can review and edit the information before pressing save.

### User Story 4.2: Receipt recognition via photo (OCR Receipt Scan)
- **As a** user who often keeps purchase receipts,
- **I want** to photograph a supermarket/store receipt and upload it to the application,
- **So that** AI automatically reads the receipt and extracts the Total amount, Purchase date, and Store name.

**Acceptance Criteria (AC):**
1. The interface provides a *"Scan Receipt"* button that allows uploading an image file (PNG, JPG) or taking a photo directly from a mobile camera.
2. The image is sent to the `/api/v1/ai/scan-receipt` API. The AI Engine performs OCR and extracts the information into structured JSON.
3. Show a processing screen (Loading indicator) for no more than 3 seconds.
4. The extracted information is filled into the Transaction Form so the user can review the original photo next to the form before confirming the save.
5. If the image is blurry or the amount cannot be read, show a clear error message: *"Unable to read the receipt information. Please try again with a clearer photo."*

---

## 📌 Epic 5: Budgeting & Alerts (Budgeting & Alerts)

### User Story 5.1: Set monthly Budget limits
- **As a** user who wants disciplined spending management,
- **I want** to set the maximum amount allowed per category each month (e.g., *Food & Dining up to 3,000,000₫/month*),
- **So that** the system can track my spending level.

**Acceptance Criteria (AC):**
1. The user selects a Category, enters the Amount Limit, and the applicable Month (YYYY-MM).
2. The Budget management page displays a progress bar showing: `% spent = (Category total spending / Limit) * 100%`.
3. The progress bar color changes with the level: Green (<70%), Yellow (70-90%), Red (>90% or over limit).

---

## 📌 Epic 6: Analytics & AI Insights (Analytics & AI Insights)

### User Story 6.1: Financial Analytics Reports
- **As a** user,
- **I want** to view charts summarizing monthly income and expenses,
- **So that** I can clearly understand my own spending habits.

**Acceptance Criteria (AC):**
1. Display a pie chart of the spending distribution by Category.
2. Display a bar chart comparing Total Income vs Total Expense across months.
3. Allow exporting a statistics report as a summary table.

### User Story 6.2: AI Spending Forecast & Over-Budget Alerts (Predictive Insights)
- **As a** user who wants to avoid a financial shortfall mid-month,
- **I want** AI to analyze my spending pace and give early warnings,
- **So that** I can adjust my daily habits in time before running out of money.

**Acceptance Criteria (AC):**
1. The system automatically runs the forecast analysis (AI Forecast) based on the last 3 months of history and the spending pace of the days elapsed in the current month.
2. AI calculates the projected month-end spending (`projected_month_end_expense`).
3. If `projected_month_end_expense > budget_limit * 0.9`, the application displays a prominent AI Insight Card on the Dashboard:
   > *"⚠️ AI warning: At the current spending pace (~150k/day), you are projected to spend 4,500,000₫ on Food & Dining by the end of the month (15% over the 4,000,000₫ budget)."*
4. Provide smart AI suggestions to help the user cut spending sensibly.
