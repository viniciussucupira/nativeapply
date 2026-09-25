import test from 'node:test';
import assert from 'node:assert/strict';
import { protectCompanyNames } from './rewrite-names.ts';

test('protects company spelling in both dialects without masking surrounding grammar', () => {
  for (const name of ['Labor Center Inc', 'Color Center Ltd', 'Colour Centre Ltd', 'Harbor Color LLC', 'Nova Ltd.', 'Bank of America Corporation']) {
    const draft = `I have work at ${name} for 7 months.`;
    const protectedDraft = protectCompanyNames(draft, 'test');
    assert.ok(!protectedDraft.text.includes(name));
    assert.ok(protectedDraft.text.startsWith('I have work at '));
    assert.equal(protectedDraft.restore(protectedDraft.text.replace('have work', 'worked')), draft.replace('have work', 'worked'));
  }
});
test('restores repeated and different company names exactly', () => {
  const text = 'Color Center Ltd and Labor Center Inc. Previously Color Center Ltd.';
  const protectedDraft = protectCompanyNames(text, 'test');
  assert.equal(protectedDraft.restore(protectedDraft.text), text);
});
test('rejects missing, duplicated or corrupted company placeholders', () => {
  const protectedDraft = protectCompanyNames('At Color Center Ltd', 'test');
  assert.throws(() => protectedDraft.restore('At Colour Centre Ltd'));
  assert.throws(() => protectedDraft.restore(protectedDraft.text + protectedDraft.text));
  assert.throws(() => protectedDraft.restore(protectedDraft.text.toLowerCase()));
});
test('leaves ordinary text and unsuffixed names for the normal rewrite', () => {
  const text = 'I organised training at Acme. No management experience.';
  const protectedDraft = protectCompanyNames(text, 'test');
  assert.equal(protectedDraft.text, text);
  assert.equal(protectedDraft.restore(text), text);
});
