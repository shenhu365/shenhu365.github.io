# 网站维护指南

配置、内容更新、排版、检查和部署的详细说明集中在这里。快速开始见 [README.md](README.md)，智能体项目约定见 [AGENTS.md](AGENTS.md)，资料来源见 [SOURCE_NOTES.md](SOURCE_NOTES.md)。

## 本地预览

需要 Node.js 20 或更新版本，无需执行 `npm install`。本机统一使用以下目录，日常分支为 `main`：

```sh
cd /Users/hushen/Documents/ChatGPT/scholarpage
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
| `app.js` | 个人资料、简介与奖项渲染、人物链接、调用论文渲染器、主导航及年份当前项、年份栏滚动与输入跳转、导航滚动收窄、站主结构化数据 |
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

**个人资料与简介：** 修改 `data.js` 的 `profile`。简介使用 `profile.about.en` 和 `profile.about.zh`，两种语言应保持语义一致，并同步 `index.html` 中 `[data-bio]` 的静态回退文字。中英各一段，分别以 Shen Hu、胡深开头，采用专业、自然的第三人称学术简介，不以“I am”或“我是”开头。润色保留已确认事实、总体研究方向与重点的层次，以及段末合作研究说明。姓名、单位、身份、联系方式或头像变化时，同时检查所有内容页 HTML 中的静态个人资料、图片 `alt`、`title`、description 和 Open Graph 元数据；这些内容不会全部随数据自动更新。英文单位只在 `profile.affiliation.en` 保存，页面的 `[data-profile="affiliationEn"]` 原样显示完整文本；不按逗号拆分研究院与学校，不创建分层 span 或独立学校字段。修改时同步三页静态回退的完整字符串，允许随宽度自然换行，不强制 Shanxi University 另起一行。整段统一使用 400 字重，并继承 `.profile-affiliation` 的 `--muted` 颜色。修改姓名还需运行下述 `npm run sync`，更新论文作者加粗。

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

顶部 `.site-header` 通过 `position: fixed; inset: 0 0 auto` 固定，body 使用展开高度占位，打印时清除。880px 以上 header 与正文共用两列网格及 `--column-gap`：SH 在左列起点，文字导航在右侧正文列居中；880px 以下两端 flex 排列，680px 以下导航 `flex: 1`，530px 以下隐藏 SH 并用四列铺满。SH 使用 Manrope、26px / 600，手机为 24px，无底框。导航常规 16px / 500，530px 以下 14px，350px 以下 13px；间距常规 28px、手机 12px、530px 以下网格 8px、350px 以下 4px。普通项使用 `--reading-text`，当前、悬停和聚焦项用蓝字与 `a::after` 的 1px 下划线，增强对比度下当前项为 2px。导航组不设底色、卡片或阴影。入口至少 44px 高；滚动超过 28px 后可见高度从 72px 收至 52px，手机及高度不超过 700px 的桌面为 64px → 48px，上滚保持收窄，仅回到顶部 1px 内展开。`.is-compact` 只改变 `--nav-height`，背景及内部容器高度过渡 180ms；横向位置、字号、点击高度与 body 展开占位不变。旧 `--nav-padding`、`--nav-item-inset` 和卡片伪元素已移除。

滚动超过 1px 时，脚本为导航添加 `.is-scrolled`，仅显示底部细线、不加阴影，返回顶部 1px 范围内去掉。论文页所有横栏吸顶合并时，由固定主导航的单层磨砂背景覆盖两行，隐藏其底线与年份栏自身背景，不新增年份栏底线；680px 及以下的 `.publications-page .site-header.is-scrolled::before` 即使尚未合并也保持透明边线。其他页面及未合并的较宽屏幕沿用原规则。正常滚动过程中，位置在大于 1px 且不超过 28px 时保留当前展开或收窄状态，不根据滚动方向或累计距离切换。初始化、调整窗口和浏览器恢复页面时，按当前滚动位置是否超过 1px 同步收窄及边界状态，因此恢复到已滚动页面时保持紧凑。

滚动后的 `.is-scrolled` 同时控制透明磨砂。主导航滚动背景和横向年份栏共用 `--navigation-glass: rgb(244 246 251 / 50%)` 与 `--navigation-blur: blur(16px) saturate(120%)`，分别作用于 `.site-header.is-scrolled::before` 和未合并的 `.publication-years::before`；50% 浅蓝灰底色减弱底层文字透出，文字保持不透明，导航组没有独立底色。主导航页顶使用实色；不支持 `backdrop-filter` / `-webkit-backdrop-filter`，或启用 `prefers-reduced-transparency: reduce` / `prefers-contrast: more` 时，可见背景层统一回退为 `var(--background)` 并关闭模糊。背景色过渡 180ms，减少动态偏好关闭过渡；导航位置、收窄逻辑和点击高度不变。

主导航状态由 `app.js` 按地址与锚点更新：`#service` 高亮 Service，首页其他锚点或无锚点时高亮 Home；旧 `#contact` 链接仍跳到首页邮箱区，并高亮 Home。论文页及年份锚点高亮 Publications，获奖页高亮 Awards。页面项使用 `aria-current="page"`，栏目项使用 `aria-current="location"`；直达、刷新及浏览器前进后退均同步，不随手动滚动切换。年份导航单独跟随阅读位置；阅读年份变化时，`syncYearAddress` 通过 `history.replaceState` 更新当前年的 `#year-年份`，保留路径、查询参数和 `history.state`，不新增历史记录、不触发跳转或移动焦点，匹配的 hash 不重复写入。首次无 hash 的页面保持简洁，之后跨年才同步；非年份 hash 保留。显式选择年份继续使用原生锚点跳转与历史，目标保护期间不按途经年份替换地址。被动 scroll 经 requestAnimationFrame 合并，以视口上方 35% 与实际遮挡区下方 16px 中较低的一条线判断年份标题，默认首年；遮挡区包括实际主导航高度及窄屏年份横栏。页面可滚动且到达底部 2px 内时激活末年，使短末组也可选中。阅读位置同步在当前年份变化后才更新 aria-current；显式跳转立即强制同步当前项，横栏使用稳定窗口或竖栏实际溢出时，滚动年份 `ul` 将当前项置于列表视窗中心，不滚动整页或移动焦点；用户手动浏览年份后 1.5 秒内、拖动或输入面板打开时暂停列表内部的自动居中。当前年份更新后先同步列表内部位置，再计算浮动栏位置；当前年份未变时也重新定位浮动栏，以跟随主导航高度变化。初始化、load、pageshow、popstate、hashchange、resize、字体就绪及论文列表/导航内部容器的 ResizeObserver 均触发重测。

桌面资料卡按自然高度完整展开并保持 CSS `sticky`。常规顶部位置由 `--header-height: 72px` 加 `--content-top: 22px` 得到 94px；高度不超过 700px 时两者为 64px 和 16px，顶部位置为 80px。上下滚动不主动改变偏移，不设置负偏移或独立滚动区域。页脚仍在正文布局内的第二行，侧栏跨越正文和页脚，浮动受该容器边界约束。锚点留空由展开导航高度加 20px 控制，常规为 92px、手机及短桌面为 84px。

保留当前 147 × 206 像素头像原文件，图片按自然比例显示，常规图框宽 122px、圆角 12px、内部留白 4px。桌面高度不超过 840px 时使用 94px 头像和紧凑间距；高度不超过 700px 时进一步采用 54px 头像与姓名并排，仍保持浮动。极矮窗口不能保证资料同时全部可见。宽度不超过 680px 时，仅首页显示普通文档流中的简约个人栏：头像 54px，英文姓名 26px、中文 18px 同排，身份 13px；内边距 `16px 20px 10px`、下外边距 18px，隐藏单位，联系入口上间距 12px，保留四个现有入口及可选 CV。论文与获奖页整个 `.profile` 使用 `display: none`，页面网格改为 `1fr auto` 两行。350px 及以下首页姓名为 23px、左右内边距 16px、列间距 12px，头像仍为 54px。桌面完整资料保持原样；打印恢复所有页面的个人栏与单位。

资料卡联系入口依次为 Google Scholar、GitHub、University profile、邮箱、可选 CV；CV 始终排在最后，缺少配置的 GitHub / CV 不显示。University profile 使用句式大小写，profile 不大写。`app.js` 与所有内容页静态回退保持同一 DOM 顺序，使显示与键盘顺序一致，不使用 CSS `order`。入口使用 10px 圆角，左右 8px 内边距配合等量负外边距保持文字对齐，列表项上下各留 2px 间隔。链接本体保持 flex 布局，左侧为 SVG 图标，文字 `.profile-link-label` 使用 `flex: 1; min-width: 0`，右侧 `.profile-link-arrow` 是链接的直接子级，固定占 14px，不带前置空格，使各行箭头对齐在同一列。所有内容页静态回退与 `app.js` 使用相同结构。悬停和键盘聚焦保持透明背景，文字、左图标和右箭头同时变为链接蓝色 `#435fc7`；仅文字 label 显示 1px 细下划线、距离文字 3px，箭头不带下划线。邮箱同样带箭头，仍使用 `mailto:`，不在新窗口打开；手机仅资料区邮箱入口显示 `Email` 短标签，桌面及打印显示完整地址，链接的 `title` 和 `aria-label` 始终包含完整邮箱。宽度不超过 880px 及打印时统一隐藏资料链接箭头，隐藏后不占列宽；键盘聚焦保留可见外框。宽度不超过 680px 时入口使用 `repeat(2, minmax(0, 1fr))` 等宽双列网格，列间距 20px；第三项起只加细上边线，不跨列。默认第一行为 Google Scholar / GitHub，第二行为 University profile / Email，可选 CV 排在最后。文字保持 14px，所有入口保留至少 44px 点击高度；宽窄屏均允许 Google Scholar、University profile 按空格自然换行。

Manrope 用于英文与主要界面文字，Noto Sans SC 子集用于中文，均为本地 WOFF2 字体，使用 `font-display: swap`。所有内容页 HTML 按目录深度预加载这些字体，不请求外部字体服务。字体和原始 OFL 许可证来自用户源码包；版本核验情况、大小、校验值及子集限制见 [字体来源说明](assets/fonts/README.md)。原有 Source 字体和许可证保留，但当前页面不加载它们。中文子集不覆盖所有汉字，保留系统字体回退，新增中文时检查缺字、字体混排与换行。

常规姓名为英文 34px、中文 20px；首页栏目标题 22px、手机 21px，论文页与获奖页标题常规为 34px；680px 及以下论文页标题使用 `clamp(26px, 7.5vw, 32px)`，获奖页标题保持 32px。手机论文页标题与 Google Scholar 文字入口同一行、两端对齐并垂直居中，间距 8px；链接保留完整文字和至少 44px 点击高度，左右内边距为 0、不换行，键盘焦点框内收 2px，避免伸入相邻年份栏。年份按钮文字横竖均居中。短横栏可安全整体平移时保持零首尾留白，以当前项中心对齐论文显示区域中心；空间不足或不能安全平移时，使用稳定窗口及首尾留白在内部居中。浮动短竖栏通过整体上下移动，将当前项对齐主导航下缘至视口底部区域的中点；溢出竖栏在稳定窗口内滚动居中。手机标题区与年份横栏之间仅留 1px，年份横栏不设上下内边距、下边距为 1px，年份分组标题与论文卡片的间距为 8px；保留年份入口至少 44px 点击高度及吸顶位置。681–880px 有侧栏时标题区仍上下排列。英文简介 17px、行高 1.9，在不超过 880px 时为 16px；`.bio-en strong` 使用深色 `var(--text)` 和 700 字重；中文简介 15px、行高 1.95，两段间距 21px。资料身份常规 14px，高度不超过 700px 的桌面及手机首页为 13px；单位英文 14px、中文 13px，联系入口 14px，窄屏不降低单位和联系字号。首页发表概述 16px。论文标题 18px、行高 1.55，普通作者 14px / 400、行高 1.85；venue 全称与年份 14px、行高 1.85，缩写标签 12px，Paper/PDF 为 13px、行高 1.7。奖项英文结果 15px / 700，中文结果及双语补充说明均为 14px，中文竞赛或机构名仍为 14px。其余响应式层级以 CSS 为准。

年份导航与论文列表共用 `.publication-browser`：超过 1099px 时为 `minmax(0, 1fr) 60px` 两列、12px 间距，列表左侧、年份右侧。`--year-rail-overhang` 使用 `clamp(26px, calc((100vw - 1068px) / 2 - 16px), 68px)`；区域通过等量负右外边距向右扩展，标题区右内边距为 `calc(72px - var(--year-rail-overhang))`，使 Google Scholar 文字入口右沿对齐论文卡片右沿；年份栏在其右侧相隔 12px，距视口边缘至少 16px。桌面页顶年份栏顶部对齐首张白色 `.year-papers` 卡片顶部，保留 `sticky top: var(--profile-top)`（常规 94px、短桌面 80px）。`.publication-browser` 的 `--year-heading-size: 15px`、`--year-heading-line-height: 1.7`、`--year-heading-gap: 14px` 共同控制年份 h3；681–1099px gap 为 10px，680px 及以下为 8px。宽度至少 1100px 时，只有 `.publication-years:not(.is-floating)` 使用 `margin-top: calc(var(--year-heading-size) * var(--year-heading-line-height) + var(--year-heading-gap))`，当前为 39.5px，使年份栏越过 h3 及其下间距后与论文卡对齐；浮动竖栏和横栏不加此上间距。启用 JavaScript 后，滚动超过 28px 时添加 `.is-floating`，使用 fixed；以 `readingCenter = (实际主导航下缘 + innerHeight) / 2` 为对齐目标。短竖栏全部年份可见时，使用当前项相对栏顶部的中心偏移计算 top，移动整个栏，使当前年中心位于主导航下缘至视口底部区域的中点；正常两年列表从第一年切到第二年时整栏上移 46px，列表仍高 90px、无首尾空槽。列表纵向溢出时以 `ul` 视窗中心计算 top，外层保持稳定，当前年在内部滚动居中；编辑按钮不参与中心基准，但计入栏总高及上下限位。top 为 `max(实际导航下缘 + 12, min(readingCenter - 中心偏移, innerHeight - 栏总高 - 12))`，保留上下 12px 安全距离，极短视口优先避开主导航；left 为父容器右边界减栏宽，浮动时仍为 60px 宽并沿用网格列的横向位置，页尾不会把它推走。大于 1px 且不超过 28px 时保持当前状态，回到顶部 1px 内恢复与首张论文卡对齐的位置；初始化按当前位置是否超过 1px 决定浮动状态。浮动时输入面板最大高度为 `calc(100dvh - var(--year-dock-top) - 16px)`，HTML 中年份栏仍位于列表前，保留键盘顺序。

横竖年份按钮文字均居中，列表按实际年份数保留最多五个位置。竖栏 `--year-slots` 使用 `Math.min(years.length, 5)`；每项高 44px、间隔 2px，两年时列表高 90px。列表高度为 `min(calc(var(--year-slots) * 46px - 2px), max(44px, calc((100dvh - var(--header-height)) / 2 - 36px)))`，短视口或年份较多时转为内部纵向滚动。36px 为编辑按钮 44px、控件间距 2px、安全距离 12px 减去单项半高 22px，为整个浮动栏预留空间；空间充足时两年列表仍高 90px。无 JavaScript 时仍使用最大 `min(320px, calc(100dvh - var(--profile-top) - 64px))` 的原生竖向滚动列表。

1099px 及以下清除右扩展与标题内边距，恢复单列横栏；入口宽 64px、间隔 2px，增强后列表高 44px，`ul` 使用 `flex: 0 0 auto`，最大宽度为 `calc(100% - 46px)`，为右侧 44px 编辑按钮和 2px 控件间距留出空间。当前年份的中心对齐 `#publication-list` 左右边界的中点，该区域与白色论文卡同宽；论文列表不可用时使用年份导航自身的左右中点。列表可用宽度仍由 `--year-list-width` 控制：理想宽为 `slots * 64 + (slots - 1) * 2`，`slots = Math.min(years.length, 5)`；对称可用半宽以论文显示区域中心为基准，取该中心至栏左边界距离，与至右边界距离扣除按钮宽度及控件间距后的较小值，即 `sideRoom = min(center - left, right - center - buttonWidth - gap)`。编辑按钮不参与当前年份的中心基准。实际宽取理想宽与两倍可用半宽的较小值，后者至少保留一个年份宽度。

横栏预先检查首末年份整组平移的空间，右端计入编辑按钮宽度及 2px 间距，视口左右各保留 12px；平板保留左侧资料区时，左边界至少为 `max(12px, profile.right + 2px)`。自然总宽不超过窗口宽加 1px、且两端平移都不会越界时，保持零首尾留白，整体平移列表，使当前项中心对准论文显示区域中心；两年列表宽 130px，切换当前年移动 66px，编辑按钮随列表排列。`--year-list-offset` 为论文显示区域中心减导航栏左边界、再减当前项在列表中的中心偏移；可以为负以利用列间隙，但不覆盖资料区。自然总宽超限或任一端整体移动不安全时，采用 `horizontalWindowed` 模式：窗口自身中心固定在论文显示区域中心，用首尾留白在内部滚动当前年。原自然总宽虽然能放入窗口、但平移后会越界时同样采用稳定窗口；模式由两端空间共同决定，不随当前年份反复切换。无 JavaScript 时使用 `width: max-content; max-width: 100%; flex: 0 1 auto`，在正文栏内居中并保留原生滚动。

测量前先清除旧轴首尾内边距。横栏在 `horizontalWindowed` 模式、竖栏在 `scrollHeight > clientHeight + 1` 时添加 `max(0, (列表 clientSize - 单项尺寸) / 2)` 的居中留白，使首尾年份也能在内部居中；其他情况保持 0。安全可平移的短横栏通过列表外偏移跟随当前年份，浮动短竖栏通过外层 top 跟随当前年份，两者内部不滚动；稳定窗口横栏和溢出竖栏则在内部滚动当前年份。列表尺寸用观察 border-box 的 `ResizeObserver` 重新测量，并在 resize、pageshow 和字体就绪时同步。

横栏 `top: var(--sticky-header-height)` 紧贴主导航下缘，变量随相邻 header 的 `.is-compact` 使用展开或紧凑高度，top 过渡为 180ms。所有不超过 1099px 的横栏上下内边距均为 0；681–1099px 标题区下边距为 6px、横栏下边距为 2px、年份标题下间距为 10px；680px 及以下标题区与横栏下边距各为 1px，年份标题下间距为 8px。宽度至少 1100px 时标题区下边距 22px、年份标题下间距 14px 不变。年份不换行并在列表视窗内横向滚动，焦点外框内收 2px。年份横栏本体保持透明；未合并时由其不接收点击的绝对定位 `::before` 绘制背景，与主导航共用磨砂变量和实色回退规则。未合并时，680px 及以下只将背景层通过 `inset-inline: calc(-1 * var(--page-gutter))` 延伸至视口左右边缘；`.page-width` 共用该侧边距，常规为 20px，350px 及以下为 16px。681–1099px 不铺满视口；年份列表和编辑按钮仍在论文内容栏中排布，当前项仍以论文区域为居中基准，44px 高度不变。启用 JavaScript 后，1099px 及以下所有横栏（含横屏手机和平板）在实际 top 与 `.header-inner` 下缘相差不超过 1px、且主导航下缘大于 0 时，为 body 添加 `has-joined-navigation`。脚本在固定主导航上设置三个变量：`--joined-navigation-height` 为年份栏实际 bottom，`--joined-navigation-left` 为年份栏实际 left，`--joined-navigation-offset` 为主导航实际下缘。主导航 `::before` 保持显示，将高度扩展至年份栏下缘；合并期间高度直接跟随测量结果，仅背景色过渡 180ms，避免背景落后于两行位置。年份栏自身 `::before` 使用 `display: none`，由固定主导航的一层连续背景覆盖两行，避免长距离向上延伸的 sticky 背景在页底遮挡不稳。680px 及以下保持全屏宽矩形；681–1099px 使用 `clip-path: polygon(...)` 保留上方主导航全宽，下方年份行仅从 `--joined-navigation-left`（论文栏左沿）延伸至视口右沿，以 `--joined-navigation-offset` 为裁剪拐点高度，避开左侧个人资料卡；仍为同一背景层，不拆分模糊。只有背景扩展或裁剪，年份数字与编辑按钮仍按论文显示区域居中；主导航保持 z-index 20，合并时年份栏升至 21，使年份、铅笔按钮和输入面板位于固定磨砂层上方；未合并时年份栏为 10，文字始终不透明。未吸顶、回到顶部或宽度超过 1099px 时移除该类和三个变量，恢复独立背景及宽屏竖栏；无 JavaScript 时保留独立背景。状态使用现有 scroll / requestAnimationFrame 流程，以及 resize、pageshow、load 和观察 `.header-inner` 的 ResizeObserver 重新测量。减少动态偏好关闭过渡。窄屏年份标题 `scroll-margin-top: 44px` 与 html 留白叠加，原生锚点和无脚本跳转后均不被横栏遮挡。打印隐藏年份栏，将论文浏览区恢复块布局并清除右扩展与标题内边距。

横竖年份栏功能一致：滑动年份列表只浏览可选年份，不选中年份、不跳转论文，也不改写 hash；点击年份、Enter 或有效输入提交统一由 `jumpToYear` 立即同步 `currentYear`、唯一的 `aria-current` 及居中位置，再执行原生锚点跳转。临时目标保护避免平滑滚动途经的年份覆盖所选项；实际阅读位置判定到达目标年时解除，1.5 秒后兜底清除并重新测量阅读位置。`wheel`、`touchmove`、年份栏外的 `pointerdown`，以及未被阻止且不来自输入控件的页面滚动键（上下方向键、PageUp / PageDown、Home / End、空格）取消保护并重新测量阅读位置。初始化和 `hashchange` / `popstate` / `load` / `pageshow` 通过 `restoreYearTarget` 保护地址中的已知年份，避免浏览器恢复深链或历史位置前被首屏覆盖；其他 hash 清除保护。`resize` 只重新测量，不主动清除目标，`pagehide` 清理目标和计时器。该保护与手动浏览后暂停列表内部自动居中的 1.5 秒计时分别维护。安全可整体移动的短横栏在当前年更新后左右平移，使目标年份对齐论文显示区域中心；浮动短竖栏上下移动，使目标年份对齐阅读区中点，两者均保持紧凑且内部不滚动。横栏使用稳定窗口或竖栏实际溢出时，目标年份在内部滚动居中。触摸和触控板滚动保留浏览器原生行为；也可按住鼠标拖动列表，拖动后不会误触年份跳转。横栏区域的纵向滚轮可浏览横向年份，仅在对应方向还有内容时阻止页面滚动，到边界后交回页面。横栏用左右方向键、竖栏用上下方向键移动年份焦点，Home / End 选首尾项；这些按键只移动焦点而不改变选中年份，并在横栏使用稳定窗口或竖栏实际溢出时将焦点项置于列表视窗中心，按 Enter 才执行原生锚点跳转。组合键点击保持原生行为。普通指针单击延迟 400ms，以便区分双击，键盘触发不延迟。

横竖年份栏提供独立铅笔按钮，竖栏放在列表下方、横栏放在右侧；按钮为 44px × 44px，透明无底框，悬停或聚焦时变蓝，保留可见焦点，与列表间距 2px。点击按钮可开关年份输入面板，双击年份栏、触屏双击年份或聚焦年份后按 F2 也可打开。按钮带有 `aria-label="Jump to year"`、指向表单的 `aria-controls`，并随开关同步 `aria-expanded`；年份链接保留 `title` 提示、`aria-keyshortcuts="F2"` 和 `aria-controls`。面板由 `app.js` 创建并绝对定位：宽桌面在竖栏左侧，横栏在其下方，不占导航高度或推动正文。填写四位年份并按 Enter / Go，只能跳到已有论文的年份；格式不符或没有对应论文时显示错误提示，不改变当前地址和滚动位置。Esc 或取消按钮关闭面板并恢复触发项（编辑按钮或年份）焦点；成功提交使用对应的原生锚点跳转，并聚焦该组 h3。编辑按钮和输入表单不写入静态生成区，不改变共享渲染器与同步命令；禁用 JavaScript 时保留原有年份链接、触摸/触控板滚动与完整论文列表。

论文页按年份组成卡片，年份标题后接细线，同组论文之间保留浅分隔线。Paper / PDF 在超过 880px 时位于论文右侧，较窄屏置于文字下方；所有资源入口最小点击高度 44px。Paper / PDF 外框用 `a::before` 上下内缩 5px 绘制，常规视觉高度 34px、圆角 6px；文字字号与点击区域保持不变。横竖年份列表仅显示数字，编辑按钮独立排在列表外；列表与链接均无背景、边框、阴影或绘框伪元素；当前项由 `[aria-current]` 设置蓝色和 700 字重，其他项为 600 字重。`:focus-visible` 保留可见 outline，链接始终无下划线。仅在 `(hover: hover) and (pointer: fine)` 下为非当前年份提供深色文字悬停反馈，防止触屏粘滞 hover 形成第二个选中状态。竖排列表保留左右 2px 内边距，年份链接内边距为 `8px 6px`；横栏年份宽 64px、左右内边距 12px，始终保持透明背景，首尾居中所需的列表内边距由脚本计算。Paper / PDF 桌面纵向点击区间距为 2px，窄屏横向间距仍为 10px。伪元素不拦截点击；年份选择与悬停/焦点按上述规则区分，Paper/PDF 的悬停/聚焦背景和边框反馈仍在资源伪元素中维护；打印时隐藏资源框。发表渠道全称与年份由 `.paper-venue` 统一使用 `--venue-text: #515d73`，保持 14px、400 字重和 1.85 行高，颜色略浅于普通作者；venue 缩写使用 12px 的浅蓝底标签。Paper / PDF 使用 13px、1.7 行高。普通作者使用 `--reading-text: #3f4b60`，作者链接平时继承同色，下划线较浅；悬停或聚焦时变为链接蓝色并增强下划线。Shen Hu 保持 `--text: #202a40` 和 700 字重。论文页标题区的 Google Scholar 使用纯文字入口：`.publications-intro a` 保持 13px 字号、1.7 行高、`padding: 10px 0`、至少 44px 点击高度及常规 `var(--link)` 蓝色，不设背景、边框、阴影或按钮圆角；悬停与键盘聚焦显示细下划线，保留可见焦点。资料卡中的 Scholar 及 View publications、Paper/PDF 的样式继续按各自规则维护。View publications、论文页 Scholar 和 Paper/PDF 的文字与箭头仍在同一内联文字流，普通空格处的下划线连续，不添加额外 flex 间距。

键盘聚焦本身不改变导航高度，保持当前展开或收窄状态，并保留 44px 点击区域及可见焦点。可见高度由 `--nav-height` 控制；调整窗口或浏览器恢复页面时根据当前滚动位置同步状态。交互过渡统一为 180ms；年份当前项使用 700 字重，其余悬停反馈不改变字重或布局位置。保留 Skip to content、可见焦点、减少动态效果和增强对比度规则；打印时取消卡片背景、阴影和侧栏浮动，隐藏导航和年份栏，恢复所有页面的个人栏、单位及联系入口。

## 修改后的检查与同步

涉及论文内容、人物链接、站主姓名或共享论文渲染器时，先同步，再执行只读检查；其他改动可直接检查：

```sh
npm run sync
npm run check
git diff --check
```

检查器执行共享论文渲染器并确认论文页生成区与配置一致，同时检查 JavaScript 语法、资料与人物配置、奖项数组、别名冲突、四个共享脚本的加载顺序、静态链接和年份锚点、CSS/数据中的资源引用、静态 JSON-LD，以及部署路径。检查完全离线，不修改文件，不验证外部网址是否可访问，也不执行浏览器 DOM 渲染。

页面、数据或交互改变时，按影响范围在浏览器验证相关页面、手机窄屏布局、论文显示、年份跳转、人物中英文别名及 Paper/PDF 链接；论文相关改动还需核对禁用 JavaScript 时的完整列表和年份跳转；奖项改动需核对启用与禁用 JavaScript 时的双语文本、顺序和官方入口一致，且不显示年份。仅修改文档时核对命令、路径和代码事实，无需重复浏览器验证。静态同步检查不能代替实际的浏览器交互、布局和动态 JSON-LD 验证。

导航或排版改变时，检查浅蓝灰背景、白色面板、无框 SH 与无底色文字导航；当前、悬停及聚焦项有细下划线，增强对比度下当前项为 2px。核对超过 28px 收窄、上滚保持、顶部 1px 内展开，以及刷新、调整窗口、恢复页面后的状态。导航 top 始终为 0，body 占位避免正文跳动；滚动超过 1px 后通常仅出现底线（论文页横栏吸顶合并时不显示，680px 及以下始终隐藏），返回顶部后消失。支持滤镜时核对磨砂与不透明文字；顶部、不支持滤镜、减少透明度及增强对比度时实色回退。宽桌面导航在右侧正文列居中，收窄不改变横向位置或 44px 点击高度，聚焦不改变高度。资料链接核对 Scholar、GitHub、University profile、邮箱、可选 CV 的 DOM 顺序，以及一致的显示和键盘顺序，箭头同列，悬停无底色、文字和图标变蓝且仅 label 下划线，动态/静态顺序与结构一致；窄屏及打印隐藏箭头不占列宽，手机为等宽双列、第三项起不跨列，点击区不重叠；核对长标签自然换行、手机 `Email` 短标签、桌面及打印完整邮箱，以及含完整地址的 title / aria-label。检查完整资料、sticky 顶部和页尾边界，短窗口紧凑头像保持浮动；单位、联系文字、发表概述、作者、venue 和奖项说明增大后仍正常换行。核对 Manrope / Noto 资源与预加载、中文子集回退。手机四项导航完整可用，Awards 当前项及旧 contact 锚点正确，首页显示隐藏单位的简约个人栏，论文与获奖页隐藏整个个人栏；打印三页均恢复完整资料和单位，英文单位按完整文本显示，统一使用 400 字重及单位 `--muted` 颜色，随宽度自然换行而不强制学校另起一行。论文验证资源右侧/下方切换；核对 Scholar 为蓝色纯文字入口，桌面入口右沿对齐论文卡片右沿、手机与标题同排，悬停/聚焦下划线及内联箭头连续，44px 点击高度与可见焦点保持；年份栏宽 60px、相隔 12px 及视口边距；核对竖栏左右 2px 内边距、年份链接左右 6px 内边距，以及独立 44px 编辑按钮和 2px 控件间距，非覆盖式滚动条下仍保留至少 44px 点击宽度；检查页顶年份栏顶部对齐首张白色论文卡、超过 28px 后当前年对齐主导航下缘至视口底部区域的中点且不带上间距、回到顶部 1px 内恢复卡片顶部对齐，以及页尾不将浮动栏推走；窄屏横栏紧贴导航、收窄时同步移动，与主导航共用透明磨砂变量；在手机、横屏手机和平板的所有横栏宽度下，核对吸顶时 `has-joined-navigation` 生效、固定主导航背景扩展到年份栏下缘、年份栏自身背景隐藏，年份控件仍清晰可点击，单层背景上方覆盖主导航全宽；680px 及以下年份行同样全宽，681–1099px 下方年份行裁剪到论文栏左沿至视口右沿，横屏短窗口的个人资料卡顶部完整可见。两行磨砂连续、无接缝且无横向溢出；在页面中部、最底部及从底部回滚时，核对背景覆盖完整，底层论文文字不会清晰穿过导航，且年份、主导航和输入面板仍可操作；回顶部、解除吸顶或切到超过 1099px 的竖栏后清除合并类与三个变量，恢复独立背景，无 JavaScript 时保持独立背景。无滤镜、减少透明度及增强对比度时，可见背景层关闭模糊并回退实底。核对未合并时 680px 及以下仅年份背景层铺满屏宽，常规 20px / 不超过 350px 时 16px 侧边距与正文一致，平板背景仍限于正文栏；合并后仅扩展背景，列表和编辑按钮仍以论文区域为布局和居中基准；核对横栏上下无内边距、681–1099px 标题/横栏下边距为 6px/2px、手机各为 1px，年份标题下间距分别为 10px/8px，44px 点击区保持完整。核对上下滚动、短末组、锚点跳转、刷新及调整窗口后的年份高亮与 URL hash 一致；阅读切年只替换当前历史项、不移动焦点，路径、查询参数和 `history.state` 保留。检查首次无 hash 地址保持简洁、非年份 hash 保留、直接打开年份深链及刷新不会被首屏覆盖，以及浏览器前进后退恢复。点击、Enter 及有效输入提交后，选中年份和居中位置立即一致，平滑跳转途中不被其他年份覆盖；核对原生点击产生历史、平滑跳转途中 hash 保持目标年份、到达目标、1.5 秒兜底、手动滚动取消保护，以及 hashchange / popstate、页面恢复和调整尺寸后的同步。横竖按钮文字均需居中；可用空间充足时两年竖栏高 90px、横栏宽 130px，首尾不留空槽，安全可平移的两年横栏切换时整体左右移动 66px，当前年中心保持对齐论文显示区域中心；浮动短竖栏内部不滚动，整栏随当前年切换上移或下移 46px，使当前年中心保持在阅读区中点。检查保留左侧资料区的平板宽度下，横栏当前年份中心等于 `#publication-list` 左右边界中点；手机版论文区左右对称时视觉位置维持，横栏右侧为编辑按钮预留空间，但当前年份仍以论文区域为居中基准。包含编辑按钮的整组平移不得越过视口 12px 边距或资料区右侧 2px 边界；自然宽超限或整体平移不安全时改用稳定窗口，即使原列表本可放下也检查该回退。稳定窗口横栏及溢出竖栏核对当前项与首尾年份在内部居中；短视口检查竖栏按包含编辑按钮的高度上限转为内部滚动、按钮可见和上下 12px 限位及主导航收窄后的重新定位；检查横竖断点切换时重新计算留白，不带入旧轴内边距。触屏点击其他年份再回到页顶，仅首年保留蓝色和 700 字重，其他年份为 600 字重，横竖年份列表及链接均无底框、背景和阴影；旧项不因粘滞 hover 或焦点显示为第二个选中项，也不留下划线；横栏点击切换和鼠标停留时均需核对，键盘焦点仍清晰可见；用临时副本加入更多年份，验证横向/纵向限幅滚动、滑动仅浏览而不改变当前年或 hash、鼠标拖动不误跳、滚轮边界交回页面、方向键/Home/End 与 Enter、当前项按需居中和手动浏览暂停。检查编辑按钮开关、aria-expanded 同步、双击/触屏双击/F2、title 与 ARIA 快捷键提示、有效与无效年份、Esc/取消恢复触发按钮或年份焦点、成功跳转聚焦对应标题，以及禁用 JavaScript 时原生滚动与锚点跳转；按影响检查打印和辅助显示偏好。

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

统一在 `/Users/hushen/Documents/ChatGPT/scholarpage` 的 `main` 修改蓝灰版、预览和提交。白底版与极简版只需保留为 Git 分支，不占用独立常驻工作目录。普通维护或文档修改不新建 worktree 或克隆；只有用户明确要求并行工作目录时才使用额外工作树。仅要求修改时，AI 完成实现、验证和文档同步，不自动提交或推送；明确请求提交、推送或发布时，按请求的范围执行。单独询问步骤时只提供命令。

1. **开始修改前确认工作区。** 进入统一目录，检查当前分支和已有改动：

   ```sh
   cd /Users/hushen/Documents/ChatGPT/scholarpage
   git rev-parse --show-toplevel
   git branch --show-current
   git status --short
   ```

   当前分支应为 `main`。若此前临时查看了其他版本，先保存该分支的修改，工作区干净（`git status --short` 没有输出）后返回 `main`；需要获取远端更新时快进拉取：

   ```sh
   git switch main
   git pull --ff-only origin main
   ```

   若有未提交改动，先确认归属并按用户授权保存，不自动带着改动切分支、覆盖文件或 stash。若提示 `main` 被其他工作树占用，先用 `git worktree list` 核对并保护相关目录的改动，不新建目录绕过问题。快进拉取失败时先检查分支差异，不强行重置。

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

   提交前确认暂存区没有其他任务的内容，提交说明应对应实际改动。暂存、提交和推送均在上述统一目录的 `main` 执行；提供步骤时写明该目录及实际改动文件，不再使用旧临时工作目录，也不默认使用 `git add .`。

4. **决定发布后推送 `main`：**

   ```sh
   git push origin main
   ```

推送会自动触发 [Deploy academic homepage](https://github.com/shenhu365/shenhu365.github.io/actions)，无需重复 Run workflow。首次启用时确认一次 Pages 的 Source 为 GitHub Actions；后续等待对应提交的检查和部署成功，再查看[线上主页](https://shenhu365.github.io/)。本地检查通过或推送成功都不等于已确认部署成功。工作流只收集白名单静态文件、`publications/`、`awards/` 和 `assets/`，不发布根 README、MAINTENANCE、AGENTS、来源笔记或维护脚本。

推送报错时先查看原因、远端状态和未提交改动，处理后再尝试；不要使用 `--force` 覆盖远端记录。

## 保留的其他版本

这些分支与 `main` 共享同一个仓库，不需要各自保留一份工作目录：

| 分支 | 用途 |
| --- | --- |
| `codex/white-ui-redesign` | 保留未合入、未上线的白底方案及该分支的文档修改 |
| `codex/minimal-backup` | 保留极简版及其简洁 README |
| `codex/blue-ui-backup` | 保留较早的蓝灰版快照 |

日常维护留在 `main`，不自动覆盖、合并或删除这些分支；白底方案只有用户明确要求采用时才合入并发布。白底界面版本已推送 GitHub，后续本地文档提交是否已上传需查看 Git 状态，保存为本地提交不等于推送。原 `codex/ui-redesign` 不再是维护依赖。此前额外工作目录已清理，分支及提交历史仍在；旧版本文档中的目录安排仅代表当时状态，当前工作目录约定以 `main` 的本文件和 `AGENTS.md` 为准。

无需切分支即可只读比较，例如：

```sh
git show codex/white-ui-redesign:styles.css
git show codex/minimal-backup:styles.css
git show codex/minimal-backup:index.html
```

若用户需要预览其他版本，先按授权保存当前改动并确认工作区干净，停止本项目的预览服务，然后在统一目录执行 `git switch codex/white-ui-redesign` 或 `git switch codex/minimal-backup`，再运行 `npm run dev`。查看结束后停止服务，确认没有未保存改动，执行 `git switch main` 并重新启动预览。切换只改变本地文件，不会自动合并分支或部署。本项目没有第二套页面或运行时版本切换开关；旧版预览通常无需修改文件，备份分支不用于日常提交。

## 常见问题

- **4173 端口被占用，或浏览器仍显示旧版：** 在启动旧服务的终端按 `Ctrl+C`，从当前项目目录重新运行 `npm run dev` 并刷新页面。旧版非 watch 进程不会随服务器脚本更新；不确定时用 `npm run dev -- --port 4174` 启动新服务并访问对应端口。
- **新页面或文件返回 404：** 检查路径与文件名大小写、浏览器端口及 `--base` 是否正确，再核对上面的预览白名单、检查清单与 Pages 复制清单。macOS 本地可能忽略大小写，GitHub Pages 不会。
- **检查提示论文静态内容过期：** 运行 `npm run sync` 后再运行 `npm run check`，将配置与更新后的 `publications/index.html` 一起提交；不要通过手改生成区或跳过检查解决。
- **当前应该在哪个目录、分支修改：** 日常进入 `/Users/hushen/Documents/ChatGPT/scholarpage` 并确认分支为 `main`。白底版和极简版保留为分支，只有用户要求时才在同一目录切换查看；先保存改动，查看结束后回到 `main`，不为日常维护新建工作目录。
- **本地正常，线上没变化：** 先确认改动已提交并推送到 `main`，再查看 Actions 中对应提交的部署结果。若部署成功仍未更新，刷新浏览器并检查文件是否纳入 Git 和发布清单；推送白底预览或备份分支不会自动部署；此时线上未改变是正常结果。
