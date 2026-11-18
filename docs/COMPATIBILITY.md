# Compatibility baseline

Status: inspected contracts, not a certified multiplayer release. No live server was changed during this implementation.

## Inspected reference

ArcaneMP 1.14.0 and Foundations 0.12.0 are the reference installation recorded during project discovery. The exact current game build and full client mod versions still need recording for a reproducible gameplay matrix. The school library has no runtime SDK dependency.

| Service | Contract inspected | Consequence |
|---|---|---|
| hmp-core | sessions.get exposes account, active character and principal trust; groups.has returns a promise | Resolve context on the server and recheck after awaits |
| hmp-core identity | Default Steam/Discord/hardware identities have asserted trust | Staff operations must require a verified identity provider; client claims are insufficient |
| hmp-core metadata | Character-scoped get/set; no documented compare-and-swap | Do not assume atomic school progress plus external spell grants |
| hmp-houses | membership.set; audited and idempotent same-house assignment | Reuse for final native membership, rather than maintaining competing house authority |
| hmp-spells | grants.grant/revoke; policy lock lists; providers; four-slot assignments | School policy must integrate with enforcement and reconcile configured baseline grants |
| hmp-spells | Cast events are advisory | Do not issue valuable rewards from unverified cast reports |

Local README and type declarations were inspected; no upstream source was copied into this project. Upstream licence review is still required before redistribution. Dependency versions need explicit revalidation when upgraded.

## Mod integration queue

| Candidate | Intended reuse | Gate |
|---|---|---|
| SpellSetEX | Extra slots and interface | Verify native and custom grant/revoke through extra casting paths |
| Spells Enhanced | Spell content | Test manual-unlock UI against school policy and avoid conflicting progression |
| MH Sorting Hat | Hat visual | Not a sorting implementation; test shared appearance |
| Diagon Alley London, Godric's Hollow, expanded RoR | RP spaces | Two-client travel, collision, reconnect and safe exit |
| Ministry of Magic, Azkaban Prison Dungeon | Optional locations | Same world checks; independent access and custody logic |
| PotionsHRP | Brewing visuals | Assets alone provide no recipe or persistence logic |
| fm-scenes | Letters, parchment and scene descriptions | Licence, dependency/version compatibility and ownership tests |
| Wizarding Academy Requirements | Research reference only | Author describes dependency on its private full framework; not a core dependency here |

No entry above is certified. References: [ArcaneMP docs](https://docs.arcane.mp/), [SpellSetEX](https://www.curseforge.com/hogwarts-legacy/mods/spellsetex), [Spells Enhanced](https://www.curseforge.com/hogwarts-legacy/mods/spells-enhanced-new-spells), [fm-scenes](https://github.com/FMKasoma/fm-scenes).

## Runtime acceptance checklist

- Record exact game/runtime/resource/mod versions and checksums without publishing credentials or private content.
- Use two clients and an isolated database/configuration.
- Test fresh student, grant, revoke, reconnect, resource restart and character switch.
- Test normal slots, extra slots, custom spells and every exposed unlock menu.
- Test unverified staff identity, permission revocation, replay and concurrent requests.
- Define mutation serialization and recoverable entitlement reconciliation before exposing staff operations.
- Prove progress persistence and grant recovery before calling the school flow playable.

Current automated tests validate domain rules and session snapshots only. They do not prove game authentication, storage durability or native casting behavior.
