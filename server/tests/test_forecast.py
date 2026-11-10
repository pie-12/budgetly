"""Tests for the month-end spending projection used by ``/ai/forecast``.

The original implementation always divided by 30, which under-projected
February and over-projected 31-day months. These cases pin the calendar
behaviour down.
"""

import unittest
from datetime import datetime
from decimal import Decimal

from server.services.forecast import days_in_month, elapsed_days, project_month_end


class DaysInMonthTests(unittest.TestCase):
    def test_long_month(self):
        self.assertEqual(days_in_month(datetime(2026, 1, 15)), 31)
        self.assertEqual(days_in_month(datetime(2026, 12, 1)), 31)

    def test_short_month(self):
        self.assertEqual(days_in_month(datetime(2026, 2, 10)), 28)
        self.assertEqual(days_in_month(datetime(2026, 4, 10)), 30)

    def test_leap_year_february(self):
        self.assertEqual(days_in_month(datetime(2028, 2, 10)), 29)


class ElapsedDaysTests(unittest.TestCase):
    def test_first_day_is_one_not_zero(self):
        self.assertEqual(elapsed_days(datetime(2026, 11, 1)), 1)

    def test_later_day_is_used_as_is(self):
        self.assertEqual(elapsed_days(datetime(2026, 11, 10)), 10)


class ProjectMonthEndTests(unittest.TestCase):
    def test_projects_linear_pace_over_a_31_day_month(self):
        # 1,000,000 spent in 10 days -> 3,100,000 over 31 days.
        self.assertEqual(project_month_end(Decimal("1000000"), 10, 31), Decimal("3100000.00"))

    def test_february_uses_28_days_not_30(self):
        # The regression this test exists for: 30 would give 3,000,000.
        self.assertEqual(project_month_end(Decimal("1000000"), 10, 28), Decimal("2800000.00"))

    def test_no_spend_projects_zero(self):
        self.assertEqual(project_month_end(Decimal("0"), 10, 31), Decimal("0.00"))

    def test_elapsed_day_is_clamped_to_the_month_length(self):
        self.assertEqual(project_month_end(Decimal("3100000"), 40, 31), Decimal("3100000.00"))

    def test_elapsed_day_below_one_does_not_divide_by_zero(self):
        self.assertEqual(project_month_end(Decimal("50000"), 0, 30), Decimal("1500000.00"))

    def test_result_is_rounded_to_two_decimals(self):
        self.assertEqual(project_month_end(Decimal("100000"), 3, 31), Decimal("1033333.33"))

    def test_non_positive_month_length_is_rejected(self):
        with self.assertRaises(ValueError):
            project_month_end(Decimal("1000"), 1, 0)


if __name__ == "__main__":
    unittest.main()
