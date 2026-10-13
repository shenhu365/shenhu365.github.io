# 个人学术主页

适合 GitHub Pages 的两页极简学术网站。使用原生 HTML、CSS 和 JavaScript，无运行依赖、数据库或构建步骤。

首页左侧展示头像、身份和个人链接，右侧依次展示英文简介、中文简介、Academic Service 与 Contact。独立的 Publications 页面使用论文文本列表，仅提供 Paper 和已有的 PDF 链接。

## 本地预览

安装 Node.js 20 或更新版本后，在项目目录运行：

```sh
npm run dev
```

浏览器打开首页 <http://127.0.0.1:4173/>，或论文页 <http://127.0.0.1:4173/publications.html>。无需执行 `npm install`。修改网页文件后刷新页面即可；修改预览服务器脚本时，Node.js 会自动重启服务。已启动的旧版服务需要先按 Ctrl+C 退出，再运行此命令，才能启用新的路由或自动重启功能。

发布前运行离线检查：

```sh
npm run check
```

检查范围包括两页 HTML 的本地链接和锚点、JavaScript 语法、资料数据、JSON-LD、本地资源，以及 GitHub Pages 子目录兼容性。检查完全离线，不会请求外部论文地址。

模拟项目仓库的子目录地址：

```sh
npm run dev -- --base /scholarpage/ --port 4174
```

然后打开首页 <http://127.0.0.1:4174/scholarpage/> 和论文页 <http://127.0.0.1:4174/scholarpage/publications.html>。预览服务只监听本机，不用于生产托管。

## 修改资料和界面

| 文件 | 内容 |
| --- | --- |
| `data.js` | `window.SITE_DATA`：个人资料、学术服务与论文数据 |
| `index.html` | 首页结构：身份、双语简介、学术服务和联系方式 |
| `publications.html` | 独立论文页与页面导航 |
| `styles.css` | 颜色、字体、间距、布局与响应式样式 |
| `app.js` | 两页共享的资料与论文列表渲染 |
| `assets/` | 头像、图标及其他本地公开资源 |

日常更新优先编辑 `data.js` 中已有字段与条目：

- `profile`：姓名、中英文介绍、单位、导师、邮箱、头像及个人链接。
- `services`：学术服务记录；页面使用各会议的英文职务名称，例如 IJCAI 2026 Program Committee Member、ICLR 2027 Reviewer。
- `publications`：论文标题、作者、年份、会议或期刊及 Paper、PDF 链接。未提供的链接留空；`code` 字段可保留备查，页面暂不展示。

保留 JavaScript 对象格式，修改后运行 `npm run check`。头像与联系方式应填写你确认公开的信息。更换头像时，将文件放入 `assets/`，再填写 `profile.portrait` 的实际相对路径。首页直接连续呈现两种语言，请同步更新中英文简介。

本地路径使用 `assets/文件名` 或 `./assets/文件名`，避免 `/assets/文件名` 这类以斜杠开头的地址。这样主页既可部署到 `用户名.github.io`，也可部署到 `用户名.github.io/仓库名/`，无需修改部署路径。

谷歌学术资料入口：<https://scholar.google.com/citations?user=Q31HAAcAAAAJ>。论文列表由本地数据维护，不会在访客打开页面时自动抓取 Google Scholar。

## 部署到 GitHub Pages

1. 在 GitHub 创建仓库，把当前项目上传到默认分支 `main`。
2. 打开仓库的 **Settings → Pages**，将 **Build and deployment → Source** 设为 **GitHub Actions**。
3. 向 `main` 推送提交，或在 **Actions → Deploy academic homepage → Run workflow** 手动触发。
4. 等待工作流完成，通过工作流中的部署地址或 Settings → Pages 页面打开主页。

以你的账号为例，普通项目仓库的地址为 `https://shenhu365.github.io/仓库名/`；如果仓库名为 `shenhu365.github.io`，主页地址就是 `https://shenhu365.github.io/`。如果默认分支不是 `main`，请同步调整 `.github/workflows/pages.yml` 中的分支名。

工作流先执行离线检查，再将 `index.html`、`publications.html`、`styles.css`、`app.js`、`data.js`、`assets/` 和 `.nojekyll` 上传为静态站点；开发脚本与 README 不会发布到站点。后续每次推送到 `main` 都会重新部署。

GitHub 设置说明可参考[官方自定义 Pages 工作流文档](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)。
