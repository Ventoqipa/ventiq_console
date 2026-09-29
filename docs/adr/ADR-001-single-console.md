# ADR-001: Console Is Internal Administration Only

- Status: Accepted

## Context

Ventiq has different user experiences with different responsibilities: internal Ventoqipa administration and a customer-facing B2B Dashboard.

## Decision

`ventiq_console` contains only the internal Ventoqipa administration experience. The B2B customer Dashboard is a separate project and repository. Both will consume the unified Ventiq API.

## Consequences

- Clear product responsibility and deployment boundary.
- Internal administration cannot accidentally grow into the customer product.
- Console scope stays focused on customer onboarding and account administration.
- Shared behavior must live behind Ventiq API contracts rather than frontend coupling.
