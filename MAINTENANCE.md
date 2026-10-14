# 网站维护指南

配置、内容更新、排版、检查和部署的详细说明集中在这里。快速开始见 [README.md](README.md)，智能体项目约定见 [AGENTS.md](AGENTS.md)，资料来源见 [SOURCE_NOTES.md](SOURCE_NOTES.md)。

## 本地预览

需要 Node.js 20 或更新版本，无需执行 `npm install`。在项目根目录运行：

```sh
npm run dev
```

打开[首页](http://127.0.0.1:4173/)、[论文页](http://127.0.0.1:4173/publications/)或[获奖页](http://127.0.0.1:4173/awards/)。该服务展示当前工作目录的版本；4173 端口不固定对应某个分支。修改网页或数据后刷新浏览器；修改预览服务器脚本会触发 Node.js 自动重启。终端按 `Ctrl+C` 停止服务。

验证 GitHub 项目仓库子目录路径时，可另开端口：

```sh
npm run dev -- --base /scholarpage/ --port 4174
```

对应地址是 <http://127.0.0.1:4174/scholarpage/>、<http://127.0.0.1:4174/scholarpage/publications/> 和 <http://127.0.0.1:4174/scholarpage/awards/>。当前正式站部署在域名根目录，不需要这个 `--base` 参数。

页面采用目录式地址：根 `index.html` 对应 `/`，`publications/index.html` 对应 `/publications/`，`awards/index.html` 对应 `/awards/`。这是静态目录的默认首页机制，不是 GitHub Pages 的设置开关，也无需后端 rewrite。站内导航使用目录地址；显式访问各内容页的 `index.html` 地址时，共享脚本会将地址规范为对应目录并保留查询参数和锚点。新页面也按 `目录名/index.html` 创建。

旧地址兼容：根 `publications.html` 保留为跳转页，JavaScript 跳转时保留原查询参数和锚点，另有 meta 刷新及手动链接回退。日常编辑和新增导航使用真实目录页。这些地址调整需推送并完成 Pages 部署后才会在线上生效。

## 文件与配置入口

| 文件 | 维护内容 |
| --- | --- |
| `people.js` | `window.SITE_PEOPLE`：人物主页 URL 的唯一配置入口及姓名别名 |
| `data.js` | `window.SITE_DATA`：个人资料、双语简介、学术服务、奖项、论文 |
| `index.html` | 首页结构、静态回退内容、页面元数据 |
| `publications/index.html` | 论文页结构、已同步的年份与论文静态 HTML、个人资料和页面元数据 |
| `awards/index.html` | 获奖页结构、手工与配置同步的静态奖项列表、个人资料和页面元数据 |
| `publication-renderer.js` | 浏览器与 Node.js 共用的年份和论文渲染器，读取资料与人物配置 |
| `app.js` | 个人资料、简介与奖项渲染、人物链接、调用论文渲染器、主导航及年份当前项、导航滚动收窄、站主结构化数据 |
| `styles.css` | 所有内容页共享的布局、字体、颜色变量、吸顶导航、桌面浮动侧栏和响应式样式 |
| `assets/` | 头像、图标、PDF 等公开静态资源 |
| `assets/fonts/` | 自托管字体文件、来源说明和字体许可证 |
| `scripts/sync-publications.mjs` | 将共享渲染器生成的年份与论文写入论文页指定区域 |
| `scripts/serve.mjs` / `scripts/check.mjs` | 本地预览 / 只读离线检查，含奖项数组检查、论文静态 HTML 是否同步 |
| `.github/workflows/pages.yml` | 检查和 GitHub Pages 发布流程 |
| `README.md` | 项目简介、快速开始与文档入口 |
| `MAINTENANCE.md` | 详细配置、内容更新、检查、部署及排障（本文件） |
| `AGENTS.md` | 智能体项目约定与交接规则 |
| `SOURCE_NOTES.md` | 资料、论文与奖项的来源记录；不作为运行时配置或另一份操作手册 |

资料、论文与奖项由本地数据维护，不会在访客打开页面时自动抓取 Google Scholar。

## 常见内容更新

**个人资料与简介：** 修改 `data.js` 的 `profile`。简介使用 `profile.about.en` 和 `profile.about.zh`，两种语言应保持语义一致，并同步 `index.html` 中 `[data-bio]` 的静态回退文字。纯英文润色不改变已确认事实时，无需改写中文；采用专业、自然的学术自述，保留总体研究方向与重点的层次，以及段末合作研究说明。姓名、单位、身份、联系方式或头像变化时，同时检查所有内容页 HTML 中的静态个人资料、图片 `alt`、`title`、description 和 Open Graph 元数据；这些内容不会全部随数据自动更新。英文单位仍只在 `profile.affiliation.en` 保存，页面按最后一个逗号拆分为研究院与学校两层；没有逗号时整段显示。修改姓名还需运行下述 `npm run sync`，更新论文作者加粗。

**学术服务：** 修改 `data.js` 的 `services`，按年份倒序维护，并同步首页静态列表；同年条目沿用配置顺序。页面使用英文职务名称，当前依次为 ICLR 2027 Reviewer、IJCAI 2026 Program Committee Member。`app.js` 对数组副本按 `year` 降序排序后渲染，不修改源数组；静态回退保持相同顺序，禁用 JavaScript 时也按年份倒序显示。

**奖项：** 修改 `data.js` 的 `awards` 数组。每项包含双语 `title: { en, zh }`（竞赛或机构名）、`honor: { en, zh }`（奖项或表彰）、`detail: { en, zh }`（补充说明，无内容时文本留空），以及 `url` 官方链接。当前不设置或显示年份，页面沿用配置顺序，依次为华为杯研究生数学建模、全国大学生数学建模、CCF 表彰。`app.js` 在 `[data-awards]` 渲染列表；改动时手工同步 `awards/index.html` 的完整静态回退，核对中英文、顺序与链接，并维护新增事实的来源记录。`npm run sync` 仅更新论文，不同步奖项；离线检查也不代替奖项静态回退核对。

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

`id` 必须唯一，建议使用英文小写字母、数字和连字符；作者按原论文顺序完整填写，不用 `et al.` 代替。`year` 使用数字，`url` 填原始论文页面，`pdf` 无可靠地址时留空。年份分组和导航自动生成，同一年内沿用数组顺序。事实或来源有变化时同步 `SOURCE_NOTES.md`。

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

目录页面（`publications/index.html` 与 `awards/index.html`）使用 `../` 引用根目录共享脚本，并保持以下顺序；根首页使用 `./`：

```html
<script src="../people.js" defer></script>
<script src="../data.js" defer></script>
<script src="../publication-renderer.js" defer></script>
<script src="../app.js" defer></script>
```

目录页的样式和静态图片同样使用 `../styles.css`、`../assets/文件名`。`data.js` 中的相对资源路径仍按站点根目录填写，例如 `./assets/头像.png`；`app.js` 根据自身脚本地址定位站点根目录，再解析这些路径。不要添加 `<base>` 标签，以免论文年份等页内锚点跳到首页。

## 样式与导航维护

main 保持用户提供的 `shen-homepage-source.zip` 所启发的浅蓝灰背景、白色内容面板、蓝色操作入口与轻渐变资料卡；顶部采用无框 SH 和简洁文字导航。独立白底方案 `codex/white-ui-redesign` 已推送 GitHub，但尚未合入 main 或上线，维护蓝灰版时不自动合入该分支。界面样式在 `styles.css` 维护，个人事实、论文、奖项与人物链接继续由共用配置管理。首页栏目包在 `.home-panel` 中；论文沿用共享渲染器，同年条目放在白色分组卡片中。

颜色与布局尺寸集中在 `:root`：页面背景为 `#f4f6fb`、面板为 `#ffffff`、正文及标题为 `#202a40`、辅助信息为 `#606d84`、发表渠道全称与年份为 `--venue-text: #515d73`、中文简介、首页发表概述与论文普通作者文字使用 `--reading-text: #3f4b60`、链接为 `#435fc7`、主操作为 `#4663ce`。这两段的加粗文字仍使用 `#202a40`；普通导航文字、资料联系入口、奖项补充说明 `.award-detail` 与论文作者 `.paper-authors` 同样使用 `--reading-text`，增强对比度偏好下这些普通文字使用 `#202a40`；其他辅助信息颜色不随之变更。`--venue-text` 在增强对比度偏好下使用 `#35415a`，打印时使用 `#4d5668`。常规容器最大宽度 1068px，侧栏 268px、间隔 38px；在不超过 1099px / 880px 时，侧栏与间距分别变为 256px / 32px、208px / 22px。首页栏目常规内边距为 30px 34px，区块之间用细线分隔，窄屏逐级收紧。

主导航顺序为 Home、Publications、Awards、Service，保持四个入口；Contact 导航按钮移除，首页 Contact 邮箱区保留。

顶部 `.site-header` 通过 `position: fixed; inset: 0 0 auto` 固定，body 使用展开高度占位，打印时清除。880px 以上 header 与正文共用两列网格及 `--column-gap`：SH 在左列起点，文字导航在右侧正文列居中；880px 以下两端 flex 排列，680px 以下导航 `flex: 1`，530px 以下隐藏 SH 并用四列铺满。SH 使用 Manrope、26px / 600，手机为 24px，无底框。导航常规 16px / 500，530px 以下 14px，350px 以下 13px；间距常规 28px、手机 12px、530px 以下网格 8px、350px 以下 4px。普通项使用 `--reading-text`，当前、悬停和聚焦项用蓝字与 `a::after` 的 1px 下划线，增强对比度下当前项为 2px。导航组不设底色、卡片或阴影。入口至少 44px 高；滚动超过 28px 后可见高度从 72px 收至 52px，手机及高度不超过 700px 的桌面为 64px → 48px，上滚保持收窄，仅回到顶部 1px 内展开。`.is-compact` 只改变 `--nav-height`，背景及内部容器高度过渡 180ms；横向位置、字号、点击高度与 body 展开占位不变。旧 `--nav-padding`、`--nav-item-inset` 和卡片伪元素已移除，`--nav` 仍用于论文年份导航。

滚动超过 1px 时，脚本为导航添加 `.is-scrolled`，仅显示底部细线、不加阴影，返回顶部 1px 范围内去掉。正常滚动过程中，位置在大于 1px 且不超过 28px 时保留当前展开或收窄状态，不根据滚动方向或累计距离切换。初始化、调整窗口和浏览器恢复页面时，按当前滚动位置是否超过 1px 同步收窄及边界状态，因此恢复到已滚动页面时保持紧凑。

滚动后的 `.is-scrolled` 同时控制轻微透明磨砂。支持 `backdrop-filter` 或 `-webkit-backdrop-filter` 时，仅全宽背景使用 `--header-glass: rgb(244 246 251 / 78%)`，配合 `blur(16px) saturate(120%)`，文字保持不透明；导航组没有独立底色，旧 `--nav-glass` 已移除。页顶、不支持滤镜或启用 `prefers-reduced-transparency: reduce` / `prefers-contrast: more` 时使用实色并关闭模糊。背景色过渡 180ms，减少动态偏好关闭过渡；导航位置、收窄逻辑和点击高度不变。

主导航状态由 `app.js` 按地址与锚点更新：`#service` 高亮 Service，首页其他锚点或无锚点时高亮 Home；旧 `#contact` 链接仍跳到首页邮箱区，并高亮 Home。论文页及年份锚点高亮 Publications，获奖页高亮 Awards。页面项使用 `aria-current="page"`，栏目项使用 `aria-current="location"`；直达、刷新及浏览器前进后退均同步，不随手动滚动切换。年份导航单独跟随阅读位置，原生锚点负责跳转；脚本不改 URL、历史或焦点。被动 scroll 经 requestAnimationFrame 合并，以视口上方 35% 与实际遮挡区下方 16px 中较低的一条线判断年份标题，默认首年；遮挡区包括实际主导航高度及窄屏年份横栏。页面可滚动且到达底部 2px 内时激活末年，使短末组也可选中。当前年份变化后才更新 aria-current；初始化、load、pageshow、hashchange、resize、字体就绪及论文列表/导航内部容器的 ResizeObserver 均触发重测。

桌面资料卡按自然高度完整展开并保持 CSS `sticky`。常规顶部位置由 `--header-height: 72px` 加 `--content-top: 22px` 得到 94px；高度不超过 700px 时两者为 64px 和 16px，顶部位置为 80px。上下滚动不主动改变偏移，不设置负偏移或独立滚动区域。页脚仍在正文布局内的第二行，侧栏跨越正文和页脚，浮动受该容器边界约束。锚点留空由展开导航高度加 20px 控制，常规为 92px、手机及短桌面为 84px。

保留当前 147 × 206 像素头像原文件，图片按自然比例显示，常规图框宽 122px、圆角 12px、内部留白 4px。桌面高度不超过 840px 时使用 94px 头像和紧凑间距；高度不超过 700px 时进一步采用 54px 头像与姓名并排，仍保持浮动。极矮窗口不能保证资料同时全部可见。宽度不超过 680px 时恢复普通文档布局：首页使用 84px 头像并展示完整资料，论文页与获奖页通过共用的 `:is(.publications-page, .awards-page)` 规则使用 54px 头像、可回首页的姓名和身份，隐藏完整单位与联系列表。

资料卡联系入口依次为 Google Scholar、GitHub、University profile、可选 CV、邮箱；University profile 使用句式大小写，profile 不大写；缺少配置的 GitHub / CV 不显示。`app.js` 与所有内容页静态回退保持同一顺序。入口使用 10px 圆角，左右 8px 内边距配合等量负外边距保持文字对齐，列表项上下各留 2px 间隔。链接本体保持 flex 布局，左侧为 SVG 图标，文字 `.profile-link-label` 使用 `flex: 1; min-width: 0`，右侧 `.profile-link-arrow` 是链接的直接子级，固定占 14px，不带前置空格，使各行箭头对齐在同一列。所有内容页静态回退与 `app.js` 使用相同结构。悬停和键盘聚焦保持透明背景，文字、左图标和右箭头同时变为链接蓝色 `#435fc7`；仅文字 label 显示 1px 细下划线、距离文字 3px，箭头不带下划线。邮箱同样带箭头，仍使用 `mailto:`，不在新窗口打开。宽度不超过 880px 及打印时统一隐藏资料链接箭头，隐藏后不占列宽；键盘聚焦保留可见外框。宽度不超过 680px 时入口使用 `1.2fr .8fr` 双列网格，为首列 Google Scholar 留出更多空间，第三项起跨两列，列间距 20px，避免扩展的点击区域重叠。所有入口保留 44px 点击高度。

Manrope 用于英文与主要界面文字，Noto Sans SC 子集用于中文，均为本地 WOFF2 字体，使用 `font-display: swap`。所有内容页 HTML 按目录深度预加载这些字体，不请求外部字体服务。字体和原始 OFL 许可证来自用户源码包；版本核验情况、大小、校验值及子集限制见 [字体来源说明](assets/fonts/README.md)。原有 Source 字体和许可证保留，但当前页面不加载它们。中文子集不覆盖所有汉字，保留系统字体回退，新增中文时检查缺字、字体混排与换行。

常规姓名为英文 34px、中文 20px；首页栏目标题 22px、手机 21px，论文页与获奖页标题 34px、手机 32px。英文简介 17px、行高 1.9，在不超过 880px 时为 16px；`.bio-en strong` 使用深色 `var(--text)` 和 700 字重；中文简介 15px、行高 1.95，两段间距 21px。资料身份常规 14px，高度不超过 700px 的桌面及手机内页为 13px；单位英文 14px、中文 13px，联系入口 14px，窄屏不降低单位和联系字号。首页发表概述 16px。论文标题 18px、行高 1.55，普通作者 14px / 400、行高 1.85；venue 全称与年份 14px、行高 1.85，缩写标签 12px，Paper/PDF 为 13px、行高 1.7。奖项英文结果 15px / 700，中文结果及双语补充说明均为 14px，中文竞赛或机构名仍为 14px。其余响应式层级以 CSS 为准。

年份导航与论文列表共用 `.publication-browser`：超过 1099px 时为 `minmax(0, 1fr) 68px` 两列、20px 间距，列表左侧、年份右侧竖排。`--year-rail-overhang` 使用 `clamp(26px, calc((100vw - 1068px) / 2 - 16px), 68px)`；区域通过等量负右外边距向右扩展，标题区右内边距为 `calc(88px - var(--year-rail-overhang))`，使 Google Scholar 按钮右沿对齐论文卡片右沿；年份栏在其右侧相隔 20px，距视口边缘至少 16px。年份栏 CSS sticky 顶部为 `var(--profile-top)`（常规 94px、短桌面 80px），浮动受列表容器约束；HTML 中仍位于列表前以保留键盘顺序。每个入口至少 60px 宽、44px 高。1099px 及以下清除右扩展和标题内边距，恢复单列靠右横栏；`top: var(--sticky-header-height)` 紧贴主导航下缘，变量随相邻 header 的 `.is-compact` 使用展开或紧凑高度，top 过渡为 180ms。横栏上下 padding 4px、下边距 18px，年份不换行，较多时横向滚动，焦点外框内收 2px。支持滤镜时使用导航相同的 `--header-glass`（78% 不透明度）和 `blur(16px) saturate(120%)`；年份组不另画底框。无滤镜、减少透明度或增强对比度时使用实色并关闭模糊，减少动态偏好关闭过渡。窄屏年份标题 `scroll-margin-top: 44px` 与 html 留白叠加，原生锚点和无脚本跳转后均不被横栏遮挡。打印隐藏年份栏，将论文浏览区恢复块布局并清除右扩展与标题内边距。

论文页按年份组成卡片，年份标题后接细线，同组论文之间保留浅分隔线。Paper / PDF 在超过 880px 时位于论文右侧，较窄屏置于文字下方；所有资源入口最小点击高度 44px。年份选中框与 Paper / PDF 外框用 `a::before` 上下内缩 5px 绘制，常规视觉高度 34px、圆角 6px；文字字号与点击区域保持不变。年份组仅保留左右 4px 内边距；桌面竖栏的底框由 `ul::before` 上下内缩 2px 绘制，窄屏横栏取消组底框，保留整条磨砂背景。Paper / PDF 桌面纵向点击区间距为 2px，窄屏横向间距仍为 10px。伪元素不拦截点击，悬停/聚焦的背景和边框反馈在伪元素中维护；打印时隐藏资源框。发表渠道全称与年份由 `.paper-venue` 统一使用 `--venue-text: #515d73`，保持 14px、400 字重和 1.85 行高，颜色略浅于普通作者；venue 缩写使用 12px 的浅蓝底标签。Paper / PDF 使用 13px、1.7 行高。普通作者使用 `--reading-text: #3f4b60`，作者链接平时继承同色，下划线较浅；悬停或聚焦时变为链接蓝色并增强下划线。Shen Hu 保持 `--text: #202a40` 和 700 字重。View publications、Scholar 和 Paper/PDF 虽使用按钮外观，文字与箭头仍在同一内联文字流，普通空格处的下划线连续，不添加额外 flex 间距。

键盘聚焦本身不改变导航高度，保持当前展开或收窄状态，并保留 44px 点击区域及可见焦点。可见高度由 `--nav-height` 控制；调整窗口或浏览器恢复页面时根据当前滚动位置同步状态。交互过渡统一为 180ms，不改变字重或布局位置。保留 Skip to content、可见焦点、减少动态效果和增强对比度规则；打印时取消卡片背景、阴影和侧栏浮动，隐藏导航和年份栏，恢复论文页与获奖页完整资料。

## 修改后的检查与同步

涉及论文内容、人物链接、站主姓名或共享论文渲染器时，先同步，再执行只读检查；其他改动可直接检查：

```sh
npm run sync
npm run check
git diff --check
```

检查器执行共享论文渲染器并确认论文页生成区与配置一致，同时检查 JavaScript 语法、资料与人物配置、奖项数组、别名冲突、四个共享脚本的加载顺序、静态链接和年份锚点、CSS/数据中的资源引用、静态 JSON-LD，以及部署路径。检查完全离线，不修改文件，不验证外部网址是否可访问，也不执行浏览器 DOM 渲染。

页面、数据或交互改变时，按影响范围在浏览器验证相关页面、手机窄屏布局、论文显示、年份跳转、人物中英文别名及 Paper/PDF 链接；论文相关改动还需核对禁用 JavaScript 时的完整列表和年份跳转；奖项改动需核对启用与禁用 JavaScript 时的双语文本、顺序和官方入口一致，且不显示年份。仅修改文档时核对命令、路径和代码事实，无需重复浏览器验证。静态同步检查不能代替实际的浏览器交互、布局和动态 JSON-LD 验证。

导航或排版改变时，检查浅蓝灰背景、白色面板、无框 SH 与无底色文字导航；当前、悬停及聚焦项有细下划线，增强对比度下当前项为 2px。核对超过 28px 收窄、上滚保持、顶部 1px 内展开，以及刷新、调整窗口、恢复页面后的状态。导航 top 始终为 0，body 占位避免正文跳动；滚动超过 1px 后仅出现底线，返回顶部后消失。支持滤镜时核对磨砂与不透明文字；顶部、不支持滤镜、减少透明度及增强对比度时实色回退。宽桌面导航在右侧正文列居中，收窄不改变横向位置或 44px 点击高度，聚焦不改变高度。资料链接核对 Scholar 在前、GitHub 在后，箭头同列，悬停无底色、文字和图标变蓝且仅 label 下划线，动态/静态顺序与结构一致；窄屏及打印隐藏箭头不占列宽，手机首列较宽、双列点击区不重叠。检查完整资料、sticky 顶部和页尾边界，短窗口紧凑头像保持浮动；单位、联系文字、发表概述、作者、venue 和奖项说明增大后仍正常换行。核对 Manrope / Noto 资源与预加载、中文子集回退。手机四项导航完整可用，Awards 当前项及旧 contact 锚点正确，首页完整资料、内页简短身份区。论文验证资源右侧/下方切换、桌面 Scholar 按钮与论文卡片右沿对齐、年份栏相隔 20px 及视口边距；窄屏横栏紧贴导航、收窄时同步移动且磨砂/实色回退正确。核对上下滚动、短末组、锚点跳转、刷新及调整窗口后的年份高亮，URL 与焦点不因滚动改变，并验证禁用 JavaScript 原生跳转；按影响检查打印和辅助显示偏好。

新增目录页面或根目录资源时，同步以下位置：

| 同步位置 | 要做的事 |
| --- | --- |
| `scripts/serve.mjs` 的 `allowed` | 新内容页加入对应目录名，允许预览其 `index.html`；根目录文件单独加入 |
| `scripts/check.mjs` 的页面和资源清单 | 新内容页以 `目录名/index.html` 加入 `contentPages`，兼容跳转页加入 `redirectPages`；两者合并为 `pageFiles`，页面所属目录自动进入 `staticFiles`。其他根目录资源加入 `staticFiles`，新增 JS 还应加入语法检查清单 |
| `.github/workflows/pages.yml` 的复制命令 | 将新页面目录或根目录文件加入 `_site` 发布清单，保留目录结构 |

放在 `assets/` 内的资源已由目录整体覆盖，无需逐个加入清单。本地引用按所在页面的目录深度使用相对路径，避免以 `/` 开头。新内容页还需加载上述共享脚本并补上目录式导航。年份跳转使用本页 `#year-年份` 锚点。

每轮修改都要同步相关说明：用法、字段、详细命令与排障变化更新本文件；快速开始或文档入口变化更新 `README.md`；项目约定变化更新 `AGENTS.md`；事实和来源变化更新 `SOURCE_NOTES.md`。README 保持简洁，详细说明集中在本文件，避免重复保存多份操作手册。

不同 AI 工具不一定自动读取 `AGENTS.md`。可复制以下提示词，并在末尾追加具体需求：

> 先读取并遵循根目录 AGENTS.md 和 README.md，按任务查阅 MAINTENANCE.md。按我的需求修改项目、完成适当检查，并在本轮同步维护相关说明。不要只改实现而留下过时文档。

## 日常维护、提交与发布

默认在 `main` 修改蓝灰版，独立白底分支不参与本轮维护。仅要求修改时，AI 完成实现、验证和文档同步，不自动提交或推送；明确请求提交、推送或发布时，按请求的范围执行。单独询问步骤时只提供命令。

1. **开始修改前确认工作区。** 查看实际目录、当前分支、已有改动及工作树：

   ```sh
   git rev-parse --show-toplevel
   git branch --show-current
   git status --short
   git worktree list
   ```

   若 `main` 已在另一工作树检出，先进入 `git worktree list` 中对应的目录，再确认分支和状态；原目录可能仍是白底方案，不能根据预览端口判断分支。保留其他工作树的未提交内容，不复制覆盖或自动 stash。

   若 main 没有被其他工作树占用，且当前工作区干净（`git status --short` 没有输出），可切到 `main` 并获取远端更新：

   ```sh
   git switch main
   git pull --ff-only origin main
   ```

   若有未提交改动，先确认归属并在当前分支妥善保存，不自动带着用户改动切分支或覆盖文件。快进拉取失败时先检查分支差异，不强行重置。

2. **修改并验证。** 按前文维护配置、页面及相关说明。论文、人物配置、站主姓名或共享论文渲染器变化时，先运行 `npm run sync`；然后执行：

   ```sh
   npm run check
   git diff --check
   git status
   git diff
   ```

   页面或交互有变化时按影响范围做浏览器验证；仅修改文档时核对命令、路径和代码事实即可。

3. **准备提交时只暂存本次文件。** 下面以更新项目说明与维护指南为例，实际操作时换成本次涉及的文件；若来源记录有变化，也加入 `SOURCE_NOTES.md`，论文配置更新应包含同步后的论文 HTML：

   ```sh
   git add README.md MAINTENANCE.md AGENTS.md
   git diff --cached --stat
   git diff --cached
   git commit -m "Update maintenance documentation"
   ```

   提交前确认暂存区没有其他任务的内容，提交说明应对应实际改动。多工作树场景下，暂存、提交和推送均在已确认的 main 目录执行；提供具体步骤时列出该目录及实际改动文件，不直接套用默认目录或 `git add .`。

4. **决定发布后推送 `main`：**

   ```sh
   git push origin main
   ```

推送会自动触发 [Deploy academic homepage](https://github.com/shenhu365/shenhu365.github.io/actions)，无需重复 Run workflow。首次启用时确认一次 Pages 的 Source 为 GitHub Actions；后续等待对应提交的检查和部署成功，再查看[线上主页](https://shenhu365.github.io/)。本地检查通过或推送成功都不等于已确认部署成功。工作流只收集白名单静态文件、`publications/`、`awards/` 和 `assets/`，不发布根 README、MAINTENANCE、AGENTS、来源笔记或维护脚本。

推送报错时先查看原因、远端状态和未提交改动，处理后再尝试；不要使用 `--force` 覆盖远端记录。

## 保留的其他版本

`codex/blue-ui-backup` 保留蓝灰版快照（`16ac7c9`），`codex/minimal-backup` 保留极简版（`a58f7d9`）；两份备份仅供查阅或用户明确要求时恢复，不在其中日常修改，不把当前界面合入、覆盖或删除。独立白底方案 `codex/white-ui-redesign` 的版本 `1bd7f25` 已推送 GitHub，尚未合入 main 或上线；继续预览该方案与维护 main 是两项独立工作，只有用户明确要求时才合并或发布。原 `codex/ui-redesign` 已完成原改版用途，不再是维护依赖。

无需切分支即可只读比较，例如：

```sh
git show codex/minimal-backup:styles.css
git show codex/minimal-backup:index.html
```

若要切换分支预览，先妥善保存当前改动并确认工作区干净；预览结束后回到 `main` 再继续日常维护。本项目没有第二套页面或运行时版本切换开关。

## 常见问题

- **4173 端口被占用，或浏览器仍显示旧版：** 在启动旧服务的终端按 `Ctrl+C`，从当前项目目录重新运行 `npm run dev` 并刷新页面。旧版非 watch 进程不会随服务器脚本更新；不确定时用 `npm run dev -- --port 4174` 启动新服务并访问对应端口。
- **新页面或文件返回 404：** 检查路径与文件名大小写、浏览器端口及 `--base` 是否正确，再核对上面的预览白名单、检查清单与 Pages 复制清单。macOS 本地可能忽略大小写，GitHub Pages 不会。
- **检查提示论文静态内容过期：** 运行 `npm run sync` 后再运行 `npm run check`，将配置与更新后的 `publications/index.html` 一起提交；不要通过手改生成区或跳过检查解决。
- **当前应该改哪个分支：** 蓝灰版使用 `main`；白底预览方案使用 `codex/white-ui-redesign`，不得因维护 main 而自动合并。不要在 `codex/blue-ui-backup` 或 `codex/minimal-backup` 编辑；切换前先妥善保存改动并确认工作区干净。
- **本地正常，线上没变化：** 先确认改动已提交并推送到 `main`，再查看 Actions 中对应提交的部署结果。若部署成功仍未更新，刷新浏览器并检查文件是否纳入 Git 和发布清单；推送白底预览或备份分支不会自动部署；此时线上未改变是正常结果。
