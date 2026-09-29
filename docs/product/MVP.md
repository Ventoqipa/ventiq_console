# Ventiq Console MVP

## Objective

Provide Ventoqipa with the minimum internal tooling required to onboard and administer B2B customers.

## MVP scope

- Internal admin login boundary
- Console shell
- Customer list
- Create customer
- Customer detail
- Create initial client administrator
- Activate customer
- Suspend customer
- Basic status/error handling

## Out of scope

The following belong to other Ventiq projects and must not be implemented here:

- Customer B2B Dashboard
- Customer project management
- Platforms
- SDK API key management
- Provider connections
- Placements
- Ads ON/OFF
- Advertising policies
- Events and telemetry
- Monitoring
- Reports and projections
- SDK implementation

## First demo

```
Internal Login
  -> Customers
  -> Create Customer
  -> Customer Detail
  -> Create Client Administrator
  -> Activate Customer
```

The demo ends when Ventoqipa has successfully provisioned a customer that is ready to continue in the separate Ventiq Dashboard.
