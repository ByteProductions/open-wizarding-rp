/** Original domain policy. This module does not authorize client RPCs or cast spells. */
export const houses = Object.freeze(['gryffindor', 'hufflepuff', 'ravenclaw', 'slytherin'] as const);
export type House = typeof houses[number];
export interface Lesson {
  readonly id: string;
  readonly year: number;
  readonly prerequisites: readonly string[];
  readonly spell: string;
  readonly restricted: boolean;
}
export interface Curriculum { readonly lessons: readonly Lesson[] }
export interface Student {
  readonly version: 1;
  readonly characterId: number;
  readonly year: number;
  readonly house: House | null;
  readonly completedLessons: readonly string[];
  readonly spells: readonly string[];
}
/** Must be constructed by trusted server code after permission checks. */
export interface Teacher { readonly verified: boolean; readonly capabilities: readonly string[] }
const compiled = new WeakSet<object>();
function requireCondition(condition: unknown, code: string): asserts condition {
  if (!condition) throw new Error(code);
}
function record(value: unknown): asserts value is Record<string, unknown> {
  requireCondition(value !== null && typeof value === 'object' && !Array.isArray(value), 'INVALID_RECORD');
}
function identifier(value: unknown): asserts value is string {
  requireCondition(typeof value === 'string' && /^[A-Za-z][A-Za-z0-9:_-]{0,63}$/.test(value)
    && !['constructor', 'prototype', '__proto__'].includes(value), 'INVALID_IDENTIFIER');
}
function year(value: unknown): asserts value is number {
  requireCondition(Number.isSafeInteger(value) && Number(value) >= 1 && Number(value) <= 7, 'INVALID_YEAR');
}
function strings(value: unknown): asserts value is string[] {
  requireCondition(Array.isArray(value) && value.length <= 512, 'INVALID_LIST');
  for (const item of value) identifier(item);
  requireCondition(new Set(value).size === value.length, 'DUPLICATE_VALUE');
}
function freezeStudent(value: Student): Student {
  return Object.freeze({...value, completedLessons: Object.freeze([...value.completedLessons]), spells: Object.freeze([...value.spells])});
}
function validateStudent(value: unknown): asserts value is Student {
  record(value);
  requireCondition(value.version === 1, 'UNSUPPORTED_STATE_VERSION');
  requireCondition(Number.isSafeInteger(value.characterId) && Number(value.characterId) > 0, 'INVALID_CHARACTER');
  year(value.year);
  requireCondition(value.house === null || houses.includes(value.house as House), 'INVALID_HOUSE');
  strings(value.completedLessons); strings(value.spells);
  requireCondition(value.house !== null || (value.completedLessons.length === 0 && value.spells.length === 0 && value.year === 1), 'INVALID_UNSORTED_STATE');
}
function validateProgress(student: Student, curriculum: Curriculum): void {
  validateStudent(student);
  requireCondition(compiled.has(curriculum), 'UNCOMPILED_CURRICULUM');
  const spells = new Set<string>();
  for (const id of student.completedLessons) {
    const lesson = curriculum.lessons.find(item => item.id === id);
    requireCondition(lesson && lesson.year <= student.year, 'INVALID_LESSON_HISTORY');
    requireCondition(lesson.prerequisites.every(item => student.completedLessons.includes(item)), 'INVALID_PREREQUISITE_HISTORY');
    spells.add(lesson.spell);
  }
  requireCondition(spells.size === student.spells.length && student.spells.every(item => spells.has(item)), 'INCONSISTENT_ENTITLEMENTS');
}
function teacher(actor: Teacher): void {
  requireCondition(actor?.verified === true && Array.isArray(actor.capabilities) && actor.capabilities.includes('school.teach'), 'TEACHER_FORBIDDEN');
}
export function compileCurriculum(input: unknown): Curriculum {
  requireCondition(Array.isArray(input) && input.length > 0 && input.length <= 512, 'INVALID_CURRICULUM');
  const lessons: Lesson[] = input.map(value => {
    record(value); identifier(value.id); identifier(value.spell); year(value.year); strings(value.prerequisites);
    requireCondition(typeof value.restricted === 'boolean', 'INVALID_RESTRICTION');
    return Object.freeze({id:value.id, spell:value.spell, year:value.year, restricted:value.restricted, prerequisites:Object.freeze([...value.prerequisites])});
  });
  const byId = new Map(lessons.map(item => [item.id,item]));
  requireCondition(byId.size === lessons.length, 'DUPLICATE_LESSON');
  // One acquisition route per spell avoids an unrestricted lesson bypassing a restricted route.
  requireCondition(new Set(lessons.map(item => item.spell)).size === lessons.length, 'DUPLICATE_SPELL');
  const visited = new Set<string>(), visiting = new Set<string>();
  function visit(lesson: Lesson): void {
    requireCondition(!visiting.has(lesson.id), 'CYCLIC_PREREQUISITE');
    if (visited.has(lesson.id)) return;
    visiting.add(lesson.id);
    for (const id of lesson.prerequisites) {
      const parent = byId.get(id);
      requireCondition(parent && parent.year <= lesson.year, 'INVALID_PREREQUISITE');
      visit(parent);
    }
    visiting.delete(lesson.id); visited.add(lesson.id);
  }
  lessons.forEach(visit);
  const result = Object.freeze({lessons:Object.freeze(lessons)});
  compiled.add(result);
  return result;
}
export function createStudent(characterId: number): Student {
  const result: Student = {version:1, characterId, year:1, house:null, completedLessons:[], spells:[]};
  validateStudent(result);
  return freezeStudent(result);
}
export function sortStudent(student: Student, house: House): Student {
  validateStudent(student);
  requireCondition(student.house === null, 'ALREADY_SORTED');
  requireCondition(houses.includes(house), 'INVALID_HOUSE');
  return freezeStudent({...student, house});
}
export function completeLesson(student: Student, lessonId: string, actor: Teacher, curriculum: Curriculum): Student {
  teacher(actor); validateProgress(student,curriculum);
  const lesson = curriculum.lessons.find(item => item.id === lessonId);
  requireCondition(lesson, 'UNKNOWN_LESSON');
  requireCondition(student.house !== null, 'NOT_SORTED');
  requireCondition(!lesson.restricted || actor.capabilities.includes('school.teach.restricted'), 'RESTRICTED_LESSON');
  requireCondition(student.year >= lesson.year && lesson.prerequisites.every(item => student.completedLessons.includes(item)), 'PREREQUISITES_NOT_MET');
  if (student.completedLessons.includes(lesson.id)) return freezeStudent(student);
  return freezeStudent({...student,completedLessons:[...student.completedLessons,lesson.id],spells:[...student.spells,lesson.spell]});
}
export function advanceYear(student: Student, requiredLessons: readonly string[], actor: Teacher, curriculum: Curriculum): Student {
  teacher(actor); validateProgress(student,curriculum); strings(requiredLessons);
  requireCondition(student.house !== null && student.year < 7, 'CANNOT_ADVANCE');
  requireCondition(requiredLessons.length > 0 && requiredLessons.every(id => student.completedLessons.includes(id)), 'ADVANCEMENT_REQUIREMENTS_NOT_MET');
  requireCondition(requiredLessons.some(id => curriculum.lessons.find(lesson => lesson.id === id)?.year === student.year), 'CURRENT_YEAR_LESSON_REQUIRED');
  return freezeStudent({...student,year:student.year+1});
}
