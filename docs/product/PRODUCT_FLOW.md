# Ventiq Console Product Flow

## Actor

**Ventoqipa Admin** is the only product actor for this repository.

The administrator onboards and manages Ventiq customers. Once a customer is provisioned, customer-facing operations continue in the separate Ventiq Dashboard.

## Console flow

```mermaid
sequenceDiagram
  actor VA as Ventoqipa Admin
  participant C as Ventiq Console
  participant API as Ventiq API

  VA->>C: Sign in
  C->>API: Authenticate internal user
  VA->>C: Create customer
  C->>API: Create customer account
  VA->>C: Create initial client administrator
  C->>API: Provision client administrator
  VA->>C: Activate customer
  C->>API: Update customer status
  API-->>C: Customer ready
```

## Platform handoff

```mermaid
flowchart LR
  Console[Ventiq Console] -->|provisions customer| API[Ventiq API]
  API -->|customer can access| Dashboard[Ventiq Dashboard]
  Dashboard -->|project + API key management| API
  SDK[Ventiq SDK] --> API
```

The handoff is platform context only. Dashboard and SDK behavior are outside this repository.
