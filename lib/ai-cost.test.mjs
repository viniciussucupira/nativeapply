import assert from 'node:assert/strict';
import { test } from 'node:test';
import { estimateRewriteCost } from './ai-cost.ts';
test('cost uses provider input and output counts in integer microdollars', () => {
  assert.equal(estimateRewriteCost({input_tokens:1000,output_tokens:1000}).costMicroUsd,18000);
  assert.equal(estimateRewriteCost({input_tokens:2000,output_tokens:4096}).costMicroUsd,67440);
});
test('cached tokens are accounted for without negative or invalid costs', () => {
  assert.equal(estimateRewriteCost({input_tokens:0,output_tokens:0,cache_read_input_tokens:1000,cache_creation_input_tokens:1000}).costMicroUsd,6300);
  assert.equal(estimateRewriteCost({input_tokens:-1,output_tokens:NaN}).costMicroUsd,0);
});
