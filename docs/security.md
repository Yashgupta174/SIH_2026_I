# MediKiosk Security & Data Protection Specification

## Security Measures Implemented
1. **Helmet & CORS Security Headers**: Configured Express helmet protection against XSS, clickjacking, and mime sniffing.
2. **Rate Limiting**: Enforced API rate limits (300 requests per 15 mins) to prevent brute-force attacks.
3. **JWT Authentication & Password Hashing**: Passwords stored using `bcrypt` (10 rounds salt). Standardized Bearer token verification.
4. **Backend Role Authorization (RBAC)**: All protected routes verify user role permissions prior to controller invocation.
5. **Immutable Security Audit Log**: All patient data views, summary approvals, and consent grants write to `AuditLog`.
