# Contributing

Use short-lived branches from current main: feat/<topic>, fix/<topic>, docs/<topic>, or chore/<topic>. Open a draft pull request early. Keep changes focused; link the relevant roadmap milestone. Main must remain releasable.

Before review, run `python scripts/check_repository.py` and all tests relevant to the change. Include validation evidence, compatibility impact and rollback steps. For TypeScript changes, run `npm ci --ignore-scripts`, `npm test` and `npm audit --audit-level=moderate`. The school library has unit tests; native multiplayer validation is still pending.

Merging requires resolved conversations and passing required CI against an up-to-date branch. In the current solo-maintainer configuration, independent approval is not required: the maintainer reviews the diff and validation evidence before merging their own PR. New commits dismiss any stale approvals. Only squash merges are enabled. Never force-push main, bypass protections, or publish secrets. Bring main into a working branch using an ordinary merge when needed; do not rewrite shared history.

The initial repository bootstrap is the only direct-main initialization. Subsequent changes use PRs. When a second trusted maintainer joins, enable one independent approval and approval of the latest push. CODEOWNERS routes review requests but does not currently enforce a second reviewer. CI and the PR requirement remain mandatory for administrators too.

Do not redistribute game binaries, proprietary packages, downloaded mods, website archives, player data or server configuration. MIT covers this repository's original code only; third-party dependencies retain their terms. Record dependency permissions and tested versions before inclusion.

Releases use semantic versions and a reviewed changelog. Pre-1.0 minor versions may break compatibility; document migrations. Create release tags only after tests and restore checks pass. No automatic live deployment. Publishing releases and production changes require maintainer authorization. Preserve branches unless their owner approves deletion.
