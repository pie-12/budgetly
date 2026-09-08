# User Stories & Acceptance Criteria

## Epic 1: Smart Transaction Management

### User Story 1.1: Natural Language Input (NLP)
**As a** busy user,
**I want** to input a natural language description of my expense (e.g., "spent 50k on gas"),
**So that** the system automatically saves a 50,000 VND transaction under the "Transportation" category without requiring me to manually click through multiple steps.

**Acceptance Criteria:**
1. The UI provides a free-text input field for transaction descriptions.
2. Upon submission, the AI service must return the parsed `amount` (50000) and `category` ("Transportation").
3. If the AI confidence score is low (<70%), display a confirmation popup asking the user to verify the parsed data before saving.

### User Story 1.2: Receipt Scanning (OCR)
**As a** user who keeps paper receipts,
**I want** to take a picture of a grocery receipt,
**So that** the application automatically extracts the total amount and date, and pre-fills the transaction form.

**Acceptance Criteria:**
1. A "Scan/Upload Receipt" button is available on the UI.
2. The system successfully extracts the "Total Amount" and "Date" from the receipt image.
3. If the image is too blurry, the system returns an error message prompting the user to retake the photo.

## Epic 2: Budget Control

### User Story 2.1: AI Spending Alerts
**As a** user who wants to save money,
**I want** to receive a warning if my spending rate in the first week is unusually high,
**So that** I can adjust my shopping behavior for the rest of the month.

**Acceptance Criteria:**
1. The AI model uses the last 3 months of spending data to forecast the current month's total expense.
2. If the forecasted amount exceeds 90% of the set budget, a warning notification (UI Warning) is displayed on the Dashboard.
