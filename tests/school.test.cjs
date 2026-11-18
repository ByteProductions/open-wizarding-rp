const { test } = require('node:test');
const assert = require('node:assert/strict');
const { houses, compileCurriculum, createStudent, sortStudent, completeLesson, advanceYear } = require('../dist/school.js');
const professor = { verified: true, capabilities: ['school.teach'] };
const definitions = [
  { id: 'light', year: 1, prerequisites: [], spell: 'Lumos', restricted: false },
  { id: 'summoning', year: 2, prerequisites: ['light'], spell: 'Accio', restricted: false },
  { id: 'forbidden', year: 7, prerequisites: ['summoning'], spell: 'AvadaKedavra', restricted: true }
];
const curriculum = () => compileCurriculum(definitions);
const sorted = () => sortStudent(createStudent(12), 'ravenclaw');
test('fresh character learns only an authorized lesson, with replay-safe immutable state', () => {
  const original = sorted();
  const learned = completeLesson(original, 'light', professor, curriculum());
  assert.deepEqual(learned.spells, ['Lumos']);
  assert.deepEqual(learned.completedLessons, ['light']);
  assert.deepEqual(original.spells, []);
  assert.deepEqual(completeLesson(learned, 'light', professor, curriculum()), learned);
  assert.deepEqual(createStudent(13).spells, []);
});
test('unsorted, under-year, unknown and prerequisite-less lessons are denied', () => {
  assert.throws(() => completeLesson(createStudent(12), 'light', professor, curriculum()));
  assert.throws(() => completeLesson(sorted(), 'summoning', professor, curriculum()));
  assert.throws(() => completeLesson({...sorted(), year: 2}, 'summoning', professor, curriculum()));
  assert.throws(() => completeLesson(sorted(), 'unknown', professor, curriculum()));
});
test('asserted identity and absent professor capability cannot grant spells', () => {
  for (const actor of [{verified:false,capabilities:['school.teach']},{verified:true,capabilities:[]}]) {
    assert.throws(() => completeLesson(sorted(), 'light', actor, curriculum()));
  }
});
test('school-year advancement requires configured completed lessons, not native XP', () => {
  assert.throws(() => advanceYear(sorted(), ['light'], professor, curriculum()));
  assert.throws(() => advanceYear(sorted(), [], professor, curriculum()));
  const one = completeLesson(sorted(), 'light', professor, curriculum());
  const two = advanceYear(one, ['light'], professor, curriculum());
  assert.equal(two.year, 2);
  assert.throws(() => advanceYear(two, ['light'], professor, curriculum()));
  assert.deepEqual(completeLesson(two, 'summoning', professor, curriculum()).spells, ['Lumos','Accio']);
  assert.throws(() => advanceYear({...one,year:7}, ['light'], professor, curriculum()));
});
test('restricted magic requires additional capability even for a verified professor', () => {
  let state = completeLesson(sorted(), 'light', professor, curriculum());
  state = completeLesson({...state,year:7}, 'summoning', professor, curriculum());
  assert.throws(() => completeLesson(state, 'forbidden', professor, curriculum()));
  const privileged = {...professor,capabilities:['school.teach','school.teach.restricted']};
  assert.ok(completeLesson(state,'forbidden',privileged,curriculum()).spells.includes('AvadaKedavra'));
});
test('sorting cannot be repeated or use unknown houses', () => {
  assert.throws(() => houses.push('madeup'));
  assert.throws(() => sortStudent(sorted(), 'slytherin'));
  assert.throws(() => sortStudent(createStudent(12), 'constructor'));
});
test('sparse and undefined prerequisite collections are rejected', () => {
  for (const prerequisites of [new Array(1), [undefined]]) {
    assert.throws(() => compileCurriculum([{...definitions[0],prerequisites}]));
    assert.throws(() => advanceYear(sorted(),prerequisites,professor,curriculum()));
  }
});
test('curriculum rejects duplicates, missing dependencies, cycles and malformed values', () => {
  for (const value of [null,{},[],[definitions[0],definitions[0]],
    [{...definitions[0],year:0}], [{...definitions[0],restricted:'false'}],
    [{...definitions[0],prerequisites:['missing']}],
    [{...definitions[0],prerequisites:['light']}],
    [{...definitions[0],prerequisites:['summoning']},definitions[1]],
    [{...definitions[0],id:'__proto__'}]]) assert.throws(() => compileCurriculum(value));
});
test('curriculum and result collections cannot be mutated to rewrite policy', () => {
  const input = JSON.parse(JSON.stringify(definitions));
  const config = compileCurriculum(input);
  input[0].spell='AvadaKedavra';
  const learned=completeLesson(sorted(),'light',professor,config);
  assert.deepEqual(learned.spells,['Lumos']);
  assert.throws(() => learned.spells.push('AvadaKedavra'));
});
test('malformed persisted state fails closed rather than resetting progress', () => {
  for (const state of [{...sorted(),year:NaN},{...sorted(),characterId:-1},
    {...sorted(),spells:['AvadaKedavra']},{...sorted(),completedLessons:['missing']},
    {...sorted(),version:2},{...sorted(),completedLessons:['light','light'],spells:['Lumos']}]) {
    assert.throws(() => completeLesson(state,'light',professor,curriculum()));
  }
});
