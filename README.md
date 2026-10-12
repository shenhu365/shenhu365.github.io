# 个人学术主页

适合 GitHub Pages 的静态个人学术主页。使用原生 HTML、CSS 和 JavaScript，无运行依赖、数据库或构建步骤。

## 本地预览

安装 Node.js 20 或更新版本后，在项目目录运行：

```sh
npm run dev
```

浏览器打开 <http://127.0.0.1:4173/>。无需执行 `npm install`。修改文件后刷新页面即可。

发布前运行离线检查：

```sh
npm run check
```

检查范围包括 JavaScript 语法、资料数据、JSON-LD、本地链接与资源，以及 GitHub Pages 子目录兼容性。外部论文链接的在线可访问性不在此检查范围内。

模拟项目仓库的子目录地址：

```sh
npm run dev -- --base /scholarpage/ --port 4174
```

然后打开 <http://127.0.0.1:4174/scholarpage/>。预览服务只监听本机，不用于生产托管。

## 修改资料和界面

| 文件 | 内容 |
| --- | --- |
| `data.js` | `window.SITE_DATA`：个人资料与论文数据 |
| `index.html` | 页面结构、搜索引擎信息和无脚本提示 |
| `styles.css` | 颜色、字体、间距、布局与响应式样式 |
| `app.js` | 页面交互与数据展示 |
| `assets/` | 头像、论文配图、图标及其他本地公开资源 |

日常更新优先编辑 `data.js` 中已有字段与条目：

- `profile`：姓名、中英文介绍、单位、导师、邮箱、头像及个人链接。`github`、`cv` 留空时不显示相应入口。
- `education`：学习经历和起止时间。
- `research`：研究方向及中英文描述。
- `publications`：论文标题、作者、年份、会议或期刊、分类、链接和配图。

保留 JavaScript 对象格式，修改后运行 `npm run check`。头像、联系方式和 CV 应只填写你确认公开的信息；没有提供的资料不应猜测。若添加头像或 CV，请将文件放入 `assets/`，再填写 `profile.portrait` 或 `profile.cv` 的实际相对路径。中英文文本请同步更新。

本地路径使用 `assets/文件名` 或 `./assets/文件名`，避免 `/assets/文件名` 这类以斜杠开头的地址。这样主页既可部署到 `用户名.github.io`，也可部署到 `用户名.github.io/仓库名/`，无需修改部署路径。

谷歌学术资料入口：<https://scholar.google.com/citations?user=Q31HAAcAAAAJ>。论文列表由本地数据维护，不会在访客打开页面时自动抓取 Google Scholar。

## 部署到 GitHub Pages

1. 在 GitHub 创建仓库，把当前项目上传到默认分支 `main`。
2. 打开仓库的 **Settings → Pages**，将 **Build and deployment → Source** 设为 **GitHub Actions**。
3. 向 `main` 推送提交，或在 **Actions → Deploy academic homepage → Run workflow** 手动触发。
4. 等待工作流完成，通过工作流中的部署地址或 Settings → Pages 页面打开主页。

以你的账号为例，普通项目仓库的地址为 `https://shenhu365.github.io/仓库名/`；如果仓库名为 `shenhu365.github.io`，主页地址就是 `https://shenhu365.github.io/`。如果默认分支不是 `main`，请同步调整 `.github/workflows/pages.yml` 中的分支名。

工作流先执行离线检查，再将 `index.html`、`styles.css`、`app.js`、`data.js`、`assets/` 和 `.nojekyll` 上传为静态站点；开发脚本与 README 不会发布到站点。后续每次推送到 `main` 都会重新部署。

已准备好部署配置，当前没有创建远程仓库，也没有发布站点。GitHub 设置说明可参考[官方自定义 Pages 工作流文档](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)。

## 资料与设计

暖白与墨绿配色、衬线标题，支持中英文、深浅色模式、手机导航、论文主题筛选与搜索、BibTeX 复制和下载。界面默认英文，语言和主题偏好在浏览器本地保存。

个人研究主线按你提供的“大模型驱动的演化数据智能（AI 科学家智能体系统）”呈现。来源与论文核验记录见 `SOURCE_NOTES.md`。四幅论文配图为原创概念示意，不是原论文实验结果。

离线检查和实际浏览器检查已完成，覆盖桌面、390px/320px 手机宽度、项目子路径、主题/语言切换、搜索筛选、引用复制与下载及移动导航。后续新增内容仍应重新检查。
