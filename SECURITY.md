# Security policy

This project is pre-alpha and has no supported gameplay release yet. Do not deploy it on a public server until a release explicitly documents its tested security and compatibility baseline.

Report vulnerabilities using this repository's Security > Report a vulnerability feature. Do not post exploits, credentials or player information in public issues. Maintainers will coordinate fixes and disclosure privately; no response-time guarantee is currently offered.

## Engineering requirements

- Treat clients as untrusted. Resolve identity and character ownership server-side; validate permission, input, distance and world for privileged actions.
- Keep money, inventory and progression authoritative on the server. Use transactions, idempotency and bounded retries; test concurrency and replay.
- Parameterize SQL. Validate file paths and URLs. Escape rendered player text; never render untrusted HTML or execute player-supplied code.
- Store credentials outside the repository and client bundles. Use least-privilege database users and avoid secrets in logs.
- Test disconnects, character switches, revocations and resource restarts. Client cast reports do not prove authoritative spell enforcement.
- Use hosted ephemeral CI runners for untrusted PRs. Never expose production credentials or private network access to fork workflows.
- Pin actions to full commit hashes, use read-only workflow permissions and disable persisted checkout credentials. Do not use pull_request_target to execute PR code.
- Review dependency provenance, licence and compatibility; commit lockfiles when dependencies are introduced.
- Back up and test restoration before migrations. No live deployments from ordinary pull requests.

Repository scanning is defense in depth, not proof that code is secure. Add language-specific analysis, dependency auditing and meaningful gameplay tests when implementation begins.
