import assert from 'node:assert/strict';
import {test} from 'node:test';
import {freeBrowserSession} from './free-session.ts';
test('each browser gets an independent signed allowance identity',()=>{
 const a=freeBrowserSession(undefined,'test'),b=freeBrowserSession(undefined,'test');
 assert.notEqual(a.id,b.id);
 assert.equal(freeBrowserSession(a.value,'test').id,a.id);
 assert.equal(freeBrowserSession(a.value,'test').fresh,false);
 assert.notEqual(freeBrowserSession(a.value,'wrong').id,a.id);
 assert.notEqual(freeBrowserSession(a.value+'.extra','test').id,a.id);
});
