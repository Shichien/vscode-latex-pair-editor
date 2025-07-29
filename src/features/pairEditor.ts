import * as vscode from "vscode";

// Begin and end command pair's indexes, and their environment names.
interface LatexPair {
    beginIndex: number;
    endIndex: number;
    beginCommandLine: string;
    endCommandLine: string;
}

// 分析整个文档内容，找出所有匹配的 \begin{} 和 \end{} 对。
function findMatchingPairs(content: string): LatexPair[] {
    const tagRegex = /\\(begin|end)\{([a-zA-Z0-9*]+)\}/g;
    const stack: {
        envName: string;
        envIndex: number;
        fullMatchString: string;
    }[] = [];
    const pairs: LatexPair[] = [];

    let match: RegExpExecArray | null;
    while ((match = tagRegex.exec(content)) !== null) {
        const nowFullMatchString = match[0]; // Full matched tag, e.g., \begin{env} or \end{env}
        const nowBeginOrEnd = match[1]; // 'begin' or 'end'
        const nowEnvName = match[2]; // Environment name, e.g., 'env'
        const nowIndex = match.index;
        if (nowBeginOrEnd === "begin") {
            stack.push({
                envName: nowEnvName,
                envIndex: nowIndex,
                fullMatchString: nowFullMatchString
            });
        } else if (nowBeginOrEnd === "end" && stack.length > 0) {
            if (stack[stack.length - 1].envName === nowEnvName) {
                const beginPair = stack.pop()!;
                pairs.push({
                    beginIndex: beginPair.envIndex,
                    endIndex: nowIndex,
                    beginCommandLine: beginPair.fullMatchString,
                    endCommandLine: nowFullMatchString
                });
            }
        }
    }
    return pairs;
}

function isInBeginCommand(pair: LatexPair, cursorIndex: number): boolean {
    return cursorIndex > pair.beginIndex + 6 && cursorIndex < pair.beginIndex + pair.beginCommandLine.length - 1;
}

function isInEndCommand(pair: LatexPair, cursorIndex: number): boolean {
    return cursorIndex > pair.endIndex + 4 && cursorIndex < pair.endIndex + pair.endCommandLine.length - 1;
}

function onHandleSelectionChange(event: vscode.TextEditorSelectionChangeEvent): void {
    const editor = event.textEditor;

    // 该插件仅在单光标、非选择状态下触发
    if (editor.selections.length > 1 || !editor.selection.isEmpty) {
        return;
    }

    const doc = editor.document;
    const content = doc.getText();
    const pairs = findMatchingPairs(content);

    // 1. Get the current cursor position pair (line, column)
    // 2. Get the current cursor offset in the document
    const cursorPosition = editor.selection.active;
    const cursorIndex = doc.offsetAt(cursorPosition);

    let newCursorIndex = 0;
    for (const pair of pairs) {
        if (isInBeginCommand(pair, cursorIndex)) {
            newCursorIndex = pair.endIndex + 4 + (cursorIndex - (pair.beginIndex + 6));
            console.log("Cursor is in begin command, new index: ", newCursorIndex);
        } else if (isInEndCommand(pair, cursorIndex)) {
            newCursorIndex = pair.beginIndex + 6 + (cursorIndex - (pair.endIndex + 4));
            console.log("Cursor is in end command, new index: ", newCursorIndex);
        }

        if (isInBeginCommand(pair, cursorIndex) || isInEndCommand(pair, cursorIndex)) {
            const targetPosition = doc.positionAt(newCursorIndex);
            const newCursor = new vscode.Selection(targetPosition, targetPosition);
            editor.selections = [editor.selection, newCursor];
            break;
        }
    }
}

export function registerTagJumping(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.window.onDidChangeTextEditorSelection(onHandleSelectionChange));
}
