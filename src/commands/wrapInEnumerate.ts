import * as vscode from "vscode";

export function registerWrapInEnumerateCommand(
    context: vscode.ExtensionContext
) {
    const commandId = "latex-pair-editor.wrapInEnumerate";

    const commandHandler = () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor || editor.selection.isEmpty) {
            return;
        }

        const selection = editor.selection;
        const selectedText = editor.document.getText(selection);
        const lines = selectedText.split(/\r?\n/);
        const itemizedLines = lines
            .filter((line) => line.trim() !== "")
            .map((line) => `    \\item ${line}`);
        const newText = `\\begin{enumerate}\n${itemizedLines.join(
            "\n"
        )}\n\\end{enumerate}`;

        editor.edit((editBuilder) => {
            editBuilder.replace(selection, newText);
        });
    };

    context.subscriptions.push(
        vscode.commands.registerCommand(commandId, commandHandler)
    );
}
