# School core: first implementation slice

Original domain rules, independent of proprietary runtime packages. This slice is a library, not an installable game resource. It intentionally exposes no client RPC and performs no database writes or live spell grants.

## Contracts

School year is an integer 1-7, separate from game XP. New students have no house, completed lessons or lesson-granted spells. Sorting is one-time; reassignment will require a separate audited administrative operation later.

A curriculum contains stable lesson IDs, a minimum year, prerequisite lesson IDs, one spell per lesson, and a restricted flag. Compile configuration defensively: reject duplicates, duplicate spell acquisition routes, missing prerequisites, cycles and invalid values. Copy configuration so caller mutation cannot alter policy.

Completion requires a verified professor context. A restricted lesson additionally requires the restricted-magic capability. Sorting, prerequisites and year requirements are checked. Repeated completion is idempotent. State transitions are immutable and reject malformed or inconsistent persisted state. Advancing a year requires a nonempty server-configured list of completed lessons including a lesson for the current year; year seven cannot advance through this operation. Replaying the same advancement prerequisites cannot advance a second time.

Authorization is supplied only by a server adapter. The session guard reads a server-side session, rejects asserted identity, checks a configured capability, and rechecks the session after the asynchronous permission lookup. This detects disconnect/character-switch during lookup. It does not make downstream asynchronous writes transactional: runtime integration must revalidate at the mutation boundary and serialize character changes.

## Persistence and runtime integration gate

Inspected local Foundations 0.12.0 contracts: core sessions.get, groups.has, metadata.getCharacter/setCharacter; houses.membership.set; spells.grants.grant/revoke. Default core identities are asserted. Do not grant staff powers using client identifier claims. An upstream verified provider or a separately reviewed authentication integration is required before staff RPC exposure.

Metadata writes do not document compare-and-swap. Do not claim atomic progression plus spell grants across two service calls. Next slice must define transaction/outbox recovery, authoritative state reload and character-lifecycle coordination before live deployment. The domain spell list is desired entitlement state, not proof that a client can or cannot cast.

## Validation

Node's test runner exercises school progression, invalid configuration/state, replay, immutability, restricted lessons and session changes. Strict TypeScript compilation checks the adapter contract. CI runs Node 22 and 24. Actual spell enforcement, persistence, UI and two-client behavior remain unverified.
