# School Core Implementation Plan

Goal: a tested original school policy library and fail-closed session guard, without guessing runtime persistence semantics.

Architecture: immutable domain transitions and an injected session/permission reader; no runtime SDK dependency. Tech stack: strict TypeScript, Node 22+, Node test runner. Spec: school-core-design.md.

- [ ] Write tests for first lesson flow, prerequisites, restricted magic, replay, invalid data and async session change. Observe failure before implementation.
- [ ] Implement src/school.ts: compileCurriculum, createStudent, sortStudent, completeLesson, advanceYear. Own records only; no borrowed source.
- [ ] Implement src/session-guard.ts: authorizeSession with verified identity and session generation checks.
- [ ] Verify strict compilation, tests, dependency audit and repository guard; run both supported CI Node versions.
- [ ] Document compatibility limits and update README status. Open a focused PR; do not merge or deploy automatically.

Review focus: forged staff context at the future RPC boundary; stale sessions during awaits; replay; corrupt stored state; unsafe config changes. This slice tests the local cases and explicitly leaves runtime enforcement/persistence for integration work.
