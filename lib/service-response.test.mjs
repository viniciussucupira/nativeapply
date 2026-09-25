import assert from 'node:assert/strict';
import test from 'node:test';
import { createAccessCache, parseProStatus } from './access-cache.ts';
import { recoveryVerificationStatus } from './recovery-response.ts';

test('malformed access responses block purchase instead of appearing to confirm free access', async () => {
  for (const input of [null, {}, [], 'ok', {pro:'true'}, {pro:false, needsRestore:'false'}, {pro:true, unavailable:true}, {pro:true, needsRestore:true}]) {
    const cache = createAccessCache(async () => parseProStatus(input));
    assert.deepEqual(await cache.get(), {pro:false, needsRestore:false, unavailable:true});
  }
});
test('valid free, paid and unavailable access states remain distinct', () => {
  assert.deepEqual(parseProStatus({pro:false}), {pro:false, needsRestore:false, unavailable:false});
  assert.deepEqual(parseProStatus({pro:true}), {pro:true, needsRestore:false, unavailable:false});
  assert.deepEqual(parseProStatus({pro:false,unavailable:true}), {pro:false, needsRestore:false, unavailable:true});
});
test('recovery only confirms success explicitly and displays unknown errors as retryable failures', () => {
  assert.equal(recoveryVerificationStatus(true,{ok:true}), 'done');
  for (const body of [null, {}, {ok:false}, {error:'unexpected_error'}]) {
    assert.equal(recoveryVerificationStatus(true,body), 'unavailable');
    assert.equal(recoveryVerificationStatus(false,body), 'unavailable');
  }
  for (const error of ['invalid_link','no_active_purchase','too_many_requests']) {
    assert.equal(recoveryVerificationStatus(false,{error}), error);
  }
});
