FROM python:3.11-slim

WORKDIR /app

# Install system dependencies (e.g. libpq for psycopg2)
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy server code into /app/server so 'from server...' imports work seamlessly
COPY . /app/server

ENV PYTHONPATH=/app
WORKDIR /app/server

EXPOSE 8000

CMD ["uvicorn", "server.main:app", "--host", "0.0.0.0", "--port", "8000"]
