# Troubleshooting

## "Wrong API key" or 401 errors

1. The key is usually 64 characters, with no spaces or quotes around it.
2. Copy it from the API Key page of your [VirusTotal account](https://www.virustotal.com/gui/my-apikey).
3. After changing client config, save it and restart the client.
4. Check the server log. It is written to `logs/mcp-virustotal-server.log` in the package directory, or `/tmp/mcp-virustotal-logs` if that isn't writable.

## Rate limit or quota errors (429)

The public tier allows 4 requests per minute and a daily cap. Report tools batch relationships into one request to save quota, but a report that falls back to scanning a URL polls for the result and uses more. Wait a minute and retry, or use a premium key.

## "Not found" for a file, URL or domain

VirusTotal has no record of it. For files, the hash must be an MD5, SHA-1 or SHA-256. For URLs, `get_url_report` returns the cached report when there is one and otherwise submits the URL for scanning, so the first call on an unseen URL is slower.

## The client doesn't list the tools

- Run `npx -y @burtthecoder/mcp-virustotal` in a terminal. A missing `VIRUSTOTAL_API_KEY` or an old Node (below 20) fails at startup.
- Desktop clients may not inherit your shell `PATH`. Use the absolute path to `npx` or `node`.

## The smoke test hangs or fails

`npm run smoke` paces calls at 20 s and needs a key with normal quota. It isn't compatible with free tiers reduced to a few lookups a day. Edit `scripts/smoke-test.mjs` to run a single tool.
