# 胡深的个人学术主页

两页极简学术网站，使用原生 HTML、CSS 和 JavaScript，无前端框架依赖或站点编译打包。首页展示个人资料、中英文简介、独立的 Publications 概述栏目、Academic Service 和仅含邮箱的 Contact；Publications 页按年份展示论文，仅提供 Paper 和已有的 PDF 链接，不显示 Code 或 BibTeX。论文静态 HTML 由本地同步命令更新并提交，禁用 JavaScript 时也能阅读。

- 线上地址：[shenhu365.github.io](https://shenhu365.github.io/)
- 仓库：[shenhu365/shenhu365.github.io](https://github.com/shenhu365/shenhu365.github.io)，发布分支为 `main`。
- 交给新 AI 接手时，先读根目录 [AGENTS.md](AGENTS.md) 和本 README。`AGENTS.md` 是唯一的智能体项目说明，本文件负责日常维护和发布指引。

## 本地预览

需要 Node.js 20 或更新版本，无需执行 `npm install`。在项目根目录运行：

```sh
npm run dev
```

打开[首页](http://127.0.0.1:4173/)和[论文页](http://127.0.0.1:4173/publications/)。修改网页或数据后刷新浏览器；修改预览服务器脚本会触发 Node.js 自动重启。终端按 `Ctrl+C` 停止服务。

验证 GitHub 项目仓库子目录路径时，可另开端口：

```sh
npm run dev -- --base /scholarpage/ --port 4174
```

对应地址是 <http://127.0.0.1:4174/scholarpage/> 和 <http://127.0.0.1:4174/scholarpage/publications/>。当前正式站部署在域名根目录，不需要这个 `--base` 参数。

页面采用目录式地址：根 `index.html` 对应 `/`，`publications/index.html` 对应 `/publications/`。这是静态目录的默认首页机制，不是 GitHub Pages 的设置开关，也无需后端 rewrite。站内导航使用目录地址；显式访问 `/index.html` 或 `/publications/index.html` 时，共享脚本会将地址规范为对应目录并保留查询参数和锚点。新页面也按 `目录名/index.html` 创建。

旧地址兼容：根 `publications.html` 保留为跳转页，JavaScript 跳转时保留原查询参数和锚点，另有 meta 刷新及手动链接回退。日常编辑和新增导航使用真实目录页。这些地址调整需推送并完成 Pages 部署后才会在线上生效。

## 文件与配置入口

| 文件 | 维护内容 |
| --- | --- |
| `people.js` | `window.SITE_PEOPLE`：人物主页 URL 的唯一配置入口及姓名别名 |
| `data.js` | `window.SITE_DATA`：个人资料、双语简介、学术服务、论文 |
| `index.html` | 首页结构、静态回退内容、页面元数据 |
| `publications/index.html` | 论文页结构、已同步的年份与论文静态 HTML、个人资料和页面元数据 |
| `publication-renderer.js` | 浏览器与 Node.js 共用的年份和论文渲染器，读取资料与人物配置 |
| `app.js` | 个人资料与简介渲染、人物链接、调用论文渲染器、主导航当前项与滚动收窄、站主结构化数据 |
| `styles.css` | 两页共享的布局、字体、颜色变量、吸顶导航、桌面浮动侧栏和响应式样式 |
| `assets/` | 头像、图标、PDF 等公开静态资源 |
| `assets/fonts/` | 自托管字体文件、来源说明和字体许可证 |
| `scripts/sync-publications.mjs` | 将共享渲染器生成的年份与论文写入论文页指定区域 |
| `scripts/serve.mjs` / `scripts/check.mjs` | 本地预览 / 只读离线检查，含论文静态 HTML 是否同步 |
| `.github/workflows/pages.yml` | 检查和 GitHub Pages 发布流程 |
| `SOURCE_NOTES.md` | 资料和论文的来源记录；不作为运行时配置或另一份操作手册 |

资料和论文由本地数据维护，不会在访客打开页面时自动抓取 Google Scholar。

## 常见内容更新

**个人资料与简介：** 修改 `data.js` 的 `profile`。简介使用 `profile.about.en` 和 `profile.about.zh`，两种语言应同步更新，并同步 `index.html` 中 `[data-bio]` 的静态回退文字。姓名、单位、身份、联系方式或头像变化时，同时检查两页 HTML 中的静态个人资料、图片 `alt`、`title`、description 和 Open Graph 元数据；这些内容不会全部随数据自动更新。英文单位仍只在 `profile.affiliation.en` 保存，页面按最后一个逗号拆分为研究院与学校两层；没有逗号时整段显示。修改姓名还需运行下述 `npm run sync`，更新论文作者加粗。

**学术服务：** 修改 `data.js` 的 `services`，并同步首页静态列表。页面使用英文职务名称，当前为 IJCAI 2026 Program Committee Member 和 ICLR 2027 Reviewer。

**首页 Publications 概述：** 该独立栏目位于双语简介之后、Academic Service 之前，展示“I have published papers in IJCAI, AAAI, IJCV, …”和 View publications 链接，不列具体论文。保留英文前缀，后接会议、期刊缩写与省略号，不简化为只有缩写的列表。概述直接维护在 `index.html` 的 `.publication-summary`，不由同步命令生成；修改时依据 `data.js` 的论文和 `SOURCE_NOTES.md` 的来源记录，避免加入未经核实的数量、等级或发表状态。入口字号在 `styles.css` 的 `.research-link` 中维护，当前为 17px。

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

**同步论文静态内容：** 更新论文、`people.js` 的人物主页或别名、站主姓名，或修改论文渲染方式后，依次运行：

```sh
npm run sync
npm run check
```

`npm run sync` 读取 `data.js`、`people.js`，调用 `publication-renderer.js`，只更新 `publications/index.html` 中 `publication-years:start` / `publication-years:end` 和 `publication-list:start` / `publication-list:end` 注释标记之间的内容。不要手工编辑生成区，也不要复制论文数据建立另一份配置；将生成后的 HTML 与配置改动一起提交。同步不需要安装依赖，也不是站点编译或打包。

`npm run check` 只读比较当前论文页中的静态 HTML 与当前配置的渲染结果，过期会报错，**不会自动同步**。GitHub Actions 同样只检查；推送前应先在本地同步。浏览器仍复用同一个渲染器，因此启用与禁用 JavaScript 时使用同一套论文和人物配置。

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

简介和论文作者中的匹配姓名会自动添加链接，姓名与别名需使用一致的写法；不要把同一别名分给不同人物。未配置人物或 `url` 留空时保留普通文本，不在 `data.js`、HTML 或 `app.js` 中手工重复维护人物主页 URL。论文生成区会保存同步产生的链接，修改配置后运行 `npm run sync` 即可更新；历史来源记录中的链接可以保留。

其他页面文字可显式复用配置，标签内容就是显示文字：

```html
<span data-person="Yuhua Qian">钱宇华</span>
<span data-person="梁新彦">梁新彦</span>
```

目录页面（如 `publications/index.html`）使用 `../` 引用根目录共享脚本，并保持以下顺序；根首页使用 `./`：

```html
<script src="../people.js" defer></script>
<script src="../data.js" defer></script>
<script src="../publication-renderer.js" defer></script>
<script src="../app.js" defer></script>
```

目录页的样式和静态图片同样使用 `../styles.css`、`../assets/文件名`。`data.js` 中的相对资源路径仍按站点根目录填写，例如 `./assets/头像.png`；`app.js` 根据自身脚本地址定位站点根目录，再解析这些路径。不要添加 `<base>` 标签，以免论文年份等页内锚点跳到首页。

## 样式与导航维护

视觉设计保持简洁的学术风格，使用纯白背景、墨蓝色姓名与标题，通过字体层级、留白和少量细分隔线组织内容。顶部导航的白色背景铺满视口，紧贴顶部，无外侧间隙；桌面导航组的左边缘与右侧正文左边缘对齐，手机保留四列导航，以唯一的细下划线标识当前页面或栏目。导航字号为 16px。向下滚动时导航区域轻微收窄，向上滚动或回到顶部时恢复；桌面为 68px → 52px，手机为 60px → 50px，过渡为 180ms。文字和 44px 点击高度不缩小，导航在文档中的占位保持展开高度，正文与侧栏位置不随之改变。

主导航状态由 `app.js` 根据页面地址与锚点更新：点击 Service 或 Contact 后，高亮对应入口；点击 Home 回到首页时高亮 Home；论文页及其年份锚点高亮 Publications。直达栏目链接、刷新和浏览器前进后退也会同步。不根据手动滚动切换栏目，悬停仅改变文字颜色。页面项使用 `aria-current="page"`，栏目项使用 `aria-current="location"`，新增导航时应同时核对地址匹配与当前项样式。

桌面内容最大宽度为 1000px，侧栏 230px、栏间距 70px，主栏最多 700px；`--sidebar-width` 与 `--column-gap` 同时控制正文网格和导航左侧内边距，在不超过 900px 时改为 210px / 38px。主体顶部间距为 44px，首页主要区块间距为 44px、手机 36px。Academic Service 使用较小标题，顶部间距 / 内边距为 36px / 28px、手机 32px / 24px，仅在其上方保留细分隔线；Contact 顶部间距为 28px，不重复添加标题横线。左侧个人资料按内容自然高度完整展开，通过 CSS `sticky` 保持在初始顶部位置；上下滚动不会主动改变侧栏的顶部偏移。页脚放在正文布局内的右侧第二行，个人资料跨越包括页脚在内的两行，避免独立页脚提前将侧栏向上推离浮动位置。

保留当前 147 × 206 像素头像，常规桌面显示宽度为 144px，按原图比例自然缩放，使用 5px 小圆角，与姓名间距为 22px。桌面宽度至少 681px、窗口高度不超过 720px 时缩小头像并收紧间距，高度不超过 600px 时进一步改为小头像与姓名并排；仍保留自然高度、全部内容和浮动，不设独立滚动区域。极矮窗口无法保证同时显示全部资料，浮动仍受布局容器边界限制。

屏幕宽度不超过 680px 时，侧栏恢复正常文档布局：手机首页使用 80px 头像配姓名与身份，下方显示双语单位和可换行的联系入口；手机论文页只保留 48px 头像、可返回首页的姓名和身份，隐藏完整单位及联系列表，让读者更快看到论文。桌面论文页仍展示完整资料。打印时隐藏顶部导航，资料恢复普通布局并显示完整单位和联系入口。

整体样式在 `styles.css` 维护，颜色和字体栈集中在 `:root` 变量。背景为 `#ffffff`，姓名和标题为 `#203746`，正文为 `#30343b`，辅助信息为 `#636b73`，链接为 `#356579`；分隔线和浅强调底色分别为 `#e2e7e9` 与 `#edf2f2`。英文姓名和栏目标题使用 Source Serif 4；英文简介、首页 Publications 概述、论文题目、导航和元信息使用 Source Sans 3。两款字体以 WOFF2 文件自托管在 `assets/fonts/`，通过 `@font-face` 加载并设置 `font-display: swap`；两页 HTML 使用相应目录深度的相对路径预加载字体，不依赖第三方字体 CDN。两款字体均采用 SIL Open Font License 1.1；固定来源、版本与校验值见 [字体来源说明](assets/fonts/README.md)。更换字体时同步检查 CSS、两页预加载、来源说明，并保留目录内的原始许可证。

中文简介与中文单位采用系统无衬线字体栈（优先苹方，回退思源黑体等），中文姓名仍采用系统宋体；各系统实际可用字体不同，不保证显示完全相同。常规桌面英文 / 中文姓名为 36px / 24px。英文简介和 Publications 概述为 18px、手机 17px，行高 1.75；中文简介为 16px、行高 1.8，两种语言间距为 20px。主要栏目标题为 28px、手机 26px，Academic Service / Contact 为 23px、手机 22px。论文标题为 20px、手机 19px，行高 1.45；作者文字为 15px、手机 14px。其余响应式层级以 `styles.css` 为准，调整时同时检查英中行距、字距、长标题换行及字体加载失败时的回退。

论文页的同年论文之间使用 34px 留白、手机 30px，不加逐篇分隔线。venue 缩写统一使用小面积浅底，完整 venue 信息保留；作者链接的常驻下划线较浅，悬停或键盘聚焦时增强。颜色、背景与下划线统一使用 160ms 过渡，不在交互时改变字重或尺寸。

`--header-height` 设置导航展开高度与文档占位（桌面 68px、手机 60px），`--header-compact-height` 设置收窄高度；`--anchor-offset` 始终以展开高度增加 24px，给锚点留出安全空间。桌面侧栏的 `--profile-top` 使用展开高度加 `--content-top: 44px`，固定为距离窗口顶部 112px。修改这些变量后，应检查 Service、Contact 和论文年份跳转的目标不会被遮挡，并核对侧栏布局与浮动边界。顶部导航和年份入口最小高度为 44px，手机 Paper/PDF 同样保留 44px 点击高度；同时保留键盘焦点样式和当前页的 `aria-current="page"`。

键盘聚焦导航时保持展开，鼠标点击不会将导航锁定为展开状态；调整窗口或浏览器返回页面时也会恢复展开。样式为系统的“减少动态效果”和“增强对比度”偏好提供相应规则；减少动态效果时关闭平滑滚动、链接颜色与导航高度过渡。调整样式时保留这些规则、可见焦点和清晰的当前页标识。

View publications、Scholar 和 Paper/PDF 的文字与箭头保持在同一内联文字流中，悬停或键盘聚焦时下划线连续显示；文字和箭头间仅保留普通空格，不使用额外的 flex 间距。调整这类链接时保留 44px 点击高度。

## 修改后的检查与同步

涉及论文内容、人物链接、站主姓名或共享论文渲染器时，先同步，再执行只读检查；其他改动可直接检查：

```sh
npm run sync
npm run check
git diff --check
```

检查器执行共享论文渲染器并确认论文页生成区与配置一致，同时检查 JavaScript 语法、资料与人物配置、别名冲突、四个共享脚本的加载顺序、静态链接和年份锚点、CSS/数据中的资源引用、静态 JSON-LD，以及部署路径。检查完全离线，不修改文件，不验证外部网址是否可访问，也不执行浏览器 DOM 渲染。

页面、数据或交互改变时，按影响范围在浏览器验证相关页面、手机窄屏布局、论文显示、年份跳转、人物中英文别名及 Paper/PDF 链接；论文相关改动还需核对禁用 JavaScript 时的完整列表和年份跳转。仅修改文档时核对命令、路径和代码事实，无需重复浏览器验证。静态同步检查不能代替实际的浏览器交互、布局和动态 JSON-LD 验证。

导航或排版改变时，还需检查纯白背景、桌面导航组左边缘对齐正文、导航铺满宽度并贴顶、键盘焦点和锚点遮挡；核对下滚收窄、上滚展开及键盘聚焦时展开，正文和侧栏位置保持稳定。检查侧栏完整展开且上下滚动时保持相同顶部位置，并核对滚至页尾的容器边界。短窗口应使用紧凑头像与间距且保持浮动。字体变化需核对两页字体资源与预加载路径、衬线标题与无衬线正文的实际字体渲染及长文本换行。手机应完整显示四个导航入口，个人资料保持普通布局、不遮挡正文。按改动范围核对打印布局和上述系统辅助显示偏好。

新增目录页面或根目录资源时，同步以下位置：

| 同步位置 | 要做的事 |
| --- | --- |
| `scripts/serve.mjs` 的 `allowed` | 新内容页加入对应目录名，允许预览其 `index.html`；根目录文件单独加入 |
| `scripts/check.mjs` 的页面和资源清单 | 新内容页以 `目录名/index.html` 加入 `contentPages`，兼容跳转页加入 `redirectPages`；两者合并为 `pageFiles`，页面所属目录自动进入 `staticFiles`。其他根目录资源加入 `staticFiles`，新增 JS 还应加入语法检查清单 |
| `.github/workflows/pages.yml` 的复制命令 | 将新页面目录或根目录文件加入 `_site` 发布清单，保留目录结构 |

放在 `assets/` 内的资源已由目录整体覆盖，无需逐个加入清单。本地引用按所在页面的目录深度使用相对路径，避免以 `/` 开头。新内容页还需加载上述共享脚本并补上目录式导航。年份跳转使用本页 `#year-年份` 锚点。

每轮修改都要同步相关说明：用法和字段变化更新 README，项目约定变化更新根 `AGENTS.md`，事实和来源变化更新 `SOURCE_NOTES.md`。只维护受影响的内容，不把同一套说明复制到多个 AI 专用文件。

不同 AI 工具不一定自动读取 `AGENTS.md`。可复制以下提示词，并在末尾追加具体需求：

> 先读取并遵循根目录 AGENTS.md 和 README.md。按我的需求修改项目、完成适当检查，并在本轮同步维护相关说明。不要只改实现而留下过时文档。

## 推送与发布

当前仓库已配置 `origin` 为 `https://github.com/shenhu365/shenhu365.github.io.git`，使用 `main` 分支。首次启用时确认一次仓库 **Settings → Pages → Source = GitHub Actions**；后续正常更新无需重新设置。

1. 在项目根目录先同步论文静态 HTML，再检查并按上节做浏览器验证：

   ```sh
   npm run sync
   npm run check
   git diff --check
   ```

2. 确认当前位于 `main`，检查本次改动，只纳入准备发布的文件：

   ```sh
   git status
   git diff
   ```

3. 确认所有改动都属于本次更新后暂存并提交，包含同步后的 `publications/index.html`；若有无关文件，把 `git add .` 换成具体文件名：

   ```sh
   git add .
   git diff --cached --stat
   git commit -m "Update academic homepage"
   ```

4. 推送已检查的提交：

   ```sh
   git push origin main
   ```

推送会自动触发 [Deploy academic homepage](https://github.com/shenhu365/shenhu365.github.io/actions) 工作流，无需再手动 Run workflow。等待检查和部署成功，再打开[线上主页](https://shenhu365.github.io/)确认更新。工作流分别复制根静态文件（含兼容跳转页）、`publications/` 目录和 `assets/` 目录，不会发布 README、AGENTS 或来源笔记。

推送报错时先查看原因，处理登录、网络或远端新增提交后再尝试；不要用 `--force` 覆盖远端记录。

## 常见问题

- **4173 端口被占用，或浏览器仍显示旧版：** 在启动旧服务的终端按 `Ctrl+C`，从当前项目目录重新运行 `npm run dev` 并刷新页面。旧版非 watch 进程不会随服务器脚本更新；不确定时用 `npm run dev -- --port 4174` 启动新服务并访问对应端口。
- **新页面或文件返回 404：** 检查路径与文件名大小写、浏览器端口及 `--base` 是否正确，再核对上面的预览白名单、检查清单与 Pages 复制清单。macOS 本地可能忽略大小写，GitHub Pages 不会。
- **检查提示论文静态内容过期：** 运行 `npm run sync` 后再运行 `npm run check`，将配置与更新后的 `publications/index.html` 一起提交；不要通过手改生成区或跳过检查解决。
- **本地正常，线上没变化：** 查看 Actions 中最近提交是否部署成功，再刷新浏览器。若新增文件未纳入 Git 或发布清单，先修正并重新推送。
