# ADR-002: Clean Architecture Direction

- Status: Accepted

## Decision

Use Domain, Application, Infrastructure, and Presentation boundaries. Dependencies point toward Domain/Application abstractions.

## Why

The Console will evolve across Admin, B2B, API integrations, and multiple product capabilities. Clear boundaries reduce coupling to React and transport details while keeping business behavior testable.

## Guardrail

Clean Architecture is a decision framework, not a folder-count objective. Avoid pass-through layers and speculative abstractions.
