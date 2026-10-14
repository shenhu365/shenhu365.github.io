# Shen Hu（胡深）的个人学术主页

包含个人介绍、论文、获奖与学术服务，使用原生 HTML、CSS 和 JavaScript，部署于 GitHub Pages。

[线上主页](https://shenhu365.github.io/) · [论文](https://shenhu365.github.io/publications/) · [获奖](https://shenhu365.github.io/awards/) · [GitHub 仓库](https://github.com/shenhu365/shenhu365.github.io)

## 本地预览

需要 Node.js 20+，无需安装依赖。在项目根目录运行：

```sh
npm run dev
```

打开 <http://127.0.0.1:4173/>，修改后刷新页面。

## 日常维护

- `data.js`：个人资料、学术服务、奖项与论文。
- `people.js`：人物主页链接。
- `styles.css`：页面样式。
- 正式站使用 `main`；白底版本保存在本地分支 `codex/white-ui-redesign`，暂不上线。
- 蓝灰版保留在 `codex/blue-ui-backup`，极简版保留在 `codex/minimal-backup`。

论文或人物配置变化后，先运行 `npm run sync`。推送前检查：

```sh
npm run check
git diff --check
```

白底方案确认后，按[维护指南](MAINTENANCE.md#白底方案合入与发布)提交并合入 `main`，再推送部署。日常在 `main` 的改动检查、提交后，执行 `git push origin main`；在 [Actions](https://github.com/shenhu365/shenhu365.github.io/actions) 查看结果。

## 文档

- [维护指南](MAINTENANCE.md)：配置、内容同步、排版、完整提交部署步骤与排障。
- [智能体项目说明](AGENTS.md)：交接约定与文档同步要求。
- [资料来源](SOURCE_NOTES.md)：个人资料、论文及资源的来源记录。
