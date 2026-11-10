"""Tests for the AI engine client used by the Core API.

The engine is an external process, so everything is exercised through a stubbed
``urlopen``: the point of these tests is the failure behaviour, because a dead
AI microservice must degrade to the local heuristics instead of failing the
financial API.
"""

import json
import os
import unittest
from unittest import mock

from server.services import ai_engine

ENGINE = "http://ai-engine.test:8001"


class _FakeResponse:
    """Minimal stand-in for ``http.client.HTTPResponse``."""

    def __init__(self, payload):
        self._payload = json.dumps(payload).encode("utf-8")

    def read(self):
        return self._payload

    def __enter__(self):
        return self

    def __exit__(self, *exc_info):
        return False


def _patch_urlopen(response=None, error=None):
    """Patch ``urlopen`` in the AI engine module and capture the outgoing request."""
    calls = []

    def fake_urlopen(request, timeout=None):
        calls.append((request, timeout))
        if error is not None:
            raise error
        return response

    patcher = mock.patch.object(ai_engine.urllib.request, "urlopen", side_effect=fake_urlopen)
    return patcher, calls


class EngineConfigurationTests(unittest.TestCase):
    def test_disabled_when_env_is_missing(self):
        with mock.patch.dict(os.environ, {}, clear=True):
            self.assertFalse(ai_engine.is_enabled())
            self.assertIsNone(ai_engine.engine_url())
            self.assertIsNone(ai_engine.categorize("ăn phở 45k"))

    def test_url_is_normalised(self):
        with mock.patch.dict(os.environ, {"AI_ENGINE_URL": "  http://ai-engine.test:8001/  "}):
            self.assertTrue(ai_engine.is_enabled())
            self.assertEqual(ai_engine.engine_url(), ENGINE)

    def test_timeout_falls_back_to_default_on_garbage(self):
        with mock.patch.dict(os.environ, {"AI_ENGINE_TIMEOUT_SECONDS": "not-a-number"}):
            self.assertEqual(ai_engine._timeout(), ai_engine.DEFAULT_TIMEOUT_SECONDS)

    def test_timeout_is_configurable(self):
        with mock.patch.dict(os.environ, {"AI_ENGINE_TIMEOUT_SECONDS": "0.25"}):
            self.assertEqual(ai_engine._timeout(), 0.25)


class CategorizeTests(unittest.TestCase):
    def test_successful_parse_is_normalised(self):
        payload = {
            "success": True,
            "data": {
                "description": "ăn phở trưa 45k",
                "amount": 45000.0,
                "category": "Food & Dining",
                "type": "expense",
                "confidence": 0.93,
            },
        }
        patcher, calls = _patch_urlopen(_FakeResponse(payload))
        with mock.patch.dict(os.environ, {"AI_ENGINE_URL": ENGINE}), patcher:
            result = ai_engine.categorize("ăn phở trưa 45k")

        self.assertEqual(result["amount"], 45000.0)
        self.assertEqual(result["category"], "Food & Dining")
        self.assertEqual(result["type"], "EXPENSE")
        self.assertEqual(result["confidence"], 0.93)
        self.assertEqual(len(calls), 1)

        request, timeout = calls[0]
        self.assertTrue(request.full_url.endswith("/api/v1/ai/categorize"))
        self.assertEqual(json.loads(request.data.decode()), {"description": "ăn phở trưa 45k"})
        self.assertEqual(timeout, ai_engine.DEFAULT_TIMEOUT_SECONDS)

    def test_unreachable_engine_returns_none(self):
        patcher, _ = _patch_urlopen(error=OSError("connection refused"))
        with mock.patch.dict(os.environ, {"AI_ENGINE_URL": ENGINE}), patcher:
            self.assertIsNone(ai_engine.categorize("ăn phở 45k"))

    def test_unsuccessful_envelope_returns_none(self):
        patcher, _ = _patch_urlopen(_FakeResponse({"success": False, "message": "boom"}))
        with mock.patch.dict(os.environ, {"AI_ENGINE_URL": ENGINE}), patcher:
            self.assertIsNone(ai_engine.categorize("ăn phở 45k"))

    def test_payload_without_amount_is_rejected(self):
        payload = {"success": True, "data": {"category": "Food & Dining", "type": "EXPENSE", "confidence": 0.9}}
        patcher, _ = _patch_urlopen(_FakeResponse(payload))
        with mock.patch.dict(os.environ, {"AI_ENGINE_URL": ENGINE}), patcher:
            self.assertIsNone(ai_engine.categorize("ăn phở 45k"))

    def test_payload_with_bad_transaction_type_is_rejected(self):
        payload = {
            "success": True,
            "data": {"amount": 45000, "category": "Food & Dining", "type": "TRANSFER", "confidence": 0.9},
        }
        patcher, _ = _patch_urlopen(_FakeResponse(payload))
        with mock.patch.dict(os.environ, {"AI_ENGINE_URL": ENGINE}), patcher:
            self.assertIsNone(ai_engine.categorize("ăn phở 45k"))

    def test_boolean_amount_is_rejected(self):
        payload = {
            "success": True,
            "data": {"amount": True, "category": "Food & Dining", "type": "EXPENSE", "confidence": 0.9},
        }
        patcher, _ = _patch_urlopen(_FakeResponse(payload))
        with mock.patch.dict(os.environ, {"AI_ENGINE_URL": ENGINE}), patcher:
            self.assertIsNone(ai_engine.categorize("ăn phở 45k"))


class ScanReceiptTests(unittest.TestCase):
    def test_image_is_sent_as_multipart_and_parsed(self):
        payload = {
            "success": True,
            "data": {
                "merchant": "WINMART",
                "date": "2026-11-10",
                "total_amount": 185000.0,
                "confidence": 0.94,
                "category": "Food & Dining",
                "items": ["Milk 1L", "Bread"],
            },
        }
        patcher, calls = _patch_urlopen(_FakeResponse(payload))
        with mock.patch.dict(os.environ, {"AI_ENGINE_URL": ENGINE}), patcher:
            result = ai_engine.scan_receipt("receipt.jpg", b"\xff\xd8fake-jpeg", "image/jpeg")

        self.assertEqual(result["merchant"], "WINMART")
        self.assertEqual(result["total_amount"], 185000.0)
        self.assertEqual(result["items"], ["Milk 1L", "Bread"])

        request, _ = calls[0]
        self.assertTrue(request.full_url.endswith("/api/v1/ai/ocr-receipt"))
        self.assertIn(b'name="file"; filename="receipt.jpg"', request.data)
        self.assertIn(b"\xff\xd8fake-jpeg", request.data)
        self.assertIn(b"multipart/form-data; boundary=", request.headers["Content-type"].encode())

    def test_empty_upload_is_not_sent(self):
        with mock.patch.dict(os.environ, {"AI_ENGINE_URL": ENGINE}):
            self.assertIsNone(ai_engine.scan_receipt("receipt.jpg", b""))

    def test_disabled_engine_returns_none(self):
        with mock.patch.dict(os.environ, {}, clear=True):
            self.assertIsNone(ai_engine.scan_receipt("receipt.jpg", b"\xff\xd8fake-jpeg"))


if __name__ == "__main__":
    unittest.main()
