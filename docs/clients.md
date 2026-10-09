# Connect a client

mcp-virustotal speaks MCP over stdio by default. Every client needs the same two things: how to start the server (`npx -y @burtthecoder/mcp-virustotal`) and the `VIRUSTOTAL_API_KEY` environment variable ([get a key](https://www.virustotal.com/gui/my-apikey)).

## Requirements

- Node.js 20 or newer.
- A VirusTotal API key. The free public tier allows 4 requests per minute.

## Claude Code

```sh
claude mcp add --transport stdio --env VIRUSTOTAL_API_KEY=your-key virustotal -- npx -y @burtthecoder/mcp-virustotal
claude mcp get virustotal      # should show: Connected
```

## Codex CLI

```sh
codex mcp add virustotal --env VIRUSTOTAL_API_KEY=your-key -- npx -y @burtthecoder/mcp-virustotal
```

## Gemini CLI

```sh
gemini mcp add -e VIRUSTOTAL_API_KEY=your-key virustotal npx -y @burtthecoder/mcp-virustotal
```

## Claude Desktop

Edit the config file, then restart the app.

| OS | Path |
|---|---|
| macOS | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| Windows | `%APPDATA%\Claude\claude_desktop_config.json` |

```json
{
  "mcpServers": {
    "virustotal": {
      "command": "npx",
      "args": ["-y", "@burtthecoder/mcp-virustotal"],
      "env": { "VIRUSTOTAL_API_KEY": "your-virustotal-api-key" }
    }
  }
}
```

## VS Code (GitHub Copilot)

Create `~/.vscode/mcp.json` (macOS/Linux) or `%USERPROFILE%\.vscode\mcp.json` (Windows), then reload VS Code.

```json
{
  "servers": {
    "virustotal": {
      "command": "npx",
      "args": ["-y", "@burtthecoder/mcp-virustotal"],
      "env": { "VIRUSTOTAL_API_KEY": "your-virustotal-api-key" }
    }
  }
}
```

## From source

```sh
git clone https://github.com/w0h1v/mcp-virustotal && cd mcp-virustotal
npm ci && npm run build
```

Use command `node` with the argument `/absolute/path/to/mcp-virustotal/build/index.js`.

## HTTP streaming

Run the server as a standalone HTTP service with `MCP_TRANSPORT=httpStream`. See [Environment variables](index.md#environment-variables).

!!! warning
    The HTTP transport has no authentication. Don't expose the port beyond localhost without an authenticating reverse proxy, or anyone who can reach it can spend your API quota.

## Smithery

```sh
npx -y @smithery/cli install @burtthecoder/mcp-virustotal --client claude
```
