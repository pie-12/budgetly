# Changelog - Budgetly

All notable changes to this project will be documented in this file.

## [0.1.0] - 2026-09-22
### Added
- PostgreSQL database connection lifecycle and base session handlers.
- Core database schema models for users, wallets, transactions, and categories.

## [0.2.0] - 2026-09-25
### Added
- Architectural specifications and documentation alignment.
- English localization for developer guides.

## [0.3.0] - 2026-09-26
### Added
- English internationalization across UI components and navigation modals.
- Common responsive layouts and styles for client dashboard.

## [0.4.0] - 2026-09-28
### Added
- Pydantic validation schemas for transaction parsing.
- RESTful CRUD router endpoints for financial analytics.

## [0.5.0] - 2026-09-30
### Added
- Verified end-to-end API service connector layer.
- Finalized system integration and release readiness checklist.

## [0.6.0] - 2026-10-17
### Added
- JWT authentication across the API with per-user scoping for wallets, transactions, budgets and analytics.
- Database-aware `/api/v1/health` probe: reports the dialect actually serving the API (PostgreSQL or the local SQLite fallback) and answers `503` when the database is unreachable.
- Docker Compose healthcheck for the Core Backend service.

### Changed
- English localization completed for the remaining UI, authentication and NLP output strings.
- `SECRET_KEY` can now be overridden from the root `.env` file consumed by Docker Compose.
- The security layer honours `ALGORITHM` and `ACCESS_TOKEN_EXPIRE_DAYS`; `ACCESS_TOKEN_EXPIRE_MINUTES` is still accepted as a legacy alias.

## [0.6.1] - 2026-10-22
### Fixed
- Smart Input amount parsing misread the most common VND formats: `50000` became `500`, `50.000` became `50` and `1.500.000` silently fell back to the `50000` default. Thousands groups, decimal amounts (`$5.50`) and both separator styles are now handled.
- The `ăn` keyword no longer matches inside other words, so `đổ xăng` (gasoline) is classified as Transportation instead of Food & Dining.
- Magnitude suffixes only match standalone units, so `15m2` is no longer read as 15 million VND.

### Added
- Backend unit tests for the Smart Input amount parser and intent classifier (`server/tests`), executed by `scripts/check.ps1`.
