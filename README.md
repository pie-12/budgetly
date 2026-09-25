# Budgetly - Smart Personal Financial Management Platform

> **Course Project:** AI Product Development: End to End  
> **Project Name:** Budgetly - Smart Personal Financial Management Platform  
> **Team Members:**
> - Nguyen Tung Lam (Student ID: 23IT138)
> - Le Huu Anh Tu (Student ID: 23IT294)

---

## 🌟 1. Overview

**Budgetly** is an AI-powered personal financial management web platform designed to help users (especially students and young professionals) proactively control their personal finances without the barrier of tedious manual data entry.

By leveraging **Generative AI** and machine learning capabilities such as **Natural Language Processing (NLP)**, **Automated Receipt Scanning (OCR)**, and **Predictive Spending Analytics**, Budgetly turns routine expense tracking into an automated, insightful, and frictionless experience.

---

## 🚀 2. Key Features

### 🔹 Core Financial Features (Non-AI)
- **Account & Multi-Wallet Management:** Support for cash wallets, bank accounts, and e-wallets.
- **Transaction Tracking:** Create, edit, filter, and tag income/expense records.
- **Budgeting:** Set monthly budget thresholds per category with real-time progress indicators.
- **Analytics & Visual Reports:** Interactive charts showing cash flow, spending breakdown, and financial health.

### 🤖 AI-Powered Capabilities (Core Highlight)
1. **Smart Text Input (NLP):** Type natural sentences (e.g., *"Bought lunch for $5.50"*) to automatically extract amount, date, and categorize into *"Food & Dining"*.
2. **Receipt Scanner (OCR):** Upload invoice/receipt images to automatically extract merchant name, total price, and transaction date.
3. **AI Spending Forecast & Anomaly Detection:** Time-series projection to forecast end-of-month expenditure and trigger early warnings before exceeding budget limits.

---

## 🛠️ 3. Tech Stack & Architecture

| Layer | Technologies | Purpose |
| :--- | :--- | :--- |
| **Frontend** | Next.js 14, TypeScript, Tailwind CSS, Lucide Icons | Responsive, high-performance web user interface |
| **Core Backend** | Python, FastAPI, SQLAlchemy, Pydantic | RESTful API, business logic, transaction ledger, JWT authentication |
| **AI Engine** | FastAPI, LangChain, Tesseract OCR / Cloud Vision, scikit-learn | Dedicated microservice handling NLP, OCR, and predictive models |
| **Database** | PostgreSQL, Alembic | Relational database with automatic migration and ACID compliance |
| **DevOps** | Docker, Docker Compose | Containerized microservices architecture |

---

## 📁 4. Project Documentation Structure

Comprehensive technical documentation is maintained under the [`docs/`](./docs/) directory:

```
docs/
├── requirements/                      # Software Requirements
│   ├── PRD.md                         # Product Requirements Document (PRD / SRS)
│   └── USER_STORIES.md                # User Stories & Acceptance Criteria (AC)
├── architecture/                      # Architecture & Design
│   ├── SYSTEM_ARCHITECTURE.md         # System Architecture & Diagrams
│   ├── DATABASE_SCHEMA.md             # Relational Database Schema & ERD
│   ├── USER_FLOW.md                   # User Journey & Interaction Flow
│   ├── API_SPECIFICATION.md           # RESTful API Specifications
│   └── SEQUENCE_DIAGRAMS.md           # Sequence Diagrams for Core Workflows
├── ai/                                # AI Specifications
│   └── AI_SPECIFICATIONS.md           # NLP, OCR & Forecasting Pipeline Specs
├── testing/                           # Quality Assurance
│   └── TEST_PLAN.md                   # Unit, Integration & AI Verification Plan
├── deployment/                        # Infrastructure
│   └── DEPLOYMENT_GUIDE.md            # Docker & Cloud Deployment Instructions
└── user_guide/                        # End-User Guides
    └── USER_GUIDE.md                  # Comprehensive User Manual
```

---

## 🏁 5. Quick Start (Local Setup)

### Option 1: Run with Docker Compose (Recommended)
```bash
docker compose up --build
```
- Frontend: `http://localhost:3000`
- Core API Docs: `http://localhost:8000/docs`
- AI Engine API Docs: `http://localhost:8001/docs`

### Option 2: Run Locally

#### 1. Backend Core
```bash
cd server
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
uvicorn server.main:app --reload --port 8000
```

#### 2. Frontend
```bash
cd client
npm install
npm run dev
```
Access the client application at `http://localhost:3000`.

---

## 👥 6. Team Contributions

- **Nguyen Tung Lam (`23IT138`):** Core Backend API (FastAPI), Database Architecture (PostgreSQL/SQLAlchemy), AI Microservice Engine, Client-Server API integration.
- **Le Huu Anh Tu (`23IT294`):** UI/UX Frontend Design (Next.js/Tailwind), Component Engineering, System Documentation & ERD Diagrams.
