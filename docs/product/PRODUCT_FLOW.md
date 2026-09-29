# Product Flow

## Actors

- **Ventoqipa Admin**: creates and manages customer accounts.
- **Client Admin**: manages the customer's projects, SDK API keys, advertising configuration, monitoring, and reports.
- **Ventiq SDK**: embedded in a mobile or web project. Reads configuration and sends telemetry.
- **Ventiq API**: single platform API serving Admin, B2B Dashboard, and SDK consumers.

## End-to-end flow

```mermaid
sequenceDiagram
  actor VA as Ventoqipa Admin
  participant C as Ventiq Console
  participant API as Ventiq API
  actor CA as Client Admin
  participant SDK as Ventiq SDK
  participant APP as Mobile/Web App

  VA->>C: Create customer
  C->>API: Customer + initial client admin
  CA->>C: Sign in
  CA->>C: Create project/platform
  C->>API: Persist project
  CA->>C: Generate API key
  C->>API: Create/rotate/revoke SDK credential
  APP->>SDK: Initialize
  SDK->>API: Read remote configuration
  CA->>C: Enable/disable ads
  C->>API: Update configuration
  SDK->>API: Read current configuration
  SDK->>API: Send telemetry
  API-->>C: Metrics/events
  C-->>CA: Monitoring and reports
```

## Ownership

Ventoqipa creates the customer. The customer creates SDK credentials. The SDK never authenticates as a human user.
