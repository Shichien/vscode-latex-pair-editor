import * as assert from "assert";
import * as vscode from "vscode";
import { after, afterEach } from "mocha";

suite("Extension Test Suite", () => {
    vscode.window.showInformationMessage("Start all tests.");

    afterEach(async () => {
        // 清理工作：确保每个测试后都重置状态
        await vscode.commands.executeCommand(
            "workbench.action.closeActiveEditor"
        );
    });

    // Function must be async to use await, VSCode API calls are often asynchronous.
    suite("Wrapping Commands Test", () => {
        test("Wrap in Itemize Command", async () => {
            const initContent = "Item 1\nItem 2\nItem 3";
            const expectedContent = [
                "\\begin{itemize}",
                "    \\item Item 1",
                "    \\item Item 2",
                "    \\item Item 3",
                "\\end{itemize}"
            ].join("\n");

            const doc = await vscode.workspace.openTextDocument({
                language: "latex",
                content: initContent
            });
            const editor = await vscode.window.showTextDocument(doc);
            const vscodeRange = new vscode.Range(
                doc.positionAt(0),
                doc.positionAt(initContent.length)
            );
            editor.selection = new vscode.Selection(
                vscodeRange.start,
                vscodeRange.end
            );

            await vscode.commands.executeCommand(
                "latex-pair-editor.wrapInItemize"
            );
            assert.strictEqual(editor.document.getText(), expectedContent);
        });

        test("Wrap in Enumerate Command", async () => {
            const initContent = "Item 1\nItem 2\nItem 3";
            const expectedContent = [
                "\\begin{enumerate}",
                "    \\item Item 1",
                "    \\item Item 2",
                "    \\item Item 3",
                "\\end{enumerate}"
            ].join("\n");

            const doc = await vscode.workspace.openTextDocument({
                language: "latex",
                content: initContent
            });
            const editor = await vscode.window.showTextDocument(doc);
            const vscodeRange = new vscode.Range(
                doc.positionAt(0),
                doc.positionAt(initContent.length)
            );
            editor.selection = new vscode.Selection(
                vscodeRange.start,
                vscodeRange.end
            );

            await vscode.commands.executeCommand(
                "latex-pair-editor.wrapInEnumerate"
            );
            assert.strictEqual(editor.document.getText(), expectedContent);
        });

        test("Remove empty lines before itemize wrapping", async () => {
            const initContent = "First item\n\nThird item";
            const expectedContent = [
                "\\begin{itemize}",
                "    \\item First item",
                "    \\item Third item",
                "\\end{itemize}"
            ].join("\n");

            const doc = await vscode.workspace.openTextDocument({
                language: "latex",
                content: initContent
            });
            const editor = await vscode.window.showTextDocument(doc);
            editor.selection = new vscode.Selection(
                doc.positionAt(0),
                doc.positionAt(initContent.length)
            );

            await vscode.commands.executeCommand(
                "latex-pair-editor.wrapInItemize"
            );
            assert.strictEqual(editor.document.getText(), expectedContent);
        });
    });
});
