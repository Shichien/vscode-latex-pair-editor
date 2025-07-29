import * as vscode from "vscode";

export function registerUnwrapEnvironmentCommand(context: vscode.ExtensionContext) {
    const commandId = "latex-pair-editor.unwrapEnvironment"; // 使用您插件的真实名称

    const commandHandler = () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }

        const selection = editor.selection;
        // 注意：这里我们允许选区为空，因为用户可能只想把光标放在环境内来触发
        // 但为了简化，我们先要求用户必须选中整个环境
        if (selection.isEmpty) {
            vscode.window.showWarningMessage("请完整选中需要取消包裹的 LaTeX 环境。");
            return;
        }

        const selectedText = editor.document.getText(selection);
        const lines = selectedText.split(/\r?\n/);

        // 验证选区是否为一个有效的环境
        const firstLine = lines[0].trim();
        const lastLine = lines[lines.length - 1].trim();

        if (!firstLine.startsWith("\\begin{") || !lastLine.startsWith("\\end{")) {
            vscode.window.showWarningMessage("选区似乎不是一个有效的 LaTeX 环境。请确保选中了 \\begin 和 \\end。");
            return;
        }

        // 移除 \begin{} 和 \end{} 行，只保留中间的内容
        const innerLines = lines.slice(1, -1);

        // 清理每一行的 \item 和前导缩进
        const unwrappedLines = innerLines.map((line) => {
            // 使用正则表达式替换行首的缩进、\item 和一个可选的空格
            // \s* 匹配任意个空白字符（空格、tab等）
            // \\item 匹配 \item
            // \s? 匹配一个可选的空格
            return line.replace(/^\s*\\item\s?/, "");
        });

        const newText = unwrappedLines.join("\n");

        editor.edit((editBuilder) => {
            editBuilder.replace(selection, newText);
        });
    };

    context.subscriptions.push(vscode.commands.registerCommand(commandId, commandHandler));
}
