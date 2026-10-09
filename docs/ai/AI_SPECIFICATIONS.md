# AI Specifications & Model Documentation - Budgetly

> **AI Processing Pipeline & Model Specification (AI/ML Subsystem)**  
> **Project:** Budgetly - Smart Personal Financial Management Platform  

---

## 1. AI Subsystem Overview

In the Budgetly project, the Artificial Intelligence component (AI Engine) serves as a **Core Highlight Requirement** that differentiates the product from traditional personal finance management software.

The AI subsystem is built as an independent microservice (`/ai_engine`) that communicates over RESTful APIs, with the following main responsibilities:
1. **NLP Natural Text Transaction Parser:** Reads and understands natural-language text to extract structured transactions.
2. **OCR Receipt Scanner & Structurer:** Extracts text from receipt images and normalizes it into JSON objects.
3. **Predictive Spending Analytics & Anomaly Detector:** Analyzes spending time series to forecast and detect anomalies.

---

## 2. Feature 1: NLP Smart Transaction Categorization Engine

### 2.1. Objective & Processing Flow
Convert an unstructured input string (e.g., *"yesterday spent 120k on BBQ with friends"*) into a standard financial data object:
- **Amount (`amount`):** `120000` (automatically converts `k`, `thousand`, `million`, `₫` shorthands into an integer).
- **Category (`category`):** `Food & Dining`.
- **Transaction date (`transaction_date`):** yesterday (calculated automatically from the current date).
- **Transaction type (`transaction_type`):** `EXPENSE`.
- **Confidence score (`confidence`):** `0.94` (from 0.0 to 1.0).

### 2.2. Implementation Techniques & Prompt Engineering
Uses a large language model (LLM) combined with **Few-Shot Prompting** and **Structured Output (JSON Schema Verification)** to ensure the output always strictly conforms to the expected data types.

#### Sample System Prompt Structure:
```text
You are a professional AI assistant for personal finance.
Your task is to analyze sentences describing user transactions and extract them into a standard JSON format.

The standard category taxonomy includes:
- Food & Dining
- Transportation
- Shopping
- Entertainment
- Utilities
- Healthcare
- Salary & Income

Currency unit handling rules:
- "k", "thousand" -> multiply by 1,000. (e.g., 50k -> 50000)
- "tr", "million" -> multiply by 1,000,000. (e.g., 1.5tr -> 1500000)
- Casual shorthand for a million -> multiply by 1,000,000. (e.g., 2 million -> 2000000)

The required output format must be JSON:
{
  "amount": number,
  "category": string,
  "transaction_type": "INCOME" | "EXPENSE",
  "transaction_date": "YYYY-MM-DD",
  "cleaned_description": string,
  "confidence": number
}
```

### 2.3. Confidence Score Algorithm & Fallback Mechanism (Confidence Thresholding)
- **Confidence score formula (`confidence`):** computed from the clarity of all 3 factors: the extracted amount (Amount Clarity), the category match against the standard vocabulary (Taxonomy Match), and the Income/Expense intent (Intent Confidence).
- **Threshold Rules:**
  - **`Confidence >= 0.75` (High Confidence):** automatically fills the form and saves the transaction to the DB. Shows a Toast notification with an *"Undo"* button.
  - **`Confidence < 0.75` (Low Confidence):** opens a pop-up showing the suggested data. The user must review it and manually press the *"Confirm Save"* button.

---

## 3. Feature 2: OCR Receipt Scanning & Information Extraction

### 3.1. Receipt Image Processing Pipeline Architecture
The pipeline consists of 3 sequential stages:

```mermaid
graph LR
    Img[Uploaded Receipt Image] --> Preproc[Image Preprocessing OpenCV/Pillow]
    Preproc --> OCR[Tesseract OCR Engine / Vision API]
    OCR --> RawText[Raw Text Output]
    RawText --> LLMPARSE[LLM Structured Parser]
    LLMPARSE --> StructJSON[Structured Transaction JSON]
```

### 3.2. Image Preprocessing
- Convert the image to grayscale.
- Apply noise reduction and contrast enhancement techniques (Adaptive Thresholding / Contrast Enhancement) to make the printed text on thermal receipt paper clear.

### 3.3. Structured Extraction from Raw Text (Post-OCR Parsing)
Raw text strings extracted by OCR often contain typos or extra whitespace. The AI Engine passes this raw string through the language model to extract the fields:
- `merchant_name`: Supermarket / store name.
- `total_amount`: Total payment amount (`TOTAL`, `GRAND TOTAL`, `AMOUNT DUE`).
- `transaction_date`: Receipt print date.

---

## 4. Feature 3: Spending Forecast & Anomaly Detection (Predictive Analytics)

### 4.1. Month-End Spending Forecast Model
Based on the spending time series $X = [x_1, x_2, ..., x_t]$ of the days elapsed so far in month $m$:

$$\text{Average Daily Velocity} = \bar{v} = \frac{\sum_{i=1}^{t} x_i}{t}$$

$$\text{Projected Total} = \sum_{i=1}^{t} x_i + \bar{v} \times (D - t)$$

*(Where $D$ is the total number of days in month $m$, and $t$ is the number of days elapsed.)*

### 4.2. Anomaly Detection Algorithm (Z-Score Anomaly Detection)
To detect a sudden spending spike compared with the user's historical habits:

$$Z = \frac{x_i - \mu}{\sigma}$$

- $\mu$: Average daily spending over the past 90 days.
- $\sigma$: Standard deviation of spending.
- **Alert Rule:** If $Z > 2.5$ (the expense unusually exceeds 2.5 standard deviations), the system automatically records an `ANOMALY_DETECTED` event and displays advice to the user.

---

## 5. Evaluation Plan & Model Metrics (Evaluation & Metrics)

To support the results report for the course project, the AI subsystem will be evaluated on a benchmark test-set (100 text samples and 30 real receipt images):

| AI Feature | Evaluation Metric | Target Baseline |
| :--- | :--- | :--- |
| **NLP Categorization** | Multi-class Accuracy & Macro F1-Score | **Accuracy >= 85%**, **F1-Score >= 0.82** |
| **NLP Amount Parsing** | Exact Match Accuracy (amount accuracy) | **>= 92%** |
| **OCR Text Extraction** | Character Error Rate (CER) & Total Amount Accuracy | Total Amount Accuracy **>= 88%** |
| **Spending Forecast** | Mean Absolute Error (MAE) & Mean Absolute Percentage Error (MAPE) | MAPE **<= 12%** |
| **Latency SLA** | Average API Response Time | NLP **< 1.5s**, OCR **< 3.0s** |
