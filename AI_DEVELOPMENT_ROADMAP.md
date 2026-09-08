# AI AGENT DEVELOPMENT ROADMAP: Budgetly
**Context:** AI Product Development Course Project
**Project Name:** Budgetly - Smart Personal Financial Management Platform
**Target Audience:** Autonomous Coding Agents / AI Assistants

## 0. PROJECT METADATA
```yaml
project: Budgetly
type: AI-powered Financial Management System
team:
  - id: "23IT138"
    name: "Nguyen Tung Lam"
  - id: "23IT294"
    name: "Le Huu Anh Tu"
tech_stack:
  frontend: Next.js (TypeScript, Tailwind CSS)
  backend: Python (FastAPI) # Chosen for native AI/ML library integration
  database: PostgreSQL
  ai_libraries: [LangChain, scikit-learn, pytesseract, openai]
  tools: Docker, GitHub Actions
architecture: Monorepo (client/, server/)
```

## 1. PHASE 1: INITIALIZATION & SCAFFOLDING
**Objective:** Establish workspace, dependencies, and baseline monorepo structure.

### Task 1.1: Git & Directory Setup
- [ ] **Action:** Initialize empty git repository.
- [ ] **Action:** Create `.gitignore` tailored for Node.js and Python.
- [ ] **Action:** Create root directory structure: `/client`, `/server`.
- [ ] **Validation:** `git status` should show clean initialization.

### Task 1.2: Backend Scaffold (FastAPI)
- [ ] **Action:** `cd server && python -m venv venv`
- [ ] **Action:** Create `requirements.txt` with `fastapi`, `uvicorn`, `sqlalchemy`, `psycopg2-binary`, `pydantic`, `python-dotenv`.
- [ ] **Action:** Create `main.py` with health check endpoint (`/api/v1/health`).
- [ ] **Validation:** Endpoint returns HTTP 200 `{"status": "ok"}`.

### Task 1.3: Frontend Scaffold (Next.js)
- [ ] **Action:** `cd client && npx create-next-app@latest . --typescript --tailwind --eslint --app`
- [ ] **Action:** Configure `next.config.js` to proxy `/api` to backend running on port 8000.
- [ ] **Validation:** Next.js dev server starts successfully.

## 2. PHASE 2: CORE INFRASTRUCTURE (NON-AI)
**Objective:** Build standard CRUD operations for financial management.

### Task 2.1: Database Schema Definition
- [ ] **Action:** Define SQLAlchemy models in `/server/models/`:
  - `User`: id, username, email, hashed_password.
  - `Wallet`: id, user_id, name, balance.
  - `Transaction`: id, user_id, wallet_id, amount, type (income/expense), category, date, description.
- [ ] **Action:** Setup Alembic for database migrations. Generate initial migration.

### Task 2.2: Core API Endpoints
- [ ] **Action:** Implement REST endpoints in `/server/routers/`:
  - `POST /transactions`: Create transaction.
  - `GET /transactions`: Retrieve with filtering (date range, type).
  - `GET /analytics/summary`: Aggregate total income/expense per category.
- [ ] **Validation:** Run pytest for CRUD endpoints.

### Task 2.3: Basic UI Implementation
- [ ] **Action:** Create Dashboard layout (`/client/app/dashboard/page.tsx`).
- [ ] **Action:** Build form component for manual transaction entry.
- [ ] **Action:** Integrate React Query (or SWR) for state management and API fetching.

## 3. PHASE 3: AI CAPABILITIES INTEGRATION (CORE METRIC)
**Objective:** Implement intelligent features satisfying the "AI Product Development" requirement.

### Task 3.1: AI Feature 1 - NLP Transaction Categorization
- **Purpose:** Automatically infer transaction 'category' from natural language input.
- [ ] **Action:** Implement endpoint `POST /api/v1/ai/categorize`.
- [ ] **Implementation spec:** Accept payload `{"description": "paid for netflix"}`. Use LLM prompt or lightweight trained text classifier (e.g., fastText/scikit-learn) to map to standard categories (e.g., "Entertainment").
- [ ] **Validation:** Ensure fallback category exists if confidence score < threshold.

### Task 3.2: AI Feature 2 - Receipt OCR & Parsing
- **Purpose:** Extract amount and date from receipt images.
- [ ] **Action:** Implement endpoint `POST /api/v1/ai/scan-receipt`.
- [ ] **Implementation spec:** Accept `multipart/form-data` image. Process with `pytesseract` (or cloud Vision API). Pass extracted raw text to an LLM instruction to output JSON: `{"amount": number, "date": string, "merchant": string}`.
- [ ] **Validation:** Write unit test providing a sample receipt image and asserting correct JSON schema output.

### Task 3.3: AI Feature 3 - Spending Anomaly Detection & Forecasting
- **Purpose:** Warn users if spending rate exceeds historical average.
- [ ] **Action:** Implement background task or on-demand endpoint `GET /api/v1/ai/insights`.
- [ ] **Implementation spec:** Fetch user's 3-month transaction history. Apply simple statistical bounds (Z-score) or ARIMA model to forecast month-end total. Return `{"forecast_total": number, "anomalies": [...]}`.

## 4. PHASE 4: INTEGRATION & REFINEMENT
**Objective:** Connect frontend to AI features and ensure robustness.

### Task 4.1: UI for AI Features
- [ ] **Action:** Add "Scan Receipt" button in frontend triggering file upload to `/scan-receipt`. Auto-fill the transaction form with the response.
- [ ] **Action:** Add "Smart Input" text field triggering `/categorize` on debounce.
- [ ] **Action:** Render AI Insights in the Dashboard view (e.g., "⚠️ You are projected to exceed your budget by $50").

### Task 4.2: Error Handling & Fallbacks
- [ ] **Action:** Implement strict try-catch blocks in AI services (AI requests are prone to timeouts and parsing errors).
- [ ] **Action:** Ensure LLM outputs are validated against Pydantic models (Structured Outputs) to prevent application crashes.

## 5. PHASE 5: DEPLOYMENT & DOCUMENTATION
**Objective:** Prepare the project for final grading.

### Task 5.1: Containerization
- [ ] **Action:** Write `/server/Dockerfile`.
- [ ] **Action:** Write `/client/Dockerfile`.
- [ ] **Action:** Write `docker-compose.yml` to orchestrate postgres, server, and client.
- [ ] **Validation:** `docker compose up --build` boots entire stack successfully.

### Task 5.2: Technical Documentation
- [ ] **Action:** Generate Swagger Docs (built-in FastAPI at `/docs`).
- [ ] **Action:** Update `README.md`. MUST include:
  - Prerequisites and run instructions.
  - Architecture diagram.
  - **AI Model Documentation:** Detailed explanation of the AI features, models used, accuracy trade-offs, and metrics.
