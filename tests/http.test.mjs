// Start the real server in httpStream mode and check it answers on MCP_HOST.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';

async function freePort() {
  const s = createServer();
  await new Promise((r) => s.listen(0, '127.0.0.1', r));
  const { port } = s.address();
  await new Promise((r) => s.close(r));
  return port;
}

async function waitForHealth(url, child) {
  for (let i = 0; i < 50; i++) {
    if (child.exitCode !== null) throw new Error(`server exited with ${child.exitCode}`);
    try {
      return await fetch(url);
    } catch {
      await new Promise((r) => setTimeout(r, 100));
    }
  }
  throw new Error(`no response from ${url}`);
}

test('httpStream transport serves /health on MCP_HOST', async (t) => {
  const port = await freePort();
  const child = spawn(process.execPath, ['build/index.js'], {
    env: {
      ...process.env,
      VIRUSTOTAL_API_KEY: 'x'.repeat(64),
      MCP_TRANSPORT: 'httpStream',
      MCP_HOST: '127.0.0.1',
      MCP_PORT: String(port),
    },
    stdio: 'ignore',
  });
  t.after(() => child.kill());

  const res = await waitForHealth(`http://127.0.0.1:${port}/health`, child);
  assert.equal(res.status, 200);
});
