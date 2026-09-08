// Exercise the real Axios HTTP adapter without contacting VirusTotal.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { once } from 'node:events';
import axios from 'axios';
import {
  initVirusTotalClient,
  queryVirusTotal,
  VirusTotalApiError,
} from '../build/utils/api.js';

async function withApi(t, status, payload) {
  const requests = [];
  const server = createServer(async (req, res) => {
    let body = '';
    for await (const chunk of req) body += chunk;
    requests.push({ method: req.method, url: req.url, headers: req.headers, body });
    res.writeHead(status, { 'content-type': 'application/json' });
    res.end(JSON.stringify(payload));
  });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(() => new Promise((resolve) => {
    server.close(resolve);
    server.closeAllConnections();
  }));

  const previousKey = process.env.VIRUSTOTAL_API_KEY;
  process.env.VIRUSTOTAL_API_KEY = 'test-api-key';
  t.after(() => {
    if (previousKey === undefined) delete process.env.VIRUSTOTAL_API_KEY;
    else process.env.VIRUSTOTAL_API_KEY = previousKey;
  });

  const create = axios.create.bind(axios);
  t.mock.method(axios, 'create', (config) => {
    assert.equal(config.baseURL, 'https://www.virustotal.com/api/v3');
    return create({
      ...config,
      baseURL: `http://127.0.0.1:${server.address().port}/api/v3`,
      proxy: false,
    });
  });
  initVirusTotalClient();
  return requests;
}

test('API GET preserves authentication, query encoding, and parsed JSON', async (t) => {
  const payload = { data: [{ id: 'example', type: 'file' }], meta: { cursor: 'next' } };
  const requests = await withApi(t, 200, payload);
  const query = 'type:peexe positives:5+ & tag:signed';
  const cursor = 'a+b/c==';
  assert.deepEqual(await queryVirusTotal('/search', 'get', undefined, {
    query, cursor, limit: 5,
  }), payload);
  assert.equal(requests.length, 1);
  const request = requests[0];
  const url = new URL(request.url, 'http://localhost');
  assert.equal(request.method, 'GET');
  assert.equal(url.pathname, '/api/v3/search');
  assert.equal(url.searchParams.get('query'), query);
  assert.equal(url.searchParams.get('cursor'), cursor);
  assert.equal(url.searchParams.get('limit'), '5');
  assert.equal(request.headers['x-apikey'], 'test-api-key');
});

test('API POST sends URL submissions as form data', async (t) => {
  const payload = { data: { id: 'analysis-id' } };
  const requests = await withApi(t, 200, payload);
  const url = 'https://example.com/path?q=a+b&other=%26';
  assert.deepEqual(await queryVirusTotal('/urls', 'post', new URLSearchParams({ url })), payload);
  assert.equal(requests.length, 1);
  const request = requests[0];
  assert.equal(request.method, 'POST');
  assert.equal(request.url, '/api/v3/urls');
  assert.match(request.headers['content-type'], /^application\/x-www-form-urlencoded/);
  assert.equal(request.headers['x-apikey'], 'test-api-key');
  assert.equal(new URLSearchParams(request.body).get('url'), url);
});

for (const [status, code] of [[404, 'NotFoundError'], [429, 'QuotaExceededError']]) {
  test(`API ${status} preserves the typed error used by handlers`, async (t) => {
    await withApi(t, status, { error: { code, message: 'Request rejected' } });
    await assert.rejects(queryVirusTotal('/urls/example'), (error) => {
      assert.ok(error instanceof VirusTotalApiError);
      assert.equal(error.status, status);
      assert.equal(error.code, code);
      assert.equal(error.message, 'VirusTotal API error: Request rejected');
      return true;
    });
  });
}
