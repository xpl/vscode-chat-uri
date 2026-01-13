# Chat URI Handler

A VS Code extension that handles custom `vscode://` URIs to start Copilot chat with a prompt.

## Features

- Handles custom URI scheme: `vscode://xpl.chat-uri/startChat?prompt=...`
- Opens the Copilot chat panel with the specified prompt
- Supports partial queries that wait for user input

## Usage

### URI Format

```
vscode://xpl.chat-uri/startChat?prompt=YOUR_ENCODED_PROMPT
```

### Parameters

| Parameter | Description | Required |
|-----------|-------------|----------|
| `prompt` | URL-encoded prompt text to send to chat | No (opens empty chat if omitted) |
| `partial` | Set to `true` to keep the prompt editable before sending | No (default: `false`) |
| `mode` | Chat mode: `agent`, `ask`, or `edit` | No (default: `agent`) |
| `newChat` | Set to `false` to continue in existing chat session | No (default: `true`) |

### Examples

1. **Simple prompt** (sends immediately):
   ```
   vscode://xpl.chat-uri/startChat?prompt=Explain%20this%20code
   ```

2. **Partial prompt** (waits for user to edit/confirm):
   ```
   vscode://xpl.chat-uri/startChat?prompt=Help%20me%20with&partial=true
   ```

3. **Open empty chat**:
   ```
   vscode://xpl.chat-uri/startChat
   ```

## Testing

1. Press `F5` to launch the Extension Development Host
2. Open a browser and navigate to one of the example URIs above
3. VS Code should open and the chat panel should appear with your prompt

Alternatively, use the test command:
1. Open Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`)
2. Run "Chat URI Handler: Test" command
3. Enter a prompt and it will open in chat

## Development

### Prerequisites

- Node.js 18.x or higher
- VS Code 1.85.0 or higher

### Building

```bash
npm install
npm run compile
```

### Watching for changes

```bash
npm run watch
```

## How it Works

1. The extension registers a `UriHandler` that listens for URIs with the scheme `vscode://xpl.chat-uri/...`
2. When a URI is received, it parses the path and query parameters
3. If the path is `/startChat`, it extracts the `prompt` parameter
4. It then calls `workbench.action.chat.open` with the prompt to open the Copilot chat

## API Reference

The extension uses the VS Code command `workbench.action.chat.open` which accepts:

```typescript
{
  query: string;           // The prompt text
  isPartialQuery?: boolean; // If true, waits for user input before sending
}
```

## License

MIT
