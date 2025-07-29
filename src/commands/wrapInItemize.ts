import * as vscode from "vscode";

export function registerWrapInItemizeCommand(context: vscode.ExtensionContext) {
    const commandId = "latex-pair-editor.wrapInItemize"; // 建议使用您插件名作为前缀

    const commandHandler = () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor || editor.selection.isEmpty) {
            return;
        }

        const selection = editor.selection;
        const selectedText = editor.document.getText(selection);
        const lines = selectedText.split(/\r?\n/);
        const itemizedLines = lines.map((line) => (line.trim() === "" ? "" : `    \\item ${line}`));
        const newText = `\\begin{itemize}\n${itemizedLines.join("\n")}\n\\end{itemize}`;

        editor.edit((editBuilder) => {
            editBuilder.replace(selection, newText);
        });
    };

    context.subscriptions.push(vscode.commands.registerCommand(commandId, commandHandler));
}
