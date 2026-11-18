# Contributing

Use short-lived branches from current main: feat/<topic>, fix/<topic>, docs/<topic>, or chore/<topic>. Open a draft pull request early. Keep changes focused; link the relevant roadmap milestone. Main must remain releasable.

Before review, run `python scripts/check_repository.py` and all tests relevant to the change. Include validation evidence, compatibility impact and rollback steps. No gameplay code exists yet; repository checks are not gameplay tests.

Merging requires an independent approval, resolved conversations and passing required CI against an up-to-date branch. New commits dismiss stale approvals. Only squash merges are enabled. Never force-push main, bypass protections, merge your own unreviewed work, or publish secrets. Bring main into a working branch using an ordinary merge when needed; do not rewrite shared history.

The initial repository bootstrap is the only direct-main initialization. Subsequent changes use PRs. With one organization member, owner-authored PRs need a second trusted reviewer with write access; do not lower the review requirement to work around that.

Do not redistribute game binaries, proprietary packages, downloaded mods, website archives, player data or server configuration. MIT covers this repository's original code only; third-party dependencies retain their terms. Record dependency permissions and tested versions before inclusion.

Releases use semantic versions and a reviewed changelog. Pre-1.0 minor versions may break compatibility; document migrations. Create release tags only after tests and restore checks pass. No automatic live deployment. Publishing releases and production changes require maintainer authorization. Preserve branches unless their owner approves deletion.
