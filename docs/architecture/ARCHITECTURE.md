# Ventiq Console Architecture

## Responsibility

Ventiq Console is the **internal Ventoqipa administration application**. It is not the B2B customer Dashboard and it does not contain SDK or advertising-management features.

```mermaid
flowchart LR
  Admin[Ventoqipa Admin] --> Console[Ventiq Console]
  Console --> API[Ventiq API]
  API --> Data[(Platform Data)]
  Dashboard[Ventiq Dashboard] --> API
  SDK[Ventiq SDK] --> API
```

The Dashboard and SDK are shown only as platform context. They are separate projects.

## Console scope

```mermaid
flowchart TB
  Console[Ventiq Console] --> Auth[Internal authentication]
  Console --> Customers[Customers]
  Customers --> Create[Create customer]
  Customers --> Detail[Customer detail]
  Customers --> Status[Activate / Suspend]
  Customers --> Users[Initial client administrators]
```

## Dependency rule

```mermaid
flowchart LR
  Presentation --> Application
  Infrastructure --> Application
  Application --> Domain
  Application --> Ports[Application Ports]
  Infrastructure -.implements.-> Ports
```

### Domain
Internal administration concepts and business rules. No React, HTTP, browser, or vendor dependencies.

### Application
Admin use cases and required ports.

### Infrastructure
Concrete Ventiq API clients and browser adapters.

### Presentation
Internal routes, pages, layouts, components, and view state.

## Architectural constraints

- Do not place business rules in React components.
- Do not call external APIs directly from pages/components.
- Do not expose backend secrets.
- API authorization is authoritative; route guards are UX boundaries only.
- Do not add B2B Dashboard features to this repository.
- Do not add SDK code to this repository.
- Prefer vertical delivery over speculative structure.
