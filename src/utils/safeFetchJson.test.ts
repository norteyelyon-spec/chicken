import test from 'node:test';
import assert from 'node:assert/strict';
import { safeParseResponseJson } from './safeFetchJson.ts';

function makeMockResponse(params: {
  ok: boolean;
  status: number;
  statusText?: string;
  body: string;
  contentType?: string;
}) {
  return {
    ok: params.ok,
    status: params.status,
    statusText: params.statusText ?? '',
    headers: new Headers({ 'content-type': params.contentType ?? 'application/json' }),
    text: async () => params.body,
  };
}

test('safeParseResponseJson parses valid JSON payloads cleanly', async () => {
  const res = makeMockResponse({
    ok: true,
    status: 200,
    body: JSON.stringify({ ok: true, count: 42 }),
  });
  const parsed = await safeParseResponseJson<{ ok: boolean; count: number }>(res);
  assert.equal(parsed.ok, true);
  assert.equal(parsed.data?.count, 42);
});

test('safeParseResponseJson handles HTML <!doctype responses without throwing SyntaxError', async () => {
  const res = makeMockResponse({
    ok: true,
    status: 200,
    contentType: 'text/html; charset=utf-8',
    body: '<!doctype html><html><head><title>App</title></head><body></body></html>',
  });
  const parsed = await safeParseResponseJson<{ lesson: unknown }>(res);
  assert.equal(parsed.ok, false);
  assert.equal(parsed.data, null);
  assert.ok(parsed.errorMessage && !parsed.errorMessage.includes('Unexpected token'));
});

test('safeParseResponseJson surfaces friendly 503/504 gateway errors cleanly', async () => {
  const res = makeMockResponse({
    ok: false,
    status: 503,
    contentType: 'text/html',
    body: '<!DOCTYPE html><html><body>503 Service Unavailable</body></html>',
  });
  const parsed = await safeParseResponseJson(res);
  assert.equal(parsed.ok, false);
  assert.equal(parsed.status, 503);
  assert.match(parsed.errorMessage ?? '', /temporarily busy|timed out/i);
});

test('safeParseResponseJson preserves structured API error messages', async () => {
  const res = makeMockResponse({
    ok: false,
    status: 400,
    body: JSON.stringify({ error: 'Please select a topic first.' }),
  });
  const parsed = await safeParseResponseJson(res);
  assert.equal(parsed.ok, false);
  assert.match(parsed.errorMessage ?? '', /Please select a topic first/);
});
