# Installation & Deployment Guide - Budgetly

Detailed Deployment & Installation Guide for the **Budgetly** system.

---

## 1. Prerequisites & Requirements

To successfully install and run the system, the development machine (Local Machine) or deployment server needs to prepare the following minimum environment:

- **Operating System:** Windows 10/11 (WSL2 recommended), macOS, or Linux (Ubuntu 22.04 LTS).
- **Node.js:** Version `>= 18.17.0` (bundled with npm or pnpm).
- **Python:** Version `>= 3.11.0` (with venv / pip).
- **PostgreSQL:** Version `>= 15.0`.
- **Docker & Docker Compose:** Docker Desktop (latest version).
- **Tesseract OCR (if not running with Docker):** Tesseract-OCR binary installed on the OS.

---

## 2. Environment Variables Configuration

The system manages environment variables through `.env` files. Create the corresponding configuration files from the `.env.example` templates:

### 2.1. `.env` file at the Root Directory (`/`):
```env
# Docker Network & Database Configuration
POSTGRES_USER=budgetly_user
POSTGRES_PASSWORD=budgetly_secure_password_2026
POSTGRES_DB=budgetly_db
POSTGRES_HOST=postgres
POSTGRES_PORT=5432

# Ports
CLIENT_PORT=3000
SERVER_PORT=8000
AI_ENGINE_PORT=8001
```

### 2.2. `.env` file in the Core Backend (`/server/.env`):
```env
DATABASE_URL=postgresql://budgetly_user:budgetly_secure_password_2026@localhost:5432/budgetly_db
SECRET_KEY=super_secret_jwt_key_budgetly_2026_change_in_prod
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
AI_ENGINE_URL=http://localhost:8001
```

### 2.3. `.env` file in the AI Engine (`/ai_engine/.env`):
```env
OPENAI_API_KEY=sk-proj-your-openai-api-key-here
TESSERACT_CMD=/usr/bin/tesseract
CORE_SERVER_URL=http://localhost:8000
```

---

## 3. Running with Docker Compose (Recommended)

This is the fastest and most consistent way to run the entire application stack, including PostgreSQL, the Core Backend, the AI Engine, and the Next.js Client.

### 3.1. Steps:
```bash
# Step 1: Clone the source repository
git clone https://github.com/your-username/budgetly.git
cd budgetly

# Step 2: Create the .env file from the template
cp .env.example .env

# Step 3: Start the containers with Docker Compose
docker compose up --build -d

# Step 4: Check the status of the running containers
docker compose ps
```

### 3.2. Verifying the Access URLs:
- **Frontend Web Application:** [http://localhost:3000](http://localhost:3000)
- **Core Backend API Swagger Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **AI Engine Swagger Docs:** [http://localhost:8001/docs](http://localhost:8001/docs)

---

## 4. Manual Startup (Local Development Setup)

If you want to run each service directly on your local machine for development:

### Step 4.1: Start the PostgreSQL Database
Start a local PostgreSQL instance on port 5432 and create the `budgetly_db` database.

### Step 4.2: Start the Core Backend (FastAPI)
```bash
cd server

# Create and activate a Python virtual environment
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install the required dependencies
pip install -r requirements.txt

# Run Database Migrations (Alembic)
alembic upgrade head

# Start the Uvicorn Server
uvicorn main:app --reload --port 8000
```

### Step 4.3: Start the AI Engine (FastAPI)
```bash
cd ai_engine

# Create a dedicated virtual environment for the AI Engine
python -m venv venv
source venv/bin/activate # Or venv\Scripts\activate

# Install AI dependencies
pip install -r requirements.txt

# Start the AI Uvicorn Server
uvicorn src.main:app --reload --port 8001
```

### Step 4.4: Start the Client Frontend (Next.js)
```bash
cd client

# Install Node Modules
npm install

# Start the dev server
npm run dev
```

---

## 5. Troubleshooting

### 1. Database Connection Error (`ConnectionRefusedError`)
- **Cause:** PostgreSQL is not running or the login credentials in `.env` are wrong.
- **Fix:** Check the PostgreSQL container with `docker compose logs postgres` or try connecting via the psql command line.

### 2. Tesseract OCR Binary Not Found Error (`TesseractNotFoundError`)
- **Cause:** Tesseract is not installed on the host machine or the `TESSERACT_CMD` path is not configured.
- **Fix:** On Windows, download Tesseract from UB-Mannheim and set `TESSERACT_CMD=C:\Program Files\Tesseract-OCR\tesseract.exe`. On Linux: `sudo apt-get install tesseract-ocr tesseract-ocr-vie`.

### 3. CORS Origin Request Blocked Error
- **Cause:** The Client calls the API directly from port 3000 but the Backend has not allowed the Origin yet.
- **Fix:** Add `"http://localhost:3000"` to the `allow_origins` list in the `server/main.py` file.
