const {test} = require('node:test');
const assert = require('node:assert/strict');
const {authorizeSession} = require('../dist/session-guard.js');
const valid=()=>({accountId:1,characterId:2,generation:'connection-1',trust:'verified'});
test('verified server session and granted capability produce a frozen identity',async()=>{
  const session=valid();
  const result=await authorizeSession(7,'school.teach',{read:()=>session,hasCapability:async()=>true});
  assert.equal(result.characterId,2);assert.ok(Object.isFrozen(result));
});
test('asserted identity, absent session and missing permission fail closed',async()=>{
  for(const state of [null,{...valid(),trust:'asserted'},{...valid(),characterId:0}]) {
    let checked=false;
    await assert.rejects(authorizeSession(7,'school.teach',{read:()=>state,hasCapability:async()=>{checked=true;return true;}}));
    assert.equal(checked,false);
  }
  await assert.rejects(authorizeSession(7,'school.teach',{read:valid,hasCapability:async()=>false}));
});
test('character switch, disconnect, trust downgrade or reconnect during permission lookup is rejected',async()=>{
  for(const after of [null,{...valid(),characterId:3},{...valid(),accountId:3},{...valid(),generation:'connection-2'},{...valid(),trust:'asserted'}]) {
    let current=valid();
    await assert.rejects(authorizeSession(7,'school.teach',{read:()=>current,hasCapability:async()=>{current=after;return true;}}));
  }
});
test('in-place session mutations do not defeat the snapshot check',async()=>{
  const current=valid();
  await assert.rejects(authorizeSession(7,'school.teach',{read:()=>current,hasCapability:async()=>{current.characterId=3;return true;}}));
});
