// Private operator report. Run with server environment variables, never browser credentials.
import { Redis } from '@upstash/redis';
const month = process.argv[2] || new Date().toISOString().slice(0, 7);
if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) throw new Error('Use YYYY-MM');
const url = process.env.UPSTASH_REDIS_REST_KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
if (!url || !token) throw new Error('Configure the existing server Redis environment variables. Do not put secrets in command arguments.');
const redis = new Redis({ url, token });
const pipeline = redis.pipeline();
const days = new Date(Date.UTC(Number(month.slice(0,4)), Number(month.slice(5)), 0)).getUTCDate();
for (let day=1; day<=days; day++) for (const tier of ['free','pro']) pipeline.hgetall(`na:ai-cost:day:${month}-${String(day).padStart(2,'0')}:${tier}`);
const rows = await pipeline.exec();
const totals = {free:{requests:0,costMicroUsd:0},pro:{requests:0,costMicroUsd:0}};
rows.forEach((row,i) => { const tier=i%2 ? 'pro' : 'free'; totals[tier].requests += Number(row?.requests || 0); totals[tier].costMicroUsd += Number(row?.costMicroUsd || 0); });
const top = await redis.zrange(`na:ai-cost:accounts:${month}`,0,9,{rev:true,withScores:true});
console.log(JSON.stringify({month,notice:'Estimated AI cost since instrumentation was deployed. Not profit: excludes Paddle, tax, refunds, advertising, hosting and support. Provider failures with no usage response may be missing; reconcile provider invoices. Account references are monthly pseudonyms.',
  free:{requests:totals.free.requests,estimatedUsd:totals.free.costMicroUsd/1e6},
  pro:{requests:totals.pro.requests,estimatedUsd:totals.pro.costMicroUsd/1e6},
  highestCostProAccounts: Array.from({length:top.length/2},(_,i)=>({reference:top[i*2],estimatedUsd:Number(top[i*2+1])/1e6}))},null,2));
