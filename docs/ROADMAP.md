# Implementation roadmap

Build original, configurable roleplay resources on ArcaneMP with a reference school server. Public feature descriptions are research references, not code or asset licences. Reuse suitable public mods before building replacements.

1. Establish an isolated private test server; record ArcaneMP, Foundations, game and mod versions; resolve dependency distribution terms.
2. Audit mods with two clients. Prioritize SpellSetEX grant/revoke enforcement, custom spells, travel maps, fm-scenes and brewing assets. Loading is not compatibility.
3. Add typed adapters for existing identity, permissions, inventory, banking and persistence services. Validate requests server-side; test replay and isolation.
4. Deliver character selection, original sorting questions, school years, professor permissions, attendance and one persisted lesson spell grant.
5. Enforce spell prerequisites, wand possession, grant/revoke and disarm across supported normal/extra slots. Exclude unsupported routes from the certified reference profile.
6. Build role-based dashboards, timetable, audited house points, meals, gates and administrative tools.
7. Integrate inventory, drops, vaults, shops, supplier/banker roles and owner-bound property storage. Test atomicity under concurrent requests.
8. Add brewing, herbology, cooking, wand and broom crafting. Persist production jobs and grant output once; later add twin-core behavior.
9. Integrate Floo, approved maps, doors and safe reconnect/return paths. Verify world and distance checks.
10. Add letters/owls, emotes, voice integration, hunger, stamina, illness and configured death/revival behavior.
11. Add careers, wanted records, custody, cursed objects, advanced magic, team activities and supported Quidditch integration.
12. Release reproducible core/extended profiles with migrations, compatibility matrix, contributor documentation and tested backup/restore procedures.

## Acceptance gates

Prototype: sorting -> lesson -> spell grant -> reconnect persistence.

Private alpha: enforced progression plus school UI, inventory, banking and shops.

RP alpha: crafting, property, travel, communication and daily-life systems.

Beta: careers, justice, advanced magic and activities with documented limitations.

Public gameplay release: independent clean installation, current security checks, dependency licence review, tested migrations and rollback. Publishing this planning repository is not a claim of gameplay readiness.

All milestones require focused automated tests and relevant two-client checks including disconnect, character switch, restart, permission denial and duplicate requests. Do not replace absent runtime evidence with mocked success. No production secrets or copied third-party binaries belong in this repository.
