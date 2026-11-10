"""Pure forecasting helpers for the ``/ai/forecast`` endpoint.

Kept free of FastAPI and SQLAlchemy so the projection maths can be unit tested
without a database or an authenticated user.
"""

from __future__ import annotations

import calendar
from datetime import datetime
from decimal import ROUND_HALF_UP, Decimal


def days_in_month(moment: datetime) -> int:
    """Number of days in the month ``moment`` belongs to (28-31)."""
    return calendar.monthrange(moment.year, moment.month)[1]


def elapsed_days(moment: datetime) -> int:
    """Day of month currently elapsed, floored at 1 so the divisor is never 0."""
    return max(moment.day, 1)


def project_month_end(spent_so_far, elapsed: int, total_days: int) -> Decimal:
    """Linearly project ``spent_so_far`` to the end of a ``total_days`` month.

    A linear pace is the honest baseline: it assumes the remaining days look
    like the elapsed ones. It is what the current UI communicates, and it keeps
    the endpoint explainable in the report.
    """
    if total_days <= 0:
        raise ValueError("total_days must be positive")

    spent = Decimal(str(spent_so_far or 0))
    elapsed = min(max(int(elapsed), 1), int(total_days))
    projected = (spent / Decimal(elapsed)) * Decimal(total_days)
    return projected.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
