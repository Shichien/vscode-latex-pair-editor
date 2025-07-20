# vscode-latex-pair-editor

LaTeX-Pair-Editor will enhance your editing when writing LaTeX pair environments, such as `\begin` and `\end`.

## Features

### ✨ Synchronized Environment Name Editing

Simply place your cursor inside an environment name, and a second cursor will automatically appear in the corresponding tag, allowing you to edit both simultaneously.

<img src="assets/readme/click_code.gif" width="75%" alt="LaTeX-Pair-Editor-Demo">

### 🚀 Support Vim Multi-Cursor Edit Mode

In fact, we just created a new cursor, so multi-cursor is supported.

<img src="assets/readme/vim_delete.gif" width="75%" alt="Cursor-Edit-Mode">

## Usage Instructions

* **How to use :** Click inside the environment name, for example, the word `itemize` in `\begin{itemize}`.
* **Supported Tags:** Works with any environment in `\begin{...}` and `\end{{...}`.

## Installing

1. VSCode Version > $1.75.0$ (For future development)

Options:

1. Via VSCode Plugin Market
2. Via `.vsix`
    1. In VSCode, go to `Extensions View`
    2. Select `Views and More Actions...`
    3. Select `Install from VSIX...`
3. From cli:

```bash
# if you use VS Code
code --install-extension latex-pair-editor-0.0.2.vsix

# if you use VS Code Insiders
code-insiders --install-extension latex-pair-editor-0.0.2.vsix
```

## Extension Settings

LaTeX-Pair-Editor will be configurable in the future.

## Release Notes

### Version 0.0.1

First Version, Initial Commit, Using RegExp to recognize environments.

### Version 0.0.2

Rewrite docs, Github Synchronous

---
