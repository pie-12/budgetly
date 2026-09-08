# User Flow

Below is the core user flow focusing on the AI-powered automated data entry feature.

## 1. AI Transaction Input Flow (NLP / OCR)

```mermaid
graph TD
    A[Dashboard] --> B{Choose Input Method}
    B -->|Natural Text Input| C[Type description: e.g., "lunch 50k"]
    B -->|Scan Receipt| D[Upload receipt image]
    
    C --> E[AI NLP Service analyzes text]
    D --> F[AI OCR Service extracts text]
    
    E --> G{Confidence > 80%?}
    F --> G
    
    G -->|Yes| H[Auto-fill Form: Amount, Category, Date]
    G -->|No / Blurry Image| I[Display Warning & Request Manual Input]
    
    I --> H
    H --> J[User confirms and saves]
    J --> K[Update Database]
    K --> A
```
