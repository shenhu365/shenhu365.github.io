# Shen Hu（胡深）的个人学术主页

包含个人介绍、论文、获奖与学术服务，使用原生 HTML、CSS 和 JavaScript，部署于 GitHub Pages。

[线上主页](https://shenhu365.github.io/) · [论文](https://shenhu365.github.io/publications/) · [获奖](https://shenhu365.github.io/awards/) · [GitHub 仓库](https://github.com/shenhu365/shenhu365.github.io)

## 本地预览

需要 Node.js 20+，无需安装依赖。在项目根目录运行：

```sh
cd /Users/hushen/Documents/ChatGPT/scholarpage
npm run dev
```

打开 <http://127.0.0.1:4173/>，修改后刷新页面。

## 日常维护

日常统一在 `/Users/hushen/Documents/ChatGPT/scholarpage` 的 `main` 分支维护、预览和提交。其他版本保留为 Git 分支，不另设常驻工作目录；维护前先阅读 [AGENTS.md](AGENTS.md)。

- `data.js`：个人资料、学术服务、奖项与论文。
- `people.js`：人物主页链接。
- `styles.css`：页面样式。
- `main` 维护和部署蓝灰版；白底方案保留在 `codex/white-ui-redesign`，尚未合入或上线。分支后续提交的同步状态以 Git 为准。
- 蓝灰快照保留在 `codex/blue-ui-backup`，极简版保留在 `codex/minimal-backup`。

论文或人物配置变化后，先运行 `npm run sync`。推送前检查：

```sh
git branch --show-current
npm run check
git diff --check
```

决定发布时，检查通过后提交改动，执行 `git push origin main` 自动触发部署，在 [Actions](https://github.com/shenhu365/shenhu365.github.io/actions) 查看结果。

## 文档

- [维护指南](MAINTENANCE.md)：配置、内容同步、排版、完整提交部署步骤与排障。
- [智能体项目说明](AGENTS.md)：交接约定与文档同步要求。
- [资料来源](SOURCE_NOTES.md)：个人资料、论文及资源的来源记录。
