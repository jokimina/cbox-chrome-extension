English | [中文](README_zh.md)

# Introduction

Welcome to CBox!

CBox is a Chrome extension that allows you to summon a command-line panel on any webpage for quick navigation, commands, and searches.

![CBox Demo](demo.gif)

[Demo Video](https://www.youtube.com/watch?v=BBfVHPorl94)

# Local Development

First, run `pnpm i` to install the dependencies.

Then, run `pnpm dev` to start.

# Download

> Please note that after the initial installation, you will need to refresh the page to activate it because Chrome content scripts can only be injected during page load.

- [Download the latest version](https://pub-920f359544474b16a950b92ed0f6613e.r2.dev/cbox-1.0.3.zip)
- [Chrome Web Store](https://chromewebstore.google.com/detail/cbox/cekckmkolmlobfidedolgcppfgbinhmc?hl=en)

# Features

- 🌐 Fully offline, no internet connection required.
- ⌨️ You can wake it up on any page.
- ⏰ Recently active tabs
- 🔍 Search and quickly jump/open tabs from your open tabs, bookmarks, and browsing history (up to 7 days and a maximum of 500 entries).
- 🔎 Quickly search and jump to different search engines.
- ⚙️ Perform various browser operations with ease.

# Usage

At any page, press `Ctrl` + `Shift` + `K` to open the command box.

If no specific command is given, it will search across all features and pages by default.

For more precise searches or specific actions, you can use the following commands:

| Command | Description                     | Example     |
| ------- | ------------------------------- | ----------- |
| `@`     | 🌐 Activate quick search        | `@g openai` |
| `>`     | ⚡️ Activate quick commands      | `>gb`       |
| `/b`    | 🔖 Search only bookmarks        | `/b xxx`    |
| `/o`    | 📂 Search only open tabs        | `/o xxx`    |
| `/h`    | ⏰ Search only browsing history | `/h xxx`    |

# Advanced Usage

You can also take advantage of [Fuse.js Extended Search](https://www.fusejs.io/examples.html#extended-search) for more advanced search capabilities.

| Token       | Match type                 | Description                            |
| ----------- | -------------------------- | -------------------------------------- |
| `jscript`   | fuzzy-match                | Items that fuzzy match `jscript`       |
| `=scheme`   | exact-match                | Items that are `scheme`                |
| `'python`   | include-match              | Items that include `python`            |
| `!ruby`     | inverse-exact-match        | Items that do not include `ruby`       |
| `^java`     | prefix-exact-match         | Items that start with `java`           |
| `!^earlang` | inverse-prefix-exact-match | Items that do not start with `earlang` |
| `.js$`      | suffix-exact-match         | Items that end with `.js`              |
| `!.go$`     | inverse-suffix-exact-match | Items that do not end with `.go`       |

# Contact

If you have any questions or suggestions, you can open an issue or contact me via:

- [Email](mailto:xiaodong.fun@gmail.com)
- [Twitter](https://twitter.com/guageaaa)

# Contributing

Contributions are welcome!
