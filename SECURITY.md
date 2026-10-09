# Security policy

mcp-virustotal is an independent project and is not affiliated with VirusTotal or Google.

## Supported versions

Only the latest release receives security fixes.

| Version | Supported |
|---|---|
| Latest release | Yes |
| Older releases | No |

## Reporting a vulnerability

Use GitHub private vulnerability reporting. Open the repository's **Security** tab and choose **Report a vulnerability**. Do not open a public issue or pull request for a suspected vulnerability.

Include:

- The mcp-virustotal version or commit, and your Node version.
- Steps to reproduce, and the expected and actual results.
- The impact you believe the issue has.

Do not include API keys or sensitive indicators from private investigations in a report.

## Scope

In scope:

- **API key leakage** in logs, error messages or tool output.
- **Request forgery**: tool input that changes the host, path or method of the request sent to VirusTotal, or reaches any other host.
- **Validation bypass** of the hash, IP, domain, URL and relationship checks in `src/schemas/index.ts`.
- **Unauthenticated access** to the HTTP streaming transport beyond what is documented.

Out of scope:

- **VirusTotal's API, data and detections.** Report these to VirusTotal.
- **Misuse of the tool.** Submitting a URL to VirusTotal shares it with the VirusTotal community. What you submit is up to the operator.
- **Local attackers with the same OS user**, who can already read the environment and the log file.
- **Automated scanner findings** without a working reproduction.

## Trust model

The server runs with your VirusTotal API key on behalf of an MCP client you configured. It treats tool arguments as untrusted and validates them with zod schemas before building a request. Over stdio it does not authenticate the client, which runs as the same OS user.

The HTTP streaming transport (`MCP_TRANSPORT=httpStream`) has **no authentication**. Do not expose the port beyond localhost; put an authenticating reverse proxy in front of it if other machines need access. Anyone who can reach the port can spend your API quota.

Hashes, URLs and domains you look up are sent to VirusTotal. A URL scan on a cache miss submits that URL for analysis.
