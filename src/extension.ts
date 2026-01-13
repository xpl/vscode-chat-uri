import * as vscode from "vscode";

/**
 * URI Handler that listens for custom vscode:// URIs
 *
 * Supported URI format:
 * vscode://xpl.chat-uri/startChat?prompt=Your%20prompt%20here
 *
 * Parameters:
 * - prompt: The chat prompt (URL encoded)
 * - partial: If "true", keeps prompt editable before sending
 * - mode: Chat mode - "agent" for agent mode, "ask" for ask mode, or "edit" for edit mode
 * - newChat: If "true", starts a new chat session (default: true)
 *
 * This will open the Copilot chat panel and populate it with the decoded prompt.
 */
class ChatUriHandler implements vscode.UriHandler {
  async handleUri(uri: vscode.Uri): Promise<void> {
    console.log(`Received URI: ${uri.toString()}`);

    // Parse the URI path and query
    const path = uri.path;
    const query = new URLSearchParams(uri.query);

    if (path === "/startChat" || path === "startChat") {
      const prompt = query.get("prompt");
      const isPartial = query.get("partial") === "true";
      const mode = query.get("mode") || "agent"; // Default to agent mode
      const newChat = query.get("newChat") !== "false"; // Default to true

      try {
        // Start a new chat session first (if requested)
        if (newChat) {
          await vscode.commands.executeCommand("workbench.action.chat.newChat");
        }

        if (prompt) {
          const decodedPrompt = decodeURIComponent(prompt);
          console.log(
            `Starting chat with prompt: ${decodedPrompt}, mode: ${mode}`
          );

          // Use workbench.action.chat.open command to open chat with the prompt
          // Supported options:
          // - query: The prompt text
          // - isPartialQuery: If true, waits for user input before sending
          // - mode: "agent", "ask", or "edit"
          await vscode.commands.executeCommand("workbench.action.chat.open", {
            query: decodedPrompt,
            isPartialQuery: isPartial,
            mode: mode,
          });

          vscode.window.showInformationMessage(
            `Chat opened (${mode} mode) with prompt: "${decodedPrompt.substring(
              0,
              50
            )}${decodedPrompt.length > 50 ? "..." : ""}"`
          );
        } else {
          // No prompt provided, just open the chat panel in the specified mode
          await vscode.commands.executeCommand("workbench.action.chat.open", {
            mode: mode,
          });
          vscode.window.showInformationMessage(
            `Chat panel opened in ${mode} mode`
          );
        }
      } catch (error) {
        console.error("Failed to open chat:", error);
        vscode.window.showErrorMessage(`Failed to open chat: ${error}`);
      }
    } else {
      vscode.window.showWarningMessage(
        `Unknown URI path: ${path}. Use /startChat?prompt=...`
      );
    }
  }
}

export function activate(context: vscode.ExtensionContext) {
  console.log("Chat URI Handler extension is now active");

  // Register the URI handler
  const uriHandler = new ChatUriHandler();
  context.subscriptions.push(vscode.window.registerUriHandler(uriHandler));
}

export function deactivate() {
  console.log("Chat URI extension is now deactivated");
}
