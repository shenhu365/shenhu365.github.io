# 项目档案与智能体维护约定

本文件适用于整个仓库，供接手项目的 AI 编程工具与维护者阅读。开始工作前先读本文件和 [README.md](README.md)，按任务需要查阅 [MAINTENANCE.md](MAINTENANCE.md) 的详细配置、维护与部署说明，再查看相关代码。用户在当前任务中明确提出的新需求优先；需求改变后，在完成实现的同一轮更新相关文档。

## 项目目标和现状

- Shen Hu（胡深）的个人学术主页，重点是让访客快速找到个人介绍、论文、奖项、学术服务和联系方式。
- 三个真实静态内容页：`index.html`（主页）、`publications/index.html`（论文）与 `awards/index.html`（获奖），分别使用 `/`、`/publications/` 和 `/awards/` 目录式地址。不使用前端框架、路由库、数据库、后台或站点编译打包，也不需要 `npm install`。论文的静态 HTML 由本地同步命令更新，奖项静态回退手工与配置同步，均随源码提交。
- 运行时是原生 HTML、CSS、JavaScript；Node.js 20+ 用于本地预览、论文静态内容同步和离线检查。
- 当前远程仓库：`https://github.com/shenhu365/shenhu365.github.io.git`。正式站仍由 `main` 发布；本分支 `codex/white-ui-redesign` 保存白底 UI 的本地提交，当前按用户要求仅保存版本，未推送远端、未合入 `main` 或发布。后续继续在此分支维护，推送远端或上线需用户另行授权。此前蓝灰版保存在本地 `codex/blue-ui-backup`（`16ac7c9`），极简版继续保存在 `codex/minimal-backup`；两份备份只供查阅或用户明确要求时恢复，不覆盖、合入新版或删除。继续白底改版时留在 `codex/white-ui-redesign`；用户确认采用后才合入 `main` 并按授权发布，之后日常默认在 `main` 维护。原 `codex/ui-redesign` 不再作为维护依赖。实际操作前以 `git remote -v`、`git branch --show-current` 和 `git status` 为准；分支约定不代表自动提交、推送或部署。
- 发布地址：`https://shenhu365.github.io/`，论文页与获奖页的地址约定为 `/publications/`、`/awards/`。本地预览默认 `http://127.0.0.1:4173/`；本地地址调整需推送并通过 Pages 部署后才在线上生效。

## 已确定的界面与内容要求

1. 当前白底方案采用学术刊物式排版：纯白背景、墨色标题、蓝色文字入口，使用字体层次、留白和细线组织内容。英文姓名、页面及栏目标题、年份和 SH 标记使用 Source Serif 4；正文和导航使用 Manrope，中文使用 Noto Sans SC 子集。资料区以右侧竖线分隔，三页主标题上方及资料区单位下方均不设横线，不使用蓝灰版的大块渐变卡片、面板阴影或分段按钮背景。保留信息优先的三页学术主页，不增加无关栏目、指标或语言切换，不替换现有个人事实或论文数据。
2. 桌面左侧为照片、姓名、个人信息和联系入口，资料区按自然高度完整展开，通过 CSS sticky 保持固定顶部位置，不随滚动主动上移，不设置独立滚动。右侧首页 `.home-panel` 依次为英文简介、中文简介、独立 Publications 栏目、Academic Service、Contact；Contact 只显示邮箱。顶部为 SH 首页入口与文字导航，顺序为 Home、Publications、Awards、Service，以蓝字和细下划线标识当前项，不设置 Contact 导航按钮。手机首页保留完整资料，论文页与获奖页使用简短身份区；窄屏导航完整可用，正文无横向溢出。
3. 标题与导航使用英文，侧栏不重复附加“博士研究生”等中文标签。中文简介中的身份描述仍保留。
4. 英文、中文简介各一段。多模态学习与视觉感知的合作研究说明接在段末；此前独立的近期信号表征研究句已按用户要求删除，不自行恢复。
5. 首页不列具体论文，在双语简介与 Academic Service 之间设置独立 Publications 标题栏目，包含“I have published papers in IJCAI, AAAI, IJCV, …”和 View publications 链接。完整论文只在 Publications 页面，按年份倒序分组，顶部年份跳转轴从论文数据自动生成，使用原生锚点定位。论文列表和年份导航随 HTML 发布，禁用 JavaScript 时仍完整可用。
6. 论文显示标题、完整作者、发表渠道和资源入口。作者中的 Shen Hu 加粗，已配置主页的人物名称可点击。
7. Awards 页面展示竞赛或机构、奖项或表彰及可选补充说明，按配置顺序显示，当前不配置或显示年份。中英文内容和官方入口由 `data.js` 管理，静态回退与动态显示保持一致。
8. 个人事实以用户确认的信息为准。论文与奖项信息使用用户提供或官方来源，不猜测作者、录用状态、指标、PDF 地址等。涉及来源取舍时查看并维护 [SOURCE_NOTES.md](SOURCE_NOTES.md)。

## 文件分工与唯一配置来源

| 文件 | 责任 |
| --- | --- |
| `people.js` | `window.SITE_PEOPLE`：导师、合作者等人物主页 URL 与姓名别名的唯一运行时配置 |
| `data.js` | `window.SITE_DATA`：站主个人资料与联系入口、双语简介、学术服务、奖项、论文条目 |
| `publication-renderer.js` | Node.js 与浏览器共用的确定性论文渲染器，输出年份导航和论文列表 |
| `app.js` | 个人资料、简介与奖项渲染、人物链接、调用论文渲染器、主导航及年份当前项、导航滚动收窄、站主结构化数据 |
| `index.html` | 首页结构和关键资料的静态回退内容 |
| `publications/index.html` | 论文页结构和已同步的静态年份/论文生成区；禁用 JavaScript 时保留完整列表 |
| `awards/index.html` | 获奖页结构、手工与配置同步的完整静态奖项列表、个人资料与页面元数据 |
| `styles.css` | 共用布局、自托管字体和系统回退字体栈、颜色变量、吸顶导航、桌面侧栏定位、锚点留空、响应式与辅助显示偏好规则 |
| `assets/fonts/` | 当前 Source Serif 4、Manrope、Noto Sans SC 子集，保留的 Source Sans 3，以及来源说明和许可证 |
| `scripts/sync-publications.mjs` | `npm run sync`：调用共享渲染器，仅更新论文 HTML 的两处生成区 |
| `scripts/serve.mjs` | 仅监听本机的预览服务及允许访问的文件清单 |
| `scripts/check.mjs` | 只读离线检查：语法、配置（含奖项数组）、静态论文同步、本地引用、脚本顺序与资源 |
| `.github/workflows/pages.yml` | 检查、收集静态文件和发布 GitHub Pages |
| `README.md` | 简短项目入口、本地预览、常用命令与文档链接 |
| `MAINTENANCE.md` | 详细配置、内容更新、排版说明、检查、部署与排障指南 |
| `AGENTS.md` | 面向智能体的当前项目约定、架构与交接说明（本文件） |
| `SOURCE_NOTES.md` | 来源及内容取舍记录，不被网页读取，也不与配置自动同步 |

### 人物主页

- 每个人只在 `people.js` 配置一个 `url`，英文主姓名和 `aliases` 中的中文名、其他写法共用它。不要重新添加 `profile.advisorUrl`、`authorLinks` 或在页面中手工维护人物主页地址；论文 HTML 生成区中的链接由同步脚本产生，不是另一份配置。
- 简介和论文作者通过共用解析自动匹配姓名；匹配区分大小写。其他 HTML 内容使用 `<span data-person="姓名或别名">显示文字</span>`。这不是对整页所有普通文本的自动扫描。
- 新人物在 `people.js` 配置一次即可。没有配置或 `url` 为空时显示普通文本。姓名和别名不得为空、带首尾空白或彼此冲突；非空 URL 必须使用 HTTP/HTTPS。
- 所有内容页按 `people.js` → `data.js` → `publication-renderer.js` → `app.js` 顺序加载，均使用 `defer`。新增内容页面也需加载这四个共用脚本。
- 两个配置文件保持独立定义；检查器分别在隔离环境中执行它们，不要让 `data.js` 依赖先读取 `people.js` 中的变量。
- 站主自己的邮箱、Scholar、GitHub 等联系入口仍由 `data.js` 的 `profile` 管理；论文的 Paper/PDF 地址仍由论文条目管理。资料卡入口顺序为 Google Scholar、GitHub（若有）、University profile、CV（若有）、邮箱；`app.js` 与所有内容页静态回退应保持一致。

### 内容与静态回退

- 更新双语简介时同时更新 `data.js` 和 `index.html` 的对应静态段落，保留英中语义一致。
- 学术服务按年份倒序显示，同年条目保持配置顺序；`data.js` 的 `services` 和首页静态回退同步按该规则维护。`app.js` 使用 `[...data.services].sort((a, b) => b.year - a.year)` 排序副本后渲染，不修改配置源数组，当前只渲染 `role.en`。现有顺序为 ICLR 2027 Reviewer、IJCAI 2026 Program Committee Member；勿把 ICLR 的 Reviewer 自动改成 Program Chair。新增、删除或调整条目后核对动态与禁用 JavaScript 时的静态顺序一致。
- 奖项在 `data.js` 的 `awards` 数组维护：`title: { en, zh }` 为竞赛或机构名，`honor: { en, zh }` 为奖项或表彰，`detail: { en, zh }` 为补充说明（无内容时两种文本留空），`url` 为官方链接。不添加 `year`，不自动排序，沿用配置顺序；当前依次为华为杯研究生数学建模、全国大学生数学建模、CCF 表彰。`app.js` 渲染 `[data-awards]`；每次改动同时手工更新 `awards/index.html` 的完整静态列表，包括双语文本、顺序和链接。`npm run sync` 仍只同步论文，不处理奖项，检查器也不自动更新奖项静态回退。
- 首页 Publications 概述只在 `index.html` 的 `.publication-summary` 维护，使用“I have published papers in IJCAI, AAAI, IJCV, …”；保留“I have published papers in”前缀，后接会议、期刊缩写和省略号，不改成只有缩写的列表。列出的渠道依据现有论文，不由 `npm run sync` 生成。修改时核对 `data.js` 和 `SOURCE_NOTES.md`，不添加未经核实的数量、等级或状态；具体论文仍只在论文页展示。View publications 入口使用 `.research-link`，当前字号 17px。
- 姓名、单位、联系方式等变更还需检查所有内容页的静态回退、页面标题、描述元数据和 `app.js` 中的结构化数据是否受影响。不要只改动态渲染后的一个位置。
- 英文单位继续由 `profile.affiliation.en` 唯一配置；`app.js` 按最后一个逗号拆分为研究院与学校两层，无逗号则整段显示。修改单位时同步所有内容页 `[data-profile="affiliationEn"]` 的静态结构，不另建独立学校字段。
- 侧栏的 `Ph.D. student` 目前直接写在所有内容页 HTML 中，`profile.role` 不参与显示；研究关键词的加粗规则和 JSON-LD 的 `knowsAbout` 写在 `app.js` 中，身份或研究方向改变时一起核对。
- 论文数据中的 `id` 保持唯一；作者顺序和姓名按正式来源填写；`year` 驱动分组与导航。没有可靠 PDF 时留空，不从 DOI 猜测下载地址。
- `data.js` 仍保留部分旧版字段（如 `education`、`research`、论文 `summary`、`image`、`code`），不代表目前页面展示这些内容。先确认 `app.js` 的实际引用，按任务范围处理，勿顺手恢复旧设计或批量删除资料。
- 保留用户当前头像和其他正在编辑的文件；来源笔记中的历史头像 URL 不应覆盖当前本地头像。

### 论文静态同步

- `data.js` 与 `people.js` 是唯一配置；`publication-renderer.js` 暴露 `window.SITE_PUBLICATIONS.render(data, people, base)`，同时供 `app.js` 和 Node.js 同步脚本调用。论文 HTML 结构、作者加粗、人物链接、年份分组及 Paper/PDF 输出统一在该渲染器维护，不在浏览器与脚本中复制两套逻辑。
- `npm run sync` 运行 `scripts/sync-publications.mjs`，在隔离环境中读取两个配置并执行共享渲染器，用 `../` 作为论文目录页的相对根路径。仅替换 `publications/index.html` 中 `publication-years:start/end`、`publication-list:start/end` 两对注释标记之间的内容；保留唯一、有序的标记，不手改生成区。
- 修改论文、人物主页或别名、站主 `profile.name` / `nameZh`，或共享渲染器后，先 `npm run sync`，再 `npm run check`，将配置和生成后的论文 HTML 一起提交。同步无依赖、不编译或打包站点；不要把生成 HTML 当作第二份内容来源。
- 检查器只读执行共享渲染器并比较静态生成区，过期时失败，不自动改文件；GitHub Actions 也只运行检查，不替维护者执行同步。禁用 JavaScript 时使用已提交的静态列表与锚点，启用时 `app.js` 调用同一渲染器刷新它们。

### 排版、吸顶导航与侧栏

- 保持原生静态实现。加载本地 Source Serif 4、Manrope、Noto Sans SC 子集，正体字重分别声明 200–900、400–700、400–600，均使用 `font-display: swap`；Source Serif 4 使用 `font-optical-sizing: auto`。Manrope / Noto 的范围沿用参考包 CSS，不代表已核实二进制轴。三页按目录深度预加载这三份 WOFF2；Source Sans 3 保留但不加载。来源与许可证见 [assets/fonts/README.md](assets/fonts/README.md)。
- Source Serif 4 用于英文姓名、SH 标记、首页栏目标题、内页大标题及论文年份；正文、导航和论文标题使用 Manrope。中文使用 Noto Sans SC 子集，保留苹方、微软雅黑等系统回退，新增中文后检查缺字、混排与换行。常规姓名英文 39px / 500、中文 19px 另起一行；About Me 与内页标题 44px，普通首页栏目标题 29px，Service / Contact 26px。英文简介 17px、行高 1.95；中文 15px、行高 2、上间距 23px；加粗文字保持深色。身份文字常规 14px，高度不超过 700px 的桌面及手机内页为 13px；单位英文 14px、中文 13px，联系入口 14px，窄屏不降低这三项字号。首页发表概述 16px、行高 1.9。论文标题 18px / 600、行高 1.6；普通作者 14px / 400、行高 1.85。其他窄屏字号以 CSS 为准。
- `:root` 颜色：背景与面板 `#ffffff`，正文 `#202a35`，标题 `#18222d`，阅读文字 `#3d4854`，venue 全称与年份 `#4b5865`，辅助信息 `#5d6873`，链接 `#245d86`，分隔线 `#dce1e5`，浅线 `#e9edf0`，venue 标签底色 `#f2f6f8`。`.bio-zh`、`.publication-summary`、`.paper-authors`、`.award-detail` 使用 `--reading-text`，`.paper-venue` 使用 `--venue-text`。增强对比度下阅读文字为 `#202a35`、辅助信息与 venue 为 `#35414d`，边线加深；打印时辅助信息与 venue 为 `#4b5865`。三页 `theme-color` 为白色。
- 常规容器最大宽 1080px、两侧至少各 44px 留白，侧栏 246px、间距 64px；1099px 以下为 224px / 40px，880px 以下为 200px / 30px。正文顶部由 `--content-top` 控制：常规 32px，880px 以下桌面 28px，高度不超过 840px / 700px 的桌面分别为 24px / 20px，手机 44px。资料区距展开导航的间距由独立的 `--profile-gap` 控制：对应为 64px、48px、44px / 34px、44px；修改时不要将资料与正文顶部重新绑定。资料区常规右内边距 30px，1099px 及以下为 16px，高度不超过 700px 的桌面另设为 18px；右侧保留 1px 竖线。`.home-panel`、`.publications-heading`、`.awards-heading` 顶部不画横线；首页栏目常规内边距 28px 0 32px、细线分隔，首栏目上内边距为 0，论文及获奖页标题区也不额外添加上内边距。1099px 以上 Publications 入口在概述右侧，Service / Contact 为 205px 标题列加内容列；其余宽度纵向排列。
- 导航 `position: fixed; inset: 0 0 auto`，页顶白色实底加浅底线；body 始终以展开高度占位，打印时清除。880px 以上 header 与正文共用两列网格，SH 在左列起点，导航在右侧正文列居中；880px 以下为两端排列 flex，680px 以下导航 `flex: 1`，530px 以下隐藏 SH、导航四列。常规字号 16px / 500，530px 以下 14px，350px 以下 13px。链接至少 44px 高，当前、悬停和聚焦项用蓝字及 `a::after` 的 1px 下划线，不用卡片背景或阴影。
- 可见导航常规 72px → 52px，手机及高度不超过 700px 的桌面为 64px → 48px。`.is-compact` 只改变 `--nav-height`，背景与内部容器高度过渡 180ms；横向位置、字号和 44px 点击高度不变。蓝灰版的 `--nav-padding` / `--nav-item-inset` 及按钮卡片收缩规则已移除。`.is-scrolled` 在滚动超过 1px 后加深底线；支持滤镜时背景为 `rgb(255 255 255 / 72%)`，使用 `blur(14px) saturate(110%)`，文字不透明。滚动状态普通导航文字使用 `--reading-text`，悬停、聚焦及当前项使用更深的蓝色 `#1f5075`，保持透明背景下的可读性。页顶、不支持滤镜、减少透明度或增强对比度时为实色；后两种偏好关闭模糊，减少动态偏好关闭平滑滚动和过渡。
- `app.js` 滚动逻辑不变：被动 scroll 监听与 requestAnimationFrame 更新状态，超过 28px 收窄，顶部 1px 内展开，中间区间保持当前状态，上滚不自动展开；合法滚动范围过滤回弹。初始化、resize、pageshow 清除待执行帧，按位置是否超过 1px 同步紧凑与边界状态。键盘聚焦不改变高度；侧栏没有滚动跟随脚本。
- 主导航按路径和 URL 锚点同步：`#service` 高亮 Service，首页其他情况高亮 Home，旧 `#contact` 仍定位邮箱区；论文页及年份锚点高亮 Publications，获奖页高亮 Awards。初始化、hashchange、pageshow 更新，不随手动滚动切换。仅当前项有 `aria-current`，页面为 page、栏目为 location。年份仍用原生锚点，脚本只更新 aria-current；无锚点选首年、匹配年份选对应项、其他锚点不选中，不拦截滚动或历史。
- 锚点偏移为展开导航高度加 20px：常规 92px、手机及短桌面 84px。桌面资料 sticky top 为展开高度加 `--profile-gap`：常规 136px，880px 以下普通桌面 120px；高度不超过 840px 的桌面为 116px，不超过 700px 时为 98px。资料区使用 `margin-top: calc(var(--profile-gap) - var(--content-top))`，使初始位置与 sticky 位置一致，右侧主标题可以更靠近导航。上下滚动不主动改偏移，不加负值、max-height 或独立滚动。页脚在右侧第二行，侧栏跨正文与页脚两行，受布局容器边界约束。
- 当前头像原文件与自然比例不变，常规宽 122px、圆角 3px、留白 4px；880px 以下桌面为 106px。681px 以上且高度不超过 840px 时头像 94px、正文顶部间距 24px、资料间距 44px；高度不超过 700px 时头像 54px 与姓名并排、正文间距 20px、资料间距 34px，仍浮动。极矮窗口不保证全部资料同时可见，不以嵌套滚动处理。
- 680px 以下资料恢复普通文档流、无右边线，清除桌面上外边距；正文与资料顶部间距均为 44px，因此初始资料 top 为 108px。首页 84px 头像配姓名身份，保留完整单位及联系，资料区底部内边距 18px、外边距为 0；论文与获奖页共用 `:is(.publications-page, .awards-page)`，使用 54px 头像、可回首页的姓名身份，隐藏完整单位和联系方式，资料区底部内边距 24px。更窄尺寸见 CSS。打印时取消浮动并清除资料外边距，隐藏导航与年份栏，恢复内页完整资料。
- 论文保留共享渲染器与数据。880px 以上分组为 62px 年份左列、24px 间距加正文列，880px 以下年份在组上方接细线。列表无卡片外框或阴影，同组条目间用浅线，每条底部内边距 4px（组内末条为 0），下一条上内边距 14px；不同年份组上外间距 22px、上内边距 18px，880px 以下取消组上内边距与上边线。所有宽度资源入口均在文字下方横排，`.paper-links` 上内边距 2px，链接使用 14px 字号、1.6 行高、`inline-block` 和内边距 `14px 0 8px`，保留至少 44px 点击高度（当前约 44.4px）；键盘焦点外框偏移为 2px，避免紧凑间距下跨过分隔线。普通作者 `#3d4854`，作者链接继承同色与浅下划线，悬停/聚焦变蓝；Shen Hu 为 700 字重。venue 全称与年份 14px / 400、行高 1.8、`#4b5865`，缩写为 12px 的淡底细边框标签。
- 奖项以细线分隔。880px 以上左侧为双语竞赛/机构及补充说明，右侧为奖项结果；常规右列 180px、间距 32px，1099px 以下为 160px / 24px，880px 以下纵向排列且奖项结果左侧加细强调线。配置顺序、中英文与无年份约定不变。
- 保留 Skip to content、可见焦点、入口至少 44px 点击高度及辅助显示偏好。View publications（17px）、Scholar、Paper/PDF 为文字入口，文字与箭头在同一内联流，下划线连续，不用 flex gap 或独立箭头盒割断。单位与联系入口之间仅保留留白，`.profile-links` 不设上边线。资料链接本体为 flex、4px 圆角、左右 8px 内边距及 -8px 外边距，列表项上下各 2px；左侧 SVG，label 为 `flex: 1; min-width: 0`，箭头为直接子级、固定 14px、无前置空格、`aria-hidden="true"`。悬停/聚焦文字及图标变蓝，仅 label 显示 1px 下划线与 3px 偏移，无背景色。邮箱同样带箭头、使用 mailto 且不开新窗口。880px 以下及打印隐藏箭头且不占列宽，手机双列间距 20px；所有静态回退与动态结构一致。

## 工作与验证流程

1. 先读 `git branch --show-current`、`git status --short` 和相关 diff，识别当前分支与用户已有改动。白底方案继续在 `codex/white-ui-redesign` 迭代，不因日常默认分支约定而自动切到 `main`；仅维护已上线版本时使用 `main`。工作区干净且任务需要同步正式分支时，可用 `git switch main` 和 `git pull --ff-only origin main`；存在未提交改动时先保留并判断归属，不为切换或同步而自动丢弃、覆盖或暂存到 stash。其他需要隔离的实验仍可使用 `codex/` 分支，正式发布必须先合入 `main`。限定编辑范围，不回退无关修改。并行协作明确各自文件；负例测试使用内存或临时副本，不临时改写正在预览的真实配置文件。
2. 阅读实际代码与配置后实现需求。维护原生静态结构、相对路径和共用配置，避免为小改动引入依赖或构建工具。
3. 论文、人物配置、站主姓名或共享论文渲染器变更后，先运行 `npm run sync`，再运行 `npm run check` 和 `git diff --check`；其他改动直接检查。生成的 `publications/index.html` 属于本次交付。检查报错需解决；不要把未执行或失败的检查写成通过。
4. 页面、交互或渲染变更后用本地预览核对相关页面。检查白色背景、衬线标题与无衬线正文、竖线及栏目分隔、论文年份左右列/上下排列、奖项左右列/纵向排列，以及长文本换行和横向溢出。核对三份字体及预加载路径、中文子集回退。导航保持 Home、Publications、Awards、Service 四项，桌面在右侧正文列居中；检查当前项、旧 `#contact` 的 Home 高亮、年份锚点与禁用 JavaScript 时完整论文列表。奖项变更核对动态/静态双语内容、配置顺序、官方链接且不显示年份。导航 top 始终为 0，超过 28px 收窄，上滚保持，1px 内展开，中间区间保持；初始化、resize、pageshow 按当前位置同步，body 占位避免正文上跳，44px 点击高度与可见焦点不变。滚动后底线加深和轻微磨砂，顶部/不支持滤镜/减少透明度/增强对比度时实色回退。核对桌面侧栏位置稳定、页尾边界、短窗口紧凑布局且无独立滚动；资料链接箭头同列对齐，悬停无底色、文字与图标变蓝且仅 label 下划线，动态/静态结构一致，窄屏箭头隐藏且不占列宽。手机首页完整资料，内页短身份区，双列入口点击区不重叠。按影响验证人物别名、Paper/PDF、键盘、打印与辅助显示偏好。仅改文档时核对命令、路径和代码事实，无需重复截图。
5. **在本轮完成前同步维护下节列出的文档。文档同步是完成条件，不留待用户提醒或下一轮处理。**
6. 最后说明完成内容、验证结果、相关文档更新和是否已提交/推送。按用户已有授权执行提交、推送或发布；仅要求修改文件时不自动提交或推送，仅要求步骤时提供命令。发布前核对当前分支为 `main`，只暂存本次任务相关文件并检查暂存差异；推送 `main` 会更新线上站点，部署结果需在 Actions 确认。

离线检查会在 Node.js 中执行共享论文渲染器，比较静态生成区，并检查奖项数组、已写入 HTML 的年份锚点和引用；它不修改文件、不访问外部网址，也不启动浏览器。它可解析 HTML 内静态 JSON-LD，但不执行 `app.js` 生成动态 DOM/JSON-LD，也不做完整论文字段校验。通过检查不能证明外部链接可访问、浏览器内锚点交互与布局正确或 GitHub 部署成功。这些需按改动范围分别验证。

## 文档同步规则

- **每次新需求或修改后，主动检查 README、MAINTENANCE、AGENTS、SOURCE_NOTES 是否受影响，并在同一轮直接更新相关文件。**
- 用户改变设计取向、交互规则、配置约定、架构、工作流程或部署方式：更新本文件对应段落，覆盖过时说明，以当前约定为准。
- 改变配置字段、内容更新方式、排版规则、文件结构、检查方式或部署步骤：同步 MAINTENANCE 的详细说明和例子。README 只保留简短项目介绍、预览、常用命令与文档链接；这些入口信息变化时同步更新，不将详细手册重新堆回 README。
- 新增或修正学术事实、人物来源、论文状态，或存在来源冲突及取舍：更新 SOURCE_NOTES；只改样式通常无需改来源笔记。
- 普通数据更新若没有改变使用方式，不必把整份论文数据或配置复制进 README、MAINTENANCE 或 AGENTS。来源笔记保留可追溯依据，运行时配置仍是展示内容的依据。
- 文档应是可直接接手的当前说明，不堆叠聊天记录、失效待办、临时端口/PID或重复长篇变更日志。文档无需变化时，在交付说明中简述已检查、为何无需更新。
- 不依赖某个工具的私人记忆。支持自动读取 `AGENTS.md` 的工具可直接使用；其他工具需由用户在任务开头显式要求先读取此文件和 README，并按任务需要查阅 MAINTENANCE。不能承诺所有工具都会自动发现或遵守它。

## 本地预览和部署注意点

- `npm run dev` 启动 4173 端口预览，展示当前工作目录，端口不固定对应某个版本。当前白底方案在 `codex/white-ui-redesign` 预览；正式站由 `main` 发布，蓝灰版与极简版分别保存在 `codex/blue-ui-backup`、`codex/minimal-backup`。不复制第二套 HTML 或增加运行时版本开关。只读比较可用 `git show codex/blue-ui-backup:styles.css`；切换预览前先妥善保存改动并确认工作区干净，查看后返回原工作分支，不在备份分支提交。网页改动后刷新，服务器脚本改动由 Node watch 重启；端口占用时确认已有进程属于本项目，不结束未知进程。
- 已运行的旧版非 watch 进程可能仍使用旧文件白名单；新增配置或页面出现 404 时，检查是否需要由原终端 Ctrl+C 后重新启动。
- 内容页面使用 `目录名/index.html`，站内导航链接到 `目录名/`；根首页使用 `/` 对应的相对路径。这依赖静态目录默认首页，不需要 GitHub 设置开关或后端 rewrite。共享 `app.js` 将显式的 `/index.html` 地址规范为所在目录，并保留查询参数和锚点。
- 兼容旧地址：根 `publications.html` 仅作为跳转页保留，JavaScript 跳转到 `publications/` 并保留查询参数和锚点，另有 meta 刷新和手动链接回退。不要把内容写回跳转页；检查器应将兼容页与真实内容页分别处理。
- 所有 HTML 本地引用按目录深度使用相对路径：根首页使用 `./`，`publications/index.html` 和 `awards/index.html` 使用 `../` 引用根脚本、样式和 assets，兼容用户站点根路径与项目站点子目录。[MAINTENANCE.md](MAINTENANCE.md) 提供子目录预览命令。
- `data.js` 中的相对资源地址始终相对于站点根目录；`app.js` 从自身脚本 URL 定位站点根目录并解析这些地址，不能改成相对于当前页面解析。不要设置 `<base>` 标签，避免 `#year-年份` 等页内锚点跳到站点首页。
- 新增要发布的目录页或文件，检查并同步 HTML 引用、`scripts/serve.mjs` 的 `allowed` 和 Pages 工作流复制清单。检查器中，新内容页以 `目录名/index.html` 加入 `contentPages`，兼容跳转页加入 `redirectPages`；两者合并成 `pageFiles`，其首级目录自动进入 `staticFiles`，其他根目录资源需单独加入。页面目录保留结构复制；`publications/`、`awards/` 与 `assets/` 各自复制。
- `publication-renderer.js` 是浏览器运行时资源，已进入预览、离线检查和 Pages 复制白名单；`scripts/sync-publications.mjs` 仅用于本地维护，不发布。保持这一区分，不依赖线上运行同步脚本。
- 站点仅部署白名单中的页面、脚本、样式和 `assets/` 等静态资源。根 README、MAINTENANCE、AGENTS、SOURCE_NOTES 和开发脚本不进入站点产物；`assets/fonts/` 中的字体来源与许可证随字体发布。若 GitHub 仓库公开，仓库内的说明文件仍可被读到。
- 白底方案先在 `codex/white-ui-redesign` 完成检查与提交，用户确认采用后合入 `main`，复查并按授权推送；直接 `git push origin main` 不会把另一分支的改动自动带入。后续日常发布仍为在 `main` 修改 → 同步与检查 → 提交相关文件 → `git push origin main`。工作流 push 仅监听 `main`，自动运行 `Deploy academic homepage`，无需重复 Run workflow；Pages Source 应为 GitHub Actions。其他分支推送不会自动部署，也不从预览或备份分支手动运行发布工作流。push 成功不等于部署成功，发布后查看对应提交的 Actions 结果；详见 [MAINTENANCE.md](MAINTENANCE.md)。
- 不使用强制推送或通过删除历史来解决同步问题。推送失败时先查看错误、远端状态与用户未提交内容，再选择保留改动的处理方式。
