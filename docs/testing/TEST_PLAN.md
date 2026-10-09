# Master Test Plan & Quality Assurance Specification - Budgetly

Test Plan & Software Quality Assurance specification document for the **Budgetly** course project.

---

## 1. Testing Strategy & Objectives (Testing Strategy)

The testing strategy for the Budgetly system applies the **Testing Pyramid** model with 4 levels:

```
        / \
       / UAT \          -> User Acceptance Testing (Manual Test Cases)
      /-------\
     / Integration \    -> API Endpoint & DB Integration Testing (Pytest + HTTPX)
    /---------------\
   /   AI Benchmark  \  -> Evaluation Test-set for NLP & OCR Accuracy
  /---------------------\
 /       Unit Test       \ -> Core Logic, Model Validation & Utilities
/-------------------------\
```

---

## 2. Test Environment & Tools

| Test Level | Subsystem | Tool / Library Used |
| :--- | :--- | :--- |
| **Unit Test** | Core Server (`/server`) | `pytest`, `pytest-asyncio`, `SQLAlchemy Test Database (SQLite in-memory)` |
| **Unit Test** | AI Engine (`/ai_engine`) | `pytest`, `unittest.mock` |
| **Frontend Test** | Client (`/client`) | `Jest`, `@testing-library/react` |
| **API Integration** | Core Backend API | `HTTPX AsyncClient`, `Postman / Bruno` |
| **AI Evaluation** | AI Subsystem | Custom Benchmark Script (`evaluate_ai.py`) |
| **UAT (Acceptance)** | Entire system | Manual testing in a web browser following UAT scenarios |

---

## 3. API Integration Test Matrix

The automated test cases are written in the `server/tests/` and `ai_engine/tests/` directories:

| Test Case ID | Subsystem | Test Scenario Name | Input | Expected Output |
| :--- | :--- | :--- | :--- | :--- |
| **TC-AUTH-01** | Auth | Successful registration | Valid email, password >= 8 characters | HTTP 201 Created, returns User ID & creates default Wallet |
| **TC-AUTH-02** | Auth | Registration with a duplicate Email | Email already exists in the DB | HTTP 400 Bad Request, error message *"Email is already in use"* |
| **TC-AUTH-03** | Auth | Login with correct credentials | Correct Email & Password | HTTP 200 OK, returns a valid JWT Access Token |
| **TC-AUTH-04** | Auth | Login with a wrong Password | Incorrect password | HTTP 401 Unauthorized |
| **TC-WAL-01** | Wallet | Create a new financial Wallet | Name: "MoMo Wallet", Balance: 500,000₫ | HTTP 201 Created, wallet saved to the DB under the correct user_id |
| **TC-TX-01** | Transaction | Add an Expense transaction | Wallet ID, Amount: 50k, Category: "Food & Dining" | HTTP 201 Created, Wallet balance decreases by 50,000₫ |
| **TC-AI-01** | AI Engine | Parse standard NLP text | `"Just refueled 50k"` | HTTP 200 OK, `{amount: 50000, category: "Transportation", confidence > 0.85}` |
| **TC-AI-02** | AI Engine | Parse an OCR receipt image | Image file `sample_receipt.jpg` | HTTP 200 OK, correctly extracts the total amount |

---

## 4. AI Accuracy Benchmark Test Suite

Below is a sample test scenario for evaluating the accuracy of the NLP pipeline on the benchmark dataset:

```python
# ai_engine/tests/test_nlp_accuracy.py
import pytest
from src.main import categorize_transaction

BENCHMARK_DATA = [
    ("Breakfast beef pho 45k", 45000, "Food & Dining"),
    ("Motorbike refuel 50000₫", 50000, "Transportation"),
    ("Clothes shopping at Zara 1.2tr", 1200000, "Shopping"),
    ("Electricity bill for September 850k", 850000, "Utilities"),
    ("Received September salary 15 million", 15000000, "Salary & Income"),
]

@pytest.mark.parametrize("input_text, expected_amount, expected_category", BENCHMARK_DATA)
def test_nlp_categorization_accuracy(input_text, expected_amount, expected_category):
    result = categorize_transaction({"description": input_text})
    assert result["amount"] == expected_amount
    assert result["category"] == expected_category
    assert result["confidence"] >= 0.75
```

---

## 5. Manual UAT Test Matrix

Used for the demo and hands-on evaluation of the course project in front of the review panel:

### UAT-01 Scenario: Registration & Financial Onboarding Flow
1. **Action:** The user opens the Web App -> clicks "Register" -> enters the email `student@example.com` and a password -> clicks "Create account".
2. **Expected:** Registration succeeds and redirects straight to the Dashboard. The Wallet list already shows *"Cash Wallet"* with a 0₫ balance.

### UAT-02 Scenario: Automatic Entry Flow via AI NLP
1. **Action:** In the "Smart AI Input" field on the Dashboard, type *"bought milk tea 50k yesterday"* and press Enter.
2. **Expected:**
   - The screen shows a processing state for ~1 second.
   - A Toast notification appears: *"Transaction saved: 50,000₫ - Category: Food & Dining"*.
   - Verify that the wallet balance automatically decreases by 50,000₫.
   - The spending pie chart updates with an *"Food & Dining"* slice.

### UAT-03 Scenario: Over-Budget Alert Flow
1. **Action:** The user sets a Food & Dining budget = 1,000,000₫/month. Enters a series of food transactions with current total spending = 950,000₫ while only in the 2nd week of the month.
2. **Expected:** A prominent AI Alert Card (Red/Purple) appears on the Dashboard with a warning that the spending pace is too fast and risks exceeding the limit.
