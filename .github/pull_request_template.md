## Summary

<!-- What changes, and why. Link the issue if one applies. -->

## Checks

- [ ] `npm test` passes (build and unit tests)
- [ ] For changes to API calls or handlers: ran `npm run smoke` against the real VirusTotal API, or explain why not
- Tested with: <!-- tool, input type (hash, URL, IP, domain) -->

## Checklist

- [ ] New or changed input is validated in `src/schemas/index.ts`.
- [ ] No API keys, tokens or real sample data from private investigations in code, docs, tests or this description.
- [ ] README and `docs/` are updated where tools, parameters or requirements changed.
- [ ] Changes to tool schemas or defaults are noted in `CHANGELOG.md`.
