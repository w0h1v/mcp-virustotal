# Changelog

## Unreleased

### Added
- CI workflow (Node 20/22/24 tests, package check, dependency audit, Docker build), Dependabot, issue and pull request templates, security policy, contributing guide, code of conduct, and a documentation site.

### Changed
- IP reports and IP relationship output now show the SHA-256 of communicating and downloaded files (#22).
- Dockerfile uses Node 24 LTS and `npm ci --omit=dev` for the runtime image.
- `package.json` declares `engines.node >=20`.
- Lockfile refreshed: `@modelcontextprotocol/sdk` 1.26.0 → 1.32.1, `proxy-addr` 2.0.7 → 2.0.8, `fast-uri` 3.1.7 → 3.1.8, `ip-address` 10.7.0 → 10.7.3 (clears Socket CVE flags).

## 1.0.28

Version history before this changelog is summarized in the git log and the GitHub releases.
