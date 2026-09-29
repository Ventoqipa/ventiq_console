# Contributing

## Workflow

1. Start from an approved backlog item.
2. Create a focused branch.
3. Identify the responsible Clean Architecture layer before coding.
4. Deliver the smallest coherent vertical change.
5. Add/update tests and documentation.
6. Run `npm run lint`, `npm run typecheck`, `npm run test`, and `npm run build`.
7. Open a PR and explain decisions and trade-offs.

## Branch examples

- `feature/admin-customer-list`
- `feature/admin-create-customer`
- `fix/customer-form-validation`
- `docs/api-key-flow`

## Engineering expectations

Do not put product rules in pages/components. Do not call external APIs directly from UI components. Do not commit credentials. Avoid speculative abstractions. Use AI as an implementation/research aid only when you can validate and explain the result.
