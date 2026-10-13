# 胡深的个人学术主页

两页极简学术网站，使用原生 HTML、CSS 和 JavaScript，无第三方运行依赖或构建步骤。首页展示个人资料、连续排列的中英文简介、Academic Service 和 Contact；Publications 页按年份展示论文，仅提供 Paper 和已有的 PDF 链接，不显示 Code 或 BibTeX。

- 线上地址：[shenhu365.github.io](https://shenhu365.github.io/)
- 仓库：[shenhu365/shenhu365.github.io](https://github.com/shenhu365/shenhu365.github.io)，发布分支为 `main`。
- 交给新 AI 接手时，先读根目录 [AGENTS.md](AGENTS.md) 和本 README。`AGENTS.md` 是唯一的智能体项目说明，本文件负责日常维护和发布指引。

## 本地预览

需要 Node.js 20 或更新版本，无需执行 `npm install`。在项目根目录运行：

```sh
npm run dev
```

打开[首页](http://127.0.0.1:4173/)和[论文页](http://127.0.0.1:4173/publications.html)。修改网页或数据后刷新浏览器；修改预览服务器脚本会触发 Node.js 自动重启。终端按 `Ctrl+C` 停止服务。

验证 GitHub 项目仓库子目录路径时，可另开端口：

```sh
npm run dev -- --base /scholarpage/ --port 4174
```

对应地址是 <http://127.0.0.1:4174/scholarpage/> 和 <http://127.0.0.1:4174/scholarpage/publications.html>。当前正式站部署在域名根目录，不需要这个 `--base` 参数。

## 文件与配置入口

| 文件 | 维护内容 |
| --- | --- |
| `people.js` | `window.SITE_PEOPLE`：人物主页 URL 的唯一配置入口及姓名别名 |
| `data.js` | `window.SITE_DATA`：个人资料、双语简介、学术服务、论文 |
| `index.html` | 首页结构、静态回退内容、页面元数据 |
| `publications.html` | 论文页结构、年份导航容器、静态个人资料和页面元数据 |
| `app.js` | 共享渲染、人物自动链接、论文分组与年份导航 |
| `styles.css` | 两页共享的布局、字体、颜色和响应式样式 |
| `assets/` | 头像、图标、PDF 等公开静态资源 |
| `scripts/serve.mjs` / `scripts/check.mjs` | 本地预览 / 离线检查 |
| `.github/workflows/pages.yml` | 检查和 GitHub Pages 发布流程 |
| `SOURCE_NOTES.md` | 资料和论文的来源记录；不作为运行时配置或另一份操作手册 |

资料和论文由本地数据维护，不会在访客打开页面时自动抓取 Google Scholar。

## 常见内容更新

**个人资料与简介：** 修改 `data.js` 的 `profile`。简介使用 `profile.about.en` 和 `profile.about.zh`，两种语言应同步更新，并同步 `index.html` 中 `[data-bio]` 的静态回退文字。姓名、单位、身份、联系方式或头像变化时，同时检查两页 HTML 中的静态个人资料、图片 `alt`、`title`、description 和 Open Graph 元数据；这些内容不会全部随数据自动更新。

**学术服务：** 修改 `data.js` 的 `services`，并同步首页静态列表。页面使用英文职务名称，当前为 IJCAI 2026 Program Committee Member 和 ICLR 2027 Reviewer。

**新增论文：** 在 `data.js` 的 `publications` 数组中添加一条对象；下面是格式示例，发布前将示例内容和地址全部替换为真实信息：

```js
{
  id: 'unique-paper-id',
  title: 'Full paper title',
  authors: ['Shen Hu', 'Full Name of Every Coauthor'],
  year: 2027,
  venue: 'Venue abbreviation',
  venueFull: 'Full conference or journal name',
  url: 'https://example.org/paper',
  pdf: ''
}
```

`id` 必须唯一，建议使用英文小写字母、数字和连字符；作者按原论文顺序完整填写，不用 `et al.` 代替。`year` 使用数字，`url` 填原始论文页面，`pdf` 无可靠地址时留空。年份分组和导航自动生成，同一年内沿用数组顺序。只需维护 Paper/PDF；遗留的 `code` 等字段不会显示，也无需为新论文添加。事实或来源有变化时同步 `SOURCE_NOTES.md`。

## 人物主页只在 people.js 修改

导师和合作者主页每人只维护一个 `url`，中文名和其他写法放入该条目的 `aliases`。当前配置如下：

```js
window.SITE_PEOPLE = {
  'Yuhua Qian': {
    url: 'https://dig.sxu.edu.cn/qyh/index.htm',
    aliases: ['钱宇华']
  },
  'Xinyan Liang': {
    url: 'https://xinyanliang.github.io/',
    aliases: ['梁新彦']
  }
};
```

简介和论文作者中的匹配姓名会自动添加链接，姓名与别名需使用一致的写法；不要把同一别名分给不同人物。未配置人物或 `url` 留空时保留普通文本，不在 `data.js`、HTML 或 `app.js` 中重复写人物主页 URL。历史来源记录中的链接可以保留。

其他页面文字可显式复用配置，标签内容就是显示文字：

```html
<span data-person="Yuhua Qian">钱宇华</span>
<span data-person="梁新彦">梁新彦</span>
```

共享脚本按以下顺序加载：

```html
<script src="./people.js" defer></script>
<script src="./data.js" defer></script>
<script src="./app.js" defer></script>
```

## 修改后的检查与同步

先运行：

```sh
npm run check
```

它检查 JavaScript 语法、资料与人物配置、别名冲突、HTML 中的脚本加载顺序、静态链接和锚点、CSS/数据中的资源引用、静态 JSON-LD，以及部署路径。检查完全离线，不验证外部网址是否可访问，也不执行浏览器 DOM 渲染。

页面、数据或交互改变时，按影响范围在浏览器验证相关页面、手机窄屏布局、论文显示、年份跳转、人物中英文别名及 Paper/PDF 链接。仅修改文档时核对命令、路径和代码事实，无需重复浏览器验证。运行时生成的年份锚点、人物链接与 JSON-LD 不应仅凭离线检查通过就视为已验证。

新增页面或根目录资源时，同步以下位置：

| 同步位置 | 要做的事 |
| --- | --- |
| `scripts/serve.mjs` 的 `allowed` | 允许本地预览访问新页面或根目录文件 |
| `scripts/check.mjs` 的 `pageFiles` / `staticFiles` | 新页面加入 `pageFiles`；新根目录资源加入 `staticFiles`。新增 JS 还应加入语法检查清单 |
| `.github/workflows/pages.yml` 的复制命令 | 将新页面或根目录文件加入 `_site` 发布清单 |

放在 `assets/` 内的资源已由目录整体覆盖，无需逐个加入清单。本地引用使用 `./assets/文件名` 等相对路径，避免以 `/` 开头。新 HTML 页面还需加载上述共享脚本并补上适当导航。

每轮修改都要同步相关说明：用法和字段变化更新 README，项目约定变化更新根 `AGENTS.md`，事实和来源变化更新 `SOURCE_NOTES.md`。只维护受影响的内容，不把同一套说明复制到多个 AI 专用文件。

不同 AI 工具不一定自动读取 `AGENTS.md`。可复制以下提示词，并在末尾追加具体需求：

> 先读取并遵循根目录 AGENTS.md 和 README.md。按我的需求修改项目、完成适当检查，并在本轮同步维护相关说明。不要只改实现而留下过时文档。

## 推送与发布

当前仓库已配置 `origin` 为 `https://github.com/shenhu365/shenhu365.github.io.git`，使用 `main` 分支。首次启用时确认一次仓库 **Settings → Pages → Source = GitHub Actions**；后续正常更新无需重新设置。

1. 在项目根目录完成检查，并按上节做浏览器验证：

   ```sh
   npm run check
   ```

2. 确认当前位于 `main`，检查本次改动，只纳入准备发布的文件：

   ```sh
   git status
   git diff
   ```

3. 确认所有改动都属于本次更新后暂存并提交；若有无关文件，把 `git add .` 换成具体文件名：

   ```sh
   git add .
   git diff --cached --stat
   git commit -m "Update academic homepage"
   ```

4. 推送已检查的提交：

   ```sh
   git push origin main
   ```

推送会自动触发 [Deploy academic homepage](https://github.com/shenhu365/shenhu365.github.io/actions) 工作流，无需再手动 Run workflow。等待检查和部署成功，再打开[线上主页](https://shenhu365.github.io/)确认更新。工作流只发布清单中的静态文件和 `assets/`，不会发布 README、AGENTS 或来源笔记。

推送报错时先查看原因，处理登录、网络或远端新增提交后再尝试；不要用 `--force` 覆盖远端记录。

## 常见问题

- **4173 端口被占用，或浏览器仍显示旧版：** 在启动旧服务的终端按 `Ctrl+C`，从当前项目目录重新运行 `npm run dev` 并刷新页面。旧版非 watch 进程不会随服务器脚本更新；不确定时用 `npm run dev -- --port 4174` 启动新服务并访问对应端口。
- **新页面或文件返回 404：** 检查路径与文件名大小写、浏览器端口及 `--base` 是否正确，再核对上面的预览白名单、检查清单与 Pages 复制清单。macOS 本地可能忽略大小写，GitHub Pages 不会。
- **本地正常，线上没变化：** 查看 Actions 中最近提交是否部署成功，再刷新浏览器。若新增文件未纳入 Git 或发布清单，先修正并重新推送。
