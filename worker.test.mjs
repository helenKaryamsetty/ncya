import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const source = await readFile(new URL('./worker.js', import.meta.url), 'utf8');
const worker = (await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`)).default;
const visitor = { name: 'Test Visitor', age: 24, phone: '9876543210', gender: 'Female', email: 'test@example.com' };
const env = { GOOGLE_SCRIPT_URL: 'https://script.example/exec' };
const request = (data) => new Request('https://ncya.example/api/register', { method: 'POST', body: JSON.stringify(data) });

test('rejects invalid visitor data without forwarding it', async () => {
  const response = await worker.fetch(request({ ...visitor, age: 0 }), env);
  assert.equal(response.status, 400);
  for (const phone of ['+919876543210', '1234567890', '987654321', '98765432100']) {
    assert.equal((await worker.fetch(request({ ...visitor, phone }), env)).status, 400);
  }
  assert.equal((await worker.fetch(request({ ...visitor, name: '   ' }), env)).status, 400);
  assert.equal((await worker.fetch(request({ ...visitor, phone: '' }), env)).status, 400);
});

test('reports missing configuration', async () => {
  const response = await worker.fetch(request(visitor), {});
  assert.equal(response.status, 503);
});

test('forwards valid data and requires confirmation from Apps Script', async () => {
  const originalFetch = globalThis.fetch;
  try {
    globalThis.fetch = async (url, options) => {
      assert.equal(url, env.GOOGLE_SCRIPT_URL);
      assert.deepEqual(JSON.parse(options.body), visitor);
      return Response.json({ ok: true });
    };
    const response = await worker.fetch(request(visitor), env);
    assert.equal(response.status, 200);
    assert.equal((await response.json()).ok, true);

    globalThis.fetch = async () => Response.json({ success: true, message: 'Registration successful!' });
    const success = await worker.fetch(request(visitor), env);
    assert.equal(success.status, 200);
    const successBody = await success.json();
    assert.equal(successBody.ok, true);
    assert.equal(successBody.success, true);

    globalThis.fetch = async () => Response.json({ success: false, message: 'Sheet write failed' });
    const failed = await worker.fetch(request(visitor), env);
    assert.equal(failed.status, 502);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('accepts blank optional fields', async () => {
  const originalFetch = globalThis.fetch;
  try {
    globalThis.fetch = async (_url, options) => {
      assert.deepEqual(JSON.parse(options.body), {
        name: 'Test Visitor', age: '', phone: '9876543210', gender: '', email: '',
      });
      return Response.json({ ok: true });
    };
    const response = await worker.fetch(request({ name: visitor.name, phone: visitor.phone }), env);
    assert.equal(response.status, 200);
  } finally {
    globalThis.fetch = originalFetch;
  }
});