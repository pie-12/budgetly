"""Tests for the system-administrator guard used by the ``/users`` endpoints.

The guard is the only thing standing between a regular student account and the
whole user table, so it is tested directly with plain ``User`` objects: no
database, no HTTP layer, no token.
"""

import unittest

from fastapi import HTTPException

from server.core.deps import ADMIN_EMAILS, get_current_admin_user
from server.models.user import User
from server.routers.users import determine_role


def make_user(email):
    """Build a detached ``User`` row; touching the DB is not needed here."""
    return User(email=email)


class AdminGuardTests(unittest.TestCase):
    def test_every_configured_admin_email_is_accepted(self):
        for email in ADMIN_EMAILS:
            user = make_user(email)
            self.assertIs(get_current_admin_user(user), user)

    def test_admin_match_ignores_case_and_surrounding_spaces(self):
        user = make_user("  ADMIN@budgetly.app ")
        self.assertIs(get_current_admin_user(user), user)

    def test_regular_user_is_forbidden(self):
        user = make_user("student@vku.udn.vn")
        with self.assertRaises(HTTPException) as ctx:
            get_current_admin_user(user)
        self.assertEqual(ctx.exception.status_code, 403)

    def test_missing_email_is_forbidden(self):
        user = make_user(None)
        with self.assertRaises(HTTPException) as ctx:
            get_current_admin_user(user)
        self.assertEqual(ctx.exception.status_code, 403)

    def test_lookalike_domain_is_forbidden(self):
        # Guards against a substring/prefix check being introduced later.
        user = make_user("admin@budgetly.app.evil.example")
        with self.assertRaises(HTTPException):
            get_current_admin_user(user)


class DetermineRoleTests(unittest.TestCase):
    def test_super_admin_mapping(self):
        self.assertEqual(determine_role("admin@budgetly.app"), "Super Admin")

    def test_admin_mapping(self):
        self.assertEqual(determine_role("demo@budgetly.app"), "Admin")

    def test_regular_user_mapping(self):
        self.assertEqual(determine_role("someone@example.com"), "Free User")

    def test_mapping_is_case_insensitive(self):
        self.assertEqual(determine_role("  ADMIN@Budgetly.App  "), "Super Admin")

    def test_admin_emails_are_all_mapped_to_a_privileged_role(self):
        for email in ADMIN_EMAILS:
            self.assertNotEqual(determine_role(email), "Free User", msg=email)


if __name__ == "__main__":
    unittest.main()
