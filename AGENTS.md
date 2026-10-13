# 项目档案与智能体维护约定

本文件适用于整个仓库，供接手项目的 AI 编程工具与维护者阅读。开始工作前先读本文件和 [README.md](README.md)，再查看相关代码。用户在当前任务中明确提出的新需求优先；需求改变后，在完成实现的同一轮更新相关文档。

## 项目目标和现状

- Shen Hu（胡深）的个人学术主页，重点是让访客快速找到个人介绍、论文、学术服务和联系方式。
- 两个真实静态内容页：`index.html`（主页）与 `publications/index.html`（论文），分别使用 `/` 和 `/publications/` 目录式地址。不使用前端框架、路由库、数据库、后台或站点编译打包，也不需要 `npm install`。论文的静态 HTML 由本地同步命令更新，并随源码提交。
- 运行时是原生 HTML、CSS、JavaScript；Node.js 20+ 用于本地预览、论文静态内容同步和离线检查。
- 当前远程仓库：`https://github.com/shenhu365/shenhu365.github.io.git`，部署分支 `main`。实际操作前以 `git remote -v`、`git branch --show-current` 为准。
- 发布地址：`https://shenhu365.github.io/`，论文页的地址约定为 `/publications/`。本地预览默认 `http://127.0.0.1:4173/`；本地地址调整需推送并通过 Pages 部署后才在线上生效。

## 已确定的界面与内容要求

1. 保持简洁、信息优先的学术主页，使用纯白背景、墨蓝色衬线姓名与栏目标题、无衬线正文、留白与少量细分隔线体现学术排版。除非用户新需求明确要求，不增加装饰大图、复杂卡片、大幅动画、指标面板或语言切换。
2. 桌面左侧为照片、姓名、个人信息和联系入口，侧栏按内容自然高度完整展开，并固定在初始顶部位置持续悬浮；上下滚动不主动移动侧栏，不设置独立滚动。右侧依次为英文简介、中文简介、独立 Publications 栏目、Academic Service、Contact；Contact 只显示邮箱，不重复单位。顶部导航白色背景铺满视口并紧贴顶部，桌面导航组左边缘与右侧正文左边缘对齐，以唯一的细下划线标识当前页面或当前栏目。手机保持四列导航、吸顶和正常文档布局，首页展示完整资料，论文页使用简短身份区，正文可读且无横向溢出。
3. 标题与导航使用英文，侧栏不重复附加“博士研究生”等中文标签。中文简介中的身份描述仍保留。
4. 英文、中文简介各一段。多模态学习与视觉感知的合作研究说明接在段末；此前独立的近期信号表征研究句已按用户要求删除，不自行恢复。
5. 首页不列具体论文，在双语简介与 Academic Service 之间设置独立 Publications 标题栏目，包含“I have published papers in IJCAI, AAAI, IJCV, …”和 View publications 链接。完整论文只在 Publications 页面，按年份倒序分组，顶部年份跳转轴从论文数据自动生成，使用原生锚点定位。论文列表和年份导航随 HTML 发布，禁用 JavaScript 时仍完整可用。
6. 论文显示标题、完整作者、会议或期刊，以及 Paper 和已提供的 PDF 链接。暂不展示 Code，不提供 BibTeX 导出。作者中的 Shen Hu 加粗，已配置主页的人物名称可点击。
7. 个人事实以用户确认的信息为准。论文信息使用用户提供或官方来源，不猜测作者、录用状态、指标、PDF 地址等。涉及来源取舍时查看并维护 [SOURCE_NOTES.md](SOURCE_NOTES.md)。

## 文件分工与唯一配置来源

| 文件 | 责任 |
| --- | --- |
| `people.js` | `window.SITE_PEOPLE`：导师、合作者等人物主页 URL 与姓名别名的唯一运行时配置 |
| `data.js` | `window.SITE_DATA`：站主个人资料与联系入口、双语简介、学术服务、论文条目 |
| `publication-renderer.js` | Node.js 与浏览器共用的确定性论文渲染器，输出年份导航和论文列表 |
| `app.js` | 个人资料与简介渲染、人物链接、调用论文渲染器、主导航当前项与滚动收窄、站主结构化数据 |
| `index.html` | 首页结构和关键资料的静态回退内容 |
| `publications/index.html` | 论文页结构和已同步的静态年份/论文生成区；禁用 JavaScript 时保留完整列表 |
| `styles.css` | 共用布局、自托管字体和系统回退字体栈、颜色变量、吸顶导航、桌面侧栏定位、锚点留空、响应式与辅助显示偏好规则 |
| `assets/fonts/` | Source Serif 4 / Source Sans 3 的 WOFF2 文件、来源说明与许可证 |
| `scripts/sync-publications.mjs` | `npm run sync`：调用共享渲染器，仅更新论文 HTML 的两处生成区 |
| `scripts/serve.mjs` | 仅监听本机的预览服务及允许访问的文件清单 |
| `scripts/check.mjs` | 只读离线检查：语法、配置、静态论文同步、本地引用、脚本顺序与资源 |
| `.github/workflows/pages.yml` | 检查、收集静态文件和发布 GitHub Pages |
| `README.md` | 面向使用者的配置、预览、检查、部署和排障指南 |
| `AGENTS.md` | 面向智能体的当前项目约定、架构与交接说明（本文件） |
| `SOURCE_NOTES.md` | 来源及内容取舍记录，不被网页读取，也不与配置自动同步 |

### 人物主页

- 每个人只在 `people.js` 配置一个 `url`，英文主姓名和 `aliases` 中的中文名、其他写法共用它。不要重新添加 `profile.advisorUrl`、`authorLinks` 或在页面中手工维护人物主页地址；论文 HTML 生成区中的链接由同步脚本产生，不是另一份配置。
- 简介和论文作者通过共用解析自动匹配姓名；匹配区分大小写。其他 HTML 内容使用 `<span data-person="姓名或别名">显示文字</span>`。这不是对整页所有普通文本的自动扫描。
- 新人物在 `people.js` 配置一次即可。没有配置或 `url` 为空时显示普通文本。姓名和别名不得为空、带首尾空白或彼此冲突；非空 URL 必须使用 HTTP/HTTPS。
- 两页按 `people.js` → `data.js` → `publication-renderer.js` → `app.js` 顺序加载，均使用 `defer`。新增内容页面也需加载这四个共用脚本。
- 两个配置文件保持独立定义；检查器分别在隔离环境中执行它们，不要让 `data.js` 依赖先读取 `people.js` 中的变量。
- 站主自己的邮箱、Scholar、GitHub 等联系入口仍由 `data.js` 的 `profile` 管理；论文的 Paper/PDF 地址仍由论文条目管理。

### 内容与静态回退

- 更新双语简介时同时更新 `data.js` 和 `index.html` 的对应静态段落，保留英中语义一致。
- 学术服务改动同时更新 `data.js` 和首页静态回退；当前只渲染 `role.en`。已有条目的英文职务为 IJCAI 2026 Program Committee Member、ICLR 2027 Reviewer，勿把 ICLR 的 Reviewer 自动改成 Program Chair。
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

- 保持原生静态实现，不为美化引入框架或图标库。英文姓名和栏目标题使用本地自托管 Source Serif 4；英文简介、首页 Publications 概述、论文题目、导航及元信息使用 Source Sans 3。`styles.css` 通过 `@font-face` 加载 `assets/fonts/` 中的 WOFF2，并设置 `font-display: swap`；两页按目录深度使用相对路径预加载，不依赖第三方字体 CDN。两款字体均采用 SIL Open Font License 1.1。替换字体时同步 CSS、预加载和 [assets/fonts/README.md](assets/fonts/README.md) 中的固定来源、版本与校验值，保留该目录中的原始许可证。
- 中文简介与中文单位使用系统无衬线字体栈（优先苹方，回退思源黑体等），中文姓名仍使用系统宋体字体栈；跨系统实际字体可能不同。常规桌面姓名为英文 36px、中文 24px；主要栏目标题为 28px、手机 26px，Academic Service / Contact 标题为 23px、手机 22px。英文简介及 Publications 概述为 18px、手机 17px，行高 1.75；中文简介为 16px、行高 1.8，与英文间距 20px。论文标题为 20px、手机 19px，行高 1.45；作者为 15px、手机 14px。姓名与大标题可用轻微负字距，正文和中文不加额外字距；其他响应式层级以 `styles.css` 为准，调整时核对长文本换行及字体加载失败时的回退。
- 颜色集中在 `:root`：背景保持 `#ffffff`，姓名和标题为墨蓝 `#203746`，正文 `#30343b`，辅助信息 `#636b73`，链接 `#356579`，分隔线 `#e2e7e9`，浅强调底色 `#edf2f2`。论文 venue 缩写统一使用小面积浅底，不按会议或期刊分别染色；完整 venue 信息保留。作者链接常驻下划线减弱，悬停与键盘聚焦时增强。交互颜色、背景与下划线使用 160ms 过渡，不改变字重或尺寸。
- 桌面容器最大宽度 1000px，常规侧栏 230px、间距 70px，主栏最多 700px；侧栏宽度和栏间距由 `--sidebar-width` / `--column-gap` 共用，宽度不超过 900px 时改为 210px / 38px。主体顶部间距由 `--content-top: 44px` 控制；首页主要区块间距 44px、手机 36px，Academic Service 顶部间距 / 内边距为 36px / 28px、手机 32px / 24px，并只在其上方保留分隔线，Contact 顶部间距 28px，不重复添加标题横线。论文页标题与 Scholar 入口同排，空间不足时自然换行；年份导航位于下方，同年论文间距 34px、手机 30px，仅在不同年份间加细线。保留当前头像原文件与 147:206 的自然比例，常规桌面宽度 144px、圆角 5px、与姓名间距 22px，不拉伸或裁切成另一比例。
- `.site-header` 使用 CSS `sticky; top: 0`，纯白背景铺满视口宽度，不留顶部或两侧间隙；文字导航使用正文的 `.page-width` 容器，通过 `--sidebar-width` 与 `--column-gap` 的总和设置桌面左侧内边距，使首个入口与右侧正文左边缘对齐。导航字号 16px，桌面入口不额外添加水平内边距，手机恢复原有四列网格。向下滚动时白底导航区域轻微收窄，向上或返回顶部时恢复；桌面高度为 68px → 52px，手机为 60px → 50px，过渡为 180ms。header 文档占位始终保持展开高度，只改变白底伪元素与 nav 高度；文字字号与 44px 点击高度不变，导航项随可见导航区保持垂直居中，不改变正文和侧栏的文档占位及顶部偏移。
- `app.js` 使用被动 `scroll` 监听与 `requestAnimationFrame` 更新 `.is-compact`：下滚累计 16px 且滚动位置超过 28px 时收窄，上滚累计 8px 或回到顶部 12px 内时展开；方向翻转重置累计，滚动位置夹在合法范围内过滤回弹。`resize` / `pageshow` 清除待执行帧和滚动参考，并恢复展开。CSS `:has(:focus-visible)` 在键盘聚焦导航时保持展开，鼠标焦点不锁定状态；减少动态偏好关闭高度过渡。侧栏仍仅使用 CSS 定位，无滚动跟随脚本。
- 主导航下划线由 `app.js` 按当前路径和 URL 锚点同步：`#service` / `#contact` 高亮对应栏目，首页无对应栏目锚点时高亮 Home，论文页（包括年份锚点）高亮 Publications。初始化、`hashchange` 和 `pageshow` 时更新，支持跨页跳转、直达链接、刷新及浏览器前进后退；不按手动滚动位置切换。仅当前项设置 `aria-current`，页面使用 `page`、栏目使用 `location`；CSS 同时支持这两种值。悬停只改变文字颜色，避免同时出现两条下划线；HTML 保留默认页面的静态状态，原生链接与历史行为不变。
- `styles.css` 的 `--header-height` 为展开高度及文档占位（桌面 68px、手机 60px），`--header-compact-height` 为收窄高度（桌面 52px、手机 50px）；`--anchor-offset` 始终以 `calc(var(--header-height) + 24px)` 控制锚点安全留空（分别为 92px、84px）。导航尺寸变化时一起核对这些变量；年份跳转继续使用原生锚点，不引入另一层固定年份栏。
- 桌面 `.profile` 持续使用原生 `sticky`，`top` 固定为 `--profile-top: calc(var(--header-height) + var(--content-top))`，当前为 112px。侧栏保持初始顶部位置，不添加滚动跟随位移或相关 JavaScript。始终按内容自然高度完整展开，不设置 `max-height`、独立滚动或缓动动画，也不根据窗口高度切换为普通文档流。
- 两页的 `.site-footer` 都在 `.page-layout` 内，位于右侧第二行；左侧 `.profile` 使用 `grid-row: 1 / span 2` 跨越正文和页脚两行，让浮动容器延伸至文档底部，避免独立页脚提前将资料栏向上推。桌面宽度至少 681px 且高度不超过 720px 时缩小头像并收紧间距；高度不超过 600px 时进一步使用小头像与姓名并排，仍保持浮动。仍受布局容器边界约束，不保证极矮窗口能同时显示全部资料。
- 宽度不超过 680px 时，侧栏使用 `static`：首页为 80px 头像配姓名和身份，下方保留双语单位与横向可换行的联系入口；论文页通过 `.publications-page` 只显示 48px 头像、可返回首页的姓名及身份，隐藏完整单位和联系列表。桌面仍显示完整资料。打印时采用普通文档流，恢复论文页单位与联系列表。
- 保留导航、年份入口以及手机 Paper/PDF 的 44px 最小点击高度、键盘可见焦点和 Skip to content，以及减少动态、增强对比度的媒体查询。
- View publications、Scholar 和 Paper/PDF 的文字与箭头使用同一内联文字流，保留普通文本空格；不要用 flex gap、箭头外边距或 inline-block 箭头割断下划线。链接本体使用 inline-block 与 44px 行高/最小高度，箭头使用 inline，悬停和键盘聚焦时显示连续下划线。

## 工作与验证流程

1. 先读 `git status --short` 和相关 diff，识别用户已有改动。限定编辑范围，不回退或覆盖无关修改。并行协作明确各自文件；负例测试使用内存或临时副本，不临时改写正在预览的真实配置文件。
2. 阅读实际代码与配置后实现需求。维护原生静态结构、相对路径和共用配置，避免为小改动引入依赖或构建工具。
3. 论文、人物配置、站主姓名或共享论文渲染器变更后，先运行 `npm run sync`，再运行 `npm run check` 和 `git diff --check`；其他改动直接检查。生成的 `publications/index.html` 属于本次交付。检查报错需解决；不要把未执行或失败的检查写成通过。
4. 页面、交互或渲染变更后，使用本地预览核对相关页面；按影响检查人物中英文别名、年份锚点、导航、Paper/PDF，以及手机首页完整资料和论文页简短身份区。论文相关变更还需检查禁用 JavaScript 时的完整列表与年份跳转。导航或排版变化核对纯白背景、导航贴顶且桌面左边缘对齐正文、双向收窄恢复、侧栏顶部位置稳定及页尾边界；短窗口紧凑资料仍保持浮动。字体变化核对两页资源与预加载路径、衬线标题和无衬线正文的实际渲染及长文本换行。同时核对锚点、键盘焦点、打印和相关系统辅助显示偏好。仅改文档时核对命令、路径和代码事实即可，无需重复截图。
5. **在本轮完成前同步维护下节列出的文档。文档同步是完成条件，不留待用户提醒或下一轮处理。**
6. 最后说明完成内容、验证结果、相关文档更新和是否已提交/推送。用户仅要求推送步骤时提供命令，不代为提交或推送；明确授权发布后再执行。

离线检查会在 Node.js 中执行共享论文渲染器，比较静态生成区，并检查已写入 HTML 的年份锚点和引用；它不修改文件、不访问外部网址，也不启动浏览器。它可解析 HTML 内静态 JSON-LD，但不执行 `app.js` 生成动态 DOM/JSON-LD，也不做完整论文字段校验。通过检查不能证明外部链接可访问、浏览器内锚点交互与布局正确或 GitHub 部署成功。这些需按改动范围分别验证。

## 文档同步规则

- **每次新需求或修改后，主动检查 README、AGENTS、SOURCE_NOTES 是否受影响，并在同一轮直接更新相关文件。**
- 用户改变设计取向、交互规则、配置约定、架构、工作流程或部署方式：更新本文件对应段落，覆盖过时说明，以当前约定为准。
- 改变维护入口、字段、命令、文件结构、检查方式或部署步骤：同步 README 的相关说明和例子。
- 新增或修正学术事实、人物来源、论文状态，或存在来源冲突及取舍：更新 SOURCE_NOTES；只改样式通常无需改来源笔记。
- 普通数据更新若没有改变使用方式，不必把整份论文数据或配置复制进 README/AGENTS。来源笔记保留可追溯依据，运行时配置仍是展示内容的依据。
- 文档应是可直接接手的当前说明，不堆叠聊天记录、失效待办、临时端口/PID或重复长篇变更日志。文档无需变化时，在交付说明中简述已检查、为何无需更新。
- 不依赖某个工具的私人记忆。支持自动读取 `AGENTS.md` 的工具可直接使用；其他工具需由用户在任务开头显式要求先读取此文件和 README。不能承诺所有工具都会自动发现或遵守它。

## 本地预览和部署注意点

- `npm run dev` 启动 4173 端口预览。网页文件改动后刷新；服务器脚本改动由 Node watch 重启。端口占用时确认已有进程属于本项目，不结束未知进程。
- 已运行的旧版非 watch 进程可能仍使用旧文件白名单；新增配置或页面出现 404 时，检查是否需要由原终端 Ctrl+C 后重新启动。
- 内容页面使用 `目录名/index.html`，站内导航链接到 `目录名/`；根首页使用 `/` 对应的相对路径。这依赖静态目录默认首页，不需要 GitHub 设置开关或后端 rewrite。共享 `app.js` 将显式的 `/index.html` 地址规范为所在目录，并保留查询参数和锚点。
- 兼容旧地址：根 `publications.html` 仅作为跳转页保留，JavaScript 跳转到 `publications/` 并保留查询参数和锚点，另有 meta 刷新和手动链接回退。不要把内容写回跳转页；检查器应将兼容页与真实内容页分别处理。
- 所有 HTML 本地引用按目录深度使用相对路径：根首页使用 `./`，`publications/index.html` 使用 `../` 引用根脚本、样式和 assets，兼容用户站点根路径与项目站点子目录。README 提供子目录预览命令。
- `data.js` 中的相对资源地址始终相对于站点根目录；`app.js` 从自身脚本 URL 定位站点根目录并解析这些地址，不能改成相对于当前页面解析。不要设置 `<base>` 标签，避免 `#year-年份` 等页内锚点跳到站点首页。
- 新增要发布的目录页或文件，检查并同步 HTML 引用、`scripts/serve.mjs` 的 `allowed` 和 Pages 工作流复制清单。检查器中，新内容页以 `目录名/index.html` 加入 `contentPages`，兼容跳转页加入 `redirectPages`；两者合并成 `pageFiles`，其首级目录自动进入 `staticFiles`，其他根目录资源需单独加入。页面目录保留结构复制；`publications/` 与 `assets/` 各自复制。
- `publication-renderer.js` 是浏览器运行时资源，已进入预览、离线检查和 Pages 复制白名单；`scripts/sync-publications.mjs` 仅用于本地维护，不发布。保持这一区分，不依赖线上运行同步脚本。
- 站点仅部署白名单中的页面、脚本、样式和 `assets/` 等静态资源。根 README、AGENTS、SOURCE_NOTES 和开发脚本不进入站点产物；`assets/fonts/` 中的字体来源与许可证随字体发布。若 GitHub 仓库公开，仓库内的说明文件仍可被读到。
- 向 `main` 推送会自动触发 `Deploy academic homepage`，无需再手动 Run workflow。仓库 Pages 的 Source 应为 GitHub Actions；本地检查通过与 push 成功均不代表部署已经成功，需要查看 Actions 结果。
- 不使用强制推送或通过删除历史来解决同步问题。推送失败时先查看错误、远端状态与用户未提交内容，再选择保留改动的处理方式。
