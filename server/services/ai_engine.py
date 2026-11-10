"""Client for the dedicated AI microservice that lives in ``ai_engine/``.

The Core API keeps a deterministic local implementation of the NLP/OCR
heuristics so the product keeps working when the microservice is not running
(local development without Docker, CI, marking on a laptop). When
``AI_ENGINE_URL`` is configured and the engine answers in time, its models take
precedence and the response reports ``source="ai_engine"``.

Every function here degrades to ``None`` instead of raising: a slow or broken
AI service must never take the financial CRUD API down with it.
"""

from __future__ import annotations

import json
import logging
import os
import urllib.error
import urllib.request
import uuid

logger = logging.getLogger(__name__)

DEFAULT_TIMEOUT_SECONDS = 2.5

#: Receipt images above this size are rejected before they reach the engine.
MAX_RECEIPT_BYTES = 5 * 1024 * 1024


def engine_url() -> str | None:
    """Return the configured AI engine base URL, or ``None`` when disabled."""
    url = os.getenv("AI_ENGINE_URL", "").strip()
    return url.rstrip("/") or None


def is_enabled() -> bool:
    """Whether an AI engine endpoint is configured for this process."""
    return engine_url() is not None


def _timeout() -> float:
    raw = os.getenv("AI_ENGINE_TIMEOUT_SECONDS", "").strip()
    try:
        return float(raw) if raw else DEFAULT_TIMEOUT_SECONDS
    except ValueError:
        return DEFAULT_TIMEOUT_SECONDS


def _read_envelope(request: urllib.request.Request) -> dict | None:
    """POST ``request`` and unwrap the ``{"success": true, "data": {...}}`` body."""
    try:
        with urllib.request.urlopen(request, timeout=_timeout()) as response:
            raw = response.read().decode("utf-8", errors="replace")
    except (urllib.error.URLError, TimeoutError, OSError) as exc:
        logger.warning("AI engine request failed: %s", exc)
        return None

    try:
        body = json.loads(raw or "{}")
    except ValueError:
        logger.warning("AI engine returned invalid JSON")
        return None

    if not isinstance(body, dict) or not body.get("success"):
        logger.warning("AI engine rejected the request: %s", raw[:200])
        return None

    data = body.get("data")
    return data if isinstance(data, dict) else None


def _as_number(value) -> float | None:
    """Accept ``45000``/``45000.0``/``"45000"`` but reject booleans and garbage."""
    if isinstance(value, bool) or value is None:
        return None
    try:
        return float(value)
    except (TypeError, ValueError):
        return None


def categorize(text: str) -> dict | None:
    """Parse a free-form sentence with the AI engine's NLP model.

    Returns a normalised dict (``description``, ``amount``, ``category``,
    ``type``, ``confidence``) or ``None`` when the engine is disabled,
    unreachable, or answers with a payload we do not trust.
    """
    base = engine_url()
    if not base:
        return None

    request = urllib.request.Request(
        f"{base}/api/v1/ai/categorize",
        data=json.dumps({"description": text}).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    data = _read_envelope(request)
    if not data:
        return None

    amount = _as_number(data.get("amount"))
    confidence = _as_number(data.get("confidence"))
    category = data.get("category")
    tx_type = data.get("type")

    if amount is None or confidence is None:
        logger.warning("AI engine categorize payload is missing a numeric field")
        return None
    if not isinstance(category, str) or not category.strip():
        return None
    if not isinstance(tx_type, str) or tx_type.strip().upper() not in {"INCOME", "EXPENSE"}:
        return None

    return {
        "description": str(data.get("description") or text).strip(),
        "amount": amount,
        "category": category.strip(),
        "type": tx_type.strip().upper(),
        "confidence": confidence,
    }


def scan_receipt(filename: str, content: bytes, content_type: str = "image/jpeg") -> dict | None:
    """Send a receipt image to the AI engine's OCR endpoint.

    Returns a normalised dict (``merchant``, ``date``, ``total_amount``,
    ``confidence``, ``items``, ``category``) or ``None`` on any failure.
    """
    base = engine_url()
    if not base or not content:
        return None

    boundary = f"----budgetly{uuid.uuid4().hex}"
    head = (
        f"--{boundary}\r\n"
        f'Content-Disposition: form-data; name="file"; filename="{filename}"\r\n'
        f"Content-Type: {content_type}\r\n\r\n"
    ).encode("utf-8")
    body = head + content + f"\r\n--{boundary}--\r\n".encode("utf-8")

    request = urllib.request.Request(
        f"{base}/api/v1/ai/ocr-receipt",
        data=body,
        headers={"Content-Type": f"multipart/form-data; boundary={boundary}"},
        method="POST",
    )
    data = _read_envelope(request)
    if not data:
        return None

    total = _as_number(data.get("total_amount"))
    confidence = _as_number(data.get("confidence"))
    if total is None or confidence is None:
        logger.warning("AI engine OCR payload is missing a numeric field")
        return None

    items = data.get("items")
    return {
        "merchant": data.get("merchant"),
        "date": data.get("date"),
        "total_amount": total,
        "confidence": confidence,
        "items": [str(item) for item in items] if isinstance(items, list) else [],
        "category": data.get("category") or "Food & Dining",
    }
