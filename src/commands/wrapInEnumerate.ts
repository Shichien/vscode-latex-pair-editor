import * as vscode from "vscode";

// 导出一个新的注册函数
export function registerWrapInEnumerateCommand(context: vscode.ExtensionContext) {
    // 1. 定义一个全新的、唯一的命令 ID
    const commandId = "latex-pair-editor.wrapInEnumerate";

    const commandHandler = () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor || editor.selection.isEmpty) {
            return;
        }

        const selection = editor.selection;
        const selectedText = editor.document.getText(selection);
        const lines = selectedText.split(/\r?\n/);
        const itemizedLines = lines.map((line) => (line.trim() === "" ? "" : `    \\item ${line}`));

        // 2. & 3. 将环境名称从 itemize 改为 enumerate
        const newText = `\\begin{enumerate}\n${itemizedLines.join("\n")}\n\\end{enumerate}`;

        editor.edit((editBuilder) => {
            editBuilder.replace(selection, newText);
        });
    };

    context.subscriptions.push(vscode.commands.registerCommand(commandId, commandHandler));
}
