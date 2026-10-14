# 胡深的个人学术主页

两页学术网站，使用原生 HTML、CSS 和 JavaScript，无前端框架依赖或站点编译打包。首页展示个人资料、中英文简介、独立的 Publications 概述栏目、Academic Service 和仅含邮箱的 Contact；Publications 页按年份展示论文，仅提供 Paper 和已有的 PDF 链接，不显示 Code 或 BibTeX。论文静态 HTML 由本地同步命令更新并提交，禁用 JavaScript 时也能阅读。

- 线上地址：[shenhu365.github.io](https://shenhu365.github.io/)
- 仓库：[shenhu365/shenhu365.github.io](https://github.com/shenhu365/shenhu365.github.io)。新版在 `codex/ui-redesign` 维护，`main` 保留极简版并继续作为自动发布分支。
- 交给新 AI 接手时，先读根目录 [AGENTS.md](AGENTS.md) 和本 README。`AGENTS.md` 是唯一的智能体项目说明，本文件负责日常维护和发布指引。

## 本地预览

需要 Node.js 20 或更新版本，无需执行 `npm install`。在项目根目录运行：

```sh
npm run dev
```

打开[首页](http://127.0.0.1:4173/)和[论文页](http://127.0.0.1:4173/publications/)。该服务展示当前工作目录的版本；4173 端口不固定对应某个分支。修改网页或数据后刷新浏览器；修改预览服务器脚本会触发 Node.js 自动重启。终端按 `Ctrl+C` 停止服务。

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
| `app.js` | 个人资料与简介渲染、人物链接、调用论文渲染器、主导航及年份当前项、导航滚动收窄、站主结构化数据 |
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

新版参考用户提供的 `shen-homepage-source.zip`，使用浅蓝灰背景、白色内容面板、蓝色操作入口、轻渐变资料卡和分段式导航。界面样式在 `styles.css` 维护，个人事实、论文条目与人物链接继续由原有配置管理。首页各栏目包在 `.home-panel` 中；论文沿用共享渲染器输出，将同年条目放在一个白色分组卡片中。

颜色与布局尺寸集中在 `:root`：页面背景为 `#f4f6fb`、面板为 `#ffffff`、正文及标题为 `#202a40`、辅助信息为 `#606d84`、中文简介与首页发表概述普通文字使用 `--reading-text: #3f4b60`、链接为 `#435fc7`、主操作为 `#4663ce`。这两段的加粗文字仍使用 `#202a40`，增强对比度偏好下普通文字也使用该色；其他辅助信息颜色不随之变更。常规容器最大宽度 1068px，侧栏 268px、间隔 38px；在不超过 1099px / 880px 时，侧栏与间距分别变为 256px / 32px、208px / 22px。首页栏目常规内边距为 30px 34px，区块之间用细线分隔，窄屏逐级收紧。

顶部 `.site-header` 通过 `position: fixed; inset: 0 0 auto` 固定在视口顶部，`body` 使用 `padding-top: var(--header-height)` 保留展开高度的占位，打印时清除该占位。宽度超过 880px 时，`.header-inner` 与正文共用 `var(--sidebar-width) minmax(0, 1fr)` 两列网格及 `--column-gap`：SH 首页入口位于左列起点，分段导航在右侧正文列内居中。宽度不超过 880px 时改为 SH 与导航两端排列的横向 flex；不超过 680px 时栏间距为 12px，导航使用 `flex: 1`。当前项用白底、蓝字和轻阴影标识，不再使用旧版下划线。导航字号 16px；宽度不超过 530px 时隐藏 SH 标记，导航铺满容器并保持四列，字号为 14px。所有入口保持至少 44px 点击高度。滚动位置超过 28px 后，导航可见区域从 96px 收至 60px；上滚时保持收窄，仅返回顶部 1px 范围内才恢复。手机和高度不超过 700px 的桌面为 80px → 56px，过渡 180ms。导航组上下内边距由桌面 5px / 手机 4px 收至 2px，组高度从 54px / 52px 收至 48px。按钮仍保留 44px 点击高度，选中及悬停背景由 `a::before` 绘制；收窄时背景上下各缩进 4px，视觉卡片由 44px 收至 36px。横向宽度、按钮横向位置、字号和字重不变；body 占位保持展开高度，正文和侧栏位置不随收窄改变。

滚动超过 1px 时，脚本为导航添加 `.is-scrolled`，显示底部细线和轻阴影，返回顶部 1px 范围内去掉。正常滚动过程中，位置在大于 1px 且不超过 28px 时保留当前展开或收窄状态，不根据滚动方向或累计距离切换。初始化、调整窗口和浏览器恢复页面时，按当前滚动位置是否超过 1px 同步收窄及边界状态，因此恢复到已滚动页面时保持紧凑。

主导航状态由 `app.js` 按地址与锚点更新：Service / Contact 高亮对应栏目，首页无栏目锚点时高亮 Home，论文页及年份锚点高亮 Publications。页面项使用 `aria-current="page"`，栏目项使用 `aria-current="location"`；直达、刷新及浏览器前进后退均同步，不随手动滚动切换。年份导航保留原生锚点，脚本只按 URL 更新选中外观：无锚点时选中首个年份，有年份锚点时选中对应年份，其他锚点不选中年份；不拦截跳转或历史行为。

桌面资料卡按自然高度完整展开并保持 CSS `sticky`。常规顶部位置由 `--header-height: 96px` 加 `--content-top: 22px` 得到 118px；高度不超过 700px 时两者为 80px 和 16px，顶部位置为 96px。上下滚动不主动改变偏移，不设置负偏移或独立滚动区域。页脚仍在正文布局内的第二行，侧栏跨越正文和页脚，浮动受该容器边界约束。锚点留空由展开导航高度加 20px 控制，常规为 116px、手机及短桌面为 100px。

保留当前 147 × 206 像素头像原文件，图片按自然比例显示，常规图框宽 122px、圆角 12px、内部留白 4px。桌面高度不超过 800px 时使用 94px 头像和紧凑间距；高度不超过 700px 时进一步采用 54px 头像与姓名并排，仍保持浮动。极矮窗口不能保证资料同时全部可见。宽度不超过 680px 时恢复普通文档布局：首页使用 84px 头像并展示完整资料，论文页使用 54px 头像、可回首页的姓名和身份，隐藏完整单位与联系列表。

资料卡联系入口依次为 Google Scholar、GitHub、University profile、可选 CV、邮箱；缺少配置的 GitHub / CV 不显示。`app.js` 与两页静态回退保持同一顺序。入口使用 10px 圆角，左右 8px 内边距配合等量负外边距保持文字对齐，列表项上下各留 2px 间隔。悬停和键盘聚焦保持透明背景，文字与图标改为链接蓝色 `#435fc7`，文字显示 1px 细下划线、距离文字 3px。两页静态回退与动态生成结构一致：`.profile-link-label` 包裹文字及内联的 `.profile-link-arrow`，箭头前的普通空格位于箭头 span 内，并标记 `aria-hidden="true"`；文字、空格与箭头共享连续下划线，不使用外层 flex 链接的伪元素另画箭头。邮箱不带箭头，宽度不超过 880px 及打印时隐藏其他资料链接箭头；键盘聚焦保留可见外框。宽度不超过 680px 时入口重新排为双列网格，列间距 20px，避免扩展的点击区域重叠。所有入口保留 44px 点击高度。

Manrope 用于英文与主要界面文字，Noto Sans SC 子集用于中文，均为本地 WOFF2 字体，使用 `font-display: swap`。两页 HTML 按目录深度预加载这些字体，不请求外部字体服务。字体和原始 OFL 许可证来自用户源码包；版本核验情况、大小、校验值及子集限制见 [字体来源说明](assets/fonts/README.md)。原有 Source 字体和许可证保留，但当前页面不加载它们。中文子集不覆盖所有汉字，保留系统字体回退，新增中文时检查缺字、字体混排与换行。

常规姓名为英文 34px、中文 20px；首页栏目标题 22px、手机 21px，论文页标题 34px、手机 32px。英文简介 17px、行高 1.9，在不超过 880px 时使用 16px；中文简介 15px、行高 1.95，两段间距 21px。论文标题 18px、行高 1.55，作者 13px、行高 1.85；其余响应式层级以 CSS 为准。

论文页按年份组成卡片，年份标题后接细线，同组论文之间保留浅分隔线。Paper / PDF 在超过 880px 时位于论文右侧，较窄屏置于文字下方；所有资源入口最小点击高度 44px。venue 缩写共用浅蓝底，作者链接常驻下划线较浅，悬停或聚焦时增强。View publications、Scholar 和 Paper/PDF 虽使用按钮外观，文字与箭头仍在同一内联文字流，普通空格处的下划线连续，不添加额外 flex 间距。

键盘聚焦本身不改变导航高度，保持当前展开或收窄状态，并保留 44px 点击区域及可见焦点。尺寸由 `--nav-padding` 与 `--nav-item-inset` 控制；调整窗口或浏览器恢复页面时根据当前滚动位置同步状态。交互过渡统一为 180ms，不改变字重或布局位置。保留 Skip to content、可见焦点、减少动态效果和增强对比度规则；打印时取消卡片背景、阴影和侧栏浮动，隐藏导航和年份栏，恢复论文页完整资料。

## 修改后的检查与同步

涉及论文内容、人物链接、站主姓名或共享论文渲染器时，先同步，再执行只读检查；其他改动可直接检查：

```sh
npm run sync
npm run check
git diff --check
```

检查器执行共享论文渲染器并确认论文页生成区与配置一致，同时检查 JavaScript 语法、资料与人物配置、别名冲突、四个共享脚本的加载顺序、静态链接和年份锚点、CSS/数据中的资源引用、静态 JSON-LD，以及部署路径。检查完全离线，不修改文件，不验证外部网址是否可访问，也不执行浏览器 DOM 渲染。

页面、数据或交互改变时，按影响范围在浏览器验证相关页面、手机窄屏布局、论文显示、年份跳转、人物中英文别名及 Paper/PDF 链接；论文相关改动还需核对禁用 JavaScript 时的完整列表和年份跳转。仅修改文档时核对命令、路径和代码事实，无需重复浏览器验证。静态同步检查不能代替实际的浏览器交互、布局和动态 JSON-LD 验证。

导航或排版改变时，检查浅蓝灰背景、白色内容面板、SH 入口与分段导航、键盘焦点和锚点遮挡；核对滚动超过 28px 后收窄、上滚保持紧凑、回到顶部 1px 范围内展开，以及刷新、调整窗口或恢复页面后的状态。滚动时导航 top 应始终为 0，body 占位避免正文上跳；底部细线和阴影在滚动超过 1px 后出现、返回顶部范围后消失。宽桌面导航应在右侧正文列居中，垂直收窄不改变横向位置，卡片视觉变小后按钮仍有 44px 点击高度，键盘聚焦保持当前高度并显示焦点。资料卡链接需检查悬停无底色、蓝色文字与图标、文字到箭头的连续细下划线、键盘焦点和手机双列点击区不重叠，同时核对静态回退与动态标签一致，窄屏和打印隐藏箭头。检查资料卡完整展开、滚动及页尾边界下的顶部位置，短窗口使用紧凑头像和间距且保持浮动。字体变化需核对两页资源与预加载路径、Manrope 和 Noto 的实际渲染、中文子集回退及长文本换行。手机四个导航入口应完整可用，个人资料保持普通布局。论文页需核对资源入口在右侧 / 下方的响应式切换、年份高亮及禁用 JavaScript 时的原生跳转；按影响核对打印布局和系统辅助显示偏好。

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

## 分支保存、推送与发布

当前新版在 `codex/ui-redesign` 分支维护，极简版保留在 `main`；分支建立时的基点为 `a58f7d9`。不要把新版直接提交到 `main`。以下是决定保存并推送新版后使用的步骤，不会因为运行本地检查而自动执行。

1. 先确认分支、检查改动，并完成本地验证。只有论文配置、人物配置或共享渲染器发生变化时，才需在检查前运行 `npm run sync`：

   ```sh
   git branch --show-current
   git status --short
   git diff
   npm run check
   git diff --check
   ```

2. 确认位于 `codex/ui-redesign` 且以下文件都属于准备保存的修改，再暂存、检查并提交；若有其他任务的改动，应缩小暂存范围：

   ```sh
   git add styles.css app.js index.html publications/index.html assets/fonts README.md AGENTS.md SOURCE_NOTES.md
   git diff --cached --stat
   git diff --cached
   git commit -m "Redesign academic homepage interface"
   ```

3. 推送新版分支：

   ```sh
   git push -u origin codex/ui-redesign
   ```

这个 push 只保存分支到 GitHub，不会自动更新线上主页，因为 `.github/workflows/pages.yml` 的 push 触发仅包含 `main`。不要为了查看新版而手动运行部署工作流。正式发布需在用户明确选择新版后，先确认工作区干净，再有意将已验证的新版提交合并到 `main` 并推送；这是单独的后续操作。

向 `main` 推送会自动触发 [Deploy academic homepage](https://github.com/shenhu365/shenhu365.github.io/actions)，无需重复 Run workflow。Pages 的 Source 应为 GitHub Actions；等待检查和部署成功，再查看[线上主页](https://shenhu365.github.io/)。工作流只收集白名单静态文件、`publications/` 和 `assets/`，不发布根 README、AGENTS、来源笔记或维护脚本。源码包没有替换现有发布流程。

需要对比极简版时，可先用 `git show a58f7d9:styles.css`、`git show a58f7d9:index.html` 只读查看。若要切换分支预览，先在当前分支妥善保存改动并确认 `git status --short` 为空，再切换；未提交改动可能跟随分支切换，不能用带改动的工作区判断旧版效果。本项目没有复制第二套页面，也没有运行时版本切换开关。

推送报错时先查看原因、远端状态和未提交改动，处理后再尝试；不要使用 `--force` 覆盖远端记录。

## 常见问题

- **4173 端口被占用，或浏览器仍显示旧版：** 在启动旧服务的终端按 `Ctrl+C`，从当前项目目录重新运行 `npm run dev` 并刷新页面。旧版非 watch 进程不会随服务器脚本更新；不确定时用 `npm run dev -- --port 4174` 启动新服务并访问对应端口。
- **新页面或文件返回 404：** 检查路径与文件名大小写、浏览器端口及 `--base` 是否正确，再核对上面的预览白名单、检查清单与 Pages 复制清单。macOS 本地可能忽略大小写，GitHub Pages 不会。
- **检查提示论文静态内容过期：** 运行 `npm run sync` 后再运行 `npm run check`，将配置与更新后的 `publications/index.html` 一起提交；不要通过手改生成区或跳过检查解决。
- **本地正常，线上没变化：** 推送 `codex/ui-redesign` 不会自动部署，需明确选择发布并将新版合并到 `main`。若已经发布，查看 Actions 中相应提交是否部署成功，再检查新增文件是否纳入 Git 和发布清单。
