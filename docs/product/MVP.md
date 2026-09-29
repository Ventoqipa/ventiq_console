# MVP Delivery Path

## Milestone 1 - Internal Admin

Deliver the first complete vertical slice:

- Login boundary
- Admin shell
- Customer list
- Create customer
- Customer detail
- Create initial client administrator
- Activate/suspend customer

Do not implement API behavior in the Console. Use application ports and infrastructure adapters once the API contract exists.

## Milestone 2 - B2B foundation

- Client login
- Project management
- Platform association
- API key generation, rotation, and revocation

## Milestone 3 - Advertising control

- Provider connection views
- Placements
- Policies
- Ads enabled/disabled
- Remote configuration visibility

## Milestone 4 - Monitoring

- REQUESTED
- LOADED
- IMPRESSION
- CLICKED
- FAILED
- SKIPPED
- KPIs and event explorer
- Basic trends

## Demo story

Ventoqipa creates a customer. The client creates a project and SDK key. A client application uses the SDK. The client enables ads, observes telemetry, then disables a placement without rebuilding the client. The SDK follows the remote configuration and reports SKIPPED. The Dashboard reflects the change.
