# ADR-001: One Console for Admin and B2B

- Status: Accepted

## Context

Ventiq needs an internal Ventoqipa Admin and a customer-facing B2B Dashboard. Both are web experiences using the same platform API and shared design/application foundations.

## Decision

Host both experiences in `ventiq_console` while preserving explicit route, presentation, authorization, and product boundaries.

## Consequences

- Shared deployment and frontend foundations.
- Less duplicated infrastructure.
- Authorization and navigation must keep internal and customer capabilities clearly separated.
- A future split remains possible if operational needs justify it.
