# 项目档案与智能体维护约定

本文件适用于整个仓库，供接手项目的 AI 编程工具与维护者阅读。开始工作前先读本文件和 [README.md](README.md)，按任务需要查阅 [MAINTENANCE.md](MAINTENANCE.md) 的详细配置、维护与部署说明，再查看相关代码。用户在当前任务中明确提出的新需求优先；需求改变后，在完成实现的同一轮更新相关文档。

## 项目目标和现状

- Shen Hu（胡深）的个人学术主页，重点是让访客快速找到个人介绍、论文、学术服务和联系方式。
- 两个真实静态内容页：`index.html`（主页）与 `publications/index.html`（论文），分别使用 `/` 和 `/publications/` 目录式地址。不使用前端框架、路由库、数据库、后台或站点编译打包，也不需要 `npm install`。论文的静态 HTML 由本地同步命令更新，并随源码提交。
- 运行时是原生 HTML、CSS、JavaScript；Node.js 20+ 用于本地预览、论文静态内容同步和离线检查。
- 当前远程仓库：`https://github.com/shenhu365/shenhu365.github.io.git`。新版界面已合并到 `main`；日常默认直接在 `main` 修改、检查和提交，推送 `main` 自动触发 GitHub Pages 部署。极简版保留在 `codex/minimal-backup`，作为历史备份，不参与日常修改或部署，不将新版合入、覆盖或删除该备份。`codex/ui-redesign` 已完成改版用途，不再作为维护依赖。实际操作前以 `git remote -v`、`git branch --show-current` 和 `git status` 为准；默认分支约定不代表每次修改都自动提交或推送。
- 发布地址：`https://shenhu365.github.io/`，论文页的地址约定为 `/publications/`。本地预览默认 `http://127.0.0.1:4173/`；本地地址调整需推送并通过 Pages 部署后才在线上生效。

## 已确定的界面与内容要求

1. 新版界面参考用户提供的 `shen-homepage-source.zip`：浅蓝灰页面背景、白色内容面板、蓝色操作入口、带轻渐变的个人资料卡，以及统一的无衬线字体。保留信息优先的两页学术主页，不移植参考包中的个人事实、论文数据或第二套运行时配置，不增加无关栏目、指标或语言切换。
2. 桌面左侧为照片、姓名、个人信息和联系入口，资料卡按内容自然高度完整展开，通过 CSS sticky 保持固定顶部位置，不随滚动主动上移，不设置独立滚动。右侧首页内容置于 `.home-panel` 白色面板，依次为英文简介、中文简介、独立 Publications 栏目、Academic Service、Contact；Contact 只显示邮箱。顶部为 SH 首页入口与分段式导航，以选中项的白底、蓝字和轻阴影标识当前位置。手机首页保留完整资料，论文页使用简短身份区；窄屏导航完整可用，正文无横向溢出。
3. 标题与导航使用英文，侧栏不重复附加“博士研究生”等中文标签。中文简介中的身份描述仍保留。
4. 英文、中文简介各一段。多模态学习与视觉感知的合作研究说明接在段末；此前独立的近期信号表征研究句已按用户要求删除，不自行恢复。
5. 首页不列具体论文，在双语简介与 Academic Service 之间设置独立 Publications 标题栏目，包含“I have published papers in IJCAI, AAAI, IJCV, …”和 View publications 链接。完整论文只在 Publications 页面，按年份倒序分组，顶部年份跳转轴从论文数据自动生成，使用原生锚点定位。论文列表和年份导航随 HTML 发布，禁用 JavaScript 时仍完整可用。
6. 论文显示标题、完整作者、发表渠道和资源入口。作者中的 Shen Hu 加粗，已配置主页的人物名称可点击。
7. 个人事实以用户确认的信息为准。论文信息使用用户提供或官方来源，不猜测作者、录用状态、指标、PDF 地址等。涉及来源取舍时查看并维护 [SOURCE_NOTES.md](SOURCE_NOTES.md)。

## 文件分工与唯一配置来源

| 文件 | 责任 |
| --- | --- |
| `people.js` | `window.SITE_PEOPLE`：导师、合作者等人物主页 URL 与姓名别名的唯一运行时配置 |
| `data.js` | `window.SITE_DATA`：站主个人资料与联系入口、双语简介、学术服务、论文条目 |
| `publication-renderer.js` | Node.js 与浏览器共用的确定性论文渲染器，输出年份导航和论文列表 |
| `app.js` | 个人资料与简介渲染、人物链接、调用论文渲染器、主导航及年份当前项、导航滚动收窄、站主结构化数据 |
| `index.html` | 首页结构和关键资料的静态回退内容 |
| `publications/index.html` | 论文页结构和已同步的静态年份/论文生成区；禁用 JavaScript 时保留完整列表 |
| `styles.css` | 共用布局、自托管字体和系统回退字体栈、颜色变量、吸顶导航、桌面侧栏定位、锚点留空、响应式与辅助显示偏好规则 |
| `assets/fonts/` | 当前 Manrope / Noto Sans SC 子集与保留的 Source 字体、来源说明及许可证 |
| `scripts/sync-publications.mjs` | `npm run sync`：调用共享渲染器，仅更新论文 HTML 的两处生成区 |
| `scripts/serve.mjs` | 仅监听本机的预览服务及允许访问的文件清单 |
| `scripts/check.mjs` | 只读离线检查：语法、配置、静态论文同步、本地引用、脚本顺序与资源 |
| `.github/workflows/pages.yml` | 检查、收集静态文件和发布 GitHub Pages |
| `README.md` | 简短项目入口、本地预览、常用命令与文档链接 |
| `MAINTENANCE.md` | 详细配置、内容更新、排版说明、检查、部署与排障指南 |
| `AGENTS.md` | 面向智能体的当前项目约定、架构与交接说明（本文件） |
| `SOURCE_NOTES.md` | 来源及内容取舍记录，不被网页读取，也不与配置自动同步 |

### 人物主页

- 每个人只在 `people.js` 配置一个 `url`，英文主姓名和 `aliases` 中的中文名、其他写法共用它。不要重新添加 `profile.advisorUrl`、`authorLinks` 或在页面中手工维护人物主页地址；论文 HTML 生成区中的链接由同步脚本产生，不是另一份配置。
- 简介和论文作者通过共用解析自动匹配姓名；匹配区分大小写。其他 HTML 内容使用 `<span data-person="姓名或别名">显示文字</span>`。这不是对整页所有普通文本的自动扫描。
- 新人物在 `people.js` 配置一次即可。没有配置或 `url` 为空时显示普通文本。姓名和别名不得为空、带首尾空白或彼此冲突；非空 URL 必须使用 HTTP/HTTPS。
- 两页按 `people.js` → `data.js` → `publication-renderer.js` → `app.js` 顺序加载，均使用 `defer`。新增内容页面也需加载这四个共用脚本。
- 两个配置文件保持独立定义；检查器分别在隔离环境中执行它们，不要让 `data.js` 依赖先读取 `people.js` 中的变量。
- 站主自己的邮箱、Scholar、GitHub 等联系入口仍由 `data.js` 的 `profile` 管理；论文的 Paper/PDF 地址仍由论文条目管理。资料卡入口顺序为 GitHub（若有）、Google Scholar、University profile、CV（若有）、邮箱；`app.js` 与两页静态回退应保持一致。

### 内容与静态回退

- 更新双语简介时同时更新 `data.js` 和 `index.html` 的对应静态段落，保留英中语义一致。
- 学术服务按年份倒序显示，同年条目保持配置顺序；`data.js` 的 `services` 和首页静态回退同步按该规则维护。`app.js` 使用 `[...data.services].sort((a, b) => b.year - a.year)` 排序副本后渲染，不修改配置源数组，当前只渲染 `role.en`。现有顺序为 ICLR 2027 Reviewer、IJCAI 2026 Program Committee Member；勿把 ICLR 的 Reviewer 自动改成 Program Chair。新增、删除或调整条目后核对动态与禁用 JavaScript 时的静态顺序一致。
- 首页 Publications 概述只在 `index.html` 的 `.publication-summary` 维护，使用“I have published papers in IJCAI, AAAI, IJCV, …”；保留“I have published papers in”前缀，后接会议、期刊缩写和省略号，不改成只有缩写的列表。列出的渠道依据现有论文，不由 `npm run sync` 生成。修改时核对 `data.js` 和 `SOURCE_NOTES.md`，不添加未经核实的数量、等级或状态；具体论文仍只在论文页展示。View publications 入口使用 `.research-link`，当前字号 17px。
- 姓名、单位、联系方式等变更还需检查两页的静态回退、页面标题、描述元数据和 `app.js` 中的结构化数据是否受影响。不要只改动态渲染后的一个位置。
- 英文单位继续由 `profile.affiliation.en` 唯一配置；`app.js` 按最后一个逗号拆分为研究院与学校两层，无逗号则整段显示。修改单位时同步两页 `[data-profile="affiliationEn"]` 的静态结构，不另建独立学校字段。
- 侧栏的 `Ph.D. student` 目前直接写在两页 HTML 中，`profile.role` 不参与显示；研究关键词的加粗规则和 JSON-LD 的 `knowsAbout` 写在 `app.js` 中，身份或研究方向改变时一起核对。
- 论文数据中的 `id` 保持唯一；作者顺序和姓名按正式来源填写；`year` 驱动分组与导航。没有可靠 PDF 时留空，不从 DOI 猜测下载地址。
- `data.js` 仍保留部分旧版字段（如 `education`、`research`、论文 `summary`、`image`、`code`），不代表目前页面展示这些内容。先确认 `app.js` 的实际引用，按任务范围处理，勿顺手恢复旧设计或批量删除资料。
- 保留用户当前头像和其他正在编辑的文件；来源笔记中的历史头像 URL 不应覆盖当前本地头像。

### 论文静态同步

- `data.js` 与 `people.js` 是唯一配置；`publication-renderer.js` 暴露 `window.SITE_PUBLICATIONS.render(data, people, base)`，同时供 `app.js` 和 Node.js 同步脚本调用。论文 HTML 结构、作者加粗、人物链接、年份分组及 Paper/PDF 输出统一在该渲染器维护，不在浏览器与脚本中复制两套逻辑。
- `npm run sync` 运行 `scripts/sync-publications.mjs`，在隔离环境中读取两个配置并执行共享渲染器，用 `../` 作为论文目录页的相对根路径。仅替换 `publications/index.html` 中 `publication-years:start/end`、`publication-list:start/end` 两对注释标记之间的内容；保留唯一、有序的标记，不手改生成区。
- 修改论文、人物主页或别名、站主 `profile.name` / `nameZh`，或共享渲染器后，先 `npm run sync`，再 `npm run check`，将配置和生成后的论文 HTML 一起提交。同步无依赖、不编译或打包站点；不要把生成 HTML 当作第二份内容来源。
- 检查器只读执行共享渲染器并比较静态生成区，过期时失败，不自动改文件；GitHub Actions 也只运行检查，不替维护者执行同步。禁用 JavaScript 时使用已提交的静态列表与锚点，启用时 `app.js` 调用同一渲染器刷新它们。

### 排版、吸顶导航与侧栏

- 保持原生静态实现，不为参考界面引入框架、图标库或构建流程。字体改用本地 Manrope 与 Noto Sans SC 子集，`@font-face` 分别声明正体字重 400–700 / 400–600，并使用 `font-display: swap`；这些范围沿用参考包 CSS，不代表已核实字体二进制轴。两页按目录深度预加载这两份 WOFF2。来源、文件大小、校验值和许可证见 [assets/fonts/README.md](assets/fonts/README.md)；原有 Source Serif 4 / Source Sans 3 文件及许可证保留，但当前 CSS 不加载它们。
- 中文姓名、简介和单位使用 Noto Sans SC 子集，保留苹方、微软雅黑等系统回退；新增中文后核对缺字、字体混排及换行。常规姓名为英文 34px、中文 20px，中文另起一行；首页栏目标题 22px、手机 21px，论文页标题 34px、手机 32px。英文简介 17px、行高 1.9，在不超过 880px 时为 16px；中文简介 15px、行高 1.95，间距 21px。论文标题 18px、行高 1.55；作者 13px、行高 1.85，其他响应式层级以 CSS 为准。
- 颜色集中在 `:root`：背景 `#f4f6fb`、面板 `#ffffff`、正文及标题 `#202a40`、辅助信息 `#606d84`、中文简介与首页发表概述普通文字 `--reading-text: #3f4b60`、链接 `#435fc7`、主要操作 `#4663ce`、分隔线 `#e0e5ef`、浅色强调 `#eaf0fb`。`--reading-text` 仅用于 `.bio-zh` 与 `.publication-summary`，两处 `strong` 继续使用 `--text: #202a40`；`prefers-contrast: more` 下阅读文字也使用 `#202a40`，不修改其他辅助信息的默认色。资料卡使用浅色渐变、圆角和轻阴影，首页 `.home-panel` 和论文 `.year-papers` 使用白底边框。交互采用 180ms 的颜色、背景、边框与阴影过渡，不改变字重或布局位置。
- 常规桌面容器最大宽度 1068px，侧栏 268px、间距 38px；`--sidebar-width` / `--column-gap` 在不超过 1099px 时为 256px / 32px，不超过 880px 时为 208px / 22px。主体顶部间距由 `--content-top: 22px` 控制。首页每个 `.content-section` 常规内边距为 30px 34px，以区块上边线分隔；窄屏逐级收紧，不再采用旧版等距栏目外边距或衬线标题。
- `.site-header` 使用 `position: fixed; inset: 0 0 auto`，固定在视口顶部，背景与页面一致；`body` 通过 `padding-top: var(--header-height)` 保留原展开高度的占位，打印时恢复为 0。宽度超过 880px 时，`.header-inner` 与正文共用 `var(--sidebar-width) minmax(0, 1fr)` 两列网格及 `--column-gap`，SH 首页入口在左列起点，分段导航在右侧正文列内居中。宽度不超过 880px 时使用横向 flex 将 SH 与导航分列；不超过 680px 时栏间距为 12px，导航使用 `flex: 1`。主导航当前项以白底蓝字呈现，不使用旧版选中下划线。导航字号 16px；宽度不超过 530px 时隐藏 SH 标记，导航铺满容器并保持四列，字号 14px。所有入口至少 44px 高。滚动位置超过 28px 后，可见导航区域从 96px 收至 60px；上滚保持收窄，仅返回顶部 1px 范围内才恢复。手机及高度不超过 700px 的桌面使用 80px → 56px。`.site-header` 通过 `--nav-padding` 控制导航组上下内边距，从桌面 5px / 手机 4px 收至 2px，组高度从 54px / 52px 收至 48px。按钮保持 44px 点击高度，选中及悬停背景、阴影移至 `a::before`；`--nav-item-inset` 从 0 变为 4px，将视觉卡片由 44px 收至 36px。高度、内边距及背景缩进均使用 180ms 过渡，横向宽度、按钮横向位置、字号与字重不变；body 占位保持展开高度，避免正文上跳。
- `app.js` 使用被动 `scroll` 监听与 `requestAnimationFrame` 更新 `.is-compact`：滚动位置超过 28px 时收窄，回到顶部 1px 内展开；大于 1px 且不超过 28px 时保留当前状态，上滚不自动展开。滚动位置夹在合法范围内过滤回弹，不再维护方向或累计距离。位置超过 1px 时添加 `.is-scrolled`，显示底部细线与轻阴影，返回 1px 内去掉。`resetHeader` 在初始化、`resize` / `pageshow` 时清除待执行帧，按当前位置是否超过 1px 同步紧凑状态，再同步边界，不强制展开。键盘聚焦本身不改变高度或内边距，不添加 `:has(:focus-visible)` 展开规则；44px 点击区域与可见焦点保留，减少动态偏好关闭过渡。侧栏没有滚动跟随脚本。
- 主导航按当前路径和 URL 锚点同步：`#service` / `#contact` 高亮对应栏目，首页无对应栏目锚点时高亮 Home，论文页（含年份锚点）高亮 Publications。初始化、`hashchange`、`pageshow` 时更新，不随手动滚动切换。仅当前项设置 `aria-current`，页面使用 `page`、栏目使用 `location`。年份入口仍是原生锚点，`updateYearNavigation` 只更新 `aria-current="location"`：有匹配年份锚点时高亮该年份，无锚点时高亮第一个年份，其他锚点不选中年份；不拦截链接、滚动或浏览器历史。
- `--anchor-offset` 始终为 `calc(var(--header-height) + 20px)`，常规桌面 116px、手机及短桌面 100px。`.profile` 的 `top` 使用展开高度加 `--content-top`，常规桌面固定 118px；高度不超过 700px 时顶部间距为 16px，固定偏移为 96px。上下滚动不主动改变偏移，也不加负偏移、`max-height` 或独立滚动。两页 `.site-footer` 位于布局内右侧第二行，资料卡跨越正文和页脚两行，仍受布局容器边界约束。
- 保留当前头像原文件和自然比例，常规桌面图框宽 122px、圆角 12px、内部留白 4px；不替换为参考包中的头像。宽度至少 681px 且高度不超过 800px 时采用 94px 头像并收紧资料间距；高度不超过 700px 时改为 54px 头像与姓名并排，仍保持浮动。极矮窗口不保证全部资料同时可见，不通过嵌套滚动处理。
- 宽度不超过 680px 时，资料卡使用普通文档流：首页为 84px 头像配姓名和身份，下方显示完整双语单位及联系入口；论文页通过 `.publications-page` 使用 54px 头像、可回首页的姓名与身份，隐藏完整单位和联系列表。更窄窗口的头像、卡片内边距与姓名字号以 CSS 为准。打印时取消卡片背景、阴影和浮动，隐藏顶部导航与年份栏，恢复论文页完整资料。
- 论文数据和共享渲染器不因 UI 重写。按年份将现有 `.year-papers` 样式化为分组卡片，年份标题带细线，同组条目以轻分隔线区分；标题、完整作者、venue 与 Paper/PDF 保持原有内容。宽度超过 880px 时资源入口位于条目右侧，较窄屏放到文字下方。所有 venue 缩写共用浅蓝底，作者链接平时使用浅下划线，悬停和键盘聚焦时增强；站主姓名继续加粗。
- 保留导航、年份入口、资料卡链接及 Paper/PDF 的 44px 最小点击高度、可见键盘焦点、Skip to content，以及减少动态和增强对比度规则。View publications、Scholar 和 Paper/PDF 虽使用按钮外观，文字与箭头仍处在同一内联文字流，仅保留普通空格，悬停或聚焦时下划线连续；不要用 flex gap、箭头外边距或 inline-block 箭头将其割断。分段导航使用背景反馈；资料卡入口保持透明背景，使用文字与图标颜色、文字下划线作为反馈。`.profile-links a` 使用 10px 圆角、左右 8px 内边距和 -8px 外边距，保持文字原有对齐；列表项上下各留 2px 间隔。资料链接本体保持 flex 布局及 44px 点击高度，左侧为 SVG 图标；`.profile-link-label` 只包裹文字并使用 `flex: 1; min-width: 0`，`.profile-link-arrow` 为 `a` 的直接子级，固定 14px 列宽、无前置空格，并设置 `aria-hidden="true"`，使各行右箭头对齐。两页静态回退与 `app.js` 使用相同结构。悬停及 `:focus-visible` 时文字、左图标和右箭头使用 `--link: #435fc7`；仅文字 label 设置 1px 细下划线及 3px 偏移，箭头无下划线，链接无背景底色。所有资料链接（含邮箱）都带右箭头；邮箱仍为 `mailto:`，不设置新窗口目标。宽度不超过 880px 及打印时统一隐藏资料箭头且不保留其列宽；键盘焦点外框保留。手机双列联系入口的列间距为 20px，避免负外边距导致点击区重叠。

## 工作与验证流程

1. 先读 `git branch --show-current`、`git status --short` 和相关 diff，识别当前分支及用户已有改动。日常默认在 `main` 工作；开始修改前，工作区干净时可用 `git switch main` 和 `git pull --ff-only origin main` 切换并同步。存在未提交改动时先保留并判断所属任务，不为切换或同步而自动丢弃、覆盖或暂存到 stash；已在 `main` 的相关改动可继续维护。常规维护不新建改版分支；需要隔离的实验或大改版可另用 `codex/` 分支，正式发布仍合入 `main`。限定编辑范围，不回退或覆盖无关修改。并行协作明确各自文件；负例测试使用内存或临时副本，不临时改写正在预览的真实配置文件。
2. 阅读实际代码与配置后实现需求。维护原生静态结构、相对路径和共用配置，避免为小改动引入依赖或构建工具。
3. 论文、人物配置、站主姓名或共享论文渲染器变更后，先运行 `npm run sync`，再运行 `npm run check` 和 `git diff --check`；其他改动直接检查。生成的 `publications/index.html` 属于本次交付。检查报错需解决；不要把未执行或失败的检查写成通过。
4. 页面、交互或渲染变更后，使用本地预览核对相关页面；按影响检查人物中英文别名、年份锚点、导航、Paper/PDF，以及手机首页完整资料和论文页简短身份区。论文相关变更还需检查禁用 JavaScript 时的完整列表与年份跳转。导航或排版变化核对浅蓝灰背景、白色面板、SH 入口和分段导航、下滚收窄、上滚保持及回到顶部恢复、侧栏顶部位置稳定及页尾边界；滚动时导航 top 始终为 0，body 的展开高度占位避免正文上跳，底部细线和阴影在滚动超过 1px 后出现；核对超过 28px 收窄、1px 内展开、中间区间保持状态，以及初始化、resize、pageshow 的同步。宽桌面导航在右侧正文列居中，收窄时横向位置不变；卡片视觉高度缩小后按钮点击高度仍不少于 44px，键盘聚焦保持当前高度并显示焦点。资料卡链接核对右侧箭头同列对齐、悬停无底色、文字及两侧图标同步变蓝、仅文字 label 有细下划线、可见键盘焦点及手机双列点击区不重叠；同时核对静态回退与动态标签一致，窄屏及打印隐藏箭头后不占列宽。短窗口紧凑资料仍保持浮动。字体变化核对两页 Manrope / Noto 字体资源与预加载路径、中文子集回退及长文本换行。同时核对锚点、键盘焦点、打印和相关系统辅助显示偏好。仅改文档时核对命令、路径和代码事实即可，无需重复截图。
5. **在本轮完成前同步维护下节列出的文档。文档同步是完成条件，不留待用户提醒或下一轮处理。**
6. 最后说明完成内容、验证结果、相关文档更新和是否已提交/推送。按用户已有授权执行提交、推送或发布；仅要求修改文件时不自动提交或推送，仅要求步骤时提供命令。发布前核对当前分支为 `main`，只暂存本次任务相关文件并检查暂存差异；推送 `main` 会更新线上站点，部署结果需在 Actions 确认。

离线检查会在 Node.js 中执行共享论文渲染器，比较静态生成区，并检查已写入 HTML 的年份锚点和引用；它不修改文件、不访问外部网址，也不启动浏览器。它可解析 HTML 内静态 JSON-LD，但不执行 `app.js` 生成动态 DOM/JSON-LD，也不做完整论文字段校验。通过检查不能证明外部链接可访问、浏览器内锚点交互与布局正确或 GitHub 部署成功。这些需按改动范围分别验证。

## 文档同步规则

- **每次新需求或修改后，主动检查 README、MAINTENANCE、AGENTS、SOURCE_NOTES 是否受影响，并在同一轮直接更新相关文件。**
- 用户改变设计取向、交互规则、配置约定、架构、工作流程或部署方式：更新本文件对应段落，覆盖过时说明，以当前约定为准。
- 改变配置字段、内容更新方式、排版规则、文件结构、检查方式或部署步骤：同步 MAINTENANCE 的详细说明和例子。README 只保留简短项目介绍、预览、常用命令与文档链接；这些入口信息变化时同步更新，不将详细手册重新堆回 README。
- 新增或修正学术事实、人物来源、论文状态，或存在来源冲突及取舍：更新 SOURCE_NOTES；只改样式通常无需改来源笔记。
- 普通数据更新若没有改变使用方式，不必把整份论文数据或配置复制进 README、MAINTENANCE 或 AGENTS。来源笔记保留可追溯依据，运行时配置仍是展示内容的依据。
- 文档应是可直接接手的当前说明，不堆叠聊天记录、失效待办、临时端口/PID或重复长篇变更日志。文档无需变化时，在交付说明中简述已检查、为何无需更新。
- 不依赖某个工具的私人记忆。支持自动读取 `AGENTS.md` 的工具可直接使用；其他工具需由用户在任务开头显式要求先读取此文件和 README，并按任务需要查阅 MAINTENANCE。不能承诺所有工具都会自动发现或遵守它。

## 本地预览和部署注意点

- `npm run dev` 启动 4173 端口预览，展示当前工作目录内容；端口不对应固定版本。默认预览和维护 `main` 的新版，极简版仅保存在 `codex/minimal-backup`，不复制第二套 HTML、不增加页面版本开关。只读比较可用 `git show codex/minimal-backup:styles.css` 等命令；若需切换到备份预览，先妥善保存当前改动并确认工作区干净，查看后返回 `main` 再继续修改，不在备份分支提交。网页文件改动后刷新；服务器脚本改动由 Node watch 重启。端口占用时确认已有进程属于本项目，不结束未知进程。
- 已运行的旧版非 watch 进程可能仍使用旧文件白名单；新增配置或页面出现 404 时，检查是否需要由原终端 Ctrl+C 后重新启动。
- 内容页面使用 `目录名/index.html`，站内导航链接到 `目录名/`；根首页使用 `/` 对应的相对路径。这依赖静态目录默认首页，不需要 GitHub 设置开关或后端 rewrite。共享 `app.js` 将显式的 `/index.html` 地址规范为所在目录，并保留查询参数和锚点。
- 兼容旧地址：根 `publications.html` 仅作为跳转页保留，JavaScript 跳转到 `publications/` 并保留查询参数和锚点，另有 meta 刷新和手动链接回退。不要把内容写回跳转页；检查器应将兼容页与真实内容页分别处理。
- 所有 HTML 本地引用按目录深度使用相对路径：根首页使用 `./`，`publications/index.html` 使用 `../` 引用根脚本、样式和 assets，兼容用户站点根路径与项目站点子目录。[MAINTENANCE.md](MAINTENANCE.md) 提供子目录预览命令。
- `data.js` 中的相对资源地址始终相对于站点根目录；`app.js` 从自身脚本 URL 定位站点根目录并解析这些地址，不能改成相对于当前页面解析。不要设置 `<base>` 标签，避免 `#year-年份` 等页内锚点跳到站点首页。
- 新增要发布的目录页或文件，检查并同步 HTML 引用、`scripts/serve.mjs` 的 `allowed` 和 Pages 工作流复制清单。检查器中，新内容页以 `目录名/index.html` 加入 `contentPages`，兼容跳转页加入 `redirectPages`；两者合并成 `pageFiles`，其首级目录自动进入 `staticFiles`，其他根目录资源需单独加入。页面目录保留结构复制；`publications/` 与 `assets/` 各自复制。
- `publication-renderer.js` 是浏览器运行时资源，已进入预览、离线检查和 Pages 复制白名单；`scripts/sync-publications.mjs` 仅用于本地维护，不发布。保持这一区分，不依赖线上运行同步脚本。
- 站点仅部署白名单中的页面、脚本、样式和 `assets/` 等静态资源。根 README、MAINTENANCE、AGENTS、SOURCE_NOTES 和开发脚本不进入站点产物；`assets/fonts/` 中的字体来源与许可证随字体发布。若 GitHub 仓库公开，仓库内的说明文件仍可被读到。
- 日常发布流程为在 `main` 修改 → 按影响同步与检查 → 提交相关文件 → `git push origin main`。`.github/workflows/pages.yml` 的 push 触发仅包含 `main`，会自动运行 `Deploy academic homepage`，无需重复 Run workflow；Pages Source 应为 GitHub Actions。向备份或其他开发分支推送不会自动部署，不从备份分支手动运行发布工作流。push 成功不等于部署成功，发布后查看对应提交的 Actions 结果；具体操作步骤见 [MAINTENANCE.md](MAINTENANCE.md)。
- 不使用强制推送或通过删除历史来解决同步问题。推送失败时先查看错误、远端状态与用户未提交内容，再选择保留改动的处理方式。
