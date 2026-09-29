# Application layer

Application coordinates Ventiq use cases and declares the ports required to execute them.

Rules:
- It may depend on Domain.
- It must not depend on React, browser APIs, or concrete HTTP clients.
- Ports belong close to the use cases that require them.
- Do not add a use case merely to wrap a one-line function without a meaningful boundary.
