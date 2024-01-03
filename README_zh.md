[English](README.md) | 中文

# 简介

欢迎使用 CBox！

CBox 是一个在任意页面唤醒命令行面板，快速导航/指令/搜索的 Chrome 插件。

![CBox Demo](full-demo.gif)

[演示视频](https://www.youtube.com/watch?v=cHfkT2OMwtc)

# 本地开发

首先，运行 `pnpm i` 来安装依赖项。

然后，运行 `pnpm dev` 来启动开发服务器

# 下载

> 请注意，在初始安装后，需要刷新页面才能激活扩展，因为 Chrome 的内容脚本只能在页面加载时注入。

- [直接下载最新版本](https://pub-920f359544474b16a950b92ed0f6613e.r2.dev/cbox-1.0.3.zip)
- [Chrome Web Store](https://chromewebstore.google.com/detail/cbox/cekckmkolmlobfidedolgcppfgbinhmc?hl=en)

# 功能

- 🌐 完全离线，无需互联网连接。
- ⌨️ 可以在任意页面唤醒。
- ⏰ 最近激活的标签
- 🔍 从打开的标签页、书签和浏览历史（最多 30 天和最多 1000 个条目）中快速搜索和跳转/打开标签页。
- 🔎 快速搜索并跳转到不同的搜索引擎。
- ⚙️ 轻松执行各种浏览器操作。
- ⌨️ 自定义快捷键

# 使用方法

在任何页面上，按下 `Ctrl` + `Shift` + `K` 打开命令框。

如果没有给出特定的命令，它将默认在所有功能和页面上进行搜索。

要进行更精确的搜索或执行特定的操作，可以使用以下命令：

| 命令 | 描述                              | 示例                    |
|------|-------------------------------------|------------------------|
| `@`  | 🌐 启用快速搜索                         | `@g openai`            |
| `>`  | ⚡️ 启用快速命令                         | `>gb`                  |
| `/b` | 🔖 仅搜索书签                           | `/b xxx`               |
| `/o` | 📂 仅搜索打开的标签页                     | `/o xxx`               |
| `/h` | ⏰ 仅搜索浏览历史记录                     | `/h xxx`               |


# 高级使用

还可以利用 [Fuse.js 扩展搜索](https://www.fusejs.io/examples.html#extended-search) 来进行更高级的搜索功能。

| Token       | 匹配类型         | 描述                    |
| ----------- | ---------------- | ----------------------- |
| `jscript`   | 模糊匹配         | 模糊匹配 `jscript` 的项 |
| `=scheme`   | 精确匹配         | 是 `scheme` 的项        |
| `'python`   | 包含匹配         | 包含 `python` 的项      |
| `!ruby`     | 反向精确匹配     | 不包含 `ruby` 的项      |
| `^java`     | 前缀精确匹配     | 以 `java` 开头的项      |
| `!^earlang` | 反向前缀精确匹配 | 不以 `earlang` 开头的项 |
| `.js$`      | 后缀精确匹配     | 以 `.js` 结尾的项       |
| `!.go$`     | 反向后缀精确匹配 | 不以 `.go` 结尾的项     |

# 联系方式

如果您有任何问题或建议，可以发起Issue或与我联系：

- [电子邮件](mailto:xiaodong.fun@gmail.com)
- [Twitter](https://twitter.com/guageaaa)
