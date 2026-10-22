"""Unit tests for the Smart Input amount parser and intent classifier.

Run from the repository root:

    python -m unittest discover -s server/tests -t .
"""

import unittest
from decimal import Decimal

from server.routers.ai import classify_intent_english, parse_currency_amount


class ParseCurrencyAmountTests(unittest.TestCase):
    """VND is written with '.' as the thousands separator and ',' or '.' as the decimal one."""

    def test_vietnamese_thousands_separators(self):
        self.assertEqual(parse_currency_amount("an pho 50.000"), Decimal("50000"))
        self.assertEqual(parse_currency_amount("tra sua 1.500.000"), Decimal("1500000"))
        self.assertEqual(parse_currency_amount("cafe 35.000d"), Decimal("35000"))

    def test_plain_digits(self):
        self.assertEqual(parse_currency_amount("50000"), Decimal("50000"))
        self.assertEqual(parse_currency_amount("45"), Decimal("45"))

    def test_comma_grouping(self):
        self.assertEqual(parse_currency_amount("45,000"), Decimal("45000"))

    def test_mixed_groupings(self):
        self.assertEqual(parse_currency_amount("1,234,567.89"), Decimal("1234567.89"))
        self.assertEqual(parse_currency_amount("1.234.567,89"), Decimal("1234567.89"))

    def test_magnitude_suffixes(self):
        self.assertEqual(parse_currency_amount("45k"), Decimal("45000"))
        self.assertEqual(parse_currency_amount("15tr"), Decimal("15000000"))
        self.assertEqual(parse_currency_amount("15m"), Decimal("15000000"))
        self.assertEqual(parse_currency_amount("12,5tr"), Decimal("12500000"))
        self.assertEqual(parse_currency_amount("1.5m"), Decimal("1500000"))
        self.assertEqual(parse_currency_amount("45 nghìn"), Decimal("45000"))
        self.assertEqual(parse_currency_amount("45 nghin"), Decimal("45000"))
        self.assertEqual(parse_currency_amount("15 trieu"), Decimal("15000000"))
        self.assertEqual(parse_currency_amount("45 thousand"), Decimal("45000"))
        self.assertEqual(parse_currency_amount("15 million"), Decimal("15000000"))

    def test_suffix_must_be_standalone(self):
        # "15m2" is an area, not 15 million VND.
        self.assertEqual(parse_currency_amount("nha 15m2"), Decimal("15"))

    def test_decimal_amounts(self):
        self.assertEqual(parse_currency_amount("$5.50"), Decimal("5.5"))
        self.assertEqual(parse_currency_amount("12,5"), Decimal("12.5"))

    def test_currency_symbol_is_ignored(self):
        self.assertEqual(parse_currency_amount("$45"), Decimal("45"))

    def test_default_when_no_number(self):
        self.assertEqual(parse_currency_amount("no amount here"), Decimal("50000"))

    def test_returns_decimal_not_float(self):
        self.assertIsInstance(parse_currency_amount("45k"), Decimal)


class ClassifyIntentTests(unittest.TestCase):
    def test_income_keywords(self):
        category, tx_type, confidence = classify_intent_english("received my salary today")
        self.assertEqual(category, "Salary & Income")
        self.assertEqual(tx_type, "INCOME")
        self.assertGreater(confidence, 0.9)

    def test_english_expense_keywords(self):
        self.assertEqual(classify_intent_english("lunch with the team")[:2], ("Food & Dining", "EXPENSE"))
        self.assertEqual(classify_intent_english("uber to the airport")[:2], ("Transportation", "EXPENSE"))
        self.assertEqual(classify_intent_english("shopee order")[:2], ("Shopping", "EXPENSE"))
        self.assertEqual(classify_intent_english("netflix game night")[:2], ("Entertainment", "EXPENSE"))
        self.assertEqual(classify_intent_english("electricity bill")[:2], ("Utilities", "EXPENSE"))

    def test_vietnamese_expense_keywords(self):
        self.assertEqual(classify_intent_english("ăn phở 50.000")[:2], ("Food & Dining", "EXPENSE"))
        self.assertEqual(classify_intent_english("đổ xăng 70.000")[:2], ("Transportation", "EXPENSE"))
        self.assertEqual(classify_intent_english("tiền điện tháng này")[:2], ("Utilities", "EXPENSE"))

    def test_unknown_text_falls_back_to_miscellaneous(self):
        category, tx_type, confidence = classify_intent_english("something unusual")
        self.assertEqual(category, "Miscellaneous")
        self.assertEqual(tx_type, "EXPENSE")
        self.assertLess(confidence, 0.8)


if __name__ == "__main__":
    unittest.main()
