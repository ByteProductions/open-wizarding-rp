# Open Wizarding RP

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Repository checks](https://github.com/ByteProductions/open-wizarding-rp/actions/workflows/repository-checks.yml/badge.svg?branch=main)](https://github.com/ByteProductions/open-wizarding-rp/actions/workflows/repository-checks.yml)

An open-source, modular roleplay framework being developed for **ArcaneMP and Hogwarts Legacy**, maintained by **ByteProductions**.

The goal is to give server owners an understandable, configurable foundation for school life, learned magic, careers, crafting and a persistent economy. Our original framework will be shared under the **MIT License**, with documentation and a reference school-server configuration that others can adapt.

> **Current status: planning and repository bootstrap.** This repository contains the roadmap, contribution policies and repository checks. It does not yet contain a playable framework, game-server installer, implemented gameplay modules or a supported deployment release.

## Contents

- [Purpose](#purpose)
- [Current implementation status](#current-implementation-status)
- [Planned gameplay](#planned-gameplay)
- [Architecture](#architecture)
- [Mods and compatibility](#mods-and-compatibility)
- [Milestones](#milestones)
- [Getting started](#getting-started)
- [Security and validation](#security-and-validation)
- [Branching, reviews and releases](#branching-reviews-and-releases)
- [Contributing and support](#contributing-and-support)
- [License and third-party content](#license-and-third-party-content)

## Purpose

Server owners should be able to inspect the rules their server runs, change their curriculum and economy, and contribute improvements that other communities can use.

The project will provide independently configurable RP resources and an example school server. A small private group should be able to use the core progression system, while a larger community can choose additional careers, survival mechanics or crafting systems.

We will reuse suitable platform services and public mods where their interfaces, behavior and terms support the intended use. New work will focus on missing gameplay rules and integration. Public RP experiences inform feature research; this project does not include Wizarding Academy's private framework or claim compatibility with its backend.

## Current implementation status

| Area | Status |
|---|---|
| Public source repository and MIT licence | Available |
| Contribution and security policies | Available |
| Repository-content CI checks | Available; these are not gameplay tests |
| Feature roadmap | Documented |
| Mod compatibility matrix | Planned; no certified mod profile published |
| School progression and spell enforcement | Planned |
| Economy, crafting and world integrations | Planned |
| Multiplayer acceptance tests and installation packages | Planned |

There is no supported runtime version matrix yet. Before a gameplay release, the exact ArcaneMP, Foundations, game and mod versions will be recorded and tested together.

## Planned gameplay

Everything in this section is a development target, not a claim of working functionality.

| System | Intended capabilities |
|---|---|
| Characters and sorting | Separate characters per account, appearance integration, original sorting questions and persistent house membership |
| School progression | School years separate from native game level, lessons, attendance, prerequisites and professor-approved advancement |
| Magic | Learned spells, grant/revoke controls, wand requirements, disarming and tested support for additional spell slots |
| School administration | Role-based dashboards, timetable, audited house points, flying permission, meals and gate controls |
| Inventory and economy | Item ownership, usable items, ground drops, vaults, transfers, NPC/player shops and supplier roles |
| Property | Property assignment, access rules and owner-authorized storage |
| Trades | Potion brewing, herbology, cooking, wand crafting and broom crafting with persistent production jobs |
| Travel and world | Configurable Floo connections, supported custom maps, doors and safe reconnect locations |
| Communication | Letters, parchment, owl delivery, RP text, emotes and proximity voice integration where supported |
| Daily life | Optional hunger, stamina, illness, treatment and configurable downed/death/revival rules |
| Careers and justice | Professors, Aurors, merchants, bankers, suppliers, estate agents, wanted records and custody |
| Advanced magic and activities | Cursed objects, counter-spells, wand history, Patronus identity, protective zones, team activities and supported Quidditch integration |

Features will be configurable rather than tied to one community's rules. Advanced mechanics depend on runtime support and compatibility tests; unsupported behavior will be documented or deferred.

### First playable milestone

```text
Create/select character
        -> complete sorting
        -> attend a lesson
        -> receive an authorized spell grant
        -> reconnect with progress preserved
```

An early requirement is proving that restricted spells stay restricted through every supported casting path. A locked menu icon alone is not sufficient evidence.

## Architecture

The planned implementation uses TypeScript resources with clear boundaries between gameplay rules, runtime adapters and client presentation. These components have not yet been implemented.

```text
Player interface and input
            |
            v
Server validation and permissions
            |
            v
RP modules: school / careers / crafting / world
            |
            v
Adapters to verified ArcaneMP / Foundations services
            |
            v
Persistent character, inventory and economy state
```

- **Server rules:** decide permissions, prerequisites, ownership and rewards.
- **Client presentation:** displays state and submits requests; it does not grant itself privileges.
- **Adapters:** isolate upstream API and mod-specific behavior from our gameplay modules.
- **Configuration:** defines curriculum, items, recipes, roles and locations without editing core rules.
- **Persistence:** reuses verified services for existing domains and introduces migrations for additional state only where necessary.

Foundations is the first integration target for identity, houses, inventory, banking, jobs, shops, spells and other existing services. Its APIs, compatibility and distribution terms must be checked before dependencies are adopted or packaged. MIT licensing of this repository does not resolve those separate terms.

## Mods and compatibility

We will evaluate existing mods before writing replacements. Candidate areas include appearance assets, sorting-hat visuals, expanded spell slots, custom spells, explorable locations, letters and brewing visuals.

Each candidate must have a recorded decision:

| Classification | Meaning |
|---|---|
| Supported | The documented version passed the relevant multiplayer checks |
| Needs an adapter | Useful functionality exists, but additional integration is necessary |
| Optional | Suitable for an optional profile without becoming a core requirement |
| Incompatible | Conflicts with required behavior or cannot meet the supported profile's guarantees |

Testing includes two-client visibility, world transitions, reconnects, character switching, permission denial and persistence. Spell mods also need grant/revoke tests through normal slots, extra slots and exposed unlock routes. Economy integrations need duplicate-request and concurrency tests.

We will not certify a mod simply because it loads. When a casting route cannot be controlled, it will remain outside the tested progression profile until a supported solution is available.

The planned installation profiles are:

- **Core:** minimal dependencies for characters, school progression and controlled magic.
- **Extended RP:** additional tested maps, crafting, economy and optional activities.

Neither profile is available as an installation package yet. Third-party mods should be obtained through their authorized distribution channels, not copied into this repository.

## Milestones

| Milestone | Acceptance target |
|---|---|
| Compatibility baseline | Isolated test environment, recorded dependency versions and reproducible mod assessments |
| Prototype | Sorting, one lesson, one spell grant and reconnect persistence |
| Private alpha | Enforced progression, school dashboard, inventory, banking and shops |
| RP alpha | Crafting, property, travel, communication and daily-life systems |
| Feature beta | Careers, justice, advanced magic and tested activities |
| Public gameplay release | Independent clean installation, compatibility matrix, migrations, security checks and tested recovery procedures |

See the [implementation roadmap](docs/ROADMAP.md) for the ordered work. No release date is promised; milestones are complete only when their acceptance evidence exists.

## Getting started

### Explore or contribute to the repository

For the current documentation and repository checks, install Git and Python 3.8 or newer. No third-party Python packages are required.

```sh
git clone https://github.com/ByteProductions/open-wizarding-rp.git
cd open-wizarding-rp
python scripts/check_repository.py
```

On systems where Python 3 is named `python3`, use that command instead.

The check inspects Git-tracked files for prohibited artifacts, missing policy files, oversized files and unsafe workflow references. Newly created files must be staged for this check to inspect them. It is a limited repository guard, not a comprehensive secret scanner or a gameplay test suite.

### Host a server

There is no install-and-play release from this project yet. The eventual release instructions will document the supported runtime, required dependencies, configuration, database setup and migration sequence. Do not treat cloning this repository as installing an RP server.

For the underlying multiplayer platform, consult the [official ArcaneMP documentation](https://docs.arcane.mp/). Players must obtain their own legitimate copy of Hogwarts Legacy and required third-party dependencies.

### Repository layout

```text
.github/       CI workflow, dependency-update configuration and PR ownership/templates
docs/          Implementation roadmap
scripts/       Repository-content validation
CONTRIBUTING.md
LICENSE
README.md
SECURITY.md
```

Gameplay resource directories and runtime dependency manifests will be introduced with implementation, rather than documented as if they already exist.

## Security and validation

The [security policy](SECURITY.md) defines the engineering requirements. In particular:

- Resolve identity and permissions on the server; validate player-controlled inputs.
- Keep money, items and progression server-authoritative, with atomic operations and replay protection.
- Parameterize database queries and escape player text in interfaces.
- Keep credentials, player data, private server configurations and server-only code out of client packages and public source.
- Test permission revocation, reconnects, character switching, restarts and simultaneous requests.
- Back up data and prove restoration before deploying migrations.

GitHub secret scanning, push protection, vulnerability alerts and automated security updates are enabled for this repository. CI uses a commit-pinned checkout action, read-only permissions and non-persisted checkout credentials. External contributors' workflow runs require approval.

Language-specific analysis, dependency auditing and gameplay tests will be added with implementation. Existing CI success means the repository checks passed; it does not establish that an RP server is secure or playable.

Report security issues privately through [GitHub vulnerability reporting](https://github.com/ByteProductions/open-wizarding-rp/security/advisories/new). Do not include credentials or player information in public issues.

## Branching, reviews and releases

`main` is protected. Work happens on short-lived branches:

- `feat/<topic>` for functionality.
- `fix/<topic>` for corrections.
- `docs/<topic>` for documentation.
- `chore/<topic>` for maintenance.

Open a pull request with the problem, resulting behavior, validation and compatibility impact. Merging requires passing CI, an up-to-date branch and resolved review conversations. Only squash merges are enabled; force pushes and deletion of `main` are blocked.

The project currently uses **solo-maintainer review**: the maintainer reviews the diff and test evidence, then may merge their own PR. An independent approval is not required while there is only one maintainer. When another trusted maintainer joins, the documented policy calls for independent approval and review of the latest push. See [CONTRIBUTING.md](CONTRIBUTING.md).

Releases will use semantic versions, changelogs and explicit migration notes. Version tags are protected against updates and deletion. Merging a PR does not deploy to a live game server, and no automated production deployment is configured.

## Contributing and support

Useful contributions include reproducible mod compatibility reports, focused gameplay proposals, documentation improvements and tests for implemented behavior.

For compatibility reports, include game/runtime/mod versions, reproduction steps, expected and observed behavior, whether two clients were tested, and sanitized logs. Never attach passwords, tokens, private packages or player records.

- [Read the contribution guide](CONTRIBUTING.md)
- [Report a non-sensitive issue or propose a feature](https://github.com/ByteProductions/open-wizarding-rp/issues)
- [Review open pull requests](https://github.com/ByteProductions/open-wizarding-rp/pulls)
- [Read the roadmap](docs/ROADMAP.md)

## License and third-party content

**This project's original code and documentation are licensed under the [MIT License](LICENSE).** Copyright (c) 2026 ByteProductions.

MIT permits using, modifying and redistributing our licensed work, including commercially, provided the required copyright and permission notices are preserved. It provides no warranty. MIT does not require downstream modifications to remain open source; see [GitHub's MIT overview](https://choosealicense.com/licenses/mit/) and the full licence text.

The licence does **not** relicense ArcaneMP, Foundations, third-party mods, game files, trademarks or assets belonging to others. Their own terms continue to apply. Dependency inclusion and redistribution must be reviewed separately; public availability alone is not permission to redistribute.

This repository does not distribute Hogwarts Legacy game files or Wizarding Academy's private framework. It is an independent fan project, unaffiliated with Wizarding Academy, ArcaneMP, Warner Bros., Avalanche Software or other rights holders.
