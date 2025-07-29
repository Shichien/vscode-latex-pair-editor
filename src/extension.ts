import * as vscode from "vscode";
import { registerTagJumping } from "./features/pairEditor";
import { registerWrapInItemizeCommand } from "./commands/wrapInItemize";
import { registerWrapInEnumerateCommand } from "./commands/wrapInEnumerate";
import { registerUnwrapEnvironmentCommand } from "./commands/unwrapEnvironment";

export function activate(context: vscode.ExtensionContext) {
    registerTagJumping(context);
    registerWrapInItemizeCommand(context);
    registerWrapInEnumerateCommand(context);
    registerUnwrapEnvironmentCommand(context);
}

// Deactivate Event 全权交给 VSCode 进行管理（Subscriptions）
export function deactivate(): void {}
