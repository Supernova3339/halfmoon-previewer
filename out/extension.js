"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
let panel = undefined;
// This method is called when your extension is activated
function activate(context) {
    // Define a command that will open a WebView panel
    vscode.commands.registerCommand('halfmoon-previewer.openHalfmoonUIPlayground', () => {
        panel = vscode.window.createWebviewPanel('halfmoonUIPlayground', 'HalfmoonUI Previewer', vscode.ViewColumn.One, {
            enableScripts: true // Enable scripts in the WebView panel
        });
        // Get the active text editor's content
        const activeEditor = vscode.window.activeTextEditor;
        if (activeEditor) {
            const content = activeEditor.document.getText();
            // Load the initial content and theme into the WebView panel
            panel.webview.html = getWebviewContent(content, getCurrentTheme());
        }
        // Listen for text document content changes
        const disposable = vscode.workspace.onDidChangeTextDocument(event => {
            if (panel && activeEditor && event.document === activeEditor.document) {
                // Get the updated content and update the WebView panel
                const updatedContent = activeEditor.document.getText();
                panel.webview.html = getWebviewContent(updatedContent, getCurrentTheme());
            }
        });
        // Clean up the event listener when the panel is disposed
        panel.onDidDispose(() => {
            if (disposable) {
                disposable.dispose();
            }
            panel = undefined;
        });
    });
}
exports.activate = activate;
// This method is called when your extension is deactivated
function deactivate() {
    // Clean up resources if needed
}
exports.deactivate = deactivate;
function getCurrentTheme() {
    // Use VS Code API to get the current color theme
    const currentTheme = vscode.window.activeColorTheme;
    return currentTheme.kind ? 'dark' : 'light';
}
function getWebviewContent(content, theme) {
    return `<!DOCTYPE html>
    <html lang="en" data-bs-theme="${theme}">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://cdn.jsdelivr.net/npm/halfmoon@2.0.0/css/halfmoon.min.css" rel="stylesheet">
  		<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css">
		<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/js/bootstrap.bundle.min.js" integrity="sha384-HwwvtgBNo3bZJJLYd8oVXjrBZt8cqVSpeBNS5n7C8IVInixGAoxmnlMuBnhbgrkm" crossorigin="anonymous"></script>
    </head>
    <body>
        ${content}
    </body>
    </html>`;
}
//# sourceMappingURL=extension.js.map