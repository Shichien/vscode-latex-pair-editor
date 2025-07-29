import * as vscode from "vscode";

export function registerUnwrapEnvironmentCommand(
    context: vscode.ExtensionContext
) {
    const commandId = "latex-pair-editor.unwrapEnvironment";

    const commandHandler = () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }

        const selection = editor.selection;
        if (selection.isEmpty) {
            vscode.window.showWarningMessage(
                "请完整选中需要取消包裹的 LaTeX 环境。"
            );
            return;
        }

        const selectedText = editor.document.getText(selection);
        const lines = selectedText.split(/\r?\n/);
        const firstLine = lines[0].trim();
        const lastLine = lines[lines.length - 1].trim();

        if (
            !firstLine.startsWith("\\begin{") ||
            !lastLine.startsWith("\\end{")
        ) {
            vscode.window.showWarningMessage(
                "选区似乎不是一个有效的 LaTeX 环境。请确保选中了 \\begin 和 \\end。"
            );
            return;
        }

        const innerLines = lines.slice(1, -1);
        const unwrappedLines = innerLines.map((line) => {
            return line.replace(/^\s*\\item\s?/, "");
        });

        const newText = unwrappedLines.join("\n");

        editor.edit((editBuilder) => {
            editBuilder.replace(selection, newText);
        });
    };

    context.subscriptions.push(
        vscode.commands.registerCommand(commandId, commandHandler)
    );
}
