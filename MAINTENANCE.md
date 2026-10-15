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

**个人资料与简介：** 修改 `data.js` 的 `profile`。简介使用 `profile.about.en` 和 `profile.about.zh`，两种语言应同步更新，并同步 `index.html` 中 `[data-bio]` 的静态回退文字。姓名、单位、身份、联系方式或头像变化时，同时检查所有内容页 HTML 中的静态个人资料、图片 `alt`、`title`、description 和 Open Graph 元数据；这些内容不会全部随数据自动更新。英文单位仍只在 `profile.affiliation.en` 保存，页面按最后一个逗号拆分为研究院与学校两层；没有逗号时整段显示。修改姓名还需运行下述 `npm run sync`，更新论文作者加粗。

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

当前 `codex/white-ui-redesign` 是白底 UI 的独立预览方案，正式站 `main` 保持蓝灰版。白底方案以纯白背景、墨色层级、衬线标题、宽留白和细线组织内容；资料区右竖线与正文分开，三页主标题上方及资料区单位下方均不设横线，论文及奖项采用分隔行，不再使用大块渐变卡片和面板阴影。所有样式在 `styles.css`，个人事实、论文、奖项与人物链接仍由共用配置管理。

颜色集中在 `:root`：背景 `#ffffff`、正文 `#202a35`、标题 `#18222d`、阅读文字 `#3d4854`、venue 全称与年份 `#4b5865`、辅助信息 `#5d6873`、链接 `#245d86`、分隔线 `#dce1e5`、浅线 `#e9edf0`、venue 标签底色 `#f2f6f8`。中文简介、发表概述、普通作者及奖项补充说明共用 `--reading-text`；venue 使用 `--venue-text`。增强对比度下阅读文字为 `#202a35`、辅助信息与 venue 为 `#35414d`，边线加深；打印时辅助信息与 venue 为 `#4b5865`。三页 `theme-color` 同为白色。

常规容器最大宽 1080px、两侧至少各 44px 留白，侧栏 246px、间距 64px；1099px 以下为 224px / 40px，880px 以下为 200px / 30px。正文顶部由 `--content-top` 控制：常规 32px、880px 以下桌面 28px、高度不超过 840px / 700px 的桌面分别为 24px / 20px、手机 44px。资料区距展开导航的间距独立使用 `--profile-gap`：对应为 64px、48px、44px / 34px、44px，因此可以单独调整资料位置而不推低右侧主标题。侧栏常规右内边距 30px，1099px 及以下为 16px，高度不超过 700px 的桌面另设为 18px；右侧保留 1px 竖线。首页栏目常规内边距 28px 0 32px，以细线分隔；首栏目上内边距为 0，论文与获奖页标题区也不额外添加上内边距。1099px 以上 Publications 入口在概述右侧，Service / Contact 使用 205px 标题列加内容列，较窄时纵向排列。

Source Serif 4 用于英文姓名、SH、栏目标题、内页大标题和论文年份；Manrope 用于正文、导航和论文标题，Noto Sans SC 子集用于中文。三份均为本地 WOFF2、使用 `font-display: swap`，每页按目录深度预加载；Source Serif 4 启用 `font-optical-sizing: auto`，Source Sans 3 保留但不加载。来源、版本核验情况及许可证见[字体说明](assets/fonts/README.md)。中文子集不保证覆盖所有汉字，保留系统回退并检查新增文字的缺字、混排与换行。

常规姓名为英文 39px / 500、中文 19px 另起一行；About Me、Publications 与 Awards 大标题 44px，普通首页栏目标题 29px，Service / Contact 26px。英文简介 17px、行高 1.95；中文 15px、行高 2、两段间距 23px；加粗部分使用深色。身份文字常规 14px，高度不超过 700px 的桌面及手机内页为 13px；单位英文 14px、中文 13px，联系入口 14px，窄屏不降低这三项字号。首页发表概述 16px、行高 1.9。论文标题 18px / 600、行高 1.6；普通作者 14px / 400、行高 1.85。更小屏幕字号与间距以 CSS 为准。

导航顺序为 Home、Publications、Awards、Service；Contact 邮箱区仍在首页。顶部 `position: fixed; inset: 0 0 auto`，body 保留展开高度占位。880px 以上 header 与正文共用两列网格：SH 在左列起点，文字导航在右侧正文列内居中；880px 以下两端 flex 排列，680px 以下导航 `flex: 1`，530px 以下隐藏 SH、四列导航铺满。字号常规 16px / 500，530px 以下 14px，350px 以下 13px。所有入口至少 44px 高，当前、悬停及键盘聚焦项用蓝字和 1px 细下划线反馈，无分段卡片背景。

滚动超过 28px 后，可见导航常规从 72px 收至 52px，手机及高度不超过 700px 的桌面从 64px 收至 48px；上滚保持紧凑，只有回到顶部 1px 范围内才展开，中间区间保留当前状态。`.is-compact` 仅调整 `--nav-height`，背景和内部容器高度过渡 180ms，横向位置、字号和 44px 点击区域不变。body 保留展开高度，避免正文跳动。原蓝灰版的 `--nav-padding` / `--nav-item-inset` 及卡片缩进规则已移除。

导航页顶为白色实底和浅底线。滚动超过 1px 时 `.is-scrolled` 加深底线；支持滤镜时，全宽背景改为 `rgb(255 255 255 / 72%)`，配合 `blur(14px) saturate(110%)`，文字保持不透明，无导航组独立底色或阴影。滚动状态普通导航文字使用 `--reading-text`，悬停、聚焦及当前项使用更深的蓝色 `#1f5075`，保持透明背景下的可读性。不支持滤镜、减少透明度或增强对比度偏好下使用实色；后两者同时关闭模糊。减少动态偏好关闭平滑滚动和过渡。初始化、resize、pageshow 按滚动位置是否超过 1px 同步紧凑及边界状态；键盘聚焦不改变高度。

主导航按路径与 URL 锚点更新：`#service` 对应 Service，首页其他情况为 Home，旧 `#contact` 仍定位邮箱区并高亮 Home；论文页及年份锚点为 Publications，获奖页为 Awards。仅当前项带 `aria-current`，页面为 page、栏目为 location。初始化、hashchange、pageshow 同步，不随手动滚动切换。年份链接保留原生锚点；脚本只更新选中状态，无锚点选首年，匹配年份选对应项，其他锚点不选中，不拦截浏览器历史。

桌面资料自然展开、CSS sticky，无独立滚动。top 为展开导航高度加 `--profile-gap`：常规 136px，880px 以下普通桌面 120px；高度不超过 840px 的桌面为 116px，不超过 700px 时为 98px。资料区以 `margin-top: calc(var(--profile-gap) - var(--content-top))` 补足初始位置，保持初始与 sticky 位置一致；不要将其重新绑定到正文顶部间距。上下滚动不主动调整偏移；侧栏跨正文与页脚两行，受布局容器边界约束。锚点留空仍为展开导航加 20px，即常规 92px、手机及短桌面 84px。

保留原 147 × 206 头像及自然比例。常规图框宽 122px、圆角 3px、留白 4px；880px 以下桌面为 106px。681px 以上且高度不超过 840px 时头像 94px、间距收紧，700px 以下使用 54px 头像与姓名并排，仍浮动。680px 以下恢复普通文档流、清除资料上外边距，正文与资料顶部间距均为 44px，初始资料 top 为 108px：主页 84px 头像和完整资料，资料区底部内边距 18px、外边距为 0；论文与奖项页使用 54px 头像、可回首页的姓名与身份，隐藏完整单位和联系列表，资料区底部内边距 24px。极矮窗口不保证资料同时全部可见，不另加滚动容器。打印时取消浮动并清除资料外边距。

单位与资料联系入口之间用留白分隔，`.profile-links` 不设上边线。资料入口顺序为 Google Scholar、GitHub、University profile、可选 CV、邮箱；GitHub / CV 缺配置时不显示。链接使用 flex、4px 圆角、左右 8px 内边距与等量负外边距，列表项上下各 2px；左 SVG 图标、弹性文字 label、右侧固定 14px 箭头列。箭头为链接直接子级，无前置空格且 `aria-hidden="true"`。悬停及聚焦保持无底色，文字与图标变蓝，仅 label 显示 1px 下划线和 3px 偏移。邮箱也有箭头，仍为 mailto 且不开新窗口。880px 以下及打印时隐藏箭头并去掉列宽；手机联系入口双列、间距 20px，第三项起跨两列。各入口至少 44px 高，静态回退与动态结构一致。

论文使用原共享渲染器：880px 以上为 62px 年份左列、24px 间距与论文正文，880px 以下年份在组上方接细线；列表无卡片外框，同组条目之间用浅分隔线，每条底部内边距 4px（组内末条为 0），下一条上内边距 14px。不同年份组上外间距 22px、上内边距 18px，880px 以下取消组上内边距和上边线。所有宽度 Paper / PDF 均在文字下方横排，`.paper-links` 上内边距 2px；链接使用 14px 字号、1.6 行高和 `inline-block`，内边距为 `14px 0 8px`，保留至少 44px 点击高度（当前约 44.4px），键盘焦点外框偏移为 2px，避免跨过紧邻的分隔线。普通作者为 `#3d4854`，已配置作者链接继承同色与浅下划线，悬停/聚焦变蓝，Shen Hu 保持 700 字重。venue 全称和年份为 14px / 400、行高 1.8、`#4b5865`，缩写采用 12px 的淡底细边框标签。View publications 为 17px 文字链接；它与 Scholar、Paper/PDF 的文字和箭头保持同一内联流，悬停下划线连续。

奖项以细线分隔，880px 以上左侧为双语竞赛/机构与补充说明，右侧为奖项结果；右列常规 180px、间距 32px，1099px 以下为 160px / 24px。880px 以下纵向排列，结果左侧有细强调线。内容、顺序和无年份约定保持不变。

保留可见键盘焦点、Skip to content、减少动态和增强对比度规则。交互过渡统一 180ms，不变动字重；打印取消固定导航和侧栏浮动，隐藏年份栏，恢复论文及获奖页完整资料。

## 修改后的检查与同步

涉及论文内容、人物链接、站主姓名或共享论文渲染器时，先同步，再执行只读检查；其他改动可直接检查：

```sh
npm run sync
npm run check
git diff --check
```

检查器执行共享论文渲染器并确认论文页生成区与配置一致，同时检查 JavaScript 语法、资料与人物配置、奖项数组、别名冲突、四个共享脚本的加载顺序、静态链接和年份锚点、CSS/数据中的资源引用、静态 JSON-LD，以及部署路径。检查完全离线，不修改文件，不验证外部网址是否可访问，也不执行浏览器 DOM 渲染。

页面、数据或交互改变时，按影响范围在浏览器验证相关页面、手机窄屏布局、论文显示、年份跳转、人物中英文别名及 Paper/PDF 链接；论文相关改动还需核对禁用 JavaScript 时的完整列表和年份跳转；奖项改动需核对启用与禁用 JavaScript 时的双语文本、顺序和官方入口一致，且不显示年份。仅修改文档时核对命令、路径和代码事实，无需重复浏览器验证。静态同步检查不能代替实际的浏览器交互、布局和动态 JSON-LD 验证。

导航或排版改变时，检查白色背景、衬线标题、正文层级、竖线及栏目分隔、键盘焦点和锚点遮挡；核对滚动超过 28px 收窄、上滚保持、顶部 1px 内展开，以及初始化、resize、pageshow 的同步。导航 top 始终为 0，body 占位避免正文跳动，底线滚动后加深，支持滤镜时有轻微磨砂；顶部、不支持滤镜、减少透明度及增强对比度时为实色。桌面导航在右侧正文列居中，收窄不改变横向位置与 44px 点击高度，聚焦不改变高度。检查侧栏自然展开、固定偏移、页尾边界及短窗口紧凑布局。资料箭头同列，悬停无底色、文字和图标变蓝且仅 label 下划线，静态与动态结构一致，窄屏隐藏箭头不占列宽；手机双列点击区不重叠。核对三份字体与预加载路径、中文子集回退和长文本换行。手机保留四个导航入口，首页完整资料、内页简短身份区；核对 Awards 当前项及旧 contact 锚点。论文核对宽屏年份左轨、窄屏上方年份、文字下方资源入口、年份高亮和禁用 JavaScript 原生跳转；奖项核对左右列到纵向排列。按影响检查打印及辅助显示偏好。

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

以下日常流程用于已上线的 `main`。当前白底方案继续在 `codex/white-ui-redesign` 修改与预览，按下一节同步 GitHub 分支，明确采用后再合入发布，不在工作未保存时直接切换分支。仅要求修改时，AI 完成实现、验证和文档同步，不自动提交或推送；明确请求提交、推送或发布时，按请求的范围执行。单独询问步骤时只提供命令。

1. **开始修改前确认工作区。** 在项目根目录查看当前分支和已有改动：

   ```sh
   git branch --show-current
   git status --short
   ```

   只有工作区干净（第二条命令没有输出）时，才切到 `main` 并获取远端更新：

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

   提交前确认暂存区没有其他任务的内容，提交说明应对应实际改动。

4. **决定发布后推送 `main`：**

   ```sh
   git push origin main
   ```

推送会自动触发 [Deploy academic homepage](https://github.com/shenhu365/shenhu365.github.io/actions)，无需重复 Run workflow。首次启用时确认一次 Pages 的 Source 为 GitHub Actions；后续等待对应提交的检查和部署成功，再查看[线上主页](https://shenhu365.github.io/)。本地检查通过或推送成功都不等于已确认部署成功。工作流只收集白名单静态文件、`publications/`、`awards/` 和 `assets/`，不发布根 README、MAINTENANCE、AGENTS、来源笔记或维护脚本。

推送报错时先查看原因、远端状态和未提交改动，处理后再尝试；不要使用 `--force` 覆盖远端记录。

## 白底方案合入与发布

白底版本已推送到 GitHub 的 `codex/white-ui-redesign` 分支，本地同名分支跟踪 `origin/codex/white-ui-redesign`。当前仍是独立预览版本，尚未合入 `main` 或上线；`main` 继续发布蓝灰界面。

### 仅同步白底分支，不上线

在 `codex/white-ui-redesign` 完成修改、检查和提交后，按用户授权同步该分支：

```sh
git branch --show-current
git status --short
git push origin codex/white-ui-redesign
```

确认当前分支为 `codex/white-ui-redesign`，需要上传的改动已提交。该命令只更新 GitHub 上的白底分支；工作流的自动部署仅监听 `main`，因此不会自动上线。此流程不切换或合并 `main`，也不手动运行 Pages 工作流。文档等后续改动仍须单独提交并推送，分支已上传不代表新改动已同步。

### 正式采用白底方案后再合入发布

以下步骤仅在用户明确要求采用并发布白底方案后执行。直接运行 `git push origin main` 不会自动包含另一分支的改动。

先确认当前分支为 `codex/white-ui-redesign`，完成前文的检查和浏览器验证。若继续修改后仍有未提交内容，可按下面的清单检查并提交；工作区已干净时跳过 `git add` 和 `git commit`。以下文件是白底 UI 改版涉及的文件；后续若调整范围，暂存清单也应按实际改动更新：

```sh
git branch --show-current
git status --short
npm run check
git diff --check
git add styles.css app.js data.js index.html publications/index.html awards/index.html README.md MAINTENANCE.md AGENTS.md SOURCE_NOTES.md assets/fonts/README.md
git diff --cached --stat
git diff --cached
git commit -m "Create white academic homepage design"
```

确认暂存内容均属于本次任务，且提交后工作区干净，再切换、同步与合入正式分支：

```sh
git status --short
git switch main
git pull --ff-only origin main
git merge codex/white-ui-redesign
npm run check
git diff --check
```

如拉取或合并报错，先检查远端差异和冲突，保留双方所需改动，不使用强制重置或覆盖。合入后重新验证页面，并将 README、AGENTS 与本指南的“独立预览”状态更新为已采用的 `main` 版本；核对并提交这些状态说明后，再按授权运行：

```sh
git push origin main
```

在 Actions 确认对应提交部署成功。两个备份分支不参与合并，不从预览或备份分支手动运行 Pages 发布工作流。

## 保留的版本

`codex/blue-ui-backup` 在本地保留本次白底改版前的蓝灰版（`16ac7c9`）；`codex/minimal-backup` 保留极简版（`a58f7d9`）。它们仅供查阅或用户明确要求时恢复，不作为日常编辑分支，不把新设计合入其中，也不覆盖或删除。原 `codex/ui-redesign` 已完成之前的合并，不再是维护依赖。创建本地备份不等于已经推送远端；若需要远端备份，应另行明确推送这些分支。

无需切分支即可只读比较，例如：

```sh
git show codex/minimal-backup:styles.css
git show codex/blue-ui-backup:styles.css
```

若要切换分支预览，先妥善保存当前改动并确认工作区干净；预览结束后返回原工作分支。当前白底迭代在 `codex/white-ui-redesign`，正式站日常维护在 `main`。本项目没有第二套页面或运行时版本切换开关。

## 常见问题

- **4173 端口被占用，或浏览器仍显示旧版：** 在启动旧服务的终端按 `Ctrl+C`，从当前项目目录重新运行 `npm run dev` 并刷新页面。旧版非 watch 进程不会随服务器脚本更新；不确定时用 `npm run dev -- --port 4174` 启动新服务并访问对应端口。
- **新页面或文件返回 404：** 检查路径与文件名大小写、浏览器端口及 `--base` 是否正确，再核对上面的预览白名单、检查清单与 Pages 复制清单。macOS 本地可能忽略大小写，GitHub Pages 不会。
- **检查提示论文静态内容过期：** 运行 `npm run sync` 后再运行 `npm run check`，将配置与更新后的 `publications/index.html` 一起提交；不要通过手改生成区或跳过检查解决。
- **当前应该改哪个分支：** 白底方案在 `codex/white-ui-redesign`；已上线版本的日常维护在 `main`。不要在 `codex/blue-ui-backup` 或 `codex/minimal-backup` 编辑，切分支前先保存改动并确认工作区干净。
- **本地正常，线上没变化：** 仅推送白底预览或备份分支时，线上保持不变是正常情况。已明确执行正式发布时，再确认改动已合入并推送到 `main`，查看 Actions 中对应提交的部署结果。部署成功仍未更新时，刷新浏览器并检查文件是否纳入 Git 和发布清单。
