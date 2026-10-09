# Contributing to mcp-virustotal

## Development setup

Requires Node.js 20 or later.

```sh
git clone https://github.com/w0h1v/mcp-virustotal && cd mcp-virustotal
npm ci
npm test
```

Run the server against your own MCP client with `node build/index.js` and `VIRUSTOTAL_API_KEY` set. `npm run dev` rebuilds on change.

## Checks

Before opening a pull request:

1. `npm test` passes (TypeScript strict build, then the unit tests in `tests/`). No API key or network is needed.
2. If you changed API calls or handlers, run `VIRUSTOTAL_API_KEY=... npm run smoke` against the real API. It paces calls at 20 s for the public-tier limit, so it takes a few minutes.
3. `npm audit --omit=dev --audit-level=high` is clean.

## Guidelines

- **Treat tool input as hostile.** Validate new parameters in `src/schemas/index.ts`. Never interpolate unvalidated input into a request path.
- **Add a test for new behaviour.** Formatters are pure functions and easy to test; see `tests/formatters.test.mjs`.
- **Keep docs in step with code.** Update the README, `docs/` and `CHANGELOG.md` when tools, parameters or requirements change.
- **No secrets or private data.** Use public samples (for example the EICAR hash) in code, docs, tests and issues.

## Pull requests

Keep changes focused, fill in the pull request template, and describe how you tested.

## Security issues

Do not open a public issue for a vulnerability. Follow [SECURITY.md](SECURITY.md).

## Code of conduct

Participation is governed by [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md). By contributing, you agree that your contribution is licensed under the MIT license.
