# @alanagoyal/mcp-server

a model context protocol (mcp) server that provides ai assistants with information about alana goyal and basecase, based on alanagoyal.com and basecase.vc. the server integrates with popular ai development environments like windsurf and cursor.

i built this using [mastra](https://github.com/mastra-ai/mastra) and [stagehand](https://github.com/browserbase/stagehand).

## installation

### in windsurf

create or update `~/.codeium/windsurf/mcp_config.json`:

#### macos/linux

```json
{
  "mcpServers": {
    "basecase": {
      "command": "npx",
      "args": ["-y", "@alanagoyal/mcp-server@latest"]
    }
  }
}
```

#### windows

```json
{
  "mcpServers": {
    "basecase": {
      "command": "cmd",
      "args": ["/c", "npx", "-y", "@alanagoyal/mcp-server@latest"]
    }
  }
}
```

this will make all basecase documentation tools available in your windsurf workspace. note that windsurf mcp tool calling doesn't work very well. you will need to fully quit and re-open windsurf after adding this. if a tool call fails you will need to go into windsurf mcp settings and re-start the mcp server.

### in cursor

create or update `.cursor/mcp.json` in your project root:

#### macos/linux

```json
{
  "mcpServers": {
    "basecase": {
      "command": "npx",
      "args": ["-y", "@alanagoyal/mcp-server@latest"]
    }
  }
}
```

#### windows

```json
{
  "mcpServers": {
    "basecase": {
      "command": "cmd",
      "args": ["/c", "npx", "-y", "@alanagoyal/mcp-server@latest"]
    }
  }
}
```

this will make all basecase documentation tools available in your cursor workspace. note that the mcp server won't be enabled by default. you'll need to go to cursor settings -> mcp settings and click "enable" on the basecase mcp server.
